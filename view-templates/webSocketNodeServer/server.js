var osc = require("osc"),
	http = require("http"),
	WebSocket = require("ws");

var port = 3000;
var webSocketConnectionExists = false;

// Create an Express server app
// and serve up a directory of static files.
var express = require("express");
var app = express(),
	server = app.listen(port);
app.use("/", express.static(__dirname + "/public"));

console.log("HTTP server on port: " + port);

// Listen for Web Socket requests.
var wss = new WebSocket.Server({
	server: server
});

var sendOSCMessage;

wss.on('connection', function(ws) {
	//  set connection to true
	webSocketConnectionExists = true;

	// sending messages for testing
	// var count = 0;
	// var boolGuy = false;
	// var id = setInterval(function() {
	// 	ws.send(osc.writeMessage({address:'/oops/cool/cheese',args:["wow", count, boolGuy]}));
	// 	count = (count >= 10)? 0 : count+1;
	// 	boolGuy = !boolGuy;
	// }, 1000);

	// init sending function
	sendOSCMessage = function(msg){
		ws.send(msg);
	}

	console.log('started client interval');
	ws.on('close', function() {
		// clean up

		// set connection to false
		webSocketConnectionExists = false;

		// null send function
		sendOSCMessage = null;

		console.log('stopping client interval');
		// clearInterval(id);
	});
});

// UDP stuff for receiving touchOSC messages

var dgram = require('dgram');

//Initialize a UDP server to listen for json payloads on port 3333
var srv = dgram.createSocket("udp4");
srv.on("message", function (msg, rinfo) {
  //console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
  // here's where you should pass the OSC message through the websocket connection
  // make sure that a websocket connection has been established
  if(webSocketConnectionExists){
  	// make sure function is defined
  	if(sendOSCMessage !== undefined && sendOSCMessage !== null){
  		// decode incoming message
  		var currentMessage = osc.readMessage(msg);
  		// console.log("message address: " +  currentMessage.address + " args: " + currentMessage.args);
  		sendOSCMessage(osc.writeMessage({address:currentMessage.address,args:currentMessage.args}));
  	}

  }
});

srv.on("listening", function () {
  var address = srv.address();
  console.log("UDP server listening " + address.address + ":" + address.port);
});

srv.on('error', function (err) {
  console.error(err);
  process.exit(0);
});

srv.bind(8000);