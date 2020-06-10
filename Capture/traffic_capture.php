<?php
//Database configuration
$servername	= "localhost";
$username	= "traffic";
$password	= "12345";
$database	= "trafficDB";
//End script configuration block

//Connect to mysql, and cleanly handle any errors.
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error)
{
	die("Connection failed: " . $conn->connect_error . "<br>");
}
echo "Connected successfully<br>";

//define variables in the global scope for later use.
$source_ip	= "0.0.0.0";
$secure		= 0;
$proto		= "INVAL";
$host		= "invalid.capture.com";
$uri		= "/";
$method		= "FAIL";
$requesttime	= 1588046592.000;
$headers	= array();

foreach (getallheaders() as $name => $value)
{
	switch(strtolower($name))
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
		if(!empty($name) && !empty($value))
			$headers[$name] = $value;
	}
}

//if headers are empty, lets give it a default value
if(empty($headers))
	$headers[$name] = $value;

$jobs = array();
$sql = "SELECT * from jobs;";
if($result = $conn->query($sql))
{
	while($row = $result->fetch_assoc())
	{
		if(	($row['active'] == 1) && 
			((!$row['jobStart'] && !$row['jobStop']) || ($row['jobStart'] < $requesttime && $row['jobStop'] > $requesttime)) &&
			(!$row['secure'] || preg_match($row['secure'], $secure)) &&
			(!$row['protocol'] || preg_match($row['protocol'], $proto)) &&
			(!$row['host'] || preg_match($row['host'], $host)) && 
			(!$row['uri'] || preg_match($row['uri'], $uri)) &&
			(!$row['method'] || preg_match($row['method'], $method)) && 
			(!$row['sourceip'] || preg_match($row['sourceip'], $source_ip)))
		{
			$jobs[] = $row['jobID'];
		}
	}
}

if(empty($jobs))
{
	$conn->close();
	die("Quitting capture: No job found<br>");
}

function mysqli_upsert($sql_conn, $select_query, $insert_query)
{
	$result = $sql_conn->query($select_query);

	if(!$result->num_rows)
	{
		$sql_conn->query($insert_query);
		$result = $sql_conn->query($select_query);
	}

	return $result;
}

$post = file_get_contents('php://input');

$requesttime	= $conn->real_escape_string($requesttime);
$secure		= $conn->real_escape_string($secure);
$proto		= $conn->real_escape_string($proto);
$host		= $conn->real_escape_string($host);
$uri		= $conn->real_escape_string($uri);
$method		= $conn->real_escape_string($method);
$post		= $conn->real_escape_string($post);
$source_ip	= $conn->real_escape_string($source_ip);

//insert into all fields besides headers
$sql = "INSERT IGNORE INTO protocols (protocolName) VALUES ('$proto');
INSERT IGNORE INTO hosts (hostName) VALUES ('$host');
INSERT IGNORE INTO uris (uriName) VALUES ('$uri');
INSERT IGNORE INTO methods (methodName) VALUES ('$method');
INSERT IGNORE INTO sourceips (sourceip) VALUES ('$source_ip');";

echo $sql . "<br>";
if(!$conn->multi_query($sql))
	echo "Query Error: " . $conn->error . "<br>";

do
{
	$conn->store_result();
}
while($conn->next_result());
$sql = "SELECT protocols.protocolID, hosts.hostID, uris.uriID, methods.methodID, sourceips.sourceipID
		FROM protocols, hosts, uris, methods, sourceips
		WHERE protocolName = '$proto'
		AND hostName = '$host'
    		AND uriName = '$uri'
    		AND methodName = '$method'
		AND sourceip = '$source_ip';";

$result = $conn->query($sql);

if(!$result)
	echo "Query Error: " . $conn->error . "<br>";
$rc_ids = $result->fetch_array();
$protocolID = $rc_ids['protocolID'];
$hostID = $rc_ids['hostID'];
$uriID = $rc_ids['uriID'];
$methodID = $rc_ids['methodID'];
$sourceipID = $rc_ids['sourceipID'];



//insert into records
$sql = "INSERT INTO records (utime, secure, protocol, host, uri, method, sourceip, body) VALUES ($requesttime, $secure, $protocolID, $hostID, $uriID, $methodID, $sourceipID, '$post');";
if(!$conn->query($sql))
	echo("Query Error: " . $conn->error . "<br>");

$sql = "SELECT LAST_INSERT_ID();";
$result = $conn->query($sql);

$recordID = $result->fetch_row()[0];


//insert into jobrel

foreach($jobs as $i => $job)
{
	$sql = "INSERT INTO jobrel (jobID, recordID) VALUES ($job, $recordID);";
	$conn->query($sql);
}
//insert into headers and headerrel
foreach($headers as $name => $value)
{
	$headerID = 0;

	$safe_name = $conn->real_escape_string($name);
	$safe_value = $conn->real_escape_string($value);
	
	$result = mysqli_upsert($conn, "SELECT headerID FROM headers h WHERE h.headerName = '$safe_name' AND h.headerValue = '$safe_value';", "INSERT IGNORE INTO headers (headerName, headerValue) VALUES ('$safe_name', '$safe_value');");

	$headerID = $result->fetch_row()[0];

	$sql = "INSERT INTO headerrel (recordID, headerID) VALUES ($recordID, $headerID)";
	$conn->query($sql);
}

//Close the database connection and terminate the script.
$conn->close();

?>

