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

d3.json("json/places.json", function(error, data)){

}
