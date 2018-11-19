<?php
header("Access-Control-Allow-Origin:http://localhost:9999");
include ("api/connect.php");


$sql = "select id,image,name,price from products";
$result = mysql_query($sql);
$arr=array();
while ($row = mysql_fetch_assoc($result)) {
		array_push($arr, $row);
}
echo json_encode($arr);
mysql_close();
?>