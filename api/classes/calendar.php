<?php

//Load external PHP scripts
$dirname = dirname(__FILE__);
require_once("$dirname/../settings.php");
require_once("$dirname/database.php");

class calendarEvent
{
	//Properties
	private $id;
	private $title;
	private $description;
	private $start;
	private $end;
	private $editLevel;
	private $viewLevel;
	private $inDatabase;
	private $isChanged;

	//Getters
	function getId()
	{
		return $this->id;
	}
	function getTitle()
	{
		return $this->title;
	}
	function getDescription()
	{
		return $this->description;
	}
	function getStart($AsUTC = FALSE)
	{
		if($AsUTC && isset($this->start))
		{
			return $this->start->format(DateTime::ISO8601);
		}
		return $this->start;
	}
	function getEnd($AsUTC = FALSE)
	{
		if($AsUTC && isset($this->end))
		{
			return $this->end->format(DateTime::ISO8601);
		}
		return $this->end;
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
			"title"       => $this->getTitle(),
			"description" => $this->getDescription(),
			"start"       => $this->getStart(true),
			"end"         => $this->getEnd(true),
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
				$this->start = DateTime::createFromFormat('Y-m-d H:i:s', $Astart);
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
				$this->end = DateTime::createFromFormat('Y-m-d H:i:s', $Aend);
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
				title = '" . $this->getTitle() . "',
				description = '" . $this->getDescription() . "',
				start = '" . $this->getStart() . "',
				end = '" . $this->getEnd() . "',
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
				title,
				description,
				start,
				end,
				editlevel,
				viewlevel)
			VALUES (
				'" . $this->getId() . "',
				'" . $this->getTitle() . "',
				'" . $this->getDescription() . "',
				'" . $this->getStart() . "',
				'" . $this->getEnd() . "',
				'" . $this->getEditLevel() . "',
				'" . $this->getViewLevel() . "');";
		}

		//remove tabs and spaces. Can't be arsed to combine these regexes into one right now (since I'll have to learn regex first)
		$SQL = trim(preg_replace('/\n+/', '',preg_replace('/\t+/', '', $SQL)));
		if($Database->query($SQL))
		{
			trigger_error("Query succes", E_USER_NOTICE);
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
		CREATE TABLE `ijzersterk`.`calendar` (
			`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
			`title` VARCHAR(128) NULL,
			`description` VARCHAR(512) NULL,
			`start` DATETIME NULL,
			`end` DATETIME NULL,
			`viewlevel` TINYINT NULL,
			`editlevel` TINYINT NULL,
		PRIMARY KEY (`id`));";

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