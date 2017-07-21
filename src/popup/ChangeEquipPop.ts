/**
 * 更换武器弹窗
 */
class ChangeEquipPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/changeEquipSkin.exml";
    }

    public Init():void{
        this.change_list = [];
        this.select_list = [];
        this.img_list = [];
        
        for(let i:number = 0; i < 2; i++){
            this.change_list[i] = 0;
            this.select_list[i] = 0;
        }

        this.img_selectBox = Utils.createBitmap("iconbg_0002_png");
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Reset():void{
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    public Close(){

        Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });
        
        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_change.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }


    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        
        switch (event.target) {
            case this.btn_change:
                this.dispatchEventWith(modEquip.EquipSource.CHANGEEQUIP, false, this.select_list);
            break;
        }
        this.Close();
    }

    /**设置弹出的内容显示 */
    public Show(id:number, typeId:number):void {
        super.Show();

       for(let i:number = 0; i < this.img_list.length; i++) this.img_list.pop();
       this.img_list = [];
       this.scrollGroup.removeChildren();

       let col, raw;
        let equipData:modEquip.EquipData = modEquip.EquipData.GetInstance();
        for (let i = 0; i < equipData.GetEquipNum(); i++) {
            this.img_list[i] = new eui.Image();
            this.img_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquip, this);
            let info:modEquip.EquipInfo = equipData.GetEquipFromIndex(i)
            this.img_list[i]["id"] = info.Id;
            this.img_list[i]["typeId"] = info.TypeID;
            this.img_list[i].source = `Sequip${25-info.Id}_png`;
            raw = Math.floor(i / 7);
            col = i % 7;
            Common.SetXY(this.img_list[i], 15 + col * 111, 4 + raw * 111)
            this.scrollGroup.addChild(this.img_list[i]);

            if(id == info.Id && info.TypeID == typeId){
                Common.SetXY(this.img_selectBox, this.img_list[i].x, this.img_list[i].y);
                this.select_list[0] = info.Id;
                this.select_list[1] = info.TypeID;
            }
        }
        this.scrollGroup.addChild(this.img_selectBox);

        if (equipData.GetEquipNum() >= 1) {
            if(id == 0){
                this.select_list[0] = this.img_list[0]["id"];
                this.select_list[1] = this.img_list[0]["typeId"];
                Common.SetXY(this.img_selectBox, 15, 4);
            } 
            this.img_selectBox.visible = true;
        }

        Animations.PopupBackOut(this, 350);
    }

    /**点击装备 */
    private onEquip(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        this.select_list[0] = target.id;
        this.select_list[1] = target.typeId;
        Common.SetXY(this.img_selectBox, target.x, target.y);
    }

    private img_list:Array<eui.Image>;

    private scrollGroup:eui.Group;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**购买按钮 */
    private btn_change:eui.Button;

    /*******************图片和文字************************/
    /**选中框 */
    private img_selectBox:egret.Bitmap;
    /**选中的图片索引 */
    private select_list:any;
    private change_list:any;
}