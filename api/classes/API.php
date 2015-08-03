<?php
abstract class API
{
	// Source: http://coreymaynard.com/blog/creating-a-restful-api-with-php/
    /**
     * Property: method
     * The HTTP method this request was made in, either GET, POST, PUT or DELETE
     */
    protected $method = '';
    /**
     * Property: endpoint
     * The Model requested in the URI. eg: /files
     */
    protected $endpoint = '';
    /**
     * Property: verb
     * An optional additional descriptor about the endpoint, used for things that can
     * not be handled by the basic methods. eg: /files/process
     */
    protected $verb = '';
    /**
     * Property: args
     * Any additional URI components after the endpoint and verb have been removed, in our
     * case, an integer ID for the resource. eg: /<endpoint>/<verb>/<arg0>/<arg1>
     * or /<endpoint>/<arg0>
     */
    protected $args = Array();
    /**
     * Property: file
     * Stores the input of the PUT request
     */
     protected $file = Null;

     // Allow IJzersterkAPI to set the response code
     protected $responseCode = 200;
     
    /**
     * Constructor: __construct
     * Allow for CORS, assemble and pre-process the data
     */
    public function __construct($request)
    {
        //header("Access-Control-Allow-Orgin: *");
        //header("Access-Control-Allow-Methods: *");
        header("Content-Type: application/json");
        
        // Proper CORS
        // Allow from any origin
		if (isset($_SERVER['HTTP_ORIGIN'])) {
			header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
			header('Access-Control-Allow-Credentials: true');
			header('Access-Control-Max-Age: 86400');    // cache for 1 day
		}

		// Access-Control headers are received during OPTIONS requests
		if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
				header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");         

			if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
				header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
			exit(0);
		}

        $this->args = explode('/', rtrim($request, '/'));
        $this->endpoint = array_shift($this->args);
        if(array_key_exists(0, $this->args) && !is_numeric($this->args[0]))
        {
            $this->verb = array_shift($this->args);
        }

        $this->method = $_SERVER['REQUEST_METHOD'];
        if($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER))
        {
            if($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE')
            {
                $this->method = 'DELETE';
            } 
            else if($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT')
            {
                $this->method = 'PUT';
            }
            else
            {
                $this->_response(json_encode(array("status" => "400 Bad Request","details" => "Unexpected header")), 400);
            }
        }

        switch($this->method) {
        case 'DELETE':
        case 'POST':
            $this->request = $this->_cleanInputs($_POST);
            break;
        case 'GET':
            $this->request = $this->_cleanInputs($_GET);
            break;
        case 'PUT':
            $this->request = $this->_cleanInputs($_GET);
            $this->file = file_get_contents("php://input");
            break;
		//case 'OPTIONS':
		//	$this->_response(json_encode(array("status" => "200 OK","details" => "OPTIONS")), 200);
        default:
			$this->responseCode = 405;
            $this->_response(json_encode(array("status" => "405 Method Not Allowed","details" => "Method Not Allowed")), 405);
            break;
        }
    }
    
     public function processAPI()
     {
        if(method_exists($this, $this->endpoint))
        {
            return $this->_response($this->{$this->endpoint}($this->args), $this->responseCode);
        }
        return $this->_response(json_encode(array("status" => "404 Not Found","details" => "No Endpoint: $this->endpoint")), 404);
    }

    private function _response($data, $status = 200) {
        header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        return json_encode($data);
    }

    private function _cleanInputs($data) {
        $clean_input = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } else {
            $clean_input = trim(strip_tags($data));
        }
        return $clean_input;
    }

    private function _requestStatus($code) {
        $status = array(  
            200 => 'OK',
            201 => 'Created',
            400 => 'Bad Request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not Found',   
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
        ); 
        return ($status[$code])?$status[$code]:$status[500]; 
    }
}
?>