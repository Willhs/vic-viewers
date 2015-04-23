var mouseDown;
$(document).mousedown(function(){
    mouseDown = true;
});
$(document).mouseup(function(){
    mouseDown = false;
});

$(document).mousemove(function(event){
    if (mouseDown)
        console.log(event.pageX, event.pageY);
});
