var dataset = [5, 10, 15, 20, 25]; // 25

d3.select("#bar2").selectAll("div")
  .data(dataset)
  .enter()
  .append("div")
  .attr("class", "bar")
  .style("height", function(d) {
    var barHeight = d * 5;
    return barHeight + "px";
});

var dataset1 = [25, 7, 5, 26, 11, 8, 25,
                14, 23, 19, 14, 11, 22,
                29, 11, 13, 12, 17, 18,
                10, 24, 18, 25, 9, 3];

d3.select("#bar3").selectAll("div")
  .data(dataset1)
  .enter()
  .append("div")
  .attr("class", "bar")
  .style("height", function(d) {
    var barHeight = d * 5;
    return barHeight + "px";
});

var dataset2 = [];
for (var i=0; i < 25; i++) {
  var num = Math.floor(Math.random() * 30);
  dataset2.push(num);
}

d3.select("#bar4").selectAll("div")
  .data(dataset2)
  .enter()
  .append("div")
  .attr("class", "bar")
  .style("height", function(d) {
    var barHeight = d * 5;
    return barHeight + "px";
});

/////////////////////////////////
var dataset4 = [5, 10, 13, 19, 21, 25, 22, 18,
                15, 13, 11, 12, 15, 20, 18, 17,
                16, 18, 23, 25];

var w = 500;
var h = 50;

//Create SVG element
var svg = d3.select("#sv1")
            .append("svg")
            .attr("width", w)
            .attr("height", h);
var circles = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle");
circles.attr("cx", function(d, i) {
            return (i * 50) + 25;
        })
       .attr("cy", h/2)
       .attr("r", function(d) {
            return d;
       })
       .attr("fill", "yellow")
       .attr("stroke", "orange")
       .attr("stroke-width", function(d) {
           return d/2;
       });

///////////////////////////////////
// DIV BOXES
d3.select("#bar5").selectAll("div")
    .data(dataset4)
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d) {
        var barHeight = d * 5;
        return barHeight + "px";
    });
///////////////////////////////////
// SVG BOXES
var w1 = 500;
var h1 = 150;
var barPadding = 1;

var svg1 = d3.select("#sv2")
             .append("svg")
             .attr("width", w1)
             .attr("height", h1);

svg1.selectAll("rect")
    .data(dataset4)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return i * (w1 / dataset4.length);
    })
    .attr("y", function(d) {
        return h1 - (d * 4);
    })
    .attr("width", w1 / dataset4.length - barPadding)
    .attr("height", function(d) {
        return d*4;
    })
    .attr("fill", function(d) {
        return "rgb(250, 0, " + Math.round(d * 10) + ")";
    });

svg1.selectAll("text")
    .data(dataset4)
    .enter()
    .append("text")
    .text(function(d) {
        return d;
    })
    .attr("x", function(d, i) {
        return i * (w1 / dataset4.length)
                + (w1 / dataset4.length - barPadding) / 2;
    })
    .attr("y", function(d) {
        return h1 - (d * 4) + 14;
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white");

///////////////////////////////////
dataset2d = [[  5, 20],
             [480, 90],
             [250, 50],
             [100, 33],
             [330, 95],
             [410, 12],
             [475, 44],
             [ 25, 67],
             [ 85, 21],
             [220, 88]];

var w2 = 500;
var h2 = 200;

var svg2 = d3.select("#scatter")
                .append("svg")
                .attr("width", w2)
                .attr("height", h2);

svg2.selectAll("circle")
    .data(dataset2d)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
        return d[0];
    })
    .attr("cy", function(d) {
        return d[1] + 35;
    })
    .attr("r", function(d) {
        return Math.sqrt(h1 - d[1]);
    });

svg2.selectAll("text")
    .data(dataset2d)
    .enter()
    .append("text")
    .attr("x", function(d) {
        return d[0] + 5;
    })
    .attr("y", function(d) {
        return d[1] + 25;
    })
    .text(function(d) {
        return "(" + d[0] + "," + d[1] + ")";
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "red");
