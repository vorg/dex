var React           = require('react');

var CommandLine = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  componentDidMount: function() {
    //CalendarStore.addChangeListener(this.onCalendarChange);
    //this.onCalendarChange();
  },
  componentWillUnmount: function() {
    //CalendarStore.removeChangeListener(this.onCalendarChange);
  },
  onCalendarChange: function() {
    this.setState({ title: CalendarStore.getTitle(), events: CalendarStore.getEvents() })
  },
  onKeyDown: function(e) {
    if (e.keyCode == 13) {
      this.execute(this.refs.input.getDOMNode().value);
    }
  },
  execute: function(code) {
    try {
      eval(code);
    }
    catch(e) {
      show({
        error: e.message,
        stack: e.stack
      })
    }
  },
  render: function() {
    return new React.DOM.div({ className: 'command-line' },
      React.DOM.div({ className: 'help' }, 'E.g.: loadCSV("dsi.csv"); colInfo(temp_0, "tech");'),
      React.DOM.input({ ref: 'input', type: 'text', onKeyDown: this.onKeyDown})
    );
  }
});

module.exports = CommandLine;