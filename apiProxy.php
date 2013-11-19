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
	
	if($_POST['activity'] == "frequentWind")
	{
		$user = $_POST['user'];
		$pass = $_POST['pass'];
		$params = NULL;
		$version = 'bleed';
		$method = 'Storm/Private/Parent/create';
		$instances = json_decode($_POST['parentChildren'], TRUE);
		
		$storm = new StormAPI($user, $pass, $method, $params, $version);
		$storm->addParam('config_id', $_POST['parentConfig']);
		$storm->addParam('domain', $_POST['newParentName']);
		$storm->addParam('zone', $_POST['parentZone']);
		
		$returnArray['ppCreate'] = $storm->request();
		
		if(isset($returnArray['ppCreate']['uniq_id'])) // Make sure the parent created before resizing
		{
			$storm->newMethod('Storm/Server/resize');
			$storm->addParam('config_id', 0);
			$storm->addParam('parent', $returnArray['ppCreate']['uniq_id']);
			
			foreach($instances as $instance)
			{
				$storm->addParam('uniq_id', $instance['uniq_id']);
				$storm->addParam('diskspace', $instance['disk']);
				$storm->addParam('memory', $instance['memory']);
				$storm->addParam('vcpu', $instance['vcpu']);
				
				$returnArray[$instance['uniq_id']] = $storm->request(TRUE)['display'];
			}	
		}
		
		print_r($returnArray);
		/*
		// Testing Stuff \\
		$returnArray['user'] = $user;
		$returnArray['pass'] = $pass;
		$returnArray['instances'] = $_POST['parentChildren'];
		$returnArray['newParentName'] = $_POST['newParentName'];
		
		print_r($returnArray);
		// End Testing Stuff\\
		*/
	}
?>