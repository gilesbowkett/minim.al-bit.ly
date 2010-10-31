var http = require('http'),
    sys = require('sys'),
    util = require('utils'),
    rest = require('./restler/lib/restler'),
    jade = require('./jade');

http.createServer(function (req, res) {
  var url_to_shorten = req.url.replace(/\//, "");
  var api_url = "http://api.bit.ly/v3/shorten?" +
                "login=gilesgoatboy&" +
                "apiKey=YOUR API KEY HERE&" +
                "format=json&" +
                "longUrl=http%3A%2F%2Fbetaworks.com%2F";
  if ("favicon.ico" != url_to_shorten) {
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
  }
}).listen(3000, "127.0.0.1");

