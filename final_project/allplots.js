// JavaScript source code

d3.csv("data/collisions_zip_all.csv", function make_map(error, input) {
    d3.json("data/nyc_zip.geojson", function (nycjson) {

    var data = input;

    // Date formater
    function parse_date(d) {
        return new Date("20"+d.substring(0,2),
            d.substring(2, 4) - 1,
            d.substring(4, 6),
            d.substring(6, 8),
            d.substring(8, 10));
    }

    data.forEach(function (d) {
        d.DATE = parse_date(d.DATE);
        d.ZIP_CODE = String(+d.ZIP_CODE)
    });

    // Crossfilter data
    var cross_data = crossfilter(data);

    // Data dimensions
    var date_dim = cross_data.dimension(function (fact) { return fact.DATE; });
    var borough_dim = cross_data.dimension(function (fact) { return fact.BOROUGH; });
    var geo_borough_dim = cross_data.dimension(function (fact) { return fact.BOROUGH; });
    var zipcode_dim = cross_data.dimension(function (fact) { return fact.ZIP_CODE; });
    var vehicle_factor1_dim = cross_data.dimension(function (fact) { return fact.CONTRIBUTING_FACTOR_VEHICLE_1; });

    // Data groups
    var num_data_dates = date_dim.group(d3.timeDay);
    var num_boroughs = borough_dim.group();
    var num_zipcode = zipcode_dim.group();
    var num_vehicle_factor1 = vehicle_factor1_dim.group();

    var all = cross_data.groupAll();

    // First and last date
    var minDate = date_dim.bottom(1)[0].DATE;
    var maxDate = date_dim.top(1)[0].DATE;

    // Chart definitions
    var borough_chart = dc.barChart("#borough-chart");
    var factor1_chart = dc.pieChart("#factor1-chart");
    var date_chart = dc.barChart("#date-chart");
    var geo_chart = dc.geoChoroplethChart("#geo-chart");


    // Count all the data
    dc.dataCount(".dc-data-count")
        .dimension(cross_data)
        .group(all);

    // Chart the borough
    borough_chart
        .width(370)
        .height(300)
        .margins({ top: 0, right: 50, bottom: 35, left: 50 })
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .brushOn(true)
        .xAxisLabel('Borough')
        .yAxisLabel('Number of collisions')
        .dimension(borough_dim)
        .group(num_boroughs)
        .elasticY(true)
        .colors(d3.scaleQuantize().range(['#9932CC']))
        .renderHorizontalGridLines(true)
        .barPadding(0.1)
        .outerPadding(0.05)
        .title(function(d) {
            return "Borough: " + d.key + "\nCollisions: " + d.value;
        });

    // Chart the factors 1
    factor1_chart
        .width(700)
        .height(300)
        .slicesCap(10)
        .innerRadius(75)
        .dimension(vehicle_factor1_dim)
        .group(num_vehicle_factor1)
        .legend(dc.legend())
        .on('pretransition', function (chart) {
            chart.selectAll('text.pie-slice').text(function (d) {
                return dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100) + '%';
            })
        })
        .title(function(d) {
            return "Main accident factor: " + d.key + "\nCollisions: " + d.value;
        });

    date_chart
        .width(1300)
        .height(120)
        .margins({ top: 0, right: 50, bottom: 20, left: 40 })
        .dimension(date_dim)
        .group(num_data_dates)
        .elasticY(true)
        .renderHorizontalGridLines(true)
        .yAxisLabel('Number of collisions')
        .centerBar(true)
        .colors(d3.scaleQuantize().range(['#9932CC']))
        .gap(1)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .round(d3.timeDay.round)
        .alwaysUseRounding(true)
        .xUnits(d3.timeDay);


    choro_width = 680;
    choro_height = 600;
    var nycprojection = d3.geoMercator()
  					.center([-73.94, 40.70])
  					.scale(60000)
  					.translate([(choro_width) / 2, (choro_height)/2]);

    geo_chart
        .width(choro_width)
        .height(choro_height)
        .dimension(zipcode_dim)
        .group(num_zipcode)
        .colors(d3.scaleQuantize().range(['#fff0f5','#fce2f2','#f8d6ef','#f4caec','#efbde9','#eab0e6','#e5a4e2','#df97df','#d88bdb','#d17fd7','#ca73d3','#c267cf','#ba5cca','#b150c3','#a944bc','#a138b4','#982caa','#90209f','#871291','#800080']))
        .colorDomain([0, num_zipcode.top(1)[0].value])
        .colorCalculator(function (d) { return d ? geo_chart.colors()(d) : '#ccc'; })
        .overlayGeoJson(nycjson.features, "zip", function(d) { return d.properties.postalCode;})
        .projection(nycprojection)
        .title(function(d) {
            return "Zip code: " + d.key + "\nCollisions: " + d.value;
        });

        dc.renderAll();
    });
});
