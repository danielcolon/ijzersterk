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
				'requestinfo'
				//'calendar' //Some of calendar is accessible to the public.
			);
			$publicVerbs = array(
				'verify' => 'user'
			);

			// Only allow access without logging in to allow endpoints or to an endpoints verb
			// if the verb exists in the pubicVerbs array and matches the endpoint
			if(in_array($this->endpoint, $publicFunctions) || (array_key_exists($this->verb, $publicVerbs) && $publicVerbs[$this->verb] == $this->endpoint))
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

		protected function getDecodedData()
		{
			// Get the data being put
			$PUTArray = json_decode($this->file, true);

			// Check if it worked
			if(is_null($PUTArray))
			{
				// Indicate something went wrong
				return null;
			}

			// Sanitize user input
			$DBTable  = 'users';

			//Connect to database
			$database = new TDatabase;

			// Check connection
			if(!$database->connect())
			{
				return null;
			}

			// Clean up
			// &$value: use reference! This is NOT a pointer.
			foreach ($PUTArray as $key => &$value)
			{
				$value = $database->clean($value);
			}

			$database->disconnect();
			return $PUTArray;
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
				'data'     => $this->file,
				'request'  => $this->request,
				'username'     => isset($_SERVER['PHP_AUTH_USER']) ? $_SERVER['PHP_AUTH_USER'] : 'No user provided',
				'password' => isset($_SERVER['PHP_AUTH_PW']) ? $_SERVER['PHP_AUTH_PW'] : 'No password provided'
			);
			return json_encode(array("status" => "200 OK","details" => "RequestInfo returned","result" => $result));
		}

		protected function calendar()
		{
			$dirname = dirname(__FILE__);
			require_once("$dirname/calendar.php");
			switch($this->method){
				case 'GET':
					// Empty verb means user requested a list calendar events
					if($this->verb == "")
					{
						// Unless and id was supplied as argument
						if(isset($this->args[0]) && is_numeric($this->args[0]))
						{
							// Try to return the calendarEvent for the given id
							// We don't have to clean input since it's just an int.
							$ACalendarEvent = new calendarEvent;
							$ACalendarEvent->setId($this->args[0]);
							if($ACalendarEvent->fill())
							{
								$this->responseCode = 200;
								return json_encode(array("status" => "200 OK","details" => "calendarEvent returned", "result" =>  $ACalendarEvent->getAsAssociativeArray()));
							}
							else
							{
								$this->responseCode = 404;
								return json_encode(array("status" => "404 Not Found","details" => "Couldn't find calendarEvent " . $this->args[0]));
							}
						}
						else
						{
							// If we have an empty verb and no args the user has requested a list of calendarEvents
							$ACalendar = new calendar;
							if($ACalendar->fill())
							{
								$this->responseCode = 200;
								return json_encode(array("status" => "200 OK","details" => "calendar returned", "result" =>  $ACalendar->getAsAssociativeArray()));
							}
							else
							{
								// Something went wrong
								$this->responseCode = 500;
								return json_encode(array("status" => "500 Internal Server Error","details" => "Couldn't fill calendar"));
							}
						}
					}
					else
					{
						//We can't have verbs in the calendar since everything works by id
						$this->responseCode = 400;
						return json_encode(array("status" => "400 Bad Request","details" => "calendarEvents are accessed by their integer id."));
					}
				break;
				default:
					$this->responseCode = 405;
					return json_encode(array("status" => "405 Method Not Allowed","details" => "Method Not Allowed"));
				break;
			}
		}

		protected function user()
		{
			$dirname = dirname(__FILE__);
			require_once("$dirname/user.php");
			require_once("$dirname/../lib/cookies.php");
			require_once("$dirname/../lib/sessions.php");
	
			switch($this->verb){
				// Empty verb means user requested a list of usernames
				case "":
					switch($this->method){
						case 'GET':
							// Return a list of usernames
							// Only admins can see all users
							if($this->currentUser->getIsAdmin())
							{
								$AUsers = new users;
								if($AUsers->fill())
								{
									$this->responseCode = 200;
									return json_encode(array("status" => "200 OK", "details" => "List of users returned", "result" => $AUsers->getAsArray()));
								}
								else
								{
									$this->responseCode = 500;
									return json_encode(array("status" => "500 Internal Server Error","details" => "Couldn't load users"));
								}
							}
							$this->responseCode = 403;
							return json_encode(array("status" => "403 Forbidden","details" => "Admin rights required"));
						break;
						default:
							$this->responseCode = 405;
							return json_encode(array("status" => "405 Method Not Allowed","details" => "Method Not Allowed"));
						break;
					}
				break;
				// user/verify is a public function to check username and password
				case "verify":
					switch($this->method){
						case 'POST':
							// Always respond 200
							$this->responseCode = 200;

							$this->currentUser = new user;
							if(!$this->currentUser->login($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW']))
							{
								$result = array("isOk" => FALSE);
							}
							else
							{
								$result = array("isOk" => TRUE);
							}
							return json_encode(array("status" => "200 OK", "details" => "User verified", "result" => $result));
						break;
						default:
							$this->responseCode = 405;
							return json_encode(array("status" => "405 Method Not Allowed","details" => "Method Not Allowed"));
						break;
					}
				break;
				// Any verb that's not empty or verify means we'll have to look for a user with that name
				default:
					// Clean up input first.
					// First set up database connection
					$ADatabase = new TDatabase;
					if(!$ADatabase->Connect())
					{
						$this->responseCode = 500;
						return json_encode(array("status" => "500 Internal Server Error","details" => "Couldn't connect to database"));
					}
					$this->verb = $ADatabase->clean($this->verb);
					// Don't keep the connection for fills.
					// slightly less optimized but we won't have to close through hoops
					// to close if before returning
					$ADatabase->disconnect();

					switch($this->method){
						case 'GET':
							// Only let admins or the user themselves see the user
							if($this->verb == $this->currentUser->getUsername() || $this->currentUser->getIsAdmin())
							{
								// See if it's the logged in user, if so, return it
								if($this->verb == $this->currentUser->getUsername())
								{
									$this->responseCode = 200;
									return json_encode(array("status" => "200 OK", "details" => "Current user returned", "result" => $this->currentUser->getAsAssociativeArray()));
								}
								// Try to fill for the given username
								$Auser = new user;
								$Auser->setUsername($this->verb);
								if($Auser->fill())
								{
									return json_encode(array("status" => "200 OK", "details" => "User returned", "result" => $Auser->getAsAssociativeArray()));
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
						break;
						case 'PUT':
							// We're either going to make a new user or update one
							// Either way you can only change your own user unless you're an admin
							if($this->verb == $this->currentUser->getUsername() || $this->currentUser->getIsAdmin())
							{
								// Create a user
								$AUser = new user;
								$AUser->setUsername($this->verb);

								// Get a sanitized version of the data put
								$PUTArray = $this->getDecodedData();

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
								if(isset($PUTArray["isAdmin"]) && $this->currentUser->getIsAdmin()) $AUser->setIsAdmin($PUTArray["isAdmin"]); // Only let admins set isadmin
								if(isset($PUTArray["firstName"])) $AUser->setFirstName($PUTArray["firstName"]);
								if(isset($PUTArray["lastName"])) $AUser->setLastName($PUTArray["lastName"]);
								if(isset($PUTArray["email"])) $AUser->setEmail($PUTArray["email"]);

								// The user object will handle whether we'll add a user or update a user depending on if
								// it was found in the database or not
								if($AUser->addToDatabase())
								{
									if($isNew) 
									{
										$this->responseCode = 201;
										return json_encode(array("status" => "201 Created", "details" => "New user succesfully created","result" => $AUser->getAsAssociativeArray()));
									}
									else
									{
										$this->responseCode = 200;
										return json_encode(array("status" => "200 OK", "details" => "User succesfully updated","result" => $AUser->getAsAssociativeArray()));
									}
								}
							}
							else
							{
								$this->responseCode = 403;
								return json_encode(array("status" => "403 Forbidden","details" => "Only administrators can edit users other than themselves."));
							}
						break;
						case 'DELETE':
							// Only let admins delete users
							if($this->currentUser->getIsAdmin())
							{
								// Try to fill for the given username
								$AUser = new user();
								$AUser->setUsername($this->verb);
								if($AUser->fill())
								{
									// Admins cannot be deleted from the front end.
									if($AUser->getIsAdmin())
									{
										$this->responseCode = 403;
										return json_encode(array("status" => "403 Forbidden","details" => "Administrators cannot be deleted."));
									}

									// Delete it
									if($AUser->Delete())
									{
										$this->responseCode = 200;
										return json_encode(array("status" => "200 OK", "details" => "User " . $this->verb . " succesfully deleted."));
									}
									else
									{
										$this->responseCode = 500;
										return json_encode(array("status" => "500 Internal Server Error","details" => "Couldn't delete user " . $this->verb . "."));
									}
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
						break;
						default:
							$this->responseCode = 405;
							return json_encode(array("status" => "405 Method Not Allowed","details" => "Method Not Allowed"));
						break;
					}
				break;
			}

			// Apparantly something went wrong if we still haven't returned
			$this->responseCode = 400;
			return json_encode(array("status" => "400 Bad Request","details" => "Nothing was done"));
		}
	}
?>