/**
 * Used for building elements and stuff
 * @author Jason Gillman Jr. <jgillman@liquidweb.com>
 */

function splitter(items) // Generate a breakdown of regular instances by zone as well as private parent instances
{
	publicInstances = new Object(); // For Public Instances - break down by zone
	parentInstances = new Object(); // For Private Parent Instances
	
	var i;
	for(i = 0; i <= (items.length - 1); ++i)
	{
		if(items[i].parent != undefined) // Get Private Parent Instances
		{
			parentInstances[items[i].parent] = new Array();
			parentInstances[items[i].parent].push(items[i]); // Dump child information to the associate parent
		}
		else // Get Public Cloud Instances
		{
			if(publicInstances[items[i].zone.id] == undefined) // If the zone hasn't been encountered yet, instantiate
			{
				publicInstances[items[i].zone.id] = new Array();
			}
			
			publicInstances[items[i].zone.id].push(items[i]);
		}
	}
}

function publicBuilder(instances)
{
	var i;
	
	for(i = 0; i <= (Object.keys(instances).length - 1); ++i) // Generate <div> tags for the zones in play
	{
		workingZone = Object.keys(instances)[i]; // The currently working zone
		$("#locationBoard").append("<div class=\"instanceLocation\" id=\"publicZone" + workingZone + "\" data-zone=\"" + workingZone + "\"></div>"); // Create the div for public cloud instances
		$("#publicZone" + workingZone).append("<p class=\"locationHeader header\">Public Instances :: Zone " + workingZone + "</p>");
		
		var j; // For indexing the instances in a zone
		
		for(j = 0; j <= (instances[workingZone].length - 1); ++j)
		{
			workingInstance = instances[workingZone][j];
			$("#publicZone" + workingZone).append("<div class=\"instance\" id=\"" + workingInstance.uniq_id + "\" data-zone=\"" + workingZone + "\"></div>"); // Instance Div
			$("#"+workingInstance.uniq_id).append("<p class=\"instanceHeader header\">" + workingInstance.domain + "</p>");
			$("#"+workingInstance.uniq_id).append("<p class=\"instanceData\">Disk: " + workingInstance.diskspace + " </p>");
			$("#"+workingInstance.uniq_id).append("<p class=\"instanceData\">Memory: " + workingInstance.memory + " </p>");
			$("#"+workingInstance.uniq_id).append("<p class=\"instanceData\">vCPU: " + workingInstance.vcpu + "</p>");
		}
	}
}

function parentBuilder(instances, parents)
{
	
	var i;
	
	for(i = 0; i <= (Object.keys(parents).length- 1); ++i) // Div for parents
	{
		currentParentUniqID = Object.keys(parents)[i]; // The currently working parent
		
		$("#locationBoard").append("<div class=\"instanceLocation\" id=\"" + currentParentUniqID + "\" data-zone=\"" + parents[currentParentUniqID].zone.id + "\"></div>");
		$("#"+currentParentUniqID).append("<p class=\"locationHeader header\">Private Parent :: " + currentParentUniqID + "</p>");
		
		var j; // For indexing the instances in a parent
		
		for(j = 0; j <= (instances[currentParentUniqID].length - 1); ++j)
		{
			workingInstance = instances[currentParentUniqID][j];
			$("#" + currentParentUniqID).append("<div class=\"instance\" id=\"" + workingInstance.uniq_id + "\" data-zone=\"" + parents[currentParentUniqID].zone.id + "\"></div>"); //Instance Div
			$("#"+workingInstance.uniq_id).append("<p class=\"instanceHeader header\">" + workingInstance.domain + "</p>");
			$("#"+workingInstance.uniq_id).append("<p class=\"instanceData\">Disk: " + workingInstance.diskspace + " </p>");
			$("#"+workingInstance.uniq_id).append("<p class=\"instanceData\">Memory: " + workingInstance.memory + " </p>");
			$("#"+workingInstance.uniq_id).append("<p class=\"instanceData\">vCPU: " + workingInstance.vcpu + "</p>");
		}
	}
}