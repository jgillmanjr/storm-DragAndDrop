/**
 * Various utility functions
 * @author Jason Gillman Jr. <jgillman@liquidweb.com>
 */

function instanceMinMap(instanceID)
{
	instanceOS	=	templateOS[allInstances[instanceID].template];
	instanceMgt	=	allInstances[instanceID].manage_level;
	
	if(instanceOS == 'Windows')
	{
		instanceMinimums[instanceID]	=	resourceMinimums.win;
	}
	else
	{
		instanceMinimums[instanceID]	=	resourceMinimums[instanceMgt];
	}
}

function splitter(items) // Generate a breakdown of regular instances by zone as well as private parent instances
{
	allInstances	=	new Object(); // All the instance dataz
	publicInstances	=	new Array(); // For Public Instances
	parentInstances	=	new Object(); // For Private Parent Instances
	
	
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
		
		instanceMinMap(items[i].uniq_id); // Create the PP resource minimums
	}
}

function publicBuilder(instances)
{	
	$('#locationBoard').append('<div class="instanceLocation" id="publicCloud"></div>'); // Create the div for public cloud instances
	$('#publicCloud').append('<p class="locationHeader header">Public Cloud Instances</p>');
	
	if(instances.length > 0) // We still want to be able to build the public div even w/o instances
	{
		var i; // Instance itterator

		for(i = 0; i <= (instances.length - 1); ++i)
		{
			workingInstance = instances[i];
			$('#publicCloud').append('<div class="instance" id="' + workingInstance.uniq_id + '" data-zone="' + workingInstance.zone.id + '" data-origin="publicCloud"></div>'); // Instance Div
			$('#'+workingInstance.uniq_id).append('<p class="instanceHeader header">' + workingInstance.domain + '</p>');
			$('#'+workingInstance.uniq_id).append('<p class="instanceData diskData">Disk: ' + workingInstance.diskspace + ' </p>');
			$('#'+workingInstance.uniq_id).append('<p class="instanceData memData">Memory: ' + workingInstance.memory + ' </p>');
			$('#'+workingInstance.uniq_id).append('<p class="instanceData vcpuData">vCPU: ' + workingInstance.vcpu + '</p>');
			$('#'+workingInstance.uniq_id).append('<p class="instanceData">Zone: ' + workingInstance.zone.id + '</p>');
		}
	}
}

function freeResourceUpdate(parentID)
{
	freeResources[parentID]	=	new Object;
	freeResources[parentID].memory	=	($('#' + parentID + 'ramBar').progressbar('option', 'max') - $('#' + parentID + 'ramBar').progressbar('option', 'value'));
	freeResources[parentID].disk	=	($('#' + parentID + 'diskBar').progressbar('option', 'max') - $('#' + parentID + 'diskBar').progressbar('option', 'value'));
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
		freeResourceUpdate(currentParentUniqID);
	}
}

