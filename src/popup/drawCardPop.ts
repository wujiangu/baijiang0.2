/**
 * 抽卡弹窗
 */
class DrawCardPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/drawCardPopSkin.exml";
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init(){
        this.ids = new Array();
    }

    /**
     * 按钮监听
     */
    private onButtonHandler(event:egret.TouchEvent):void {
        modShop.putPackage(this.ids);
        this.Close();
    }

    /**
     * 显示
     */
    public Show(infos:Array<any>, type:string):void {
        super.Show();

        this.ids = [];
        this.ids = infos;
        this.groupEquip.removeChildren();
        if (type == "ten" && infos.length) {
            //调整弹窗的背景和位置
            this.img_bg.source = "shop_popupBg3_png";
            Utils.setControlPosition(this.img_bg, 70, 46);
            Utils.setControlPosition(this.lab_title, 488, 83);
            Utils.setControlPosition(this.btn_get, 424, 483);
            Utils.setControlPosition(this.btn_back, 985, 73);
            for (let i = 0; i < infos.length; i++) {
                let img_equip = Utils.createBitmap(`equip_res.Sequip${25-infos[i].id}`);
                this.groupEquip.addChild(img_equip);
                img_equip.x = 100 * i;
                if (i >= 5) {
                    img_equip.y = 100;
                    img_equip.x = 100 * (i - 5);
                }
            }
        }else{
            this.img_bg.source = "popmenu_0001_png";
            Utils.setControlPosition(this.img_bg, 254, 101);
            Utils.setControlPosition(this.lab_title, 488, 138);
            Utils.setControlPosition(this.btn_get, 424, 399);
            Utils.setControlPosition(this.btn_back, 800, 128);
            let img_equip = Utils.createBitmap(`equip_res.Sequip${25-infos[0].id}`);
            this.groupEquip.addChild(img_equip);
            Utils.setControlPosition(img_equip, 204, 44);
        }
    }

    public Close():void{

        Animations.PopupBackIn(this, 350, ()=>{
            super.Close();
        })

        this.btn_get.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
    }

    public Reset():void{
        this.btn_get.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
    }


    private ids:Array<number>;
    /**获取按钮 */
    private btn_get:eui.Button;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**装备的组 */
    private groupEquip:eui.Group;
    private img_bg:eui.Image;
    private lab_title:eui.Image;
}