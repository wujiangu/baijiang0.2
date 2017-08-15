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
                                                             {text:"3、试炼场结算时间为每晚21点。",style:{"size":19}},{text:"\n",style:{"size":18}},
                                                             {text:"试炼场排名奖励"},{text:"\n",style:{"size":18}},{text:"第1名:"+strs[0],style:{"size":18}},{text:"\n",style:{"size":18}},
                                                             {text:"第2名:"+strs[1],style:{"size":18}},{text:"\n",style:{"size":18}},
                                                             {text:"第3名:"+strs[2],style:{"size":18}},{text:"\n",style:{"size":18}},{text:"4-10名:"+strs[3],style:{"size":18}},{text:"\n",style:{"size":18}},
                                                             {text:"11-50名:"+strs[4],style:{"size":18}},{text:"\n",style:{"size":18}},{text:"51-200名:"+strs[5],style:{"size":18}},{text:"\n",style:{"size":18}},
                                                             {text:"201-500名:"+strs[6],style:{"size":18}},{text:"\n",style:{"size":18}},{text:"501及以下:"+strs[7],style:{"size":18}},{text:"\n",style:{"size":18}}];

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
        for(let i:number = 1; i < 100; i++){
            let group = new eui.Group();
            this.scrollGroup.addChild(group);
            Common.SetXY(group, 0, i * 57);
        }

        for(let i:number = 0; i < 10; i++){
            this.damageList[i] = new DamageList();
            this.scrollGroup.addChild(this.damageList[i]);
        }
    }

    /** 数据数据 */
    public Show():void{
        super.Show();

        if(RankData.GetInstance().ChallengeNum == 0) this.show_and_hide_btn(true, false);
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
        if(this.scrollGroup.scrollV % 57 < 40 && this.scrollGroup.scrollV % 57 > 20) return; 

        this.changeRankInfo(Math.floor(this.scrollGroup.scrollV / 57));
    }

    /** 点击开始挑战按钮 */
    private onTouchButton(event:egret.TouchEvent):void{
        let target = event.target;
        if(target == this.btn_start){
            this.Close();
            SceneManager.nextScene = "pvpScene";
            WindowManager.GetInstance().GetWindow("ReadyDialog").Show();
            RankData.GetInstance().ChallengeNum++;
        }
        else if(target == this.btn_buy){
            let pvpConsume:number = RankData.GetInstance().ChallengeNum * 20 >= 100 ? 100 : RankData.GetInstance().ChallengeNum * 20;
            if(UserDataInfo.GetInstance().IsHaveGoods("diamond", pvpConsume)){
                this.Close();
                SceneManager.nextScene = "pvpScene";
                WindowManager.GetInstance().GetWindow("ReadyDialog").Show();
                RankData.GetInstance().ChallengeNum++;
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
        let strRank = rankNum != -1 ? "(第" + rankNum + "名)" : "(当前没有排名)";
        this.txt_self.textFlow = <Array<egret.ITextElement>>[{text:"我    "},{text:strRank, style:{"textColor":0x252525}}];
        this.txt_damage.text = `${UserData.rankDamage}`;

        this.changeRankInfo(Math.floor(this.scrollGroup.scrollV / 57))
    }

    /** change rank info */
    private changeRankInfo(num:number):void{
       if(num < 0 || num > RankData.GetInstance().GetDataList().length - 10) return;

        let data_list = RankData.GetInstance().GetDataList();
        let index:number = 0;
        for(let i:number = num; i < num + 10; i++){
            this.damageList[index].ChangeData(data_list[i]["name"], Math.floor(data_list[i]["damage"]), i + 1);
            Common.SetXY(this.damageList[index], 0, this.img_bg.y + this.img_bg.height + i * 57);
            index++;
        }
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
        this.btn_buy.label = RankData.GetInstance().ChallengeNum * 20 >= 100 ? `${100}` : `${RankData.GetInstance().ChallengeNum * 20}`;
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

    /** image */
    private img_bg:egret.Bitmap;
   
    /** list */
    private damageList:Array<DamageList>;

    /** other */
    private _time:egret.Timer;
    private _startIndex:number;

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