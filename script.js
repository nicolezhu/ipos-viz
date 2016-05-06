var margin = {top: 20, right: 20, bottom: 30, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// initialize scales
var x0 = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

var x1 = d3.scale.ordinal();

var y = d3.scale.linear()
  .range([height, 0]);

var color = d3.scale.ordinal()
  .range(["#d5564a", "#0d91e5"]);

// initialize axis
var xAxis = d3.svg.axis()
  .scale(x0)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(9, "%")
  .tickFormat(d3.format(".s%"), "*");

function make_y_axis() {        
  return d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
}

// initialize svg, making it responsive with svg viewbox to preserve aspect ratio
var svg = d3.select("#chart").append("svg")
  .attr("width", '100%')
  .attr("height", '100%')
  .attr("viewBox", '0 0 960 500')
  .attr('preserveAspectRatio','xMinYMin')
  .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")")
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load data from csv
d3.csv("to_chart.csv", function(error, data) {
  if (error) throw error;

  var percentProfits = d3.keys(data[0]).filter(function(key) { return key !== "year_range"; });

  data.forEach(function(d) {
    d.profits = percentProfits.map(function(name) { return {name: name, value: +d[name]}; });
  });

  x0.domain(data.map(function(d) { return d.year_range; }));
  x1.domain(percentProfits).rangeRoundBands([0, x0.rangeBand()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(d.profits, function(d) { return d.value; }); })]);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 4)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("% Profitable IPOs");

  // add grid lines
  svg.append("g")         
    .attr("class", "grid")
    .call(make_y_axis()
      .tickSize(-width, 0, 0)
      .tickFormat("")
    )

  // add bars
  var years = svg.selectAll(".years")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.year_range) + ",0)"; });

  years.selectAll("rect")
      .data(function(d) { return d.profits; })
    .enter().append("rect")
      .attr("class", function(d) { 
        return (d.name == "percent_prof_tech") ? "tech" : "other";
      })
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { return x1(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  // initialize annotations to display each value above the bar
  years.selectAll("text")
      .data(function(d) { return d.profits; })
    .enter()
      .append("text")
      .attr("width", x1.rangeBand())
      .attr("x", function(d) { 
        return x1(d.name) + (x1.rangeBand() / 2); 
      })
      .attr("text-anchor", "middle")
      .attr("y", function(d) { return y(d.value) - 5; })
      .attr("height", function(d) { return height - y(d.value); })
      .text(function(d) {
        return d3.format(".3g")(d.value) + "%";
      });

  // initialize legend
  var legend = svg.selectAll(".legend")
      .data(percentProfits.slice().reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

});