/**
 * Various utility functions
 * @author Jason Gillman Jr. <jgillman@liquidweb.com>
 */

function splitter(items) // Generate a breakdown of regular instances by zone as well as private parent instances
{
	allInstances = new Object(); // All the instance dataz
	publicInstances = new Array(); // For Public Instances
	parentInstances = new Object(); // For Private Parent Instances
	
	var i;
	for(i = 0; i <= (items.length - 1); ++i)
	{
		if(items[i].parent != undefined) // Get Private Parent Instances
		{
			if(parentInstances[items[i].parent] == undefined) // only create the new array if it doesn't exist
			{
				parentInstances[items[i].parent] = new Array();
			}
			parentInstances[items[i].parent].push(items[i]); // Dump child information to the associate parent
		}
		else // Get Public Cloud Instances
		{	
			publicInstances.push(items[i]);
		}
		
		allInstances[items[i].uniq_id] = new Object;
		allInstances[items[i].uniq_id] = items[i];
	}
}

function publicBuilder(instances)
{	
	$('#locationBoard').append('<div class="instanceLocation" id="publicCloud"></div>'); // Create the div for public cloud instances
	$('#publicCloud').append('<p class="locationHeader header">Public Cloud Instances</p>');

	var i; // Instance itterator

	for(i = 0; i <= (instances.length - 1); ++i)
	{
		workingInstance = instances[i];
		$('#publicCloud').append('<div class="instance" id="' + workingInstance.uniq_id + '" data-zone="' + workingInstance.zone.id + '" data-origin="publicCloud"></div>'); // Instance Div
		$('#'+workingInstance.uniq_id).append('<p class="instanceHeader header">' + workingInstance.domain + '</p>');
		$('#'+workingInstance.uniq_id).append('<p class="instanceData">Disk: ' + workingInstance.diskspace + ' </p>');
		$('#'+workingInstance.uniq_id).append('<p class="instanceData">Memory: ' + workingInstance.memory + ' </p>');
		$('#'+workingInstance.uniq_id).append('<p class="instanceData">vCPU: ' + workingInstance.vcpu + '</p>');
		$('#'+workingInstance.uniq_id).append('<p class="instanceData">Zone: ' + workingInstance.zone.id + '</p>');
	}
}

function parentBuilder(instances, parents)
{
	
	var i;
	
	for(i = 0; i <= (Object.keys(parents).length- 1); ++i) // Div for parents
	{
		currentParentUniqID = Object.keys(parents)[i]; // The currently working parent
		
		// Generate the location divs
		$('#locationBoard').append('<div class="instanceLocation" id="' + currentParentUniqID + '" data-zone="' + parents[currentParentUniqID].zone.id + '"></div>');
		$('#'+currentParentUniqID).append('<p class="locationHeader header">Private Parent :: ' + parents[currentParentUniqID].domain + '</p>');
		
		// Resource Bar Stuff
		$('#'+currentParentUniqID).append('<div class="ramBar" id="' + currentParentUniqID + 'ramBar"><div class="progressbar-value-label"></div></div>');
		$('#'+currentParentUniqID).append('<div class="diskBar" id="' + currentParentUniqID + 'diskBar"><div class="progressbar-value-label"></div></div>');
		
		//ramBar = $('#'+currentParentUniqID+'ramBar');
		//diskBar = $('#'+currentParentUniqID+'diskBar');
		
		$('#'+currentParentUniqID+'ramBar').progressbar( // Memory bar
			{
				max: privateParents[currentParentUniqID].resources.memory.total,
				value: privateParents[currentParentUniqID].resources.memory.used,
				change:
					function()
					{
						//$(this).children('.progressbar-value-label').text('Memory: ' + $('#'+currentParentUniqID+'ramBar').progressbar('option', 'value') + ' / ' + $('#'+currentParentUniqID+'ramBar').progressbar('option', 'max') + ' MB');
						$(this).children('.progressbar-value-label').text('Memory: ' + $(this).progressbar('option', 'value') + ' / ' + $(this).progressbar('option', 'max') + ' MB');
					}
			}
		).height(20);
		$('#'+currentParentUniqID+'ramBar').children('.progressbar-value-label').text('Memory: ' + $('#'+currentParentUniqID+'ramBar').progressbar('option', 'value') + ' / ' + $('#'+currentParentUniqID+'ramBar').progressbar('option', 'max') + ' MB'); 
		
		$('#'+currentParentUniqID+'diskBar').progressbar( // Disk bar
			{
				max: privateParents[currentParentUniqID].resources.diskspace.total,
				value: privateParents[currentParentUniqID].resources.diskspace.used,
				change:
					function()
					{
						//$(this).children('.progressbar-value-label').text('Disk Space: ' + $('#'+currentParentUniqID+'diskBar').progressbar('option', 'value') + '/' + $('#'+currentParentUniqID+'diskBar').progressbar('option', 'max') + ' GB');
						$(this).children('.progressbar-value-label').text('Disk Space: ' + $(this).progressbar('option', 'value') + '/' + $(this).progressbar('option', 'max') + ' GB');
					}
			}
		).height(20);
		$('#'+currentParentUniqID+'diskBar').children('.progressbar-value-label').text('Disk Space: ' + $('#'+currentParentUniqID+'diskBar').progressbar('option', 'value') + ' / ' + $('#'+currentParentUniqID+'diskBar').progressbar('option', 'max') + ' GB');
		// End Resource Bar Stuff
		
		if(instances[currentParentUniqID] != undefined) // Don't do any instancy stuff if there are no instances on the parent
		{
			var j; // For indexing the instances in a parent
			
			for(j = 0; j <= (instances[currentParentUniqID].length - 1); ++j)
			{
				workingInstance = instances[currentParentUniqID][j];
				$('#' + currentParentUniqID).append('<div class="instance" id="' + workingInstance.uniq_id + '" data-zone="' + parents[currentParentUniqID].zone.id + '" data-origin="' + currentParentUniqID + '"></div>'); //Instance Div
				$('#'+workingInstance.uniq_id).append('<p class="instanceHeader header">' + workingInstance.domain + '</p>');
				$('#'+workingInstance.uniq_id).append('<p class="instanceData">Disk: ' + workingInstance.diskspace + ' </p>');
				$('#'+workingInstance.uniq_id).append('<p class="instanceData">Memory: ' + workingInstance.memory + ' </p>');
				$('#'+workingInstance.uniq_id).append('<p class="instanceData">vCPU: ' + workingInstance.vcpu + '</p>');
				$('#'+workingInstance.uniq_id).append('<p class="instanceData">Zone: ' + workingInstance.zone.id + '</p>');
			}
		}
	}
}

