start = function () {
	if (!(document.getElementById("name").value.length > 0)) {
		app.messages.push({
			"action": "error", 
			"content": "Your name cannot be empty! "
		});
		return false;
	}
	
	ws = io({
		"transports": ["websocket", "polling"]
	});
	
	ws.on("connect", function () {
		console.log("Connected");
		document.getElementById("name").blur();
		document.getElementById("name").disabled = true;
		document.getElementById("nameForm").style.display = "none";
		document.getElementById("message").disabled = false;
		document.getElementById("messageForm").style.display = "initial";
		message = {
			"action": "enter", 
			"from": document.getElementById("name").value
		};
		ws.send(JSON.stringify(message));
	});
	
	ws.on("disconnect", function () {
		console.log("Disconnected");
		start();
	});
	
	ws.on("broadcast", function(message) {
		message = JSON.parse(message);
		if (message.action === "update") {
			document.getElementById("online").innerHTML = message.list.join(", ");
			document.getElementById("onlineContainer").style = false;
		} else if (message.action === "message") {
			app.messages.push(message);
		}
		document.getElementById("message").value = "";
	});
	return false;
}

send = function () {
	if (!(document.getElementById("message").value.length > 0)) {
		app.messages.push({
			"action": "error", 
			"content": "Your message cannot be empty! "
		});
		return false;
	}
	
	message = {
		"action": "message", 
		"from": document.getElementById("name").value, 
		"content": document.getElementById("message").value
	};
	ws.send(JSON.stringify(message));
	return false;
}