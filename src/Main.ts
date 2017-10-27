//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
class Main extends eui.UILayer {
    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;
    protected createChildren(): void {
        super.createChildren();
        egret.Bitmap.defaultSmoothing = false;
        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter",assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter",new ThemeAdapter());
        //游戏自定义容器添加到舞台上
        this.addChild(GameLayerManager.gameLayer());
        // initialize the Resource loading library
        //初始化Resource资源加载库
        // RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // RES.loadConfig("resource/default.res.json", "resource/");
        ResLoadManager.GetInstance().addConfig("resource/default.res.json?v="+window["VERSION"], "resource/");
        ResLoadManager.GetInstance().addConfig("resource/battle.res.json?v="+window["VERSION"], "resource/");
        ResLoadManager.GetInstance().startLoadConfig(this.onConfigComplete, this);

        //获取舞台的宽度和高度
        Common.mainStage = this;
        Common.SCREEN_W = this.stage.stageWidth;
        Common.SCREEN_H = this.stage.stageHeight;
        // StageManager.stageResizeInitData();
        // this.stage.setContentSize(StageManager.contentScaleFullWidth, StageManager.contentScaleFullHeight);
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/default.thm.json?v="+window["VERSION"], this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);
        
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        // VersionController.modifiedVersion();
        RES.loadGroup("loading", 1);
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        switch (event.groupName) {
            case "preload":
                // 移除舞台中的loading界面
                this.isResourceLoadEnd = true;
                GameLayerManager.gameLayer().loadLayer.removeChild(this.loadingView);
                // 清除缓存中存在的loading界面资源
                // RES.destroyRes("loading");
                Common.createGlobleMask();
                this.createScene();
                break;
            case "loading":
                //设置加载进度界面
                this.loadingView = new LoadingUI();
                GameLayerManager.gameLayer().loadLayer.addChild(this.loadingView);
                // ResAsynLoadManager.LoadMainScene();
                // ResAsynLoadManager.LoadReadyScene();
                // ResAsynLoadManager.LoadCurHeroSource(GameData.curHero);
                break;
            case "battleBack":
                ConfigManager.InitBattleConfig("battleBack");
                break;
            default:
                ResLoadManager.GetInstance().Listener();
            break;
        }
    }

    private createScene(){
        if(this.isThemeLoadEnd && this.isResourceLoadEnd){
            //加载配置文件
            ConfigManager.loadConfig();
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {

        // this.removeChild(this.bg);
        // this.removeChild(this.logo);
        // RES.destroyRes("loading");
        modLogin.init();
        modLogin.reqLogin(this._onLogin);
        modShare.activeShare("百将斩", false, true);
        // this.test();
        // this.testBattle();
        // this.addDesktop();
    }

    /**
     * 登陆成功
     */
    private _onLogin() {
        SceneManager.enterGameScene = new EnterGameScene();
        GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.enterGameScene);
        ResAsynLoadManager.LoadMainScene();
        // egret.log("玩家信息---->", JSON.stringify(UserDataInfo.GetInstance().getUserInfo()));
        GameData.isDebug = false;
        modLogin.sendHeartBeat();
    }

    private test():void {
        let data:any = {};
        data.title = "百将斩";
        data.desc = "游戏";
        data.link = "http://192.168.188.116:3000/index.html";
        data.imgUrl = "http://192.168.188.116:3000/resource/assets/loading/loading2.png";
        modShare.share(data, true);
    }

    /**
     * 添加桌面测试(只适用移动端)
     */
    private addDesktop():void {
        let btn:egret.Bitmap = Utils.createBitmap("button_res.btn_help");
        btn.x = 550;
        btn.y = 300;
        btn.touchEnabled = true;
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            egret.log("添加桌面");
            window["sdw"].canAddDesktop = true;
            window["sdw"].addDesktop();
        }, this);
        this.addChild(btn);
    }

    /**
     * 战斗测试
     */
    private testBattle():void {
        RES.createGroup("battleGroup", ["battleCommon", "battlePVP"],true);
        
        ResLoadManager.GetInstance().LoadGroup("mainscene", ()=>{
            ResLoadManager.GetInstance().LoadGroup("ready", ()=>{
                
                ResLoadManager.GetInstance().LoadGroup("battleStage", ()=>{
                    ResLoadManager.GetInstance().LoadGroup("battleGroup", ()=>{
                        // RES.loadGroup("battleBack");
                        // SceneManager.battleScene = new BattleScene();
                        // SceneManager.curScene = SceneManager.battleScene;
                        // GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.battleScene);
                        SceneManager.pvpScene = new PVPScene();
                        SceneManager.curScene = SceneManager.pvpScene;
                        this.addChild(SceneManager.pvpScene);
                    })
                })
            })
        })
    }

    /**
     * 竞技场模式
     */
    private testPVP():void {

    }

    private bg:egret.Bitmap;
    private logo:egret.Bitmap;
}
