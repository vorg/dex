/*global document */

var React = require("react");

var TabContent = React.createClass({
	render: function() {
		return React.DOM.div(
			{ "className": "container main" },
			this.props.content
		);
	}
});

var TabSwitcher = React.createClass({
	onClick: function(tab) {
		// propagate click
		this.props.onTabClick(tab);
	},

	render: function() {
		return React.DOM.div(
			{ "className": "navbar navbar-inverse navbar-fixed-top" },
			React.DOM.div(
				{ "className": "container" },
				React.DOM.ul(
					{ "className": "nav navbar-nav" },
					this.props.tabs.map(function(tab) {
						return React.DOM.li(
							null,
							React.DOM.a(
								{ "onClick": this.onClick.bind(this, tab) },
								tab.title
							)
						);
					}.bind(this))
				)
			)
		);
	}
});

var Tabs = React.createClass({
	getInitialState: function() {
		return {
			"activeTab": 0,
			"tabs": this.props.tabs.map(function(tab, index) {
				tab.id = index;
				return tab;
			})
		};
	},

	onTabClick: function(tab) {
		this.setState({ "activeTab": tab.id });
	},

	render: function() {
		return React.DOM.div(
			null,
			TabSwitcher({
				"tabs": this.props.tabs,
				"activeTab": this.state.activeTab,
				"onTabClick": this.onTabClick
			}),
			TabContent({
				"content": this.props.tabs[this.state.activeTab].content
			})
		);
	}
});

module.exports = Tabs;
