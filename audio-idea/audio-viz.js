function AudioViz() {

    $("body")
        .append($("<audio></audio>")
            .attr("src", "audio/Drake - furthest thing from perfect.mp3")
            .attr("id", "audio")
               );

    var audioElem = document.getElementById("audio");
        audioElem.loop = true;
    // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteFrequencyData
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;

    var bufferLength = analyser.frequencyBinCount;
    var freqData = new Uint8Array(bufferLength);

    var source = audioContext.createMediaElementSource(audioElem);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    var viz = this; // so it can be accessed inside other objects.

    // add bars to represent frequency
    var g = svg.append("g");
    var height = 800,
        width = 800,
        x = 10,
        y = 10,
        heightScalar = 3,
        barCount = bufferLength,
        barWidth = width / barCount;

    var zeroes = [];
    for (var i=0; i < barCount; i++){ zeroes[i] = 0; }


    var bars = g.selectAll("rect")
                .data(zeroes)
                .enter()
                .append("rect");

    var colorScale = d3.scale.linear()
        .domain([0, 255])
        .range(["BlueViolet", "lime"]);

    this.draw = function(){
        analyser.getByteFrequencyData(freqData);

        bars.data(freqData)
            .attr({
                x: function (d,i){ return x + barWidth * i; },
                y: function (d,i){ return y + height - (d * heightScalar); },
                width: barWidth,
                height: function (d){ return d * heightScalar; },
                fill: function (d){ return colorScale(d);}
            });

        requestAnimationFrame(viz.draw);
    }

    this.play = function(){
        console.log("audioElem", audioElem);
        audioElem.play();
    }
}
