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
        this.select_list = [];
        this.equip_object_list = new Array();
        this.attr_list = new Array();
        this.special_attr_list = new Array();
        this.star_list = new Array();
        
        for(let i:number = 0; i < 6; i++){
            if(i < 2) this.select_list[i] = 0;
            this.special_attr_list[i] = Common.CreateText("",20,0xff00ff,true,"Microsoft YaHei");
            this.star_list[i] = new egret.Bitmap(RES.getRes("equip_res.star_00"));
            
            this.addChild(this.star_list[i]);
            this.addChild(this.special_attr_list[i]);
            
            Common.SetXY(this.star_list[i], this.lab_lv.x + this.star_list[i].width* i, this.lab_lv.y + this.lab_lv.height);
            Common.SetXY(this.special_attr_list[i], this.lab_lv.x + 178, this.star_list[0].y + this.star_list[0].height + 5 + i * 30);

            if(i < 4){
                this.attr_list[i] = Common.CreateText("",20,0xffffff,true,"Microsoft YaHei");
                this.addChild(this.attr_list[i]);
                Common.SetXY(this.attr_list[i], this.lab_lv.x, this.star_list[0].y + this.star_list[0].height + 5 + i * 30);
            } 
        }

        this.img_selectBox = Utils.createBitmap("battle_res.iconbg_0002");
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Reset():void{
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_change.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
         for(let i:number = 0; i < this.equip_object_list.length; i++){
            this.equip_object_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquip, this);
        }
    }

    public Close(){

        Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });
        
        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_change.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        for(let i:number = 0; i < this.equip_object_list.length; i++){
            this.equip_object_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquip, this);
        }
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
    public Show(info:modEquip.EquipInfo):void {
       super.Show();

       let id:number = info == null ? 0 : info.Id;
       let typeId:number = info == null ? 0 : info.TypeID;

       this.scrollGroup.removeChildren();
       let col, raw;
       let equip_list = modEquip.EquipData.GetInstance().GetEquipList();

        for (let i = 0; i < equip_list.length; i++) {
            if(this.equip_object_list.length <= i){
                this.equip_object_list[i] = new EquipObject();
                this.equip_object_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onEquip, this);
            }

            this.equip_object_list[i].ChangeEquipSource(equip_list[i]);
            this.scrollGroup.addChild(this.equip_object_list[i]);

            raw = Math.floor(i / 5);
            col = i % 5;
            Common.SetXY(this.equip_object_list[i], col * 105, 4 + raw * 105)

            if(id == this.equip_object_list[i].GetId() && this.equip_object_list[i].GetTypeId() == typeId){
                Common.SetXY(this.img_selectBox, this.equip_object_list[i].x, this.equip_object_list[i].y);
                this.select_list[0] = id;
                this.select_list[1] = typeId;
            }
        }

        this.scrollGroup.addChild(this.img_selectBox);

        if(id == 0){
            this.select_list[0] = this.equip_object_list[0].GetId();
            this.select_list[1] = this.equip_object_list[0].GetTypeId();
            Common.SetXY(this.img_selectBox, this.equip_object_list[0].x, this.equip_object_list[0].y);
        } 

        this.showClickEquipInfo();
        Animations.PopupBackOut(this, 350);
    }

    /** show click equip info */
    private showClickEquipInfo():void{
        let info:modEquip.EquipInfo = modEquip.EquipData.GetInstance().GetEquipFromId(this.select_list[0], this.select_list[1]);
        this.lab_lv.text = "等级："+ info.Lv + "/" + modEquip.EquipSource.EQUIPLV;
        this.lab_name.text = TcManager.GetInstance().GetTcEquipData(this.select_list[0]).name
        this.lab_name.textColor = modEquip.GetEquipColorFromQuality(info.Quality - 1).color;
        this.img_weapon.source = `equip_res.Sequip${25-this.select_list[0]}`;

        let attr_name_list:any = [" 生命", " 护甲", " 攻击", " 暴击"];
        for(let i:number = 0; i < 4; i++){
            this.attr_list[i].text = "+" + Math.ceil(info.GetEquipAttr()[i]) + attr_name_list[i]
        }

        let special_list:any = info.GetAttrType();
        for(let i:number = 0; i < 6; i++){
            this.special_attr_list[i].text = special_list.length > i ? modEquip.GetAttrInfo(special_list[i].Type, special_list[i].Value) : "";
            this.special_attr_list[i].textColor = special_list.length > i ? modEquip.GetEquipColorFromQuality(special_list[i].Quality).color : 0xff00ff;
            this.star_list[i].texture = RES.getRes(special_list.length > i ? modEquip.GetEquipColorFromQuality(special_list[i].Quality).img : "equip_res.star_00");
            this.star_list[i].visible = info.Quality + 1 > i ? true : false;
        }
    }

    /**点击装备 */
    private onEquip(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        this.select_list[0] = target.id;
        this.select_list[1] = target.typeId;
        Common.SetXY(this.img_selectBox, target.x, target.y);
        this.showClickEquipInfo();
    }

    private equip_object_list:Array<EquipObject>;

    private scrollGroup:eui.Group;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**购买按钮 */
    private btn_change:eui.Button;

    /*******************图片和文字************************/
    /**选中框 */
    private img_selectBox:egret.Bitmap;
    private img_weapon:eui.Image;

    /** label */
    private lab_lv:eui.Label;
    private lab_name:eui.Label;
    private attr_list:Array<egret.TextField>;
    private special_attr_list:Array<egret.TextField>;

    /**选中的图片索引 */
    private select_list:any;
    private star_list:Array<egret.Bitmap>;
}