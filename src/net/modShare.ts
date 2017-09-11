/**
 * 分享模块
 */
module modShare {
    /**
     * 开始分享
     * @param
     */
    export function startShare(title:string):void {
        let data:any = {};
        data.title = title;
        data.desc = "百将斩";
        data.link = "http://www.shandw.com/m/game/?gid=1112169032&channel=10000";
        let index:number = MathUtils.getRandom(1, 3);
        data.imgUrl = "http://ggsporestudio.com/resource/assets/bg/"+"share"+index+".png";
        share(data);
    }

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
            // QQ空间
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
            // egret.log("平台---->", platform, "url-->", window.location.host, "encode---->", encodeURIComponent(window.location.host));
            window["show"]();
            if (platform == "micromessenger" || platform == "other") {
                send["success"] = success;
                send["cancel"] = cancel;
                send["fail"] = fail
                window["sdw"].onSetShareOperate(send)
            }
            else if(platform == "qq") {
                seajs.use('http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js', function(setShareInfo) {
                    setShareInfo({
                        title:          params.title,
                        summary:        params.desc,
                        pic:            params.imgUrl,
                        url:            params.link,
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
        HttpRequest.getInstance().award({diamond:Common.GetShareDiamond()}, ()=>{
            WindowManager.GetInstance().GetWindow("ShareWindow").Close();
            UserDataInfo.GetInstance().SetBasicData({shareNum:UserDataInfo.GetInstance().GetBasicData("shareNum") + 1});
            GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA, false, 1);
        });
        // UserDataInfo.GetInstance().SetBasicData({diamond:UserDataInfo.GetInstance().GetBasicData("diamond") + Common.GetShareDiamond(),shareNum:UserDataInfo.GetInstance().GetBasicData("shareNum") + 1});
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