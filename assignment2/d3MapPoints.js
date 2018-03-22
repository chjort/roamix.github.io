// JavaScript source code

//Width and height
var w = 800;
var h = 800;

//Define map projection
var projection = d3.geoMercator()
    .center([-74.0, 40.7])
    .translate([w / 2, h / 2])
    .scale([(h * w) / 10]);

//Define path generator
var path = d3.geoPath()
    .projection(projection);

//Number formatting for location
var formatAs2dec = d3.format(".5n");  //

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g");

//Create a container in which all map elements will live
var map = svg.append("g")
    .attr("id", "map");

//Define quantize scale to sort data values into buckets of color
var color = d3.scaleOrdinal()
    .range(["#6e7f80", "#536872", "#708090", "#536878", "#36454f"]);

//Load in GeoJSON data
d3.json("boroughs.geojson", function (json) {

    map.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .style("fill", function (d) {
            return color(d.properties.BoroName)
        })
        .attr("d", path);

    //Load in murder data
    d3.csv("all_murder.csv", function (data) {

        var circles = map
            .append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) {
                return projection([d.Longitude, d.Latitude])[0];
            })
            .attr("cy", function (d, i) {
                return projection([d.Longitude, d.Latitude])[1];
            })
            .attr("r", "2px")
            .attr("class", "dot_map")
            .style("fill", "red")
            .style("stroke", "yellow")
            .style("stroke-width", 0.50)
            .style("opacity", 0.75)

    });
});
