/*global document */

var React = require("react/addons");
var type = require("./../utils").type;
var DisplayJSON; // will be redefined later

var DisplayKey = React.createClass({
	render: function() {
		var classes = React.addons.classSet({
			"key": true,
			"key-inline": this.props.inline
		});

		var keyName = this.props.keyName || "";
		if (keyName.length > 0 && this.props.inline) { keyName += ": "; }

		return React.DOM.div(
			{ "className": classes },
			keyName
		);
	}
});

var DisplayVariable = React.createClass({
	render: function() {
		return React.DOM.div(
			{ "className": this.props.type },
			this.props.value
		);
	}
});

var DisplayArray = React.createClass({
	render: function() {
		return React.DOM.div(
			{ "className": "array", },
			"[",
			this.props.data.map(function(data) { return DisplayJSON({ "data": data }); }),
			"]"
		);
	}
});

DisplayJSON = React.createClass({
	render: function() {
		var children = [];
		var typeName = type(this.props.data);
		var data = this.props.data;

		switch (typeName) {
			case "Object":
				var key;
				children = [];

				for (key in data) {
					if (data.hasOwnProperty(key)) {
						children.push(DisplayJSON({
							"data": data[key],
							"keyName": key
						}));
					}
				}
				break;

			case "Array":
				children.push(DisplayArray({
					"data": data,
					"keyName": this.props.keyName
				}));
				break;

			default:
				if (typeName === "Boolean") {
					data = data ? "true" : "false";
				}

				children.push(DisplayVariable({
					"type": typeName.toLowerCase(),
					"value": data,
					"keyName": this.props.keyName
				}));
				break;
		}

		return React.DOM.div(
			{ "className": "json" },
			DisplayKey({ "keyName": this.props.keyName, "inline": (children.length === 1) }),
			children
		);
	}
});

module.exports = DisplayJSON;
