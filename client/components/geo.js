/*jslint todo: true */

var React = require("react");
var d3 = require("d3");

var Chart = function(props) {
	// function for point update / create
	var updatePoints = function(point) {
		// initial projection
		var projection = d3.geo.mercator()
			.scale(1)
			.translate([ 0, 0 ]);

		// create path
		var path = d3.geo.path().projection(projection);

		// proper object for calculating bounds
		var multiPoints = {
			"type": "MultiPoint",
			"coordinates": props.data.map(function(object) {
				return [ object.lat, object.lon ];
			})
		};

		// calculate bounds, scale and translation
		var bounds = path.bounds(multiPoints);
		var scale = 0.98 / Math.max(
			(bounds[1][0] - bounds[0][0]) / props.width,
			(bounds[1][1] - bounds[0][1]) / props.height
		);
		var translate = [
			(props.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
			(props.height - scale * (bounds[1][1] + bounds[0][1])) / 2
		];

		// update projection
		projection.scale(scale).translate(translate);

		// finally update point
		point
			.attr("transform", function(d) {
				return "translate(" + projection([ d.lat, d.lon ]) + ")";
			})
			.attr("r", 4);
	};

	// return function for react component
	return function(svg) {
		var points = svg.selectAll(".point")
			.data(props.data);

		points
			.enter()
			.append("circle")
			.attr("class", "point")
			.call(updatePoints);

		points
			.transition()
			.call(updatePoints);
	};
};

var GeoChart = React.createClass({
	updateChart: function(props) {
		var chartProps = props || this.props;
		console.log(chartProps);

		d3.select(this.getDOMNode())
			.call(Chart(chartProps));
	},

	render: function() {
		this.props.width = this.props.width || 1100;
		this.props.height = this.props.height || 640;

		return React.DOM.svg({
			"height": this.props.height,
			"width": this.props.width
		});
	},

	componentDidMount: function() {
		this.updateChart();
	},

	shouldComponentUpdate: function(props) {
		this.updateChart(props);

		// skip React render
		return false;
	}
});

module.exports = function(data) {
	return GeoChart({ "data": data });
};
