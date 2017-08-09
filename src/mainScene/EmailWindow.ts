/** 
 * email click window
 * @auto hong
 * @date 2017/7/25
 */

class EmailWindow extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/EmailDialogSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
        this.group_list = new Array();
        this.img_list   = new Array();
        this.title_list  = new Array();
        this.img_reward_list = new Array();
        this.img_bg_list = new Array();
        this.time_list = new Array();
        this.icon_list = new Array();
        this.digit_list = new Array();

        for(let i:number = 0; i < 5; i++){
            this.img_reward_list[i] = new egret.Bitmap();
            this.digit_list[i] = Common.CreateText("",20,0xff00ff,true,"Microsoft YaHei","right");
            this.emailGroup.addChild(this.img_reward_list[i]);
            this.emailGroup.addChild(this.digit_list[i]);
            this.digit_list[i].width = 92;
        }

        this.img_click = new egret.Bitmap(RES.getRes("email_002_png"));
        this._bottomGroup = new eui.Group();
    }

    public Show():void{
        super.Show();

        this._clickIndex = 0;
        this.scrollGroup.scrollV = 0;
        this.initData();
    }

    private onEventManager(type:number = 0):void{
        let btn_list:any = [this.btn_get, this.btn_delete, this.btn_getAll, this.btn_back];
        Common.ListenerAndRemoveEvent(btn_list, this.onTouchBtn, this, type);
        btn_list = [];
    }

    public Reset():void{
        this.onEventManager(1);
    }

    public Close():void{
        this.onEventManager();
        for(let i:number = 0; i < this._eventNum; i++) this.img_bg_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchImg, this);
        GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA);
    }

   private showClickInfo():void{
       this.setEmailStatus(1);
       
       let tempData:any = this._emailData[this._clickIndex];
       this.lab_title.text = tempData.title;
       this.lab_content.text = tempData.content;
       this.lab_time.text = `剩余${tempData.time}天`;
       let height:number = this.btn_get.y - this.lab_time.y - this.lab_time.height;
       let len = tempData.reward.length;
       let srcX = this.emailGroup.width - 105 * len >> 1

       for(let i:number = 0; i < 5; i++){
           this.img_reward_list[i].texture = len > i ? Common.GetTextureFromType(tempData.reward[i]) : null;
           this.digit_list[i].text = len > i ? (tempData.reward[i].type == 1 ? "1" : Common.TranslateDigit(tempData.reward[i].data)) : "";
           Common.SetXY(this.img_reward_list[i], 3 + srcX + i * 105, this.lab_time.y + this.lab_time.height + (height - this.img_reward_list[i].height >> 1));
           Common.SetXY(this.digit_list[i], this.img_reward_list[i].x, this.btn_get.y - 40);
       }
   }

    private createEmail():void{
        for(let i:number = 0; i < this._emailData.length; i++){
            if(this.group_list.length <= i ){
                this.group_list[i] = new eui.Group();
                this.img_list[i] = new egret.Bitmap(RES.getRes("email_status3_png"));
                this.img_bg_list[i] = new egret.Bitmap(RES.getRes("email_003_png"));
                this.icon_list[i] = new egret.Bitmap(RES.getRes("email_new_png"));
                this.title_list[i] = Common.CreateText("",25, 0x858685,true, "Microsoft YaHei");
                this.time_list[i] = Common.CreateText("",20, 0x858685,true, "Microsoft YaHei");
                
                this.group_list[i].addChild(this.img_bg_list[i]);
                this.group_list[i].addChild(this.img_list[i]);
                this.group_list[i].addChild(this.icon_list[i]);
                this.group_list[i].addChild(this.title_list[i]);
                this.group_list[i].addChild(this.time_list[i]);

                Common.SetXY(this.img_list[i], 15, this.img_bg_list[i].height - this.img_list[i].height >> 1);
                Common.SetXY(this.title_list[i], this.img_list[i].width + this.img_list[i].x + 10, this.img_list[i].y + 10);
                Common.SetXY(this.time_list[i], this.title_list[i].x, this.img_list[i].y + this.img_list[i].height - 20);
                Common.SetXY(this.icon_list[i], this.img_list[i].x - this.icon_list[i].width / 2, this.img_list[i].y - 5);

                this.img_bg_list[i].touchEnabled = true;
            }
          
            this.title_list[i].text = this._emailData[i].title;
            this.time_list[i].text = this._emailData[i].date
            this.img_list[i].texture = RES.getRes(`email_status${this._emailData[i].status}_png`);
            this.icon_list[i].visible = this._emailData[i].status == 3 ? true : false;

            this.img_bg_list[i]["index"] = i;
            this.img_bg_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchImg, this);
            Common.SetXY(this.group_list[i], 0, i * 118 + 10);
            this.scrollGroup.addChild(this.group_list[i]);
        }

        this.scrollGroup.addChild(this._bottomGroup);
        Common.SetXY(this._bottomGroup, 0, this._eventNum *  118 + 10);
    }

    private onTouchImg(event:egret.TouchEvent):void{
        let target = event.target;

        if(this._clickIndex == target.index) return;

        this._clickIndex = target.index;
        Common.SetXY(this.img_click, this.group_list[target.index].x, this.group_list[target.index].y);
        this.showClickInfo();
    }

    private showRewardGoodsColor():void{
        let strName:string = "";
        if(this._emailData[this._clickIndex].status == 1){
            strName = "gray";
        }

        for(let i:number = 0; i < this._emailData[this._clickIndex].reward.length; i++){
            Common.ChangeImgMatrixFilter(this.img_reward_list[i], strName);
        }
    }

    private onTouchBtn(event:egret.TouchEvent):void{
        switch(event.target){
            case this.btn_get:
                if(this._emailData[this._clickIndex].status == 1){
                    Animations.showTips("您已经领取过该奖励", 1, true);
                    return;
                } 

                Common.DealReward(this._emailData[this._clickIndex].reward);
                this.setEmailStatus(2);
            break;
            case this.btn_getAll:
                let list:any = [];
                for(let i in this._emailData){
                    if(this._emailData[i].status != 1){
                        for(let j in this._emailData[i].reward){
                            list.push(this._emailData[i].reward[j]);
                        }
                    }
                }

                if(list.length == 0){
                    Animations.showTips("暂无邮件", 1, true);
                    return;
                }

                Common.DealReward(list);
                UserDataInfo.GetInstance().SetBasicData("email", []);
                this.initData();
            break;
            case this.btn_delete:
                if(this._emailData[this._clickIndex].status != 1){
                    Animations.showTips("该邮件暂未领取，不能删除",1, true);
                    return;
                }

                UserDataInfo.GetInstance().RemoveEmailFromIndex(this._clickIndex);
                this._clickIndex = this._clickIndex - 1 >= 0 ? this._clickIndex - 1 : 0;
                for(let i:number = 0; i < this._eventNum; i++) this.img_bg_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchImg, this);
                this.initData();
            break;
            default:
                this.Close();
            break;
        }
    }

     private initData():boolean{
        let emailData:any = UserDataInfo.GetInstance().GetBasicData("email");
        this._eventNum = emailData.length;
        this.scrollGroup.removeChildren();
        this.emailGroup.visible = emailData.length == 0 ? false : true;
        this.lab_tip.visible = emailData.length == 0 ? true : false;

        if(emailData.length == 0){
            return;
        }
        
        this._emailData = emailData;
        this.createEmail();
        this.showClickInfo();

        this.scrollGroup.addChild(this.img_click);
        Common.SetXY(this.img_click, this.group_list[this._clickIndex].x, this.group_list[this._clickIndex].y);
    }

    /** set email status
     * @param clickType click gooods type 1 click email  2 click btn_Get
     */
    private setEmailStatus(clickType:number):void{
        //if status is three can trantion status to 2
        if(clickType == 1 && this._emailData[this._clickIndex].status == 3){
            this._emailData[this._clickIndex].status = 2;
            this.icon_list[this._clickIndex].visible = this._emailData[this._clickIndex].status == 3 ? true : false;
        }
        else if(clickType == 2 && this._emailData[this._clickIndex].status == 2){
            this._emailData[this._clickIndex].status = 1;
        }
        this.img_list[this._clickIndex].texture = RES.getRes(`email_status${this._emailData[this._clickIndex].status}_png`);
        this.showRewardGoodsColor();
        UserDataInfo.GetInstance().SetBasicData("email", this._emailData);
    }

    /** button */
    private btn_back:eui.Button;
    private btn_get:eui.Button;
    private btn_getAll:eui.Button;
    private btn_delete:eui.Button;
  
    /** label */
    private lab_title:eui.Label;
    private lab_content:eui.Label;
    private lab_tip:eui.Label;
    private lab_time:eui.Label;
    private title_list:Array<egret.TextField>;
    private time_list:Array<egret.TextField>;
    private digit_list:Array<egret.TextField>;

    /** image */
    private img_list:Array<egret.Bitmap>;
    private img_reward_list:Array<egret.Bitmap>;
    private img_click:egret.Bitmap;
    private img_bg_list:Array<egret.Bitmap>;
    private icon_list:Array<egret.Bitmap>;

    /** group */
    private group_list:Array<eui.Group>;
    private scrollGroup:eui.Group;
    private emailGroup:eui.Group;
    private _bottomGroup:eui.Group;

    /** other */
    private _emailData:any;
    private _clickIndex:number;
    private _eventNum:number;
}