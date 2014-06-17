var fs = require("fs");
var argv = require("argv");
var merge = require("merge");
var express = require("express");
var csv = require("csv-string");

// parse command line arguments
var argvOptions = argv.option([
	{
		"name": "port",
		"short": "p",
		"type": "int",
		"description": "defines port for frontend"
	},
	{
		"name": "script",
		"short": "s",
		"type": "path",
		"description": "path to data-transform script file (JS)"
	},
	{
		"name": "data",
		"short": "d",
		"type": "path",
		"description": "path to data file (JSON or CSV)"
	}
]).run();

var options = merge({
	"port": 3000,
	"script": null,
	"data": null
}, argvOptions.options);

if (options.script === null || options.data === null) {
	argv.help();
	process.exit(1);
}

// configure express and sockets
var app = express();
var server = app.listen(options.port);
var io = require("socket.io")(server);

// serve static files from /public
app.use(express.static(__dirname + "/public"));

// transform data
var transformData = function(path, data, callback) {
	if (path.match(/\.js$/)) {
		callback(data);
	}
	else if (path.match(/\.json$/)) {
		callback(data);
	}
	else if (path.match(/\.csv$/)) {
		callback(json.stringify(csv.parse(data)));
	}
	else {
		console.error("can't parse " + path);
		callback(null);
	}
};

// watch file and emit on changes
var watchEndEmit = function(name, socket, path) {
	var sendContent = function(name, socket, path) {
		fs.readFile(path, { "encoding" : "utf8" }, function(error, data) {
			if (error) {
				console.error(error);
			}
			else {
				transformData(path, data, function(transformed) {
					console.log(path + " changed, emitting...");
					socket.emit(name, transformed);
				});
			}
		});
	};

	// send on start
	sendContent(name, socket, path);

	// return FS.watcher on given path
	return fs.watch(path, function() { sendContent(name, socket, path); });
};

io.on("connection", function(socket) {
	var scriptWatch = watchEndEmit("script", socket, options.script);
	var dataWatch = watchEndEmit("data", socket, options.data);

	socket.on("disconnect", function() {
		scriptWatch.close();
		dataWatch.close();
	});
});

