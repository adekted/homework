// Parameters
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width/2.5
var margin = 25;
var paddingB = 50;
var paddingL = 50;
var labelArea = 75;
var circleRadius = 10;

// Creating Boundaries/Axis
var svg = d3.select("#scatter").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

svg.append("g").attr("class", "xText");
svg.append("g").attr("class", "yText");

var xText = d3.select('.xText');
var yText = d3.select('.yText');
var leftX = margin + paddingL;
var leftY = (height + labelArea) / 2 - labelArea;

function xRefresh(){
    xText.attr("transform", "translate(" + 
    ((width - labelArea) /2 + labelArea) + ", " + 
    (height - margin - paddingB) + ")")
}
function yRefresh(){
    yText.attr("transform", "translate(" + leftX + ", " + leftY + ")rotate(-90)")
}
xRefresh();
yRefresh();

// X and Y-Axis Names
xText.append("text").attr("y", 0).attr("data-name", "age").attr("data-axis", "x").attr("class", "aText inactive x").text("Age (Median)");
xText.append("text").attr("y", 26).attr("data-name", "income").attr("data-axis", "x").attr("class", "aText inactive x").text("Household Income (Median)");
xText.append("text").attr("y", -26).attr("data-name", "poverty").attr("data-axis", "x").attr("class", "aText active x").text("In Poverty (%)");

yText.append("text").attr("y", 0).attr("data-name", "smokes").attr("data-axis", "y").attr("class", "aText inactive y").text("Smokes (%)");
yText.append("text").attr("y", 26).attr("data-name", "healthcare").attr("data-axis", "y").attr("class", "aText inactive y").text("Lacks Healthcare (%)");
yText.append("text").attr("y", -26).attr("data-name", "obesity").attr("data-axis", "y").attr("class", "aText active y").text("Obesity (%)");

// Data Visualization
function visualization(Data){
    var actX = "poverty";
    var actY = "obesity";
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    var toolTip = d3.tip().attr("class", "d3-tip").offset([50, -50])
        .html(function(d){
            var tipX;
            var StateX = "<div>" + d.state + "</div>"
            var tipY = "<div>" + actY + ": " + d[actY] + "%</div>"
            if (actX === "poverty"){
                tipX = "<div>" + actX + ": " + d[actX] + "%</div>"
            }
            else {
                tipX = "<div>" + actX + ": " + parseFloat(d[actX]).toLocaleString("en") + "</div>"
            }
            return StateX + tipX + tipY
    })
    svg.call(toolTip)

    function xMinMax(){
        xMin = d3.min(Data, function(d){
            return parseFloat(d[actX] * 0.90)
        })
        xMax = d3.max(Data, function(d){
            return parseFloat(d[actX] * 1.10)
        })
    }

    function yMinMax(){
        yMin = d3.min(Data, function(d){
            return parseFloat(d[actY] * 0.90)
        })
        yMax = d3.max(Data, function(d){
            return parseFloat(d[actY] * 1.10)
        })
    }

    function labelChange(axis, clickText){
        d3.select(".aText").filter("." + axis).filter(".active").classed("active", false).classed("inactive", true);
        clickText.classed("inactive", false).classed("active", true);
    }

    xMinMax();
    yMinMax();

    var xScale = d3.scaleLinear().domain([xMin, xMax]).range([margin+labelArea, width - margin])
    var yScale = d3.scaleLinear().domain([yMin, yMax]).range([height - margin - labelArea, margin])
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);
}

d3.csv("assets/data/data.csv").then(function(data){
    visualize(data);
})