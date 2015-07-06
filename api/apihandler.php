<?php
	/*
	echo("Great succes<br>");
	echo("\$_SERVER request method: " . $_SERVER['REQUEST_METHOD']);
	echo("<br>\$_SERVER request uri: " . $_SERVER['REQUEST_URI']);
	*/
	
	require_once("classes/ijzersterkAPI.php");
	
	// Requests from the same server don't have a HTTP_ORIGIN header
	if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
		$_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
	}

	try {
		$API = new ijzersterkAPI($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
		echo $API->processAPI();
	} catch (Exception $e) {
		echo json_encode(Array('error' => $e->getMessage()));
	}
?>