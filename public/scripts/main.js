/*global io */

var socket = io();
var global = { "data": null, "visualize": null };

var debounce = function(func, time) {
	var timeout;

	return function() {
		var args = arguments;

		clearTimeout(timeout);

		timeout = setTimeout(function() {
			timeout = null;
			func.apply(this, args);
		}.bind(this), time);
	};
};

// debounced data visualization
var visualizeData = debounce(function() {
	if (global.data && global.visualize) {
		var results = global.visualize(global.data);
		console.log("results", results);
	}
}, 100);

// ugly script eval
socket.on("script", function(data) {
	// "data"[1] is argument name for Function from string data[2] received through socket
	global.visualize = new Function("data", data);

	visualizeData();
});

// deserialize data
socket.on("data", function(data) {
	global.data = JSON.parse(data);

	visualizeData();
});
