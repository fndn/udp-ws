
var fs  		= require("fs");
var http 		= require("http")
var dgram  		= require("dgram");
var ws 			= require("ws").Server;
var express 	= require("express");

var identity 	= "baseio_udp_ws_relay";
var version  	= "0.0.1";
var udp_port 	= 8100;
var ws_port  	= 8200;

var udp_server 	= null;
var http_server = null;
var ws_server 	= null;

var ws_clients  = {};
var wss_counter = 0;

var app 		= express();
app.use(express.static(__dirname + "/"))


var udp_server = dgram.createSocket("udp4");
udp_server.on("message", function (msg, rinfo) {
	console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
	publish( msg );
});
udp_server.on("listening", function () {
	var address = udp_server.address();
	console.log("udp_server listening @ " + address.address + ":" + address.port);
});
udp_server.bind(udp_port);


var http_server = http.createServer(app);
http_server.listen(ws_port);

var ws_server = new ws({server: http_server});
console.log("websocket server publishing on %d", ws_port);

ws_server.on("connection", function(ws) {

	var msg = "connected to "+ identity + " v."+ version;
	ws.send( JSON.stringify({'msg':msg}) );

	wss_counter ++;
	ws.id = "ID"+wss_counter;
	wss_clients[ws.id] = ws;
			

	ws.on("close", function() {
		console.log('ws '+ this.id +' disconnected');
		delete wss_clients[this.id];
	});
});

function publish(msg){
	for( var client in wss_clients ){
		wss_clients[client].send( JSON.stringify({'msg':msg}) );
	}
}



