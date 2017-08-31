/**
 * 天赋界面
 */
class TalentDialog extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        this.skinName = "resource/game_skins/talentWindowSkin.exml";
        this.tcTalent = RES.getRes("TcTalent_json");
        TalentDialog.instance = this;
        this.topBtnSkin = [];
        this.topBtn = [];
        this.pages = [];
    }

    protected createChildren(): void{
        this.popupGroup.anchorOffsetX = Common.SCREEN_W/2;
        this.popupGroup.anchorOffsetY = Common.SCREEN_H/2;
        this.popupGroup.x = Common.SCREEN_W/2;
        this.popupGroup.y = Common.SCREEN_H/2;
        this.skillPopupGroup.anchorOffsetX = Common.SCREEN_W/2;
        this.skillPopupGroup.anchorOffsetY = Common.SCREEN_H/2;
        this.skillPopupGroup.x = Common.SCREEN_W/2;
        this.skillPopupGroup.y = Common.SCREEN_H/2;
    }

    protected childrenCreated():void {
        this.curPage = UserDataInfo.GetInstance().GetBasicData("curTalentPage") - 1;
        let talentPage = modTalent.getTalentData();
        for (let i = 0; i < talentPage.length; i++) {
            this.pages[i] = new TalentIR(i);
            this.createToggleBtn(i);
            this.addChild(this.topBtnSkin[i]);
        }
        if(this.pages[this.curPage]) this.pageGroup.addChild(this.pages[this.curPage]);
        Utils.toggleButtonStatus(this.topBtn, this.curPage);
        
        this.allLv = talentPage.length >= 1 ? (talentPage[this.curPage].count == null ? 1 : talentPage[this.curPage].count) : 1;
        this.btn_add.x = 155 + 55 * talentPage.length;
    }

    private uiCompleteHandler():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
    }

    /**
     * 顶部按钮监听
     */
    private topBtnListener(event:egret.TouchEvent):void {
        this._focusBtn = event.currentTarget;
        switch (this._focusBtn) {
            case this.btn_add:
                this.show_pop_view("购买天赋", "title_res.title_0008",1);
            break;
            case this.btn_reset:
                this.show_pop_view("重置天赋", "title_res.title_0009",2);
            break;
            default:
                this.Close();
            break;
        }
    }

    /**
     * 弹窗按钮回调
     */
    private onPopupBtn(event:egret.TouchEvent):void {
        if(event.target == this.btn_close){
            Animations.popupIn(this.popupGroup, 300, ()=>{
                GameLayerManager.gameLayer().maskLayer.removeChildren();
            });
        }
        else
        {
            Animations.popupIn(this.popupGroup, 300, ()=>{
                GameLayerManager.gameLayer().maskLayer.removeChildren();
                this.onPurchass(this.purchassType);
            });
        }
    }

    /**
     * 解锁逻辑
     */
    private _unLockTalent(type:string) {
        if (modTalent.isUnlock(this.curPage, this.curTalentId)) {

            if (type == "power") {
                if(UserDataInfo.GetInstance().IsHaveGoods("power", TcManager.GetInstance().GetDataFromLv(3, this.allLv).power)) this.update();
                else Animations.showTips("能力不足，不能升级天赋",1,true);
            }else if(type == "diamond")
            {
                if(UserDataInfo.GetInstance().IsHaveGoods("diamond", TcManager.GetInstance().GetDataFromLv(3, this.allLv).diamond)) this.update();
                else Animations.showTips("钻石不足，不能升级天赋",1,true);
            }

        }
    }

    /**
     * 技能弹窗按钮回调
     */
    private onSkillPop(event:egret.TouchEvent):void {
        switch (event.currentTarget) {
            case this.btn_upPower:
                this._unLockTalent("power");
            break;
            case this.btn_upDiamond:
                this._unLockTalent("diamond");
            break;
            default:
                Animations.popupIn(this.skillPopupGroup, 300, ()=>{
                    GameLayerManager.gameLayer().maskLayer.removeChildren();
                });
            break;
        }
    }

    /** 点击解锁按钮 */
    private onTouchUnLock(event:egret.TouchEvent):void{
        if(this.allLv >= 71) Animations.showTips("天赋已点满", 1, true);
        else if (this.curLevel >= this._curMaxLv) Animations.showTips("该天赋等级已达上限", 1, true);
        else
        {
            let strs = modTalent.getTips(this.curTalentId);
            Animations.showTips(strs, 1, true);
        }
    }

    /**
     * 确定按钮方法
     */
    private onPurchass(type:number):void {
        let talentPage = modTalent.getTalentData();
        if (type == 1) {
            //购买天赋页

            if(!UserDataInfo.GetInstance().IsHaveGoods("diamond", 50)){
                Animations.showTips("钻石不足，无法购买天赋页", 1, true);
                return;
            }

            this.pageGroup.removeChildren();
            let talent = {"name":"", "count":1, "talent":[]};
            talentPage.push(talent);
            let len = talentPage.length;
            this.createToggleBtn(len-1);
            this.btn_add.x = 155 + 55 * len;
            Utils.toggleButtonStatus(this.topBtn, len - 1);
            this.curPage = len - 1;
            this.pages[len- 1] = new TalentIR(len - 1);
            this.pageGroup.addChild(this.pages[len - 1]);
            if (talentPage.length >= 5) {
                 this.btn_add.visible = false;
            }
        }else{
            //重置天赋页
            if (talentPage[this.curPage].talent.length == 0) {
                Animations.showTips("无需重置", 1, true);
                return;
            }

            if(!UserDataInfo.GetInstance().IsHaveGoods("diamond", 50)){
                Animations.showTips("钻石不足，无法重置", 1, true);
                return;
            }

            this.returnTalentPower();
            talentPage[this.curPage].talent = [];
            talentPage[this.curPage]["count"] = 1;
            this.pages[this.curPage].reset(this.curPage);
        }

        this.allLv = 1;
        this.show_lab_text();
    }

    /**
     * 天赋页按钮监听
     */
    private pageBtnListener(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        this.curPage = target.id;
        UserDataInfo.GetInstance().DealUserData("curTalentPage", this.curPage + 1);
        // Common.log(target);
        modTalent.setUnlock(this.curPage);
        this.createTalentPage(target.id);
        this.allLv = modTalent.getTalentData()[target.id]["count"] == null ? 1 : modTalent.getTalentData()[target.id]["count"];
    }

    /**
     * 创建天赋页选项按钮
     */
    private createToggleBtn(id:number):void {
        var skinName = 
        `<e:Group xmlns:e="http://ns.egret.com/eui">
                <e:ToggleButton label="0">
                    <e:Skin states="up,down,disabled">
                        <e:Image width="100%" height="100%" source="button_res.button_0006" source.down="button_res.button_0007"/>
                        <e:Label id="labelDisplay" horizontalCenter="0" verticalCenter="0" textColor.down="0xFFFFFF" bold="true" fontFamily="Microsoft YaHei" textColor="0x111111"/>
                    </e:Skin>
                </e:ToggleButton>
            </e:Group>`;
        var clazz = EXML.parse(skinName);
        this.topBtnSkin[id] = new clazz();
        this.topBtnSkin[id].x = 155 + 55 * id;
        this.topBtnSkin[id].y = 100;
        let toggleBtn:any = this.topBtnSkin[id].getChildAt(0);
        toggleBtn.id = id;
        toggleBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pageBtnListener, this);
        this.topBtn.push(toggleBtn);
        toggleBtn.label = `${id + 1}`;
        this.addChild(this.topBtnSkin[id]);
    }

    /**
     * 创建天赋页
     */
    private createTalentPage(pageCount:number):void {
        this.pageGroup.removeChildren();
        this.pages[pageCount].setTalentDetail(pageCount);
        Utils.toggleButtonStatus(this.topBtn, pageCount);
        this.pageGroup.addChild(this.pages[pageCount]);
    }

    /**
     * 更新升级弹窗
     */
    private update():void {

        this.show_lab_text();

        this.allLv++;
        this.curLevel ++;
        this.lab_lv.text = `${this.curLevel}/${this._curMaxLv}`;
        let index:number = modTalent.getIndexFromId(this.curTalentId);
        this._updateTalentDesc(index, this.curLevel);
        if (this.curLevel == this._curMaxLv) this.lab_lv.textColor = Common.TextColors.lvFull;
       
        modTalent.setData(this.curPage, this.curTalentId, this.curLevel);
        Animations.showTips("天赋升级成功", 1);

         //更新能量点
        // this.lab_power
        this.pages[this.curPage].setTalentLv();
        this.pages[this.curPage].setUnlock(this.curTalentId);
        this.pages[this.curPage].ShowCanClickTalent();

        if(!this.isSkillFull()) this.show_btn_text(true);
    }

    /**
     * 升级天赋弹窗
     */
    public showPopup(num:number, lv:number, maxLv:number):void {

        this.skillPopupGroup.visible = true;
        this.curLevel = lv;
        this._curMaxLv = maxLv;
        this.curTalentId = num;
        GameLayerManager.gameLayer().maskLayer.addChild(this.skillPopupGroup);
        Animations.popupOut(this.skillPopupGroup, 500);
        let id:number = modTalent.getIndexFromId(num);
        this.lab_name.text = this.tcTalent[id].name;
        this._updateTalentDesc(id, lv);
        this.lab_lv.text = `${lv}/${this._curMaxLv}`;
        this.lab_lv.textColor = this.curLevel == this._curMaxLv ? Common.TextColors.lvFull : Common.TextColors.lvNotFull;

        let btn:any = this.btn_upPower.getChildAt(0);
        let diamondBtn:any = this.btn_upDiamond.getChildAt(0);

       if(this.isSkillFull()) return;

       let isUnlock:boolean = modTalent.isUnlock(this.curPage, num);
       this.lab_condition.text = isUnlock ? "" :modTalent.getTips(this.curTalentId, false);
       this.show_btn_text(isUnlock);
    }

    /**
     * 更新天赋说明内容
     */
    private _updateTalentDesc(index:number, lv:number) {
        let desc:string = this.tcTalent[index].desc;
        let value:number = lv == 0 ? this.tcTalent[index].value[0] : this.tcTalent[index].value[lv-1];
        this.lab_skillDetail.text = desc.replace(/n/, value.toString());
    }

    public Show():void{
        super.Show();

        let tanlent = modTalent.getTalentData();
        this.show_lab_text();
        this.btn_add.visible = tanlent.length >= 5 ? false : true;
    }

    /**
     * 界面显示
     */
    public Reset():void {

        this.btn_add.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_reset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_certain.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPopupBtn, this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPopupBtn, this);
        this.btn_closeDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
        this.btn_upPower.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
        this.btn_upDiamond.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
        this.btn_unLock.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUnLock, this);
        this.btn_help.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelp, this);
    }

    public Close():void{
        GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA);

        this.btn_add.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_reset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_back.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.topBtnListener, this);
        this.btn_certain.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPopupBtn, this);
        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPopupBtn, this);
        this.btn_closeDetail.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
        this.btn_upPower.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
        this.btn_upDiamond.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSkillPop, this);
        this.btn_unLock.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUnLock, this);
        this.btn_help.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onHelp, this);
    }

    private onHelp(event:egret.TouchEvent):void{
        WindowManager.GetInstance().GetWindow("HelpTipDialog").Show(0);
    }

    /** 如果天赋慢的话则返回true  否则返回false */
    private isSkillFull():boolean{

        //如果当前的天赋等级为最高级的话 则显示天赋已满
        if (this.curLevel >= this._curMaxLv) {
            this.show_btn_text(false);
            this.btn_unLock.label = "该天赋已满";
            return true;
        } 
        
        //如果天赋等级已经最高则显示天赋已点满
        if(modTalent.isTalentFull(this.curPage, this.curTalentId)){
            this.show_btn_text(false);
            this.btn_unLock.label = "最多点亮十个天赋";
            return true;
        }
        else this.btn_unLock.label = "未解锁";

        return false;
    }


    private show_lab_text():void{
        this.lab_power.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("power"));
        this.lab_diamond.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
    }

    private show_btn_text(isVisible:boolean):void{

        let data:any = TcManager.GetInstance().GetDataFromLv(3,this.allLv);
        if(data == null) return;

        this.btn_upPower.label = data.power;
        this.btn_upDiamond.label = data.diamond;
        this.btn_upPower.visible = isVisible;
        this.btn_upDiamond.visible = isVisible;
        this.btn_unLock.visible = !isVisible;
    }

    private show_pop_view(strName:string,imgPath:string,type:number):void{
        this.lab_title.text = strName;
        this.img_title.source = RES.getRes(imgPath);
        this.lab_detail.textFlow = <Array<egret.TextField>>[{text:strName + "需要花费"},{text:"50钻石",style:{"textColor":0x2d6ea6}}];
        this.purchassType = type;
        Animations.popupOut(this.popupGroup, 500);
        this.popupGroup.visible = true;
        GameLayerManager.gameLayer().maskLayer.addChild(this.popupGroup);
    }

    private returnTalentPower():void{
        let allPower:number = 0;
        let tempList:any = TcManager.GetInstance().GetTcListFromIndex(3);
        for(let i:number = 0; i < this.allLv - 1; i++){
            allPower += tempList[i].power;
        }
        UserDataInfo.GetInstance().DealUserData("power", UserDataInfo.GetInstance().GetBasicData("power") + allPower);
    }

    public static instance:TalentDialog;
    /**天赋的配置文件 */
    private tcTalent:any;
    /**当前的天赋等级 */
    private curLevel:number;
	private allLv:number;    /**当前的天赋页 */
    /**当前天赋最多等级 */
    private _curMaxLv:number;
    private curPage:number;
    /**当前的天赋Id */
    private curTalentId:number;
	/*******************顶部按钮***********************/
	private topBtnSkin:eui.ToggleButton[];
    private topBtn:Array<any>;
	/*************************************************/
	/*******************技能升级弹窗***********************/
    private skillPopupGroup:eui.Group;
	private btn_closeDetail:eui.Button;
	private btn_upPower:eui.Button;
    private btn_upDiamond:eui.Button;
    private btn_unLock:eui.Button;
	private lab_name:eui.Label;
    private lab_lv:eui.Label;
    private lab_condition:eui.Label;
    private lab_skillDetail:eui.Label;
	/*************************************************/
    private _focusBtn:eui.Button;
    /**返回按钮 */
    private btn_back:eui.Button;
    /**重置按钮 */
    private btn_reset:eui.Button;
    /**增加按钮 */
    private btn_add:eui.Button;
    /**能量点 */
    private lab_power:eui.Label;

    private lab_diamond:eui.Label;

    /**天赋面板 */
    private pageGroup:eui.Group;
    /**弹出 */
    private popupGroup:eui.Group;
    /**弹窗标题 */
    private lab_title:eui.Label;
    /**弹窗关闭 */
    private btn_close:eui.Button;
    /**确定按钮 */
    private btn_certain:eui.Button;
    /**说明文字 */
    private lab_detail:eui.Label;
    /**购买类型 */
    private purchassType:number;
    private pages:Array<TalentIR>;
    private img_title:eui.Image;
    private btn_help:eui.Button;
}