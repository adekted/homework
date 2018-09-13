// from data.js
var tableData = data;

// YOUR CODE HERE!
var filterButton = d3.select('#filter-btn')

filterButton.on("click", function(){
    let filterDate = d3.select('#datetime').property('value');
    let filteredData = tableData.filter(dates => dates.datetime === filterDate);
    var tbody = tbody.append("tr");
    filteredData.forEach(function(info){
        var row = tbody.append("tr");
        Object.entries(info).forEach(function ([key, value]) {
            //     // Append a cell to the row for each value
            var cell = tbody.append("td");
            cell.text(value);
          });
    })
})
