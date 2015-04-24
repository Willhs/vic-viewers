var Interface = function(){
    var arrowHeight = 50,
        okHeight = 80,
        width = 50,
        height = arrowHeight*2 + okHeight,
        x = pageWidth * 0.95,
        y = pageHeight * 0.5 - height/2;

    var interface = glasses.append("g")
        .attr("id", "interface");

    var arrows = ["up", "down"];
    var arrow = interface.append("g").selectAll(".arrow")
        .data(arrows)
        .enter()
        .append("g")
        .attr("id", function(d){
            return d + "-arrow";
        });

    var lineWidth = 4;
    arrow.append("rect")
        .attr("class", "arrow-rect")
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
        .attr("height", arrowHeight);
        //.style("opacity", 0.5);

    var ok = interface.append("g")
        .attr("id", "middle");

    middle.append("image")
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

    this.clickedArrow = function(arrow){

    }

    this.clickedMiddle = function(){
        expandSelected();
    }

    this.longPressedMiddle = function(){

    }
}
