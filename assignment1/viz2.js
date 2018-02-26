/////// MENS OPEN ////////
// Year,Athlete,Country/State,Time,Notes
// 1897,John J. McDermott,United States (NY),2:55:10,

var parseTime = d3.timeParse("%Y");
var rowConverter = function(d) {
    return {
        Year: parseTime(d.Year),
        Time: parseInt(d.Time.substring(0,1)) * 60
              + parseInt(d.Time.substring(2,4))
              + parseInt(d.Time.substring(5, 7)) / 60,
        Athlete: d.Athlete
    };
};

var w = 600;
var h = 375;
var padding = 45;
var legendOffset = 15;

var xscale, yscale;
var xaxis, yaxis;


d3.csv('data\\part4_mens_open.csv', rowConverter, function(data_men) {
    d3.csv('data\\part4_womens_open.csv', rowConverter, function(data_women) {
        var data_both = d3.merge([data_men, data_women]);

        var labels = ["Men", "Women", "Both"];
        var colors = {"Men":"navy", "Women":"rgb(105, 0, 200)"};
        var radius = 3;

        /// UPDATE TO MEN ONLY ///
        d3.select("#men_button")
            .on("click", function() {
                scatterPlot("Men");
            });

        /// UPDATE TO WOMEN ONLY ///
        d3.select("#women_button")
            .on("click", function() {
                scatterPlot("Women");
            });

        /// UPDATE TO BOTH ///
        d3.select("#both_button")
            .on("click", function() {
                scatterPlot("Both");
            });

        xscale = d3.scaleTime()
                        .domain([d3.timeDay.offset(
                                        d3.min(data_both, function(d) {return d.Year;}),
                                        -365*5),
                                 d3.timeDay.offset(
                                        d3.max(data_both, function(d) {return d.Year;}),
                                        365*5)])
                        .range([padding, w - padding]);

        yscale = d3.scaleLinear()
                        .domain([d3.min(data_both, function(d) {return d.Time;})-1,
                                 d3.max(data_both, function(d) {return d.Time;})+1])
                        .range([h - padding, padding])
                        .nice();

        xaxis = d3.axisBottom(xscale);
        yaxis = d3.axisLeft(yscale);

        var svg = d3.select(".viz2")
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)

        ////// SCATTER PLOT ///////
        var formatTime = d3.timeFormat("%Y");

        var scatterPlot = function (toPlot) {
            var data;
            if (toPlot == "Men") {
                data = data_men
            } else if (toPlot == "Women") {
                data = data_women
            } else {
                data = data_both
            }

            xscale.domain([d3.timeDay.offset(
                            d3.min(data, function(d) {return d.Year;}),
                            -365*5),
                     d3.timeDay.offset(
                            d3.max(data, function(d) {return d.Year;}),
                            365*5)])

            yscale.domain([d3.min(data, function(d) {return d.Time;})-1,
                           d3.max(data, function(d) {return d.Time;})+1]);

            svg.selectAll("circle")
                .remove();

            svg.selectAll(".legend_text")
                .remove();

            svg.selectAll(".trendline")
                .remove();

            if (toPlot == "Both") {
                /////////// MEN ///////////
                svg.append("g")
                    .attr('id', 'men')
                    .selectAll("circle")
                    .data(data_men)
                    .enter()
                    .append('circle')
                    .attr('opacity', 0)
                    .attr('cx', function(d) {
                        return xscale(d.Year);
                    })
                    .attr('cy', function(d) {
                        return yscale(d.Time);
                    })
                    .attr('r', radius)
                    .attr('fill', colors["Men"])
                    .on('mouseover', function(d) {
                       d3.select(this)
                            .attr('fill', 'orange')

                       d3.select('#tooltip')
                            .style("left", (d3.event.pageX + 12) + "px")
                            .style('top', (window.pageYOffset - d.Time + 80) + "px")
                            .style("opacity", 0.9)
                            .select('#time')
                            .text("Minutes: " + parseInt(d.Time))

                        d3.select('#tooltip')
                            .select("#year")
                            .text("Year: " + formatTime(d.Year));

                        d3.select('#tooltip')
                            .select("#title")
                            .text("Athlete: " + d.Athlete);

                        d3.select('#tooltip').classed("hidden", false);
                    })
                    .on('mouseout', function(d) {
                       d3.select(this)
                          .transition()
                          .duration(250)
                          .attr('fill', colors["Men"]);

                       d3.select('#tooltip').classed("hidden", true);
                   })
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                    // ///TRENDLINE///
                    // MEN
                    var mxLabels = data_men.map(function (d) { return d["Year"]; })
            		var mxSeries = d3.range(1, mxLabels.length + 1);
            		var mySeries = data_men.map(function(d) { return parseFloat(d['Time']); });
                    // WOMEN
                    var wxLabels = data_women.map(function (d) { return d["Year"]; })
            		var wxSeries = d3.range(1, wxLabels.length + 1);
            		var wySeries = data_women.map(function(d) { return parseFloat(d['Time']); });

            		var men_leastSquaresCoeff = leastSquares(mxSeries, mySeries);
                    var women_leastSquaresCoeff = leastSquares(wxSeries, wySeries);

            		// MEN
            		var mx1 = mxLabels[0];
            		var my1 = men_leastSquaresCoeff[0] + men_leastSquaresCoeff[1];
            		var mx2 = mxLabels[mxLabels.length - 1];
            		var my2 = men_leastSquaresCoeff[0] * mxSeries.length + men_leastSquaresCoeff[1];

                    // WOMEN
            		var wx1 = wxLabels[0];
            		var wy1 = women_leastSquaresCoeff[0] + women_leastSquaresCoeff[1];
            		var wx2 = wxLabels[wxLabels.length - 1];
            		var wy2 = women_leastSquaresCoeff[0] * wxSeries.length + women_leastSquaresCoeff[1];

                    var trendData = [[mx1,my1,mx2,my2],[wx1,wy1,wx2,wy2]];

            		var trendline = svg.selectAll(".trendline")
            			.data(trendData);

            		trendline.enter()
            			.append("line")
                        .attr('opacity', 0)
            			.attr("class", "trendline")
            			.attr("x1", function(d) { return xscale(d[0]); })
            			.attr("y1", function(d) { return yscale(d[1]); })
            			.attr("x2", function(d) { return xscale(d[2]); })
            			.attr("y2", function(d) { return yscale(d[3]); })
            			.attr("stroke", "black")
            			.attr("stroke-width", 1)
                        .transition()
                        .duration(1000)
                        .attr('opacity', 1);

                ////////// WOMEN //////////
                svg.append("g")
                    .attr('id', 'women')
                    .selectAll("circle")
                    .data(data_women)
                    .enter()
                    .append('circle')
                    .attr('opacity', 0)
                    .attr('cx', function(d) {
                        return xscale(d.Year);
                    })
                    .attr('cy', function(d) {
                        return yscale(d.Time);
                    })
                    .attr('r', radius)
                    .attr('fill', colors["Women"])
                    .on('mouseover', function(d) {
                       d3.select(this)
                            .attr('fill', 'orange')

                       d3.select('#tooltip')
                            .style("left", (d3.event.pageX + 12) + "px")
                            .style('top', (window.pageYOffset - d.Time + 80) + "px")
                            .style("opacity", 0.9)
                            .select('#time')
                            .text("Minutes: " + parseInt(d.Time))

                        d3.select('#tooltip')
                            .select("#year")
                            .text("Year: " + formatTime(d.Year));

                        d3.select('#tooltip')
                            .select("#title")
                            .text("Athlete: " + d.Athlete);

                        d3.select('#tooltip').classed("hidden", false);
                    })
                    .on('mouseout', function(d) {
                       d3.select(this)
                          .transition()
                          .duration(250)
                          .attr('fill', colors["Women"]);

                       d3.select('#tooltip').classed("hidden", true);
                   })
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                //// LEGEND /////
                svg.append("text")
                    .attr('opacity', 0)
                    .attr('class', 'legend_text')
                    .attr("transform",
                    "translate(" + (w - padding*2 - legendOffset) + "," + (h - 300) + ")")
                    .style("text-anchor", "left")
                    .text("Men")
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                svg.append("text")
                    .attr('opacity', 0)
                    .attr('class', 'legend_text')
                    .attr("transform",
                    "translate(" + (w - padding*2 - legendOffset) + "," + (h - 280) + ")")
                    .style("text-anchor", "left")
                    .text("Women")
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                svg.append("circle")
                    .attr('opacity', 0)
                    .attr('class', 'legend_circle')
                    .attr('cx', w - padding*2 - legendOffset - 5)
                    .attr('cy', h - 305)
                    .attr("r", 3)
                    .attr('fill', colors["Men"])
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                svg.append("circle")
                    .attr('opacity', 0)
                    .attr('class', 'legend_circle')
                    .attr('cx', w - padding*2 - legendOffset - 5)
                    .attr('cy', h - 285)
                    .attr("r", 3)
                    .attr('fill', colors["Women"])
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

            } else {


                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('opacity', 0)
                    .attr('class', 'circle')
                    .attr('cx', function(d) {
                        return xscale(d.Year);
                    })
                    .attr('cy', function(d) {
                        return yscale(d.Time);
                    })
                    .attr('r', radius)
                    .attr('fill', colors[toPlot])
                    .on('mouseover', function(d) {
                       d3.select(this)
                            .attr('fill', 'orange')

                       d3.select('#tooltip')
                            .style("left", (d3.event.pageX + 12) + "px")
                            .style('top', (window.pageYOffset - d.Time + 80) + "px")
                            .style("opacity", 0.9)
                            .select('#time')
                            .text("Minutes: " + parseInt(d.Time))

                        d3.select('#tooltip')
                            .select("#year")
                            .text("Year: " + formatTime(d.Year));

                        d3.select('#tooltip')
                            .select("#title")
                            .text("Athlete: " + d.Athlete);

                        d3.select('#tooltip').classed("hidden", false);
                    })
                    .on('mouseout', function(d) {
                       d3.select(this)
                          .transition()
                          .duration(250)
                          .attr('fill', colors[toPlot]);

                       d3.select('#tooltip').classed("hidden", true);
                   })
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                //// LEGEND ////
                svg.append("text")
                    .attr('opacity', 0)
                    .attr('class', 'legend_text')
                    .attr("transform",
                    "translate(" + (w - padding*2 - legendOffset) + "," + (h - 300) + ")")
                    .style("text-anchor", "left")
                    .text(toPlot)
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                svg.append("circle")
                    .attr('opacity', 0)
                    .attr('class', 'legend_circle')
                    .attr('cx', w - padding*2 - legendOffset - 5)
                    .attr('cy', h - 305)
                    .attr("r", 3)
                    .attr('fill', colors[toPlot])
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);

                // ///TRENDLINE///
                var xLabels = data.map(function (d) { return d["Year"]; })
        		var xSeries = d3.range(1, xLabels.length + 1);
        		var ySeries = data.map(function(d) { return parseFloat(d['Time']); });

        		var leastSquaresCoeff = leastSquares(xSeries, ySeries);

        		// apply the reults of the least squares regression
        		var x1 = xLabels[0];
        		var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
        		var x2 = xLabels[xLabels.length - 1];
        		var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
        		var trendData = [[x1,y1,x2,y2]];

        		var trendline = svg.selectAll(".trendline")
        			.data(trendData);

        		trendline.enter()
        			.append("line")
                    .attr('opacity', 0)
        			.attr("class", "trendline")
        			.attr("x1", function(d) { return xscale(d[0]); })
        			.attr("y1", function(d) { return yscale(d[1]); })
        			.attr("x2", function(d) { return xscale(d[2]); })
        			.attr("y2", function(d) { return yscale(d[3]); })
        			.attr("stroke", "black")
        			.attr("stroke-width", 1)
                    .transition()
                    .duration(1000)
                    .attr('opacity', 1);
            };

            svg.select(".x.axis")
                .transition()
                .duration(1000)
                .call(xaxis);

            svg.select(".y.axis")
                .transition()
                .duration(1000)
                .call(yaxis);
        };

        scatterPlot("Both");

        //// ADD AXES ////
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (h - padding + 10) + ")")
            .call(xaxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + padding + ",0)")
            .call(yaxis);

        //// ADD AXIS LABELS ////
        svg.append("text")
            .attr("transform",
            "translate(" + (w/2) + "," + (h) + ")")
            .style("text-anchor", "middle")
            .text("Year")
            .attr('font-size', '14px');

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x",0 - (h / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Time")
            .attr('font-size', '14px');


    });
});

function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function(prev, cur) { return prev + cur; };

    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
        .reduce(reduceSumFunc);

    var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
        .reduce(reduceSumFunc);

    var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
        .reduce(reduceSumFunc);

    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);

    return [slope, intercept, rSquare];
}
