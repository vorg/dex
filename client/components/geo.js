var React = require("react");
var d3 = require("d3");

var Chart = function(data) {
	console.log("d3 will draw chart", data);
};

var GeoChart = React.createClass({
	updateChart: function() {
		d3.select(this.getDOMNode())
			.call(Chart(this.props.data));
	},

	render: function() {
		return React.DOM.svg({
			"height": this.props.height || 640
		});
	},

	componentDidMount: function() {
		this.updateChart();
	},

	shouldComponentUpdate: function() {
		this.updateChart();

		// skip React render
		return false;
	}
});

module.exports = function(data) {
	return GeoChart({ "data": data });
};
