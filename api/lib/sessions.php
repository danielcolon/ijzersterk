<?php
	//Load external PHP scripts
	$dirname = dirname(__FILE__);
	require_once("$dirname/../lib/cookies.php");

	function userLoggedIn()
	{
		//Start session, check for user
		if (session_id() == "")
		{
			session_start();
		}

		if(!isset($_SESSION['user']))
		{
			//Check for cookie
			if(checkForCookie())
			{
				return true;
			}
			else
			{
				trigger_error("User not logged in", E_USER_WARNING);
				return false;
			}
		}
		else
		{
			return true;
		}
	}
?>