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
        this.goods_list = [];
    }

    public Show(list:any):void{
        super.Show();

        let name_list:any = [];
        let data_list:any = [];
        for(let i:number = 0; i < list.length; i++){
            this.goods_list[i] = {type:1,data:list[i]};
            let tempData = TcManager.GetInstance().GetTcEquipData(list[i]);
            if(i == list.length - 1) name_list[i] = tempData.name + "x1"
            else name_list[i] = tempData.name + "x1,";
            data_list[i] = ({text:name_list[i], style:{"textColor":Common.GetEquipColorFromGrade(tempData.grade)}})
        }
        this.lab_content.textFlow = <Array<egret.ITextElement>>data_list;

        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_purchase.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPurchase, this);
    }

    public Close():void{
        Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });

        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_purchase.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchPurchase, this);
        this.dispatchEventWith(egret.Event.CLOSE);
    }

    private onTouchPurchase(event:egret.TouchEvent):void{
        if(UserDataInfo.GetInstance().IsHaveGoods("diamond", 60)){
            Animations.ShowGoodsPopEffect(this.goods_list);
            Common.DealReward(this.goods_list);
            this.Close();
        }
        else Animations.showTips("钻石不足，无法购买", 1, true);
    }

    /** button */
    private btn_close:eui.Button;
    private btn_purchase:eui.Button;
    
    /** label */
    private lab_content:eui.Label;

    /** other data */
    private goods_list:any;
}