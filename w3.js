var dataset = [100, 200, 300, 400, 500];

var dataset2d = [[  5, 20],
             [480, 90],
             [250, 50],
             [100, 33],
             [330, 95],
             [410, 12],
             [475, 44],
             [ 25, 67],
             [ 85, 21],
             [220, 88]];

w = 500;
h = 100;
padding = 20;

var xscale = d3.scaleLinear()
                .domain([0, d3.max(dataset2d, function(d) {return d[0];})])
                .range([padding, w - padding * 2]);

var yscale = d3.scaleLinear()
                .domain([0, d3.max(dataset2d, function(d) {return d[1];})])
                .range([h - padding, padding]);

svg = d3.select("#svg1")
        .append("svg")
        .attr("width", w)
        .attr("heigh", h)

svg.selectAll("circle")
    .data(dataset2d)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return xscale(d[0]);
    })
    .attr("cy", function(d) {
        return yscale(d[1]);
    })
    .attr("r", function(d) {
        return Math.sqrt(h - d[1]);
    });


svg.selectAll("text")
    .data(dataset2d)
    .enter()
    .append("text")
    .attr("x", function(d) {
        return xscale(d[0]);
    })
    .attr("y", function(d) {
        return yscale(d[1]) - 10;
    })
    .text(function(d) {
        return "(" + d[0] + ", " + d[1] + ")";
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "red");
