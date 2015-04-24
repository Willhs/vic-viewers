var startTime;
//var mouseDown;
//$(document).mousedown(function(){
    //mouseDown = true;
//});
//$(document).mouseup(function(){
    //mouseDown = false;
//});

d3.select("body").on("mousemove", mouseMove)
    .on("mouseleave", stopRecording);

var timeoutId;

var positions = [];

function mouseMove(){
    if (player.playing()){
        var pos = d3.mouse(this);
        printPosition(pos);
    }
}

function printPosition(pos){
    positions.push({ pos: [pos[0], pos[1] ], time:(new Date().getTime() - startTime) });
}

function stopRecording(){
    d3.select("body").on("mousemove", function(){});
    player.pause();

    var smallPositions = [];

    for (var i = 0; i < positions.length; i++){
        if (i%10 == 0)
            smallPositions.push(positions[i]);
    }

    console.log(smallPositions.length, positions.length);

    console.log(JSON.stringify(smallPositions));
}
