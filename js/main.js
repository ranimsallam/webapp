function $(selector) {
    return document.querySelector(selector);
}

function all(selector) {
    return document.querySelectorAll(selector);
}

function remove(element) {
    element.parentNode.removeChild(element);
}

var addEventListener = function(obj, evt, fnc) {
if (document.addEventListener) {
    var addEvent = function(elem, type, handler) {
        elem.addEventListener(type, handler, false)
    }
    var removeEvent = function(elem, type, handler) {
        elem.removeEventListener(type, handler, false)
    }
} else {
    var addEvent = function(elem, type, handler) {
        elem.attachEvent("on" + type, handler)
    }
    var removeEvent = function(elem, type, handler) {
        elem.detachEvent("on" + type, handler)
    }
}

};


var set_tab = function(){
        var tabsList = document.getElementsByClassName("tab-link");
        // current tab hash
        var active=this.hash;
        

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == active) {
          parent=tabsList[i].parentNode;
          // set the tab toggle class to be active-tab
          parent.className+=' active-tab';
        } 
        else {
          // remove the tab-active class from the other tabs
          parent=tabsList[i].parentNode;
          parent.className='';
          // hide the other tabs content
        	$(tabsList[i].hash).classList.add('hidden');
        }
      }
    // show current tab content
     $(active).classList.remove('hidden');

};

var reloadTab = function(data){
        var tabsList = document.getElementsByClassName("tab-link");
        // current tab hash
        //var active=this.hash;

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == data) {
          parent=tabsList[i].parentNode;
          // set the tab toggle class to be active-tab
          parent.className+=' active-tab';
        } 
        else {
          // remove the tab-active class from the other tabs
          parent=tabsList[i].parentNode;
          parent.className='';
          // hide the other tabs content
        	$(tabsList[i].hash).classList.add('hidden');
        }
      }
    // show current tab content
     $(data).classList.remove('hidden');
};

var tabs =document.getElementsByClassName("tab-link");

for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", set_tab);
  };


function saveLinks() {
	var activeTab = location.hash;
	var links = [];
	var tmp = [];
	var selectName;
	var selecetURL;
	
	clearSelectOptions(activeTab);
	
	tmp = all(".reports-data");

	for(var i=0; i<tmp.length-1; i=i+2){
		var name = tmp[i].children[1].value;
		var url = tmp[i+1].children[1].value;
		if(name != "" && url != ""){
			links.push({
				formId:"ReportsForm" ,
				name:name ,
				url:url
			});
		}		
	}

	tmp = all(".teamFolders-data");
	
	for(var i=0; i<tmp.length-1; i=i+2){
		var name = tmp[i].children[1].value;
		var url = tmp[i+1].children[1].value;
		
		if(name != "" && url != ""){
			links.push({
				formId:"MyTeamFoldersForm" ,
				name:name ,
				url:url
			});
		}
	}

	localStorage.setItem('FormData', JSON.stringify(links));

	updateSelect(activeTab);
}


function updateSelect(data) {
		var formData = JSON.parse(localStorage.getItem("FormData"));
		if(formData == null) return;
		if(data == "#my-team-folders"){
			var selectReports = $("#bookmarks-myTeamFolders");
			for(var i=0; i<formData.length; i++){
				var formId = formData[i].formId;

				if(formId == "MyTeamFoldersForm"){
					var val = formData[i].name;
					if(val != "") $("#bookmarks-myTeamFolders").classList.remove("hidden");
					var myOption = document.createElement("option");
					myOption.text = val;
					myOption.value = val; 
					selectReports.appendChild(myOption);
				}	
			}	
		}

		else{
				var selectReports = $("#bookmarks-quickreports");
				for(var i=0; i<formData.length; i++){
					var formId = formData[i].formId;
					if(formId == "ReportsForm"){
						var val = formData[i].name;
						if(val != "") $("#bookmarks-quickreports").classList.remove("hidden");
						var myOption = document.createElement("option");
						myOption.text = val;
						myOption.value = val;
						selectReports.appendChild(myOption);
					}
				}	
		}

		changeIFrame();
}

function clearSelectOptions(data){
	var selectReports;
	if(data == "#my-team-folders"){
		selectReports = $("#bookmarks-myTeamFolders");
	}
	else{
		selectReports = $("#bookmarks-quickreports");
	}

	for(var i=0; i<selectReports.childNodes.length; i++){
			selectReports.remove(selectReports.i);
	}
}

function isInputsNull(data){
	var arr = [];
	var returnVal = true;

	if(data == "#my-team-folders")
		arr = all(".teamFolders-data");
	else{
		arr = all(".reports-data");
	}

	for(var i =0; i<arr.length; i++){
		var text = arr[i].children[1].value;
		if(text != "")
			returnVal = false;
	}
	return returnVal;
}



function changeIFrame() {
	var activeTab = location.hash;
	var newURL;
	var selReports;
	var iframeWindow;
	var selectedValue;
	var formData = JSON.parse(localStorage.getItem("FormData"));

	if(activeTab == "#my-team-folders"){
		selReports = $("#bookmarks-myTeamFolders");
		selectedValue = selReports.value;
		for(var i=0; i<formData.length; i++){
			if(formData[i].name == selectedValue){
				newURL = formData[i].url;
				iframeWindow = $("#teamFolders-frame");
				iframeWindow.src = newURL;
				$("#expand-myTeamFolders").href = newURL;

			}
		}		
	}
	else{
		selReports = $("#bookmarks-quickreports");
		selectedValue = selReports.value;
		for(var i=0; i<formData.length; i++){
			if(formData[i].name == selectedValue){
				newURL = formData[i].url;
				iframeWindow = $("#quickReports-frame");
				iframeWindow.src = newURL;
				$("#expand-quickreports").href = newURL;
			}
		}
	}
	
	
}


