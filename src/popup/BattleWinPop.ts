/**
 * 战斗胜利或PVP结束弹窗
 */
class BattleWinPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/battleWinPopSkin.exml";
    }

    protected childrenCreated():void {
        
    }

    private onComplete():void {
        this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    public Init():void{

    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        switch (event.currentTarget) {
            case this.btn_continue:
                if (this.popType == 1) {

                }else{
                    this.parent.removeChildren();
                    Animations.sceneTransition(()=>{
                        SceneManager.curScene.cleanChildren();
                        DragonBonesFactory.getInstance().removeTimer();
                        GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.mainScene);
                    });
                }
            break;
            default:

            break;
        }
    }

    /**设置弹出的内容显示 */
    public Show():void {
        super.Show();
        let continueObj:any = this.btn_continue.getChildAt(1);
        if (SceneManager.curScene == SceneManager.battleScene){
            this.popType = 1;
            this.winGroup.visible = true;
            this.pvpFinishGroup.visible = false;
            continueObj.text = "下一关";
        }else{
            this.popType = 2;
            this.winGroup.visible = false;
            this.pvpFinishGroup.visible = true;
            continueObj.text = "继续";
        }
    }

    public Reset():void{

    }

    public Close():void{
        super.Close();
    }

    /**分享 */
    private btn_share:eui.Button;
    /**继续 */
    private btn_continue:eui.Button;

    /**战斗胜利弹窗 */
    private winGroup:eui.Group;
    /**PVP结束弹窗 */
    private pvpFinishGroup:eui.Group;
    /**popup类型 */
    private popType:number;
    /*******************图片和文字************************/
}