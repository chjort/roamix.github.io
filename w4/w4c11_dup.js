var w = 600;
var h = 300;
var padding = 40;

var rowConverter = function(d) {
    return {
        date: new Date(+d.year, (+d.month - 1)),
        average: parseFloat(d.average)
    };
}

d3.csv('data.csv', rowConverter, function(dataset) {

    // console.table(data, ["date", "average"]);
    var xScale = d3.scaleTime()
        .domain([d3.min(data, function(d) { return d.date;}),
                 d3.max(data, function(d) { return d.date;})])
        .range([padding, w]);

    var yScale = d3.scaleLinear()
        .domain([d3.min(data, function(d) { if (d.average >= 0) {
            return d.average;
        };}),
                 d3.max(data, function(d) { return d.average;})])
        .range([h - padding, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    var line = d3.line()
                 .defined(function(d) { return d.average >= 0;})
                 .x(function(d) { return xScale(d.date);})
                 .y(function(d) { return yScale(d.average);});

    var dangerLine = d3.line()
                    .defined(function(d) { return d.average >= 350;})
                    .x(function(d) { return d.date;})
                    .y(function(d) { return d.average;});

    var area = d3.area()
                .defined(function(d) { return d.average >= 0;})
                .x(function(d) { return xScale(d.date);})
                .y0(function() { return yScale.range()[0];})
                .y1(function(d) { return yScale(d.average);});

    var dangerArea = d3.area()
                .defined(function(d) { return d.average <= 350;})
                .x(function(d) { return xScale(d.date);})
                .y0(function() { return yScale.range()[0];})
                .y1(function(d) { return yScale(d.average);});

    var svg = d3.select('#c11')
                .append("svg")
                .attr('height', h)
                .attr('width', w);

    // CREATE PATHS
	svg.append("path")
		.datum(data)
		.attr("class", "line")
		.attr("d", line);

	svg.append("path")
		.datum(data)
		.attr("class", "line danger")
		.attr("d", dangerLine);

    // DANGER LINE
    svg.append("line")
        .attr('class', 'line safeLevel')
        .attr('x1', padding)
        .attr('x2', w)
        .attr('y1', yScale(350))
        .attr('y2', yScale(350));

    // DANGER TEXT
    svg.append("text")
		.attr("class", "dangerLabel")
		.attr("x", padding + 20)
		.attr("y", yScale(350) - 7)
		.text("350 ppm “safe” level");

    // AREA
    svg.append("area")
        .datum(data)
        .attr('class', 'area')
        .attr('d', area);

    // DANGER AREA
    svg.append("area")
        .datum(data)
        .attr('class', 'danger area')
        .attr('d', dangerArea);

    // APPEND AXIS
    svg.append('g')
        .attr('class', 'x axis')
        .attr("transform", "translate(0," + (h - padding) + ")")
        .call(xAxis);

    svg.append('g')
        .attr('class', 'y axis')
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

});
