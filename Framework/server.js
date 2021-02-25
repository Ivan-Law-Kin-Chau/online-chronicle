tunnelPort = 80;
viewPort = 8000;
url = "http://cingjue.rf.gd";

httpProxy = require("http-proxy");
proxy = httpProxy.createProxyServer({});
proxy.on("error", function(error) {
	console.log("Tunnel error (proxy): " + error);
});

http = require("http");
server = http.createServer(function(request, response) {
	recurse = function () {
		// Localtunnel cannot tunnel to a server hosted on our computer's localhost if that server is single threaded, so we port forward viewPort to tunnelPort. Then, if the server behind viewPort is single threaded, the connections to viewPort will be encapsulated by tunnelPort, allowing Localtunnel to work with single threaded servers
		// https://github.com/localtunnel/localtunnel/blob/master/lib/TunnelCluster.js
		proxy.web(request, response, {
			"target": "http://localhost:" + viewPort
		}, function(error) {
			recurse();
		});
	}
	recurse();
});
server.listen(tunnelPort);

localtunnel = require("localtunnel");
initialize = async function () {
	tunnel = await localtunnel(tunnelPort, "", function (error, tunnel) {
		if (error) {
			console.log("Tunnel error: " + error);
			initialize();
		} else {
			console.log("Tunnel will be started at " + tunnel.url);
			
			// Puppeteer is used because InfinityFree does a test to see is the client an actual browser or not, if we just send a raw HTTP request to cingjue.rf.gd, the raw HTTP request will be intercepted
			const puppeteer = require("puppeteer");
			
			(async function () {
				// Let cingjue.rf.gd know the new subdomain from loca.lt
				const browser = await puppeteer.launch();
				const page = await browser.newPage();
				await page.setRequestInterception(true);
				page.on("request", function (request) {
					const headers = request.headers();
					// The index.php from cingjue.rf.gd will look for the Local-Tunnel request header and store it as the new subdomain from loca.lt
					headers["Local-Tunnel"] = tunnel.clientId;
					request.continue({
						"headers": headers
					});
				});
				await page.goto(url);
				await browser.close();
				console.log("Tunnel started");
				
				tunnel.on("request", function(information) {
					console.log(information);
				});
				
				tunnel.on("error", function(error) {
					console.log(error);
					tunnel.close();
				});
				
				tunnel.on("close", function() {
					console.log("Tunnel closed, restarting tunnel");
					initialize();
				});
			})();
		}
	});
}

initialize();