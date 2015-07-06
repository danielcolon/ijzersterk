<?php
	require_once("classes/ijzersterkAPI.php");
	
	// Requests from the same server don't have a HTTP_ORIGIN header
	if (!array_key_exists('HTTP_ORIGIN', $_SERVER))
	{
		$_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
	}

	try
	{
		$API = new ijzersterkAPI($_REQUEST['request'], $_SERVER['HTTP_ORIGIN']);
		echo $API->processAPI();
	}
	catch(Exception $error)
	{
		echo json_encode(Array('error' => $error->getMessage()));
	}
?>