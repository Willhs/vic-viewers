var pageWidth = $(document).width(),
    pageHeight = $(document).height();

var glassesHeightRatio = 0.9,
    glassesHeight = pageHeight * glassesHeightRatio,
    glassesWidth = pageWidth;

var placeBoxWidth = 200,
    placeBoxHeight = 80;

var svg = d3.select("#glasses-svg")
    .attr("transform", "translate(" + 0 + ", " + 0 + ")" )
    .attr("width", pageWidth)
    .attr("height", pageHeight);

svg.select("#glasses-clip").append("ellipse")
    .attr("cx", glassesWidth / 2)
    .attr("cy", glassesHeight/2)
    .attr("rx", glassesWidth*1)
    .attr("ry", glassesHeight/2);

var glasses = svg.select("#glasses-group")
    .attr("clip-path", "url(#glasses-clip)");

// a rectangle to enclose the whole svg
glasses.select("#glasses-box")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", pageWidth)
    .attr("height", glassesHeight);

// vic viewer logo
glasses.append("text")
    .attr("id", "logo")
    .text("victoria viewers")
    .attr("x", 750)
    .attr("y", 20);

var places = glasses.append("g")
    .attr("id", "places");

var DEFAULT_PLACE_OPACITY = 0.4;
// if an autoselect can happen (hasn't happened recently)
var selectCoolDown = true;
function loadEnvironment(jsonPath, videoPath){
    readPlaces(jsonPath, function(){
        startVideo(videoPath);
        startMovingPlaces();
    });
}

loadEnvironment("json/cuba-places.json", "res/video/lq_cuba_3.ogg");
/*startVideo("res/video/lq_cuba_3.ogg");*/

function readPlaces(jsonPath, cb){
    // removes old places if there are any
    removeOldPlaces();
    // Reads in all places
    d3.json(jsonPath, function(error, data){

        var width = placeBoxWidth,
            height = placeBoxHeight;

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
                .style("opacity", DEFAULT_PLACE_OPACITY);

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
                return "Opening hours: " + d.openingHours;
            })
            // keep text within box
            .each(function(){
                var bbox = this.getBBox();
                bbox.width = innerWidth;
                bbox.height = innerHeight;
            });

        cb();
    });
}

function startVideo(videoPath){
    player = new Player(videoPath);
}

// start the place movements
function startMovingPlaces(){
    /*var position = */
   places.selectAll(".place")
        .each(function(d){
            var timeToNext = d.locations[0].time;
            var that = this;

            // move place to starting position first
            var place = d3.select(that);
            var x = d.locations[0].pos[0];
            var y = d.locations[0].pos[1];
            place.attr("transform", "translate(" + x + ", " + y + ")" )
                .style("opacity", 0);

            // fade in just before it's first appearance
            var fadeInTime = 500;
            setTimeout(function(){
                place.transition()
                    .duration(fadeInTime)
                    .style("opacity", 1);
            }, timeToNext-fadeInTime);

            // begin the first action at the appropriate time
            setTimeout(function(){ movePlace(place, 0); }, timeToNext);
        });
}

function movePlace(elem, locationIndex){

    if (!elem.hasClass("move-lock")){
        elem.transition()
            .duration(function(d){
                if (locationIndex+1 < d.locations.length){
                    var timeToNext = d.locations[locationIndex+1].time - d.locations[locationIndex].time;
                    return timeToNext;
                } else return 0;
            })
            .ease("linear")
            .attr("transform", function(d){
                if (locationIndex+1 < d.locations.length){
                    var x = d.locations[locationIndex].pos[0] - placeBoxWidth/2;
                    var y = d.locations[locationIndex].pos[1] - placeBoxHeight/2;
                    return "translate(" + x + ", " + y + ")";
                } else return elem.attr("transform");
            });
    }

    elem.each(function(d){
        // if not at the end, play the next movement command
        if (locationIndex+1 < d.locations.length){
            var timeToNext = d.locations[locationIndex+1].time - d.locations[locationIndex].time;
            setTimeout(function(){ movePlace(elem, locationIndex+1); }, timeToNext);
        }
        else {
            setTimeout(function(){
                elem.transition()
                    .duration(300)
                    .ease("linear")
                    .attr("transform", function(d){
                        return "translate(" + -300 + ", " + d3.transform(elem.attr("transform")).translate[1] + ")";
                    });
                }, 50);
        }

        var x = d.locations[locationIndex].pos[0];
        var y = d.locations[locationIndex].pos[1];

        if (isPlaceInCenter(x, y) && selectCooledDown()){
            selectPlace("#" + elem.attr("id"));
            startSelectCoolDown();
        }
    });

}

function startSelectCoolDown(){
    selectCoolDown = false;
    setTimeout(function(){ selectCoolDown = true; }, 2000);
}

function selectCooledDown(){
    return selectCoolDown;
}

function removeOldPlaces(){
    places.selectAll(".place").remove();
}

