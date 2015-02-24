var React           = require('react');
var Globals         = require('./globals');
var request         = require('superagent');
var CommandLine     = React.createFactory(require('./command-line'));
var TextBlockResult = React.createFactory(require('./result-text-block'));
var ArrayResult     = React.createFactory(require('./result-array'));
var ErrorResult     = React.createFactory(require('./result-error'));
var R               = require('ramda');
var rd3             = require('react-d3');
var moment          = require('moment');

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

    loadCSV('sales.csv');
    setTimeout(function() {
      //colInfo(temp_0, "Country");
      //colInfo(temp_0, "Transaction_date", "time");
      colInfo(temp_0, "Transaction_date", "date");
      //colInfo(temp_0, "Account_Created", "date");
    }, 200)
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

  colInfo: function(data, colName, type) {
    var byValue = {};
    data.forEach(function(row) {
      var value = row[colName];
      if (!byValue[value]) byValue[value] = [];
      byValue[value].push(row);
    });
    var values = Object.keys(byValue);
    var results = values.map(function(value) {
      return byValue[value].length + 'x ' + value;
    });

    if (type == "values") {
      var chartData = values.map(function(value) {
        var count = byValue[value].length;
        return { label: value, value: count }
      });
      chartData.sort(function(a, b) {
        return -(a.value - b.value);
      })
      chartData = chartData.slice(0, 20);
      results = {
        chart: 'bar',
        title: colName,
        data: chartData
      }
    }

    if (type == "date") {
      function formatDate(row) {
        return moment(row[colName]).format("YYYY-MM-DD")
      }
      byValue = R.groupBy(formatDate, data);
      console.log(byValue);
      var values = Object.keys(byValue);
      var xy = values.map(function(value) {
        var count = byValue[value].length;
        return { x: moment(value).toDate() , y: count }
      });
      xy.sort(function(a, b) {
        return a.x.getTime() - b.x.getTime();
      });
      var chartData = [{
        name: colName,
        values: xy
      }];
      results = {
        chart: 'line',
        title: colName,
        data: chartData
      }
    }

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
      if (data.error) {
        return ErrorResult({ data: data })
      }
      if (data.chart == 'bar') {
        console.log(data.data)
        return React.DOM.div({ className: 'result' },
          rd3.BarChart({
            data: data.data,
            title: data.title,
            width: window.innerWidth - 40,
            height: 400,
          })
        );
      }
      if (data.chart == 'line') {
        console.log(data.data)
        return React.DOM.div({ className: 'result' },
          rd3.LineChart({
            data: data.data,
            title: data.title,
            width: window.innerWidth - 40,
            height: 400,
          })
        );
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