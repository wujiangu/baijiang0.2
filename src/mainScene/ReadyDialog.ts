/**
 * 准备界面
 */
class ReadyDialog extends PopupWindow {
    public name = 'ReadyDialog'
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        this.skinName = "resource/game_skins/readyWindowSkin.exml";
        this.viewStack.selectedIndex = 1;
        this.btn_skill.selected = true;
        ReadyDialog.instance = this;
    }

    protected createChildren(): void{
        this._armatureGroup = new eui.Group();
        this.addChild(this._armatureGroup);
        this._armatureGroup.x = 260;
        this._armatureGroup.y = 460;
        this._heroArmature = new Array();
        this._curAttr = new Array();
        this._tempAttr = new Array();
        this._selectBox = Utils.createBitmap("battle_res.img_selectHero");
        this._createHeroIcon();
        this._createAttr();
    }

    /**
     * 创建属性
     */
    private _createAttr():void {
        let attr = ["生命", "攻击", "护甲", "闪避", "暴击", "攻速"];
        let hero:any = HeroData.getHeroData(GameData.curHero);
        let equip:number = hero.equipId;
        let equipInfo = modEquip.EquipData.GetInstance().GetEquipFromEquipId(equip);
        let equipAttr = modHero.handlerEquipData(equipInfo);
        for (let i = 0; i < attr.length; i++) {
            let leftText  = Common.CreateText(attr[i], 24, 0x858685, true, "Microsoft YaHei");
            this.biographyGroup.addChild(leftText);
            Common.SetXY(leftText, 45, 85 + 40 * i);

            let curAttr = Common.CreateText(hero.attr[i], 24, 0x858685, true, "Microsoft YaHei"); 
            this.biographyGroup.addChild(curAttr);
            this._curAttr.push(curAttr);
            Common.SetXY(curAttr, leftText.x + leftText.width + 100, leftText.y);
            curAttr.width = 200;

            this._tempAttr[i] = Common.CreateText("+"+equipAttr[i].toString(), 24, Common.TextColors.green, true, "Microsoft YaHei","right");
            this.biographyGroup.addChild(this._tempAttr[i]);
            Common.SetXY(this._tempAttr[i], this.biographyGroup.width - 200, curAttr.y);
            this._tempAttr[i].width = 160;
        }

        this.set_label_text(hero);
    }

    public Init():void{
        this.star_list = new Array();
        for(let i:number = 0; i < 6; i++){
            this.star_list[i] = new egret.Bitmap(RES.getRes("equip_res.star_00"));
            this.detailGroup.addChild(this.star_list[i]);
            Common.SetXY(this.star_list[i], 26 + i * 32, 16);
        }
    }

    /**
     * 更新属性值
     */
    public updateAttr(isUpgrade:boolean=false):void {
        let hero = HeroData.getHeroData(GameData.curHero);
        HeroData.setHeroAttr(GameData.curHero, hero.lv);
        for (let i = 0; i < 6; i++) {
            let attr = hero.attr[i];
            this._curAttr[i].text = attr
        }

        this.set_label_text(hero);
        if (isUpgrade) HeroData.update();
    }

    private uiCompleteHandler():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        ResAsynLoadManager.LoadReadyScene();

        this.topBtn = [this.btn_upgrade, this.btn_skill, this.btn_detail];
        //每个人物的三个技能属性
        let temp:any;
        for (let i = 0; i < 3; i++) {
            this._skill[i] = new Array();
            switch (i) {
                case 0:
                    temp = [this.lab_skillname1, this.lab_cd1, this.lab_detail1, this.img_skill1, this.img_skill1Bg];
                break;
                case 1:
                    temp = [this.lab_skillname2, this.lab_cd2, this.lab_detail2, this.img_skill2, this.img_skill2Bg];
                break;
                default:
                    temp = [this.lab_skillname3, this.lab_cd3, this.lab_detail3, this.img_skill3, this.img_skill3Bg];
                break;
            }
            for(let j:number = 0; j < 5; j++) this._skill[i][j] = temp[j];
        }
    }

    protected childrenCreated(): void{
        let id = modHero.getIdFromKey(GameData.curHero);
        this.showHero(id);
        let currHero = HeroData.getHeroData(GameData.curHero);
        let equipId = currHero.equipId;

        if (equipId != 0) {
            this.equip_info = modEquip.EquipData.GetInstance().GetEquipFromEquipId(equipId);
            this.updateEquip(this.equip_info);
        }
    }

    private onTouchEquip(event:egret.TouchEvent):void{
        if(this.equip_info == null) return;
        WindowManager.GetInstance().GetWindow("EquipInfoDialog").Show(this.equip_info);
    }

    private topBtnListener(event:egret.TouchEvent):void {
        this._focusBtn = event.currentTarget;
        switch(this._focusBtn) {
            case this.btn_upgrade:
                Utils.viewStackStatus(this.viewStack, this.topBtn, 0);
            break;
            case this.btn_skill:
                Utils.viewStackStatus(this.viewStack, this.topBtn, 1);
            break;
            case this.btn_detail:
                Utils.viewStackStatus(this.viewStack, this.topBtn, 2);
            break;
            case this.btn_battle:
                AudioManager.GetIns().Stop(AudioManager.MAIN_BG_MUSIC);
                AudioManager.GetIns().PlayMusic(AudioManager.START_MUSIC);
                ResAsynLoadManager.LoadCurHeroSource(GameData.curHero);
                let groupName:string = SceneManager.nextScene == "battleScene" ? "battleGroup" : "pvpGroup";
                RES.createGroup(groupName, SceneManager.nextScene == "battleScene" ? ["battleStage", "battleCommon"] : ["battlePVP", "battleCommon"],true);
                ResLoadManager.GetInstance().LoadGroup(groupName,()=>{
                     Animations.sceneTransition(()=>{
                        TimerManager.getInstance().doTimer(20, 0, this.enterBattle, this);
                        GameLayerManager.gameLayer().sceneLayer.removeChildren();
                        GameLayerManager.gameLayer().panelLayer.removeChildren();
                    });
                })
            break;
            case this.btn_change:
                if (modEquip.EquipData.GetInstance().GetEquipNum() == 0) {
                    Animations.showTips("没有可以更换的武器", 1, true);
                    return;
                }

                let pop = WindowManager.GetInstance().GetWindow("ChangeEquipPop");
                pop.Show(this.equip_info);
                pop.addEventListener(modEquip.EquipSource.CHANGEEQUIP, this.updateUI, this);
            break;
            case this.btn_up:
                this.updateAttr(true);
            break;
            default:
                this.Close();
            break;
        }
    }

    /**
     * 进入战斗
     */
    private enterBattle():void {
        if (!ResAsynLoadManager.isLoaded) return;
        TimerManager.getInstance().remove(this.enterBattle, this);
        this._stopTimer();
        if (SceneManager.nextScene == "battleScene") {
            if (!SceneManager.battleScene) {
                SceneManager.battleScene = new BattleScene();
            }else{
                SceneManager.battleScene.init();
            }
            SceneManager.curScene = SceneManager.battleScene;
        }else{
            if (!SceneManager.pvpScene) {
                SceneManager.pvpScene = new PVPScene();
            }else{
                SceneManager.pvpScene.init();
            }
            SceneManager.curScene = SceneManager.pvpScene;
        }
        GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.curScene);
    }

    /**
     * 显示英雄的信息
     */
    public showHero(num:number) {
        let hero_id:number = 0;
        //英雄的id
        hero_id = modHero.getIndextFromId(num);
        //名字
        this.lab_heroName.text = ConfigManager.tcHero[hero_id].name;

        for(let i:number = 0; i < this.hero_sort_list.length; i++){
            this._heroArmature[i].visible = GameData.curHero == this.hero_sort_list[i] ? true : false;
        }

        //技能
        for (let i = 0; i < ConfigManager.tcHero[hero_id].skill.length; i++) {
            let skillId = ConfigManager.tcHero[hero_id].skill[i];
            for (let j = 0; j < ConfigManager.tcSkill.length; j++) {
                if (ConfigManager.tcSkill[j].id == skillId) {
                    this._skill[i][0].text = ConfigManager.tcSkill[j].name;
                    this._skill[i][1].text = ConfigManager.tcSkill[j].cd == 0 ? "被动" : `冷却：${ConfigManager.tcSkill[j].cd}秒`;
                    this._skill[i][2].text = ConfigManager.tcSkill[j].content;
                    this._skill[i][3].source = `talAndSkill_res.skill_${ConfigManager.tcSkill[j].image_id}`;
                    this._skill[i][4].source = `battle_res.${GameData.curHero}_skillBg`;
                    break;
                }
            }
        }
        //武器
        this.btn_change.visible = true;
        let data = HeroData.list[GameData.curHero];
        let equipId = data.equip;
        this.btn_change.label = equipId != 0 ? "替换" : "装备";

        HeroData.setCurHeroData(GameData.curHero);
    }

    /**
     * 更新武器信息
     */
    public updateEquip(equip:any):void{
        if(equip == null) return ;

        let tempList:any = equip.GetAttrType();
        for (let i = 0; i < 6; i++) {
            let img:any = tempList.length > i ? modEquip.GetEquipColorFromQuality(tempList[i].Quality).img : "equip_res.star_00";
            this.star_list[i].texture = RES.getRes(img);
            this.star_list[i].visible = equip.Quality >= i ? true : false;
        }

        this.btn_change.label = "替换";
        this.lab_equipLv.visible = true;
        this.lab_equipLv.text = `等级：${equip.lv}/100`;
        this.img_equip.source = `equip${25-equip.id}_png`;
        this.img_equip.visible = true;
        this.updateEquipAttr(equip);
    }

    /**
     * 更新装备增加属性数值
     */
    private updateEquipAttr(equipInfo:modEquip.EquipInfo):void {
        let equipAttr = modHero.handlerEquipData(equipInfo);
        for (let i = 0; i < this._tempAttr.length; i++) {
            this._tempAttr[i].text = "+"+equipAttr[i].toString();
        }
    }

    /**
     * 更新界面
     */
    public updateUI(event:egret.Event):void {
        event.target.removeEventListener(modEquip.EquipSource.CHANGEEQUIP, this.updateUI, this);

        this.equip_info = modEquip.EquipData.GetInstance().GetEquipFromEquipId(event.data);

        for (var key in HeroData.list) {
            HeroData.list[key]["equipId"] = this.equip_info.EquipId;
            let heroId = HeroData.list[key].heroId;
            let equipId = this.equip_info.EquipId;
            HttpRequest.getInstance().send("POST", "hero", {heroId:heroId, equipId:equipId})
        }
        HeroData.update();
        this.updateEquip(this.equip_info);
        
    }

    public Show():void{
        super.Show();

        this.lab_soul.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("soul"));
        this.lab_diamond.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
        this.lab_exp.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("exp"));

        let currHeor = HeroData.getHeroData(GameData.curHero);
        let equipInfo:modEquip.EquipInfo = modEquip.EquipData.GetInstance().GetEquipFromEquipId(currHeor.equipId);
        if(equipInfo) this.updateEquip(equipInfo);
        else for(let star of this.star_list) star.visible = false;
    }

    /**
     * 显示界面
     */
    public Reset(){
        this._startTimer();
        this.eventType(1);
        this.img_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
    }

    public Close():void{
        AudioManager.GetIns().PlayMusic(AudioManager.CLOSE_MUSIC);
        GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA);

        this._stopTimer();
        this.eventType();
        this.img_equip.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
    }

    private eventType(type:number = 0):void{
        let btn_list = [this.btn_upgrade,this.btn_skill,this.btn_detail,this.btn_back,this.btn_change,this.btn_battle,this.btn_up];
        Common.ListenerAndRemoveEvent(btn_list, this.topBtnListener, this, type);
        btn_list = [];
    }

    private HeroSortFromIsLock():any{
        let list:Array<string> = new Array();
        let unLock_list:Array<string> = new Array();
        let lock_list:Array<string> = new Array();
        let hero_list:any = ConfigManager.heroConfig;

        for(let key in hero_list){
            if(HeroData.list[key]) unLock_list.push(key);
            else lock_list.push(key);
        }

        for(let i in unLock_list) list.push(unLock_list[i]);
        for(let i in lock_list) list.push(lock_list[i]);
        GameData.curHero = unLock_list[0];

        return list;
    }

    /**更新英雄列表 */
    public updateList():void {
        let group:eui.Group = new eui.Group();
        let count = 0;
        let tempWidth:number = 0;

        this._heroArmature = [];
        this._armatureGroup.removeChildren();

        this.hero_sort_list = this.HeroSortFromIsLock();
        for(let key of this.hero_sort_list){
            let tempGroup:eui.Group = new eui.Group();
            let img_head = Utils.createBitmap(`battle_res.img_${key}1`);
            tempGroup.addChild(img_head);
            tempGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onSelete, this);
            tempGroup.x = count * 100;
            tempGroup.name = key;
            count ++;
            group.addChild(tempGroup);
            this._createArmature(key);
            
            let img:egret.Bitmap = new egret.Bitmap(RES.getRes("battle_res.heorLock"));
            tempGroup.addChild(img);
            tempWidth = tempGroup.width;
            img.visible = HeroData.list[key] == null ? true : false;
        }
        this.insertGroup(group, tempWidth, count * 100);
        this._scrollHero.viewport = group;
        group.addChild(this._selectBox);
        // this._scrollHero.addChild(this._selectBox);
    }

    /**插入一个空的组 */
    private insertGroup(parent:eui.Group, width:number, x:number = 0, y:number = 0):void {
        let tempGroup:eui.Group = new eui.Group();
        tempGroup.width = width;
        tempGroup.x = x;
        tempGroup.y = y;
        parent.addChild(tempGroup);
    }

    private _startTimer():void {
        TimerManager.getInstance().startTimer();
        DragonBonesFactory.getInstance().startTimer();
    }

    private _stopTimer():void {
        TimerManager.getInstance().stopTimer();
        DragonBonesFactory.getInstance().stopTimer();
    }

    /**创建骨架 */
    private _createArmature(name:string):void {
        let armature:DragonBonesArmatureContainer = new DragonBonesArmatureContainer();
        this._armatureGroup.addChild(armature);
        armature.register(DragonBonesFactory.getInstance().makeArmature(name, name, 10), [
            "idle"
        ]);
        armature.scaleX = 4;
        armature.scaleY = 4;
        if (GameData.curHero != name) {
            armature.visible = false;
        }
        armature.play("idle", 0);
        this._heroArmature.push(armature);
    }

    /**创建英雄头像 */
    private _createHeroIcon():void {
        this.updateList();
        this._selectBox.x = 0;
    }

    private _onSelete(event:egret.TouchEvent):void {
        let target = event.currentTarget;

        if(HeroData.list[target.name] == null){
            if(target.name == "zhaoyun") Animations.showTips("通过商城购买可获得英雄赵云!", 1, true);
            else if(target.name == "diaochan") Animations.showTips("连续签到两天可获得英雄貂蝉!", 1, true);
            return;
        }

        GameData.curHero = target.name;
        this._selectBox.x = target.x;
        this.updateAttr();
        let id = modHero.getIdFromKey(target.name);
        this.showHero(id);
    }

    private set_label_text(hero:any):void{
        this.lab_lv.text = "当前等级: Lv." + hero["lv"];
        this.txt_exp.text = hero["lv"] * 100 + "";
        this.txt_sole.text = hero["lv"] * 100 + "";
    }

    public static instance:ReadyDialog;
    private _isPVP:boolean;
    private _curAttr:Array<egret.TextField>;
    private _tempAttr:Array<egret.TextField>;
    /**属性组 */
    private biographyGroup:eui.Group;
    /**武器信息组 */
    private detailGroup:eui.Group;
    /**人物骨架组 */
    private _armatureGroup:eui.Group;
    /**叠层 */
    private viewStack:eui.ViewStack;
    private _skill:any[] = [];
	/*******************顶部按钮***********************/
	private btn_upgrade:eui.ToggleButton;
	private btn_skill:eui.ToggleButton;
	private btn_detail:eui.ToggleButton;
	private topBtn:eui.ToggleButton[];
	/*************************************************/

    private _focusBtn:eui.ToggleButton;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**出战按钮 */
    private btn_battle:eui.Button;
    /**替换按钮 */
    private btn_change:eui.Button;
    /**人物升级按钮 */
    private btn_up:eui.Button;
    /**武将头像滑动框 */
    private _scrollHero:eui.Scroller;
    /**选中框 */
    private _selectBox:egret.Bitmap;
    /**骨架 */
    private _heroArmature:Array<DragonBonesArmatureContainer>;

	/*******************文字和图片***********************/
    /**名字 */
    private lab_heroName:eui.Label;
    /**技能相关 */
    private lab_skillname1:eui.Label;
    private lab_skillname2:eui.Label;
    private lab_skillname3:eui.Label;
    private lab_cd1:eui.Label;
    private lab_cd2:eui.Label;
    private lab_cd3:eui.Label;
    private lab_detail1:eui.Label;
    private lab_detail2:eui.Label;
    private lab_detail3:eui.Label;
    private img_skill1Bg:eui.Image;
    private img_skill2Bg:eui.Image;
    private img_skill3Bg:eui.Image;
    private img_skill1:eui.Image;
    private img_skill2:eui.Image;
    private img_skill3:eui.Image;
    /**武器属性相关 */
    private lab_life:eui.Label;
    private lab_attack:eui.Label;
    private lab_attSp:eui.Label;
    private lab_armor:eui.Label;
    private lab_speed:eui.Label;
    private lab_equipName:eui.Label;
    private lab_equipLv:eui.Label;
    private img_equip:eui.Image;
	/*************************************************/

    private lab_soul:eui.Label;
    private lab_diamond:eui.Label;
    private lab_exp:eui.Label;
    private lab_lv:eui.Label;
    private txt_exp:eui.Label;
    private txt_sole:eui.Label;

    /** other */
    private hero_sort_list:any;
    private equip_info:modEquip.EquipInfo;
    private star_list:Array<egret.Bitmap>;
}