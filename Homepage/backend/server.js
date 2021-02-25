path = require("path");
rootPath = path.join(__dirname + "\\..\\frontend\\");

express = require("express");
app = express();

saltLength = 8;

app.use(require("body-parser").urlencoded({
	"extended": false
}));

app.all("/passport/generate/", function (req, res) {
	var data = JSON.parse(req.query.data);
	var password = data.password;
	delete data.password;
	var encoded = JSON.stringify(data);
	res.header("Access-Control-Allow-Origin", "*");
	var encoded = (function(input, governmentPassword) {
		var crypto = require("crypto");
		var salt = crypto.randomBytes(saltLength).toString("binary");
		
		var buff = Buffer.from(governmentPassword, "utf8").toString("binary");
		
		var key = crypto.createCipher("aes-128-cbc", salt + buff);
		var str = key.update(input, "utf8", "binary");
		str += key.final("binary");
		
		buff = Buffer.from(salt + str, "binary");
		var base64 = buff.toString("base64");
		
		base64 = base64.split("+").join(".");
		base64 = base64.split("\/").join("_");
		base64 = base64.split("=").join("-");
		
		return base64;
	})(encoded, password);
	data.encoded = encoded;
	var file = "<script> passportData = " + JSON.stringify(data) + "; </script>";
	
	var fs = require("fs");
	file += "<style> " + fs.readFileSync(rootPath + "main.css") + " </style>";
	file += require("fs").readFileSync(rootPath + "passport\\index.html");
	res.setHeader("Content-Disposition", "attachment; filename=Citizen Passport.html");
	res.setHeader("Content-Type", "text/html");
	res.send(file);
	res.end();
});

app.all("/passport/validate/", function (req, res) {
	var input = JSON.parse(req.query.data);
	var results = (function(input, governmentPassword) {
		input = input.split(".").join("+");
		input = input.split("_").join("\/");
		input = input.split("-").join("=");
		
		var buff = Buffer.from(input, "base64");
		var str = buff.toString("binary");
		
		var crypto = require("crypto");
		var salt = str.slice(0, saltLength);
		
		buff = Buffer.from(governmentPassword, "utf8").toString("binary");
		
		try {
			var key = crypto.createDecipher("aes-128-cbc", salt + buff);
			var str = key.update(str.slice(saltLength, str.length), "binary", "utf8");
			str += key.final("utf8");
			
			return str;
		} catch (error) {
			return "Error: Invalid passport";
		}
	})(input.input, input.password);
	results = (function () {
		if (results === "Error: Invalid passport") {
			return null;
		} else {
			data = JSON.parse(results);
			for (key in input.expected) {
				if (data[key] !== input.expected[key]) return false;
			}
		}
		return true;
	})();
	if (results === true) {
		res.send('<script> alert("This passport is valid. "); </script>');
	} else if (results === false) {
		res.send('<script> alert("This passport is invalid. "); </script>');
	} else if (results === null) {
		res.send('<script> alert("The password is incorrect. "); </script>');
	}
	res.end();
});

app.use(function (req, res) {
	fileExtension = path.extname(req.path).toLowerCase();
	if (fileExtension === ".wav" || fileExtension === ".mp3" || fileExtension === ".mp4") {
		res.header("Access-Control-Allow-Methods", "*");
		res.header("Access-Control-Allow-Origin", req.header("origin"));
		res.header("Access-Control-Allow-Headers", 'Bypass-Tunnel-Reminder, Content-Length');
		res.header("Access-Control-Expose-Headers", 'Bypass-Tunnel-Reminder, Content-Length');
	}
	res.sendFile(rootPath + req.path);
});

app.use(require("compression"));

http = require("http").Server(app);
http.listen(8000, function() {
	console.log("Server started");
});

list = [];
webSocket = require("socket.io")(http);

webSocket.on("connection", function (connection) {
	console.log("Server started");
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
			webSocket.sockets.emit("broadcast", data);
		} else if (message.action === "message") {
			webSocket.sockets.emit("broadcast", data);
		}
		console.log(list);
	});
	console.log("Client connected");
	connection.on("disconnect", function () {
		list.splice(list.indexOf(connection.name), 1);
		message = {
			"action": "update", 
			"list": list
		};
		data = JSON.stringify(message);
		webSocket.sockets.emit("broadcast", data);
		console.log("Client disconnected");
		console.log(list);
	})
});