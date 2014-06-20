var React = require("react");
var d3 = require("d3");

// default chart component
var Chart = React.createClass({
	defaultWidth: 1100,
	defaultHeight: 800,

	updateChart: function(props) {
		props = props || this.props;
		props.width = props.width || this.defaultWidth;
		props.height = props.height || this.defaultHeight;

		d3.select(this.getDOMNode())
			.call(this.props.chartFunc(props));
	},

	render: function() {
		return React.DOM.svg({
			"className": this.props.className || "",
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

module.exports = Chart;
