var d3 = require("d3");
var arrayType = require("./../utils").arrayType;
var prop = require("./../utils").prop;

var autoScale = function(data, field, orient, margin, size) {
	var scale, axis, domain, range;

	var dataType = arrayType(data.map(prop(field)));
	var isLinear = (dataType === "Number");
	var isOrdinal = (dataType === "String");
	var isTime = (dataType === "Date");

	// create proper scale
	if (isLinear) {
		domain = data.reduce(function(memo, object) {
			if (object[field] < memo[0]) { memo[0] = object[field]; }
			if (object[field] > memo[1]) { memo[1] = object[field]; }

			return memo;
		}, [ Infinity, -Infinity  ]);

		if (domain[0] > 0) { domain[0] = 0; }

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

	return { "scale": scale, "axis": axis, "type": isLinear ? "linear" : "ordinal" };
};

module.exports = {
	"autoScale": autoScale
};
