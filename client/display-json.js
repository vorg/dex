/*global document */

var React = require("react");

var DisplayElement = React.createClass({
	render: function() {
		return React.DOM.div({ className: "element" }, this.props.data);
	}
});

var DisplayArray = React.createClass({
	render: function() {
		return React.DOM.div({
			className: "array",
			children: this.props.data.map(function(data) {
				return DisplayElement({ "data": data });
			})
		});
	}
});

var renderJSON = function(data) {
	React.renderComponent(DisplayArray({ "data": data }), document.getElementById("content"));
};

module.exports = renderJSON;
