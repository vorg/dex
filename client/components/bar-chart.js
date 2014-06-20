var React = require("react");
var d3 = require("d3");
var Chart = require("./chart");
var autoScale = require("./chart-utils").autoScale;

// main chart function
var D3Chart = function(props) {
	var margin = { "left": 100, "right": 20, "top": 20, "bottom": 200, "bars": 1 };
	var size = { "width": props.width, "height": props.height };
	var fieldX = "x";
	var fieldY = "y";

	var autoScaleX = autoScale(props.data, fieldX, "bottom", margin, size);
	var autoScaleY = autoScale(props.data, fieldY, "left", margin, size);

	// function for point update / create
	var updateRect = function(rect) {
		rect
			.attr("x", function(d) {
				return autoScaleX.scale(d[fieldX]) + margin.bars;
			})
			.attr("y", function(d) {
				return autoScaleY.scale(d[fieldY]);
			})
			.attr("width", function() {
				return Math.max((size.width - margin.left - margin.right) / props.data.length - margin.bars * 2, 1);
			})
			.attr("height", function(d) {
				return size.height - margin.bottom - autoScaleY.scale(d[fieldY]);
			});
	};

	// return function for react component
	return function(svg) {
		svg.selectAll(".axis-x").remove();
		svg.selectAll(".axis-y").remove();

		svg
			.append("g")
			.attr("class", "axis-x")
			.attr("transform", "translate(0," + (props.height - margin.bottom) + ")")
			.call(autoScaleX.axis)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-0.8em")
			.attr("dy", "0.1em")
			.attr("transform", "rotate(-90)");

		svg
			.append("g")
			.attr("class", "axis-y")
			.attr("transform", "translate(" + margin.left + ",0)")
			.call(autoScaleY.axis);

		var points = svg.selectAll(".rect")
			.data(props.data);

		points
			.enter()
			.append("rect")
			.attr("class", "rect")
			.call(updateRect);

		points
			.transition()
			.call(updateRect);

		points
			.exit()
			.transition()
			.remove();
	};
};

module.exports = React.createClass({
	render: function() {
		return Chart({
			"className": "bar-chart",
			"chartFunc": D3Chart,
			"data": this.props.data
		});
	}
});
