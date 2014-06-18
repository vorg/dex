var React = require("react");
var d3 = require("d3");
var type = require("./../utils").type;

var autoScale = function(data, field, orient, margin, size) {
	var scale, axis, domain, range;

	// scale is linear if all values are numbers
	var isLinear = data.reduce(function(memo, object) {
		if (type(object[field]) !== "Number") { return false; }
		return memo;
	}, true);

	// create proper scale
	if (isLinear) {
		domain = data.reduce(function(memo, object) {
			if (object[field] < memo[0]) { memo[0] = object[field]; }
			if (object[field] > memo[1]) { memo[1] = object[field]; }

			return memo;
		}, [ Infinity, -Infinity  ]);

		scale = d3.scale.linear().domain(domain);
	}
	else {
		domain = data.reduce(function(memo, object) {
			if (memo.indexOf(object[field]) < 0) { memo.push(object[field]); }
			return memo;
		}, []);

		scale = d3.scale.ordinal().domain(domain);
	}

	// set ranges
	if (orient === "bottom") {
		range = [ margin.left, size.width - margin.right ];
	}
	else {
		range = [ size.height - margin.bottom, margin.top ];
	}

	if (isLinear) {
		scale.range(range);
	}
	else {
		scale.rangeBands(range);
	}

	// create axis
	axis = d3.svg.axis().scale(scale).orient(orient);

	return { "scale": scale, "axis": axis };
};

var Chart = function(props) {
	var margin = { "left": 100, "right": 20, "top": 20, "bottom": 100 };
	var fieldX = "x";
	var fieldY = "y";

	var autoScaleX = autoScale(props.data, fieldX, "bottom", margin, { "width": props.width, "height": props.height });
	var autoScaleY = autoScale(props.data, fieldY, "left", margin, { "width": props.width, "height": props.height });

	// function for point update / create
	var updatePoint = function(point) {
		point
			.attr("cx", function(d) { return autoScaleX.scale(d[fieldX]); })
			.attr("cy", function(d) { return autoScaleY.scale(d[fieldY]); })
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
			.attr("dy", "0.1em")
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
