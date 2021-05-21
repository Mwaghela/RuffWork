var jsonData = {};
var searchFlag = false;

function createDynamicCard(component){
    var dynamicContent = "<div class='col-xl-3 col-lg-3 col-md-3'><div class='card bg-light mb-3' style='max-width: 18rem;'>";
    dynamicContent += "<div class='card-header'>"
    dynamicContent += "<div class='float-right' onclick=\"deleteRuffWork(\'"+component.seqId+"\')\"><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'>";
    dynamicContent += "<path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>";
    dynamicContent += "<path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>";
    dynamicContent += "</svg></div>";
    dynamicContent += "<blockquote class='blockquote text-left'><p class='mb-0'>"+component.title+"</p>";
    dynamicContent += "<footer class='blockquote-footer text-right'><small>"+component.id+"</small></footer></blockquote>"
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

function deleteRuffWork(seqId){
    console.log("Delete seqId:"+seqId);
    console.log("jsonData:"+JSON.stringify(jsonData));
    delete jsonData.data.component.splice(seqId, 1);
    refreshContent(jsonData);
}

function searchData(value) {
    if(value == "" && searchFlag) {
        searchFlag = false;
        refreshContent(jsonData);
    } else if(value != "") {
        searchFlag = true;
        var searchData = jsonData.data.component.filter(val => val.title.toUpperCase().includes(value.toUpperCase()) || val.content.toUpperCase().includes(value.toUpperCase()));
        var filterData = {};
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