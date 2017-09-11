/**
 * http请求
 */
class HttpRequest {
    public constructor() {
        this._reqQueue = new Array();
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new HttpRequest();
        }
        return this._instance;
    }

    /**
     * 加入到请求队列
     */
    public addQueue(req:any):void {
        this._reqQueue.push(req);
    }

    /**
     * 发送http请求
     * @param method: 网络请求方法 ("GET":GET方式, "POST":POST方式)
     * @param key: 具体的请求
     * @param params: 请求参数
     * @param func: 请求成功或失败的回调
     * @param funcObj: 回调函数的所属对象
     */
    public send(method:string, key:string, params:any, func:Function=null, funcObj:any=null):void {
        let data = Common.getUrlParams(params);
        // egret.log("参数------->"+key, data);
        let http:Http = ObjectPool.pop("Http");
        http.func = func;
        http.funcObj = funcObj;
        if (key == "login"){
            http.open(this.urls[key], method);
        }else{
            http.open(this.urls[key], method, this.token);
        }
        http.send(data);
    }

    /**
     * 钻石消费
     */
    public buy(data:any, func:Function = null):void {
        let sendData:any = {};
        sendData["diamond"] = data.diamond;
        sendData["amount"] = data.amount ? data.amount : 1;
        sendData["itemId"] = data.itemid ? data.itemid : 1;
        sendData["itemName"] = data.name ? data.name : "";
        sendData["timestamp"] = Math.floor(new Date().getTime()/1000);
        let t = this.token;
        let MD5 = new md5();
        let str = "amount="+sendData.amount+"&itemid="+sendData.itemId+"&name="+sendData.itemName+"&timestamp="+sendData.timestamp+"&t="+t;
        sendData["signature"] = MD5.hex_md5(str);
        egret.log("发送的数据===>", JSON.stringify(sendData))
        this.send("POST", "buy", sendData, (result)=>{
            if (func) func();
        }, this);
    }

    /**
     * 奖励（获取钻石）
     */
    public award(data:any, func:Function = null):void {
        let sendData:any = {};
        // action  ('shareKills', 'shareRank', 'shareHero')
        sendData["action"] = "shareKills";
        sendData["award"] = data.diamond;
        sendData["timestamp"] = Math.floor(new Date().getTime()/1000);
        let str = "action="+sendData.action+"&timestamp="+sendData.timestamp+"&award="+sendData.award+this.token;
        let MD5 = new md5();
        sendData["signature"] = MD5.hex_md5(str);
        egret.log("发送的数据===>", JSON.stringify(sendData));
        this.send("POST", "award", sendData, (result)=>{
            egret.log("奖励----->", JSON.stringify(result));
            if (func) func();
        }, this);
    }

    /**
     * 设置token的值
     */
    public setToken(value:string):void {
        this.token = value;
    }


    public static _instance:HttpRequest;

    /**
     * 通信的url
     */
    private urls:any = {
        //登陆
        "login": window["RESOURCE"] + "userinfo/login",
        //签到
        "checkin": window["RESOURCE"] + "userinfo/checkin",
        //用户信息
        "userinfo": window["RESOURCE"] + "userinfo",
        // "login":"http://httpbin.org/post",
        //购买支付
        "pay": window["RESOURCE"] + "order/signature",
        //订单查询
        "order": window["RESOURCE"] + "order",
        //心跳
        "heartbeat": window["RESOURCE"] + "userinfo/heartbeat",
        //排行榜
        "rank": window["RESOURCE"] + "rank",
        //英雄
        "hero": window["RESOURCE"] + "hero",
        //天赋
        "talent": window["RESOURCE"] + "talent",
        //装备
        "equip": window["RESOURCE"] + "equip",
        //邮件
        "email": window["RESOURCE"] + "email",
        //商店购买
        "buy": window["RESOURCE"] + "shop/buy",
        //获取钻石
        "diamond": window["RESOURCE"] + "userinfo/money",
        //购买列表
        "buylist": window["RESOURCE"] + "shop/list",
        //奖励获取
        "award": window["RESOURCE"] + "award"
    }
    /**token值 */
    private token:string;
    /**请求队列 */
    private _reqQueue:Array<any>;
}
class Http {
    public constructor(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.responseType = "text";
        this.httpRequest.addEventListener("readystatechange", this.callBack.bind(this));
    }

    public send(params:any = null):void {
        // this.dataProcess(params);
        this.httpRequest.send(params);
    }

    /**
     * 打开一个http请求
     * @param url url路径
     * @param token 用于服务端验证的token值
     * @param method 请求方法(POST, GET, DELETE)
     */
    public open(url:string, method:string, token:string = null):void {
        this.httpRequest.open(method, url);
        //设置token的值
        if (token){
            // egret.log("添加token请求tou", token, typeof(token));
            this.httpRequest.setRequestHeader("Authentication-token", token);   
        }
        //设置响应头
        this.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    }

    //网络回调
    private callBack():void {
        if (this.httpRequest.readyState == 4 && this.httpRequest.status == 200) {
            this.onPostComplete();
        }
    }

    //请求加载完成
    private onPostComplete():void {
        let request = this.httpRequest.responseText;
        ObjectPool.push(this);
        let data = JSON.parse(request);
        if (this.func && this.funcObj) this.func.call(this.funcObj, data);
    }

    //请求失败
    private onPostIOError():void {
        Common.log("get Error");
        this.func.call(this.funcObj);
        ObjectPool.push(this);
        
    }

    //请求进度(可通过event.bytesLoaded和event.bytesTotal统计进度信息)
    private onPostProgress(event:egret.ProgressEvent):void {
        Common.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
    }

    //关闭http请求
    private onPostClose():void {
        ObjectPool.push(this);
        
    }

    /**回调函数 */
    public func:Function;
    public funcObj:any;
    /**http请求 */
    private httpRequest:XMLHttpRequest;
}