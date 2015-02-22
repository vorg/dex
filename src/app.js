var React           = require('react');
var Globals         = require('./globals');
var request         = require('superagent');
var CommandLine     = React.createFactory(require('./command-line'));
var TextBlockResult = React.createFactory(require('./result-text-block'));
var ArrayResult     = React.createFactory(require('./result-array'));
var R               = require('ramda');


console.log('v3');

var nextTemp = 0;

var App = React.createClass({
  getInitialState: function() {
    return {
      results: []
    };
  },

  componentDidMount: function() {
    Globals.dex = {};
    Globals.loadCSV = this.loadCSV;
    Globals.colInfo = this.colInfo;
    Globals.show = this.show;
    Globals.R = R;

    loadCSV('dsi.csv');
  },

  loadCSV: function(fileName, varName) {
    request
    .get('/csv/' + fileName)
    .end(function(res) {
      var data = JSON.parse(res.text);
      var tempName = 'temp_' + nextTemp++;
      console.log('loadCSV done', fileName);
      console.log(tempName);
      Globals[tempName] = data;

      var columns = Object.keys(data[0]);

      this.state.results.push('CSV Data items:' + data.length + ' file:' + fileName + ' -> ' + tempName);
      this.state.results.push(data.slice(0, 5) + '...');
      this.state.results.push('0: ' + JSON.stringify(data[0]));
      this.state.results.push('Columns');
      this.state.results.push(columns);
      this.setState({ results: this.state.results });
    }.bind(this))
    console.log('loadCSV loading...', fileName);
  },

  colInfo: function(data, colName) {
    var byValue = {};
    data.forEach(function(row) {
      var value = row[colName];
      if (!byValue[value]) byValue[value] = [];
      byValue[value].push(row);
    });
    var results = Object.keys(byValue).map(function(value) {
      return byValue[value].length + 'x ' + value;
    });
    this.state.results.push('Col "' + colName + '"" values');
    this.state.results.push(results);
    this.setState({ results: this.state.results });
  },

  show: function(data) {
    console.log('show', data);
    this.state.results.push(data);
    this.setState({ results: this.state.results });
  },

  componentDidUpdate: function() {
    var content = this.refs.content.getDOMNode();
    content.scrollTop = content.scrollHeight;
  },

  render: function() {
    var results = this.state.results.map(function(data) {
      if (Object.prototype.toString.call(data) == '[object Array]') {
        return ArrayResult({ data: data })
      }
      else {
        return TextBlockResult({ data: data })
      }
    })
    return React.DOM.div({ className: 'app'},
      React.DOM.div({ ref: 'content', className: 'content' }, results),
      CommandLine()
    )
  }
});

React.render(React.createElement(App), document.body);