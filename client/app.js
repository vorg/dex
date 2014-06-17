var socket = require("socket.io-client")();
var utils = require("./utils");
var View = require("./components/main");

var global = { "data": null, "visualize": null };

// debounced data visualization
var visualizeData = utils.debounce(function() {
	if (global.data && global.visualize) {
		View(global.visualize(global.data));
	}
}, 100);

// ugly script eval
socket.on("script", function(data) {
	// "data"[1] is argument name for Function from string data[2] received through socket
	global.visualize = new Function("data", data);

	// visualize data on data-transform script change
	visualizeData();
});

// deserialize data
socket.on("data", function(data) {
	global.data = JSON.parse(data);

	// visualize data on data file change
	visualizeData();
});
