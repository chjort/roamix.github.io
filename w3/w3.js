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
var txaxis;
var tyaxis;

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

    txaxis = d3.axisBottom(txscale);
    tyaxis = d3.axisLeft(tyscale);

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

    svgt.selectAll("line")
        .data(timedata)
        .enter().append('line')
            .attr('x1', function(d) { return txscale(d.Date);})
            .attr('y1', function(d) { return tyscale(d.Amount);})
            .attr('x2', function(d) { return txscale(d.Date);})
            .attr('y2', h - padding)
            .style('stroke', '#bbb');

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

    svgt.append("g")
        .attr("class", "axis")
        .attr('transform', 'translate(0,' + (h - padding) + ')')
        .call(txaxis);

    svgt.append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(' + padding + ',' + 0 + ')')
        .call(tyaxis);
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

var datasetrandom = [];
var numDataPoints = 50;
var xRange = Math.random() * 1000;
var yRange = Math.random() * 1000;
for (var i = 0; i < numDataPoints; i++) {
    var newNumber1 = Math.floor(Math.random() * xRange);
    var newNumber2 = Math.floor(Math.random() * yRange);
    datasetrandom.push([newNumber1, newNumber2]);
}

var rxscale = d3.scaleLinear()
                .domain([0, d3.max(datasetrandom, function(d) {return d[0];})])
                .range([padding, w - padding * 2])
                .nice();

var ryscale = d3.scaleLinear()
                .domain([0, d3.max(datasetrandom, function(d) {return d[1];})])
                .range([h - padding, padding])
                .nice();

var rascale = d3.scaleSqrt()
    .domain([0, d3.max(datasetrandom, function(d) {return d[1];})])
    .range([0, 10])
    .nice();

var rxaxis = d3.axisBottom(rxscale).ticks(5);
var ryaxis = d3.axisLeft(ryscale).ticks(5);

svgr = d3.select("#svg4")
         .append("svg")
         .attr("width", w)
         .attr("height", h)

svgr.selectAll("circle")
    .data(datasetrandom)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return rxscale(d[0]);
    })
    .attr("cy", function(d) {
        return ryscale(d[1]);
    })
    .attr("r", function(d) {
        return rascale(d[1]);
    });

/*
svgr.selectAll("text")
    .data(datasetrandom)
    .enter()
    .append("text")
    .text(function(d) {
        return "(" + d[0] + "," + d[1] + ")";
    })
    .attr("x", function(d) {
        return rxscale(d[0]) + 10;
    })
    .attr("y", function(d) {
        return ryscale(d[1]) - 10;
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "red");
*/
svgr.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(rxaxis);

svgr.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(ryaxis);
