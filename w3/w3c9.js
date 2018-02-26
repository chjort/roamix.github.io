var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13,
				11, 12, 15, 20, 18, 17, 16, 18, 23, 25,
				25, 16, 10, 18, 19, 14, 11, 15, 18, 19 ];

var w = 600;
var h = 250;
var barPadding = 2;

var xscale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .rangeRound([0, w])
    .paddingInner(0.05);

var yscale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([0, h]);

var svgbar = d3.select("#svg5")
                .append("svg")
                .attr("height", h)
                .attr('width', w)


svgbar.selectAll("rect")
    .data(dataset)
	.enter()
    .append('rect')
    .attr('x', function(d, i) {
        return xscale(i);
    })
    .attr('y', function(d) {
        return h - yscale(d);
    })
    .attr('width', xscale.bandwidth())
    .attr('height', function(d) {
        return yscale(d);
    })
    .attr('fill', function(d) {
        return "rgb(0, 250, " + Math.round(d * 10) + ")";
    });

svgbar.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("x", function(d, i) {
        return xscale(i) + xscale.bandwidth() / 2;
    })
    .attr("y", function(d) {
        return h - yscale(d) + 14;
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");


d3.select("#button1")
	.on("click", function() {

	var maxValue = 25;
	var newNumber = Math.floor(Math.random() * maxValue);
	dataset.push(newNumber);


	xscale.domain(d3.range(dataset.length));
	yscale.domain([0, d3.max(dataset)]);

	var bars = svgbar.selectAll("rect")
				.data(dataset);

	bars.enter()
		.append("rect")
		.attr("x", w)
		.attr("y", function(d) {
		return h - yscale(d);
		})
		.attr("width", xscale.bandwidth())
		.attr("height", function(d) {
			return yscale(d);
		})
		.attr("fill", function(d) {
			return "rgb(0, 250, " + Math.round(d * 10) + ")";
		})
		.merge(bars)
		.transition()
		.duration(500)
		.attr("x", function(d, i) {
			return xscale(i);
		})
		.attr("y", function(d) {
			return h - yscale(d);
		})
		.attr("width", xscale.bandwidth())
		.attr("height", function(d) {
			return yscale(d);
		});

	var texts = svgbar.selectAll("text")
	   				.data(dataset)
	texts.enter()
		 .append("text")
		 .attr('x', w)
		 .attr('y', function(d) {
			 return h - yscale(d) + 14;
		 })
	   	 .text(function(d) {
			return d;
	   	 })
		 .merge(texts)
		 .transition()
		 .duration(500)
	   	 .attr("x", function(d, i) {
			return xscale(i) + xscale.bandwidth() / 2;
	   	 })
	   	 .attr("y", function(d) {
			 if (d <= 1) {
             	return h - yscale(d) - 2;
            } else {
            	return h - yscale(d) + 14;
            }
	   	 })
		 .attr("text-anchor", "middle")
		 .attr("font-family", "sans-serif")
		 .attr("font-size", "11px")
		 .attr('fill', function(d) {
         	if (d <= 1) {
        		return "black";
            } else {
             	return "white";
         	}
		});
});

d3.select("#button2")
	.on("click", function() {

	dataset.pop();
	xscale.domain(d3.range(dataset.length));
	yscale.domain([0, d3.max(dataset)]);

	var bars = svgbar.selectAll("rect")
				.data(dataset);


	bars.enter()
		.append("rect")
		.attr("x", w)
		.attr("y", function(d) {
		return h - yscale(d);
		})
		.attr("width", xscale.bandwidth())
		.attr("height", function(d) {
			return yscale(d);
		})
		.attr("fill", function(d) {
			return "rgb(0, 250, " + Math.round(d * 10) + ")";
		})
		.merge(bars)
		.transition()
		.duration(500)
		.attr("x", function(d, i) {
			return xscale(i);
		})
		.attr("y", function(d) {
			return h - yscale(d);
		})
		.attr("width", xscale.bandwidth())
		.attr("height", function(d) {
			return yscale(d);
		});

	bars.exit()
		.transition()
		.duration(500)
		.attr('x', w)
		.remove();

	texts.enter()
		 .append("text")
		 .attr('x', w)
		 .attr('y', function(d) {
			 return h - yscale(d) + 14;
		 })
	   	 .text(function(d) {
			return d;
	   	 })
		 .merge(texts)
		 .transition()
		 .duration(500)
	   	 .attr("x", function(d, i) {
			return xscale(i) + xscale.bandwidth() / 2;
	   	 })
	   	 .attr("y", function(d) {
			 if (d <= 1) {
             	return h - yscale(d) - 2;
            } else {
            	return h - yscale(d) + 14;
            }
	   	 })
		 .attr("text-anchor", "middle")
		 .attr("font-family", "sans-serif")
		 .attr("font-size", "11px")
		 .attr('fill', function(d) {
         	if (d <= 1) {
        		return "black";
            } else {
             	return "white";
         	}
		});

	texts.exit()
		.transition()
		.duration(500)
		.attr('x', w)
		.remove();
});

//////////// SCATTER /////////////
var datasetrandom = [];
var numDataPoints = 50;
var xRange = Math.random() * 1000;
var yRange = Math.random() * 1000;
for (var i = 0; i < numDataPoints; i++) {
    var newNumber1 = Math.floor(Math.random() * xRange);
    var newNumber2 = Math.floor(Math.random() * yRange);
    datasetrandom.push([newNumber1, newNumber2]);
}
padding = 30;

var rxscale = d3.scaleLinear()
                .domain([0, d3.max(datasetrandom, function(d) {return d[0];})])
                .range([padding, w - padding * 2])
                .nice();

var ryscale = d3.scaleLinear()
                .domain([0, d3.max(datasetrandom, function(d) {return d[1];})])
                .range([h - padding, padding])
                .nice();

var rxaxis = d3.axisBottom(rxscale).ticks(5);
var ryaxis = d3.axisLeft(ryscale).ticks(5);

svgr2 = d3.select("#svg6")
         .append("svg")
         .attr("width", w)
         .attr("height", h)

svgr2.append('clipPath')
	 .attr('id', 'chart-area')
	 .append('rect')
	 .attr('x', padding)
	 .attr('y', padding)
	 .attr('width', w - padding * 3)
	 .attr('height', h - padding * 2);

svgr2.append('g')
	.attr('id', 'circles')
	.attr('clip-path', 'url(#chart-area)')
	.selectAll("circle")
    .data(datasetrandom)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return rxscale(d[0]);
    })
    .attr("cy", function(d) {
        return ryscale(d[1]);
    })
    .attr("r", 2);

