var jsonData = {};

function createDynamicCard(title, content){
    var dynamicContent = "<div class='col-xl-3 col-lg-3 col-md-3'><div class='card bg-light mb-3' style='max-width: 18rem;'>";
    dynamicContent += "<div class='card-header'>"+title+"</div>";
    dynamicContent += "<div class='card-body'>";
    //dynamicContent += "<h5 class='card-title'>"+content+"</h5>";
    dynamicContent += "<p class='card-text'>"+content+"</p>";
    dynamicContent += "</div></div></div>";
    return dynamicContent;
}

function addTask(){
    $('#taskModal').on('shown.bs.modal', function () {
        $('#taskTitle').trigger('focus');
    })
}

async function readFileContent(event) {
    const file = event.target.files.item(0)
    const text = await file.text();
    jsonData = JSON.parse(text);
    console.log(jsonData);
    loadContent(jsonData);
}

function loadContent(data) {
    var cardList = data.data.component;
    var mainRow = document.getElementById("mainRow");
    mainRow.innerHTML = "";
    for(var idx=0; idx < cardList.length; idx++) {
        var dynamicContent = createDynamicCard(cardList[idx].title, cardList[idx].content);
        mainRow.innerHTML += dynamicContent;
    }
}