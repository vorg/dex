/*global document */

var React = require("react");
var JSON = require("./json");
var GeoChart = require("./geo-chart");
var ScatterPlot = require("./scatter-plot");

var Type = {
	"geo": GeoChart,
	"scatter": ScatterPlot,
	"json": JSON
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
				return Wrapper({
					"content": Type[object.type]({ "data": object.data }),
					"title": object.title || null
				});
			})
		);
	}
});

module.exports = function(data) {
	React.renderComponent(Main({ "data": data }), document.body);
};
