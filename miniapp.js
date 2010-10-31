var http = require('http'),
    sys = require('sys'),
    utils = require('utils'),
    nodeStatic = require('./node-static/lib/node-static'),
    rest = require('./restler/lib/restler'),
    jade = require('./jade');

http.createServer(function (req, res) {
  var file = new nodeStatic.Server('./public', {
    cache: false
  });
  var path = req.url.replace(/\//, "");
  var api_url = "http://api.bit.ly/v3/shorten?" +
                "login=gilesgoatboy&" +
                "apiKey=YOUR API KEY HERE&" +
                "format=json&" +
                "longUrl=" + encodeURIComponent(path);
  var simpleOutput = function(err, html){
                       res.end(html);
                       // sys.puts(err);
                     };

  if ("" == path) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    jade.renderFile('index.jade',
                    {},
                    simpleOutput);
  } else if (path.match(/.*.[j,c]s+/)) {
    file.serve(req, res);
  } else if ("favicon.ico" != path) {
    rest.get(api_url,
           { data: {}
           }).addListener('complete', function(data, bitly_response) {
             if (200 == bitly_response.statusCode) {
               res.writeHead(200, {'Content-Type': 'text/html'});
               jade.renderFile('shortened.jade',
                               { locals: {url: data.data.url} },
                               simpleOutput);
             }
           }).addListener('error', function(err) {
             sys.puts(err);
           });
  }


}).listen(3000, "127.0.0.1");

