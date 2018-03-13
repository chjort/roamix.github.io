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

	//Create scale functions
	xScale = d3.scaleTime()
				   .domain([
						d3.min(dataset, function(d) { return d.date; }),
						d3.max(dataset, function(d) { return d.date; })
					])
				   .range([padding, w]);
	yScale = d3.scaleLinear()
					.domain([
						d3.min(dataset, function(d) { if (d.average >= 0) return d.average; }) - 10,
						d3.max(dataset, function(d) { return d.average; })
					])
					.range([h - padding, 0]);
	//Define axes
	xAxis = d3.axisBottom()
			   .scale(xScale)
			   .ticks(10)
			   .tickFormat(formatTime);
	//Define Y axis
	yAxis = d3.axisLeft()
			   .scale(yScale)
			   .ticks(10);
	//Define area generators
	area = d3.area()
				.defined(function(d) { return d.average >= 0; })
				.x(function(d) { return xScale(d.date); })
				.y0(function() { return yScale.range()[0]; })
				.y1(function(d) { return yScale(d.average); });
	dangerArea = d3.area()
				.defined(function(d) { return d.average >= 350; })
				.x(function(d) { return xScale(d.date); })
				.y0(function() { return yScale(350); })
				.y1(function(d) { return yScale(d.average); });
	//Create SVG element
	var svg = d3.select("body")
				.append("svg")
				.attr("width", w)
				.attr("height", h);
	//Create areas
	svg.append("path")
		.datum(dataset)
		.attr("class", "area")
		.attr("d", area);
	svg.append("path")
		.datum(dataset)
		.attr("class", "area danger")
		.attr("d", dangerArea);
	//Create axes
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (h - padding) + ")")
		.call(xAxis);
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
	//Draw 350 ppm line
	svg.append("line")
		.attr("class", "line safeLevel")
		.attr("x1", padding)
		.attr("x2", w)
		.attr("y1", yScale(350))
		.attr("y2", yScale(350));
	//Label 350 ppm line
	svg.append("text")
		.attr("class", "dangerLabel")
		.attr("x", padding + 20)
		.attr("y", yScale(350) - 7)
		.text("350 ppm “safe” level");

});
