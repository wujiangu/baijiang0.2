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

        this._time = new egret.Timer(60000, 0);         //初始化定时器

        //初始化对应的数据并且加入到滚动条中
        this.img_bg = new egret.Bitmap(RES.getRes("pvp_0003_png"));
        this.txt_self = Common.CreateText("1",25, 0xc9c9c9,true,"Microsoft YaHei");
        this.txt_damage = Common.CreateText("25000",25, 0x88653f,true,"Microsoft YaHei","right");
        this.txt_damage_info = Common.CreateText("伤害值: ",22, 0x88653f,true,"Microsoft YaHei");

        this.lab_content.textFlow = <Array<egret.TextField>>[{text:"1、每日第一次挑战免费。",style:{"size":19}},{text:"\n",style:{"size":23}},
                                                             {text:"2、试炼场限时90秒，在规定时间内打出的伤害越高则获得的奖励越好",style:{"size":19}},{text:"\n",style:{"size":23}},
                                                             {text:"3、试炼场结算时间为每晚21点。",style:{"size":19}},{text:"\n",style:{"size":23}},
                                                             {text:"试炼场排名奖励"},{text:"\n",style:{"size":23}},{text:"第1名:"},{text:"\n",style:{"size":23}},
                                                             {text:"第2名:"},{text:"\n",style:{"size":23}},
                                                             {text:"第3名:"},{text:"\n",style:{"size":23}},{text:"4-10名:"},{text:"\n",style:{"size":23}},
                                                             {text:"11-50名:"},{text:"\n",style:{"size":23}},{text:"51-200名:"},{text:"\n",style:{"size":23}},
                                                             {text:"201-500名:"},{text:"\n",style:{"size":23}},{text:"501及以下:"},{text:"\n",style:{"size":23}}];

        this.scrollGroup.addChild(this.img_bg);
        this.scrollGroup.addChild(this.txt_self);
        this.scrollGroup.addChild(this.txt_damage);
        this.scrollGroup.addChild(this.txt_damage_info);

        this.txt_damage.width = 130;
        UserData.challengeNum = 0;

        //列表数据
        this.damageList = new eui.List();
        this.damageList.itemRenderer = DamageList;
        this.scrollGroup.addChild(this.damageList);

        //设置位置
        Common.SetXY(this.img_bg, this.scrollGroup.width - this.img_bg.width >> 1, 10)
        Common.SetXY(this.txt_self, 80, this.img_bg.y + (this.img_bg.height - this.txt_self.height >> 1));
        Common.SetXY(this.txt_damage, this.img_bg.width - this.txt_damage.width, this.img_bg.y + (this.img_bg.height - this.txt_damage.height >> 1));
        Common.SetXY(this.txt_damage_info, this.txt_damage.x - this.txt_damage_info.width - 10, this.img_bg.y + (this.img_bg.height - this.txt_damage.height >> 1));
        Common.SetXY(this.damageList, this.img_bg.x, this.img_bg.y + this.img_bg.height + 4);

    }

    /** 数据数据 */
    public Show():void{
        super.Show();

        if(UserData.challengeNum == 0) this.show_and_hide_btn(true, false);
        else this.show_and_hide_btn(false, true);

        this.lab_soul.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
        this.showRankInfo();
        this.upDataTime();
        this._time.start();
    }

    public Reset():void{
        this._time.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_start.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
    }

    public Close():void{
        GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA);

        this._time.stop();
        this._time.removeEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_start.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
        this.btn_buy.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchButton, this);
    }

    /** 点击开始挑战按钮 */
    private onTouchButton(event:egret.TouchEvent):void{
        let target = event.target;
        if(target == this.btn_start){
            this.Close();
            SceneManager.nextScene = "pvpScene";
            WindowManager.GetInstance().GetWindow("ReadyDialog").Show();
            UserData.challengeNum++;
        }
        else if(target == this.btn_buy){
            if(UserDataInfo.GetInstance().IsHaveGoods("diamond", 100)){
                this.Close();
                SceneManager.nextScene = "pvpScene";
                WindowManager.GetInstance().GetWindow("ReadyDialog").Show();
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
        if(currHour == 21 && currMinutes == 0){
            UserData.challengeNum = 0;
        }

        let hour:number, minuter:number;
        if(currMinutes == 0){
            hour = 21 - (currHour > 21 ? 21 - currHour : currHour);
        }
        else
            hour = 20 - (currHour > 21 ? 21 - currHour : currHour);

        minuter = 60 - currMinutes == 60 ? 0 : 60 - currMinutes;
        this.lab_time.text = "结算时间: " + hour + "时" + minuter + "分"; 
    }

    /** 显示排名的奖励 */
    private showRankInfo():void{
        let data_list = RankData.GetInstance().GetDataList();
        let rankNum = this.searchDamageRank(data_list);
        let strRank = "(当前没有排名)";
        if(rankNum != -1) strRank = "(第" + rankNum + "名)";
        this.txt_self.textFlow = <Array<egret.ITextElement>>[{text:"我    "},{text:strRank, style:{"textColor":0x252525}}];
        this.txt_damage.text = UserData.rankDamage + "";

        let tempData:any = [];
        for(let i:number = 0; i < data_list.length; i++){
            tempData[i] = {};
            tempData[i]["name"] = data_list[i]["name"];
            tempData[i]["damage"] = data_list[i]["damage"];
            tempData[i]["num"] = i + 1;
        }
        this.damageList.dataProvider = new eui.ArrayCollection(tempData);
        tempData = [];
    }

    /** 寻找自己再第几名 如果结果为-1则没有排名 */
    private searchDamageRank(data_list:any):number{
        for(let i:number = 0; i < data_list.length; i++){
            if(data_list[i].damage == UserData.rankDamage){
                return i + 1;
            }
        }

        return -1;
    }

    private show_and_hide_btn(startStatus:boolean, buyStatus:boolean):void{
        this.btn_start.visible = startStatus;
        this.btn_buy.visible = buyStatus;
    }

    private btn_close:eui.Button;
    private btn_start:eui.Button;
    private btn_buy:eui.Button;

    private lab_time:eui.Label;
    private lab_content:eui.Label;
    private scrollGroup:eui.Group;
    private damageList:eui.List;
    private img_bg:egret.Bitmap;
    private txt_self:egret.TextField;
    private txt_damage:egret.TextField;
    private txt_damage_info:egret.TextField;
    private _time:egret.Timer;
    private lab_soul:eui.Label;
}

class DamageList extends eui.ItemRenderer{
    public constructor(){
        super();
        this.skinName = "resource/game_skins/DamageInfo.exml";
    }
}