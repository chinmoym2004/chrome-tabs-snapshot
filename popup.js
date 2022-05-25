// chrome.tabs.getSelected(null, function(tab) {
//     document.getElementById('currentLink').innerHTML = tab.url;
// });

// Initialize button with user's preferred color
let takeasnap = document.getElementById("takeasnap");
let viewallsnaps = document.getElementById("viewallsnaps");
$("#message_holder").hide();
let existingsnaps = [];

// chrome.storage.sync.get("color", ({ color }) => {
//   takeasnap.style.backgroundColor = color;
// });

chrome.storage.local.get("snaps", ({ snaps }) => {
  existingsnaps=snaps;
  console.log(existingsnaps);
  $("#viewallsnaps").html("Load "+existingsnaps.length+" Snap");
});

// When the button is clicked, inject setPageBackgroundColor into current page
takeasnap.addEventListener("click", async () => {
	// let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	// 	chrome.scripting.executeScript({
	// 	target: { tabId: tab.id },
	// 	function: setPageBackgroundColor,
	// });
	//chrome.tabs.create({ url: 'https://google.com', active: false });
	let getting = chrome.windows.getAll({
		populate: true,
		windowTypes: ["normal"]
	});
	getting.then(logTabsForWindows, onError);
});

viewallsnaps.addEventListener("click", async () => {
	LoadSnapsInBg();
});

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
  chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
  });
}

function logTabsForWindows(windowInfoArray) {

	count = existingsnaps.length;
	name = "SNAP "+count;
	snaps = existingsnaps;

	for (windowInfo of windowInfoArray) {
	    tabs = windowInfo.tabs.map(tab => tab.url);
	    snap = {"time": new Date().toLocaleString(),"tabs":tabs,"name":name};
	   	existingsnaps[count]=snap;
	   	chrome.storage.local.set({ 'snaps':snaps });
	}

	//LoadSnapsInBg();

	//showNotification("Snap saved as: "+name);
	$("#viewallsnaps").html("Load "+existingsnaps.length+" Snap");
	$("#message_holder").text("Snap saved as: "+name);
	$("#message_holder").show();
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function showNotification(message) 
{
	  chrome.notifications.create({
	    type: 'basic',
	    iconUrl: '/images/get_started32.png',
	    title: 'Alert',
	    message: message,
	    buttons: [
	      { title: 'Got It !' }
	    ],
	    priority: 0
	  });
}

function LoadSnapsInBg()
{
	
	if(existingsnaps.length>0)
	{
		$("#viewallsnaps_load_parent").hide();

		var html = '<ol class="list-group list-group-numbered">';
		for(i=existingsnaps.length-1;i>=0;i--)
		{
			html+='<li data-index="'+i+'" class="list-group-item d-flex justify-content-between align-items-start"><div class="ms-2 me-auto"><div class="fw-bold">'+existingsnaps[i].name+'</div>'+existingsnaps[i].time+'<br/><a href="#" class="btn btn-link p-1 openall" data-index="'+i+'">Open All</a><a href="#" class="btn btn-link p-1">Rename</a><a href="#" class="btn btn-link p-1 deleteitem" data-index="'+i+'">Delete</a></div><span class="badge bg-primary rounded-pill">'+existingsnaps[i].tabs.length+'</span></li>';
		}
		html+='</ol>';
		$("#viewallsnaps_parent").html(html);
		$("#viewallsnaps_parent").show();
	}
	else
	{
		$("#viewallsnaps_load_parent").show();
		$("#viewallsnaps_parent").hide();
		$("#viewallsnaps").html("Load "+existingsnaps.length+" Snap");
	}
}

$(document).on("click",".openall",function(event){
	event.preventDefault();
	snapid = $(this).attr("data-index");
	tabs = existingsnaps[snapid].tabs;
	for(i=0;i<tabs.length;i++)
	{
		chrome.tabs.create({ url: tabs[i], active: false });
	}
});

$(document).on("click",".deleteitem",function(event){
	event.preventDefault();
	snapid = $(this).attr("data-index");
	existingsnaps.splice(snapid,1);
	chrome.storage.local.set({ 'snaps':existingsnaps });
	LoadSnapsInBg();
});
