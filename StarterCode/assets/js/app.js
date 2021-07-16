// @TODO: YOUR CODE HERE!
console.log("app.js loaded");
var svgWidth = 960;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 50 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper creation and appending the SVG group to hold the chart
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  // Chart margins
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
// Chart margins
  var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Importing csv file
d3.csv("/assets/data/data.csv").then(function(stateData) {
    // console.log(stateData);
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
  });

   // Chart scaling functions
var xLinearScale = d3.scaleLinear()
.domain([9, d3.max(stateData, d => d.poverty)])
.range([0, width]);

var yLinearScale = d3.scaleLinear()
.domain([4, d3.max(stateData, d => d.healthcare)])
.range([height, 0]);

// Updating axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);  

chartGroup.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chartGroup.append("g")
.call(leftAxis);

// Creating circles    
var circlesGroup = chartGroup.selectAll("circle")
.data(stateData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.poverty))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", 15)
.attr("fill", "blue")
.attr("opacity", ".4")
.attr("stroke", "white");  

chartGroup.append("text")
.style("text-anchor", "middle")
.style("font-family", "arial")
.style("font-size", "10")
.selectAll("tspan")
.data(stateData)
.enter()
.append("tspan")
.attr("x", function(data) {
    return xLinearScale(data.poverty);
})
.attr("y", function(data) {
    return yLinearScale(data.healthcare -.028);
})
.text(function(data) {
    return data.abbr
});

// Building tooltips for the chart
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([-10, 30])
.style("position", "absolute")
.style("background", "lightsteelblue")
.style("pointer-events", "none")
.html(function(d) {
    return (`${d.state}<br>Population In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
});  
chartGroup.call(toolTip);

// onmouseover event
circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
})

// onmouseout event
.on("mouseout", function(data, index) {
    toolTip.hide(data);
});

// Axis labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left) 
.attr("x", 0 - (height / 2)) 
.attr("dy", "1em")
.classed("aText", "True") 
.text("Lacks Healthcare (%)");

chartGroup.append("text")
.attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
.classed("aText", "True") 
.text("In Poverty (%)");

});