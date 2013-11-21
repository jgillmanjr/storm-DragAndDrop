/**
 * Application specific JS
 * @author Jason Gillman Jr. <jgillman@liquidweb.com>
 */

globalData = new Object();
parentConfig = new Object();
instances = new Object();
parentData = new Array();
selectedInstances = new Array();

function credCheck() // Make sure the creds are legit, yo
{
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			data:
				{
					user: $("#loginUser").val(),
					pass: $("#loginPass").val(),
					activity: "credCheck"
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
						getParents(globalData.user, globalData.pass);
						$("#mainBody").tabs("disable", "final"); // Just in case the account is changed
					}
				}
		}
	);
}

function getParents(username, password)
{
	$("#mainBody").tabs("enable", "ppSelect");
	$("#mainBody").tabs("option", "active", 1);
	$("#ppSelect").load("includes/initForm.html");
	
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			dataType: 'json',
			data:
				{
					user: username,
					pass: password,
					activity: "getParents"
				},
			success:
				function(data, textStatus, jqXHR)
				{
					if(Object.keys(data).length > 0)
					{
						ppCount = Object.keys(data).length;
						var i;
						
						for(i = 0; i <= (ppCount - 1); ++i)
						{
							parentData[data[i]["uniq_id"]] = data[i]; // Load all the parent returned data for future use if needed. Keyed by uniq_id
							
							$("select.privateParent").append("<option value=\"" + data[i]["uniq_id"] + "\">" + data[i]["domain"] + " // " +  data[i]["uniq_id"] +"</option>");
							parentConfig[data[i]["uniq_id"]] = data[i]["config_id"];
						}
					}
					else
					{
						$("select.privateParent").append("<option>No Private Parents on this account</option>");
						$(":button.privateParent").attr("disabled", "disabled");
					}
				}
		}
	);
}

function setUniqID()
{
	globalData.parentUniqID = $("select.privateParent").val();
	globalData.parentConfig = parentConfig[globalData.parentUniqID];
	globalData.parentZone = parentData[globalData.parentUniqID]["zone"]["id"];
	console.log(globalData.parentUniqID);
	console.log(globalData.parentConfig);
	getChildren();
}

function getChildren() // My babies! Will someone pleeease save my babies!?!
{
	$("#mainBody").tabs("enable", "final");
	$("#mainBody").tabs("option", "active", 2);
	
	if($("#final").length == 1)
	{
		$("#final").load("includes/instanceInfo.html");
	}
	
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			dataType: 'json',
			data:
				{
					user: globalData.user,
					pass: globalData.pass,
					activity: "getChildren",
					parentUniqID: globalData.parentUniqID
				},
			success:
				function(data, textStatus, jqXHR)
				{	
					if(Object.keys(data).length > 0) // We have instances
					{
						instanceCount = Object.keys(data).length;
						var i;
						
						if($("pre.childInformation").length != 0) // Existing dataz
						{
							$("pre.childInformation").remove(); // Clear out the existing dataz
						}
						
						for(i = 0; i <= (instanceCount - 1); ++i)
						{
							instances[data[i]["uniq_id"]] = data[i]; // All the returned dataz
							instanceCheckBox = "<input class=\"childInstance\" type=\"checkbox\" value=\"" + data[i]["uniq_id"] + "\">";
							instanceString = "<pre class=\"childInformation\">" + data[i]["domain"] + " // " + data[i]["uniq_id"]  + instanceCheckBox + "</pre>";
							$(":text.childInformation").before(instanceString);
						}
						
						$(":button.childInformation").removeAttr("disabled"); //Just in case this was set
					}
					else
					{
						if($("pre.childInformation").length == 0)
						{
							$(":text.childInformation").before("<pre class=\"childInformation\">No Children on this parent</pre>");
						}
						else
						{
							$("pre.childInformation").remove();
							$(":text.childInformation").before("<pre class=\"childInformation\">No Children on this parent</pre>");
						}
						
						$(":button.childInformation").attr("disabled", "disabled");
					}
				},
		}
	);
}

function selectedCheck()
{
	$("#operationStatus").remove(); // Clear out old status
	
	$(".childInstance:checked").each(
		function()
		{
			selectedInstances.push($(this).val());
		}
	);
	
	if(selectedInstances.length > 0) // Make sure that there are instances selected...
	{
		frequentWind();
	}
	else	
	{
		alert("Select at least one instance");
	}
}

function frequentWind()
{

	$.ajax('apiProxy.php',
		{
			type: 'POST',
			//dataType: 'json',
			data:
				{
					user: globalData.user,
					pass: globalData.pass,
					activity: "frequentWind",
					parentConfig: globalData.parentConfig,
					newParentName: $(":text.childInformation").val(),
					parentChildrenData: JSON.stringify(instances),
					parentZone: globalData.parentZone,
					selectedInstances: selectedInstances
				},
			beforeSend:
				function()
				{
					$("#progBar").progressbar({value: false});
				},
			success:
				function(data, textStatus, jqXHR)
				{
					$("#final").append("<pre id=\"operationStatus\">" + data + "</pre>");
				},
			complete:
				function()
				{
					$("#progBar").progressbar("destroy");
				}
		}
	);
	selectedInstances = new Array();
}