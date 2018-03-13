//Width and height
var w = 500;
var h = 300;

var projection = d3.geoAlbersUsa()
                       .translate([w/2, h/2])
                       .scale([500]);

var path = d3.geoPath()
                 .projection(projection);

var color = d3.scaleQuantize()
                    .range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

var svg = d3.select("#cities")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

d3.csv("us-ag-productivity.csv", function(data) {

    color.domain([
        d3.min(data, function(d) { return d.value; }),
        d3.max(data, function(d) { return d.value; })
    ]);

    d3.json("us-states.json", function(json) {

        for (var i = 0; i < data.length; i++) {
            var dataState = data[i].state;
            var dataValue = parseFloat(data[i].value);

            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    json.features[j].properties.value = dataValue;
                    break;
                }
            }
        }

        svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .style("fill", function(d) {
                var value = d.properties.value;
                if (value) {
                    return color(value);
                } else {
                    return "#ccc";
                }
           });

        d3.csv('us-cities.csv', function(data2) {

            svg.selectAll('circle')
                .data(data2)
                .enter()
                .append('circle')
                .attr('cx', function(d) { return projection([d.lon, d.lat])[0];})
                .attr('cy', function(d) { return projection([d.lon, d.lat])[1];})
                .attr('r', function(d) { return Math.sqrt(parseInt(d.population) *0.00004);})
                .style('fill', 'yellow')
                .style('stroke', 'black')
                .style('stroke-width', 0.25)
                .style('opacity', 0.75)
                .append('title')
                .text(function(d) { return d.place + ": Pop. " + formatAsThousands(d.population);})
        });

    });
});
