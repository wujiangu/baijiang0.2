/**
 * 主界面
 */
class MainScene extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        this.skinName = "resource/game_skins/mainSceneSkin.exml"
    }

    private uiCompleteHandler():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this)
        this.btn_addDesk.visible = false;
        this.btn_fullscene.visible = false;
        this.red_list = new Array();
        if (window["sdw"].canAddDesktop) {
            this.btn_addDesk.visible = true;
            this.btn_fullscene.visible = true;
        }

        this.createRedImage();
        this.onListener();
        this.showSignDialog();
        this.createMainScene();
        this.show_label_text();   
        AudioManager.GetIns().PlayMusic(AudioManager.MAIN_BG_MUSIC);
        this.isFull = false;
    }

    //creste red image
    private createRedImage():void{
        let obj_list:any = [this.btn_sign, this.btn_shop, this.btn_pvp,this.btn_email,this.btn_talent];
        let width_list:any = [94,120,116,120,120];
        for(let i = 0 ; i < obj_list.length; i++){
            this.red_list[i] = new egret.Bitmap(RES.getRes("battle_res.red_point"));
            this.addChild(this.red_list[i]);
            Common.SetXY(this.red_list[i], obj_list[i].x + width_list[i] - this.red_list[i].width, obj_list[i].y);
        }
        obj_list = null;width_list = null;
    }

    /** 事件监听 */
    private onListener():void{
        let event_list:any = [this.btn_ready,this.btn_equip,this.btn_talent,this.btn_shop,this.btn_pvp,this.btn_email,this.btn_sign,this.btn_addDesk,this.btn_fullscene];
        for(let i in event_list) event_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);

        let img_list:any = [this.img_power,this.img_exp, this.img_soul, this.img_diamond];
        for(let i in img_list){
            img_list[i].name = i;
            img_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchImg, this);
        }
        GameLayerManager.gameLayer().addEventListener(UserData.CHANGEDATA, this.onChangeData, this);
        GameLayerManager.gameLayer().addEventListener(UserData.REDEVENT, this.onRedEvent, this);
        this.onRedEvent();
    }

    /** 创建精灵 */
    private createMovie(name:string,x:number,y:number,index:number = -1):MovieClipManager{
        let movie = new MovieClipManager(name);
        Common.SetXY(movie, x, y);
        if(index != -1){
            this.addChildAt(movie, index);
        }
        else this.addChild(movie);
        return movie;
    }

    /***  创建主场景的精灵动画 包含人物动作 火光 猩猩 */
    private createMainScene():void{

        //星星列表
        this.star_list = [];                                                                                                        
        let starPosition = [[54,220],[75,42],[242,39],[622,80],[738,69],[958,110],[550,170],[1060,122],[1058,335],[1072,412]];
        let star_scale_list = [3, 2, 3, 2, 1, 2, 3, 2, 1, 1];
        for(let i:number = 0; i < 10; i++){
            this.star_list[i] = new egret.Bitmap(RES.getRes("common_res.0_0000_yinghuochongda01"));
            this.addChild(this.star_list[i]);
            Common.SetXY(this.star_list[i], starPosition[i][0], starPosition[i][1]);
            this.star_list[i].scaleX = star_scale_list[i];
            this.star_list[i].scaleY = star_scale_list[i];
            Animations.ObjFadeEffect(this.star_list[i]);
        }
        
        //精灵列表
        let fire = this.createMovie("fire", 382, 384, 2);
        let zhaoyun = this.createMovie("zhaoyun", 424, 207, 1); 
        let hair = this.createMovie("hair", 593, 133); 
        let buxiaomang = this.createMovie("buxiaoman", 605, 118);
        let diaochan = this.createMovie("diaochan", 688, 275);
        let long = this.createMovie("long", 231, 20); 
        let guanyu = this.createMovie("guanyu", 185, 9);
        let sunluban = this.createMovie("sunluban", 11, 242);
        
        //精灵动作
        fire.Action("fire", -1);
        zhaoyun.Wait();
        hair.Action("hair", -1);
        buxiaomang.Wait();
        diaochan.Action("action", -1);
        long.Action("long",-1);
        guanyu.Wait();
        sunluban.MoreAction("action11", 2, 1)

        this._shape = Common.CreateShape(0, 0, this.width, this.height);
        this.setChildIndex(this.img_light, 100);

        //定时器
        let timeNum = 100, lightNum = 0, scaleNum = 0.1;
        let time = new egret.Timer(100);
        this.img_light.scaleX = 3.6, this.img_light.scaleY = 3.6;
        time.addEventListener(egret.TimerEvent.TIMER, ()=>{

            if(timeNum == 0) sunluban.MoreAction("action11", 2, 1) ;
            if(timeNum == 1500) buxiaomang.Action("action", 2);
            else if(timeNum == 3000) guanyu.Action();
            else if(timeNum == 4000)  sunluban.MoreAction("action21", 1, 2);
            else if(timeNum == 4500) zhaoyun.Action();
            timeNum += 50;
            if(timeNum > 6000) timeNum = 0;
           
            this.img_light.scaleX += scaleNum;
            this.img_light.scaleY += scaleNum;

            lightNum++;
            if(lightNum == 4){
                lightNum = 0;
                scaleNum = -scaleNum;
            }
        }, this);
        time.start();        
    }

    private onTouchImg(event:egret.TouchEvent):void{
        let target = event.target;
        let type:number = parseInt(target.name);

        GoodsTipWindow.GetInstance().Show(this, type, target.x - 120, target.y + target.height + 10);
    }

    /**
     * 按钮处理
     */
    private onButtonHandler(event:egret.TouchEvent):void {
        this._btnFocus = event.currentTarget;
        AudioManager.GetIns().PlayMusic(AudioManager.CLICK_MUSIC);

		switch (this._btnFocus) {
			case this.btn_ready:
                SceneManager.nextScene = "battleScene";
                ResLoadManager.GetInstance().LoadGroup("ready",()=>{this.ShowPop("ReadyDialog")});
				break;
			case this.btn_equip:
                ResLoadManager.GetInstance().LoadGroup("equip",()=>{this.ShowPop("EquipDialog")});
				break;
            case this.btn_pvp:
                ResLoadManager.GetInstance().LoadGroup("pvp",()=>{
                    RankData.GetInstance().ReqRankData(()=>{this.ShowPop("PVPWindow")});
                });
                break;
			case this.btn_talent:
                ResLoadManager.GetInstance().LoadGroup("talent",()=>{this.ShowPop("TalentDialog")});
				break;
            case this.btn_shop:
                ResLoadManager.GetInstance().LoadGroup("shop",()=>{this.ShowPop("ShopDialog")});
                break;
            case this.btn_email:
                ResLoadManager.GetInstance().LoadGroup("email",()=>{
                    ModEmail.ReqGetEmail(()=>{this.ShowPop("EmailWindow");});
                });
            break;
            case this.btn_sign:
                WindowManager.GetInstance().GetWindow("SignDialog").Show();
            break;
            case this.btn_addDesk:
                if (window["sdw"].canAddDesktop) window["sdw"].addDesktop();
            break;
            case this.btn_fullscene:
                if (!this.isFull && window["sdw"].requestFullScreen) {
                    this.isFull = true;
                    // this.btn_fullscene["img_up"].source = "battle_res.quanping_01";
                    window["sdw"].requestFullScreen();
                }
                else if (this.isFull && window["sdw"].exitFullScreen) {
                    // this.btn_fullscene["img_up"].source = "battle_res.quanping_02";
                    this.isFull = false;
                    window["sdw"].exitFullScreen();
                }
            break;
		}
    }

    private ShowPop(clsName:string):void{
        let pop = WindowManager.GetInstance().GetWindow(clsName);
        pop.Show();
        Animations.fadeOut(pop);
    }

    private isShowRed(index:number):boolean{
        let isShow:boolean = false;
        if(index == 0){             //sing
            isShow = UserDataInfo.GetInstance().GetSignData().isSign ? false : true;
        } 
        else if(index == 1){        //shop
            isShow = UserDataInfo.GetInstance().GetBasicData("freeCount") == 0 ? true : false;
        }
        else if(index == 2){        //pvp
            isShow = UserDataInfo.GetInstance().GetBasicData("sportCount") == 0 ? true : false;
        }
        else if(index == 3){      //email
             let emailNum = ModEmail.GetEmailData() == null ? 0 : ModEmail.GetEmailData().length;
             isShow = emailNum != 0 ? true : false;
        }
        else if(index == 4)                                                                             //talent
        {
            let currNum:number = UserDataInfo.GetInstance().GetBasicData("curTalentPage") - 1;
            let talentPage = modTalent.getTalentData();
            let currLv = talentPage.length >= 1 ? (talentPage[currNum].count == null ? 1 : talentPage[currNum].count) : 1;
            let data:any = TcManager.GetInstance().GetDataFromLv(3,currLv);
            if(UserDataInfo.GetInstance().GetBasicData("diamond") >= data.diamond || UserDataInfo.GetInstance().GetBasicData("power") >= data.power) isShow = true;
        }
        return isShow;
    }

    private onRedEvent():void{
        for(let i:number = 0; i < this.red_list.length; i++){
            this.red_list[i].visible = this.isShowRed(i);
        }
    }

     private onChangeData(event:egret.Event):void{
       if(event.data == null){
           GameLayerManager.gameLayer().panelLayer.removeChildren();
           this.addChild(this._shape);
           Animations.fadeIn(this._shape, 350, ()=>{
              this.removeChild(this._shape);
           });
       }
       
       this.show_label_text();
    }

    private showSignDialog():void{
        if(UserDataInfo.GetInstance().GetSignData().isSign) return;

        WindowManager.GetInstance().GetWindow("SignDialog").Show();
    }

    public show_label_text():void{
        this.lab_exp.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("exp"));
        this.lab_soul.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("soul"));
        this.lab_diamond.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
        this.lab_power.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("power"));
    }


    /** button */
    private btn_shop:eui.Button;
    private btn_email:eui.Button;
    private btn_pvp:eui.Button;
    private btn_sign:eui.Button;
    private btn_talent:eui.Button;
    private btn_ready:eui.Button;
    private btn_equip:eui.Button;
    private btn_addDesk:eui.Button;
    private btn_fullscene:eui.Button;
    private _btnFocus:eui.Button;

    /** label */
    private lab_exp:eui.Label;
    private lab_soul:eui.Label;
    private lab_diamond:eui.Label;
    private lab_power:eui.Label;

    /** image */
    private img_exp:eui.Image;
    private img_soul:eui.Image;
    private img_diamond:eui.Image;
    private img_power:eui.Image;
    private img_light:eui.Image;
    private red_list:Array<egret.Bitmap>;

    /**设置弹出 */
    private _shape:egret.Shape;
    private star_list:Array<egret.Bitmap>;

    /** dialog */
    public readyDialog:ReadyDialog;
    private isFull:boolean;
}