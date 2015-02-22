var React           = require('react');

var TextBlockResult = React.createClass({
  render: function() {
    return new React.DOM.div({ className: 'result result-text-block' },
      React.DOM.p({ }, '' + this.props.data)
    );
  }
});

module.exports = TextBlockResult;