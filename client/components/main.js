/*global document */

var React = require("react");
var TabSwitcher = require("./tabs").TabSwitcher;
var TabContent = require("./tabs").TabContent;
var JSON = require("./json");
var GeoChart = require("./geo");

// basic Tabs class
var Tabs = React.createClass({
	getInitialState: function() {
		return {
			"activeTab": 0,
			"tabs": [
				{ "id": 0, "title": "JSON", "content": JSON },
				{ "id": 1, "title": "Geo", "content": GeoChart }
			]
		};
	},

	onTabClick: function(tab) {
		this.setState({ "activeTab": tab.id });
	},

	render: function() {
		return React.DOM.div(
			null,
			TabSwitcher({
				"tabs": this.state.tabs,
				"activeTab": this.state.activeTab,
				"onTabClick": this.onTabClick
			}),
			TabContent({
				"content": this.state.tabs[this.state.activeTab].content({ "data": this.props.data })
			})
		);
	}
});

module.exports = function(data) {
	React.renderComponent(Tabs({ "data": data }), document.body);
};
