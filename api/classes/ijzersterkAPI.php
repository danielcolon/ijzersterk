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
	}
?>