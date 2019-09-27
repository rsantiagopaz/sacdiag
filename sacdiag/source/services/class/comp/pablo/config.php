<?php

//$mysqli = new mysqli("localhost", "root", "", "sacd");
//$mysqli = new mysqli("localhost", "sacdsacd", "sacdsacd", "sacd");
$mysqli = new mysqli("localhost", "root", "sum4mp4iea!", "sacd");


/* Comprueba la conexión */
if ($mysqli->connect_errno) {
    printf("Connect failed: %s\n", $mysqli->connect_error);
    exit();
}
 mysqli_set_charset( $mysqli, 'utf8');


//define('PATH_RAIZ_FOTOS', 'files/');

?>