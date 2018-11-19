<?php
header("Access-Control-Allow-Origin:http://localhost:9999");
include ("api/connect.php");

$id = $_GET["id"];
$sql = "select * from products where id='$id'";
$result = mysql_query($sql);
$arr=array();
while ($row = mysql_fetch_assoc($result)) {
		array_push($arr, $row);
}
echo json_encode($arr);
mysql_close();
?>