/*global document */

var React = require("react");

module.exports = function(view, dom) {
	React.renderComponent(view, dom || document.body);
};
