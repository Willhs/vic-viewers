var player = new Player("res/video/upper-cuba.mp4");
    player.mute();

var pageWidth = $(document).width(),
    pageHeight = $(document).height();

var glassesHeightRatio = 0.9,
    glassesHeight = pageHeight * glassesHeightRatio
    glassesWidth = pageWidth;

//console.log("page height", pageHeight)
//console.log("glasses height: ", glassesHeight);

var svg = d3.select("#glasses-svg")
    .attr("transform", "translate(" + 0 + ", " + (((1 - glassesHeightRatio) * pageHeight) / 2) + ")")
    .attr("width", glassesWidth)
    .attr("height", glassesHeight);

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

function readPlaces(jsonPath){
    // removes old places if there are any
    removeOldPlaces();
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
                })
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
    });
}

function removeOldPlaces(){
    places.selectAll(".place").remove();
}

function setupPlaceBoxes(width, height){

}

readPlaces("json/places.json");

// makes the place selected which means
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
    place.attr("class", place.attr("class") + " selected-place");

    var placeNode = places.select(placeSelector);
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

    selectGroup.transition()
        .duration(500)
        .style("opacity", 0)
        // remove the select graphics
        .each("end", function(){ selectGroup.remove(); });

    removeClass(selector, "selected-place");
}

function expandPlace(selector){
    var placeNode = places.select(selector),
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
        extraInfoFontSize = 12;
        console.log("hello\nyo");

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
    var extraInfo = placeNode.append("text")
        .text(function(d){
            var extraInfo = "";
            d.extraInfo.forEach(function(sentence, i){
                extraInfo += sentence + "\n";
            })
            return extraInfo;
        })
        .attr("x", paddingHor)
        .attr("y", titleBoxHeight + paddingVert + extraInfoFontSize)
        .style("opacity", 0);

    extraInfo.transition()
        .duration(dur)
        .style("opacity", 1);

    // add class "expanded" (addClass doesn't work)
    addClass(selector, "expanded-place");
}

function createInterface(){
    var arrowHeight = 50,
        okHeight = 80,
        width = 50,
        height = arrowHeight*2 + okHeight,
        x = pageWidth * 0.95,
        y = pageHeight * 0.5 - height/2;

    var interface = glasses.append("g")
        .attr("id", "interface");

    var arrows = ["up", "down"];
    var arrow = interface.selectAll(".arrow")
        .data(arrows)
        .enter()
        .append("g")
        .attr("id", function(d){
            return d + "-arrow";
        });

    var lineWidth = 4;
    arrow.append("rect")
        .attr("x", x)
        .attr("y", function(d, i){
            return y + i * (arrowHeight + okHeight);
        })
        .attr("width", width)
        .attr("height", arrowHeight);

    arrow.append("image")
        .attr("xlink:href", function(d){
            return "res/icon/arrow-" + d + ".png";
        })
        .attr("x", x)
        .attr("y", function(d, i){
            return y + i * (arrowHeight + okHeight);
        })
        .attr("width", width)
        .attr("height", arrowHeight)
        .style("opacity", 0.5);

    var ok = interface.append("g")
        .attr("id", "ok-button");

    ok.append("image")
        .attr("xlink:href", "res/icon/circle.png")
        .attr("x", x)
        .attr("y", y + arrowHeight)
        .attr("width", width)
        .attr("height", okHeight);

    $(".arrow").mousedown(function(event){
        var id = event.target.attr("id");

        var forward;
        if (id === "up-arrow")
            forward = true;
        else false;

        selectNextPlace(forward);
    })
}

// if forward is false, then go opposite direction?
function selectNextPlace(forward){
    // TODO: make array of all places in view, sort by height,
    // find index of currently selected place, go up or down from there
}

// checks if any places are in the center, if so, then select the place
function isPlaceInCenter(){
    var detectionRadius = 400;

    $(".place").each(function(i){
        var x = this.attr("x"),
            y = this.attr("y");

        var centerX = glassesWidth/2
            centerY = glassesHeight/2;

        if (Math.sqrt(Math.pow(x - centerX, 2), Math.pow(y - centerY, 2)) < detectionRadius){
            console.log("place in center!");
            return true;
        }
    })
    return false;
}

function addClass(selector, className){
    $(selector).attr("class", $(selector).attr("class") + " " + className);
}

function removeClass(selector, className){
    $(selector).attr("class", $(selector).attr("class").replace(className, ""));
}

createInterface();
setTimeout(function(){
    selectPlace("#place-0");
    setTimeout(function(){
        expandPlace("#place-0");
    }, 1000);
}, 500);
