/**
* 游戏公用常量和方法
*/

namespace Common {
    /**测试数据 */
    export var userData = {
        "selectHero":1,
        "equip":[],
        "speed":10,
        "distance":400,
        "money":0,
        "soul":0,
        "power":0,
        "talentPage":[
            {"name":"pvp", "count":0, "talent":[]}
        ],
    };
    /**舞台的宽度 */
    export var SCREEN_W:number;
    /**舞台的高度 */
    export var SCREEN_H:number;
    /**主舞台 */
    export var mainStage:Main;
    /**全局字体颜色 */
    export var TextColors = {
        white: 0xFFFFFF,//白色
        milkWhite: 0xefe8c0,//乳白色 
        grayWhite: 0xceb6a2,//灰白色
        yellow: 0xffff00,//金黄色 
        lightYellow: 0xffd375,//淡黄色
        orangeYellow: 0xff9900,//橘黄色//道具名称 //玩家姓名
        red: 0xa52d1c,//红色
        green: 0x00e500,//绿色 
        blue: 0x1a94d7,//蓝色 
        grayBlue: 0x2f5177,//墨蓝色 
        purple: 0xe938f2,//紫色 
        pink: 0xFF3030,//粉色 
        black: 0x2e2d2d,//黑色
        golden: 0xFFD700, //金色
        lvNotFull: 0x6f685d, //等级未满
        lvFull: 0x91bd32, //等级已满
    }
    /**全局字体大小 */
    export var LabelFontSize = {
        littleSize: 12,//小型字体大小
        middleSize: 18,//中型字体大小
        normalSize: 24,//正常字体大小
        bigSize: 36//大型字体大小
    }
    /**判断是否是微信浏览 */
    export function isWeiXin(): boolean {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if(microStr == "null") {
            return false;
        } else if(microStr == "micromessenger") {
            return true;
        }
    }
    /**获得浏览器类型 pc android ios -- 可扩展为其他 如 微信、qqzone、qq、微博、校内、facebook */
    export function systemType(): string {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if(("" + ua.match(/windows nt/i)) == "windows nt") {
            return "windows";
        } else if(("" + ua.match(/iphone/i)) == "iphone") {
            return "ios";
        } else if(("" + ua.match(/android/i)) == "android") {
            return "android";
        } else if(("" + ua.match(/ipad/i)) == "ipad") {
            return "ipad";
        } else if(("" + ua.match(/linux/i)) == "linux") {
            return "linux";
        } else if(("" + ua.match(/mac/i)) == "mac") {
            return "mac";
        } else if(("" + ua.match(/ucbrower/i)) == "ucbrower") {
            return "ucbrower";
        } else {
            console.log("未知系统类型");
        }
    }
    /**获得平台类型 如 微信、qqzone、qq、微博、校内、facebook */
    export function platformType(): string {
        var ua = window.navigator.userAgent.toLowerCase();
        if(("" + ua.match(/micromessenger/i)) == "micromessenger") {
            return "micromessenger";
        } else if(("" + ua.match(/qzone/i)) == "qzone") {
            return "qzone";
        } else if(("" + ua.match(/weibo/i)) == "weibo") {
            return "weibo";
        } else if(("" + ua.match(/qq/i)) == "qq") {
            return "qq";
        } else if(("" + ua.match(/renren/i)) == "renren") {
            return "renren";
        } else if(("" + ua.match(/txmicroblog/i)) == "txmicroblog") {
            return "txmicroblog";
        } else if(("" + ua.match(/douban/i)) == "douban") {
            return "douban";
        } else {
            return "other";
        }
    }
    
    /**
     * 输出log信息
     */
    export function log(message?: any, ...optionalParams: any[]) {
        if (!!DEBUG) {
            console.log(message, ...optionalParams)
        }
    }

	//派发事件
	export function dispatchEvent(type:string, obj:Object = null, bubbles:boolean = false, cancelable:boolean = false):void
	{ 	
		var event = new lcp.LEvent(type, obj, bubbles, cancelable);
		lcp.LListener.getInstance().dispatchEvent(event);
	}

