/** 显示确认或者取消的按钮 
 * @author hong
 * @date 2017/9/22
*/

class SDDialog extends PopupWindow
{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/SDDialogSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.bg_mask = Common.CreateShape(377, 164, 382, 544);
        this.addChild(this.bg_mask);
        this.img_bg.mask = this.bg_mask;
        this.bg_mask.y = this.bg_mask.y - 220;
    }

   public Show(strData:any,callback:Function = null):void{
       super.Show();
       
       this.lab_content.textFlow = <Array<egret.TextField>>strData;
       this.listener = callback;
       Animations.PopupBackOut(this, 350);
   }

   public Reset():void{
        this.onEventManager(1);
   }

    public Close():void{
        super.Close(1);
        this.onEventManager();
    }

    private onEventManager(type:number = 0):void{
        let btn_list:any = [this.btn_close, this.btn_ok, this.btn_cancel];
        Common.ListenerAndRemoveEvent(btn_list, this.onTouchBtn, this, type);
        btn_list = [];
    }

    private onTouchBtn(event:egret.TouchEvent):void{
        if(event.target == this.btn_ok){
            if(this.listener) this.listener();
        }
        this.Close();
    }

    /** label */
    private lab_content:eui.Label;

    /** button */
    private btn_close:eui.Button;
    private btn_ok:eui.Button;
    private btn_cancel:eui.Button;

    /**image */
    private img_bg:eui.Image;
    
    /** function */
    private listener:Function;

    /**ohter */
    private bg_mask:egret.Shape;

}
