var w = 500;
var h = 300;

var projection = d3.geoAlbersUsa()
                    .translate([w/2, h/2])
                    .scale([500]);

var path = d3.geoPath()
            .projection(projection);

d3.json("us-states.json", function(json) {

    //// MAP /////
    var svg = d3.select("#usageomap")
                .append("svg")
                .attr('width', w)
                .attr('height', h)

    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', 'steelblue');

});
