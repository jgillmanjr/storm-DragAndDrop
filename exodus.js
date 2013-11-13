/**
 * Application specific JS
 * @author Jason Gillman Jr. <jgillman@liquidweb.com>
 */

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
						getParents($("#loginUser").val(), $("#loginPass").val());
						$(".loginForm").fadeOut(800);
					}
				}
		}
	);
}

function getParents(username, password)
{
	$.ajax('initForm.html',
		{
			type: 'GET',
			async: false,
			success:
				function(data, textStatus, jqXHR)
				{
					$("body").append(data);
				}
		}
	);
	
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
							$("select.privateParent").append("<option value=\"" + data[i]["uniq_id"] + "\">" + data[i]["domain"] + "</option>");
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

function getChildren(username, password, uniqId) // My babies! Will someone pleeease save my babies!?!
{
	
}