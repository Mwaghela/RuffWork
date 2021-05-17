var jsonData = {};
async function readFileContent(event) {
    const file = event.target.files.item(0)
    const text = await file.text();
    jsonData = JSON.parse(text);
    console.log(jsonData);
}