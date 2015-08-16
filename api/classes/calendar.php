<?php

//Load external PHP scripts
$dirname = dirname(__FILE__);
require_once("$dirname/../settings.php");
require_once("$dirname/database.php");

class calendarEvent
{
	//Properties
	private $id;
	private $idOwner;
	private $idEventType;
	private $title;
	private $description;
	private $start;
	private $editLevel;
	private $viewLevel;
	private $inDatabase;
	private $isChanged;
	private $end;

	//Getters
	function getId()
	{
		return $this->id;
	}
	function getIdOwner()
	{
		return $this->idOwner;
	}
	function getIdEventType()
	{
		return $this->idEventType;
	}
	function getTitle()
	{
		return $this->title;
	}
	function getDescription()
	{
		return $this->description;
	}
	function getStart()
	{
		return $this->start;
	}
	function getStartAsString($AsUTC = FALSE)
	{
		// First check if it's even set
		if(is_null($this->getStart()))
		{
			return NULL;
		}

		if($AsUTC)
		{
			return $this->getStart()->format(DateTime::ISO8601);
		}
		// Default is for SQL
		return $this->getStart()->format('Y-m-d H:i:s');
	}
	function getEnd()
	{
		return $this->end;
	}
	function getEndAsString($AsUTC = FALSE)
	{
		// First check if it's even set
		if(is_null($this->getEnd()))
		{
			return NULL;
		}

		if($AsUTC)
		{
			return $this->getEnd()->format(DateTime::ISO8601);
		}
		// Default is for SQL
		return $this->getStart()->format('Y-m-d H:i:s');
	}
	function getEditLevel()
	{
		return $this->editLevel;
	}
	function getViewLevel()
	{
		return $this->viewLevel;
	}
	function getInDatabase()
	{
		return $this->inDatabase;
	}
	function getIsChanged()
	{
		return $this->isChanged;
	}

	function getAsAssociativeArray()
	{
		return array(
			"id"          => $this->getId(),
			"idowner"     => $this->getIdOwner(),
			"ideventtype" => $this->getIdEventType(),
			"title"       => $this->getTitle(),
			"description" => $this->getDescription(),
			"start"       => $this->getStartAsString(true),
			"end"         => $this->getEndAsString(true),
			"viewlevel"   => $this->getViewLevel(),
			"editlevel"   => $this->getEditlevel()
		);
	}

	//Setters
	function setId($Aid)
	{
		$this->id = $Aid;
		$this->FIsChanged = TRUE;
	}
	function setIdOwner($AidOwner)
	{
		$this->idOwner = $AidOwner;
		$this->FIsChanged = TRUE;
	}
	function setIdEventType($AidEventType)
	{
		$this->idEventType = $AidEventType;
		$this->FIsChanged = TRUE;
	}
	function setTitle($Atitle)
	{
		$this->title = $Atitle;
		$this->FIsChanged = TRUE;
	}
	function setDescription($Adescription)
	{
		$this->description = $Adescription;
		$this->FIsChanged = TRUE;
	}
	function setStart($Astart)
	{
		if(gettype($Astart) == "string")
		{
			if($Astart == "0000-00-00 00:00:00")
			{
				unset($this->start);
			}
			else
			{
				if(DateTime::createFromFormat('Y-m-d H:i:s', $Astart) != false)
				{
					$this->start = DateTime::createFromFormat('Y-m-d H:i:s', $Astart);
				}
				else
				{
					$this->start = DateTime::createFromFormat(DateTime::ISO8601, $Astart);
				}
			}
		}
		else
		{
			$this->start = $Astart;
		}
		$this->isChanged = TRUE;
		$this->FIsChanged = TRUE;
	}
	function setEnd($Aend)
	{
		if(gettype($Aend) == "string")
		{
			if($Aend == "0000-00-00 00:00:00")
			{
				unset($this->end);
			}
			else
			{
				if(DateTime::createFromFormat('Y-m-d H:i:s', $Aend) != false)
				{
					$this->end = DateTime::createFromFormat('Y-m-d H:i:s', $Aend);
				}
				else
				{
					$this->end = DateTime::createFromFormat(DateTime::ISO8601, $Aend);
				}
			}
		}
		else
		{
			$this->end = $Aend;
		}
		$this->FIsChanged = TRUE;
	}
	function setEditLevel($AeditLevel)
	{
		$this->editLevel = $AeditLevel;
		$this->FIsChanged = TRUE;
	}
	function setViewLevel($AviewLevel)
	{
		$this->viewLevel = $AviewLevel;
		$this->FIsChanged = TRUE;
	}
	function setInDatabase($AinDatabase)
	{
		$this->inDatabase = $AinDatabase;
		$this->FIsChanged = TRUE;
	}
	function setIsChanged($AIsChanged)
	{
		$this->IsChanged = $AIsChanged;
	}

	//Construct
	function __construct()
	{
		// Do nothing
	}

