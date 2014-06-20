/*global document */

var React = require("react");
var Type = {
	"bar": require("./bar-chart"),
	"geo": require("./geo-chart"),
	"scatter": require("./scatter-plot"),
	"json": require("./json"),
	"info": require("./info")
};

var Wrapper = React.createClass({
	render: function() {
		var heading = null;

		if (this.props.title) {
			heading = React.DOM.div(
				{ "className": "panel-heading" },
				React.DOM.h3(
					{ "className": "panel-title" },
					this.props.title
				)
			);
		}

		return React.DOM.div(
			{ "className": "container main" },
			React.DOM.div(
				{ "className": "panel panel-default" },
				heading,
				React.DOM.div(
					{ "className": "panel-body" },
					this.props.content
				)
			)
		);
	}
});

var Main = React.createClass({
	render: function() {
		return React.DOM.div(
			null,
			this.props.data.map(function(object) {
				var content;

				if (Type[object.type]) {
					content = Type[object.type]({ "data": object.data });
				}
				else {
					content = React.DOM.div({ "className": "error" }, "Error! Unrecognized type: " + object.type);
				}

				return Wrapper({
					"content": content,
					"title": object.title || null
				});
			})
		);
	}
});

module.exports = function(data) {
	React.renderComponent(Main({ "data": data }), document.body);
};
