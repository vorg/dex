var fs = require("fs");
var express = require("express");
var app = express();
var server = app.listen(3000);
var io = require("socket.io")(server);
var CSV = require("csv-string");

// server static files (index.html) from ./public/
app.use(express.static(__dirname + "/public"));

if (process.argv.length !== 4) {
	console.log("paramaters: [data-processing-script.js] [data-file.json]");
	process.exit(1);
}

var scriptFile = process.argv[2];
var dataFile = process.argv[3];

var transformData = function(path, data, callback) {
	if (path.match(/\.js$/)) {
		callback(data);
	}
	else if (path.match(/\.json$/)) {
		callback(data);
	}
	else if (path.match(/\.csv$/)) {
		callback(JSON.stringify(CSV.parse(data)));
	}
	else {
		console.error("can't parse " + path);
		callback(null);
	}
};

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
	console.log("connected");

	var scriptWatch = watchEndEmit("script", socket, __dirname + "/" + scriptFile);
	var dataWatch = watchEndEmit("data", socket, __dirname + "/" + dataFile);

	socket.on("disconnect", function() {
		console.log("disconnected");

		scriptWatch.close();
		dataWatch.close();
	});
});

