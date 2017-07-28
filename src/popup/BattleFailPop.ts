/**
 * 战斗暂停弹窗
 */
class BattleFailPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/battleFailPopSkin.exml";
    }

    protected childrenCreated():void {
        
    }

    private onComplete():void {
        this.btn_giveup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_reavival.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        // this.parent.removeChild(this);
        switch (event.currentTarget) {
            case this.btn_reavival:
                this.parent.removeChild(this);
                if (this.typeBtn2 == 0) {
                    modBattle.recycleHero();
                    egret.setTimeout(()=>{
                        SceneManager.battleScene.effectLayer.removeChildren();
                        SceneManager.battleScene.createHero();
                        TimerManager.getInstance().startTimer();
                        SceneManager.battleScene.battleSceneCom.onRevive();
                    }, this, 200);
                }else{
                    Animations.sceneTransition(()=>{
                        SceneManager.battleScene.cleanChildren();
                        GameData.curStage = 1;
                        DragonBonesFactory.getInstance().removeTimer();
                        GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.mainScene);
                    });
                }
            break;
            default:
                if (this.typeBtn1 == 0) {
                    this.toRewardWindow();
                }else{
                    Common.log("分享");
                }
            break;
        }
    }

    /**切换为结算界面 */
    private toRewardWindow():void {
        Animations.popupIn(this.group_fail, 300, ()=>{
            this.img_bg.source = "battle_0006_png";
            this.group_killCount1.visible = false;
            this.group_killProg.visible = false;
            this.group_killCount2.visible = true;
            this.group_item.visible = true;
            this.btn_giveup.label = "分享";
            this.btn_reavival.label = "返回主界面";
            this.typeBtn1 = 1;
            this.typeBtn2 = 1;
            Animations.popupOut(this.group_fail, 300);
        })
    }

    /**设置弹出的内容显示 */
    public Show():void {
        super.Show();
        Common.log("显示阵亡界面")
        //阵亡界面内容
        this.img_bg.source = "battle_0008_png";
        let maxCount:number = 0;
        let killCount:number = modBattle.getSumkill();
        this.lab_killCount1.text = killCount.toString();
        this.lab_curKill.text = killCount.toString();
        if (killCount <= 1000) maxCount = 1000;
        else{
            maxCount = Math.ceil(killCount/1000) * 1000;
        }
        this.lab_maxKill.text = maxCount.toString();
        this.prog_killCount.scaleX = killCount/maxCount;
        this.img_knife.x = 112 + 450 * (killCount/maxCount);
        this.btn_giveup.label = "结束";
        this.btn_reavival.label = "复活";

        //结算界面内容
        this.lab_killCount2.text = killCount.toString();
        this.lab_exp.text = modBattle.getExp().toString();
        this.lab_soul.text = modBattle.getSoul().toString();
    }

    public Init():void {

    }
    public Reset():void{
        this.group_killCount1.visible = true;
        this.group_killProg.visible = true;
        this.group_killCount2.visible = false;
        this.group_item.visible = false;
        this.typeBtn1 = 0;
        this.typeBtn2 = 0;
    }
    /**离开 */
    private btn_giveup:eui.Button;
    /**继续 */
    private btn_reavival:eui.Button;
    /**按钮1类型 0:结束 1:分享 */
    private typeBtn1:number;
    /**按钮2类型 0:复活 1:返回主界面 */
    private typeBtn2:number;

    /***********************组***************************/
    /**挑战失败组 */
    private group_fail:eui.Group;
    /**击杀显示1 */
    private group_killCount1:eui.Group;
    /**击杀进度 */
    private group_killProg:eui.Group;
    /**击杀显示2 */
    private group_killCount2:eui.Group;
    /**获得奖励 */
    private group_item:eui.Group;

    /*******************图片和文字************************/
    /**背景 */
    private img_bg:eui.Image;
    /**击杀数值 */
    private lab_killCount1:eui.Label;
    /**击杀进度条 */
    private prog_killCount:eui.Image;
    /**进度图标 */
    private img_knife:eui.Image;
    /**当前击杀 */
    private lab_curKill:eui.Label;
    /**最大击杀 */
    private lab_maxKill:eui.Label;
    /**击杀数值2 */
    private lab_killCount2:eui.Label;
    /**获得的经验 */
    private lab_exp:eui.Label;
    /**获得的魂石 */
    private lab_soul:eui.Label;
    
}