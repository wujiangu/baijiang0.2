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
        this.obj_list = new Array();
        this.img_bg_list = new Array();
        this.time_list = new Array();
        this.icon_list = new Array();

        for(let i:number = 0; i < 5; i++){
            this.obj_list[i] = new EquipObject();
            this.emailGroup.addChild(this.obj_list[i]);
        }

        this.img_click = new egret.Bitmap(RES.getRes("email_002_png"));
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
       let contentInfo:any = this.getEmailContentInfo(tempData.emailType);
       let reward:any = TcManager.GetInstance().GetTcPVPReward(tempData.rank);
       this.lab_title.text = contentInfo.title;
       this.lab_content.text = contentInfo.content;
       this.lab_time.text = `剩余${Common.CountSurlTime(this._emailData[this._clickIndex].date, 30)}天`;
       let height:number = this.btn_get.y - this.lab_time.y - this.lab_time.height;
       let len = reward == null ? 0 : reward.length;
       let srcX = this.emailGroup.width - 105 * len >> 1

       for(let i:number = 0; i < 5; i++){
           if(len > i){
                if(reward[i].type == 1){
                    let star = reward[i].star == null ? 0 : reward[i].star;
                    let info:any = new modEquip.EquipInfo(reward[i].id, star, TcManager.GetInstance().GetTcEquipData(reward[i].id).grade);
                    info.AddAttrType(reward[i].star);
                    this.obj_list[i].ChangeEquipSource(info);
                }
                else if(reward[i].type == 2)
                {
                    this.obj_list[i].ChangeObjSource(Common.GetTextureFromType(reward[i]), reward[i].count);
                }
           }
           else this.obj_list[i].ChangeObjSource(null, 0);
         
           Common.SetXY(this.obj_list[i], 3 + srcX + i * 105, this.lab_time.y + this.lab_time.height + (height - this.obj_list[i].height >> 1));
       }
   }

    private createEmail():void{
        for(let i:number = 0; i < this._emailData.length; i++){
            if(this.group_list.length <= i ){
                this.group_list[i] = new eui.Group();
                this.img_list[i] = new egret.Bitmap(RES.getRes("common_res.email_status3"));
                this.img_bg_list[i] = new egret.Bitmap(RES.getRes("email_003_png"));
                this.icon_list[i] = new egret.Bitmap(RES.getRes("common_res.email_new"));
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
                this.group_list[i].width = this.img_list[i].width;this.group_list[i].height = this.img_list[i].height;
            }
          
            this.title_list[i].text = this.getEmailContentInfo(this._emailData[i].emailType).title;
            this.time_list[i].text = new Date(this._emailData[i].date).toLocaleDateString();
            this.img_list[i].texture = RES.getRes(`common_res.email_status${this._emailData[i].status}`);
            this.icon_list[i].visible = this._emailData[i].status == 3 ? true : false;

            this.img_bg_list[i]["index"] = i;
            this.img_bg_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchImg, this);
            Common.SetXY(this.group_list[i], 0, i * 118 + 10);
            this.scrollGroup.addChild(this.group_list[i]);
        }
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

        let reward:any = TcManager.GetInstance().GetTcPVPReward(this._emailData[this._clickIndex].rank);
        for(let i:number = 0; i < 5; i++){
            this.obj_list[i].ChangeImgMatrixFilter(strName);
        }
    }

    private onTouchBtn(event:egret.TouchEvent):void{
        switch(event.target){
            case this.btn_get:
                if(this._emailData[this._clickIndex].status == 1){
                    Animations.showTips("您已经领取过该奖励", 1, true);
                    return;
                } 

                let reward = TcManager.GetInstance().GetTcPVPReward(this._emailData[this._clickIndex].rank);
                Common.DealReward(reward);
                this.setEmailStatus(2);
            break;
            case this.btn_getAll:
                let list:any = [];
                for(let i in this._emailData){
                    if(this._emailData[i].status != 1){
                        let reward = TcManager.GetInstance().GetTcPVPReward(this._emailData[i].rank);
                        if(reward){
                            for(let j in reward){
                                list.push(reward[j]);
                            }
                        }
                    }
                }

                if(list.length == 0){
                    Animations.showTips("暂无邮件", 1, true);
                    return;
                }

                Common.DealReward(list);
                ModEmail.DealAllEmailData();
                this.initData();
            break;
            case this.btn_delete:
                if(this._emailData[this._clickIndex].status != 1){
                    Animations.showTips("该邮件暂未领取，不能删除",1, true);
                    return;
                }

                ModEmail.DelEmailData(this._emailData[this._clickIndex]);
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
        let emailData:any = ModEmail.GetEmailData();

        this._eventNum = emailData == null ? 0 : emailData.length;
        this.scrollGroup.removeChildren();
        this.emailGroup.visible = this._eventNum == 0 ? false : true;
        this.lab_tip.visible = this._eventNum == 0 ? true : false;

        if(this._eventNum == 0){
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
        this.img_list[this._clickIndex].texture = RES.getRes(`common_res.email_status${this._emailData[this._clickIndex].status}`);
        this.showRewardGoodsColor();
    }

    private getEmailContentInfo(emailType:number):any{
        switch(emailType){
            case 1:                         //PVP战斗的信息
                return {title:"PVP排名奖励",content:"PVP战斗排名奖励"};
            case 2:                        //版本奖励
                return {title:"版本更新奖励",content:"更新版本，对应的补偿奖励"};
            case 3:                        //bug修复补偿
                return {title:"bug修复补偿",content:"bug导致不愉快的游戏体验，给予相应的补偿"};
        }
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

    /** image */
    private img_list:Array<egret.Bitmap>;
    private img_click:egret.Bitmap;
    private img_bg_list:Array<egret.Bitmap>;
    private icon_list:Array<egret.Bitmap>;

    /** group */
    private group_list:Array<eui.Group>;
    private scrollGroup:eui.Group;
    private emailGroup:eui.Group;

    /** other */
    private _emailData:any;
    private _clickIndex:number;
    private _eventNum:number;
    private obj_list:Array<EquipObject>;
}