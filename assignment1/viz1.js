var rowConverter2 = function(d) {
    return {
        Month: d.Month,
        Count: parseInt(d.Count)
    };
};

var w = 600;
var h = 375;
var padding = 35;
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

var xScale, yScale;
var xAxis, yAxis;

d3.csv('data\\fresh_fruit.csv', rowConverter2, function(ffruit) {
    d3.csv('data\\fresh_vegetable.csv', rowConverter2, function(fvege) {
        d3.csv('data\\storage_fruit.csv', rowConverter2, function(sfruit) {
            d3.csv('data\\storage_vegetable.csv', rowConverter2, function(svege) {

                d3.select("#ffruit_button")
                    .on("click", function() {
                        updateData(ffruit, "Fresh Fruit");
                    });

                d3.select("#sfruit_button")
                    .on("click", function() {
                        updateData(sfruit, "Storage Fruit");
                    });

                d3.select("#fvege_button")
                    .on("click", function() {
                        updateData(fvege, "Fresh Vegetables");
                    });

                d3.select("#svege_button")
                    .on("click", function() {
                        updateData(svege, "Storage Vegetables");
                    });


                var dataset = ffruit;
                var barcolor = "rgb(105, 0, 200)";

                xScale = d3.scaleBand()
                            .domain(d3.range(dataset.length))
                            .rangeRound([padding, w - padding])
                            .paddingInner(0.05);


                yScale = d3.scaleLinear()
                            .domain([0, d3.max(dataset, function(d) { return d.Count;})])
                            .range([h - padding, padding]);

                xAxis = d3.axisBottom(xScale)
                            .tickFormat(function(d, i) {
                                return months[i];
                            });

                yAxis = d3.axisLeft(yScale);

                //Create SVG element
                var svg = d3.select(".viz1")
                        .append("svg")
                        .attr("width", w)
                        .attr("height", h);
                //Create bars
                svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("x", function(d, i) {
                        return xScale(i);
                    })
                    .attr("y", function(d) {
                        return yScale(d.Count);
                    })
                    .attr("width", xScale.bandwidth())
                    .attr("height", function(d) {
                        return h - yScale(d.Count) - padding;
                    })
                    .attr('fill', barcolor)
                    .on("mouseover", function() {
                        d3.select(this)
                            .attr("fill", "orange");
                    })
                    .on("mouseout", function(d) {
                       d3.select(this)
                            .transition()
                            .duration(250)
                            .attr('fill', barcolor);
                    });

                //Create labels
                svg.selectAll("text")
                    .data(dataset)
                    .enter()
                    .append("text")
                    .text(function(d) {
                        return d.Count;
                    })
                    .attr("text-anchor", "middle")
                    .attr("x", function(d, i) {
                        return xScale(i) + xScale.bandwidth() / 2;
                    })
                    .attr("y", function(d) {
                        return yScale(d.Count) + 14;
                    })
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "11px")
                    .attr("fill", "white");

                //// ADD AXES ////
                svg.append("g")
                     .attr("class", "x axis")
                     .attr("transform", "translate(0," + (h - padding) + ")")
                     .call(xAxis);

                svg.append("g")
                     .attr("class", "y axis")
                     .attr("transform", "translate(" + padding + ",0)")
                     .call(yAxis);

                //// ADD AXIS LABELS ////
                svg.append("text")
                    .attr('class', 'title')
                    .attr("transform",
                    "translate(" + (w/2) + "," + (padding) + ")")
                    .style("text-anchor", "middle")
                    .text("Fresh Fruit")
                    .attr('font-size', '20px');

                svg.append("text")
                    .attr("transform",
                    "translate(" + (w/2) + "," + (h) + ")")
                    .style("text-anchor", "middle")
                    .text("Month")
                    .attr('font-size', '14px');

                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0)
                    .attr("x",0 - (h / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Produce")
                    .attr('font-size', '14px');

                ////////// UPDATE DATA //////////
                var updateData = function(dataset, title) {

                    yScale.domain([0, d3.max(dataset, function(d) { return d.Count;})])

                    svg.selectAll("rect")
                        .data(dataset)
                        .transition()
                        .duration(1000)
                        .attr("x", function(d, i) {
                            return xScale(i);
                        })
                        .attr("y", function(d) {
                            return yScale(d.Count);
                        })
                        .attr("width", xScale.bandwidth())
                        .attr("height", function(d) {
                            return h - yScale(d.Count) - padding;
                        });

                    svg.selectAll("text")
                        .data(dataset)
                        .transition()
                        .duration(1000)
                        .text(function(d) {
                            return d.Count;
                        })
                        .attr("text-anchor", "middle")
                        .attr("x", function(d, i) {
                            return xScale(i) + xScale.bandwidth() / 2;
                        })
                        .attr("y", function(d) {
                            return yScale(d.Count) + 14;
                        });

                    svg.select(".title")
                        .text(title);

                    svg.select(".x.axis")
                        .transition()
                        .duration(1000)
                        .call(xAxis);

                    svg.select(".y.axis")
                        .transition()
                        .duration(1000)
                        .call(yAxis);

                }

            });
        });
    });
});
