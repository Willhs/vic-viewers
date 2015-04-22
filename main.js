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

    var width = 200,
        height = 200;

    var paddingHor = 6,
        paddingVert = 6,
        innerLeft = paddingHor,
        innerTop = paddingLeft,
        innerWidth = width - (paddingHor*2),
        innerHeight = height - (paddingVert*2);

    var titleFontSize = 20,
        descrFontSize = 14,
        titleBaseLine = innerTop + titleFontSize,
        descrBaseLine = titleBaseLine + titleFontSize,
        openingHoursBaseLine = descrBaseLine + (3 * descrFontSize);

    var place = places.selectAll(".place")
        .data(data)
        .enter()
            .append("g")
            .attr("class", "place")
            .attr("transform", function(d){
                return "translate(" + (d.location.x - (width/2)) + ", " + (d.location.y - (height/2)) + ")";
            });

    place.append("rect")
        .attr("id", "place-box")
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

    // title of the place
    place.append("text")
        .attr("id", "title")
        .attr("class", "box-text")
        .text(function(d){ return d.title; })
        .attr("x", innerLeft)
        .attr("y", titleBaseLine)
        .style("font-size", titleFontSize + "px")
        .each(function(){
            var bbox = this.getBBox();
            bbox.width = innerWidth;
            bbox.height = innerHeight;
        });

    // small description
    place.append("text")
        .attr("id", "small-descr")
        .attr("class", "box-text")
        .text(function (d){
            return d.smallDescr;
        })
        .attr("x", innerLeft)
        .attr("y", descrBaseLine)
        .attr("font-size", descrFontSize)
        .each(function(){
            var bbox = this.getBBox();
            bbox.width = innerWidth;
            bbox.height = innerHeight / 3; // can take up 1/3 of the space
        });

    // open hours text
    place.append("text")
        .attr("id", "open-until")
        .attr("class", "box-text")
        .attr("x", innerLeft)
        .attr("y", openingHoursBaseLine)
        .text(function(d){
            return "Open until: " + d.openingHours;
        })
        .each(function(){
            var bbox = this.getBBox();
            bbox.width = innerWidth;
            bbox.height = innerHeight;
        });

});

