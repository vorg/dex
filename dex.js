var express = require('express');
var csv = require('csv');
var fs = require('fs');
var app = express();

app.get('/csv/:file', function(req, res) {
  //FIXME: nomralize path for security
  try {
    var str = fs.readFileSync(__dirname + '/data/' + req.params.file, 'utf8');
    csv().from.string(str, { columns: true })
    .to.array( function(data){
      res.send(JSON.stringify(data));
    });
  }
  catch(e) {
    data = { error: '' + e }
    res.send(JSON.stringify(data));
  }
});

app.use(express.static('./', {}));

var server = app.listen(3002, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})