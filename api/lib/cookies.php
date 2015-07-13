<?php
	// Utilities for dealing with cookies

	function checkForCookie($connection = null)
	{
		//Initialise variables
		global $DBServer, $DBUser, $DBPass, $DBName;
		$error = '';
		$DBTable  = 'users';

		$dirname = dirname(__FILE__);
		require_once("$dirname/../classes/user.php");

		//connection
		$receivedConnection = isset($connection);

		//Make connection if we didn't get one
		if(!$receivedConnection)
		{
			$dirname = dirname(__FILE__);
			require("$dirname/../settings.php");

			//Connect to database
			$connection = new mysqli($DBServer, $DBUser, $DBPass, $DBName);

			// Check connection
			if ($connection -> connect_error)
			{
				trigger_error('Database connection failed: '  . $connection -> connect_error, E_USER_ERROR);
				return false;
				exit();
			}
		}

		//Check if cookie is set
		if(!isset($_COOKIE['ijzersterk']))
		{
			return false;
			exit();
		}

		//get and clean up cookie
		$cookie = $_COOKIE['ijzersterk'];
		$cookie = mysqli_real_escape_string($connection, $cookie);

		//Try to get user from table
		//Find a way to make this more secure. The cookie is large but still.
		$query = "SELECT * FROM $DBTable WHERE cookie = '$cookie';";
		$userQueryResult = $connection -> query($query);
		
		if($userQueryResult)
		{
			$rows = $userQueryResult -> num_rows;
			//if there's one row initiate session and send to index
			if ($rows == 1)
			{
				//Load user information from database
				$row = $userQueryResult->fetch_assoc();
				$AUser = new TUser;
				$AUser->setUsername($row['username']);
				if($AUser->fill($connection))
				{
					$_SESSION['user'] = serialize($AUser);

					setLoginCookie($connection);

					//Close connection
					mysqli_close($connection);

					if(!$receivedConnection)
					{
						//Close database connection only if we made it ourselves
						mysqli_close($connection);
					}

					return true;
					exit();
				}
			}
		}

		if(!$receivedConnection)
		{
			//Close database connection only if we made it ourselves
			mysqli_close($connection);
		}

		return false;
		exit();
	}
	
	function setLoginCookie($connection)
	{
		//Load external PHP scripts
		$dirname = dirname(__FILE__);
		require("$dirname/../classes/user.php");

		//connection
		$DBTable  = 'users';
		$receivedConnection = isset($connection);

		//Make connection if we didn't get one
		if(!$receivedConnection)
		{
			require_once("$dirname/../settings.php");
			
			//Connect to database
			$connection = new mysqli($DBServer, $DBUser, $DBPass, $DBName);

			// Check connection
			if ($connection -> connect_error)
			{
				trigger_error('Database connection failed: '  . $connection -> connect_error, E_USER_ERROR);
				return false;
				exit();
			}
		}

		//Make cookie hash
		$cookieHash = bin2hex(openssl_random_pseudo_bytes(256));

		//Try to store cookie hash
		//$cookieHashClean = mysqli_real_escape_string($connection, $cookieHash);
		$query = "UPDATE $DBTable SET cookie = '$cookieHash' WHERE id = '" . unserialize($_SESSION['user'])->getId() . "';";
		$userQueryResult = $connection -> query($query);

		//Error check
		if (!$userQueryResult)
		{
			trigger_error('Wrong SQL: ' . $query . ' Error: ' . $connection -> error, E_USER_ERROR);
			$error .= "Can't store cookie in database";
			return false;
		}
		else
		{
			setcookie('ijzersterk', $cookieHash, time() + (10 * 365 * 24 * 60 * 60), '/', 'ijzersterkdelft.nl', false, true);
			$count = strlen($cookieHash);
			$error = "Cookie set";
			return true;
		}
		
		if(!$receivedConnection)
		{
			//Close database connection only if we made it ourselves
			mysqli_close($connection);
		}
	}
	
	function unsetLoginCookie()
	{
		//delete cookie
		setcookie('ijzersterk', null, time() - (10 * 365 * 24 * 60 * 60), '/', 'ijzersterkdelft.nl', false, true);
		unset($_COOKIE['wtl']);
	}
?>