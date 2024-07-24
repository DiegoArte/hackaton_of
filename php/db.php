<?php

$db=mysqli_connect('localhost', 'root', '', 'dashboard');
$sql="SELECT * FROM datos WHERE iddatos=1";
$consulta=mysqli_fetch_assoc(mysqli_query($db, $sql));
$dato[0]['valor']=$consulta['valor'];
echo json_encode($dato);