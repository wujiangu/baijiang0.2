/**
 * 离线收益弹窗
 */
class HangupPop extends PopupWindow {
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/hangupPopSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.btn_sure.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchBtn, this);
    }

    public Init():void{
    }

    public Show():void{
        super.Show();
        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        
    }

    public Close():void{
         Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });
    }

    private onTouchBtn(event:egret.TouchEvent):void{
        let target = event.currentTarget;
        this.Close();
        switch (target) {
            case this.btn_sure:
            break;
            default:
            break;
        }
    }

    /** button */
    private btn_back:eui.Button;
    private btn_sure:eui.Button;
    
    /** other */
    private lab_offline:eui.Label;
    private lab_soul:eui.Label;
    private lab_exp:eui.Label;
}