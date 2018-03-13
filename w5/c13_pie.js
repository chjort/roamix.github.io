/////////// PIE CHART ////////////
var dataset = [5, 10, 20, 45, 6, 25 ];

var w = 300;
var h = 300;
var padding = 20;

var pie = d3.pie()

var outerRadius = w / 2;
var innerRadius = w / 4;
var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

var svg = d3.select("#pie")
            .append("svg")
            .attr('width', w)
            .attr('height', h);

var arcs = svg.selectAll("g.arc")
    .data(pie(dataset))
    .enter()
    .append('g')
    .attr('class', 'arc')
    .attr('transform', 'translate(' + outerRadius + ',' + outerRadius + ')');

arcs.append("path")
    .attr('fill', function(d, i) { return color(i);})
    .attr('d', arc);

arcs.append("text")
    .attr('transform', function(d) {
        return "translate(" + arc.centroid(d) + ")";
    })
    .attr('text-anchor', 'middle')
    .attr('font-family', 'sans-serif')
    .attr('font-size', '14px')
    .attr('fill', 'white')
    .text(function(d) { return d.value;})
