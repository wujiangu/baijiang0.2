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
                    //排名获得资源
                    let exp:number = UserDataInfo.GetInstance().GetBasicData("exp") + this.reward.exp;
                    let soul:number = UserDataInfo.GetInstance().GetBasicData("soul") + this.reward.soul;
                    let diamond:number = UserDataInfo.GetInstance().GetBasicData("diamond") + this.reward.diamond;
                    UserDataInfo.GetInstance().SetBasicData({exp:exp, soul:soul, diamond:diamond});
                    SceneManager.mainScene.show_label_text();
                    //这里获得装备
                    //this.reward.equip = {"id":0, "star":0},有装备是id为装备id, 没有装备是id为0, star为装备星级
                    //装备数据需要加入服务端

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
    public Show(params:any):void {
        super.Show();
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
            this.createReward(this.reward);

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

    }

    public Close():void{
        super.Close();
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
}