function isValid(data){
	var returnVal = true;
	var links = [];
	var tmp = [];
	if(data == "quick-reports")
		tmp = all(".reports-data");
	else{
		tmp = all(".teamFolders-data");
	}

	for(var i=0; i<tmp.length-1; i=i+2){
		var name = tmp[i].children[1].value;
		var url = tmp[i+1].children[1].value;

		if(name!="" && url==""){
			(tmp[i+1].children[1]).style.border = "ridge 1px #D8000C";
			if(returnVal)
				(tmp[i+1].children[1]).focus();
			returnVal=false;
		}

		if(name=="" && url!=""){
			(tmp[i].children[1]).style.border = "ridge 1px #D8000C";
			if(returnVal)
				(tmp[i].children[1]).focus();
			retyrnVal=false;
		}
	}
	return returnVal;
}


$("#reports-form").addEventListener('keyup' , function(e){
	if(e.keyCode == 27){
		$("#reports-form").classList.toggle("hidden");
	}
});

$("#reports-form").addEventListener('keyup' , function(e){
	if(e.keyCode == 13){
		saveLinks();
		$("#reports-form").classList.toggle("hidden");
	}
});

$("#folders-form").addEventListener('keyup' , function(e){
	if(e.keyCode == 27){
		$("#folders-form").classList.toggle("hidden");
	}
});

$("#folders-form").addEventListener('keyup' , function(e){
	if(e.keyCode == 13){
		saveLinks();
		$("#folders-form").classList.toggle("hidden");
	}
});

function updatePageFromeJSON(response){
	updateNotificationArea(response.notification);
	updateNavBoxes(response.quickActions);
	updateActionsList(response.quickActions);
}

function updateNotificationArea(data){
	if(data != undefined)
		$(".notifications").innerHTML = data;
}

function updateNavBoxes(data){
	
	if(data != undefined){

		for(var i=0; i<3; i++){
			var j=i+1;
			var navId = "#navBox"+j;
			var navBox = $(navId);
			var newElement = document.createElement("p");
			newElement.innerHTML = data[i].label;
			navBox.insertBefore(newElement , navBox.childNodes[0]);

			var menuCapId = "#menu-caption"+j;
			var menuCap = $(menuCapId);
			newElement = document.createElement("p");
			newElement.innerHTML = data[i].actionsLabel;
			menuCap.insertBefore(newElement , menuCap.childNodes[0]);
		}
	}
	
}

function updateActionsList(data){
	if(data != undefined){
	var actionList = [];
		for(var i=0; i<3; i++){
			actionList = data[i].actions;
			var listId = "#actionList"+(i+1);
			var list = $(listId);
			var rows = list.getElementsByTagName("li");
			for(var j=0; j<actionList.length; j++){
				rows[j].childNodes[0].innerHTML = actionList[j].label;
				rows[j].childNodes[0].href = actionList[j].url;
				// list.childNodes.item(j+1).childNodes[0].innerHTML = actionList[i].label;
				// list.childNodes.item(j+1).childNodes[0].href = actionList[i].url;
			}
		}
	}
}

function init(){


	UTILS.ajax("data/config.json" , {done: updatePageFromeJSON});

	var hashTab = window.location.hash;
	 if(hashTab != "")
	  	reloadTab(hashTab);
	 

	updateSelect("#quick-reports");
	updateSelect("#my-team-folders");

	document.getElementById("saveBtn-reports").addEventListener('click', function(e){
		if( isInputsNull("#quick-reports") ){
			clearSelectOptions("#quick-reports");
			$("#reports-form").classList.toggle("hidden");
			$("#bookmarks-quickreports").classList.add("hidden");
			return;
		}
		if(isValid("quick-reports") == true){
			saveLinks();
			$("#reports-form").classList.toggle("hidden");
			$("#bookmarks-quickreports").classList.remove("hidden");
		}
	});

	document.getElementById("teamFolders-save-btn").addEventListener('click', function(e){
		if( isInputsNull("#my-team-folders") ){
			clearSelectOptions("#my-team-folders");
			$("#folders-form").classList.toggle("hidden");
			$("#bookmarks-myTeamFolders").classList.add("hidden");
			return;
		}
		if(isValid("my-team-folders") == true){
			saveLinks();
			$("#folders-form").classList.toggle("hidden");
			$("#bookmarks-myTeamFolders").classList.remove("hidden");
		}
	});

	document.getElementById("bookmarks-quickreports").addEventListener('change', function(e){
		changeIFrame();
	});

	document.getElementById("bookmarks-myTeamFolders").addEventListener('change', function(e){
		changeIFrame();
	});

	$("#reports-cancel-btn").addEventListener('click', function(e){
		$("#reports-form").classList.toggle("hidden");
	});

	$("#myTeamFolders-cancel-btn").addEventListener('click', function(e){
		$("#folders-form").classList.toggle("hidden");
	});
		

	document.getElementById("btnSettings-quickreports").addEventListener('click', function(e){
		$("#btnSettings-quickreports").classList.toggle("active");
		$("#reports-form").classList.toggle("hidden");
		$("#reportName1").focus();
	});

	document.getElementById("team-folder-settings-btn").addEventListener('click', function(e){
		$("#folders-form").classList.toggle("active");
		$("#folders-form").classList.toggle("hidden");
		$("#folderName1").focus();
	});

}





window.onLoad = init();