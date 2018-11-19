<?php
header("Access-Control-Allow-Origin:http://localhost:9999");
include ("api/connect.php");

$username = $_POST["username"];
$pwd = $_POST["pwd"];
$tel = $_POST["tel"];
$imail = $_POST["imail"];

$sql1 = "select * from user where name='$username'";
//执行sql语句
$result = mysql_query($sql1);

$row = mysql_num_rows($result);
if ($row > 0) {
	echo '{"exist" : 1}';
} else {$sql2 = "insert into user (name, password, phone, imail) values ('$username','$pwd', '$tel', '$imail')";

	$isSuc = mysql_query($sql2);

	if ($isSuc) {
		echo '{"code" : 1}';
	} else {
		echo '{"code" : 0}';
	}
}

mysql_close();
?>