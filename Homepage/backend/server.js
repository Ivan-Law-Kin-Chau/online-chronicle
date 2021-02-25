localtunnel = require("localtunnel");
express = require("express");
SocketServer = require("ws");
http = require("http");
port = 8000;

(async function () {
	tunnel = await localtunnel({
		"subdomain": "ivan-law", 
		"port": port
	});
	
	console.log(tunnel.url);

	tunnel.on("close", function() {
		console.log("The tunnel is closed");
	});

	// tunnel.close();
})();

server = http.createServer(function (request, response) {
	fs = require("fs");
	fs.readFile(".\/client.js", "utf8", function (error, data) {
		if (error) {
			console.log(error);
		}
		response.writeHead(200, {
			"Content-Type": "text/javascript"
		});
		response.write(data);
		response.end();
	});
});
// server = http.createServer(express);
server.listen(port, function() {
	console.log("Server started");
});

list = [];

webSocket = new SocketServer.Server({server});
webSocket.on("connection", function (connection) {
	connection.on("message", function (data) {
		console.log(data);
		message = JSON.parse(data);
		if (message.action === "enter") {
			connection.name = message.from;
			list[list.length] = message.from;
			message = {
				"action": "update", 
				"list": list
			};
			data = JSON.stringify(message);
			webSocket.clients.forEach(function (client) {
				client.send(data);
			});
		} else if (message.action === "message") {
			webSocket.clients.forEach(function (client) {
				client.send(data);
			});
		}
	});
	console.log("Client connected");
	connection.on("close", function () {
		list.splice(list.indexOf(connection.name), 1);
		message = {
			"action": "update", 
			"list": list
		};
		data = JSON.stringify(message);
		webSocket.clients.forEach(function (client) {
			client.send(data);
		});
		console.log("Client disconnected");
	})
});