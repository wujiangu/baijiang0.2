class EquipUpWindow extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/EquipUpSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
        this.group_list = [];
        this.txt_front_title = [];
        this.txt_front_list = [];
        this.txt_rear_title = [];
        this.txt_rear_list = [];
        this.imgStar_list = [];

        let txt_list = ["生命", "攻击", "护甲", "暴击", "闪避"];
        for(let i:number = 0; i < 5; i++){
            this.group_list[i] = new eui.Group();
            this.addChild(this.group_list[i]);
            Common.SetXY(this.group_list[i], this.curr_lv.x + 10, this.curr_lv.y + this.curr_lv.height + 18 + i * (35));

            this.txt_front_title[i] = Common.CreateText(txt_list[i],24, 0x858685,true,"Microsoft YaHei");
            this.group_list[i].addChild(this.txt_front_title[i]);

            this.txt_front_list[i] = Common.CreateText("400",24, 0x858685,true,"Microsoft YaHei", "right");
            this.group_list[i].addChild(this.txt_front_list[i]);
            this.txt_front_list[i].width = 170;
            Common.SetXY(this.txt_front_list[i], this.txt_front_title[i].x + this.txt_front_title[i].width, 0);

            this.txt_rear_title[i] = Common.CreateText(txt_list[i],24, 0x858685,true,"Microsoft YaHei");
            this.group_list[i].addChild(this.txt_rear_title[i]);
            Common.SetXY(this.txt_rear_title[i], this.txt_front_list[i].x + this.txt_front_list[i].width + 55, 0);

            this.txt_rear_list[i] = Common.CreateText("400",24, 0x858685,true,"Microsoft YaHei","right");
            this.group_list[i].addChild(this.txt_rear_list[i]);
            this.txt_rear_list[i].width = 170;
            Common.SetXY(this.txt_rear_list[i], this.txt_rear_title[i].x + this.txt_rear_title[i].width, 0);
        }

        this.starGroup = new eui.Group();
        this.addChild(this.starGroup);

        for(let i:number = 0; i < 6; i++) this.imgStar_list[i] = new egret.Bitmap();
    }

    private hide_attr_info(index:number, isVisible:boolean):void{
        for(let i:number = index; i < 5; i++){
            this.group_list[i].visible = isVisible;
        }
    }

    public Show(equip_info:modEquip.EquipInfo):void{
        super.Show();

        this.hide_attr_info(0, true);
        this.equip_info = equip_info;
        this.radio_one.selected = true;
        this.upLevelNum = 1;

        let equip_data = TcManager.GetInstance().GetTcEquipData(this.equip_info.Id);
        this.img_weapon.source = RES.getRes(`Sequip${25-this.equip_info.Id}_png`)
        this.txt_weapon.text   = equip_data.name;
        this.quality_attr_list = equip_info.GetOriginAttr();
        
        this.hide_attr_info(this.equip_info.Quality + 1, false);
        this.showStar();
        this.showUpgradeInfo();

        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upLevel.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpGrade, this);
        this.radio_one.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadio, this);
        this.radio_ten.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadio, this);
    }

    public Close():void{
        Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });

        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upLevel.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpGrade, this);
        this.radio_one.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadio, this);
        this.radio_ten.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchRadio, this);
        this.dispatchEventWith(modEquip.EquipSource.UPGRADE, false, -1);
    }

    /**  */
    private getEquipExpAndSoul():any{
        let allExp:number = 0, allSoul:number = 0;
        for(let i:number = 0; i < this.upLevelNum; i++){
            let upData:any = TcManager.GetInstance().GetDataFromLv(2, this.equip_info.Lv + i);
            allExp  += parseInt(upData.exp);
            allSoul += parseInt(upData.soul);
        }
        return {exp:allExp, soul:allSoul};
    }

    private onTouchRadio(event:egret.TouchEvent):void{
        if((this.upLevelNum == 1 && this.radio_one == event.target) || (this.upLevelNum == 10 && this.radio_ten == event.target)) return;

        if(event.target == this.radio_one){
            this.upLevelNum = 1;
        }
        else if(event.target == this.radio_ten)
        {
            if(this.equip_info.Lv + 10 >= modEquip.EquipSource.EQUIPLV){
                Animations.showTips("将超过满级，无法操作", 1, true);
                this.radio_one.selected = true;
                return ; 
            }

            this.upLevelNum = 10;
        }

        this.showUpgradeInfo();
    }

    private onTouchUpGrade(event:egret.TouchEvent):void{
         //如果当前等级到达最大级的时候返回
        if(this.equip_info.Lv >= modEquip.EquipSource.EQUIPLV){
            Animations.showTips("等级已满", 1, true);
            return ;
        }

        let upData:any = this.getEquipExpAndSoul();
        if(UserDataInfo.GetInstance().IsHaveOhterGoods("exp", upData.exp, "soul", upData.soul)){
            let attr:any = this.equip_info.GetEquipAttr();
            this.equip_info.Lv = this.equip_info.Lv + this.upLevelNum;
            for(let i:number = 0; i < attr.length; i++) attr[i] += this.quality_attr_list[i] * this.upLevelNum;
            this.equip_info.SetEquipAttr(attr);
            this.upgradeEffect();
            Animations.showTips("升级成功", 1);

            let data = HeroData.list[GameData.curHero];
            let equipId = data.equip;
            if (equipId != 0 && equipId == this.equip_info.Id) modEquip.update(this.equip_info);
            this.dispatchEventWith(modEquip.EquipSource.UPGRADE, false, this.equip_info.Lv);

            if(this.upLevelNum == 10 && this.equip_info.Lv + this.upLevelNum > modEquip.EquipSource.EQUIPLV){
                this.upLevelNum = 1;
                this.radio_one.selected = true;
            }
            
            this.showUpgradeInfo();
        }
        else
        {
            if(!UserDataInfo.GetInstance().IsHaveGoods("exp", upData.exp)) Animations.showTips("经验不足无法升级",1,true);
            else if(!UserDataInfo.GetInstance().IsHaveGoods("soul", upData.soul)) Animations.showTips("灵魂石不足无法升级",1,true);
        }
    }

    private showUpgradeInfo():void{
        let quality:number = this.equip_info.Quality + 1;
        let attr:any = this.equip_info.GetEquipAttr();

        let num = quality >= 5 ? 5 : quality;
        for(let i:number = 0; i < num; i++){
            this.txt_front_list[i].text = `${Math.floor(attr[i])}`;
            this.txt_rear_list[i].text = `${Math.floor(attr[i] + this.quality_attr_list[i] * this.upLevelNum)}`;
        }

        let data = this.getEquipExpAndSoul();
        this.txt_exp.text = `${data.exp}`;
        this.txt_sole.text = `${data.soul}`
        this.curr_lv.text = "Lv." + this.equip_info.Lv;
        this.next_lv.text = "Lv." + (this.equip_info.Lv + this.upLevelNum);
    }

    private showStar():void{
        this.starGroup.removeChildren();
        let value:number;

        for(let i:number = 0; i < this.equip_info.Quality + 1; i++){
            if(this.equip_info.GetAttrType().length > i){
                value = this.equip_info.GetAttrType()[i].Value;
            }
            else value = 0;
            this.imgStar_list[i].texture = RES.getRes(modEquip.GetEquipLvFromValue(value).img);
            this.starGroup.addChild(this.imgStar_list[i]);
            Common.SetXY(this.imgStar_list[i], i * 32, 0);
        }
        this.starGroup.width = this.equip_info.Quality * 32;
        Common.SetXY(this.starGroup, this.img_weapon.x + (this.img_weapon.width - this.starGroup.width) / 2 - 20, this.img_weapon.y - 45);
    }

     /** equip upgrade effect */
    private upgradeEffect():void{
        let img_bg:egret.Bitmap = new egret.Bitmap(RES.getRes("wuqi_01_png"));
        this.addChild(img_bg);
        Common.SetXY(img_bg, this.img_weapon.x + (this.img_weapon.width - img_bg.width >> 1), this.img_weapon.y + (this.img_weapon.height - img_bg.height >> 1));
        
        let img_upArrow:egret.Bitmap = new egret.Bitmap(RES.getRes("wuqi_02_png"))
        this.addChild(img_upArrow);
        Common.SetXY(img_upArrow, this.img_weapon.x + (this.img_weapon.width - img_upArrow.width >> 1), this.img_weapon.y + (this.img_weapon.height - img_upArrow.height >> 1));

        let mc = Common.CreateMovieClip("upArrow");
        this.addChild(mc);
        Common.SetXY(mc, this.curr_lv.x + this.curr_lv.width - 6, this.curr_lv.y + this.curr_lv.height * 4 + 6);
        mc.play(1);

        egret.Tween.get(img_bg).to({alpha:1},400).to({alpha:0},400);
        egret.Tween.get(img_upArrow).to({y:img_upArrow.y - 100, alpha:0}, 800).call(()=>{
            this.removeChild(img_bg);
            this.removeChild(img_upArrow);
            this.removeChild(mc);
            egret.Tween.removeTweens(img_bg);
            egret.Tween.removeTweens(img_upArrow);
        });
    }

   /**  */
    private img_weapon:eui.Image;
 
    /**  */
    private txt_weapon:eui.Label;
    private txt_exp:eui.Label;
    private txt_sole:eui.Label;
    private curr_lv:eui.Label;
    private next_lv:eui.Label;
    private txt_front_list:Array<egret.TextField>;
    private txt_rear_list:Array<egret.TextField>;
    private txt_front_title:Array<egret.TextField>;
    private txt_rear_title:Array<egret.TextField>;
    private group_list:Array<eui.Group>;
    private imgStar_list:Array<egret.Bitmap>;
    private starGroup:eui.Group;
    private quality_attr_list:any;

    /** */
    private btn_close:eui.Button;
    private btn_upLevel:eui.Button;
    private radio_one:eui.RadioButton;
    private radio_ten:eui.RadioButton;

    private upLevelNum:number;
   
    /**  */
    private equip_info:modEquip.EquipInfo;
}