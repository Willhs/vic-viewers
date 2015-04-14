var screenWidth = $(window).width() * 0.8,
    screenHeight = $(window).height();

var svg = d3.select("body")
            .append("svg")
            .attr("width", screenWidth)
            .attr("height", screenHeight);

var audioViz;

$(document).ready(function (){
    audioViz = new AudioViz();
    audioViz.play();
    audioViz.draw();
});
