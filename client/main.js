var socket = require("socket.io-client")();
var utils = require("./utils");

var components = {
	"main": require("./components/main"),
	"tabs": require("./components/tabs"),
	"json": require("./components/json")
};

var global = { "data": null, "visualize": null };

// debounced data visualization
var visualizeData = utils.debounce(function() {
	if (global.data && global.visualize) {
		var results = global.visualize(global.data);

		components.main(components.tabs({
			"tabs": [
				{ "title": "JSON", "content": components.json(results) },
				{ "title": "GEO", "content": "here be dragons (on map)" }
			]
		}));
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
