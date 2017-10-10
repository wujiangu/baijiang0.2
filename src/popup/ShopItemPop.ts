/**
 * 购买商品的弹窗
 */
class ShopItemPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/shopItemPopSkin.exml";
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{

    }

     /**设置弹出的内容显示 */
    public Show(content:any, type:string):void {
        super.Show();

        this.content = content;
        this.img_item.source = content.imgItem;
        this.lab_itemName.text = content.name;
        this.lab_detail.text = content.detail;
    }

    public Reset():void{
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
    }

    public Close():void{

        super.Close(1);
        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
    }

    /**内容 */
    private content:any;
    /*******************按钮********************/
    private btn_back:eui.Button;
    /******************************************/

    /**商品的图片 */
    private img_item:eui.Image;
    /**商品的名字 */
    private lab_itemName:eui.Label;
    /**商品的内容说明 */
    private lab_detail:eui.Label;
}