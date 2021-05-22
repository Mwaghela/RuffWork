var jsonData = {};
var filterData = {};
var searchFlag = false;
var editComponent = {};
var editFlag = false;
var editSeqId = 0;

function createDynamicCard(component){
    var dynamicContent = "<div class='col-xl-3 col-lg-3 col-md-3'><div class='card bg-light mb-3 shadow' style='max-width: 18rem;'>";
    dynamicContent += "<div class='card-header shadow-sm'>"
    dynamicContent += "<div class='float-end' onclick=\"deleteRuffWork(\'"+component.seqId+"\')\"><i class='fa fa-trash text-danger' style='font-size:18px;' aria-hidden='true'></i></div>";
    dynamicContent += "<div class='float-end margin-right2px' onclick=\"editRuffWork(\'"+component.seqId+"\')\"><i class='fa fa-pencil text-secondary' style='margin-right:5px;' aria-hidden='true'></i></div>";
    dynamicContent += "<blockquote class='blockquote text-left'><p class='mb-0'>"+component.title+"</p>";
    dynamicContent += "<footer class='blockquote-footer text-end' style='font-size:10px;margin-top:5px;'><small>"+component.id+"</small></footer></blockquote>"
    dynamicContent += "</div>";
    dynamicContent += "<div class='card-body'>";
    //dynamicContent += "<h5 class='card-title'>"+content+"</h5>";
    dynamicContent += "<p class='card-text'>"+component.content+"</p>";
    dynamicContent += "</div></div></div>";
    return dynamicContent;
}

async function readFileContent(event) {
    const file = event.target.files.item(0)
    const text = await file.text();
    jsonData = JSON.parse(text);
    console.log(jsonData);
    refreshContent(jsonData);
}

function refreshContent(data) {
    var cardList = data.data.component;
    var mainRow = document.getElementById("mainRow");
    mainRow.innerHTML = "";
    for(var idx=0; idx < cardList.length; idx++) {
        var dynamicContent = createDynamicCard(cardList[idx]);
        mainRow.innerHTML += dynamicContent;
    }
}

function saveRuffWork(){
    var addTitle = document.getElementById("addTitle").value;
    var addDetails = document.getElementById("addDetails").value;
    if(!jsonData.data) {
        jsonData.data = {};
    }
    if(!jsonData.data.component) {
        jsonData.data.component = [];
    }

    if(editFlag) {
        if(searchFlag) {
            filterData.data.component[editSeqId].title = addTitle;
            filterData.data.component[editSeqId].content = addDetails;
            refreshContent(filterData);
        } else {
            jsonData.data.component[editSeqId].title = addTitle;
            jsonData.data.component[editSeqId].content = addDetails;
            refreshContent(jsonData);
        }
        editComponent = {};
        editFlag = false;
        editSeqId = 0;
    } else {
        var len = jsonData.data.component.length;
        var date = new Date();
        var component = {};
        component.id = "TSK"+date.getTime();
        component.seqId = len;
        component.title = addTitle;
        component.content = addDetails;
        jsonData.data.component[len] = component;
        console.log(jsonData);
        refreshContent(jsonData);
    }
    console.log("FilterData:"+JSON.stringify(filterData));
    console.log("JsonData:"+JSON.stringify(jsonData));
}

function deleteRuffWork(seqId) {
    console.log("searchFlag:"+searchFlag);
    if(searchFlag) {
        console.log("delete");
        var id = filterData.data.component[seqId].id;
        jsonData.data.component = jsonData.data.component.filter(data => data.id != id);
        delete filterData.data.component.splice(seqId, 1);
        refreshContent(filterData);
    } else {
        console.log("delete");
        delete jsonData.data.component.splice(seqId, 1);
        refreshContent(jsonData);
    }
    console.log("after delete filterData:"+JSON.stringify(filterData));
    console.log("after delete jsonData:"+JSON.stringify(jsonData));
}

function searchData(value) {
    if(value == "" && searchFlag) {
        searchFlag = false;
        refreshContent(jsonData);
        filterData = {};
    } else if(value != "") {
        searchFlag = true;
        var searchData = jsonData.data.component.filter(val => val.title.toUpperCase().includes(value.toUpperCase()) || val.content.toUpperCase().includes(value.toUpperCase()));
        filterData.data = {};
        filterData.data.component = searchData;
        refreshContent(filterData);
    }
}

function downloadRuffWork() {
    console.log("Download");
    var date = new Date();
    var fileName = "RuffWork" + date.getTime() + ".json";
    var content = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonData));
    var downloadElement = document.createElement('a');
    downloadElement.setAttribute("href", content);
    downloadElement.setAttribute("download", fileName);
    document.body.appendChild(downloadElement);
    downloadElement.click();
    downloadElement.remove();
}

function showModal() {
    document.getElementById('addTitle').value = "";
    document.getElementById('addDetails').value = "";
    $('#taskModal').modal('show');
}

function editRuffWork(seqId) {
    editSeqId = seqId;
    editFlag = true;
    if(searchFlag) {
        editComponent = filterData.data.component[seqId];
        showModal();
        document.getElementById('addTitle').value = editComponent.title;
        document.getElementById('addDetails').value = editComponent.content;
    } else {
        editComponent = jsonData.data.component[seqId];
        showModal();
        document.getElementById('addTitle').value = editComponent.title;
        document.getElementById('addDetails').value = editComponent.content;
    }
}

function flushData() {
    editComponent = {};
    editFlag = false;
    editSeqId = 0;   
}

function loadTour() {
    console.log("Loading RuffWork Tour...");
}