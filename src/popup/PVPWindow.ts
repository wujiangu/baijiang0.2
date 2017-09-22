class PVPWindow extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/PVPWindow.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{

        this.damageList = new Array();
        this._time = new egret.Timer(60000, 0);         //初始化定时器

        //初始化对应的数据并且加入到滚动条中
        this.img_bg = new egret.Bitmap(RES.getRes("pvp_0003_png"));
        this.txt_self = Common.CreateText("1",25, 0xc9c9c9,true,"Microsoft YaHei");
        this.txt_damage = Common.CreateText("25000",25, 0x88653f,true,"Microsoft YaHei","right");
        this.txt_damage_info = Common.CreateText("伤害值: ",22, 0x88653f,true,"Microsoft YaHei");
        let strs:Array<string> = modPVP.detailReward();
        this.lab_content.textFlow = <Array<egret.TextField>>[{text:"1、每日第一次挑战免费。",style:{"size":19}},{text:"\n",style:{"size":18}},
                                                             {text:"2、试炼场限时90秒，在规定时间内打出的伤害越高则获得的奖励越好",style:{"size":19}},{text:"\n",style:{"size":18}},
                                                             {text:"3、试炼场奖励每周一凌晨0：00点结算。\n",style:{"size":19}},{text:"试炼场排名奖励"},{text:"\n",style:{"size":18}}];

        this.scrollGroup.addChild(this.img_bg);
        this.scrollGroup.addChild(this.txt_self);
        this.scrollGroup.addChild(this.txt_damage);
        this.scrollGroup.addChild(this.txt_damage_info);
        this.txt_damage.width = 130;

        //设置位置
        Common.SetXY(this.img_bg, this.scrollGroup.width - this.img_bg.width >> 1, 10)
        Common.SetXY(this.txt_self, 80, this.img_bg.y + (this.img_bg.height - this.txt_self.height >> 1));
        Common.SetXY(this.txt_damage, this.img_bg.width - this.txt_damage.width, this.img_bg.y + (this.img_bg.height - this.txt_damage.height >> 1));
        Common.SetXY(this.txt_damage_info, this.txt_damage.x - this.txt_damage_info.width - 10, this.img_bg.y + (this.img_bg.height - this.txt_damage.height >> 1));
        this._bottomGroup = new eui.Group();
        this.scrollGroup.addChild(this._bottomGroup);

        for(let i:number = 0; i < 10; i++){
            this.damageList[i] = new DamageList();
            this.scrollGroup.addChild(this.damageList[i]);
        }

        this.showRewardGoods();
    }

    /** 数据数据 */
    public Show():void{
        super.Show();
        this.scrollGroup.scrollV = 0;
        this.lab_soul.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));

        let isFirst:boolean = UserDataInfo.GetInstance().GetBasicData("sportCount") == 0 ? true : false;
        this.show_and_hide_btn(isFirst, !isFirst);
        this.showRankInfo();
        this.upDataTime();
        this._time.start();
    }

    public Reset():void{
        this._time.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
        this.scroller.addEventListener(egret.Event.CHANGE, this.onScrollChange, this);
    }

    public Close():void{
        GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA);

        this._time.stop();
        this._time.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_start.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
        this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
        this.scroller.removeEventListener(egret.Event.CHANGE, this.onScrollChange, this);
    }

    private onScrollChange(event:egret.Event):void{
        if(this.scrollGroup.scrollV <= 0){
            this.changeRankInfo(0);
            return;
        } 

        if(Math.abs(this.scrollGroup.scrollV % 57 - 57) > 15 && Math.abs(this.scrollGroup.scrollV % 57 - 57) < 35) 
            this.changeRankInfo(Math.floor(this.scrollGroup.scrollV / 57) - 1);
    }

    private onEnterReady():void{
         ResLoadManager.GetInstance().LoadGroup("ready", ()=>{
            this.Close();
            SceneManager.nextScene = "pvpScene";
            WindowManager.GetInstance().GetWindow("ReadyDialog").Show();
            UserDataInfo.GetInstance().DealUserData("sportCount", UserDataInfo.GetInstance().GetBasicData("sportCount") + 1);
        })
    }

    /** 点击开始挑战按钮 */
    private onTouchButton(event:egret.TouchEvent):void{
        let target = event.target;
        if(target == this.btn_start){
           this.onEnterReady();
        }
        else if(target == this.btn_buy){
            let pvpConsume:number = UserDataInfo.GetInstance().GetBasicData("sportCount") * 20 >= 100 ? 100 : UserDataInfo.GetInstance().GetBasicData("sportCount") * 20;
            if(UserDataInfo.GetInstance().GetBasicData("diamond") >= pvpConsume){
                let strData:any = [{text:"需要花费",style:{"textColor":0x7F7676}},{text:`${pvpConsume}钻石`,style:{"textColor":0x2D6EA6}},
                                   {text:"才能挑战，点击确认后钻石不返还！",style:{"textColor":0x7F7676}},{text:"\n",style:{"size":30}}];
                WindowManager.GetInstance().GetWindow("SDDialog").Show(strData,()=>{
                    UserDataInfo.GetInstance().IsHaveGoods("diamond", pvpConsume,()=>{this.onEnterReady();});
                })
            }
            else
            {
                 Animations.showTips("钻石不足，无法挑战", 1, true);
            }
        }
    }

    /** 时间定时器 */
    private onTimer(event:egret.TimerEvent):void{
        this.upDataTime();
    }

    /** 更新系统时间 */
    private upDataTime():void{
        let date = new Date();
        let currHour = date.getHours();
        let currMinutes = date.getMinutes();
        let surlDay:number = 7 - date.getDay();

        let hour:number = (currMinutes == 0 ? 24 : 23) - currHour;
        let minuter:number = 60 - currMinutes == 60 ? 0 : 60 - currMinutes;
        this.lab_time.text = "结算时间: " + surlDay + "天" + hour + "时" + minuter + "分"; 
    }

    /** 显示排名的奖励 */
    private showRankInfo():void{

        let data_list = RankData.GetInstance().GetDataList();
        let rankNum = this.searchDamageRank(data_list);
        let strRank = rankNum != -1 ? "(第" + rankNum + "名)" : "(当前没有排名)";
        this.txt_self.textFlow = <Array<egret.ITextElement>>[{text:UserDataInfo.GetInstance().GetBasicData("roleName")},{text:strRank, style:{"textColor":0x252525}}];
        this.txt_damage.text = `${UserDataInfo.GetInstance().GetBasicData("damage")}`;
        this._bottomGroup.height = (this.img_bg.height + 8) * (data_list.length + 2);
        this.changeRankInfo(0);
    }

    /** change rank info */
    private changeRankInfo(num:number):void{
       let data_list = RankData.GetInstance().GetDataList();
       if(num < 0 || (data_list.length >= 10 &&  num > RankData.GetInstance().GetDataList().length - 10)) return;

        let index:number = 0;
        for(let i:number = num; i < num + 10; i++){
            if(data_list.length > index && i < data_list.length){
                this.damageList[index].ChangeData(data_list[i].roleName, Math.floor(data_list[i].damage), i + 1);
                Common.SetXY(this.damageList[index], this.img_bg.x, this.img_bg.y + this.img_bg.height + i * 57);
            }
            this.damageList[index].visible = data_list.length > index ? true : false;
            index++;
        }
    }

    /** 寻找自己再第几名 如果结果为-1则没有排名 */
    private searchDamageRank(data_list:any):number{
        for(let i:number = 0; i < data_list.length; i++){
            if(data_list[i].damage == UserDataInfo.GetInstance().GetBasicData("damage")){
                return i + 1;
            }
        }

        return -1;
    }

    private show_and_hide_btn(startStatus:boolean, buyStatus:boolean):void{
        this.btn_start.visible = startStatus;
        this.btn_buy.visible = buyStatus;
        this.btn_buy.label = UserDataInfo.GetInstance().GetBasicData("sportCount") * 20 >= 100 ? `${100}` : `${UserDataInfo.GetInstance().GetBasicData("sportCount") * 20}`;
    }

    /** create show goods */
    private createRewardView(data:any, index:number):eui.Group{
        let group = new eui.Group();
        let goods_list:Array<any> = new Array();
        let srcX:number = 457 - 104 * data.reward.length >> 1;
        let txtName:egret.TextField = Common.CreateText(data.name, 16,index == 0 ? 0xC19536 : 0x858685, true,"Microsoft YaHei");
        group.addChild(txtName);

        for(let i:number = 0; i < data.reward.length; i++){
            if(data.reward[i].type == 1){
                let info = new modEquip.EquipInfo(data.reward[i].id, data.reward[i].star, 5);
                info.AddAttrType(data.reward[i].star);
                goods_list[i]= new EquipObject();
                goods_list[i].ChangeEquipSource(info);
            }
            else
            {
                goods_list[i] = new egret.Bitmap(Common.GetTextureFromType(data.reward[i]));
            }

            group.addChild(goods_list[i]);

            let txtNum:egret.TextField = Common.CreateText(data.reward[i].type == 1 ? "":Common.TranslateDigit(data.reward[i].count),16,0xE0E0E0,true,"Microsoft YaHei","right");
            group.addChild(txtNum);
            txtNum.width = goods_list[i].width - 10;
            txtNum.stroke = 3;txtNum.strokeColor = 0x000000;

            Common.SetXY(goods_list[i], srcX + i * 104, txtName.y + txtName.height + 5);
            Common.SetXY(txtNum, goods_list[i].x , goods_list[i].y + goods_list[i].height - 25);
        }
        group.height = txtName.height + 5 + 105;
    
        return group;
    }

    /** show reward goods info */
    private showRewardGoods():void{
        let rewardData:any = TcManager.GetInstance().GetTcListFromIndex(6);
        if(rewardData == null ) return;

        let group_list:Array<eui.Group> = new Array();
        for(let i:number = 0; i < rewardData.length; i++){
            group_list[i] = this.createRewardView(rewardData[i], i);    
            this.rewardGroup.addChild(group_list[i]);
            Common.SetXY(group_list[i], this.lab_content.x, this.lab_content.y + this.lab_content.height + i * group_list[i].height);
        }
    }

    /** button */
    private btn_close:eui.Button;
    private btn_start:eui.Button;
    private btn_buy:eui.Button;

    /** label */
    private lab_time:eui.Label;
    private lab_content:eui.Label;
    private txt_self:egret.TextField;
    private txt_damage:egret.TextField;
    private txt_damage_info:egret.TextField;
    private lab_soul:eui.Label;
    
    /** Group */
    private scrollGroup:eui.Group;
    private scroller:eui.Scroller;
    private rewardGroup:eui.Group;

    /** image */
    private img_bg:egret.Bitmap;
   
    /** list */
    private damageList:Array<DamageList>;

    /** other */
    private _time:egret.Timer;
    private _startIndex:number;
    private _bottomGroup:eui.Group;
}

class DamageList extends eui.Component{
    public constructor(){
        super();
        this.skinName = "resource/game_skins/DamageInfo.exml";
    }

    public ChangeData(name:string, damage:number, rankNum:number):void{
        this.lab_index.text  = `${rankNum}`;
        this.lab_name.text   = name;
        this.lab_damage.text = `${damage}`;
    }

    private lab_index:eui.Label;
    private lab_name:eui.Label;
    private lab_damage:eui.Label;
}