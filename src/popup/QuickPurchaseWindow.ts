/**
 *  quick purchase godds
 * @author hong
 * @date   2017/7/28
 */

class QuickPurchaseWindow extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/QuickPurchaseDialogSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
    }

    public Show(goodsName:string = "exp"):void{
        super.Show();

        this.goods_list = [{type:2,id:0,count:10000,name:goodsName}];
        let name_list:any = {exp:"经验",soul:"魂石"};
        this.lab_content.text = `${name_list[goodsName]}*10000`;
        this.lab_title.text = `${name_list[goodsName]}不足是否购买${name_list[goodsName]}礼包?`;
        this.lab_topTitle.text = `${name_list[goodsName]}礼包`;

        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_purchase.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPurchase, this);
    }

    /** type 根据类型来判断是关闭还是更新并且关闭数据 默认是关闭 */
    public Close(type:number = 0):void{
        Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });

        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_purchase.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPurchase, this);
        this.dispatchEventWith(egret.Event.CLOSE, false, type);
    }

    private onTouchPurchase(event:egret.TouchEvent):void{
        if(UserDataInfo.GetInstance().IsHaveGoods("diamond", 100)){
            Common.DealReward(this.goods_list);
            this.Close(1);
        }
        else Animations.showTips("钻石不足，无法购买", 1, true);
    }

    /** button */
    private btn_close:eui.Button;
    private btn_purchase:eui.Button;
    
    /** label */
    private lab_content:eui.Label;
    private lab_title:eui.Label;
    private lab_topTitle:eui.Label;

    /** other data */
    private goods_list:any;
}