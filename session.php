<?php
$con = @mysql_connect("5.2.255.236","root","bitech");
if (!$con){
	die("Can't connect: " . mysql_error());
}
mysql_select_db("db_automa",$con);
$sql = "SELECT * FROM lavorazioni";
$myData = mysql_query($sql, $con);
?>  