/**
 * 分享模块
 */
module modShare {

    export var isFirstShare:boolean = false;     //判断是否是首次分享

    /**
     * 主动分享
     * @param
     */
    export function activeShare(desc:string, award:boolean = true, isInit:boolean = false):void {
        isReward = award;
	    setShareConfig(desc, isInit);
    }

    /**
     * 开始分享
     * @param
     */
    export function startShare(desc:string, award:boolean = true, isInit:boolean = false):void {
        isReward = award;
        ResLoadManager.GetInstance().LoadGroup("share",()=>{
	        setShareConfig(desc, isInit);
        });
    }

    /**
     * 配置分享
     */
    function setShareConfig(desc:string, isInit:boolean = false):void {
        let data:any = {};
        data.title = "百将斩";
        data.desc = desc;
        data.link = "http://www.shandw.com/m/game/?gid=1112169032&channel=10000";
        let index:number = MathUtils.getRandom(1, 3);
        data.imgUrl = "http://"+location.host+"/resource/assets/bg/"+"share"+index+".png";
        share(data, isInit);
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
    export function share(params:any, isInit:boolean = false) {
        let send:any = {};
        send["title"] = params.title;
        send["desc"] = params.desc;
        send["link"] = (params.link) ? params.link : null;
        send["imgUrl"] = (params.imgUrl) ? params.imgUrl : null;

        let systemType = Common.systemType();
        let platform = Common.platformType();
        if (systemType == "windows" || systemType == "linux" || systemType == "mac") {
            //PC平台
            if (isInit) return;
            // QQ空间
            let link = encodeURIComponent(params.link);
            var shareqqzonestring:string='http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?title='+params.title+'&url='+link+'&pics='+params.imgUrl;
            window.open(shareqqzonestring,'newwindow','height=400,width=400,top=100,left=100');
            // //疼讯微博
            // var shareqqstring:string='http://v.t.qq.com/share/share.php?title='+params.title+'&url='+params.link+'&pic='+params.imgUrl;
            // window.open(shareqqstring,'newwindow','height=400,width=400,top=100,left=100');

            // //新浪微博
            // var sharesinastring:string='http://v.t.sina.com.cn/share/share.php?title='+params.title+'&url='+params.link+'&pic='+params.imgUrl;
            // window.open(sharesinastring,'newwindow','height=400,width=400,top=100,left=100');
        }else{
            //移动端平台
            // egret.log("平台---->", platform, location.hostname, location.host);
            if (!isInit) window["show"]();
            if (platform == "micromessenger" || platform == "other") {
                send["success"] = success;
                send["cancel"] = cancel;
                send["fail"] = fail
                window["sdw"].onSetShareOperate(send);
            }
            else if(platform == "qq") {
                Animations.showTips("暂不支持手机QQ内置浏览器分享，请使用微信或闪电玩APP", 1, true);
                if (!isInit) return;
                // var oMeta = document.createElement('meta');
                // oMeta.name = 'description';
                // oMeta.content = '这里是自定义分享的描述';
                // document.getElementsByTagName('head')[0].appendChild(oMeta);
                // var oMeta1 = document.createElement('meta');
                // oMeta1.setAttribute('itemprop', 'image');
                // oMeta1.content = 'http://ggsporestudio.com/resource/assets/bg/share1.png';
                // document.getElementsByTagName('head')[0].appendChild(oMeta1);
                // seajs.use('http://qzonestyle.gtimg.cn/qzone/qzact/common/share/share.js', function(setShareInfo) {
                //     setShareInfo({
                //         title:          "dsfdf",
                //         summary:        "wqfrew",
                //         pic:            "xxxxx",
                //         url:            window.location.href
                //     });
                // });
            }
        }
    }

    /**
     * 分享成功
     */
   function success():void {
        egret.log("分享成功");
		if (!isReward) return;
        let shareNum:number = Common.GetShareDiamond();
        if(shareNum != -1){
            UserDataInfo.GetInstance().DealAllData("diamond",shareNum,ModBasic.GET,()=>{
                let share_num:number = modShare.isFirstShare ? UserDataInfo.GetInstance().GetBasicData("shareNum") : UserDataInfo.GetInstance().GetBasicData("shareNum") + 1;
                UserDataInfo.GetInstance().SetBasicData({shareNum:share_num});
                modShare.isFirstShare = false;
                isReward = false;
            })
        }

        WindowManager.GetInstance().CloseLastWindow();
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

    export function GetShareNum():void{
        HttpRequest.getInstance().send("GET","share",{},(data)=>{
            isFirstShare = data.shareNum == 0 ? true : false;
        },this);
    }

    /**主动分享，没有奖励 */
    var isReward:boolean;
}