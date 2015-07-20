<?php
	require_once 'API.php';

	class ijzersterkAPI extends API
	{
		protected $currentUser;

		public function __construct($request, $origin)
		{
			parent::__construct($request);

			// Might do stuff here later
		}

		public function processAPI()
		{
			// We'll allow anyone to access certain functions
			$publicFunctions = array(
			'requestinfo',
			'temp'
			);
			if(in_array($this->endpoint, $publicFunctions))
			{
				return parent::processAPI();
			}

			// Extend our parent's function and log in the user before processing the rest of the request
			$dirname = dirname(__FILE__);
			require_once("$dirname/user.php");
			require_once("$dirname/../lib/cookies.php");
			require_once("$dirname/../lib/sessions.php");

			//Authenticate the user for every call
			// Get the username and password from the header
			if(!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']))
			{
				$this->responseCode = 400;
				return json_encode(array("status" => "400 Bad Request","details" => "Username or password not provided"));
			}

			$this->currentUser = new user;
			if(!$this->currentUser->login($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']))
			{
				//return json_encode(array("status" => "401 Unauthorized", "details" => "Invalid credentials supplied"));
				$this->responseCode = 401;
				return json_encode(array("status" => "401 Unauthorized", "details" => "Invalid credentials supplied"));
			}

			// Thén do the actual processing
			return parent::processAPI();
		}

		// Show sender what he sent for debugging
		protected function requestinfo()
		{
			$this->responseCode = 200;
			$result = array(
				'method'   => $this->method,
				'endpoint' => $this->endpoint,
				'verb'     => $this->verb,
				'args'     => $this->args,
				'file'     => $this->file,
				'request'  => $this->request,
				'user'     => isset($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : 'No user provided',
				'password' => isset($_SERVER['PHP_AUTH_PW']) ? $_SERVER['PHP_AUTH_PW'] : 'No password provided'
			);
			return json_encode(array("status" => "200 OK","details" => "RequestInfo returned","result" => $result));
		}

		protected function user()
		{
			$dirname = dirname(__FILE__);
			require_once("$dirname/user.php");
			require_once("$dirname/../lib/cookies.php");
			require_once("$dirname/../lib/sessions.php");
	
			if($this->verb == "" && $this->method == 'GET')
			{
				//Return a list of usernames
				// Only admins can see all users
				if($this->currentUser->getIsAdmin())
				{
					$AUsers = new users;
					if($AUsers->fill())
					{
						$this->responseCode = 200;
						return json_encode(array("status" => "200 OK", "result" => $AUsers->getAsArray()));
					}
					else
					{
						$this->responseCode = 500;
						return json_encode(array("status" => "500 Internal Server Error","details" => "Couldn't load users"));
					}
				}
				$this->responseCode = 403;
				return json_encode(array("status" => "403 Forbidden","details" => "Admin rights required"));
			}
			else if($this->method == 'GET')
			{
				// Only let admins or the user themselves see the user
				if($this->verb == $this->currentUser->getUsername() || $this->currentUser->getIsAdmin())
				{
					// See if t's the logged in user, if so, return it
					if($this->verb == $this->currentUser->getUsername())
					{
						$this->responseCode = 200;
						return json_encode(array("status" => "200 OK", "result" => $this->currentUser->getAsAssociativeArray()));
					}

					// Try to fill for the given username
					$Auser = new user;
					$Auser->setUsername($this->verb);
					if($Auser->fill())
					{
						return json_encode(array("status" => "200 OK", "result" => $Auser->getAsAssociativeArray()));
					}
					else
					{
						$this->responseCode = 404;
						return json_encode(array("status" => "404 Not Found","details" => "Couldn't find user " . $this->verb));
					}
				}
				else
				{
					$this->responseCode = 403;
					return json_encode(array("status" => "403 Forbidden","details" => "Admin rights required"));
				}
			}
			else if($this->verb != "" && $this->method == 'PUT')
			{
				// We're either going to make a new user or update one
				// Either way you can only change your own user unless you're an admin
				if($this->verb == $this->currentUser->getUsername() || $this->currentUser->getIsAdmin())
				{
					// Create a user
					$AUser = new user;
					$AUser->setUsername($this->verb);

					// Get the data being put
					$PUTArray = json_decode($this->file, true);

					// Check if it worked
					if(is_null($PUTArray))
					{
						$this->responseCode = 400;
						return json_encode(array("status" => "400 Bad Request","details" => "Couldn't decode json input data"));
					}

					if(!$AUser->fill() && !isset($PUTArray["password"]))
					{
						$this->responseCode = 400;
						//If the user doesn't exist yet we need to make sure there's a new password in the data
						return json_encode(array("status" => "400 Bad Request","details" => "No password provided for new user"));
					}

					// Remember if we're a new user
					$isNew = !$AUser->getInDatabase();

					// If we get a password we'll have to hash it
					if(isset($PUTArray["password"]))
					{
						$AUser->setPassword(password_hash($PUTArray["password"], PASSWORD_DEFAULT));
					}

					// Now get the other stuff
					$AUser->setUsername($this->verb);
					if(isset($PUTArray["isadmin"]) && $this->currentUser->getIsAdmin()) $AUser->setIsAdmin($PUTArray["isadmin"]); // Only let admins set isadmin
					if(isset($PUTArray["firstname"])) $AUser->setFirstName($PUTArray["firstname"]);
					if(isset($PUTArray["lastname"])) $AUser->setLastName($PUTArray["lastname"]);
					if(isset($PUTArray["email"])) $AUser->setEmail($PUTArray["email"]);

					// The user object will handle whether we'll add a user or update a user depending on if
					// it was found in the database or not
					if($AUser->addToDatabase())
					{
						if($isNew) 
						{
							$this->responseCode = 201;
							return json_encode(array("result" => "201 Created", "details" => "New user succesfully created","result" => $AUser->getAsAssociativeArray()));
						}
						else
						{
							$this->responseCode = 200;
							return json_encode(array("result" => "200 Ok", "details" => "User succesfully updated","result" => $AUser->getAsAssociativeArray()));
						}
					}
				}
			}

			// Apparantly somethign went wrong if we still haven't returned
			$this->responseCode = 400;
			return json_encode(array("status" => "400 Bad Request","details" => "Nothing was done"));

			/* Login (Might still want to use some of this when implementing OAuth)
			if($this->verb == "login" && $this->method == 'PUT')
			{
				$PUTArray = json_decode($this->file, true);
				// Check if it worked
				if(is_null($PUTArray))
				{
					return json_encode(array("error" => "400 Bad Request","details" => "Couldn't decode json in PUT data"));
				}

				// Get the username and password
				$AUsername = $PUTArray["username"];
				$APassword = $PUTArray["password"];

				// Check if we got those
				if(is_null($AUsername) || is_null($APassword))
				{
					return json_encode(array("error" => "400 Bad Request","details" => "Username or password missing from PUT data"));
				}

				$AUser = new user;
				return $AUser->login($AUsername, $APassword);
			}*/
		}
	}
?>