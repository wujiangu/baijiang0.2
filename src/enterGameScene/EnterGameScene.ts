/**
 * 进入游戏场景
 */
class EnterGameScene extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this)
        this.skinName = "resource/game_skins/enterGameSkin.exml"
    }

    private uiCompleteHandler():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this)
        this.lab_enter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickText, this);
        this.objFadeEffect();
    }

    private objFadeEffect():void{
        egret.Tween.get(this.lab_enter).to({alpha:0.2},1000,egret.Ease.circIn).call(()=>{
            egret.Tween.get(this.lab_enter).to({alpha:1},1000).call(this.objFadeEffect, this);
        },this)
    }

    protected createChildren(): void{
    }

    protected childrenCreated(): void{
        //加入敏感词
        let array = RES.getRes("sensitiveWords_json");
        SensitiveWordFilter.GetInstance().regSensitiveWords(array);
        this.initGameData();
        ResAsynLoadManager.LoadMainScene();
    }

    /**
     * 进入游戏
     */
    private onClickText():void {
        this.lab_enter.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickText, this);
        egret.Tween.removeTweens(this.lab_enter);
        this.removeChild(this.lab_enter);

        let mc:egret.MovieClip = Common.CreateMovieClip("loginSword");
        this.addChild(mc);
        mc.play(1);

        mc.width = mc.width * 2.5; mc.height = mc.height * 2.5;
        mc.scaleX = 2.5; mc.scaleY = 2.5;
        Common.SetXY(mc, this.width - mc.width >> 1, this.height - mc.height >> 1);

        mc.addEventListener(egret.Event.COMPLETE, this.onEnterGame, this);
    }

    private onEnterGame(event:egret.Event):void{
        event.target.removeEventListener(egret.Event.COMPLETE, this.onEnterGame, this);

        GameLayerManager.gameLayer().sceneLayer.removeChildren();
        SceneManager.mainScene = new MainScene();
        GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.mainScene);
        
    }

    private onConnectionState(status:boolean):void {
        if (status) {
            Common.log("链接服务器成功，正在登陆");
        }else{
            Common.log("faild");
        }
    }

    /**开始游戏按钮 */
    private lab_enter:eui.Label;
}