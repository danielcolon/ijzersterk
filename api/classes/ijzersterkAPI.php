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
	
			//Login
			if($this->verb == "login" && $this->method == 'PUT')
			{
				$PUTArray = json_decode($this->file, true);
				// Check if it worked
				if(is_null($PUTArray))
				{
					return json_encode(array("error" => "400 Bad Request","details" => "Couldn't decode json in PUT data"));
				}
				// Get the username and password
				$AUserName = $PUTArray["username"];
				$APassWord = $PUTArray["password"];

				// Check if we got those
				if(is_null($AUserName) || is_null($APassWord))
				{
					return json_encode(array("error" => "400 Bad Request","details" => "Username or password missing from PUT data"));
				}

				//Connect to database
				$connection = new mysqli($DBServer, $DBUser, $DBPass, $DBName);
				
				// Check connection
				if ($connection->connect_error)
				{
					trigger_error('Error connecting to database: ' . $connection->error, E_USER_WARNING);
					return json_encode(array("error" => "500 Internal Server Error","details" => "Couldn't connect to database"));
				}

				//Clean up
				$AUserName = mysqli_real_escape_string($connection, $AUserName);
				$APassWord = mysqli_real_escape_string($connection, $APassWord);

				//Create and attempt to fill user
				$AUser = new user;
				$AUser->setUsername($AUserName);
				if($AUser->fill($connection))
				{
					if($AUser->checkPassword($APassWord))
					{
						$_SESSION['user'] = serialize($AUser);

						setLoginCookie($connection);
						return json_encode(array("result" => "200 OK", "details" => "User logged in.","user" => $AUser));

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
	}
?>