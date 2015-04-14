var LyricsView = function(){
    this.lyrics; // array of lines with timings

    var left = 500, top = 20, width = 500, height = 500;
    var vertPadding = 15, horizPadding = 15;
    var maxOnScreen = 5;
    var currentLine = 0;
    var g = svg.append("g");
    var text = g.selectAll("text");

    var opacityScale = d3.scale.linear()
        .domain([0, maxOnScreen])
        .range([0, 1]);

    this.loadLyrics = function(lyrics){
        text.data(lyrics)
            .enter()
                .append("text")
                .attr({
                    text: function (d){ return d.text;},
                    x: left,
                    y: function(d, i){
                        if (i > maxOnScreen){
                            return top + height;
                        }
                    }
                })

    }

    this.reset = function(){
        g.selectAll("*").remove();
        timeoutId = -1;

        this.loadLyrics(lyrics);
    }

    this.playFrom = function(position){

    }

    this.showNextLine = function(line){
        var lineIndex = line.index;
        text.transition()
            .duration(500)
            .ease("cubic-in-out")
            .attr("y", function (d, i){
                    var position = i - lineIndex;
                    if (position < maxOnScreen){
                        return top + topPadding + position * (height/maxOnScreen);
                    }
                    if (position === -1){
                        return top; // if line over, go up to top of screen
                    }
                })
            .attr("fill", function(d, i){
                if (i === lineIndex){
                    return "steelblue";
                } else {
                    return "grey";
                }
            })
            .attr("opacity", function(d, i){
                var position = i - lineIndex;
                if (position < maxOnScreen){
                    return opacityScale(position);
                }
                else {
                    return 0;
                }
            });

        var nextLine = lyrics[lineIndex+1];

        var timeBetween = nextLine.time - line.time;

        timeoutId = setTimeout(function(){
            showNextLine(line+1);
        }, timeBetween);
    }
}

function recordPresses(){
    var div = document.createElement("div");
    document.getElementsByTagName("body")[0].appendChild(div);
    document.getElementsByTagName("body")[0].onkeypress = function(e){
        div.innerHTML = div.innerHTML + "\n" + audio.currentTime;
    }
};

recordPresses();
