// Margins and dimensions for the bubble plot
const margin = {top: 50, right: 50, bottom: 70, left: 70},
width = 800 - margin.left - margin.right,
height = 672 - margin.top - margin.bottom;

// Add svg object to the bubble plot div
const svg = d3.select("#bubble_plot")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(100, 30)`);
// .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Add the grey background that makes ggplot2 famous
/* svg
.append("rect")
.attr("x",0)
.attr("y",0)
.attr("height", height)
.attr("width", height)
.style("fill", "#F8F8F8") */

// Axes scales
const x = d3.scaleLinear()
.domain([0, 110000])
.range([ 0, width ]);

const y = d3.scaleLinear()
.domain([1200, 2800])
.range([ height, 0]);

// gridlines in x axis function
function make_x_gridlines() {
  return d3.axisBottom(x).ticks(10)
}

// gridlines in y axis function
function make_y_gridlines() {
  return d3.axisLeft(y).ticks(10)
}

function updateChart(year) {
  console.log(year);
  // Add active class to the current button (highlight it)
  var header = document.getElementById("pages");
  var btns = header.getElementsByClassName("btn-link");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
    });
  }
}

// Get the data from github gist to avoid the cors issue
d3.csv("https://gist.githubusercontent.com/ratanbajpai/c193761399371a5b61534f87c8ef0bc8/raw/d827cf69156bdccc1103a0f6734c56dfb0128d12/DVFinalProjectData.csv")
.then( function(data) {

  // Add the x gridlines
  svg.append("g")
  .attr("class", "grid")
  .attr("transform", "translate(0," + height + ")")
  .call(make_x_gridlines()
  .tickSize(-height)
  .tickFormat("")
)

// Add the y gridlines
svg.append("g")
.attr("class", "grid")
.call(make_y_gridlines()
.tickSize(-width)
.tickFormat("")
)

// Add x axis
svg.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

// Text label for the x axis
svg.append("text")
.attr("class", "axisText")
.attr("transform", "translate(" + (width/2) + " ," +
(height + 50) + ")")
.style("text-anchor", "middle")
.text("Per Capita GDP (in 2017 US$)");

// Add y axis
svg.append("g")
.call(d3.axisLeft(y));

// Text label for the y axis
svg.append("text")
.attr("class", "axisText")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 2)
.attr("x",0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.text("Average Annual Hours (per worker)");

// Add a scale the size of bubbles
const z = d3.scaleLinear()
.domain([0, 1500])
.range([ 4, 30]);

// Add a scale for the color of bubbles
const myColor = d3.scaleOrdinal()
.domain(["Asia", "Europe", "North America", "South America", "Africa", "Oceania"])
// Custom colors can be added as below
// .range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8", "#F08080"]);
.range(d3.schemeSet2);

// Create a tooltip div. This is hidden by default.
// Add the style to this div through the tooltip class
// const tooltip = d3.select("#my_dataviz")
const tooltip = d3.select('#main_content')
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")

// Create 3 functions to show / update (when mouse moves but stays
// on same circle) / hide the tooltip
const showTooltip = function(d) {
  tooltip
  .transition()
  .duration(200)
  tooltip
  .style("opacity", 1)
  .html("Country: " + d.country
  + "<br>" + "Population in millions: "+ Math.ceil(d.pop_2019)
  + "<br>" + "Average annual hours: " + d.avh_2019)
  // .style("left", (event.x)/2 + "px")
  // .style("top", (event.y)/2+30 + "px")
  .style("left", (d3.mouse(this)[0]+90) + "px")
  .style("top", (d3.mouse(this)[1]+200) + "px")
  // .style("right", d3.select(this).attr("cx") + "px")
  // .style("top", d3.select(this).attr("cy") + "px");
}
const moveTooltip = function(d) {
  tooltip
  // .style("left", (event.x)/2 + "px")
  // .style("top", (event.y)/2+30 + "px")
  .style("left", (d3.mouse(this)[0]+90) + "px")
  .style("top", (d3.mouse(this)[1]+200) + "px")
  // .style("right", d3.select(this).attr("cx") + "px")
  // .style("top", d3.select(this).attr("cy") + "px");
}
const hideTooltip = function(d) {
  tooltip
  .transition()
  .duration(200)
  .style("opacity", 0)
}

// Add the bubbles
// Fill-opacity can change the transparency of the circles
svg.append('g')
.selectAll("dot")
.data(data)
.join("circle")
.attr("class", "bubbles")
.attr("cx", d => x(d.gdp_pc_2019))
.attr("cy", d => y(d.avh_2019))
.attr("r", d => z(d.pop_2019))
.attr('fill-opacity', 0.8)
.style("fill", d => myColor(d.continent))
// Trigger the tooltip functions
.on("mouseover", showTooltip )
.on("mousemove", moveTooltip )
.on("mouseleave", hideTooltip )

}) // After loading data
