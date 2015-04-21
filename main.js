var player = new Player("video/adventure-time-evicted.mp4");
player.mute();

var pageWidth = 1900,
    pageHeight = 600;

var glasses = d3.select("body").append("svg")
    .attr("id", "glasses")
    .attr("x", 0)
    .attr("y", 300)
    .attr("width", pageWidth)
    .attr("height", pageHeight);

// a rectangle to enclose the whole svg
glasses.append("rect")
    .attr("id", "glasses-rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", pageWidth)
    .attr("height", pageHeight);

// vic viewer logo
glasses.append("text")
    .attr("id", "logo")
    .text("victoria viewers")
    .attr("x", 300)
    .attr("y", 20);

var places = glasses.append("g")
    .attr("id", "places");

// Reads in all places
d3.json("json/places.json", function(error, data){

    var width = 100,
        height = 100,
        titleFontSize = 20,
        descrFontSize =  14;

    var place = places.selectAll(".place")
        .data(data)
        .enter()
            .append("g")
            .attr("class", "place");

    place.append("rect")
        .attr("id", "place-box")
        .attr("width", width)
        .attr("height", height)
        .attr("x", function(d){
            return d.location.x - (width/2);
        })
        .attr("y", function(d){
            return d.location.y - (height/2);
        });
    // title of the place
    place.append("text")
        .attr("id", "title")
        .text(function(d){ return d.title; })
        .attr("x", function(d){
            return d.location.x;
        })
        .attr("y", function(d){
            return d.location.y - (height/2) + titleFontSize;
        })
        .style("font-size", titleFontSize + "px")
        .style("text-anchor", "middle");

    //place.append()

});

