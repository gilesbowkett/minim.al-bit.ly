var http = require('http'),
    sys = require('sys'),
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

  if ("favicon.ico" != path && "style.css" != path) {
    rest.get(api_url,
             { data: {}
             }).addListener('complete', function(data, bitly_response) {
               if (200 == bitly_response.statusCode) {
                 res.writeHead(200, {'Content-Type': 'text/html'});
                 jade.renderFile('view.jade',
                                 { locals: {url: data.data.url} },
                                 function(err, html){
                                   res.end(html);
                                 });
               }
             }).addListener('error', function(err) {
               sys.puts(err);
             });
  } else if ("style.css" == path) {
    file.serve(req, res);
  }


}).listen(3000, "127.0.0.1");

