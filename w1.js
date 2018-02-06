var body = d3.select("body");

var dataset = [5, 10, 15, 20, 25];
var datacsv;

var rowConverter = function(d) {
  return {
    Food: d.Food,
    Deliciousness: parseFloat(d.Deliciousness)
  };
}
d3.csv("food.csv", rowConverter, function(data) {
  datacsv = data
  console.log(datacsv)
});

body.selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    .text(function(d) {return "Element " + d;})
    .style("color", "red");
