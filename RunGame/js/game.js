/*创建人物*/
function person(canvas, cobj, runImg, jumpImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.runImg=runImg;
    this.jumpImg=jumpImg;
    this.width=69;
    this.height=85;
    this.sx=canvas.width/3;
    this.sy=0;
    this.speedx=5;
    this.speedy=5;
    this.status="runImg";
    this.state=0;
    this.zhongli=15;
    this.endy=420;
    this.life=3;
}
person.prototype={
    draw:function (){
        this.cobj.save();
        this.cobj.translate(this.sx,this.sy);
        this.cobj.drawImage(this[this.status][this.state],0,0,69,85,0,0,this.width,this.height);
        this.cobj.restore();
    },
    update:function(){
        if (this.sy > this.endy) {
            this.sy = this.endy
        } else if (this.sy < this.endy) {
            this.speedy += this.zhongli;
            this.sy += this.speedy;
        }
    }
}
/*粒子动画*/
function lizi(cobj,x,y){
    this.cobj=cobj;
    this.x=x;
    this.y=y;
    this.color="red";
    this.r=Math.random()*5;
    this.speedr=0.1;
    this.speedy=2*Math.random()-2;
    this.life=2;
    this.speedl=0.1;
}
lizi.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.beginPath();
        this.cobj.fillStyle=this.color;
        this.cobj.translate(this.x,this.y);
        this.cobj.arc(0,0,this.r,0,2*Math.PI);
        this.cobj.fill();
        this.cobj.restore();
    },
    update:function(){
        this.y-=this.speedy;
        this.x+=6*Math.random()-5;
        this.r-=this.speedr;
        this.life-=this.speedl;
    }
}
function xue(cobj,x,y){
    console.log(1)
    var arr=[];
    for(var i=0;i<30;i++){
        var obj=new lizi(cobj,x,y);
        arr.push(obj);
    }
    var t=setInterval(function(){
        for(var i=0;i<arr.length;i++){
            arr[i].draw();
            arr[i].update();
            if(arr[i].r<=0){
                arr.splice(i,1);
            }
            if(arr.length==0){
                clearInterval(t);
            }
        }
    },50)
}
/*创建障碍物*/
function hinder(canvas,cobj,hinderImg){
    this.hinderImg=hinderImg;
    this.canvas=canvas;
    this.cobj=cobj;
    this.width=45;
    this.height=45;
    this.x=canvas.width;
    this.y=455;
    this.state=0;
    this.speedHX=6;
    this.name=""
}
hinder.prototype={
    draw:function(){
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,90,76,0,0,this.width,this.height);
        this.cobj.restore();
    }
}
/*创建子弹*/
function zidan(cobj){
    this.cobj=cobj;
    this.x=0;
    this.y=0;
    this.width=50;
    this.height=10;
    this.speedx=5;
    this.a=1;
}
zidan.prototype={
    draw:function(){
        var cobj=this.cobj;
        cobj.save();
        cobj.translate(this.x,this.y);
        cobj.fillRect(0,0,this.width,this.height);
        cobj.restore();
    }
}

/*游戏运行*/
function game(canvas, cobj, runImg, jumpImg,hinderImg){
    this.canvas = canvas;
    this.canvasW = canvas.width;
    this.canvasH = canvas.height;
    this.hinderImg=hinderImg;
    this.runImg=runImg;
    this.jumpImg=jumpImg;
    this.cobj = cobj;
    this.person = new person(canvas, cobj, runImg, jumpImg);
    this.speedx=10;
    this.hindersArr=[];
    this.score=0;
    this.zidan=new zidan(this.cobj);
}
game.prototype={
    play:function(start,mask){
        start.css("animation","start1 2s ease forwards");
        mask.css("animation","mask1 2s ease forwards");
        this.run();
        this.key();
        this.mouse();

    },
    run:function(){
        var that=this;
        var num=0;
        var rand=2000;//步数
        var back=0;
        setInterval(function(){
            that.cobj.clearRect(0,0,that.canvasW,that.canvasH);
            num+=50;
            if(that.person.status=="runImg"){
                that.person.state=num%8;
            }else{
                that.person.state=0;
            }
            back-=that.speedx;
            that.person.draw();
            that.person.update();

            if(num%rand==0){
                num=0;
                rand=(2+Math.floor(3*Math.random()))*1000;
                var obj=new hinder(that.canvas,that.cobj,that.hinderImg);
                obj.state=Math.floor(Math.random()*that.hinderImg.length);
                that.hindersArr.push(obj);
            }
            for(var i=0;i<that.hindersArr.length;i++){
                that.hindersArr[i].x-=that.hindersArr[i].speedHX;
                that.hindersArr[i].draw();

                if(hitPix(that.canvas,that.cobj,that.person,that.hindersArr[i])){
                    if(!that.hindersArr[i].flag){
                        xue(that.cobj,that.person.sx,that.person.sy);
                        that.person.life--;
                        if(that.person.life<0){
                            alert("game over");
                            location.reload();
                        }
                        that.hindersArr[i].flag=true;
                    }


                }
                if(that.person.x>(that.hindersArr[i].x+that.hindersArr[i].width)){
                    if(!that.hindersArr[i].flag&&!that.hindersArr[i].flag1){
                        that.score++;
                        document.title=that.score;
                    }
                }
            }
            /*操作子弹*/
            if(that.isfire){
                that.zidan.speedx+=that.zidan.a;
                that.zidan.x+=that.zidan.speedx;
                that.zidan.draw();
            }
            /*背景*/
            that.canvas.style.backgroundPositionX=back+"px";
        },50)
    },
    key:function(){
        var that=this;
        var flag=true;
        document.onkeydown=function(e){
            if(!flag){
                return;
            }
            flag=false;
            if(e.keyCode==32){
                that.person.status="jumpImg";
                var inita=0;
                var speeda=5;
                var r=80;
                var sy=that.person.sy;
                var t=setInterval(function(){
                    inita+=speeda;
                    if(inita>=180){
                        that.person.sy=sy;
                        clearInterval(t);
                        flag=true;
                        that.person.status="runImg";
                    }else{
                        var top=Math.sin(inita*Math.PI/180)*r;
                        that.person.sy=sy-top;
                    }
                },50)
            }
        }
    },
    mouse:function(){
        var that=this;
        document.querySelector(".mask").onclick=function(){
            that.zidan.x=that.person.sx+that.person.width/2;
            that.zidan.y=that.person.sy+that.person.height/2;
            that.speeda=5;
            that.isfire=true;
        }
    }
}
