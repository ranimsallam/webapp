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
   	var active=this.hash;
        

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == active) {
          parent=tabsList[i].parentNode;
          parent.className+=' active-tab';
          tabsList[i].children[0].classList.add("active-tab-icon");
          tabsList[i].style.color = "black";
        } 
        else {
          parent=tabsList[i].parentNode;
          parent.className='';

       	  $(tabsList[i].hash).classList.add('hidden');
       	  tabsList[i].children[0].classList.remove("active-tab-icon");
          tabsList[i].style.color = "white";
        }
      }
    
    $(active).classList.remove('hidden');
    saveLastSelectedTab(active);

};


function reloadTab(data){
    var tabsList = document.getElementsByClassName("tab-link");

    window.location.hash = data;

    for (var i = 0; i < tabsList.length; i++) {
        if (tabsList[i].hash == data) {
          parent=tabsList[i].parentNode;
          // set the tab toggle class to be active-tab
          parent.className+=' active-tab';
          tabsList[i].children[0].classList.add("active-tab-icon");
          tabsList[i].style.color = "black";
        } 
        else {
          // remove the tab-active class from the other tabs
          parent=tabsList[i].parentNode;
          parent.className='';
          // hide the other tabs content
        	$(tabsList[i].hash).classList.add('hidden');
        	tabsList[i].children[0].classList.remove("active-tab-icon");
        	tabsList[i].style.color = "white";
        }
      }
    // show current tab content
     $(data).classList.remove('hidden');
     saveLastSelectedTab(data);

}

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

function deleteLinksFromLocalStorage(data){

	var formData = JSON.parse(localStorage.getItem("FormData"));
	localStorage.removeItem("FormData");

	var formId = "ReportsForm";
	if(data == "#my-team-folders")
		formId = "MyTeamFoldersForm";
	var j=0;
	for(var i=0; i<formData.length; i++){
		if(formData[i].formId == formId)
			j++;
	}

	if(data == "#my-team-folders"){
		for(var i=0; i<j; i++)
			formData.pop();
	}
	else{
		formData.splice(0,j);
	}
	localStorage.setItem('FormData', JSON.stringify(formData));
}

function isInputsNull(data){
	var arr = [];
	var returnVal = true;
	var frame;

	if(data == "#my-team-folders"){
		arr = all(".teamFolders-data");
		frame = $("#teamFolders-frame");
	}
	else{
		arr = all(".reports-data");
		frame = $("#quickReports-frame");
	}

	for(var i =0; i<arr.length; i++){
		var text = arr[i].children[1].value;
		if(text != ""){
			returnVal = false;
		}
	}
	var d = frame.src;

	if(returnVal)
		frame.src = "";
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
	var urlExp = new RegExp("https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}", i); 
	var linkExp = new RegExp(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/);
	if(data == "quick-reports")
		tmp = all(".reports-data");
	else{
		tmp = all(".teamFolders-data");
	}

	for(var i=0; i<tmp.length-1; i=i+2){
		var name = tmp[i].children[1].value;
		var url = tmp[i+1].children[1].value;



		if(name!="" && url=="" ){
			(tmp[i+1].children[1]).classList.add("error-input");
			if(returnVal){
				(tmp[i+1].children[1]).focus();
				(tmp[i+1].children[1]).style.outline = "none";
			}

			returnVal=false;
		}

		else if(name=="" && url!=""){
			(tmp[i].children[1]).classList.add("error-input");
			if(returnVal){
				(tmp[i].children[1]).focus();
				(tmp[i+1].children[1]).style.outline = "none";
			}
			returnVal=false;
		}

		else{
			tmp[i].children[1].classList.remove("error-input");
			tmp[i+1].children[1].classList.remove("error-input");
		}

		if(name!="" && url!="" && ( !urlExp.test(url) && !linkExp.test(url) ) ){
			(tmp[i+1].children[1]).classList.add("error-input");
			if(returnVal){
				(tmp[i+1].children[1]).focus();
				(tmp[i+1].children[1]).style.outline = "none";
			}
			returnVal=false;
		}
		if(!urlExp.test(url) && linkExp.test(url)){
			var newURL = "http://www.";
			newURL+=url;
			tmp[i+1].children[1].value = newURL;
			tmp[i+1].children[1].text = newURL;
			returnVal=true;
		}

	}
	return returnVal;
}


function putDataToInputs(){

	var formData = JSON.parse(localStorage.getItem("FormData"));
	if(formData == null) return;
	for(var i=0; i<formData.length; i++){
		var reportsNumber = 1;
		var foldersNumber = 1;
		if(formData[i].formId == "ReportsForm"){
			var inputName = "#reportName"+reportsNumber;
			var inputURL = "#reportUrl"+reportsNumber;
			$(inputName).value = formData[i].name;
			$(inputURL).value = formData[i].url;
			reportsNumber++;
		}

		if(formData[i].formId == "MyTeamFoldersForm "){
			var inputName = "#folderName"+reportsNumber;
			var inputURL = "#foldertUrl"+reportsNumber;
			$(inputName).value = formData[i].name;
			$(inputURL).value = formData[i].url;
			foldersNumber++;
		}
	}
}


