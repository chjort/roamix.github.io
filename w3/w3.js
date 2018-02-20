var dataset2d = [[  5, 20],
             [480, 90],
             [250, 50],
             [100, 33],
             [330, 95],
             [410, 12],
             [475, 44],
             [ 25, 67],
             [ 85, 21],
             [220, 88],
             [600, 150]];

w = 550;
h = 300;
padding = 30;

///////// SCALES /////////

var xscale = d3.scaleLinear()
                .domain([0, d3.max(dataset2d, function(d) {return d[0];})])
                .range([padding, w - padding * 2])
                .nice();

var yscale = d3.scaleLinear()
                .domain([0, d3.max(dataset2d, function(d) {return d[1];})])
                .range([h - padding, padding])
                .nice();

var ascale = d3.scaleSqrt()
    .domain([0, d3.max(dataset2d, function(d) {return d[1];})])
    .range([0, 10])
    .nice();

var parseTime = d3.timeParse("%d/%m/%y");

svg = d3.select("#svg1")
        .append("svg")
        .attr("width", w)
        .attr("height", h)

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
        return ascale(d[1]);
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

///////// TIME SCALES /////////
var timedata;
var txscale;
var tyscale;

var rowConverter = function(d) {
    return {
        Date: parseTime(d.Date),
        Amount: parseInt(d.Amount)
    };
}

var formatTime = d3.timeFormat("%b %e");

d3.csv("time_scale_data.csv", rowConverter, function(data) {
    timedata = data;

    txscale = d3.scaleTime()
                    .domain([
                        d3.min(timedata, function(d) {return d.Date;}),
                        d3.max(timedata, function(d) {return d.Date;})
                    ])
                    .range([padding, w - padding]);

    tyscale = d3.scaleLinear()
                    .domain([
                        d3.min(timedata, function(d) {return d.Amount;}),
                        d3.max(timedata, function(d) {return d.Amount;})
                    ])
                    .range([h - padding, padding]);

    svgt = d3.select("#svg2")
             .append("svg")
             .attr("width", w)
             .attr("height", h)

    svgt.selectAll("circle")
        .data(timedata)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return txscale(d.Date);
        })
        .attr("cy", function(d) {
            return tyscale(d.Amount);
        })
        .attr("r", 2);

    svgt.selectAll("text")
        .data(timedata)
        .enter()
        .append("text")
        .attr("x", function(d) {
            return txscale(d.Date) + 4;
        })
        .attr("y", function(d) {
            return tyscale(d.Amount) + 4;
        })
        .text(function(d) {
            return formatTime(d.Date);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "#bbb");
})

///////// AXES /////////
var xaxis = d3.axisBottom(xscale)
                .ticks(5);

var yaxis = d3.axisLeft(yscale)
                .ticks(5);

svga = d3.select("#svg3")
         .append("svg")
         .attr("width", w)
         .attr("height", h)

svga.selectAll("circle")
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
        return ascale(d[1]);
    });

svga.selectAll("text")
    .data(dataset2d)
    .enter()
    .append("text")
    .text(function(d) {
        return "(" + d[0] + "," + d[1] + ")";
    })
    .attr("x", function(d) {
        return xscale(d[0]) + 10;
    })
    .attr("y", function(d) {
        return yscale(d[1]) - 10;
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "teal");

svga.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xaxis);

svga.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yaxis);


///////// AXES RANDOM POINTS /////////
var xaxis = d3.axisBottom(xscale)
                .ticks(5);

var yaxis = d3.axisLeft(yscale)
                .ticks(5);

svga = d3.select("#svg3")
         .append("svg")
         .attr("width", w)
         .attr("height", h)

svga.selectAll("circle")
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
        return ascale(d[1]);
    });

svga.selectAll("text")
    .data(dataset2d)
    .enter()
    .append("text")
    .text(function(d) {
        return "(" + d[0] + "," + d[1] + ")";
    })
    .attr("x", function(d) {
        return xscale(d[0]) + 10;
    })
    .attr("y", function(d) {
        return yscale(d[1]) - 10;
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "teal");

svga.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xaxis);

svga.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yaxis);
