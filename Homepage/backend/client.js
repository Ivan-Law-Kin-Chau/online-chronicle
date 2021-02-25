escapeHTML = function(escapeString) {
	textNode = document.createTextNode(escapeString);
	paragraph = document.createElement("p");
	paragraph.appendChild(textNode);
	return paragraph.innerHTML;
}

start = function () {
	if (!(document.getElementById("name").value.length > 0)) {
		document.getElementById("chat").innerHTML += "<br>Your name cannot be empty! <br>";
		return false;
	}
	
	ws = new WebSocket("ws://ivan-law.loca.lt");
	
	ws.onopen = function () {
		console.log("Connected");
		document.getElementById("name").disabled = true;
		document.getElementById("message").disabled = false;
		message = {
			"action": "enter", 
			"from": document.getElementById("name").value
		};
		ws.send(JSON.stringify(message));
	}

	ws.onclose = function () {
		console.log("Disconnected");
		start();
	}

	ws.onmessage = function(event) {
		message = JSON.parse(event.data);
		if (message.action === "update") {
			document.getElementById("online").innerHTML = message.list.join(", ");
			document.getElementById("onlineContainer").style = false;
		} else if (message.action === "message") {
			document.getElementById("chat").innerHTML += "<br><div><span style='vertical-align: top;'><b>" + message.from + ": </b></span><div style='display: inline-block;'>" + escapeHTML(message.content) + "</div></div>";
		}
		document.getElementById("message").value = "";
	}
	
	return false;
}

send = function () {
	if (!(document.getElementById("message").value.length > 0)) {
		document.getElementById("chat").innerHTML += "<br>Your message cannot be empty! <br>";
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