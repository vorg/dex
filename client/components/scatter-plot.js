var React = require("react");
var d3 = require("d3");

var Chart = function(props) {
	// function for point update / create
	var updatePoint = function(point) {
		point
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
