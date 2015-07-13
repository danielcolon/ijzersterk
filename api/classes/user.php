<?php
//Load external PHP scripts
$dirname = dirname(__FILE__);
//require_once("$dirname/../handlers/sessionhandler.php");
require_once("$dirname/../settings.php");

//Define classes
class user
{
	//Properties
	private $id;
	private $username;
	private $lastLogin;
	private $lastLoginIP;
	private $created;
	private $password;
	private $cookie;
	private $isAdmin;
	private $firstName;
	private $lastName;
	private $email;
	private $isChanged;
	private $inDatabase;

	//Getters
	function getId()
	{
		return $this->id;
	}

	function getUsername()
	{
		return $this->username;
	}

	function getLastLogin()
	{
		return $this->lastLogin;
	}

	function getLastLoginIP()
	{
		return $this->lastLoginIP;
	}

	function getCreated()
	{
		return $this->created;
	}

	function getCookie()
	{
		return $this->cookie;
	}

	function getIsAdmin()
	{
		return $this->isAdmin;
	}

	function getFirstName()
	{
		return $this->firstName;
	}

	function getLastName()
	{
		return $this->lastName;
	}

	function getEmail()
	{
		return $this->email;
	}

	function getIsChanged()
	{
		return $this->isChanged;
	}

	function getInDatabase()
	{
		return $this->inDatabase;
	}

	function getAsAssociativeArray()
	{
		return array(
			"id"          => $this->getId(),
			"username"    => $this->getUserName(),
			"lastLogin"   => $this->getLastLogin(),
			"lastLoginIP" => $this->getLastLoginIP(),
			"created"     => $this->getCreated(),
			"isAdmin"     => $this->getIsAdmin(),
			"firstName"   => $this->getFirstName(),
			"lastName"    => $this->getLastName(),
			"email"       => $this->getEmail()
		);
	}
	
	/*
	private $id;
	private $username;
	private $lastLogin;
	private $lastLoginIP;
	private $created;
	private $password;
	private $cookie;
	private $isAdmin;
	private $firstName;
	private $lastName;
	private $email;
	private $isChanged;
	private $inDatabase;
	*/

	//Setters
	function setId($AId)
	{
		$this->id = $AId;
		$this->isChanged = TRUE;
	}

	function setUsername($AUsername)
	{
		$this->username = $AUsername;
		$this->isChanged = TRUE;
	}

	function setLastLogin($ALastLogin)
	{
		if($ALastLogin instanceof DateTime)
		{
			$this->lastLoginDate = $ALastLogin;
		}
		else
		{
			$this->lastLoginDate = strtotime($ALastLogin);
		}
		$this->isChanged = TRUE;
	}

	function setLastLoginIP($ALastLoginIP)
	{
		$this->lastLoginIP = $ALastLoginIP;
		$this->isChanged = TRUE;
	}

	function setCreated($ACreated)
	{
		$this->created = $ACreated;
		$this->isChanged = TRUE;
	}

	function setCookie($ACookie)
	{
		$this->cookie = $ACookie;
		$this->isChanged = TRUE;
	}

	function setIsChanged($AIsChanged)
	{
		$this->isChanged = $AIsChanged;
	}
	
	function setIsAdmin($AIsAdmin)
	{
		$this->isAdmin = $AIsAdmin;
		$this->isChanged = true;
	}

	function setFirstName($AFirstName)
	{
		$this->firstName = $AFirstName;
		$this->fsChanged = true;
	}

	function setLastName($ALastName)
	{
		$this->lastName = $ALastName;
		$this->isChanged = true;
	}

	function setEmail($AEmail)
	{
		$this->email = $AEmail;
		$this->isChanged = true;
	}

	function setInDatabase($AInDatabase)
	{
		$this->inDatabase = $AInDatabase;
	}

	//Construct
	function __construct()
	{
		$this->lastLoginDate = new DateTime;
	}

	function login($AUsername = null, $APassword = null)
	{
		// Attempts to login and fill the user
		// Returns json array with either succes or failure

		if(!is_null($AUsername) && !is_null($APassword))
		{
			$dirname = dirname(__FILE__);
			require("$dirname/../settings.php");
			$DBTable  = 'users';

			//Connect to database
			$connection = new mysqli($DBServer, $DBUser, $DBPass, $DBName);

			// Check connection
			if ($connection->connect_error)
			{
				trigger_error('Error connecting to database: ' . $connection->error, E_USER_WARNING);
				return json_encode(array("error" => "500 Internal Server Error","details" => "Couldn't connect to database"));
			}

			//Clean up
			$AUsername = mysqli_real_escape_string($connection, $AUsername);
			$APassword = mysqli_real_escape_string($connection, $APassword);

			trigger_error("$AUsername, $APassword", E_USER_NOTICE);

			//Create and attempt to fill user
			$this->setUsername($AUsername);
			if($this->fill($connection))
			{
				if($this->checkPassword($APassword))
				{
					$_SESSION['user'] = serialize($this);

					//setLoginCookie($connection);
					return json_encode(array("result" => "200 OK", "details" => "User logged in.","user" => $this->getAsAssociativeArray()));

					//Close connection
					mysqli_close($connection);
				}
				else
				{
					return json_encode(array("error" => "401 Unauthorized","details" => "Invalid credentials supplied"));
				}
			}
			else
			{
				return json_encode(array("error" => "401 Unauthorized","details" => "Invalid credentials supplied"));
			}
		}
	}
	