	//Fill
	function fill()
	{
		if(is_null($this->getId()))
		{
			trigger_error('Can\'t fill without Id set.', E_USER_ERROR);
		}
		else
		{
			$result = false;

			//Initialise variables
			$dirname = dirname(__FILE__);
			require_once("$dirname/database.php");
			$DBTable  = 'calendar';

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
				$query = "SELECT * FROM $DBTable WHERE id = " . $this->getId() . ";";
			}

			if($ADatabase->query($query) && $ADatabase->num_rows > 0)
			{
				//Load calendar data
				$row = $ADatabase->QueryResult->fetch_assoc();

				$this->setId($row['id']);
				$this->setIdOwner($row['idowner']);
				$this->setIdEventType($row['ideventtype']);
				$this->setTitle($row['title']);
				$this->setDescription($row['description']);
				$this->setStart($row['start']);
				$this->setEnd($row['end']);
				$this->setViewLevel($row['viewlevel']);
				$this->setEditLevel($row['editlevel']);

				$this->setIsChanged(false);
				$this->setInDatabase(true);
				
				$result = true;
			}
			else
			{
				trigger_error("Calendar query result was empty. Query: $query", E_USER_WARNING);
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

	function addToDatabase()
	{
		//Connect
		$Database = new Tdatabase;
		$Database->connect();
		
		//Check if it already exists
		if($this->getInDatabase())
		{
			$SQL="
				UPDATE `calendar` SET 
				id = '" . $this->getId() . "',
				idowner = '" . $this->getIdOwner() . "',
				ideventtype = '" . $this->getIdEventType() . "',
				title = '" . $this->getTitle() . "',
				description = '" . $this->getDescription() . "',
				start = '" . $this->getStartAsString() . "',
				end = '" . $this->getEndAsString() . "',
				editlevel = '" . $this->getEditLevel() . "',
				viewlevel = '" . $this->getViewLevel() . "'
				WHERE id=" . $this->getId() . ";";
		}
		else
		{
			//It doesn't exist so add it (yes I auto generated all these)
			//Rewrite this someday to build these queries by looping through variables in object
			$SQL="
				INSERT INTO `calendar`  (
				id,
				idowner,
				ideventtype,
				title,
				description,
				start,
				end,
				editlevel,
				viewlevel)
			VALUES (
				'" . $this->getId() . "',
				'" . $this->getIdOwner() . "',
				'" . $this->getIdEventType() . "',
				'" . $this->getTitle() . "',
				'" . $this->getDescription() . "',
				'" . $this->getStartAsString() . "',
				'" . $this->getEndAsString() . "',
				'" . $this->getEditLevel() . "',
				'" . $this->getViewLevel() . "');";
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

class calendar
{
	private $calendarEvents = array();

	function getAsAssociativeArray()
	{
		$result = array();
		foreach($this->calendarEvents as $ACalendarEvent)
		{
			array_push($result, $ACalendarEvent->getId());
		}
		return $result;
	}

	//Fill
	function fill()
	{
		$result = false;

		//Initialise variables
		$dirname = dirname(__FILE__);
		require_once("$dirname/database.php");
		$DBTable  = 'calendar';

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
		$query = "SELECT * FROM $DBTable;";

		if($ADatabase->query($query) && $ADatabase->num_rows > 0)
		{
			while($row = mysqli_fetch_assoc($ADatabase->QueryResult))
			{
				// Put into calendarEvents
				$ACalendarEvent = new calendarEvent;
				$ACalendarEvent->setId($row['id']);
				$ACalendarEvent->setIdOwner($row['idowner']);
				$ACalendarEvent->setIdEventType($row['ideventtype']);
				$ACalendarEvent->setTitle($row['title']);
				$ACalendarEvent->setDescription($row['description']);
				$ACalendarEvent->setStart($row['start']);
				$ACalendarEvent->setEnd($row['end']);
				$ACalendarEvent->setViewLevel($row['viewlevel']);
				$ACalendarEvent->setEditLevel($row['editlevel']);

				$ACalendarEvent->setIsChanged(false);
				$ACalendarEvent->setInDatabase(true);
				array_push($this->calendarEvents, $ACalendarEvent);

				$result = true;
			}
		}
		else
		{
			trigger_error("Calendar query result was empty. Query: $query", E_USER_WARNING);
			$result = false;
		}

		if(!$receivedConnection)
		{
			//Close database connection only if we made it ourselves
			$ADatabase->disconnect();
		}

		return $result;
	}

	function createTable()
	{
		//Connect
		$Database = new Tdatabase;
		$Database->connect();

		$SQL = "
		CREATE TABLE `calendar`
		(
			`id` int(10) unsigned NOT NULL AUTO_INCREMENT,
			`title` varchar(128) DEFAULT NULL,
			`description` varchar(512) DEFAULT NULL,
			`start` datetime DEFAULT NULL,
			`end` datetime DEFAULT NULL,
			`viewlevel` tinyint(4) DEFAULT NULL,
			`editlevel` tinyint(4) DEFAULT NULL,
			`idowner` int(6) DEFAULT NULL,
			`ideventtype` int(6) DEFAULT NULL,
			PRIMARY KEY (`id`)
		)";
		

		//remove tabs and spaces. Can't be arsed to combine these regexes into one right now (since I'll have to learn regex first)
		$SQL = trim(preg_replace('/\n+/', '',preg_replace('/\t+/', '', $SQL)));
		if($Database->query($SQL))
		{
			trigger_error("Calendar table succesfully created", E_USER_NOTICE);

			//Verbreek verbinding
			$Database->disconnect();
			return TRUE;
		}

		$Database->disconnect();
		return FALSE;
	}
}
?>