var React = require("react");
var d3 = require("d3");
var Chart = require("./chart");

var D3Chart = function(props) {
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

	// function for point update / create
	var updatePoint = function(point) {
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
			.call(updatePoint);

		points
			.transition()
			.call(updatePoint);
	};
};

module.exports = React.createClass({
	render: function() {
		return Chart({
			"className": "geo-chart",
			"chartFunc": D3Chart,
			"data": this.props.data
		});
	}
});
