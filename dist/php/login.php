<?php
header("Access-Control-Allow-Origin:http://localhost:9999");
include ("api/connect.php");

$username = $_POST["username"];
$pwd = $_POST["pwd"];
$sql = "select * from user where name='$username' and password='$pwd'";
$result = mysql_query($sql);
$row = mysql_num_rows($result);
if ($row > 0) {
	echo '{"code" : 1}';
} else {
	echo '{"code" : 0}';
}
mysql_close();
?>