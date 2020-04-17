<?php

//Begin script configuration block
$starttime = 0;
$endtime = PHP_INT_MAX;
//Database configuration
$servername = "localhost";
$username = "traffic";
$password = "12345";
$database = "traffic_log";
//End script configuration block

//Connect to mysql, and cleanly handle any errors.
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error)
{
	die("Connection failed: " . $conn->connect_error . "<br>");
}
echo "Connected successfully<br>";

//define variables in the global scope for later use.
$source_ip = "";
$secure = "";
$proto = "";
$host = "";
$uri = "";
$method = "";
$requesttime = "";
$headers = "";

foreach (getallheaders() as $name => $value)
{
	switch($name)
	{
	case "tpt-ip":
		$source_ip = $value;
		break;
	case "tpt-secure":
		$secure = $value;
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
		$headers .= "$name,$value;";
	}
}

//if the time of the current request falls outside of the timeframe, exit the script without logging.
if($requesttime < $starttime && $requesttime > $endtime)
{
	$conn->close();
	die();
}

//Construct our sql query to log the request to the database.
$sql = "INSERT INTO log (utime, secure, proto, host, uri, method, headers, sourceip) VALUES ('$requesttime', '$secure', '$proto', '$host', '$uri', '$method', '$headers', '$source_ip');";

//Execute the sql query and handle any errors.
if(!$conn->query($sql))
	echo("Query Error" . $conn->error . "<br>");

//Close the database connection and terminate the script.
$conn->close();

?>

