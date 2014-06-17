var React = require("react");
var d3 = require("d3");

var Chart = function(props) {
	var margin = {
		"left": 100,
		"right": 20,
		"top": 20,
		"bottom": 100
	};

	var fieldX = "x";
	var fieldY = "y";

	var reduceForOrdinalScale = function(data, field) {
		return data.reduce(function(memo, object) {
			if (memo.indexOf(object[field]) < 0) {
				memo.push(object[field]);
			}
			return memo;
		}, []);
	};

	var domainX = reduceForOrdinalScale(props.data, fieldX);
	var domainY = reduceForOrdinalScale(props.data, fieldY);

	var scaleX = d3.scale.ordinal()
		.rangeBands([ margin.left, props.width - margin.right ])
		.domain(domainX);

	var scaleY = d3.scale.ordinal()
		.rangeBands([ props.height - margin.bottom, margin.top ])
		.domain(domainY);

	var axisX = d3.svg.axis()
		.scale(scaleX)
		.orient("bottom");

	var axisY = d3.svg.axis()
		.scale(scaleY)
		.orient("left");

	// function for point update / create
	var updatePoint = function(point) {
		point
			.attr("cx", function(d) {
				return scaleX(d[fieldX]);
			})
			.attr("cy", function(d) {
				return scaleY(d[fieldY]);
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
			.call(axisX)
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-0.8em")
			.attr("dy", "0.1em")
			.attr("transform", "rotate(-90)");

		svg
			.append("g")
			.attr("class", "axis-y")
			.attr("transform", "translate(" + margin.left + ",0)")
			.call(axisY);

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

var ScatterPlot = React.createClass({
	defaultWidth: 1100,
	defaultHeight: 640,

	updateChart: function(props) {
		var chartProps = props || this.props;

		chartProps.width = chartProps.width || this.defaultWidth;
		chartProps.height = chartProps.height || this.defaultHeight;

		d3.select(this.getDOMNode())
			.call(Chart(chartProps));
	},

	render: function() {
		return React.DOM.svg({
			"className": "scatter-plot",
			"height": this.props.height || this.defaultHeight,
			"width": this.props.width || this.defaultWidth
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

module.exports = ScatterPlot;
