// Margins and dimensions for the bubble plot
const margin = {top: 50, right: 50, bottom: 70, left: 70},
    width = 800 - margin.left - margin.right,
    height = 672 - margin.top - margin.bottom;

// Add svg object to the bubble plot div
const svg = d3.select("#bubble_plot")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    // .attr("width", width)
    // .attr("height", height)
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 1050 800")
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Axes scales
const x = d3.scaleLinear()
  .domain([0, 110000])
  .range([ 0, width ]);

  const y = d3.scaleLinear()
    .domain([1200, 2800])
    .range([ height, 0]);

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(x)
            .ticks(10)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(10)
    }

function setupSVG(year) {}

// Get the data from github gist to avoid the cors issue
d3.csv("https://gist.githubusercontent.com/ratanbajpai/"
  + "c193761399371a5b61534f87c8ef0bc8/raw/d827cf69156bdccc1103a0f6734c56dfb0128d12/
  + "DVFinalProjectData.csv").then( function(data) {

  // add the X gridlines
  svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      )

  // add the Y gridlines
  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      )

  // Add X axis
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

    // text label for the x axis
    svg.append("text")
      .attr("transform",
          "translate(" + (width/2) + " ," +
          (height + 50) + ")")
      //                   (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Per Capita GDP (in 2017 US$)");

    // text label for the y axis
/* svg.append("text")
    .attr("class", "axisText")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("GDP Per Capita (in 2017 US$)"); */

  // Add Y axis
  svg.append("g")
    .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 5)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Average annual hours (per worker)");

    // text label for the x axis
    /* svg.append("text")
      .attr("class", "axisText")
      .attr("transform",
        "translate(" + (width / 2) + " ," +
        (height + margin.top + 30) + ")")
      .style("text-anchor", "middle")
      .text("Average annual hours per worker"); */

  // Add a scale the size of bubbles
  const z = d3.scaleLinear()
    .domain([0, 1500])
    .range([ 4, 30]);

  // Add a scale for the color of bubbles
  const myColor = d3.scaleOrdinal()
    .domain(["Asia", "Europe", "North America", "South America", "Africa", "Oceania"])
    // .range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8", "#F08080"]);
    .range(d3.schemeSet2);

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

  // -2- Create 3 functions to show / update (when mouse move but stay
  // on same circle) / hide the tooltip
  const showTooltip = function(d) {
    tooltip
      .transition()
      .duration(200)
    tooltip
      .style("opacity", 1)
      .html("Country: " + d.country + "<br>" + "Population in millions: "
        + Math.ceil(d.pop_2019)
        + "<br>" + "Average annual hours: " + d.avh_2019)
      //.style("left", (event.x)/2 + "px")
      //.style("top", (event.y)/2+30 + "px")
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
      // .style("right", d3.select(this).attr("cx") + "px")
      // .style("top", d3.select(this).attr("cy") + "px");
  }
  const moveTooltip = function(d) {
    tooltip
      //.style("left", (event.x)/2 + "px")
      //.style("top", (event.y)/2+30 + "px")
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
      // .style("right", d3.select(this).attr("cx") + "px")
      // .style("top", d3.select(this).attr("cy") + "px");
  }
  const hideTooltip = function(d) {
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

    // let texts = svg.selectAll("dot")
    svg.selectAll("dot")
    .data(data)
    .enter()
    .append('text')
    .text(d => d.country)
    .attr('color', 'black')
    .attr('font-size', 15)

    /* let ticked = () => {
    bubbles.attr('cx', (data) => {
            return data.x
        })
        .attr('cy', (data) => {
            return data.y
        });

    texts.attr('x', (data) => {
            return data.x
        })
        .attr('y', (data) => {
            return data.y
        });
      } */

}) // After loading data
