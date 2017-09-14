/**
 * 战斗胜利或PVP结束弹窗
 */
class BattleWinPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/battleWinPopSkin.exml";
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        switch (event.currentTarget) {
            case this.btn_continue:
                if (this.popType == 1) {

                }else{
                    this.Close();
                }
            break;
            default:
                modShare.startShare("爽快淋漓！快来和我一起驰骋三国！");
            break;
        }
    }

    /**设置弹出的内容显示 */
    public Show(params:any):void {
        super.Show();

        this.img_diamond.visible = Common.GetShareDiamond() == -1 ? false : true;
        // let continueObj:any = this.btn_continue.getChildAt(1);
        if (SceneManager.curScene == SceneManager.battleScene){
            this.popType = 1;
            this.winGroup.visible = true;
            this.pvpFinishGroup.visible = false;
            this.btn_continue.label = "下一关";
        }else{
            this.popType = 2;
            this.winGroup.visible = false;
            this.pvpFinishGroup.visible = true;
            this.btn_continue.label = "继续";
            this.lab_hurt.text = params.value.toString();
            this.lab_rank.text = params.rank.toString();
            this.reward = modPVP.getCurReward(params.rank);
            egret.log("当前获得的奖励------>", JSON.stringify(this.reward));
            // this.createReward(this.reward);

        }
        Animations.PopupBackOut(this, 500);
    }

    /**
     *  创建奖励组
     */
    private createReward(data:any):void {
        let posCount:number = 0;
        let reward:Array<string> = ["soul", "exp", "diamond"];
        if (data.equip && data.equip.id > 0) {
            posCount ++;
            let id:number = 25 - data.equip.id;
            let Image_equip:egret.Bitmap = Utils.createBitmap("equip_res.Sequip"+id);
            Image_equip.x = 160;
            Image_equip.y = 30;
            this.resultGroup.addChild(Image_equip);
        }
        for (let i = 0; i < reward.length; i++) {
            let group:egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
            group.x = 160 + (posCount + i) * 100;
            group.y = 30;
            this.resultGroup.addChild(group);
            let image:egret.Bitmap = Utils.createBitmap("common_res.basic_"+reward[i]);
            group.addChild(image);
            let value:number = data[reward[i]];
            let str:string = value.toString();
            if (value >= 10000){
                value /= 10000;
                str = value.toString() + "W";
            }
            Common.log("sdfdsfd----->", str);
            let text = Common.CreateText(str, 20, Common.TextColors.orangeYellow, true, "Microsoft YaHei","right");
            group.addChild(text);
            Common.SetXY(text, 20, 73);
            text.width = 71;
        }
    }

    public Reset():void{
        this.btn_share.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_continue.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    public Close():void{
        super.Close();

        this.btn_share.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_continue.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);

        Animations.sceneTransition(()=>{
            SceneManager.curScene.cleanChildren();
            DragonBonesFactory.getInstance().removeTimer();
            GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.mainScene);
        });
    }

    private reward:any;
    /**分享 */
    private btn_share:eui.Button;
    /**继续 */
    private btn_continue:eui.Button;

    /**战斗胜利弹窗 */
    private winGroup:eui.Group;
    /**PVP结束弹窗 */
    private pvpFinishGroup:eui.Group;
    /**PVP结果 */
    private resultGroup:eui.Group;
    /**popup类型 */
    private popType:number;
    /*******************图片和文字************************/
    /**当前伤害 */
    private lab_hurt:eui.Label;
    /**当前排名 */
    private lab_rank:eui.Label;

    /** image */
    private img_diamond:eui.Image;
}