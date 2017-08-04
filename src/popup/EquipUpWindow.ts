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

        let txt_list = ["血量", "护甲", "攻击", "暴击"];
        for(let i:number = 0; i < 4; i++){
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

    public Show(equip_info:modEquip.EquipInfo):void{
        super.Show();

        this.equip_info = equip_info;
        this.radio_one.selected = true;
        this.upLevelNum = 1;

        let equip_data = TcManager.GetInstance().GetTcEquipData(this.equip_info.Id);
        this.img_weapon.source = RES.getRes(`Sequip${25-this.equip_info.Id}_png`)
        this.txt_weapon.text   = equip_data.name;
        
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
            this.equip_info.Lv = this.equip_info.Lv + this.upLevelNum;
            this.equip_info.UpdataBaseAttr();
            this.upgradeEffect();
            Animations.showTips("升级成功", 1);

            let data = HeroData.list[GameData.curHero];
            let equipId = data.equip;
            if (equipId != 0 && equipId == this.equip_info.Id) modEquip.update(this.equip_info);
            this.dispatchEventWith(modEquip.EquipSource.UPGRADE, false, 1);

            if(this.upLevelNum == 10 && this.equip_info.Lv + this.upLevelNum > modEquip.EquipSource.EQUIPLV){
                this.upLevelNum = 1;
                this.radio_one.selected = true;
            }
            
            this.showUpgradeInfo();
            LeanCloud.GetInstance().SaveEquipData();
        }
        else
        {
            let goodsName:string;
            if(!UserDataInfo.GetInstance().IsHaveGoods("exp", upData.exp)) goodsName = "exp";
            else if(!UserDataInfo.GetInstance().IsHaveGoods("soul", upData.soul)) goodsName = "soul";
            Common.ShowLackDataPopup(goodsName, ()=>{
                this.dispatchEventWith(modEquip.EquipSource.UPGRADE);
            })
        }
    }

    private showUpgradeInfo():void{
        let attr:any = this.equip_info.GetEquipAttr();

        for(let i:number = 0; i < 4; i++){
            this.txt_front_list[i].text = i < 3 ?`${Math.ceil(attr[i])}` : `${Math.ceil(attr[i] * 10) / 10}%`;
            let rearNum:number = modEquip.GetEquipUpAttr(this.equip_info, this.equip_info.Lv + this.upLevelNum, i);
            this.txt_rear_list[i].text = this.equip_info.Lv < modEquip.EquipSource.EQUIPLV ? (i < 3 ? `${Math.ceil(rearNum)}`:`${Math.ceil(rearNum * 10) / 10}%`) : "";
        }

        let data = this.getEquipExpAndSoul();
        if(this.equip_info.Lv < modEquip.EquipSource.EQUIPLV){
            this.showEquipLvInfo(true, data.exp, data.soul, "Lv." + (this.equip_info.Lv + this.upLevelNum))
        }
        else
        {
            this.showEquipLvInfo();
        }

        this.curr_lv.text = "Lv." + this.equip_info.Lv;
    }

    /** show equip lv info 
     * @param isShow  is can show
     * @param strExp  exp consume number
     * @param strSole sole consume number
     * @param strNext next lv show info 
     */
    private showEquipLvInfo(isShow:boolean = false, exp:number = 0, soul:number = 0, strNext:string = ""):void{
        for(let i:number = 0; i < 4; i++){
            this.txt_rear_title[i].visible = isShow
        }
        this.txt_exp.text = Common.TranslateDigit(exp);
        this.txt_sole.text = Common.TranslateDigit(soul);
        this.next_lv.text  = strNext;
        this.lab_max.visible = !isShow;
    }

    private showStar():void{
        this.starGroup.removeChildren();
        let quality:number;

        for(let i:number = 0; i < this.equip_info.Quality + 1; i++){
            quality = this.equip_info.GetAttrType().length > i ? this.equip_info.GetAttrType()[i].Quality:-1;
            this.imgStar_list[i].texture = RES.getRes(modEquip.GetEquipLvFromValue(quality).img);
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

   /** image */
    private img_weapon:eui.Image;
    private imgStar_list:Array<egret.Bitmap>;
 
    /** label */
    private txt_weapon:eui.Label;
    private txt_exp:eui.Label;
    private txt_sole:eui.Label;
    private curr_lv:eui.Label;
    private next_lv:eui.Label;
    private txt_front_list:Array<egret.TextField>;
    private txt_rear_list:Array<egret.TextField>;
    private txt_front_title:Array<egret.TextField>;
    private txt_rear_title:Array<egret.TextField>;
    private lab_max:eui.Label;

    /** Group */
    private group_list:Array<eui.Group>;
    private starGroup:eui.Group;

    /** button */
    private btn_close:eui.Button;
    private btn_upLevel:eui.Button;
    private radio_one:eui.RadioButton;
    private radio_ten:eui.RadioButton;

    /** other */
    private upLevelNum:number;
   
    /** class */
    private equip_info:modEquip.EquipInfo;
}