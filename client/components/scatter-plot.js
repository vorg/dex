var React = require("react");
var d3 = require("d3");
var Chart = require("./chart");
var autoScale = require("./chart-utils").autoScale;

// adjust points to align with axis when scale is ordinal
var adjustPointPosition = function(scale, orient, margin, size) {
	var value = 0;

	if (scale.type === "ordinal") {
		var numDomain = scale.scale.domain().length;
		var scaleSize = 0;

		if (orient === "bottom") {
			scaleSize = size.width - margin.left - margin.right;
		}
		else {
			scaleSize = size.height - margin.top - margin.bottom;
		}

		value = scaleSize / numDomain / 2;
	}

	return value;
};

// main chart function
var D3Chart = function(props) {
	var margin = { "left": 100, "right": 20, "top": 20, "bottom": 200 };
	var size = { "width": props.width, "height": props.height };
	var fieldX = "x";
	var fieldY = "y";

	var autoScaleX = autoScale(props.data, fieldX, "bottom", margin, size);
	var autoScaleY = autoScale(props.data, fieldY, "left", margin, size);

	// function for point update / create
	var updatePoint = function(point) {
		point
			.attr("cx", function(d) {
				var position = autoScaleX.scale(d[fieldX]);
				var adjust = adjustPointPosition(autoScaleX, "bottom", margin, size);

				return position + adjust;
			})
			.attr("cy", function(d) {
				var position = autoScaleY.scale(d[fieldY]);
				var adjust = adjustPointPosition(autoScaleY, "left", margin, size);

				return position + adjust;
			})
			.attr("r", 4);
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
			.attr("dy", "-0.3em")
			.attr("transform", "rotate(-90)");

		svg
			.append("g")
			.attr("class", "axis-y")
			.attr("transform", "translate(" + margin.left + ",0)")
			.call(autoScaleY.axis);

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

		points
			.exit()
			.transition()
			.remove();
	};
};

module.exports = React.createClass({
	render: function() {
		return Chart({
			"className": "scatter-plot",
			"chartFunc": D3Chart,
			"data": this.props.data
		});
	}
});
