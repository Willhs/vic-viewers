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

function readPlaces(jsonPath){
    // Reads in all places
    d3.json(jsonPath, function(error, data){

        var width = 200,
            height = 80;

        var paddingHor = 6,
            paddingVert = 6,
            innerLeft = paddingHor,
            innerTop = paddingVert,
            innerWidth = width - (paddingHor*2),
            innerHeight = height - (paddingVert*2);

        var titleRatio = 0.7;
            openHoursRatio = 0.3;
            titleBoxHeight = height * titleRatio,
            openHoursBoxHeight = height * openHoursRatio;

        var place = places.selectAll(".place")
            .data(data)
            .enter()
                .append("g")
                .attr("class", "place")
                .attr("id", function(d, i){ return "place-" + i;})
                .attr("transform", function(d){
                    return "translate(" + (d.location.x - (width/2)) + ", " + (d.location.y - (height/2)) + ")";
                });

        // box around all place info
        place.append("rect")
            .attr("id", "place-box")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0)
            // rounded corners
            .attr("rx", 15)
            .attr("ry", 15)
            .attr("stroke-width", 10);

        place.append("rect")
            .attr("id", "title-box")
            .attr("width", width)
            .attr("height", titleBoxHeight)
            .attr("x", 0)
            .attr("y", 0)
            .attr("rx", 15)
            .attr("ry", 15);

        // place icon
        var placeIconSize = titleBoxHeight - (paddingVert*2);
        place.append("image")
            .attr("xlink:href", function(d){
                // type of place (restaurant, shop ...)
                var type = d.type;
                return "res/icon/" + type + ".png";
            })
            .attr("x", innerLeft)
            .attr("y", innerTop)
            .attr("width", placeIconSize)
            .attr("height", placeIconSize)

        // title of the place
        place.append("text")
            .attr("id", "title")
            .attr("class", "box-text")
            .text(function(d){ return d.title; })
            .attr("x", (paddingHor*2) + placeIconSize)
            .attr("y", titleBoxHeight - (titleBoxHeight/2) + paddingVert);

        // open hours text
        place.append("text")
            .attr("id", "open-until")
            .attr("class", "box-text")
            .attr("x", innerLeft)
            .attr("y", titleBoxHeight + openHoursBoxHeight - paddingVert)
            .text(function(d){
                return "Open until: " + d.openingHours;
            })
            // keep text within box
            .each(function(){
                var bbox = this.getBBox();
                bbox.width = innerWidth;
                bbox.height = innerHeight;
            });
    });
}

readPlaces("json/places.json");

// makes the place selected which means
// place is a d3 selection of a node
function selectPlace(place){
    var boxIncrease = 20;
    var placeBoxWidth = place.width + boxIncrease,
        placeBoxHeight = place.height + boxIncrease;

    //$(".selected-place").removeClass(".selected-place");
    place.removeClass(".selected-place");

    places.select(place)
        .attr(".selected-place")
            .append("rect")
        .attr("id", "select-outline")
        .attr("x", -(boxIncrease/2))
        .attr("y", -(boxIncrease/2))
        .attr("width", placeBoxWidth + boxIncrease)
        .attr("height", placeBoxHeight + boxIncrease)
        .attr("rx", 15)
        .attr("ry", 15);

    placeBox.transition()
        .duration(500)
        .style("opacity", 0.9);
}

setTimeout(function(){
    var p0 = $("#place-0");
    console.log(p0);
    selectPlace(p0);
}, 1000);
