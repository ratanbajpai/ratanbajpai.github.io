// Margins and dimensions for the bubble plot
const margin = {top: 50, right: 70, bottom: 70, left: 70},
width = 850 - margin.left - margin.right,
height = 672 - margin.top - margin.bottom;

// Add svg object to the bubble plot div
const svg = d3.select("#bubble_plot")
  .append("svg")
  //.attr("width", width + margin.left + margin.right)
  //.attr("height", height + margin.top + margin.bottom)
  //.attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 960 680")
  .append("g")
  .attr("transform", `translate(100, 30)`);
// .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Variable to store dataset after loading
var loadedData;

// Axes scales
const x = d3.scaleLinear()
  .domain([0, 110000])
  .range([ 0, width ]);

const y = d3.scaleLinear()
  .domain([1200, 2800])
  .range([ height, 0]);

// Add a z scale for the size of bubbles
const z = d3.scaleLinear()
  .domain([0, 1500])
  .range([ 4, 40]);

// Add a scale for the color of bubbles
const myColor = d3.scaleOrdinal()
  .domain(["Africa", "Europe", "North America",
    "South America", "Asia", "Oceania"])
  // Custom colors can be added as below
  // .range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8", "#F08080"]);
  .range(d3.schemeTableau10);

// gridlines in x axis function
function make_x_gridlines() {
  return d3.axisBottom(x).ticks(10)
}

// gridlines in y axis function
function make_y_gridlines() {
  return d3.axisLeft(y).ticks(10)
}

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

function initChart(year) {
  console.log(year);
  // Add active class to the current button (highlight it)
  var header = document.getElementById("pages");
  var btns = header.getElementsByClassName("btn-link");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      console.log("value of the element clicked== "+target.innerText);
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";

      // Now we need to update data based on what year was clicked
      updateChart(target.innerText);
    });
  }
}

function updateChart(year) {
  console.log("Year: " +year);
  // First remove all elements
  svg.selectAll("*").remove();

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

  // Add legend
  var values = ["Africa", "Europe", "North America",
    "South America", "Asia", "Oceania"];

  // Usually you have a color scale in your chart already
  /* var color = d3.scaleOrdinal()
      .domain(values)
      .range(d3.schemeSet2); */

  // Add one dot in the legend for each name.
  svg.selectAll("mydots")
      .data(values)
      .enter()
      .append("rect")
      .attr("x", width + 10)
      .attr("y", function (d, i) { return margin.top + i * 25 })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill", function (d) { return myColor(d) })

  // Add one dot in the legend for each name.
  svg.selectAll("mylabels")
      .data(values)
      .enter()
      .append("text")
      .attr("x", width + 20)
      .attr("y", function (d, i) { return margin.top + i * 25 })
      .style("fill", function (d) { return myColor(d) })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "mathematical")
      .style("font-size", "14px")

  // Add the bubbles
  // Fill-opacity can change the transparency of the circles
  if (year === "1980") {
    console.log("Year is 1980");
    svg.append('g')
      .selectAll("dot")
      .data(loadedData)
      .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.gdp_pc_1980))
        .attr("cy", d => y(d.avh_1980))
        .attr("r", d => z(d.pop_1980))
        .attr('fill-opacity', 1.0)
        .style("fill", d => myColor(d.continent))
      // Trigger the tooltip functions
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
  } else if (year === "2000") {
    console.log("Year is 2000");
    svg.append('g')
      .selectAll("dot")
      .data(loadedData)
      .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.gdp_pc_2000))
        .attr("cy", d => y(d.avh_2000))
        .attr("r", d => z(d.pop_2000))
        .attr('fill-opacity', 1.0)
        .style("fill", d => myColor(d.continent))
      // Trigger the tooltip functions
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
  } else if (year === "2019") {
    console.log("Year is 2019");
    svg.append('g')
      .selectAll("dot")
      .data(loadedData)
      .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.gdp_pc_2019))
        .attr("cy", d => y(d.avh_2019))
        .attr("r", d => z(d.pop_2019))
        .attr('fill-opacity', 1.0)
        .style("fill", d => myColor(d.continent))
      // Trigger the tooltip functions
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
    }
}

// Get the data from github gist to avoid the cors issue
d3.csv("https://gist.githubusercontent.com/ratanbajpai/c193761399371a5b61534f87c8ef0bc8/raw/d827cf69156bdccc1103a0f6734c56dfb0128d12/DVFinalProjectData.csv")
.then( function(data) {

  // Set the data variable
  loadedData = data;
  console.log("Going to update chart");
  // Call method to update chart
  updateChart("1980");

  /* svg.append('g')
    .selectAll("dot")
    .data(data)
    .join("circle")
      .attr("class", "bubbles")
      .attr("cx", d => x(d.gdp_pc_1980))
      .attr("cy", d => y(d.avh_1980))
      .attr("r", d => z(d.pop_1980))
      .attr('fill-opacity', 0.8)
      .style("fill", d => myColor(d.continent))
    // Trigger the tooltip functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip ) */


}) // After loading data