document.addEventListener('keyup' , function(e){
	var active = window.location.hash;
	var cod = e.keyCode;
	//Left
	if(e.keyCode == 37){
		LeftArrowTabEvent(active);
	}
	//Right
	if(e.keyCode == 39){
		RightArrowTabEvent(active);
	}
});

function LeftArrowTabEvent(data){
	if(data == "#quick-reports")
		return;
	else if(data == "#my-folders")
		reloadTab("#quick-reports");
	else if(data == "#my-team-folders")
		reloadTab("#my-folders");
	else if(data == "#public-folders")
		reloadTab("#my-team-folders");
}

function RightArrowTabEvent(data){
	if(data == "#public-folders")
		return;
	else if(data == "#my-team-folders")
		reloadTab("#public-folders");
	else if(data == "#my-folders")
		reloadTab("#my-team-folders");
	else if(data == "#quick-reports")
		reloadTab("#my-folders");
}

$("#reports-form").addEventListener('keyup' , function(e){
	//Enter
	if(e.keyCode == 13){
		saveButton("#quick-reports");
		return;
	}
	//ESC
	if(e.keyCode == 27){
		$("#reports-form").classList.toggle("hidden");
		return;
	}
	focusedId = document.activeElement.getAttribute('id');
	//Right arrow
	if(e.keyCode == 39){
		RightArrowFormEvent("#reports-form");
	}
	//Left arrow
	if(e.keyCode == 37){
		LeftArrowFormEvent("#reports-form");
	}
});

function RightArrowFormEvent(data){
	var name;
	var url;
	if(data == "#folders-form"){
		name = "folderName";
		url = "folderUrl";
	}else{
		name = "reportName";
		url = "reportUrl";
	}
	for(var i=1; i<=3; i++){
			if(focusedId == name+i){
				$("#"+url+i).focus();
				return;
			}
			if(focusedId == url+i && i<3){
				$("#"+name+(i+1)).focus();
				return;
			}
		}
}


function LeftArrowFormEvent(data){
	var name;
	var url;
	if(data == "#folders-form"){
		name = "folderName";
		url = "folderUrl";
	}else{
		name = "reportName";
		url = "reportUrl";
	}

	for(var i=1; i<=3; i++){
			if(focusedId == name+i && i>1){
				$("#"+url+(i-1)).focus();
				return;
			}
			if(focusedId == url+i){
				$("#"+name+i).focus();
				return;
			}
		}
}

$("#folders-form").addEventListener('keyup' , function(e){
	//ESC
	if(e.keyCode == 27){
		$("#folders-form").classList.toggle("hidden");
		return;
	}
	//Enter
	if(e.keyCode == 13){
		saveButton("my-team-folders");
		return;
	}

	focusedId = document.activeElement.getAttribute('id');
	//Right arrow
	if(e.keyCode == 39){
		RightArrowEvent("#folders-form");
	}
	//UP arrow
	if(e.keyCode == 38){
		UpArrowEvent("#folders-form");	
	}
	//Down arrow
	if(e.keyCode == 40){
		DownArrowEvent("#folders-form");
	}
	//Left arrow
	if(e.keyCode == 37){
		LeftArrowEvent("#folders-form");
	}
});





function updatePageFromeJSON(response){
	updateNotificationArea(response.notification);
	updateNavBoxes(response.quickActions);
	updateActionsList(response.quickActions);
	updateTabsContent(response.tabsList);
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

			var icon = data[i].icon;
			navBox.style.background = " url(./img/icons/"+ icon +".png) left 50% top 77px no-repeat black";

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
			var actionOptions = list.getElementsByTagName("li");
			for(var j=0; j<actionList.length; j++){
				actionOptions[j].childNodes[0].innerHTML = actionList[j].label;
				actionOptions[j].childNodes[0].href = actionList[j].url;
			}
		}
	}
}

function updateTabsContent(data){
	for(var i=1; i<=3; i++){
		$("#nameLabel"+i).innerHTML = data[0].options.rowLabel+" 0"+i;
		$("#folderLabel"+i).innerHTML = data[2].options.rowLabel+" 0"+i;
	}
	$("#myFoldersExpandTarget").href = data[1].options.url;
	$("#myFolderFrame").src = data[1].options.url;
	$("#publicFoldersExpandTarget").href = data[3].options.url;
	$("#publicFoldersFrame").src = data[3].options.url;
}

