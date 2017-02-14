window.onload=function(){
    var clientW=document.documentElement.clientWidth;
    var clientH=document.documentElement.clientHeight;
    var canvas=document.querySelector("canvas");
    canvas.width=clientW;
    canvas.height=clientH;
    var cobj=canvas.getContext("2d");

    var runImg=document.querySelectorAll(".run");
    var jumpImg=document.querySelectorAll(".jump");
    var hinderImg=document.querySelectorAll(".hinder");
    var personObj=new person(canvas,cobj,runImg,jumpImg,hinderImg);
    var gameObj=new game(canvas,cobj,runImg,jumpImg,hinderImg);


    var startBtn=$(".btn");
    var start=$(".start");
    var mask=$(".mask");

    startBtn.one("click",function(){
        gameObj.play(start,mask);
    })
}
