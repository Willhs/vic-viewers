var Player = function(videoPath){
    var video = document.getElementById("video");

    this.load = function(videoPath){
        video.src = videoPath;
    }
    this.play = function(){
        video.play();
    }
    this.pause = function(){
        video.pause();
    }
    this.mute = function(){
        video.muted = true;
    }
    this.playing = function(){
        return !video.paused;
    }

    this.load(videoPath);
    //this.loop = true;
    var that = this;
    setTimeout(function() {
        console.log("playing!---------------------");
        startTime = new Date().getTime();
        that.play();
    }, 0);



}
