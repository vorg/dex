/*global document */

var React = require("react");

module.exports = function(view, dom) {
	console.log("rendering", view);
	React.renderComponent(view, dom || document.getElementById("content"));
};
