// Parameters
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width/2.5
var margin = 25;
var paddingB =  10;
var paddingL = 10;
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
    
    xAxis.ticks(10);
    yAxis.ticks(10);
    svg.append('g').call(xAxis).attr("class", "xAxis").attr("transform", "translate(0," + (height - margin - labelArea) + ")");
    svg.append('g').call(yAxis).attr("class", "yAxis").attr("transform", "translate(" + (margin + labelArea) + ", 0)");

    var circleGroup = svg.selectAll("g circleGroup").data(Data).enter();

    circleGroup.append("circle")
    .attr("cx", function(d) {return xScale(d[actX]);})
    .attr("cy", function(d) {return yScale(d[actY]);})
    .attr("r", circleRadius)
    .attr("class", function(d) {return "stateCircle " + d.abbr;})
    .on("mouseover", function(d) {toolTip.show(d, this); d3.select(this).style("stroke", "#323232")})
    .on("mouseout", function(d) {toolTip.hide(d); d3.select(this).style("stroke", "e3e3e3")})

    circleGroup.append('text').text(function(d){return d.abbr;})
    .attr("dx", function(d){return xScale(d[actX]);})
    .attr("dy", function(d){return yScale(d[actY]) + circleRadius/2.5;})
    .attr("font-size", circleRadius)
    .attr("class", "stateText")
    .on("mouseover", function(d){toolTip.show(d); d3.select("." + d.abbr).style("stroke", "#323232")})
    .on("mouseout", function(d){toolTip.hide(d); d3.select("." + d.abbr).style("stroke", "#e3e3e3")})

    d3.selectAll(".aText").on("click", function(){
        var atext_self = d3.select(this)
        if (self.classed("inactive")){
            var atext_axis = self.attr("data-axis")
            var atext_name = self.attr("data-name")

            if (atext_axis === "x") {
                actX = atext_name
                xMinMax();
                xScale.domain([xMin, xMax]);
                svg.select(".xAxis").transition.duration(500).call(xAxis);
                d3.selectAll("circle").each(function(){
                    d3.select(this).transition().attr("cx", function(d){return xScale(d[actX]).duration(500);})
                });
                d3.selectAll(".stateText").each(function(){
                    d3.select(this).transition().attr("dx", function(d){return xScale(d[actX]).duration(500);})
                });
                labelChange(axis, self);
            }
            else {
                actY = atext_name
                yMinMax();
                yScale.domain([yMin, yMax]);
                svg.select(".yAxis").transition.duration(500).call(yAxis);
                d3.selectAll("circle").each(function(){
                    d3.select(this).transition().attr("cy", function(d){return yScale(d[actY]).duration(500);})
                });
                d3.selectAll(".stateText").each(function(){
                    d3.select(this).transition().attr("dy", function(d){return yScale(d[actY]).duration(500);})
                });
                labelChange(axis, self);
            }
        }
    })
}

d3.csv("assets/data/data.csv", function(data){
    visualization(data);
})