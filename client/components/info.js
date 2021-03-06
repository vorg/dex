var React = require("react");
var moment = require("moment");
var arrayType = require("../utils").arrayType;

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

// calculate and display stats for dates
var DateStats = React.createClass({
	calculateStats: function(data) {
		// calculate dates span
		var stats = data.reduce(function(memo, date) {
			if (date < memo.min) { memo.min = date; }
			if (date > memo.max) { memo.max = date; }

			return memo;
		}, {
			"min": Infinity,
			"max": -Infinity
		});

		// build duration string
		var duration = moment.duration(stats.max - stats.min);
		stats.duration = "";

		if (duration.asYears() > 1)  { stats.duration += duration.years() + "y "; }
		if (duration.asMonths() > 1) { stats.duration += duration.months() + "m "; }
		if (duration.asDays > 1)     { stats.duration += duration.days() + "d "; }

		stats.duration += duration.hours() + "h ";
		stats.duration += duration.minutes() + "m ";
		stats.duration += duration.seconds() + "s";

		// nice dates
		[ "min", "max" ].forEach(function(key) {
			stats[key] = moment(stats[key]).format("DD/MM/YYYY HH:mm:ss");
		});

		return stats;
	},

	render: function() {
		var stats = this.calculateStats(this.props.data);

		return React.DOM.div(
			null,
			[ "min", "max", "duration" ].map(function(key) {
				return React.DOM.div(
					null,
					key + ": ",
					React.DOM.b(null, stats[key])
				);
			})
		);
	}
});

// displayes error on inconsistent types
var DisplayTypeError = React.createClass({
	render: function() {
		return React.DOM.div(
			{ "className": "error" },
			"Inconsistent/Unknown types in array!"
		);
	}
});

// main react class
var DisplayInfo = React.createClass({
	render: function() {
		var dataType = arrayType(this.props.data);
		var content = null;

		var typesMap = {
			"Number": NumberStats,
			"String": StringStats,
			"Date": DateStats
		};

		if (typesMap[dataType]) {
			content = typesMap[dataType]({ "data": this.props.data });
		}
		else {
			content = DisplayTypeError();
		}

		return React.DOM.div(null, content);
	}
});

module.exports = DisplayInfo;