svgr2.append("g")
    .attr("class", "rx axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(rxaxis);

svgr2.append("g")
    .attr("class", "ry axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(ryaxis);

/// UPDATE ///
d3.select("#button3")
    .on("click", function() {
        var datasetrandom = [];
        var numDataPoints = 50;
        var maxvalue2 = 1000;
        var xRange = Math.random() * maxvalue2;
        var yRange = Math.random() * maxvalue2;
        for (var i = 0; i < numDataPoints; i++) {
            var newNumber1 = Math.floor(Math.random() * xRange);
            var newNumber2 = Math.floor(Math.random() * yRange);
            datasetrandom.push([newNumber1, newNumber2]);
        }

        rxscale.domain([0, d3.max(datasetrandom, function(d) {return d[0];})]);

        ryscale.domain([0, d3.max(datasetrandom, function(d) {return d[1];})]);

        rxaxis = d3.axisBottom(rxscale).ticks(5);
        ryaxis = d3.axisLeft(ryscale).ticks(5);

        svgr2.selectAll("circle")
            .data(datasetrandom)
            .transition()
            .duration(1000)
            .on('start', function() {
                d3.select(this)
                    .attr('fill', 'teal')
                    .attr('r', 5);
            })
            .attr("cx", function(d) {
                return rxscale(d[0]);
            })
            .attr("cy", function(d) {
                return ryscale(d[1]);
            })
            .transition()
            .duration(1000)
            .attr('fill', 'black')
            .attr('r', 2);
//            .on('end', function() {
//                d3.select(this)
//                .transition()
//                .duration(1000)
//                .attr('fill', 'black')
//                .attr('r', 2);
//            })

        svgr2.select(".rx.axis")
            .transition()
            .duration(1000)
            .call(rxaxis);

        svgr2.select(".ry.axis")
            .transition()
            .duration(1000)
            .call(ryaxis);
    });
