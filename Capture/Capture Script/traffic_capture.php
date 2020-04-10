<?php

$servername = "localhost";
$username = "traffic";
$password = "12345";
$database = "traffic_log";
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error)
{
	die("Connection failed: " . $conn->connect_error . "<br>");
}
echo "Connected successfully<br>";


$secure = $_GET['secure'];
$proto = $_GET['proto'];
$host = $_GET['host'];
$uri = $_GET['uri'];
$method = $_GET['method'];

$requesttime = $_GET['time'];

//Clean up what we get from nginx: 'on' when https '' when http.
if($secure != "on")
	$secure = "off";

$source_ip = "";

foreach (getallheaders() as $name => $value)
{
        if($name == "X-Real-IP")
                $source_ip = $value;
        else
                $headers .= "$name,$value;";
}

$date = new DateTime();
$unixtime = $date->getTimestamp();

echo ("Request Time: " . $requesttime . "<br>");

$sql = "INSERT INTO log (utime, secure, proto, host, uri, method, headers, sourceip) VALUES ('$requesttime', '$secure', '$proto', '$host', '$uri', '$method', '$headers', '$source_ip');";
echo($sql . "<br>");
if(!$conn->query($sql))
	echo("Query Error" . $conn->error . "<br>");
$conn->close();

?>
