/**
 * Application specific JS
 * @author Jason Gillman Jr. <jgillman@liquidweb.com>
 */

globalData	= 	new Object();
changeLog	=	new Object();
configs		=	new Object();
instanceMinimums	=	new Object();

function credCheck() // Make sure the creds are legit, yo
{
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			data:
				{
					user: $('#loginUser').val(),
					pass: $('#loginPass').val(),
					method: 'Utilities/Info/ping'
				},
			success:
				function(data, textStatus, jqXHR)
				{
					if(data == 'null')
					{
						alert('Null return. Most likely invalid creds');
					}
					else
					{
						globalData.user = $('#loginUser').val();
						globalData.pass = $('#loginPass').val();
						console.log(JSON.parse(data));
						getMinimums();
						getInstancesAndParents();
					}
				}
		}
	);
}

function getMinimums()
{
	// Get the actual minimums
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			data:
				{
					user: globalData.user,
					pass: globalData.pass,
					method: 'Account/Limits/dynamicChild'
				},
			success:
				function(data, textStatus, jqXHR)
				{
					instanceMinimums.self 	=	data.Unmanaged;
					instanceMinimums.core	=	data.Managed;
					instanceMinimums.full	=	data.Managed;
					instanceMinimums.win	=	data.Windows;
				}
		}
	);
	
	// Get the OS for an associated template (for Linux/Windows differentiation)
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			data:
				{
					user: globalData.user,
					pass: globalData.pass,
					method: 'Storm/Template/list'
				},
			success:
				function(data, textStatus, jqXHR)
				{
					console.log(typeof data.items);
					//var i;
					//for(i = 0; Object.keys(data.itsems))
				}
		}
	);
}

function getInstancesAndParents()
{
	getConfigs();
	$('#mainBody').tabs('enable', 'locationBoard');
	$('#mainBody').tabs('option', 'active', 1);
	$('#mainBody').tabs('disable', 'login'); // No logging back in for this iteration
	
	// Generate the skeleton of the config selector dialog
	$('#configChooser').dialog(
		{
			title: 'Please Select a Configuration',
			modal: true,
			resizable: false,
			height: (window.innerHeight * (3/4)),
			width: (window.innerWidth * (3/4)),
			dialogClass: "no-close",
			show:
				{
					effect: 'blind',
					duration: 500
				},
			hide:
				{
					effect: 'blind',
					duration: 500
				},
			autoOpen: false,
			buttons:
				[
				 	{
				 		text: 'Select Config',
				 		click: function()
				 			{
				 				changeLog[$('#hiddenID').val()].configID = $('[name="configRadio"]:checked').val();
				 				$(this).dialog('close');
				 			}
				 	}
				]
		}
	);
	
	$('#configChooser').html('<form><table id="configTable"></table></form>');

	/**
	 * Get all the instances - public or private
	 */
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			dataType: 'json',
			async: false,
			data:
				{
					user: globalData.user,
					pass: globalData.pass,
					method: 'Storm/Server/list',
					params: JSON.stringify({page_size: 999})
				},
			success:
				function(data, textStatus, jqXHR)
				{
					splitter(data.items); // Feed splitter() all the instances
				}
		}
	);
	
	/**
	 * Get the private parents
	 */
	$.ajax('apiProxy.php',
			{
				type: 'POST',
				dataType: 'json',
				async: false,
				data:
					{
						user: globalData.user,
						pass: globalData.pass,
						method: 'Storm/Private/Parent/list',
						params: JSON.stringify({page_size: 999})
					},
				success:
					function(data, textStatus, jqXHR)
					{
						if(data.item_total > 0) // Don't bother creating a private parent object (or do anything else related) if there aren't any
						{
							privateParents = new Object;
							
							var i;
							
							for(i = 0; i <= (data.item_total - 1); ++i)
							{
								parentUID = data.items[i].uniq_id;
								privateParents[parentUID] = data.items[i]; // Key it to the parent's UID
							}
						}
					}
			}
		);
	
	initialDisplay(); // Execute display operations
}