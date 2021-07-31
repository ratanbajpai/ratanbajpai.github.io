// Margins and dimensions for the bubble plot
const margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 672 - margin.top - margin.bottom;

// Add svg object to the bubble plot div
const svg = d3.select("#bubble_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Get the data from github gist to avoid the cors issue
d3.csv("https://gist.githubusercontent.com/ratanbajpai/c193761399371a5b61534f87c8ef0bc8/raw/d827cf69156bdccc1103a0f6734c56dfb0128d12/DVFinalProjectData.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 110000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([1200, 2800])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale the size of bubbles
  const z = d3.scaleLinear()
    .domain([0, 1500])
    .range([ 4, 30]);

  // Add a scale for the color of bubbles
  const myColor = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "North America", "South America", "Africa", "Oceania"])
    .range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8", "#F08080"]);
    // .range(d3.schemeSet2);

  // -1- Create a tooltip div that is hidden by default:
  // const tooltip = d3.select("#my_dataviz")
  const tooltip = d3.select('body')
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
  //    .style("background-color", "white")
  //    .style("border-radius", "5px")
  //    .style("padding", "10px")
  //    .style("color", "black")
  //    .style("position", "absolute")

  // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  const showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Country: " + d.country + "<br>" + "Population in millions: " + Math.ceil(d.pop_2019)
        + "<br>" + "Average annual hours: " + d.avh_2019)
      // .style("left", (event.x)/2 + "px")
      // .style("top", (event.y)/2+30 + "px")
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  const moveTooltip = function(event, d) {
    tooltip
      // .style("left", (event.x)/2 + "px")
      // .style("top", (event.y)/2+30 + "px")
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  const hideTooltip = function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

  // Add dots
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
    // -3- Trigger the functions
    .on("mouseover", showTooltip )
    .on("mousemove", moveTooltip )
    .on("mouseleave", hideTooltip )

  })
