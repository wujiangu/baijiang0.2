/**
 * 支付模块
 */
module modPay {
    /**
     * 预下单
     */
    export function preOrder(params:any):void {
        let data:any = {};
        data["appId"] = modLogin.getBaseData("appid");
        data["accountId"] = modLogin.getBaseData("uid");
        data["amount"] = params.amount;
        data["wxopenid"] = modLogin.getBaseData("wxopenid");
        data["call_back_url"] = modLogin.getBaseData("cburl");
        data["merchant_url"] = modLogin.getBaseData("cburl");
        data["subject"] = params.subject;
        data["channel"] = modLogin.getBaseData("channel");
        data["sdw_test"] = false;
        if (window["isDebug"]) data["sdw_test"] = true;
        // if (data["wxopenid"] == "") delete data.wxopenid;
        HttpRequest.getInstance().send("POST", "pay", data, (result)=>{
            data["gameName"] = "百将斩";
            data["cpOrderId"] = result["order"];
            data["sign"] = result["signature"];
            data["timestamp"] = result["timestamp"];
            data["complete"] = complete;
            delete data.sdw_test;
            // egret.log("发送平台的数据---->", data);
            window["sdw"].chooseSDWPay(data);
        }, modPay);
    }

    /**
     * 关闭支付窗口
     */
    function complete(res) {
        egret.log("关闭支付窗口------->", res);
        checkOrder(res);
        // window["sdw"].closeSDWPay();
    }

    /**
     * 向服务器发起订单查询结果
     */
    function checkOrder(data:any):void {
        HttpRequest.getInstance().send("GET", "order", data, (result)=>{
            egret.log("查询订单---->", result);
            window["sdw"].closeSDWPay();
            //此处客户端更新资源
        }, modPay);
    }
}