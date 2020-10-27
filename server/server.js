/**
 *
 *
 *
 */
'use strict';

var fs = require('fs');
var WebSocketServer = require('ws').Server;
var http = require('http');
var serverConfig;
var PORT = process.env.PORT || 8080;

if (process.env.PORT === undefined) {
  http = require('https');
  serverConfig = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };
}

/**
 *
 *
 *
 */
var handleRequest = (req, res) => {

  if (req.url === '/') {
    res.writeHead(200, {'Content-Type':'text/html'});
    return res.end(fs.readFileSync('client/index.html'));
  }

  if (req.url === '/webrtc.js') {
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    return res.end(fs.readFileSync('client/webrtc.js'));
  }

  if (req.url === '/adapter.js') {
    res.writeHead(200, {'Content-Type': 'application/javascript'});
    return res.end(fs.readFileSync('client/adapter.js'));
  }

  if (req.url === '/favicon.ico') {
    return res.end('');
  }
};

var httpServer = http.createServer.apply(
  undefined,
  [serverConfig, handleRequest].filter(elm => elm)
).listen(PORT, () => console.log('Running on port:', + PORT));

/**
 *
 *
 *
 */
var wss = new WebSocketServer({server: httpServer});

wss.on('connection', ws => {
  console.log('connection');
  ws.on('message', message => {
    var data = JSON.parse(message);
    var isWhat = data.ice ? 'isIce' : data.sdp ? 'isSdp' : '';
    console.log('message', data.uuid, isWhat);
    [...wss.clients].forEach(client => client.send(message));
  });
});
