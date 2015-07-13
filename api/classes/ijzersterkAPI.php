<?php
	require_once 'API.php';

	class ijzersterkAPI extends API
	{
		protected $User;

		public function __construct($request, $origin)
		{
			parent::__construct($request);

			/*
			// Abstracted out for example
			$APIKey = new Models\APIKey();
			$User = new Models\User();

			if (!array_key_exists('apiKey', $this->request)) {
				throw new Exception('No API Key provided');
			} else if (!$APIKey->verifyKey($this->request['apiKey'], $origin)) {
				throw new Exception('Invalid API Key');
			} else if (array_key_exists('token', $this->request) &&
				!$User->get('token', $this->request['token'])) {

				throw new Exception('Invalid User Token');
			}
			*/

			//$this->User = $User;
		}

		/**
		* Example of an Endpoint
		*/
		protected function example()
		{
			if($this->method == 'GET')
			{
				return "You just got example!";
				//return "Your name is " . $this->User->name;
			}
			elseif($this->method == 'PUT')
			{
				return "You just PUT: " . $this->file;
			}
			else
			{
				return "Only accepts GET requests";
			}
		}
		
		protected function requestinfo()
		{
			return json_encode(array(
				'method'   => $this->method,
				'endpoint' => $this->endpoint,
				'verb'     => $this->verb,
				'args'     => $this->args,
				'file'     => $this->file,
				'request'  => $this->request
			));
		}
		
		protected function user()
		{
			$dirname = dirname(__FILE__);
			require_once("$dirname/user.php");
			require_once("$dirname/../lib/cookies.php");
			require_once("$dirname/../lib/sessions.php");
	
			// Login
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
			}

			// Get all users
			else if($this->verb == "" && $this->method == 'GET')
			{
				// Check if we're logged in
				if(userLoggedIn())
				{
					// Now get the user
					$AUser = $_SESSION['user'];

					// Only admins can see all users
					if($AUser->getIsAdmin())
					{
						return json_encode(array("result" => "200 OK", "details" => "User list retrieved"));
					}
					else
					{
						return json_encode(array("error" => "403 Forbidden","details" => "Admin rights required"));
					}
				}
				else
				{
					return json_encode(array("error" => "401 Unauthorized","details" => "User not logged in"));
				}
			}
		}
	}
?>