var React = require("react");

var TabContent = React.createClass({
	render: function() {
		return React.DOM.div(
			{ "className": "container main" },
			React.DOM.div(
				{ "className": "panel panel-default" },
				React.DOM.div(
					{ "className": "panel-body" },
					this.props.content
				)
			)
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

module.exports = {
	"TabSwitcher": TabSwitcher,
	"TabContent": TabContent
};
