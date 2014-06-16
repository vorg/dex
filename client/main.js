var socket = require("socket.io-client")();
var utils = require("./utils.js");

var displayJSON = require("./display-json.js");
var displayTabs = require("./tabs.js");

var global = { "data": null, "visualize": null };

// debounced data visualization
var visualizeData = utils.debounce(function() {
	if (global.data && global.visualize) {
		var results = global.visualize(global.data);

		// display resulting JSON data using react
		// displayJSON(results);
		//
		displayTabs([
			{ "title": "test1", "content": "1" },
			{ "title": "test2", "content": "2" }
		]);
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