function search(data){

	var selReports = $("#bookmarks-quickreports");

	for(var i=0; i<selReports.options.length; i++){
		if(selReports.options[i].text == data ||
			selReports.options[i].text.search(data)!=-1){
			reloadTab("#quick-reports");
			var newLinkIndex = selReports.options[i].index;
			selReports.selectedIndex = newLinkIndex;
			changeIFrame();
			return true;
		}
	}

	selReports = $("#bookmarks-myTeamFolders");

	for(var i=0; i<selReports.options.length; i++){
		if(selReports.options[i].text == data ||
			selReports.options[i].text.search(data)!=-1){
			reloadTab("#my-team-folders");
			var newLinkIndex = selReports.options[i].index;
			selReports.selectedIndex = newLinkIndex;
			changeIFrame();
			return true;
		}
	}
	return false;
}

document.getElementById("searchInput").addEventListener('search', function(e){
			var data = document.getElementById("searchInput").value;
			if(!search(data)){
				var result = "The searched report " + data + " was not found."
				updateNotificationArea(result);
				return;
			}
	});



function saveButton(data){
	
	
	if(data == "#my-team-folders"){
		if( isInputsNull("#my-team-folders") ){
			clearSelectOptions("#my-team-folders");
			deleteLinksFromLocalStorage("#my-team-folders");
			$("#folders-form").classList.toggle("hidden");
			$("#bookmarks-myTeamFolders").classList.add("hidden");
			$("#teamFolders-frame").classList.add("hidden");
			toggleExpandBtn();
			return;
		}
		if(isValid("my-team-folders") == true){
			saveLinks();
			$("#folders-form").classList.toggle("hidden");
			$("#bookmarks-myTeamFolders").classList.remove("hidden");
			$("#teamFolders-frame").classList.remove("hidden");
		}
	}

	else{
		if( isInputsNull("#quick-reports") ){
			clearSelectOptions("#quick-reports");
			deleteLinksFromLocalStorage("#quick-reports");
			$("#reports-form").classList.toggle("hidden");
			$("#bookmarks-quickreports").classList.add("hidden");
			$("#quickReports-frame").classList.add("hidden");
			toggleExpandBtn();
			return;
		}
		if(isValid("quick-reports") == true){
			saveLinks();
			$("#reports-form").classList.toggle("hidden");
			$("#bookmarks-quickreports").classList.remove("hidden");
			$("#quickReports-frame").classList.remove("hidden");
		}
	}

	toggleExpandBtn();
}

function saveLastSelectedTab(data){
	localStorage.setItem("lastTab", data);
}

function reloadLastTab(){
	var tabName = localStorage.getItem("lastTab");
	if(tabName == null)
		reloadTab("#quick-reports");
	else if(tabName != "")
		reloadTab(tabName);
}

function toggleExpandBtn(){
	if( $("#bookmarks-quickreports").options.length == 0){
		$("#expand-quickreports").classList.add("hidden");
	}else{
		$("#expand-quickreports").classList.remove("hidden");
	}

	if($("#bookmarks-myTeamFolders").options.length == 0){
		$("#expand-myTeamFolders").classList.add("hidden");
	}else{
		$("#expand-myTeamFolders").classList.remove("hidden");
	}
}

function init(){


	UTILS.ajax("data/config.json" , {done: updatePageFromeJSON});
	reloadLastTab();
	updateSelect("#quick-reports");
	updateSelect("#my-team-folders");
	toggleExpandBtn();
	putDataToInputs();

	document.getElementById("saveBtn-reports").addEventListener('click', function(e){
		saveButton("#quick-reports");
		$("#btnSettings-quickreports").classList.toggle("settingsBtn-greyBG");
		$("#btnSettings-quickreports").classList.toggle("settingsBtn-whiteBG");
	});

	document.getElementById("teamFolders-save-btn").addEventListener('click', function(e){
		saveButton("#my-team-folders");
		$("#team-folder-settings-btn").classList.toggle("settingsBtn-greyBG");
		$("#team-folder-settings-btn").classList.toggle("settingsBtn-whiteBG");
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
		$("#btnSettings-quickreports").classList.toggle("settingsBtn-greyBG");
		$("#btnSettings-quickreports").classList.toggle("settingsBtn-whiteBG");
		$("#reports-form").classList.toggle("hidden");
		$("#reportName1").focus();
	});

	document.getElementById("team-folder-settings-btn").addEventListener('click', function(e){
		$("#folders-form").classList.toggle("active");
		$("#team-folder-settings-btn").classList.toggle("settingsBtn-greyBG");
		$("#team-folder-settings-btn").classList.toggle("settingsBtn-whiteBG");
		$("#folders-form").classList.toggle("hidden");
		$("#folderName1").focus();
	});

}

window.onLoad = init();