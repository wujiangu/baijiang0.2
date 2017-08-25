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
            egret.log("平台---->", platform);
            window["show"]();
            if (platform == "micromessenger") {
                send["success"] = success;
                send["cancel"] = cancel;
                send["fail"] = fail
                window["sdw"].onSetShareOperate(send)
            }
            else if(platform == "qq") {
                seajs.use('http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js', function(setShareInfo) {
                    setShareInfo({
                        title:params.title,
                        summary:params.desc,
                        pic:params.imgUrl,
                        url:window.location.host
                    });
                });
            }
        }
    }

    /**
     * 分享成功
     */
    function success():void {
        egret.log("分享成功");
    }

    /**
     * 分享取消
     */
    function cancel():void {
        egret.log("分享取消");
    }

    /**
     * 分享失败
     */
    function fail():void {
        egret.log("分享失败");
    }
}