function initialDisplay() // Run this stuff for the initial #locationBoard buildout
{
	if(Object.keys(publicInstances).length > 0)
	{
		publicBuilder(publicInstances);
	}
	
	if(Object.keys(privateParents).length > 0)
	{
		parentBuilder(parentInstances, privateParents);
	}
	
	$locationBoard = $('#locationBoard');
	$locationBoard.packery(
		{
			itemSelector: '.instanceLocation',
			gutter: 10
		}
	);
	
	$('.instance').draggable(
		{
			revert:	'invalid',
		}
	); // Make the instance divs draggable
	
	// Make them droppable
	$('.instanceLocation').droppable(
		{
			accept:	function(draggable) // Define what is a valid drop
			{
				if(($(draggable).attr('data-zone') == $(this).attr('data-zone')) | ($(this).attr('id') == 'publicCloud')) {return true;}
			},
			drop: function(event, ui)
				{
					$(ui.draggable).css({top: 0, left: 0}).appendTo($(this)); // Actually relocate the instance div
				
					if($(this).height() > $('#locationBoard').height()) // Upsize #locationBoard if needed
					{
						$('#locationBoard').height($(this).height() + 20);
					}
					
					instanceChangeLog($(ui.draggable).attr('id'), $(this).attr('id'), $(ui.draggable).attr('data-origin'));
					
					$locationBoard.packery(); // Rerun this to prevent overflow issues..
				}
		}
	);
	
	// Make the controlbar
	$('#locationBoard').append('<div id="controlBar" class="controlBar"></div>');
	$('#controlBar').append('<input type="button" id="createParent" value="Create New Private Parent" />');
	$('#controlBar').append('<input type="button" id="saveChanges" value="Execute" onclick="doStuff();" disabled />');
}

