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
        this.lab_enter.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEnterGame, this);
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
    }

    /**
     * 进入游戏
     */
    private onEnterGame():void {
        egret.Tween.removeTweens(this.lab_enter);
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