<?php

/*
error_reporting(E_ALL);
ini_set("display_errors", true);
ini_set("display_startup_errors", true);
*/

$host = file_get_contents("./localtunnel.txt").".loca.lt";

$routes = [
	"/errorPages/400/" => "Type A Error: 400 (Bad Request)", 
	"/errorPages/401/" => "Type A Error: 401 (Unauthorized)", 
	"/errorPages/403/" => "Type A Error: 403 (Forbidden)", 
	"/errorPages/404/" => "Type A Error: 404 (Not Found)", 
	"/errorPages/503/" => "Type A Error: 503 (Service Unavailable)", 
	"/localtunnel.txt" => $host
];

if (array_key_exists($_SERVER["REQUEST_URI"], $routes)) {
	echo $routes[$_SERVER["REQUEST_URI"]];
	die;
}

function get_raw_http_request() {
	global $host;
	
	$request = $_SERVER["REQUEST_METHOD"]." ".$_SERVER["REQUEST_URI"]." ".$_SERVER["SERVER_PROTOCOL"]."\r\n";
	$request .= "Bypass-Tunnel-Reminder: 1\r\n";
	
	foreach (getallheaders() as $name => $value) {
		if ($name === "Local-Tunnel") {
			file_put_contents("./localtunnel.txt", $value);
		} else if ($name === "Host") {
			$value = $host;
		}
		$request .= $name.": ".$value."\r\n";
	}
	
	$request .= "\r\n".file_get_contents("php://input");
	return $request;
}

$raw = get_raw_http_request();
$socket = fsockopen($host, 80, $error_number, $error_string, 20);

if (!$socket) {
	echo "Type B Error: ".$error_number." (".$error_string.")";
	die;
} else {
	fputs($socket, $raw);
	
	$contents = "";
	while (!feof($socket)) {
		$new_content = fgets($socket, 1048576);
		$contents .= $new_content;
	}
	
	$contents = explode("\r\n\r\n", $contents);
	$head = $contents[0];
	unset($contents[0]);
	$contents = array_values($contents);
	$contents = implode("\r\n\r\n", $contents);
	
	$head = explode("\r\n", $head);
	for ($i = 0; $i < count($head); $i++) {
		// Check whether the subdomain from loca.lt actually points to our computer's localhost or not
		if ($head[$i] === "Content-Length: 3") {
			if ($head[0] === "HTTP/1.1 404 Not Found" && $contents === "404") {
				// The subdomain from loca.lt does not point to our computer's localhost or not, print error message
				$contents = "Type C Error: 404 (Not Found)";
				$head[$i] = "Content-Length: ".strlen($contents);
			}
		}
		header($head[$i]);
	}
	
	// Allow AJAX requests to be made towards the loca.lt subdomain, instead of towards cingjue.rf.gd, so that we can use as much long polling as we want without crossing the entry process limit, which makes InfinityFree suspend our account
	// https://support.infinityfree.net/limits/entry-process-limit/
	header("Access-Control-Allow-Origin: http://".$host);
	
	echo $contents;
	fclose($socket);
}

?>