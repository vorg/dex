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
			memo.sum += value;

			return memo;
		}, {
			"min": Infinity,
			"max": -Infinity,
			"count": 0,
			"sum": 0
		});

		stats.avg = stats.sum / stats.count;

		return stats;
	},

	render: function() {
		var stats = this.calculateStats(this.props.data);

		return React.DOM.div(
			null,
			[ "min", "max", "avg", "sum", "count" ].map(function(key) {
				return React.DOM.div(
					null,
					key + ": ",
					React.DOM.b(null, stats[key])
				);
			})
		);
	}
});

// calculate and display string statistics
var StringStats = React.createClass({
	calculateStats: function(data) {
		var wordCount = data.reduce(function(memo, word) {
			if (memo[word]) { memo[word]++; }
			else { memo[word] = 1; }
			return memo;
		}, {});

		var key, stats = { "counts": [] };
		for (key in wordCount) {
			if (wordCount.hasOwnProperty(key)) {
				stats.counts.push({ "word": key, "count": wordCount[key] });
			}
		}

		stats.counts = stats.counts.sort(function(a, b) {
			var sort = 0;
			if (a.count > b.count) { sort = -1; }
			if (a.count < b.count) { sort = 1; }

			return sort;
		});

		return stats;
	},

	render: function() {
		var stats = this.calculateStats(this.props.data);

		return React.DOM.div(
			null,
			stats.counts.map(function(object) {
				return React.DOM.div(
					null,
					object.word + ": ",
					React.DOM.b(null, object.count)
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
			"Number": NumberStats,
			"String": StringStats
		};

		if (typesMap[dataType]) { content = typesMap[dataType]({ "data": this.props.data }); }

		return React.DOM.div(null, content);
	}
});

module.exports = DisplayInfo;
