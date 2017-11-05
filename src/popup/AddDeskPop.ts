/**
 * 战斗暂停弹窗
 */
class AddDeskPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/addDeskPopSkin.exml";
    }

    protected childrenCreated():void {
        
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{

    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        this.parent.removeChild(this);
        switch (event.currentTarget) {
            case this.btn_get:
                if (this._status == 0) {
                    window["sdw"].addDesktop();
                }
                else if (this._status == 1) {
                    this._status = 2;
                    this.btn_get.label = "已领取";
                    //武器
                    let equipId:number = modEquip.getRandEquipId();
                    let info:modEquip.EquipInfo = new modEquip.EquipInfo(17,0,4,1,equipId);
                    modEquip.EquipData.GetInstance().Add(info);

                    let source_exp = UserDataInfo.GetInstance().GetBasicData("exp") + 100000;
                    let source_soul = UserDataInfo.GetInstance().GetBasicData("soul") + 100000;
                    UserDataInfo.GetInstance().SetBasicData({exp:source_exp, soul:source_soul, stage:2});
                    GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA, false, 1);
                    Animations.showTips("领取奖励成功", 1);
                }else{
                    Animations.showTips("你已领取完奖励，不能重复领取", 1, true);
                }
            break;
            default:
                
            break;
        }
    }

    /**设置弹出的内容显示 */
    public Show():void {
        super.Show();
        // roleSex代表加入桌面状态
        this._status = UserDataInfo.GetInstance().GetBasicData("stage");
        if (this._status == 0) this.btn_get.label = "前往";
        else if (this._status == 1) this.btn_get.label = "领取";
        else this.btn_get.label = "已领取";
        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    public Close():void{
        super.Close();
        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    /**离开 */
    private btn_back:eui.Button;
    /**继续 */
    private btn_get:eui.Button;
    /**领取状态 */
    private _status:number;
    /*******************图片和文字************************/
    
}