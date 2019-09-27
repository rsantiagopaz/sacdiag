<?php
$cadena=$_REQUEST["cadena"];
require("phpqrcode/phpqrcode.php");
QRcode::png($cadena);
?>
