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
    this.load(videoPath);
    this.play();
}
