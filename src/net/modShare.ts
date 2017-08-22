/**
 * 分享模块
 */
module modShare {
    /**
     * 分享
     * @params:
     *  title：分享的标题
     *  desc：分享的内容
     *  link：分享的链接(默认当前链接)
     *  imgUrl：分享的小图(默认取网页的第一张)
     *  success：分享成功回调
     *  fail：分享失败回调
     *  cancel：分享取消回调
     */
    export function share(params:any) {
        let send:any = {};
        send["title"] = params.title;
        send["desc"] = params.desc;
        send["link"] = (params.link) ? params.link : null;
        send["imgUrl"] = (params.imgUrl) ? params.imgUrl : null;

        let systemType = Common.systemType();
        let platform = Common.platformType();
        if (systemType == "windows" || systemType == "linux" || systemType == "mac") {
            //PC平台
            //QQ空间
            var shareqqzonestring:string='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+params.title+'&url='+params.link+'&pics='+params.imgUrl;
            window.open(shareqqzonestring,'newwindow','height=400,width=400,top=100,left=100');

            // //疼讯微博
            // var shareqqstring:string='http://v.t.qq.com/share/share.php?title='+params.title+'&url='+params.link+'&pic='+params.imgUrl;
            // window.open(shareqqstring,'newwindow','height=400,width=400,top=100,left=100');

            // //新浪微博
            // var sharesinastring:string='http://v.t.sina.com.cn/share/share.php?title='+params.title+'&url='+params.link+'&pic='+params.imgUrl;
            // window.open(sharesinastring,'newwindow','height=400,width=400,top=100,left=100');
        }else{
            //移动端平台
            WeixinApi.ready((api:WeixinApi)=>{
                var info:WeixinShareInfo = new WeixinShareInfo();
                info.appId = modLogin.getBaseData("appid");
                // info.appId = "1112169032";
                info.title = params.title;
                info.desc = params.desc;
                info.link = params.link;
                info.imgUrl = params.imgUrl;
                egret.log("WeixinApi Ready", JSON.stringify(params));
                api.shareToFriend(info);
                api.shareToTimeline(info);
                api.showOptionMenu()
            });
        }
    }
}