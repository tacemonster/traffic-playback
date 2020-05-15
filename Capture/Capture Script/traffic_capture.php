<?php
//Database configuration
$servername = "localhost";
$username = "traffic";
$password = "12345";
$database = "trafficDB";
//End script configuration block

//Connect to mysql, and cleanly handle any errors.
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error)
{
	die("Connection failed: " . $conn->connect_error . "<br>");
}
echo "Connected successfully<br>";

//define variables in the global scope for later use.
$source_ip = "0.0.0.0";
$secure = 0;
$proto = "INVAL";
$host = "invalid.capture.com";
$uri = "/";
$method = "FAIL";
$requesttime = 1588046592.000;
$headers = "";

foreach (getallheaders() as $name => $value)
{
	switch($name)
	{
	case "tpt-ip":
		$source_ip = $value;
		break;
	case "tpt-secure":
		if($value == "on")
			$secure = 1;
		break;
	case "tpt-proto":
		$proto = $value;
		break;
	case "tpt-host":
		$host = $value;
		break;
	case "tpt-uri":
		$uri = $value;
		break;
	case "tpt-method":
		$method = $value;
		break;
	case "tpt-requesttime":
		$requesttime = $value;
		break;
	default:
		$headers .= "$name:::::$value" . "\r\n";
	}
}

//if headers are empty, lets give it a default value
if(empty($headers))
	$headers = "INVALID:HEADERS";

$job_id = "";
$sql = "SELECT * from job;";
if($result = $conn->query($sql))
{
	while($row = $result->fetch_assoc())
	{
		if(	((!$row['jobStart'] && !$row['jobStop']) || ($row['jobStart'] < $requesttime && $row['jobStop'] > $requesttime)) &&
			(!$row['secure'] || preg_match($row['secure'], $secure)) &&
			(!$row['protocol'] || preg_match($row['protocol'], $proto)) &&
			(!$row['host'] || preg_match($row['host'], $host)) && 
			(!$row['uri'] || preg_match($row['uri'], $uri)) &&
			(!$row['method'] || preg_match($row['method'], $method)) && 
			(!$row['sourceip'] || preg_match($row['sourceip'], $source_ip)))
		{
			if(!$job_id)
				$job_id = $row['jobID'];
			else
				$job_id .= "," . $row['jobID'];
		}
	}
}

if($job_id == "")
{
	$conn->close();
	die();
}

$post = file_get_contents('php://input');


//Construct our sql query to log the request to the database.
$sql = "INSERT INTO raw (utime, secure, protocol, host, uri, method, header, reqbody, sourceip, jobID) VALUES ($requesttime, '$secure', '$proto', '$host', '$uri', '$method', '$headers', '$post', '$source_ip', '$job_id');";
//echo($sql);
//Execute the sql query and handle any errors.
if(!$conn->query($sql))
	echo("Query Error" . $conn->error . "<br>");

//Close the database connection and terminate the script.
$conn->close();

?>