	function checkPassword($APassword)
	{
		if(is_null($this->password))
		{
			trigger_error('No password set in user object', E_USER_ERROR);
			return FALSE;
		}
		else
		{
			if(password_verify($APassword, $this->password))
			{
				return TRUE;
			}
		}
	}

	//Fill
	function fill($AConnection)
	{
		if(is_null($this->getId()) && is_null($this->getUsername()))
		{
			trigger_error('Can\'t fill without Id set.', E_USER_ERROR);
		}
		else
		{
			$result = false;

			//Initialise variables
			global $DBServer, $DBUser, $DBPass, $DBName;
			$DBTable  = 'users';

			//Make connection if we didn't get one
			$receivedConnection = isset($AConnection);
			if(!$receivedConnection)
			{
				//Connect to database
				$AConnection = new mysqli($DBServer, $DBUser, $DBPass, $DBName);

				// Check connection
				if ($AConnection -> connect_error)
				{
					trigger_error('Database connection failed: '  . $AConnection -> connect_error, E_USER_ERROR);
					return false;
				}
			}

			//Get table and put into object
			//Only fill if id or username is set. Prefer id, username only used for login
			if(!is_null($this->getId()))
			{
				$query = "SELECT * FROM users WHERE id_user = " . $this->getId() . ";";
			}
			elseif(!is_null($this->getUsername()))
			{
				$query = "SELECT * FROM users WHERE username = '" . $this->getUsername() . "';";
			}
			$userQueryResult = $AConnection->query($query);
			if($userQueryResult)
			{
				//Load user data
				$row = $userQueryResult->fetch_assoc();

				$this->setId($row['id']);
				$this->setUsername($row['username']);
				$this->password = $row['password'];
				$this->setLastLogin($row['lastlogin']);
				$this->setLastLoginIP($row['lastloginip']);
				$this->setCreated($row['created']);
				$this->setCookie($row['cookie']);
				$this->setIsAdmin($row['isadmin']);
				$this->setFirstName($row['firstname']);
				$this->setLastName($row['lastname']);
				$this->setEmail($row['email']);

				$this->setIsChanged(false);
				$this->setInDatabase(true);
				
				$result = true;
			}
			else
			{
				trigger_error("User query result was empty. Query: $query", E_USER_ERROR);
				$result = false;
			}

			if(!$receivedConnection)
			{
				//Close database connection only if we made it ourselves
				mysqli_close($connection);
			}

			return $result;
		}
	}

	//Database ##########################################
	function addToDatabase()
	{
		//Connect
		$Database = new Tdatabase;
		$Database->connect();
		
		//Check if it already exists
		if($this->getInDatabase())
		{
			$SQL="
				UPDATE `users` SET 
					id = '" . $this->getId() . "',
					username = '" . $this->getUserName() . "',
					password = '" . $this->getPassword() . "',
					lastlogin = '" . $this->getLastLogin() . "',
					lastloginip = '" . $this->getLastLoginIP() . "',
					created = '" . $this->getCreated() . "',
					cookie = '" . $this->getCookie() . "',
					isadmin = '" . $this->getIsAdmin() . "',
					firstname = '" . $this->getFirstName() . "',
					lastname = '" . $this->getLastName() . "',
					email = '" . $this->getEmail() . "'
				WHERE id=" . $this->getId() . ";";
		}
		else
		{
			//Add it (yes I auto generated all these)
			//Rewrite this someday to build these queries by looping through variables in object
			$SQL="
				INSERT INTO `users`  (
					id,
					username,
					password,
					lastlogin,
					lastloginip,
					created,
					cookie,
					isadmin,
					firstname,
					lastname,
					email)
				VALUES (
					'" . $this->getId() . "',
					'" . $this->getUserName() . "',
					'" . $this->getPassword() . "',
					'" . $this->getLastLogin() . "',
					'" . $this->getLastLoginIP() . "',
					'" . $this->getCreated() . "',
					'" . $this->getCookie() . "',
					'" . $this->getIsAdmin() . "',
					'" . $this->getFirstName() . "',
					'" . $this->getLastName() . "',
					'" . $this->getEmail() . "');";
		}

		//remove tabs and spaces. Can't be arsed to combine these regexes into one right now (since I'll have to learn regex first)
		$SQL = trim(preg_replace('/\n+/', '',preg_replace('/\t+/', '', $SQL)));
		if($Database->query($SQL))
		{
			$this->setInDatabase(true);

			//Verbreek verbinding
			$Database->disconnect();
			return TRUE;
		}

		$Database->disconnect();
		return FALSE;
	}
}
?>