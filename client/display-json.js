/*global document */

var React = require("react");
var type = require("./utils").type;

var DisplayKey = React.createClass({
	render: function() {
		return React.DOM.div({ "className": "key" }, this.props.keyName + ": ");
	}
});

var DisplayVariable = React.createClass({
	render: function() {
		return React.DOM.div(
			{ "className": this.props.type },
			this.props.keyName ? DisplayKey({ "keyName": this.props.keyName }) : null,
			this.props.value
		);
	}
});

var DisplayArray = React.createClass({
	render: function() {
		return React.DOM.div({ "className": "array", },
			this.props.keyName ? DisplayKey({ "keyName": this.props.keyName }) : null,
			"[",
			this.props.data.map(function(data) { return DisplayJSON({ "data": data }); }),
			"]"
		);
	}
});

var DisplayJSON = React.createClass({
	render: function() {
		var children = null;
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
				children = DisplayArray({
					"data": data,
					"keyName": this.props.keyName
				});
				break;

			default:
				if (typeName === "Boolean") {
					data = data ? "true" : "false";
				}

				children = DisplayVariable({
					"type": typeName.toLowerCase(),
					"value": data,
					"keyName": this.props.keyName
				});
				break;
		}

		return React.DOM.div({ "className": "json", "children": children });
	}
});

var renderJSON = function(data) {
	// React.renderComponent(DisplayArray({ "data": data }), document.getElementById("content"));
	React.renderComponent(DisplayJSON({ "data": data }), document.getElementById("content"));
};

module.exports = renderJSON;
