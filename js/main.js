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
          parent.className+='active-tab';
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

var tabs =document.getElementsByClassName("tab-link");

for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", set_tab);
  };


function saveLinks() {
	var activeTab = location.hash;
	var links = [];
	var tmp = [];
	var selectName = "";
	var selecetURL = "";

	if(activeTab == "#my-team-folders"){
		tmp = all(".teamFolders-data");
		selectName = "teamFolderName";
		selectURL = "teamFolderURL";
	}
	else{
		tmp = all(".reports-data");
		selectName = "reportName";
		selectURL = "reportURL";
	}

	for(var i=0; i<tmp.length; i++){
		links[i] = tmp[i].children[1].value;

	}

	var i =0;
	var j=0;
	while(i<links.length) {
		localStorage.setItem(selectName+j, links[i]);
		i++;
		localStorage.setItem(selectURL+j, links[i]);
		i++;
		j++;
	}

	updateSelect(activeTab);
}

function updateSelect(data) {

		if(data == "#my-team-folders"){
		var selectReports = $("#bookmarks-myTeamFolders");
		for(var i=0; i<3; i++){
			var val = localStorage.getItem("teamFolderName"+i);
			if(val){
				var myOption = document.createElement("option");
				myOption.text = val;
				myOption.value = val;
				// myOption.setAttribute("id","teamFolder-op"+i); 
				selectReports.appendChild(myOption);
			}
		}	
	}

	else{
		var selectReports = $("#bookmarks-quickreports");
		for(var i=0; i<3; i++){
			var valReports = localStorage.getItem("reportName"+i);
			if(valReports){
				var myOption = document.createElement("option");
				myOption.text = valReports;
				myOption.value = valReports;
				//myOption.setAttribute("id","quickReport-op"+i);
				selectReports.appendChild(myOption);
			}
		}	
	}
}

function changeIFrame() {
	var activeTab = location.hash;
	var newURL;
	var selIndex;
	var selReports;
	var iframeWindow;
	if(activeTab == "#my-team-folders"){
		selReports = $("#bookmarks-myTeamFolders");
		selIndex = selReports.selectedIndex;
		newURL = localStorage.getItem("teamFolderURL"+selIndex);
		iframeWindow = $("#teamFolders-frame");
	}
	else{

		selReports = $("#bookmarks-quickreports");
		selIndex = selReports.selectedIndex;
		newURL = localStorage.getItem("reportURL"+selIndex);
		iframeWindow = $("#quickReports-frame");
	}
	
	iframeWindow.src = newURL;
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
	}
});

function init(){


	// UTILS.ajax("data/config.json" , {done: pageUpdate});
	//window.location.hash = "#quick-reports";

	updateSelect("#quick-reports");
	updateSelect("#my-team-folders");

	// localStorage.clear();
	// var selectOp = $(".selectLinks");
	// selectOp.innerHTML = "";

	document.getElementById("saveBtn-reports").addEventListener('click', function(e){
		if(isValid("quick-reports") == true){
			saveLinks();
			$("#reports-form").classList.toggle("hidden");
		}
	});

	document.getElementById("teamFolders-save-btn").addEventListener('click', function(e){
		if(isValid("my-team-folders") == true){
			saveLinks();
			$("#folders-form").classList.toggle("hidden");
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