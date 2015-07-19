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
	private $password; //this is the hash + salt
	private $cookie;
	private $isAdmin;
	private $firstName;
	private $lastName;
	private $email;
	private $isChanged = false;
	private $inDatabase = false;

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
		if(isset($this->lastLogin))
		{
			return $this->lastLogin;
		}
		else
		{
			return null;
		}
	}

	function getLastLoginAsString()
	{
		if(isset($this->lastLogin))
		{
			return $this->getLastLogin()->format('Y-m-d H:i:s');
		}
		else
		{
			return null;
		}
	}

	function getLastLoginIP()
	{
		return $this->lastLoginIP;
	}

	function getCreated()
	{
		// Check if we just got created
		if(!isset($this->created))
		{
			// If so, return now
			return new DateTime;
		}
		return $this->created;
	}

	function getCreatedAsString()
	{
		return $this->getCreated()->format('Y-m-d H:i:s');
	}

	function getPassword()
	{
		return $this->password;
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
			"lastLogin"   => $this->getLastLoginAsString(),
			"lastLoginIP" => $this->getLastLoginIP(),
			"created"     => $this->getCreatedAsString(),
			"isAdmin"     => $this->getIsAdmin(),
			"firstName"   => $this->getFirstName(),
			"lastName"    => $this->getLastName(),
			"email"       => $this->getEmail()
		);
	}

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
		if(gettype($ALastLogin) == "string")
		{
			if($ALastLogin == "0000-00-00 00:00:00")
			{
				unset($this->lastLogin);
			}
			else
			{
				$this->lastLogin = DateTime::createFromFormat('Y-m-d H:i:s', $ALastLogin);
			}
		}
		else
		{
			$this->lastLogin = $ALastLogin;
		}
		$this->isChanged = TRUE;
	}

	function setLastLoginIP($ALastLoginIP)
	{
		$this->lastLoginIP = $ALastLoginIP;
		$this->isChanged = TRUE;
	}

	function setPassword($APassword)
	{
		$this->password = $APassword;
		trigger_error("Password set to: " . $this->password, E_USER_NOTICE);
		$this->isChanged = TRUE;
	}

	function setCreated($ACreated)
	{
		if(gettype($ACreated) == "string")
		{
			if($ACreated == "0000-00-00 00:00:00")
			{
				unset($this->created);
			}
			else
			{
				$this->created = DateTime::createFromFormat('Y-m-d H:i:s', $ACreated);
			}
		}
		else
		{
			$this->created = $ALastLogin;
		}
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
		// Always initialise dates so php doesn't fuck up
		//$this->lastLogin = new DateTime;
		//$this->created   = new DateTime;
	}

	function login($AUsername = null, $APassword = null)
	{
		// Attempts to login and fill the user
		// Return false or true for succes or failure. Logs error to error log

		if(!is_null($AUsername) && !is_null($APassword))
		{
			$dirname = dirname(__FILE__);
			require("$dirname/database.php");
			$DBTable  = 'users';

			//Connect to database
			$database = new TDatabase;

			// Check connection
			if(!$database->connect())
			{
				return false;
			}

			//Clean up
			$AUsername = $database->Clean($AUsername);
			$APassword = $database->Clean($APassword);

			//Create and attempt to fill user
			$this->setUsername($AUsername);
			if($this->fill($database))
			{
				if($this->checkPassword($APassword))
				{
					$database->disconnect();
					return true;
				}
				else
				{
					trigger_error("Invalid password supplied for username: $AUsername", E_USER_NOTICE);
					$database->disconnect();
					return false;
				}
			}
			else
			{
				//return json_encode(array("error" => "401 Unauthorized","details" => "Invalid credentials supplied"));
				trigger_error("Invalid credentials supplied for username: $AUsername", E_USER_NOTICE);
				$database->disconnect();
				return false;
			}
		}
	}
	
	function checkPassword($APassword)
	{
		if(is_null($this->password))
		{
			trigger_error('No password set in user object', E_USER_WARNING);
			return FALSE;
		}
		else
		{
			if(password_verify($APassword, $this->password))
			{
				return TRUE;
			}
			else
			{
				return FALSE;
			}
		}
	}

	//Fill
	function fill($ADatabase = null)
	{
		if(is_null($this->getId()) && is_null($this->getUsername()))
		{
			trigger_error('Can\'t fill without Id set.', E_USER_ERROR);
		}
		else
		{
			$result = false;

			//Initialise variables
			$dirname = dirname(__FILE__);
			require_once("$dirname/database.php");
			$DBTable  = 'users';

			//Make connection if we didn't get one
			$receivedConnection = isset($ADatabase);
			if(!$receivedConnection)
			{
				// Make one
				$ADatabase = new TDatabase;
				// Make connection
				if (!$ADatabase->Connect())
				{
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
			if($ADatabase->query($query))
			{
				//Load user data
				$row = $ADatabase->QueryResult->fetch_assoc();

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
				trigger_error("User query result was empty. Query: $query", E_USER_WARNING);
				$result = false;
			}

			if(!$receivedConnection)
			{
				//Close database connection only if we made it ourselves
				$ADatabase->disconnect();
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
					username = '" . $this->getUserName() . "',
					password = '" . $this->getPassword() . "',
					lastlogin = '" . $this->getLastLoginAsString() . "',
					lastloginip = '" . $this->getLastLoginIP() . "',
					created = '" . $this->getCreatedAsString() . "',
					cookie = '" . $this->getCookie() . "',
					isadmin = '" . $this->getIsAdmin() . "',
					firstname = '" . $this->getFirstName() . "',
					lastname = '" . $this->getLastName() . "',
					email = '" . $this->getEmail() . "'
				WHERE id=" . $this->getId() . ";";
		}
		else
		{
			//It doesn't exist so add it (yes I auto generated all these)
			//Rewrite this someday to build these queries by looping through variables in object
			$SQL="
				INSERT INTO `users`  (
					username,
					password,
					created,
					cookie,
					isadmin,
					firstname,
					lastname,
					email)
				VALUES (
					'" . $this->getUserName() . "',
					'" . $this->getPassword() . "',
					'" . $this->getCreatedAsString() . "',
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

class users
{
	private $users = array();

	function fill($ADatabase = null)
	{
		//Initialise variables
		$dirname = dirname(__FILE__);
		require_once("$dirname/database.php");
		$DBTable  = 'users';

		//Make connection if we didn't get one
		$receivedConnection = !is_null($ADatabase);
		if(!$receivedConnection)
		{
			// Make one
			$ADatabase = new TDatabase;
			// Make connection
			if(!$ADatabase->Connect())
			{
				return false;
			}
		}

		// Get all the users
		$query = "SELECT * FROM $DBTable;";

		if($ADatabase->query($query))
		{
			while($row = mysqli_fetch_assoc($ADatabase->QueryResult))
			{
				trigger_error('while', E_USER_NOTICE);
				array_push($this->users, $row['username']);
			}

			$result = true;
		}
		else
		{
			$result = false;
		}

		if(!$receivedConnection)
		{
			//Close database connection only if we made it ourselves
			$ADatabase->disconnect();
		}

		return $result;
	}

	function getAsArray()
	{
		return $this->users;
	}
}
?>