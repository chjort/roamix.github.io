
var margin = {
    top: 20,
    right: 20,
    bottom: 110,
    left: 50
},
    margin2 = {
        top: 400,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    width2 = 850 - margin.left - margin.right,
    height2 = 515 - margin2.top - margin2.bottom;

//Define map projection
var projection = d3.geoMercator()
    .center([-74.0, 40.7])
    .translate([width*0.5, height*0.8])
    .scale([(height * width) / 5]);

//Define path generator
var path = d3.geoPath()
    .projection(projection);

//Number formatting for gps location
var formatAs2dec = d3.format(".5n");  //

// Create SVG element
var svg = d3.select(".viz")
    .append("svg")
    .attr("width", width + 150 + margin.left + margin.right)
    .attr("height", height + 200 + margin.top + margin.bottom);

// Create a container in which linegraph elements will live
var linegraph = svg.append("g")
    .attr("class", "linegraph")
    .attr("transform", "translate(" + (margin.left + 50) + "," + margin.top + ")");

// Create slider element for linegraph
var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + (margin.left + 1.5 + 50) + "," + (margin.top - 0.5) + ")");

//Create a container in which map elements will live (was id)
var map = svg.append("g")
    .attr("class", "map")
    .attr("transform", "translate(" + margin.left + "," + margin.bottom + ")");

//Define quantize scale to sort data values into buckets of color
var color = d3.scaleOrdinal()
    .range(["#6e7f80", "#536872", "#708090", "#536878", "#36454f"]);

// Date formater and parsers
var dateParser = d3.timeParse("%m/%d/%Y");
var dateFormater = d3.timeFormat("%Y/%m/%d");
var yearFormater = d3.timeFormat("%Y");

//Load in GeoJSON data
d3.json("data/boroughs.geojson", function (json) {

    map.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .style("fill", function (d) {
            return color(d.properties.BoroName)
        })
        .attr("d", path);

    //Load in murder data
    d3.csv("data/all_murder.csv", function (data) {
    //d3.csv("data/2017_collissions_coords.csv", function (data) {

        // Brush defenition, extent equals the in which we can scale it
        var brush = d3.brushX()
            .extent([
                [0, 0],
                [width2, height2]
            ])
            .on("brush end", brushed);

        // Nested data, dates = key, length = # of murders
        var sortedByDate = d3.nest()
            .key(function (d) { return dateFormater(dateParser(d.RPT_DT)); })
            .sortKeys(d3.ascending)
            .entries(data);

        var xScale = d3.scaleTime()
            .domain(d3.extent(sortedByDate, function (d) { return Date.parse(d.key) }))
            .range([0, width2]),
            yScale = d3.scaleLinear()
                .domain([0, d3.max(sortedByDate, function (d) { return d.values.length })])
                .range([height2, 0]);

        //In yScale (was) => .domain(d3.extent(sortedByDate, function (d) { return d.values.length }).reverse())

        // Define the x and y axis
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(10)
            .tickFormat(yearFormater),
            yAxis = d3.axisLeft()
                .scale(yScale);

        // Line function
        var line = d3.line()
            .x(function (d) { return xScale(Date.parse(d.key)) })
            .y(function (d) { return yScale(d.values.length) });

        //Create line
        linegraph.append("path")
            .datum(sortedByDate)
            .attr("class", "lineplot")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "darkorchid")
            .attr("opacity", 0.75);

        //Create xAxis
        linegraph.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 0 + "," + height2 + ")")
            .call(xAxis);

        //Create yAxis
        linegraph.append("g")
            .attr("class", "axis")
            .call(yAxis);

        // Apply brush to slider
        slider.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, xScale.range());

        var circle = map
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
            .attr("class", "circle");

        svg.call(brush)
        svg.call(brush.move, xScale.range())

        //create brush function redraw scatterplot with selection
        function brushed() {
            var selection = d3.event.selection;

            if (selection !== null) {
                var e = d3.event.selection.map(xScale.invert, xScale);

                var test = map.selectAll(".circle");
                test.classed("selected", function (d) {
                    return e[0] <= Date.parse(d.RPT_DT) && e[1] >= Date.parse(d.RPT_DT);
                })
            }
        }
    });
});
