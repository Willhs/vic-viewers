var numPoints = 12;

var data = []

var width = 400;
var height = 500;

var svg = d3.select("svg");

(function(){
svg.attr("width", width)
   .attr("height", height);


svg.append("line")
.attr("x1", 0)
.attr("x2", width)
.attr("y1", height - 10)
.attr("y2", height - 10)
.attr("stroke","black");

svg.append("line")
.attr("y1", 0)
.attr("y2", height)
.attr("x1", 10)
.attr("x2", 10)
.attr("stroke","black");
})();

function click(){
    numPoints = +document.getElementById("num")
    .value;
    setup();
}

function setup(){
    data = [];
    for(var i = 0 ; i < numPoints; i++){
        data[i] = {
            x: Math.random() * 50000,
            y: Math.random() * 50000
        };
    }

    var xmax = d3.max(data.map(function(x){ return x.x; }));
    var ymax = d3.max(data.map(function(x){ return x.y; }));

    var x = d3.scale.linear()
       .domain([0,xmax])
       .range([10,width])

    var y = d3.scale.linear()
       .domain([0,ymax])
       .range([height-10,0])


    var line = svg.selectAll("line")
    .data(data)

    line.enter()
       .attr("x1", function(d) { return x(d.x);})
       .attr("y1", function(d) { return y(d.y);})
       .attr("x2", function(d,i) { return x(data[(i + 1) % numPoints].x); })
       .attr("y2", function(d,i) { return y(data[(i + 1) % numPoints].y); });


    var c = svg.selectAll("circle")
       .data(data)


    c.transition()
       .attr("cx",function(d) { return x(d.x);})
       .attr("cy",function(d) { return y(d.y);})
       .attr("r",function(d,i) {return i;} )
       .attr("class","points");

    c.enter()
       .append("circle")
       .attr("cx",function(d) { return x(d.x);})
       .attr("cy",function(d) { return y(d.y);})
       .attr("r",function(d,i) {return i;} )
       .attr("class","points");

    c.exit().remove();
}

setup();
