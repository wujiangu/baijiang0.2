/**
 * 登陆注册模块
 */
namespace modLogin {
    /**
     * 初始化
     */
    export function init():void {
        decodeURL();
        userBase = {};
        saveBaseData();
    }

    /**
     * 登陆请求
     */
    export function reqLogin(onSuccess:Function = null, onFail:Function = null):void {
        let str:string = "";
        for (var key in userBase) {
            str += (key+"="+userBase[key]+"&");
        }
        str = str.substr(0, str.length-1);
        HttpRequest.getInstance().send("POST", "login", str, (data)=>{
            HttpRequest.getInstance().setToken(data.token);
            modPay.preOrder({amount:1, subject:"钻石", memo:"111111"})
            if (onSuccess) onSuccess();
        }, modLogin);

        //心跳
        // HttpRequest.getInstance().send("GET", "heartbeat", "", (data)=>{
        //     egret.log("心跳---->", data);
        // }, modLogin);
    }

    /**
     * 获取用户基本信息
     */
    export function getBaseData(key:string = null) {
        if (key) {
            return userBase[key];
        }
        return userBase;
    }

    /**
     * 跳转地址
     */
    function geturl(head:string):string {
        let headurl:string = getUserData(head+"=");
        // let url:string = headurl + "&channel=" + getBaseData("channel")
        // if (window["isDebug"]) url += "&sdw_test=true";
        return headurl;
    }

    /**
     * 保存用户基本信息
     */
    function saveBaseData():void {
        userBase["uid"] = getUserData("uid=");
        userBase["gid"] = getUserData("gid=");
        userBase["openid"] = getUserData("openid=");
        userBase["channel"] = getUserData("channel=");
        userBase["sign"] = getUserData("sign=");
        userBase["appid"] = getUserData("appid=");
        let cburl:string = geturl("cburl");
        let reurl:string = geturl("reurl");
        let str1 = cburl+"&channel="+userBase["channel"];
        let str2 = reurl+"&channel="+userBase["channel"];
        userBase["nick"] = getUserData("nick=");
        userBase["avatar"] = getUserData("avatar=");
        userBase["sex"] = getUserData("sex=");
        userBase["time"] = getUserData("time=");
        userBase["wxopenid"] = getUserData("wxopenid=");
        userBase["sdw_test"] = false;
        if (window["isDebug"]){
            userBase["sdw_test"] = true;
            str1 += "&sdw_test=true";
            str2 += "&sdw_test=true";
        }
        userBase["cburl"] = encodeURI(str1);
        userBase["reurl"] = encodeURI(str2);
    }

    /**
     * 获取用户信息(UID, sign, nick, channel, gid, appid等信息)
     */
   function getUserData(str:string):string {
        let result:string = ""
        for (let i = 0; i < iframeData.length; i++) {
            let start = iframeData[i].search(str);
            if (start >= 0) {
                result = iframeData[i].slice(start + str.length);
                break;
            }
        }
        return result;
    }

    /**
     * 获取游戏平台iframe节点的数据
     */
    function getSrc():string {
        return document.location.href;
    }

    /**
     * 解析iframe节点的数据并输出数据
     */
    function decodeURL():void {
        let src:string = getSrc();
        /**解析URL */
        let decode = decodeURIComponent(src);
        /**字符串匹配 */
        let arr: Array<string> = decode.match(/[^&]*/g);
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == "") {
                arr.splice(i, 1);
                i--;
            }
        }
        iframeData = arr;
    }

    var iframeData:Array<string>;
    var userBase:any;
}