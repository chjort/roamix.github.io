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

var svg = d3.select("#pan")
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
                .text(function(d) { return d.place + ": Pop. " + d.population;});

                createPanButtons();
        });
    });
});


var createPanButtons = function() {
    console.log("hello there");
	//Create the clickable groups
	//North
	var north = svg.append("g")
		.attr("class", "pan")	//All share the 'pan' class
		.attr("id", "north");	//The ID will tell us which direction to head
	north.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", w)
		.attr("height", 30);
	north.append("text")
		.attr("x", w/2)
		.attr("y", 20)
		.html("&uarr;");

	//South
	var south = svg.append("g")
		.attr("class", "pan")
		.attr("id", "south");
	south.append("rect")
		.attr("x", 0)
		.attr("y", h - 30)
		.attr("width", w)
		.attr("height", 30);
	south.append("text")
		.attr("x", w/2)
		.attr("y", h - 10)
		.html("&darr;");
	//West
	var west = svg.append("g")
		.attr("class", "pan")
		.attr("id", "west");
	west.append("rect")
		.attr("x", 0)
		.attr("y", 30)
		.attr("width", 30)
		.attr("height", h - 60);
	west.append("text")
		.attr("x", 15)
		.attr("y", h/2)
		.html("&larr;");
	//East
	var east = svg.append("g")
		.attr("class", "pan")
		.attr("id", "east");
	east.append("rect")
		.attr("x", w - 30)
		.attr("y", 30)
		.attr("width", 30)
		.attr("height", h - 60);
	east.append("text")
		.attr("x", w - 15)
		.attr("y", h/2)
		.html("&rarr;");
	//Panning interaction
	d3.selectAll(".pan")
		.on("click", function() {

			//Get current translation offset
			var offset = projection.translate();
			//Set how much to move on each click
			var moveAmount = 50;

			//Which way are we headed?
			var direction = d3.select(this).attr("id");
			//Modify the offset, depending on the direction
			switch (direction) {
				case "north":
					offset[1] += moveAmount;  //Increase y offset
					break;
				case "south":
					offset[1] -= moveAmount;  //Decrease y offset
					break;
				case "west":
					offset[0] += moveAmount;  //Increase x offset
					break;
				case "east":
					offset[0] -= moveAmount;  //Decrease x offset
					break;
				default:
					break;
			}
			//Update projection with new offset
			projection.translate(offset);
			//Update all paths and circles
			svg.selectAll("path")
                .transition()
				.attr("d", path);
			svg.selectAll("circle")
                .transition()
				.attr("cx", function(d) {
					return projection([d.lon, d.lat])[0];
				})
				.attr("cy", function(d) {
					return projection([d.lon, d.lat])[1];
				});
		});
};
