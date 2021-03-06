// Margins and dimensions for the bubble plot
const margin = {top: 50, right: 70, bottom: 70, left: 70},
width = 850 - margin.left - margin.right,
height = 672 - margin.top - margin.bottom;

// Add svg object to the bubble plot div
const svg = d3.select("#bubble_plot")
  .append("svg")
  //.attr("width", width + margin.left + margin.right)
  //.attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", "0 0 960 680")
  .append("g")
  .attr("transform", `translate(100, 30)`);
// .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Variable to store dataset after loading
var loadedData;
var chartYear = "1980";

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

const annot_2019 = [
  {
    note: {
      label: "In Bangladesh Myanmar and Cambodia on average people work much longer hours while earning a lot less.",
      title: "Bangladesh, Myanmar & Cambodia.",
      wrap: 215,  // try something smaller to see text split in several lines
      padding: 10   // More = text lower

    },
    color: ["#cc0000"],
    color: ["#cc0000"],
    x: 30,
    y: 125,
    dy: -45,
    dx: 45,
    subject: { radius: 25, radiusPadding: 10 },
    type: d3.annotationCalloutCircle,
  },
  {
    note: {
      label: "In Singapore, even though incomes are high, people work longer hours.",
      title: "Singapore",
      wrap: 125,  // try something smaller to see text split in several lines
      padding: 10   // More = text lower

    },
    color: ["#cc0000"],
    color: ["#cc0000"],
    x: 528,
    y: 160,
    dy: -30,
    dx: 30,
    subject: { radius: 25, radiusPadding: 10 },
    type: d3.annotationCalloutCircle,
  }
];

const annot_2000 = [
  {
    note: {
      label: "Most advanced European economies enjoy higher incomes while working lower hours.",
      title: "Europe",
      wrap: 215,  // try something smaller to see text split in several lines
      padding: 10   // More = text lower

    },
    color: ["#cc0000"],
    color: ["#cc0000"],
    x: 247,
    y: 425,
    dy: -125,
    dx: 125,
    subject: { radius: 60, radiusPadding: 10 },
    type: d3.annotationCalloutCircle,
  }
];

const annot_1980 = [
  {
    note: {
      label: "In the 1980s workers in most countries were working on an average over 1800 hours annually. This trend changes in the later slides to workers in more countries working fewer than 1800 hours.",
      title: "Higher Average Hours Worked",
      wrap: 220,  // try something smaller to see text split in several lines
      padding: 10   // More = text lower

    },
    color: ["#cc0000"],
    color: ["#cc0000"],
    x: 200,
    y: 300,
    dy: -50,
    dx: 50,
  }
];

// Create a tooltip div. This is hidden by default.
// Add the style to this div through the tooltip class
// const tooltip = d3.select("#my_dataviz")
const tooltip = d3.select('#bubble_plot')
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")

// Create 3 functions to show / update (when mouse moves but stays
// on same circle) / hide the tooltip
const showTooltip = function(d) {
  var pop, avg_hours, num_emp, gdp_pc;
  if (chartYear === "1980") {
    pop = d.pop_1980;
    avg_hours = d.avh_1980;
    num_emp = d.emp_1980;
    gdp_pc = d.gdp_pc_1980;
  } else if (chartYear === "2000") {
    pop = d.pop_2000;
    avg_hours = d.avh_2000;
    num_emp = d.emp_2000;
    gdp_pc = d.gdp_pc_2000;
  } else if (chartYear === "2019") {
    pop = d.pop_2019;
    avg_hours = d.avh_2019;
    num_emp = d.emp_2019;
    gdp_pc = d.gdp_pc_2019;
  }
  tooltip
  .transition()
  .duration(200)
  tooltip
  .style("opacity", 1)
  .html("<b>" + "Country: " + d.country + "</b>"
  + "<br>" + "Population (in millions): "+ Math.ceil(pop)
  + "<br>" + "Average annual hours worked: " + avg_hours
  + "<br>" + "Per capita GDP (2017 USD): " + gdp_pc)
  .style("left", (d3.event.pageX + 10) + "px")
  .style("top", (d3.event.pageY + 10) + "px")
}
const moveTooltip = function(d) {
  tooltip
  .style("left", (d3.event.pageX + 10) + "px")
  .style("top", (d3.event.pageY + 10) + "px")
}
const hideTooltip = function(d) {
  tooltip
  .transition()
  .duration(200)
  .style("opacity", 0)
}

function initChart(year) {
  // Add active class to the current button (highlight it)
  var header = document.getElementById("pages");
  var btns = header.getElementsByClassName("btn-link");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function(e) {
      e = e || window.event;
      var target = e.target || e.srcElement;
      chartYear = target.innerText;
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";

      // Now we need to update data based on what year was clicked
      updateChart(chartYear);
    });
  }
}

function updateChart(year) {
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
    .attr("class", "axisLabel")
    .attr("transform", "translate(" + (width/2) + " ," +
      (height + 50) + ")")
    .style("text-anchor", "middle")
    .text("Per Capita GDP (in 2017 US$)");

  // Add y axis
  svg.append("g")
    .call(d3.axisLeft(y));

  // Text label for the y axis
  svg.append("text")
    .attr("class", "axisLabel")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 2)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Average Annual Hours Worked (per worker)");

  // Add legend
  var values = ["Africa", "Europe", "North America",
    "South America", "Asia", "Oceania"];

  // Add legend squares for each continent
  svg.selectAll("legend")
      .data(values)
      .enter()
      .append("rect")
      .attr("x", width + 10)
      .attr("y", function (d, i) { return margin.top + i * 25 })
      .attr("width", 6)
      .attr("height", 6)
      .style("fill", function (d) { return myColor(d) })

  // Add label for each continent
  svg.selectAll("labels")
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
    const makeAnnot80 = d3.annotation()
      .annotations(annot_1980);
    svg.append("g")
      .style("font-size", 12)
      .call(makeAnnot80);
    svg.append('g')
      .selectAll("dot")
      .data(loadedData)
      .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.gdp_pc_1980))
        .attr("cy", d => y(d.avh_1980))
        .attr("r", d => z(d.pop_1980))
        .attr('fill-opacity', 0.85)
        .style("fill", d => myColor(d.continent))
      // Trigger the tooltip functions
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip )
  } else if (year === "2000") {
    const makeAnnot00 = d3.annotation()
      .annotations(annot_2000);
    svg.append("g")
      .style("font-size", 12)
      .call(makeAnnot00);
    svg.append('g')
      .selectAll("dot")
      .data(loadedData)
      .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.gdp_pc_2000))
        .attr("cy", d => y(d.avh_2000))
        .attr("r", d => z(d.pop_2000))
        .attr('fill-opacity', 0.85)
        .style("fill", d => myColor(d.continent))
      // Trigger the tooltip functions
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip );
  } else if (year === "2019") {
    const makeAnnot19 = d3.annotation()
      .annotations(annot_2019);
    svg.append("g")
      .style("font-size", 12)
      .call(makeAnnot19);
    svg.append('g')
      .selectAll("dot")
      .data(loadedData)
      .join("circle")
        .attr("class", "bubbles")
        .attr("cx", d => x(d.gdp_pc_2019))
        .attr("cy", d => y(d.avh_2019))
        .attr("r", d => z(d.pop_2019))
        .attr('fill-opacity', 0.85)
        .style("fill", d => myColor(d.continent))
      // Trigger the tooltip functions
      .on("mouseover", showTooltip )
      .on("mousemove", moveTooltip )
      .on("mouseleave", hideTooltip );
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

}) // After loading data
