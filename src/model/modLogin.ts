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
        UserData.UserId = userBase["uid"];
        heartTimer = new egret.Timer(15000, 0);
        let platform = Common.platformType();
        payTimer = new egret.Timer(2000, 0);
        newUserData = RES.getRes("TcNewUser_json");
    }

    /**
     * 登陆请求
     */
    export function reqLogin(onSuccess:Function = null, onFail:Function = null):void {
        HttpRequest.getInstance().send("POST", "login", userBase, (data)=>{
            HttpRequest.getInstance().setToken(data.token);
            getUserDataFromSever(onSuccess);
            // modPay.preOrder({amount:1, subject:"钻石", memo:"111111"});
        }, modLogin);
    }

    /**
     * 用户心跳包
     */
    export function sendHeartBeat():void {
        //心跳
        heartTimer.addEventListener(egret.TimerEvent.TIMER, ()=>{
            HttpRequest.getInstance().send("GET", "heartbeat", {}, (data)=>{
                // egret.log("心跳---->", data);
            }, modLogin);
        }, modLogin);
        heartTimer.start();
    }

    /**
     * 支付心跳包
     */
    export function sendPayHeart():void {
        payTimer.addEventListener(egret.TimerEvent.TIMER, ()=>{
            HttpRequest.getInstance().send("GET", "diamond", {}, (result)=>{
                let curDiamond:number = UserDataInfo.GetInstance().GetBasicData("diamond");
                if (curDiamond < result.diamond) {
                    payTimer.stop();
                    let shareNum:number = result.diamond - curDiamond;
                    UserDataInfo.GetInstance().SetBasicData({diamond:result.diamond});
                    SceneManager.mainScene.show_label_text();
                    ShopDialog.instance.show_label_text();
                    modShop.getRechargeAward((type, id)=>{
                        WindowManager.GetInstance().GetWindow("RewardTipsPop").Show(shareNum, type, id);
                    });
                }
            }, modLogin);
        }, modLogin);
        payTimer.start();
    }

    /**
     * 关闭支付心跳包
     */
    export function closePayHeart():void {
        payTimer.stop();
    }

    /**
     * 从服务器获取用户信息
     */
    function getUserDataFromSever(callBack:Function):void {
        HttpRequest.getInstance().send("GET", "userinfo", {}, (data)=>{
            // egret.log("用户信息----->", JSON.stringify(data));
            if (Object.keys(data.userInfo).length == 0) {
            // if (data.userInfo.roleName == null) {
                //新用户
                newUserHandler(callBack);
            }else{
                data.userInfo["loginTime"] = new Date().getTime();
                data.userInfo["isNew"] = false;
                //获取钻石
                HttpRequest.getInstance().send("GET", "diamond", {}, (result)=>{
                    data.userInfo["diamond"] = result.diamond;
                    UserDataInfo.GetInstance().SaveData(data.userInfo);
                    //测试
                    HttpRequest.getInstance().send("POST", "userinfo", {diamond:result.diamond});
                    if (callBack) callBack();
                }, modLogin)
            }
        }, modLogin);
    }

    /**
     * 新用户处理
     */
    function newUserHandler(callBack:Function):void {
        let data:any = newUserData.user;
        data["roleName"] = (userBase.nick == "null") ? userBase.uid:userBase.nick
        data["roleSex"] = (userBase.sex == "null") ? 1:userBase.sex;
        data["shareNum"] = 0;
        //本次登陆注册的时间
        data["loginTime"] = new Date().getTime();
        //新用户标志
        data["isNew"] = true;
        //获取钻石
        HttpRequest.getInstance().send("GET", "diamond", {}, (result)=>{
            data["diamond"] = result.diamond;
            //这里存储数据到本地
            UserDataInfo.GetInstance().SaveData(data);
            delete data.isNew;
            // delete data.diamond;
            // egret.log("发送服务器的数据--->", JSON.stringify(data), userBase.sex);
            HttpRequest.getInstance().send("POST", "userinfo", data, (result)=>{
                // egret.log("创建新用户成功---->", result);
                initNewUserData(callBack);
            }, modLogin)
        }, modLogin)
    }

    /**
     * 初始化新用户的数据(包括英雄，装备，天赋等)
     */
    function initNewUserData(callBack:Function):void {
        let data:any = newUserData.hero;
        let equipId:number = modEquip.getRandEquipId();
        data.equipId = equipId;
        // egret.log("传输数据---->", JSON.stringify(data));
        HttpRequest.getInstance().send("POST", "hero", data, (result)=>{
            // egret.log("新用户英雄数据创建成功--->", result);
            if (callBack) callBack();
        }, modLogin);
        HttpRequest.getInstance().send("POST", "talent", {talentPage:1,talent:[],count:1})
        //签到
        HttpRequest.getInstance().send("POST", "checkin", {isSign:0, signNum:0});

        //武器
        let info:modEquip.EquipInfo = new modEquip.EquipInfo(14,0,3,1,equipId);
        modEquip.ReqInsertAndUpEquip(info);
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
        // let str1 = cburl+"&channel="+userBase["channel"];
        // let str2 = reurl+"&channel="+userBase["channel"];
        let str1 = cburl;
        let str2 = reurl;
        userBase["nick"] = getUserData("nick=");
        userBase["avatar"] = getUserData("avatar=");
        userBase["sex"] = getUserData("sex=");
        userBase["time"] = getUserData("time=");
        userBase["wxopenid"] = getUserData("wxopenid=");
        userBase["sdw_from"] = getUserData("sdw_from=");
        userBase["sdw_test"] = false;
        if (window["isDebug"]){
            userBase["sdw_test"] = true;
            str1 += "&sdw_test=true";
            str2 += "&sdw_test=true";
        }
        userBase["cburl"] = encodeURI(str1);
        userBase["reurl"] = encodeURI(str2);
        egret.log("地址--->", userBase["cburl"]);
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

    var newUserData:any;
    var iframeData:Array<string>;
    var userBase:any;
    var heartTimer:egret.Timer;
    var payTimer:egret.Timer;
}