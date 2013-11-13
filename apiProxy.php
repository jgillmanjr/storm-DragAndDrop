<?php
	require('vendor/autoload.php');
	
	if($_POST['activity'] == "credCheck")
	{
		$user = $_POST['user'];
		$pass = $_POST['pass'];
		$params = NULL;
		$version = 'bleed';
		$method = 'Utilities/Info/ping';
		
		$storm = new StormAPI($user, $pass, $method, $params, $version);
		
		echo json_encode($storm->request());
	}
	
	if($_POST['activity'] == "getParents")
	{
		$user = $_POST['user'];
		$pass = $_POST['pass'];
		$params = NULL;
		$version = 'bleed';
		$method = 'Storm/Private/Parent/list';
		
		$storm = new StormAPI($user, $pass, $method, $params, $version);
		$storm->addParam('page_size', 999);
		
		echo json_encode($storm->request()['items']);
	}
	
	if($_POST['activity'] == "getChildren")
	{
		$user = $_POST['user'];
		$pass = $_POST['pass'];
		$params = NULL;
		$version = 'bleed';
		$method = 'Storm/Server/list';
	
		$storm = new StormAPI($user, $pass, $method, $params, $version);
		$storm->addParam('page_size', 999);
		$storm->addParam('parent', $_POST['parentUniqID']);
	
		$instances = $storm->request()['items'];
		
		echo json_encode($instances);
	}
	
?>