// place is a selector string
function selectPlace(placeSelector){

    // deselect the currently selected place if there is one
    deselectPlace();

    var boxIncrease = 20,
        plusRegion = 20;// the extra region at the bottom to hold a plus sign

    var place = $(placeSelector),
        box = $(placeSelector + " > " + "#place-box");

    var boxHeight = +box.attr("height"),
        boxWidth = +box.attr("width");

    var selectBoxWidth = boxWidth + boxIncrease,
        selectBoxHeight = boxHeight + boxIncrease + plusRegion;

    // jquery addClass doesn't work ...
    addClass(placeSelector, "select-place")

    var placeNode = places.select(placeSelector);

    // move to centre
    placeNode.transition()
        .duration(1000)
        .ease("cubic")
        .attr("transform", "translate(" + (glassesWidth/2) + ", " + ( glassesHeight/2 ) + ")");

    var selectGroup = placeNode.insert("g", ":first-child")
        .attr("id", "select-group");

    // select outline
    selectGroup.append("rect")
        .attr("id", "select-box")
        .attr("x", - (boxIncrease/2))
        .attr("y", - (boxIncrease/2))
        .attr("width", selectBoxWidth)
        .attr("height", selectBoxHeight)
        .attr("rx", 15)
        .attr("ry", 15)

    // little plus sign
    var plusLineLength = 20,
        plusLineWidth = 5;

    var plus = selectGroup.append("g")
        .attr("id", "plus");

    plus.append("rect")
        .attr("x", boxWidth / 2 - (plusLineWidth/2) )
        .attr("y", boxHeight + 3)
        .attr("width", plusLineWidth)
        .attr("height", plusLineLength)
        .attr("fill", "white");

    plus.append("rect")
        .attr("x", (boxWidth / 2) - (plusLineLength/2))
        .attr("y", boxHeight + 3 + (plusLineLength/2) - (plusLineWidth/2))
        .attr("width", plusLineLength)
        .attr("height", plusLineWidth)
        .attr("fill", "white");

    selectGroup.style("opacity", 0);

    // increases opacity
    var dur = 500;
    placeNode.transition()
        .duration(dur)
        .style("opacity", 1);

    selectGroup.transition()
        .duration(dur)
        .style("opacity", 1);

    addClass("#" + placeNode.attr("id"), "move-lock")
}

function deselectPlace(){
    var jqueryNode = $(".selected-place")
    if (!jqueryNode.length) return;

    var d3Node = places.selectAll(".selected-place");
    var selectGroup = d3Node.select("#select-group");

    // fade out
    d3Node.transition()
        .duration(500)
        .style("opacity", DEFAULT_PLACE_OPACITY);
        .each("end", function(){
            removeClass("#" + jqueryNode.attr("id"), "move-lock")
        })

    selectGroup.transition()
        .duration(500)
        .style("opacity", 0)
        // remove the select graphics
        .each("end", function(){
            selectGroup.remove();
        });

    removeClass("#" + jqueryNode.attr("id"), "selected-place");
}

function expandSelected(){
    var placeNode = places.select(".selected-place"),
        titleBox = places.select("#title-box"),
        placeBox = placeNode.select("#place-box"),
        selectBox = placeNode.select("#select-box"),
        selectPlusSign = placeNode.select("#plus"),
        openingHours = placeNode.select("#open-until");

    var expandHeight = 150,
        paddingVert = 6,
        paddingHor = 6,
        selectBoxPadding = 20,
        titleBoxHeight = +titleBox.attr("height")
        extraInfoFontSize = 12
        linePadding = 4;

    // animations
    var dur = 800;

    selectBox.transition()
        .duration(dur)
        .attr("height", expandHeight + selectBoxPadding);

    selectPlusSign.transition()
        .duration(dur)
        .style("opacity", 0);

    placeBox.transition()
        .duration(dur)
        .attr("height", expandHeight);

    openingHours.transition()
        .duration(dur)
        .attr("y", expandHeight - paddingVert);

    // add extra info text
    var extraInfo = placeNode.append("g")
        .attr("id", "info-text")
        .style("opacity", 0);

    extraInfo.selectAll("text").data(function (d, i){
            return d.extraInfo;
        })
        .enter()
        .append("text")
        .text(function(d){
            return d;
        })
        .attr("x", paddingHor)
        .attr("y", function(d, i){
           return titleBoxHeight + paddingVert + extraInfoFontSize + (i * (extraInfoFontSize + linePadding));
        });

    extraInfo.transition()
        .duration(dur)
        .style("opacity", 1);

    // add class "expanded" (addClass doesn't work)
    addClass(selector, "expanded-place");
}

function reduceExpanded(){
    var place = places.select(".selectedPlace"),
        placeBox = place.select("#place-box"),
        selectBox = place.select("#select-box"),
        openingHours = place.select("#opening-hours");

}


// if forward is false, then go opposite direction?
function selectNextPlace(forward){
    // TODO: make array of all places in view, sort by height,
    // find index of currently selected place, go up or down from there
}

// checks if any places are in the center, if so, then select the place
function isPlaceInCenter(x, y){
    var detectionRadius = 600;

    var centerX = glassesWidth/2
        centerY = glassesHeight/2;

    if (Math.sqrt(Math.pow(x - centerX, 2), Math.pow(y - centerY, 2)) < detectionRadius){
        return true;
    }
    return false;
}

function addClass(selector, className){
    $(selector).attr("class", $(selector).attr("class") + " " + className);
}

function removeClass(selector, className){
    $(selector).attr("class", $(selector).attr("class").replace(className, ""));
}

function hasClass(selector, className){
    return $("." + className).length !== 0;
}