	//监听事件
	export function addEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean=false,priority:number=0):void
	{ 
		lcp.LListener.getInstance().addEventListener(type,listener,thisObject,useCapture,priority);
	}

    //删除事件
    export function removeEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean=false):void {
        lcp.LListener.getInstance().removeEventListener(type, listener, thisObject, useCapture);
    }

    //当前舞台
    export function curStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    //当前面板
    export var curPanel:any;

    //当前游戏宽度
    export function curWidth(): number {
        return egret.MainContext.instance.stage.stageWidth;
    }

    //当前游戏宽度
    export function curHeight(): number {
        return egret.MainContext.instance.stage.stageHeight;
    }

    /**全局遮罩 */
    export var globalMask:egret.Bitmap;
    /**创建全局遮罩 */
    export function createGlobleMask():void {
        globalMask = Utils.createBitmap("mask_png");
        globalMask.alpha = 0.01;
        globalMask.width = SCREEN_W;
        globalMask.height = SCREEN_H;
    }

    export function SetXY(obj:any, x:number, y:number):void{
        if(obj == null) return;
        obj.x = x;
        obj.y = y;
    }

    export function CreateText(name:string, size:number = 30, textColor:number = 0xffffff, isBold:boolean = false, fontFamily:string = "Arial", textAlign:string = "left"):egret.TextField{
        let txt:egret.TextField = new egret.TextField();
        txt.text = name;
        txt.size = size;
        txt.textColor = textColor;
        txt.bold = isBold;
        txt.fontFamily = fontFamily;
        txt.textAlign = textAlign;

        return txt;
    }

    export function CreateShape(x,y,width,height):egret.Shape{
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x000000, 1);
        shape.graphics.drawRect(x,y,width,height);
        shape.graphics.endFill();
        return shape;
    }

    export function TranslateDigit(val:number):string{
        if(val >= 100000000){
            return Math.floor(val / 100000000) + "亿";
        }
        else if(val >= 10000){
            return  Math.floor(val / 10000) + "万";
        }
        else
            return `${val}`;;
    }

    /** 监听或者移除对象 主要是一些比较通用的对象组合 
     * @param arr_list   对象数组
     * @param func       监听的回调函数
     * @param obj        对象父类
     * @param type       监听还是移除类型 1 监听 0 移除
    */
    export function ListenerAndRemoveEvent(arr_list:any, func:Function, obj:any, type:number):void{
        if(type == 1){
            for(let i in arr_list) arr_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, func, obj);
        }
        else if(type == 0)
        {
            for(let i in arr_list) arr_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, func, obj);
        }
    }

    /** 修改图片的滤镜
     * #param obj 图片对象 必须是bitmap类型
     * @param filterColor 颜色类型
     */
    export function ChangeImgMatrixFilter(obj:egret.Bitmap, filterColor:string):void{
        let colorMatrix = null;
        if(filterColor == "gray"){
            colorMatrix = [ 0.3,0.6,0,0,0,0.3,0.6,0,0,0,0.3,0.6,0,0,0,0,0,0,1,0];
        }
        let colorFilter = new egret.ColorMatrixFilter(colorMatrix);
        obj.filters = [colorFilter];
    }

    /** create mc 
     * @param name clip name
     */
    export function CreateMovieClip(name:string):egret.MovieClip{
        let data = RES.getRes(name + "_json");
        let texture = RES.getRes(name + "_png");
        let mcData = new egret.MovieClipDataFactory(data, texture);
        let mc = new egret.MovieClip(mcData.generateMovieClipData("action"));
        return mc;
    }

    /** 根据品级来区分不同的颜色 */
    export function GetEquipColorFromGrade(grade:number):number{
        if(grade == 1) return 0x858685;
        else if(grade == 2) return 0x5e972b;
        else if(grade == 3) return 0x2f76b0;
        else if(grade == 4) return 0x852f9b;
        else if(grade == 5) return 0xab5515;
    }

    /** 根据不同的物品类型来获得不同的纹理
     * @param type 1 装备 2 基本物品 如经验 钻石
     * @param name 物品名字
     */
    export function GetTextureFromType(param):any{
        if(param.type == 1){
            return RES.getRes(`Sequip${25-param.data}_png`);
        }
        else if(param.type == 2)
        {
            let str_list = {diamond:"crystal_0002_png", exp:"exp_0002_png",soul:"sole_0002_png",power:"power_0002_png"};
            return RES.getRes(str_list[param.name]);
        }
    }

    /** 对奖励进行细分计算 
     * @param type 1 装备 2 基本物品 如经验 钻石
     * @param name 物品名字
    */
    export function DealReward(list):void{
        for(let i in list){
            if(list[i].type == 1){
                modEquip.EquipData.GetInstance().InsertEquipList([list[i].data]);
            }
            else if(list[i].type == 2)
            {
                UserDataInfo.GetInstance().SetBasicData(list[i].name, (UserDataInfo.GetInstance().GetBasicData(list[i].name) + list[i].data));
            }
        }
    }
}