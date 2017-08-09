/**
 * 武器库
 */
class EquipDialog extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/equipWindowSkin.exml";
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    /** 初始化数据 */
    public Init():void{

        this.equip_object_list = new Array();
        this.star_list   = new Array();
        this.reset_list = new Array();
        this.reset_btn_list = new Array();
        this.img_star_list = new Array();
        this.txt_attr_list = new Array();
        this.goods_index = 0;

        for(let i:number = 0; i < 6; i++){
            this.reset_list[i] = new eui.Group();                   
            this.resetScrollGroup.addChild(this.reset_list[i]);
            Common.SetXY(this.reset_list[i], this.resetGroup.width - 452 >> 1, 105 * i)

            this.reset_btn_list[i] = new eui.Image();               
            this.img_star_list[i] = new egret.Bitmap();
            this.txt_attr_list[i] = Common.CreateText("", 25, 0xffffff, true, "Microsoft YaHei");

            this.star_list[i] = new egret.Bitmap(RES.getRes("star_00_png"));
            this.equipGroup.addChild(this.star_list[i]);
            Common.SetXY(this.star_list[i], i * 32 + 10, 10);
        }

        this.imgClick = new egret.Bitmap( RES.getRes("equip_0009_png"));
        this.otherGroup = new eui.Group();
    }

    /** 创建物品信息 */
    public Show():void{
        super.Show();

        this.setGroupStatus(true, false);
        this.show_label_data();
        this.createEquips();

        let len = modEquip.EquipData.GetInstance().GetEquipNum();
        this.imgClick.visible = len > 0 ? true : false;

        if(len > 0){
            this.ShowGoodsInfo(0);
        } 
        else 
        {
            this.lab_lv.text = "";
            this.lab_name.text = "";
            this.img_weapon.source = "";
        } 
    }

    private eventType(type:number = 0):void{
        let obj_list:any = [this.btn_back, this.btn_change, this.btn_upgrade, this.btn_close,  this.img_weapon, this.img_detail, this.btn_help];
        Common.ListenerAndRemoveEvent(obj_list, this.onTouchBtn, this, type);
        obj_list = [];
    }

    public Reset():void{
       this.eventType(1);
    }

    public Close():void{
        for(let i:number = 0; i < this.eventLen; i++){
            this.equip_object_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGoods, this);
        }

        GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA);
        this.eventType();
    }

    /** 升级按钮的事件监听 */
    private upGradeGoodsInfo(event:egret.Event):void{
        if(event.data == -1){
            event.target.removeEventListener(modEquip.EquipSource.UPGRADE, this.upGradeGoodsInfo, this);
            return;
        }

        if(event.data == 1)
        {
            this.lab_lv.textFlow = <Array<egret.ITextElement>>[
                {text:"等级: " + this.equip_info.Lv + "/", style:{"textColor":0x727272}},
                {text:modEquip.EquipSource.EQUIPLV + "", style:{"textColor":0xf28b01}}
            ]
            if(this.equip_info.Lv >= modEquip.EquipSource.EQUIPLV){
                this.showResetGroup();
            } 
            this.equip_object_list[this.goods_index].UpEquipData(this.equip_info);
        }
        this.show_label_data();
    }

    private onTouchBtn(event:egret.TouchEvent):void{
        let target = event.target;

        switch(target){
            case this.btn_change:                                                           //点击洗脸按钮
                if(modEquip.EquipData.GetInstance().GetEquipNum() == 0) return;
                this.setGroupStatus(false, true);
            break;
            case this.btn_upgrade:                                                          //点击升级按钮
                if(modEquip.EquipData.GetInstance().GetEquipNum() == 0) return;
                let pop:PopupWindow = WindowManager.GetInstance().GetWindow("EquipUpWindow");
                pop.Show(this.equip_info);
                pop.addEventListener(modEquip.EquipSource.UPGRADE, this.upGradeGoodsInfo, this);
            break;
            case this.btn_help:
                WindowManager.GetInstance().GetWindow("HelpTipDialog").Show(1);
            break;
            case this.btn_back:                                                             //点击关闭界面
                this.Close();
            break;
            case this.btn_close:
                this.setGroupStatus(true, false);
            break;
            default:                                                                  
                if(this.equip_info == null) return;
                WindowManager.GetInstance().GetWindow("EquipInfoDialog").Show(this.equip_info);
            break;
        }
    }

    private show_label_data():void{
        this.lab_exp.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("exp"));
        this.lab_soul.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("soul"));
        this.lab_diamond.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
    }

    /** 显示物品信息 */
    public ShowGoodsInfo(index:number){
        this.goods_index = index;
        this.equip_info = modEquip.EquipData.GetInstance().GetEquipFromIndex(index);
        let equip_data = TcManager.GetInstance().GetTcEquipData(this.equip_info.Id);
        this.lab_name.text = equip_data.name;
        this.img_weapon.source = RES.getRes(`equip${25-this.equip_info.Id}_png`);
        this.lab_lv.textFlow = <Array<egret.ITextElement>>[
            {text:"等级: " + this.equip_info.Lv + "/", style:{"textColor":0x727272}},
            {text:"" + modEquip.EquipSource.EQUIPLV, style:{"textColor":0xf28b01}}
        ]

        Common.SetXY(this.imgClick, this.equip_object_list[index].x, this.equip_object_list[index].y);
        
        this.showEquipStar(this.equip_info.Star);
        this.showResetGroup();
    }

    /** 显示装备星级 */
    private showEquipStar(star:number):void{
        for(let i:number = 0; i < 6; i++){
            let strStar:string = star > i ? modEquip.GetEquipColorFromQuality(this.equip_info.GetPointTypeFromIndex(i).Quality).img : "star_00_png";
            this.star_list[i].texture = RES.getRes(strStar);
            this.star_list[i].visible = this.equip_info.Quality >= i ? true : false;
        }
    }

    /** 创建洗练界面 */
    private createResetView(group:eui.Group, index:number, isActive:boolean):void{
        let strType:string, strImg:string;
        let quality:number = -1;

        if(isActive){
            let attrType:modEquip.AttrType = this.equip_info.GetPointTypeFromIndex(index);
            strType = modEquip.GetAttrInfo(attrType.Type, attrType.Value);
            quality = attrType.Quality
        }
        else
        {
            strType = this.equip_info.Lv >= modEquip.EquipSource.EQUIPLV ? "可升星" : "等级没满，不能升星";
        }
        strImg = isActive ? "button_0016_png" : (this.equip_info.Lv >= modEquip.EquipSource.EQUIPLV ? "button_0017_png" : "btn_upgradeStar_png");
        
        let imgBg:egret.Bitmap = new egret.Bitmap(RES.getRes("equip_0005_png"));
        group.addChild(imgBg);

        let data = modEquip.GetEquipColorFromQuality(quality);
        this.img_star_list[index].texture = RES.getRes(data.img);
        Common.SetXY(this.img_star_list[index], this.img_star_list[index].width - 7, imgBg.height - this.img_star_list[index].height >> 1);
        group.addChild(this.img_star_list[index]);

        group.addChild(this.txt_attr_list[index]);
        this.txt_attr_list[index].text = strType;
        this.txt_attr_list[index].textColor = data.color;
        Common.SetXY(this.txt_attr_list[index], imgBg.width - this.txt_attr_list[index].width >> 1, imgBg.height - this.txt_attr_list[index].height >> 1);

        this.reset_btn_list[index].source = strImg;
        this.reset_btn_list[index].name = index + "";
        group.addChild(this.reset_btn_list[index]);
        Common.SetXY(this.reset_btn_list[index], imgBg.width - this.reset_btn_list[index].width - 20, imgBg.height - this.reset_btn_list[index].height >> 1);
        this.reset_btn_list[index].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onClickResetBtn, this);
    }

    /** 点击洗练或者升星的按钮事件 */
    private onClickResetBtn(event:egret.TouchEvent):void{
        let target = event.target;
        let index:number = parseInt(target.name);
        
        /** 如果当前的星级大于点击的索引 则显示洗练的窗口 否则显示升星的按钮 */
        if(this.equip_info.Star > index){

            let pop:PopupWindow = WindowManager.GetInstance().GetWindow("ResetEqiopAttrWindow");
            pop.Show(this.equip_info, index);
            pop.addEventListener(modEquip.EquipSource.RESETATTR, this.onResetEquipAttr, this);
        }
        else
        {
            /** 如果当前的等级大于或者等于需求的等级则可以升星 否则弹出一个提示 */
            if(this.equip_info.Lv >= modEquip.EquipSource.EQUIPLV){
                let pop:PopupWindow = WindowManager.GetInstance().GetWindow("EquipUpStarWindow");
                pop.Show(this.equip_info);
                pop.addEventListener(modEquip.EquipSource.UPSTAR, this.onUpStar, this);
            }
            else
            {
                Animations.showTips("等级不足，无法升星", 1, true);
            }
        }
    }

    /** 监听点击升星按钮后的事件 */
    private onUpStar(event:egret.Event):void{
        if(event.data == -1){
            event.target.removeEventListener(modEquip.EquipSource.UPSTAR, this.onUpStar, this);
            return;
        }

        if(event.data == 0){
            this.show_label_data();
            return;
        }

        if(event.data == 1){
            let starIndex = this.equip_info.Star - 1;
            this.lab_lv.textFlow = <Array<egret.ITextElement>>[{text:"等级: 1/", style:{"textColor":0x727272}},{text:"" + modEquip.EquipSource.EQUIPLV, style:{"textColor":0xf28b01}}]
            this.star_list[starIndex].texture = RES.getRes(modEquip.GetEquipColorFromQuality(this.equip_info.GetPointTypeFromIndex(starIndex).Quality).img);
            this.equip_info.UpdataBaseAttr();
            this.showResetGroup();
        }

        for(let i:number = 0; i < this.eventLen; i++){
            this.equip_object_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGoods, this);
        }

        this.createEquips();
        this.show_label_data();
    }

    /** 监听洗练的事件 */
    private onResetEquipAttr(event:egret.Event):void{
        if(event.data == -1){
            event.target.removeEventListener(modEquip.EquipSource.RESETATTR, this.onResetEquipAttr, this);
            return;
        }

        let index = event.data.index;
        let data = modEquip.GetEquipColorFromQuality(event.data.quality);

        this.txt_attr_list[index].text = modEquip.GetAttrInfo(event.data.type, event.data.value);
        this.txt_attr_list[index].textColor = data.color;
        this.img_star_list[index].texture = RES.getRes(data.img);
        this.star_list[index].texture = RES.getRes(data.img)
        this.equip_object_list[this.goods_index].UpEquipData(this.equip_info);
        this.equip_info.UpdataBaseAttr();
        this.show_label_data();
    }

     /** 点击物品 */
    private onTouchGoods(event:egret.TouchEvent):void{
        let target = event.target;
        let id = target.Index;
        if(this.goods_index == id) return;

        this.ShowGoodsInfo(id);
    }

    private createEquips():void{

        this.scrollGroup.removeChildren();
        let raw, col;
        let equip_list = modEquip.EquipData.GetInstance().GetEquipList();
        this.eventLen = equip_list.length;

        for (let i = 0; i < equip_list.length; i++) {
            raw = Math.floor(i / 6);
            col = i % 6;

            //如果当前的长度小于总装备的长度则继续添加
            if(this.equip_object_list.length <= i){
                this.equip_object_list[i] = new EquipObject();
            }
            
            this.equip_object_list[i].ChangeEquipSource(equip_list[i]);
            this.equip_object_list[i].Index = i;
            Common.SetXY(this.equip_object_list[i], 4 +104*col, 8 +104*raw);
            this.equip_object_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchGoods, this);

            //判断当前选择的物品再哪里 因为是重新创建所以要做一个判断
             if(this.equip_info){
                if(this.equip_info.Id == equip_list[i].Id && this.equip_info.TypeID == equip_list[i].TypeID){
                    this.goods_index = i;
                    Common.SetXY(this.imgClick, this.equip_object_list[i].x, this.equip_object_list[i].y);
                }
            }
            this.scrollGroup.addChild(this.equip_object_list[i]); 
        }

        this.scrollGroup.addChild(this.imgClick);
        this.scrollGroup.addChild(this.otherGroup);
        Common.SetXY(this.otherGroup, 0, this.equip_object_list[this.eventLen - 1].y + 100);
    }

    /** 显示洗练的租 */
    private showResetGroup():void{
        let star = this.equip_info.Star == 6 ? 6 : this.equip_info.Star + 1
        for(let i:number = 0; i < 6; i++) this.reset_list[i].removeChildren();

        for(let i:number = 0; i < star; i++){
            this.createResetView(this.reset_list[i], i, this.equip_info.Star > i ? true : false);
            this.reset_list[i].visible = this.equip_info.Quality >= i ? true : false;
        }
    }

    /** 设置租的状态 */
    private setGroupStatus(isShowWeapon:boolean, isShowReset:boolean):void{
        this.equipGroup.visible = isShowWeapon;
        this.resetGroup.visible = isShowReset;
    }

    private scrollGroup:eui.Group;
    private equipGroup:eui.Group;
    private resetGroup:eui.Group;
    private resetScrollGroup:eui.Group;
    
    private goods_index:number;
    private eventLen:number;

    /** 按钮 */
    private btn_back:eui.Button;
    private btn_change:eui.Button;
    private btn_upgrade:eui.Button;
    private btn_close:eui.Button;
    private btn_help:eui.Button;

    /** 装备 */
    private imgClick:egret.Bitmap;
    private img_weapon:eui.Image;
    private img_detail:eui.Image;
    private lab_name:eui.Label;
    private lab_lv:eui.Label;
    private lab_exp:eui.Label;
    private lab_soul:eui.Label;
    private lab_diamond:eui.Label;

    /** 列表数据 */
    private star_list:Array<egret.Bitmap>;
    private reset_btn_list:Array<eui.Image>;
    private img_star_list:Array<egret.Bitmap>;
    private txt_attr_list:Array<egret.TextField>;
    private reset_list:Array<eui.Group>;

    /** object */
    private equip_info:modEquip.EquipInfo;
    private equip_object_list:Array<EquipObject>;
    private otherGroup:eui.Group;
}