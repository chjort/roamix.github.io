// JavaScript source code

//Width and height
var lw = 800;
var lh = 150;
margin = { top: 20, right: 20, bottom: 30, left: 50 };

var dateParser = d3.timeParse("%m/%d/%Y");
var dateFormater = d3.timeFormat("%Y/%m/%d")
var yearFormater = d3.timeFormat("%Y")

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", lw)
    .attr("height", lh)
    .append("g");

// Create slider element
var slider = svg.append("g")
    .attr("class", "slider")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Create a container in which all map elements will live
var linegraph = svg.append("g")
    .attr("id", "linegraph");

//Load in murder data
d3.csv("all_murder.csv", function (data) {

    var brush = d3.brushX()
        .extent([
            [0, 0],
            [lw, lh]
        ])
        .on("brush end", brushed);

    // Nested data, dates = key, length = # of murders
    var sortedByDate = d3.nest()
        .key(function (d) { return dateFormater(dateParser(d.RPT_DT)); })
        .sortKeys(d3.ascending)
        .entries(data);

    // X scale domain
    xScale = d3.scaleTime()
        .domain(d3.extent(sortedByDate, function (d) { return Date.parse(d.key) }))
        .range([margin.left, lw - margin.right]);

    // Y scale domain
    yScale = d3.scaleLinear()
        .domain([d3.max(sortedByDate, function (d) { return d.values.length }), 0])
        //.domain(d3.extent(sortedByDate, function (d) { return d.values.length }).reverse())
        .range([margin.bottom, lh - margin.top]);

    // Define the y axis
    yAxis = d3.axisLeft()
        .scale(yScale);

    // Define the x axis
    xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(10)
        .tickFormat(yearFormater);

    line = d3.line()
        .x(function (d) { return xScale(Date.parse(d.key)) })
        .y(function (d) { return yScale(d.values.length) });

    //Create line
    linegraph.append("path")
        .datum(sortedByDate)
        .attr("class", "lineplot")
        .attr("d", line)
        .attr("stroke", "steelblue")
        .attr("opacity", 1);

    //Create axes
    linegraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (lh - margin.top) + ")")
        .call(xAxis);

    // was "translate(" + margin.left + ",0)")
    linegraph.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    slider.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, xScale.range());

    //create brush function redraw scatterplot with selection
    function brushed() {
        var selection = d3.event.selection;

        if (selection !== null) {
            var e = d3.event.selection.map(xScale.invert, xScale);

            var test2 = circles.selectAll(".dot_map");
            test2.classed("selected", function (d) {
                return e[0] <= d.key && d.key <= e[1];
            })

            plot.selectAll(".lineplot")
                .attr("d", plotline(
                    data.filter(function (d) {
                        return e[0] <= d.key && e[1] >= d.key;
                    })
                ));
        }
    }

});
