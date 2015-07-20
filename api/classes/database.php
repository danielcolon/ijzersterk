<?php
	class TDatabase
	{
		public $Connection;
		public $QueryResult;
		public $num_rows;
		public $DBName = "ijzersterk";

		function connected()
		{
			if(isset($this->Connection))
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		function connect()
		{
			//Check if we're not already connected
			if($this->Connected())
			{
				return true;
			}

			//Define database variables
			$dirname = dirname(__FILE__);
			require("$dirname/../settings.php");

			// Create Connection
			$this->Connection = new mysqli($DBServer, $DBUser, $DBPass, $DBName);

			// check Connection
			if ($this->Connection->connect_error)
			{
				trigger_error("Database Connection failed: "  . $this->Connection -> connect_error, E_USER_ERROR);
			}
			else
			{
				mysqli_select_db($this->Connection, $this->DBName);
				$this->num_rows = 0;
				return true;
			}
		}

		function clean($AQuery)
		{
			if(!$this->connected())
			{
				trigger_error("Can't clean without database connection ", E_USER_ERROR);
				return false;
			}
			else
			{
				return mysqli_real_escape_string($this->Connection, $AQuery);
			}
		}

		function query($AQuery = Null)
		{
			if(!isset($this->Connection))
			{
				trigger_error("Can't query without database Connection", E_USER_ERROR);
				return false;
			}

			if(!isset($AQuery))
			{
				trigger_error("Can't query without query", E_USER_ERROR);
				return false;
			}

			//Query
			$this->QueryResult = $this->Connection->query($AQuery);
			if($this->QueryResult === false)
			{
				trigger_error("Query failed: "  . mysqli_error($this->Connection) . " with query $AQuery ", E_USER_WARNING);
				return false;
			}
			/*else if($this->QueryResult->num_rows <= 0)
			{
				trigger_error("Empty query result", E_USER_WARNING);
				return false;
			}*/
			else
			{
				$this->num_rows = gettype($this->QueryResult) == 'object' ? $this->QueryResult->num_rows : 0;

				return true;
			}
		}

		function disconnect()
		{
			if($this->connected())
			{
				mysqli_close($this->Connection);
				return true;
			}
			else
			{
				return true;
			}
		}
	}
?>