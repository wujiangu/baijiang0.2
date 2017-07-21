/**
 * WebSocket 接收数据的顺序和会发送的顺序保持一致
 * 可能同时发送多个请求，但是接收到的 response 会和发送的一致
 *
 */
namespace NetConnect {
    var httpRequest:egret.HttpRequest = null;
    var window:Window;
    var url = "https://api.leancloud.cn/";
    // var url = "http://httpbin.org/post";
    //保存数据，发送的时候做md5加密
    var token:any;
    //是否打开了http请求
    var isOpen:number = 0;
    //记录发送的请求
    var msg_list = [];
    //每条请求的回调
    var action_map = <number & Function>{};

    function init(msg:any) {
        if (isOpen == 1 || httpRequest) {
            return;
        }
        //新建http请求
        httpRequest = new egret.HttpRequest();
        //设置数据格式为文本
        httpRequest.responseType = egret.HttpResponseType.TEXT;
        //打开一个为GET的http请求
        url = "https://leancloud.cn:443/1.1/classes/Post"
        httpRequest.open(url, egret.HttpMethod.POST);
        _send(msg)
        //设置响应头
        // httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        httpRequest.setRequestHeader("Content-Type", "application/json");
        //加载完成，通过事件的respond属性获取返回的信息
        httpRequest.addEventListener(egret.Event.COMPLETE, onPostComplete, NetConnect);
        //加载失败
        httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, onPostIOError, NetConnect);
        //加载进度
        httpRequest.addEventListener(egret.ProgressEvent.PROGRESS, onPostProgress, NetConnect);
        //关闭http请求
        httpRequest.addEventListener(egret.Event.CLOSE, onPostClose, NetConnect);
    }

    export function send(act_id, data, callBack):void {
        // token = new md5().hex_md5(token);
        if (action_map[act_id]) {
            Common.log("repeat request 重复请求");
            return;
        }
        let msg = dataProcess(act_id, data);
        action_map[act_id] = callBack;
        if (isOpen == 0) {
            // msg_list.push(msg)
            // msg =`"X-LC-Id: onCULkQ8rWJmAJtnjfxtxrkr-gzGzoHsz"` +
            //     ` "X-LC-Key: FGupyEUQyuw4kKkvrU7ohM06"` +
            //     ` \`{"content": "每个 Java 程序员必备的 8 个开发工具"}\``
            msg = {
                "X-LC-Id": "onCULkQ8rWJmAJtnjfxtxrkr-gzGzoHsz",
                "X-LC-Key": "FGupyEUQyuw4kKkvrU7ohM06",
                "content": "每个 Java 程序员必备的 8 个开发工具"
            }
            msg = JSON.stringify(msg)
            Common.log(msg, typeof(msg));
            init(msg);
        }else{
            _send(msg);
        }
    }

    function _send(msg:any) {
        httpRequest.send(msg);
    }

    //发送请求前的数据处理
    function dataProcess(act_id, data) {
        var msg;
        let time = Math.floor(new Date().getTime()/1000);
        var token = `channel=9166&appid=1112169032&time=${time}&uid=33330379e0b1e31e4a5d8d7fee224168bc`;
        token = new md5().hex_md5(token);
        Common.log("token----->", token);
        msg = `${data}&sign=${token}`;
        // var msg = window["pack"](data);
        return msg;
    }

    //打开http请求回调
    function onPostOpen():void {
        Common.log("open");
        isOpen = 1;
        for (let i = 0; i < msg_list.length; i++) {
            _send(msg_list[i]);
            delete msg_list[i];
        }
    }

    //请求加载完成
    function onPostComplete(event:egret.Event):void {
        let request = <egret.HttpRequest>event.currentTarget;
        Common.log(request.response);
        // let act_id = window["unpack"](request.response);
        // if (act_id && action_map[act_id]) {
        //     action_map[act_id]();
        //     delete action_map[act_id];
        // }
    }

    //请求失败
    function onPostIOError():void {
        Common.log("get Error");
        onPostClose();
    }

    //请求进度(可通过event.bytesLoaded和event.bytesTotal统计进度信息)
    function onPostProgress(event:egret.ProgressEvent):void {
        Common.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
    }

    //关闭http请求
    function onPostClose():void {
        Common.log("http Close");
        isOpen = 0;
        httpRequest = null;
    }
}