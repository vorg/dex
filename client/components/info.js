var React = require("react");
var type = require("../utils").type;

// detects type of values inside array
var detectType = function(data) {
	var dataType = data.reduce(function(memo, value) {
		if (!memo) {
			memo = type(value);
		}
		else if (type(value) !== type(memo)) {
			memo = undefined;
		}

		return memo;
	}, null);

	if (dataType === undefined) {
		console.error("undefined type for data", data);
	}

	return dataType;
};

// calculate and display number statistics
var NumberStats = React.createClass({
	calculateStats: function(data) {
		var stats = data.reduce(function(memo, value) {
			if (value < memo.min) { memo.min = value; }
			if (value > memo.max) { memo.max = value; }
			memo.count++;
			memo.avg += value;

			return memo;
		}, {
			"min": Infinity,
			"max": -Infinity,
			"count": 0,
			"avg": 0
		});

		stats.avg /= stats.count;

		return stats;
	},

	render: function() {
		var stats = this.calculateStats(this.props.data);

		return React.DOM.div(
			null,
			[ "min", "max", "avg", "count" ].map(function(key) {
				return React.DOM.div(
					null,
					key + ": ",
					React.DOM.b(null, stats[key])
				);
			})
		);
	}
});


// main react class
var DisplayInfo = React.createClass({
	render: function() {
		var dataType = detectType(this.props.data);
		var content = null;

		var typesMap = {
			"Number": NumberStats
		};

		if (typesMap[dataType]) { content = typesMap[dataType]({ "data": this.props.data }); }

		return React.DOM.div(null, content);
	}
});

module.exports = DisplayInfo;
