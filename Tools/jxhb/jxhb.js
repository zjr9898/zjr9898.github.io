"auto";

function Debug()
{
    console.log("hello world");
    return true;
}

function Setup()
{
    console.show();
    console.log("屏幕信息:"+device.width+" "+device.height);
    console.setSize(device.width/6, device.height/6);
    sleep(1000);
    console.log("惊喜红包 启动!");
    launchApp("惊喜红包");
    sleep(3000);
    return true;
}

function Safeclick(x,y){
    console.log("click:"+x+","+y);
    sleep(random(100,200));
    x=random(x-10,x+10);
    y=random(y-10,y+10);
    console.log("click:"+x+","+y);
    click(x,y);
    sleep(random(100,200));
    return true;
}

function Up(){
    let x=device.width/2,y1=device.height/3,y2=device.height*0.66;
    x=Math.floor(x);
    y1=Math.floor(y1);
    y2=Math.floor(y2);
    x=random(x-10,x+10);
    y1=random(y1-10,y1+10);
    y2=random(y2-10,y2+10);
    gesture(random(200,400),[x,y2],[x,y1]);
    return true;
}

function Down(){
    let x=device.width/2,y1=device.height/3,y2=device.height*0.66;
    x=Math.floor(x);
    y1=Math.floor(y1);
    y2=Math.floor(y2);
    x=random(x-10,x+10);
    y1=random(y1-10,y1+10);
    y2=random(y2-10,y2+10);
    gesture(random(200,400),[x,y1],[x,y2]);
    return true;
}

function Open(){
    var a=id("redCouponTop").findOne(1000);
    if(a){
        console.log("准备拆红包");
        var bd=a.bounds();
        Safeclick(bd.centerX(),bd.centerY());
        console.log("等待...");
        sleep(random(15000,20000));
        return true;
    }
    else{
        console.log("fuck");
        return false;
    }
}

function Watch(){
    var elm=className("android.widget.TextView").text("看10秒可直接拿奖励").findOne(200);
    if(elm){
        elm=className("android.widget.TextView").text("拿奖励").findOne().parent(200);
        Forceclick(elm);
        console.log("观看中...");
        sleep(random(200,300));
        for(let i=10;i>=1;i--){
            console.log("倒计时："+i+"秒");
            sleep(1000);
        }
        elm=id("ksad_kwad_web_navi_back").findOne(200);
        Forceclick(elm);
    }
    else{
        console.log("观看中...");
        for(let i=30;i>=1;i--){
            console.log("倒计时："+i+"秒");
            sleep(1000);
        }
    }
    console.log("观看结束");
    sleep(random(100,200));
    return true;
}

function Forceclick(elm){
    if(elm){
        sleep(random(200,300));
        xy=elm.bounds();
        Safeclick(xy.centerX(),xy.centerY());
        return true;
    }
    return false;
}

function Close(){
    var elm=className("android.widget.TextView").text("跳过").findOne(200);
    if(elm){
        console.log("退出");
        var xy=elm.bounds();
        Safeclick(xy.centerX(),xy.centerY());
        elm=className("android.widget.TextView").text("坚持退出").findOne(200);
        if(Forceclick(elm)){
            return true;
        }
        elm=className("android.widget.TextView").text("残忍离开").findOne(200);
        if(Forceclick(elm)){
            return true;
        }
    }    
    console.log("退出失败");
    return false; 
}
function Work()
{
    while(1)
    {
        var elm=className("TextView").text("看视频，领金币").findOne(1000);
        if(elm)
        {
            console.log("发现红包");
            Forceclick(elm);
            sleep(1000);
            if(Open()){
                Watch();
                Close();
            }
        }
        else{
            console.log("hjt");
            sleep(2000,3000);
        }
        if(random(0,1)){
            Up();
        }
        else{
            Down();
        }
    }
    return true;
}


Setup();
//Debug();
Work();