function initialDisplay() // Run this stuff for the initial #locationBoard buildout
{
	publicBuilder(publicInstances);
	
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
				if($(this).attr('id') != 'publicCloud')// Anything should be able to go into the public cloud
				{
					if($(this).attr('id') == $(draggable).attr('data-origin')) {return true;} // Any instance should be able to go back home
					
					if(($(draggable).attr('data-zone') != $(this).attr('data-zone'))) {return false;} // Zone check
					
					if( // Make sure that the addition won't drive the ram over the parent max
						(Number(instanceMinimums[$(draggable).attr('id')].Memory) + Number($('#' + $(this).attr('id') + 'ramBar').progressbar('option', 'value'))) > // This line gets what the new value would be
						Number($('#' + $(this).attr('id') + 'ramBar').progressbar('option', 'max'))
					) {return false;}
					
					if( // Make sure that the addition won't drive the disk over the parent max
						(Number(instanceMinimums[$(draggable).attr('id')].Disk) + Number($('#' + $(this).attr('id') + 'diskBar').progressbar('option', 'value'))) > // This line gets what the new value would be
						Number($('#' + $(this).attr('id') + 'diskBar').progressbar('option', 'max'))
					) {return false;}
				}
				
				return true; // Return true if it was able to pass the gauntlet
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
	if(changeLog[instanceID] == undefined) // Instance is currently still in the origin at time of move
	{
		if(newLocation != origin) // Don't add anything if it got dropped back in the origin
		{
			changeLog[instanceID] = new Object(); // Instantiate
			
			if(newLocation != 'publicCloud') // If moving to a private parent
			{
				changeLog[instanceID].location = newLocation; // Set the new location
				instanceSizer(newLocation, instanceID); // Execute sizing window
			}
			else // Moving to the public cloud
			{
				// Select configuration - finish out in the callback of the config form
				selectConfig(instanceID, allInstances[instanceID].zone.id);
			}
			
			// Tag the card with the origin to indicate that it's not in its origin
			if(origin == 'publicCloud')
			{
				$('#' + instanceID).append('<p class="instanceData originIndicator">Origin: Public Cloud</p>');
			}
			else
			{
				$('#' + instanceID).append('<p class="instanceData originIndicator">Origin: ' + privateParents[origin].domain + '</p>');
			}
		}
	}
	else // Instance is not currently in the origin at time of move
	{
		if(newLocation == origin) // The instance is going back home
		{
			if(changeLog[instanceID].location != 'publicCloud') // Decrease the reported usage if an instance is moved off a private parent.
			{
				updateRam = $('#' + changeLog[instanceID].location + 'ramBar').progressbar('option', 'value') - changeLog[instanceID].memory;
				$('#'+ changeLog[instanceID].location + 'ramBar').progressbar('option', 'value', updateRam);
				
				updateDisk = $('#' + changeLog[instanceID].location + 'diskBar').progressbar('option', 'value') - changeLog[instanceID].diskspace;
				$('#'+ changeLog[instanceID].location + 'diskBar').progressbar('option', 'value', updateDisk);
				
				freeResourceUpdate(changeLog[instanceID].location);
				instanceDataUpdate(instanceID, allInstances[instanceID].diskspace, allInstances[instanceID].memory, allInstances[instanceID].vcpu);
			}
			
			// Remove the origin flag
			$('#' + instanceID + '> .originIndicator').remove();
			
			delete changeLog[instanceID];
		}
		else // Change the new location of the instance
		{
			if(changeLog[instanceID].location != 'publicCloud') // Decrease the reported usage if an instance is moved off a private parent
			{
				updateRam = $('#' + changeLog[instanceID].location + 'ramBar').progressbar('option', 'value') - changeLog[instanceID].memory;
				$('#'+ changeLog[instanceID].location + 'ramBar').progressbar('option', 'value', updateRam);
				
				updateDisk = $('#' + changeLog[instanceID].location + 'diskBar').progressbar('option', 'value') - changeLog[instanceID].diskspace;
				$('#'+ changeLog[instanceID].location + 'diskBar').progressbar('option', 'value', updateDisk);
				
				freeResourceUpdate(changeLog[instanceID].location);
			}
			
			if(newLocation != 'publicCloud') // Moving to a private parent
			{
				if(changeLog[instanceID].configID != undefined) {delete changeLog[instanceID].configID;} // If the location was changed from the public cloud to a different private parent than the one it's on. Basically, if the origin is a private parent, instance moved to public cloud, but then moved to another private parent
				changeLog[instanceID].location = newLocation; // Set the new location
				instanceSizer(newLocation, instanceID); // Execute sizing window
			}
			else // Moving to the public cloud
			{
				// Select configuration - finish out in the callback of the config form
				selectConfig(instanceID, allInstances[instanceID].zone.id);
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
		else // Going to the public cloud
		{
			passParams =
				{
					uniq_id: currentIteration,
					config_id: changeLog[currentIteration].configID
				};
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
	
	// Closeout stuff
	$('.instance').draggable('disable'); // Disable dragging
	$('#saveChanges').attr('disabled', true); // Disable the execute button
	alert(
		"Your changes have been executed. You can verify by looking at the JS console or by looking at your management interface.\n" +
		"We have disabled the page to prevent inadvertent errors."
	);
}

function getConfigs()
{
	// Populate the config list and sort by zone
	$.ajax('apiProxy.php',
		{
			type: 'POST',
			dataType: 'json',
			//async: false, // This is to keep errors from getting thrown (and subsequently the dialog box from being jacked up) if the dialog is opened too quick
			data:
				{
					user: globalData.user,
					pass: globalData.pass,
					method: 'Storm/Config/list',
					params: JSON.stringify(
						{
							page_size: 999,
							category: 'all'
						}
					)
				},
			success:
				function(data, textStatus, jqXHR)
				{
					configs.unsorted = data.items;
					
					// Sort configs by zone - doing it lazy like for now..
					configs.zoneSorted = new Object;
					configs.zoneSorted[8] = new Array;
					configs.zoneSorted[10] = new Array;
					configs.zoneSorted[12] = new Array;
					configs.zoneSorted[15] = new Array;
					
					var i;
					for(i = 0; i <= (configs.unsorted.length - 1); ++i)
					{
						var j; // For iterating through zones
						for(j = 0; j <= (Object.keys(configs.unsorted[i].zone_availability).length - 1); ++j)
						{
							if(configs.unsorted[i].zone_availability[Object.keys(configs.unsorted[i].zone_availability)[j]] == 1) // If there is zone availability
							{
								configs.zoneSorted[Object.keys(configs.unsorted[i].zone_availability)[j]].push(configs.unsorted[i]);
							}
						}
					}
				}
		}
	);
}

function selectConfig(instanceID, zone)
{
	// Generate the config table
	tableColumns =
		[
		 	{sTitle: '<input type="hidden" id="hiddenID" value="' + instanceID + '">'},
		 	{sTitle: 'Description'},
		 	{sTitle: 'Memory', sClass: 'center'},
		 	{sTitle: 'Disk', sClass: 'center'},
		 	{sTitle: 'vCPU', sClass: 'center'}
		];
	
	tableData = new Array();
	var i;
	for(i = 0; i <= (configs.zoneSorted[zone].length - 1); ++i)
	{
		// Resource abstraction stuff..
		if(configs.zoneSorted[zone][i].memory == undefined)
		{
			ram = configs.zoneSorted[zone][i].ram_available;
		}
		else
		{
			ram = configs.zoneSorted[zone][i].memory;
		}
		
		if(configs.zoneSorted[zone][i].disk == undefined)
		{
			disk = configs.zoneSorted[zone][i].disk_total;
		}
		else
		{
			disk = configs.zoneSorted[zone][i].disk;
		}
		
		if(configs.zoneSorted[zone][i].vcpu == undefined)
		{
			cpu = configs.zoneSorted[zone][i].cpu_cores;
		}
		else
		{
			cpu = configs.zoneSorted[zone][i].vcpu;
		}
		
		// End resource abstraction
		
		tableData.push(
			[
			 '<input type="radio" name="configRadio" value="' + configs.zoneSorted[zone][i].id + '">',
			 configs.zoneSorted[zone][i].description,
			 ram + ' MB',
			 disk + ' GB',
			 cpu
			]
		);
	}
	
	configDataTable = $('#configTable').dataTable(
		{
			bDestroy: true, // This will clean out the table first 
			aoColumns: tableColumns,
			aaData: tableData
		}
	);
	
	// Display the dialog and finish the process in the callback from the form submit
	$('#configChooser').dialog('open');
}

function instanceDataUpdate(instanceID, disk, memory, vCPU)
{
	$('#' + instanceID + ' .diskData').text('Disk: ' + disk);
	$('#' + instanceID + ' .memData').text('Memory: ' + memory);
	$('#' + instanceID + ' .vcpuData').text('vCPU: ' + vCPU);
}

function instanceSizer(targetID, instanceID)
{
	sizerDiv = '<div id="instanceSizer">' +
		'<div class="sliderValue">Memory: <input id="memValue" type="text">MB</div><div id="memSlider"></div>' +
		'<div class="sliderValue">Disk: <input id="diskValue" type="text">GB</div><div id="diskSlider"></div>' +
		'<div class="sliderValue">vCPU: <input id="vcpuValue" type="text">Cores</div><div id="vcpuSlider"></div>' +
		'</div>';
	
	$('body').append(sizerDiv);
	
	// We need a way to make sure the value of the memory slider doesn't go over the max free
	if(Number(allInstances[instanceID].memory) > Number(freeResources[targetID].memory))
	{
		sizerMem	=	Number(freeResources[targetID].memory);
	}
	else
	{
		sizerMem	=	Number(allInstances[instanceID].memory);
	}
	memSlider = $('#memSlider').slider(
		{
			min:	instanceMinimums[instanceID].Memory,
			max:	freeResources[targetID].memory,
			value:	sizerMem,
			slide:	function(event, ui)
				{
					$('#memValue').val(ui.value);
				}
		}
	);
	$('#memValue').val($('#memSlider').slider('option', 'value'));
	
	// We need a way to make sure the value of the disk slider doesn't go over the max
	if(Number(allInstances[instanceID].diskspace) > Number(freeResources[targetID].disk))
	{
		sizerDisk	=	Number(freeResources[targetID].disk);
	}
	else
	{
		sizerDisk	=	Number(allInstances[instanceID].diskspace);
	}
	diskSlider = $('#diskSlider').slider(
		{
			min:	instanceMinimums[instanceID].Disk,
			max:	freeResources[targetID].disk,
			value:	sizerDisk,
			slide:	function(event, ui)
			{
				$('#diskValue').val(ui.value);
			}
		}
	);
	$('#diskValue').val($('#diskSlider').slider('option', 'value'));
	
	// We need a way to make sure the value of the vCPU slider doesn't go over the max
	if(Number(allInstances[instanceID].vcpu) > Number(privateParents[targetID].vcpu))
	{
		sizerCPU	=	Number(privateParents[targetID].vcpu);
	}
	else
	{
		sizerCPU	=	Number(allInstances[instanceID].vcpu);
	}
	vcpuSlider = $('#vcpuSlider').slider(
		{
			min:	instanceMinimums[instanceID].Cpu,
			max:	Number(privateParents[targetID].vcpu),
			value:	sizerCPU,
			slide:	function(event, ui)
			{
				$('#vcpuValue').val(ui.value);
			}
		}
	);
	$('#vcpuValue').val($('#vcpuSlider').slider('option', 'value'));
	
	// Update the sliders based on typed in values
	$('#memValue').change(function()
		{
			$('#memSlider').slider('option', 'value', this.value);
		}	
	);
	
	$('#diskValue').change(function()
		{
			$('#diskSlider').slider('option', 'value', this.value);
		}	
	);
	
	$('#vcpuValue').change(function()
		{
			$('#vcpuSlider').slider('option', 'value', this.value);
		}	
	);
	// End typed in values section
	
	$('#instanceSizer').dialog(
		{
			title: 'Please Size your Instance',
			modal: true,
			resizable: false,
			height: 350,
			width: 500,
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
				 		text: 'Confirm Size',
				 		click: function()
				 			{
					 			// Update the changelog
								changeLog[instanceID].diskspace = $('#diskSlider').slider('option', 'value');
								changeLog[instanceID].vcpu = $('#vcpuSlider').slider('option', 'value');
								changeLog[instanceID].memory = $('#memSlider').slider('option', 'value');
								//
								
								// Resource bar changes
								updateRam = $('#' + targetID + 'ramBar').progressbar('option', 'value') + Number($('#memSlider').slider('option', 'value'));
								$('#' + targetID + 'ramBar').progressbar('option', 'value', updateRam);
								
								updateDisk = $('#' + targetID + 'diskBar').progressbar('option', 'value') + Number($('#diskSlider').slider('option', 'value'));
								$('#' + targetID + 'diskBar').progressbar('option', 'value', updateDisk);
								//
								
								// Update p.instanceData
								instanceDataUpdate(instanceID, changeLog[instanceID].diskspace, changeLog[instanceID].memory, changeLog[instanceID].vcpu)
								//
				 				
				 				$(this).dialog('close');
				 				
								// Cleanup
				 				memSlider.slider('destroy');
				 				diskSlider.slider('destroy');
				 				vcpuSlider.slider('destroy');
				 				$('#instanceSizer').remove();
				 				freeResourceUpdate(targetID);
				 				//
				 			}
				 	}
				]
		}
	);
	$('#instanceSizer').dialog('open');
}