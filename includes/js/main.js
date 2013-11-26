/**
 * Application specific JS
 * @author Jason Gillman Jr. <jgillman@liquidweb.com>
 */

globalData = new Object();

parentData = new Array();

function credCheck() // Make sure the creds are legit, yo
{
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			data:
				{
					user: $("#loginUser").val(),
					pass: $("#loginPass").val(),
					method: 'Utilities/Info/ping'
				},
			success:
				function(data, textStatus, jqXHR)
				{
					if(data == "null")
					{
						alert("Null return. Most likely invalid creds");
					}
					else
					{
						globalData.user = $("#loginUser").val();
						globalData.pass = $("#loginPass").val();
						console.log(JSON.parse(data));
						getInstancesAndParents();
					}
				}
		}
	);
}

function getInstancesAndParents()
{
	$("#mainBody").tabs("enable", "locationBoard");
	$("#mainBody").tabs("option", "active", 1);

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
	
	/**
	 * Make display stuff happen
	 */
	if(Object.keys(publicInstances).length > 0)
	{
		publicBuilder(publicInstances);
	}
	
	if(Object.keys(privateParents).length > 0)
	{
		parentBuilder(parentInstances, privateParents);
	}
	
	
	$locationBoard = $("#locationBoard");
	$locationBoard.packery(
		{
			itemSelector: '.instanceLocation',
			gutter: 10
		}
	);
	
	//$(".instanceLocation").draggable();
	//$locationBoard.packery('bindUIDraggableEvents', $(".instanceLocation"));
	$(".instance").draggable();
	// End display stuff \\
}