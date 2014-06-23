var d3 = require("d3");
var arrayType = require("./../utils").arrayType;
var prop = require("./../utils").prop;

var autoScale = function(data, field, orient, margin, size) {
	var scale, axis, range;
	var dataType = arrayType(data.map(prop(field)));

	// map array type to scale creation
	var typeMap = {
		"Number": function(data) {
			var domain = data.reduce(function(memo, object) {
				if (object[field] < memo[0]) { memo[0] = object[field]; }
				if (object[field] > memo[1]) { memo[1] = object[field]; }

				return memo;
			}, [ Infinity, -Infinity ]);

			if (domain[0] > 0) { domain[0] = 0; }

			return d3.scale.linear().domain(domain);
		},

		"String": function(data) {
			var domain = data.reduce(function(memo, object) {
				if (memo.indexOf(object[field]) < 0) { memo.push(object[field]); }
				return memo;
			}, []);

			return d3.scale.ordinal().domain(domain);
		},

		"Date": function(data) {
			var domain = data.reduce(function(memo, object) {
				if (object[field] < memo[0]) { memo[0] = object[field]; }
				if (object[field] > memo[1]) { memo[1] = object[field]; }

				return memo;
			}, [ Infinity, -Infinity ]);

			return d3.time.scale().domain(domain);
		}
	}

	// crate scale
	var scale = typeMap[dataType](data);

	// set ranges
	if (orient === "bottom") {
		range = [ margin.left, size.width - margin.right ];
	}
	else {
		range = [ size.height - margin.bottom, margin.top ];
	}

	// map array type to scale range
	var rangeMap = {
		"Number": function(scale, range) {
			return scale.range(range);
		},

		"String": function(scale, range) {
			return scale.rangeBands(range);
		},

		"Date": function(scale, range) {
			return scale.rangeRound(range);
		}
	}

	// add range to scale
	scale = rangeMap[dataType](scale, range);

	// create axis
	axis = d3.svg.axis().scale(scale).orient(orient);

	// nice scale type
	var typeMap = { "Number": "linear", "String": "ordinal", "Date": "time" };

	return {
		"scale": scale,
		"axis": axis,
		"type": typeMap[dataType]
	};
};

module.exports = {
	"autoScale": autoScale
};
