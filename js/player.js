var player = null,
    status = -1,
    timer = null,
    dura = 0,cntt = 0,
    canvas = null,
    nowsong = null;

$(function () {
    $.get("GetFiles.php", function (d) {
        $("#list").html(d);
    });
    canvas = document.getElementById("canvas3d");
    initPlayer();
    initTips();
    initControl();

});

function ChangeModel(sender){
    if ($(sender).text() == player.model) return;
    var par = canvas.parentNode;
    par.removeChild(canvas);
    $(par).prepend("<canvas id='canvas3d'></canvas>");
    canvas = document.getElementById("canvas3d");
    switch ($(sender).text()){
        case "B3D":
            player.model = "B3D";
            player.initB3D(canvas);
            break;
        case "2D":
            player.model = "2D";
            player.init2D(canvas);
            break;
    }
}

function initTips(){
    $("#progress").mousemove(function (e) {
        if (dura == 0) return;
        var dig = dura * ((e.pageX - $("#progress").offset().left) / parseFloat($("#progress").width()));
        //console.log(dig);
        var m = parseInt(dig / 60);
        var s = parseInt(dig - m * 60);
        $("#tips").text(m + ":" + s);
        $("#tips").css({ "display": "block", "left": (e.pageX - $("#tips").width() / 2), "top": ($("#progress").offset().top - $("#tips").height() - 5) });
    });
    $("#progress").mouseout(function () {
        $("#tips").css("display","none");
    });
}

function initControl(){
    $("#progress").click(function (e) {
        if (dura == 0) return;
        var dig = dura * ((e.pageX - $("#progress").offset().left) / parseFloat($("#progress").width()));
        player.setDur(dig);
    });
    $("#btnPlay").click(Taggle);
    $("#btnNext").click(Nextsong);
    $(window).keydown(function (e) {
        if (e.which == 32) {
            Taggle();
            return false;
        }
    });
}

function initPlayer(){
    player = new Player();
    player.initB3D(canvas);
    player.onStart = function () {
        cntt = 1;
        timer = window.setInterval("DrawProgress()", 500);
    };
    player.onEnd = function () {
        console.log("onEnd");
        clearInterval(timer);
        $("#btnPlay").html('<span class="glyphicon glyphicon-play"></span>');
        status = 0;
    };
}

function PlaySongs(sender){
    $(sender).siblings().css({ "background": "white", "color": "black" });
    nowsong = sender;
	var songname = "../Music/" + $(sender).text() + ".mp3";
	$(sender).css({ "background": "blue", "color": "white" });
	loadSound(songname);
}

function loadSound(url){
    if (!player) return;
    status = 1;
    $("#btnPlay").html('<span class="glyphicon glyphicon-pause"></span>');
    player.loadSound(url,document.getElementById("canvas3d"));
}

function Nextsong(){
    nowsong = $(nowsong).next();
    PlaySongs(nowsong);
}

function Presong(){
    
}

function Duration() {
    return player.duration();
}

function TotalTime(){
    dura = player.totalTime();
}

function DrawProgress(){
    if (status == -1 || dura == 0) {TotalTime(); return; }
    var nt = Duration() / dura * 100;
    //console.log(cntt + "    " + dura);
    $("#progress-bar").css("width",nt + "%");
}

function Taggle(){
    if (status == -1) return;
    else if (status == 0) { 
        player.resume();
        $("#btnPlay").html('<span class="glyphicon glyphicon-pause"></span>');
        status = 1;
    } else {
        player.pause();
        $("#btnPlay").html('<span class="glyphicon glyphicon-play"></span>');
        status = 0;
    }
}