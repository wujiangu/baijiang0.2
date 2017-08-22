/**
 * http请求
 */
class HttpRequest {
    public constructor() {
        
    }

    public static getInstance() {
        if (!this._instance) {
            this._instance = new HttpRequest();
        }
        return this._instance;
    }

    /**
     * 发送http请求
     * @param method: 网络请求方法 ("GET":GET方式, "POST":POST方式)
     * @param key: 具体的请求
     * @param params: 请求参数
     * @param func: 请求成功或失败的回调
     * @param funcObj: 回调函数的所属对象
     */
    public send(method:string, key:string, params:any, func:Function, funcObj:any):void {
        let http:Http = ObjectPool.pop("Http");
        http.func = func;
        http.funcObj = funcObj;
        if (key == "login"){
            http.open(this.urls[key]);
            http.send(params);
        }else{
            if (method == "GET"){
                http.open(this.urls[key]+"?"+params, this.token, true);
                http.send();
            }else{
                http.open(this.urls[key], this.token, false);
                http.send(params);
                egret.log("http--->"+this.urls[key], "token-->"+this.token, "参数--->"+params);
            }
        }
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
        "login":"http://116.62.214.75:5555/userinfo/login",
        // "login":"http://httpbin.org/post",
        //购买支付
        "pay":"http://116.62.214.75:5555/order/signature",
        //订单查询
        "order":"",
        //心跳
        "heartbeat":"http://116.62.214.75:5555/userinfo/heartbeat",
    }
    /**token值 */
    private token:string;
}

// class Http {
//     public constructor(){
//         this.httpRequest = new egret.HttpRequest();
//         // this.httpRequest.withCredentials = true;
//         this.httpRequest.responseType = egret.HttpResponseType.TEXT;
//         // this.open(this.url)
//     }

//     public send(params:any = null):void {
//         // this.dataProcess(params);
//         this.httpRequest.send(params);
//     }

//     /**打开一个http请求 */
//     public open(url:string, token:string = null, isGET:boolean = false):void {
//         if (isGET){
//             this.httpRequest.open(url, egret.HttpMethod.GET);
//         }else{
//             this.httpRequest.open(url, egret.HttpMethod.POST);
//         }
//         //设置响应头
//         this.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
//         //设置token的值
//         if (token){
//             // let temp = "Bearer " + window.btoa(token);
//             egret.log("添加token请求tou", token, typeof(token));
//             this.httpRequest.setRequestHeader("Authorization-token", token);   
//         }
//         //加载完成，通过事件的respond属性获取返回的信息
//         this.httpRequest.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
//         //加载失败
//         this.httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
//         //加载进度
//         this.httpRequest.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
//         //关闭http请求
//         this.httpRequest.addEventListener(egret.Event.CLOSE, this.onPostClose, this);
//     }

//     //发送请求前的数据处理(加密)
//     private dataProcess(data) {
//         var msg;
//         let time = Math.floor(new Date().getTime()/1000);
//         var token = ""
//         token = new md5().hex_md5(token);
//         msg = token;
//         return msg;
//     }

//     //请求加载完成
//     private onPostComplete(event:egret.Event):void {
//         let request = <egret.HttpRequest>event.currentTarget;
//         let data = JSON.parse(request.response);
//         this.func.call(this.funcObj, data);
//         ObjectPool.push(this);
//         this.removeEventListener();
//     }

//     //请求失败
//     private onPostIOError():void {
//         Common.log("get Error");
//         this.func.call(this.funcObj);
//         ObjectPool.push(this);
//         this.removeEventListener();
//     }

//     //请求进度(可通过event.bytesLoaded和event.bytesTotal统计进度信息)
//     private onPostProgress(event:egret.ProgressEvent):void {
//         Common.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
//     }

//     //关闭http请求
//     private onPostClose():void {
//         ObjectPool.push(this);
//         this.removeEventListener();
//     }

//     //关闭监听
//     private removeEventListener():void {
//         //加载完成，通过事件的respond属性获取返回的信息
//         this.httpRequest.removeEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
//         //加载失败
//         this.httpRequest.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
//         //加载进度
//         this.httpRequest.removeEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
//         //关闭http请求
//         this.httpRequest.removeEventListener(egret.Event.CLOSE, this.onPostClose, this);
//     }

//     /**回调函数 */
//     public func:Function;
//     public funcObj:any;
//     /**url */
//     // private url:string = "http://httpbin.org/post";
//     // private url:string = "http://116.62.214.75:5555/userinfo";
//     /**http请求 */
//     private httpRequest:egret.HttpRequest;
// }
class Http {
    public constructor(){
        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.responseType = "text";
    }

    public send(params:any = null):void {
        // this.dataProcess(params);
        this.httpRequest.send(params);
    }

    /**打开一个http请求 */
    public open(url:string, token:string = null, isGET:boolean = false):void {
        if (isGET){
            this.httpRequest.open("GET", url);
        }else{
            this.httpRequest.open("POST", url);
        }
        //设置token的值
        if (token){
            egret.log("添加token请求tou", token, typeof(token));
            this.httpRequest.setRequestHeader("Authentication-token", token);   
        }
        //设置响应头
        this.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        this.httpRequest.addEventListener("readystatechange",()=>{
            this.callBack();
        });
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
        // egret.log("请求完成---->", request)
        let data = JSON.parse(request);
        this.func.call(this.funcObj, data);
        egret.log("所有请求头---->", this.httpRequest.getAllResponseHeaders());
        ObjectPool.push(this);
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