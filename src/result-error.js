var React           = require('react');

var ErrorResult = React.createClass({
  render: function() {
    return new React.DOM.div({ className: 'result result-error' },
      React.DOM.div({ }, this.props.data.error)
      //React.DOM.pre({ }, this.props.data.stack)
    );
  }
});

module.exports = ErrorResult;