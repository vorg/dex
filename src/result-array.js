var React           = require('react');

var ArrayResult = React.createClass({
  render: function() {
    var items = this.props.data.map(function(item, itemIndex) {
      return React.DOM.div(null, itemIndex + ' : ' + item);
    });
    return new React.DOM.div({ className: 'result result-array' },
      React.DOM.div({ }, items)
    );
  }
});

module.exports = ArrayResult;