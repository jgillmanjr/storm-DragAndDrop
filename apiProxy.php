<?php
	require('vendor/autoload.php');
	
	// Because cross site AJAX calls are a pain
	
	$user = $_POST['user'];
	$pass = $_POST['pass'];
	$method = $_POST['method'];
	
	if($_POST['params'])
	{
		$params = json_decode($_POST['params'], TRUE); // Using JSON to pass in params since, well, JS doesn't do associative arrays like PHP
	}
	else
	{
		$params = NULL;
	}
	
	$version = 'bleed'; // All the cool kids use bleed... plus we need it for private parent stuff
	
	$storm = new StormAPI($user, $pass, $method, $params, $version);
	
	echo json_encode($storm->request());
?>