// from data.js
var tableData = data;

// YOUR CODE HERE!
var filterButton = d3.selectAll('#filter-btn')
var table = d3.select("tbody");

function createData(data){
    table.html("")
    data.forEach(function(info){
        var row = table.append("tr");
        Object.entries(info).forEach(function ([key, value]) {
            var cell = row.append("td");
            cell.text(value);
    })
})}

filterButton.on("click", function(){
    d3.event.preventDefault();
    let filteredData = tableData;
    var dateFilter = d3.select("#datetime").property("value")
    filteredData = filteredData.filter(row => row.datetime === dateFilter);
    createData(filteredData);
})
createData(tableData)