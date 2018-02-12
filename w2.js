
var dataset = [5, 10, 15, 20, 25]; // 25
var dataset1 = [25, 7, 5, 26, 11, 8, 25,
                14, 23, 19, 14, 11, 22,
                29, 11, 13, 12, 17, 18,
                10, 24, 18, 25, 9, 3];
var dataset2 = [];
for (var i=0; i < 25; i++) {
  var num = Math.floor(Math.random() * 30);
  dataset2.push(num);
}

var dataset4 = [5, 10, 13, 19, 21, 25, 22, 18,
                15, 13, 11, 12, 15, 20, 18, 17,
                16, 18, 23, 25];

var w = 500;
var h = 50;

d3.select("#bar2").selectAll("div")
  .data(dataset)
  .enter()
  .append("div")
  .attr("class", "bar")
  .style("height", function(d) {
    var barHeight = d * 5;
    return barHeight + "px";
});

d3.select("#bar3").selectAll("div")
  .data(dataset1)
  .enter()
  .append("div")
  .attr("class", "bar")
  .style("height", function(d) {
    var barHeight = d * 5;
    return barHeight + "px";
});

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
var h1 = 100;
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
    .attr("width", w / dataset4.length - barPadding)
    .attr("height", function(d) {
        return d*4;
    })
    .attr("fill", function(d) {
        return "rgb(0, 0, " + Math.round(d * 10) + ")";
    });
