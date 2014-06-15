/*global document */

var React = require("react");
var type = require("./utils").type;

var DisplayVariable = React.createClass({
	render: function() {
		return React.DOM.div({ "className": this.props.type }, this.props.value);
	}
});

var DisplayArray = React.createClass({
	render: function() {
		return React.DOM.div({
			"className": "array",
			"children": this.props.data.map(function(data) {
				return DisplayJSON({ "data": data });
			})
		});
	}
});

var DisplayJSON = React.createClass({
	render: function() {
		var typeTraverse = {
			"Object": function(data) {
				var key, children = [];

				for (key in data) {
					if (data.hasOwnProperty(key)) {
						children.push(DisplayJSON({ "data": data[key] }));
					}
				}

				return children;
			},

			"Array": function(data) {
				return DisplayArray({ "data": data });
			},

			"String": function(data) {
				return DisplayVariable({ "type": "string", "value": data });
			},

			"Number": function(data) {
				return DisplayVariable({ "type": "number", "value": data });
			},

			"Boolean": function(data) {
				return DisplayVariable({ "type": "boolean", "value": data });
			}
		};

		var dataType = type(this.props.data);
		var children = typeTraverse[dataType](this.props.data);

		return React.DOM.div({
			"className": "json",
			"children": children
		});
	}
});

var renderJSON = function(data) {
	// React.renderComponent(DisplayArray({ "data": data }), document.getElementById("content"));
	React.renderComponent(DisplayJSON({ "data": data }), document.getElementById("content"));
};

module.exports = renderJSON;