function instanceChangeLog(instanceID, newLocation, origin)
{
	if(changeLog[instanceID] == undefined) // Instance is currently still in the origin
	{
		if(newLocation != origin) // Don't add anything if it got dropped back in the origin
		{
			changeLog[instanceID] = new Object(); // Instantiate
			
			if(newLocation != 'publicCloud') // If moving to a private parent
			{
				changeLog[instanceID].location = newLocation; // Set the new location
				changeLog[instanceID].diskspace = allInstances[instanceID].diskspace;
				changeLog[instanceID].vcpu = allInstances[instanceID].vcpu;
				changeLog[instanceID].memory = allInstances[instanceID].memory;
				
				// Resource bar changes
				updateRam = $('#'+newLocation+'ramBar').progressbar('option', 'value') + Number(allInstances[instanceID].memory);
				$('#'+newLocation+'ramBar').progressbar('option', 'value', updateRam);
				
				updateDisk = $('#'+newLocation+'diskBar').progressbar('option', 'value') + Number(allInstances[instanceID].diskspace);
				$('#'+newLocation+'diskBar').progressbar('option', 'value', updateDisk);
			}
		}
	}
	else // Instance is not currently in the origin
	{
		if(newLocation == origin) // The instance is going back home
		{
			if(changeLog[instanceID].location != 'publicCloud') // Decrease the reported usage if an instance is moved off a private parent
			{
				updateRam = $('#' + changeLog[instanceID].location + 'ramBar').progressbar('option', 'value') - Number(allInstances[instanceID].memory);
				$('#'+ changeLog[instanceID].location + 'ramBar').progressbar('option', 'value', updateRam);
				
				updateDisk = $('#' + changeLog[instanceID].location + 'diskBar').progressbar('option', 'value') - Number(allInstances[instanceID].diskspace);
				$('#'+ changeLog[instanceID].location + 'diskBar').progressbar('option', 'value', updateDisk);
			}
			
			delete changeLog[instanceID];
		}
		else // Change the new location of the instance
		{
			if(changeLog[instanceID].location != 'publicCloud') // Decrease the reported usage if an instance is moved off a private parent
			{
				updateRam = $('#' + changeLog[instanceID].location + 'ramBar').progressbar('option', 'value') - Number(allInstances[instanceID].memory);
				$('#'+ changeLog[instanceID].location + 'ramBar').progressbar('option', 'value', updateRam);
				
				updateDisk = $('#' + changeLog[instanceID].location + 'diskBar').progressbar('option', 'value') - Number(allInstances[instanceID].diskspace);
				$('#'+ changeLog[instanceID].location + 'diskBar').progressbar('option', 'value', updateDisk);
			}
			
			if(newLocation != 'publicCloud') // Moving to a private parent
			{
				if(changeLog[instanceID].configID != undefined) {delete changeLog[instanceID].configID;} // If the location was changed from the public cloud to a different private parent than the one it's on
				changeLog[instanceID].location = newLocation;
				changeLog[instanceID].diskspace = allInstances[instanceID].diskspace;
				changeLog[instanceID].vcpu = allInstances[instanceID].vcpu;
				changeLog[instanceID].memory = allInstances[instanceID].memory;
				
				// Resource bar changes
				updateRam = $('#'+newLocation+'ramBar').progressbar('option', 'value') + Number(allInstances[instanceID].memory);
				$('#'+newLocation+'ramBar').progressbar('option', 'value', updateRam);
				
				updateDisk = $('#'+newLocation+'diskBar').progressbar('option', 'value') + Number(allInstances[instanceID].diskspace);
				$('#'+newLocation+'diskBar').progressbar('option', 'value', updateDisk);
			}
		}
	}
	
	if(Object.keys(changeLog).length > 0) // Show or remove the execute button based on whether there are queued changes
	{
		$('#saveChanges').attr('disabled', false);
	}
	else
	{
		$('#saveChanges').attr('disabled', true);
	}
}

function doStuff()
{
	var i;
	
	for(i = 0; i <= (Object.keys(changeLog).length - 1); ++i)
	{
		currentIteration = Object.keys(changeLog)[i]; // currentIteration is the UID of the instance
		
		if(changeLog[currentIteration].configID == undefined) // If this evals to true, we're dealing with a private parent
		{
			passParams	=
				{
					uniq_id: currentIteration,
					config_id: 0,
					diskspace: changeLog[currentIteration].diskspace,
					memory: changeLog[currentIteration].memory,
					vcpu: changeLog[currentIteration].vcpu,
					parent: changeLog[currentIteration].location
				};
		}
		else // Not a private parent we're going to - still needs work...
		{
			/*
			passParams =
				{
					uniq_id: currentIteration
				};
			*/
		}
		$.ajax('apiProxy.php',
			{
				type: 'POST',
				dataType: 'json',
				data:
					{
						user: globalData.user,
						pass: globalData.pass,
						method: 'Storm/Server/resize',
						params: JSON.stringify(passParams)
					},
				success:
					function(data, textStatus, jqXHR)
					{
						console.log(data);
					}
			}
		);
	}
}