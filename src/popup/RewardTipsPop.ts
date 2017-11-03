/**
 * 奖励弹窗
 */
class RewardTipsPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/rewardTipsPopSkin.exml";
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
            case this.btn_cancel:
                this.Close();
            break;
            default:
                
            break;
        }
    }

    /**设置弹出的内容显示 */
    public Show(value:number, type:string = null, id:number = null):void {
        super.Show();
        if (!type) this.group_other.visible = false;
        else if (type == "equip") this.img_other.source = "equip_res.Sequip1";
        else if (type == "hero") this.img_other.source = "battle_res.img_guanyu1";
        this.text_diamond.text = "X" + value.toString();
        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_cancel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    public Close():void{
        super.Close();
        this.btn_cancel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    /**离开 */
    private btn_cancel:eui.Button;

    private group_diamond:eui.Group;
    private group_other:eui.Group;
    /*******************图片和文字************************/
    private text_diamond:eui.Label;
    private img_other:eui.Image;
}