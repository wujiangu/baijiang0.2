/**
 * 战斗场景部件
 */
class BattleSceneCom extends Base {
    public name = "BattleSceneCom"
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/battleSkin.exml";
        // this.img_killCount = Utils.createBitmap("battle_res.battle_0010");
        // this.img_killCount.x = 350;
        // this.img_killCount.y = 594;
        // this.img_killCount.width = 414;
        // this.group_top.addChild(this.img_killCount);
        this.lab_max = Utils.createBitmapText("battleFnt_fnt", this.group_history);
        this.lab_max.letterSpacing = -5;
        this.lab_stage = Utils.createBitmapText("battleFnt_fnt", this.group_stage);
        this.lab_stage.letterSpacing = -10;
        this.lab_stage.textAlign = "center";
        this.img_boss = new Array();
        this.img_boss.push(this.img_boss1);
        this.img_boss.push(this.img_boss2);
        this.img_boss.push(this.img_boss3);
        this.img_boss.push(this.img_boss4);
    }

    private onComplete():void {
        this.btn_pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPause, this);
        this.btn_skill.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            if (this.cd_time == 0) {
                GameData.heros[0].gotoSkill();
            }
        }, this);
    }

    /**暂停监听 */
    private onPause(event:egret.TouchEvent):void {
        // if (SceneManager.battleScene.guideStage == 0) {
            TimerManager.getInstance().stopTimer();
            modBattle.stop();
            modBuff.randomBuffStop(GameData.heros[0]);
            let pop = WindowManager.GetInstance().GetWindow("BattlePausePop");
            pop.Show();
            Animations.fadeOut(pop);
        // }
    }

    /**失败弹窗 */
    public onFailPop(isExit:boolean=false):void {
        // Common.log("杀敌总数------>", modBattle.getSumkill());
        TimerManager.getInstance().stopTimer();
        modBattle.stop();

        if(modBattle.getSumkill() >= ModBasic.KILLNUM){
            WindowManager.GetInstance().GetWindow("ShareWindow").Show({type:2, data:0}, ()=>{
                WindowManager.GetInstance().GetWindow("BattleFailPop").Show(isExit);
            });
        }
        else WindowManager.GetInstance().GetWindow("BattleFailPop").Show(isExit);
    }

    /**设置弹出的内容显示 */
    public show():void {
        //测试
        if (GameData.curStage == ConfigManager.tcStage.length) GameData.curStage = 1;
        let tcStage = ConfigManager.tcStage[GameData.curStage-1];
        this.img_skillMask.visible = false;
        this.img_killCount.scaleX = 0;
        this.img_skillBg.source = `battle_res.${GameData.curHero}_skillBg`;
        let object:any = this.btn_skill.getChildAt(0);
        let id = modHero.getIdFromKey(GameData.curHero);
        let skill = this._getActSkill();
        object.source = `talAndSkill_res.skill_${skill.image_id}`;
        this.img_hp.scaleX = 1.0;
        this.img_shield.scaleX = 0;
        this.cd_time = 0;
        this.lab_cdTime.visible = false;
        this.lab_killCount.text = `0/${modBattle.getCurChapterSum(GameData.curStage)}`;
        this.lab_stage.text = this.stageStr(GameData.curStage);
        this.lab_stage.anchorOffsetX = this.lab_stage.width/2;
        if (!GameData.isDebug) this.lab_max.text = UserDataInfo.GetInstance().GetBasicData("lv").toString()+"斩";
        else this.lab_max.text = "1000斩";
        // this.lab_stage.alpha = 0;
        this.lab_exp.text = "0";
        this.lab_soul.text = "0";
        let index = modHero.getIndextFromId(id);
        this.lab_name.text = ConfigManager.tcHero[index].name;
        this.img_headIcon.source = ConfigManager.tcHero[index].icon;
        //英雄的数据
        let data = ConfigManager[`${GameData.curHero}Attr`];
        let level:number = HeroData.getHeroData(GameData.curHero).lv;
        let attr = data[level - 1];
        // let attr = data[0];
        this._sumHP = attr.hp;
        // Animations.fadeOutIn(this.lab_stage);
        this.arrayBuff = [];
        this.resetIcon();
    }

    /**设置经验魂石的值 */
    public setExpAndSoul(exp:number, soul:number):void {
        this.lab_exp.text = exp.toString();
        this.lab_soul.text = soul.toString();
    }

    public getCDtime():number {
        return this.cd_time;
    }

    /**更新界面 */
    public update(num:number, sum:number, isBoss:boolean=false):void {
        if (!isBoss) {
            this.img_killCount.scaleX = num/sum;
        }else{
            this.img_killCount.scaleX = 0;
            num = 0;
            let curStage = GameData.curStage + 1;
            if (GameData.curStage == ConfigManager.tcStage.length){
                curStage = 1;
            }
            sum = modBattle.getCurChapterSum(curStage);
            // sum = ConfigManager.tcStage[curStage-1].count;
            this.lab_stage.text = this.stageStr(curStage);
            this.lab_stage.anchorOffsetX = this.lab_stage.width/2;
            // this.lab_stage.alpha = 0;
            // Animations.fadeOutIn(this.lab_stage);
            this.resetIcon();
        }
        this.lab_killCount.text = `${num}/${sum}`;
    }

    /**技能cd清零 */
    public cdTimeClear():void {
        this.cd_time = 0;
        this.lab_cdTime.visible = false;
        this.img_skillMask.visible = false;
        TimerManager.getInstance().remove(this.timerCD, this);
    }

    /**技能cd */
    public onCDTime(cd:number):void {
        this.cd_time = cd;
        this.lab_cdTime.text = `${this.cd_time}`;
        this.lab_cdTime.visible = true;
        this.img_skillMask.visible = true;
        TimerManager.getInstance().doTimer(1000, 0, this.timerCD, this);
    }
    private timerCD():void {
        if (this.cd_time == 0) return;
        this.cd_time --;
        this.lab_cdTime.text = `${this.cd_time}`;
        if (this.cd_time == 0) {
            this.lab_cdTime.visible = false;
            this.img_skillMask.visible = false;
        }
    }

    /**设置血量的长度 */
    public setHpProgress(value:number):void {
        this.img_hp.scaleX = value/this._sumHP;
    }

    /**设置护盾的长度 */
    public setShieldProgress(value:number):void {
        this.img_shield.scaleX = value/this._sumHP;
    }

    public setSumHp(value:number):void {
        this._sumHP = value;
    }

    /**更新buff图标 */
    private updateBuffIcon():void {
        // this.buffGroup.removeChildren();
        for (let i = 0; i < this.arrayBuff.length; i++) {
            let icon = this.arrayBuff[i];
            this.buffGroup.removeChild(icon);
            icon.y = 40 * i;
            this.buffGroup.addChild(icon);
        }
    }

    /**增加buff图标 */
    public addBuffIcon(group:egret.DisplayObjectContainer, name:string, type:number=1):void {
        if (this._isExistBuff(name)) return;
        // let icon:egret.DisplayObjectContainer = group;
        group["type"] = type;
        group.name = name;
        group.x = group.width;
        group.y = this.arrayBuff.length * 40;
        this.arrayBuff.push(group);
        this.buffGroup.addChild(group);
        egret.Tween.get(group).to({x:0}, 200, egret.Ease.elasticOut);
    }

    /**删除buff图标 */
    public removeBuffIcon(name:string):void {
        for (let i = 0; i < this.arrayBuff.length; i++) {
            if (this.arrayBuff[i].name == name) {
                let icon = this.arrayBuff[i];
                egret.Tween.get(icon).to({x:icon.width}, 200, egret.Ease.elasticIn).call(()=>{
                    this.buffGroup.removeChild(icon);
                    this.updateBuffIcon();
                });
                this.arrayBuff.splice(i, 1);
                break;
            }
        }
    }

    /**清空buff图标 */
    public clearBuffIcon():void {
        this.arrayBuff = [];
        this.buffGroup.removeChildren();
    }

    /**获取buff的数量 */
    public getBuffCount():number {
        let count:number = 0;
        if (this.arrayBuff.length > 0) {
            for (let i = 0; i < this.arrayBuff.length; i++) {
                if (this.arrayBuff[i]["type"] == 1) count ++;
            }
        }
        return count;
    }

    /**复活 */
    public onRevive(isPassive:boolean = false, value:number = 1):void {
        if (!isPassive){
            this.cd_time = 0;
            this.lab_cdTime.visible = false;
            this.img_skillMask.visible = false;
            value = this._sumHP;
        }
        this.img_hp.scaleX = value/this._sumHP;
    }

    public removeEventListener():void {
        Common.removeEventListener(GameEvents.EVT_PRODUCEMONSTER, this.update, this);
        Common.removeEventListener(GameEvents.EVT_SKILL, this.onCDTime, this);
    }

    private _getActSkill():any {
        let skill:any;
        let index = modHero.getCurIndex();
        let skill_id = ConfigManager.tcHero[index].skill[2];
        for (let j = 0; j < ConfigManager.tcSkill.length; j++) {
            if (ConfigManager.tcSkill[j].id == skill_id) {
                skill = ConfigManager.tcSkill[j];
                break;
            }
        }
        return skill;
    }

    /**判断是否已存在buff */
    private _isExistBuff(name:string):boolean {
        let status:boolean = false;
        for (let i = 0; i < this.arrayBuff.length; i++) {
            if (this.arrayBuff[i].name == name) {
                status = true;
                break;
            }
        }
        return status;
    }

    /**隐藏按钮 */
    public btnStatus(status:boolean):void {
        this.group_btn.visible = status;
    }

    /**关卡标识 */
    private stageStr(stage:number):string {
        let hanzi:Array<string> = ["一","二","三","四","五","六","七","八","九","十"];
        let str: string = "";
        var stageArr = stage.toString().split('');
        if (stage <= 10) {
            str = "第"+hanzi[stage-1]+"关";
        }
        else if (stage > 10 && stage < 100) {
            let ten: number = parseInt(stageArr[stageArr.length - 2]);
            let bit: number = parseInt(stageArr[stageArr.length - 1]);
            if (ten == 1) {
                str = "第十"+hanzi[bit-1]+"关";
            } else {
                if (bit == 0) str = "第" + hanzi[ten - 1] + "十关";
                else str = "第" + hanzi[ten - 1] + "十" + hanzi[bit - 1] + "关";
            }
        }
        else {
            let hun: number = parseInt(stageArr[stageArr.length - 3]);
            let ten: number = parseInt(stageArr[stageArr.length - 2]);
            let bit: number = parseInt(stageArr[stageArr.length - 1]);
            if (ten == 0 && bit == 0) str = "第" + hanzi[hun - 1] + "百关";
            else if (ten == 0 && bit > 0) str = "第" + hanzi[hun - 1] + "百零" + hanzi[bit - 1] + "关";
            else if (bit == 0 && ten > 0) str = "第" + hanzi[hun - 1] + "百" + hanzi[ten - 1] + "十关";
            else str = "第" + hanzi[hun - 1] + "百" + hanzi[ten - 1] + "十" + hanzi[bit - 1] + "关";
        }
        return str;
    }

    /**
     * 精英怪图标变化
     */
    public changeEliteIcon(num:number):void {
        this.img_boss[num-1].source = "battle_res.battle_0016";
        // let curStage = GameData.curStage + 1;
        this.lab_stage.text = this.stageStr(GameData.curStage);
        this.lab_stage.anchorOffsetX = this.lab_stage.width/2;
    }
    /**重置图标 */
    public resetIcon():void {
        for (let i = 0; i < this.img_boss.length; i++) {
            this.img_boss[i].source = "battle_res.battle_0005";
        }
    }

    public group_top:eui.Group;
    public group_btn:eui.Group;
    /**buff组 */
    private buffGroup:eui.Group;
    /**历史战绩组 */
    private group_history:eui.Group;
    /**关卡 */
    private group_stage:eui.Group;
    /**buff图标组 */
    private arrayBuff:Array<egret.DisplayObjectContainer>
    private _sumHP:number;
    /**暂停 */
    private btn_pause:eui.Button;
    private btn_skill:eui.Button;
    private stage_count:number;
    private cd_time:number;

    /*******************图片和文字************************/
    private img_headIcon:eui.Image;
    private lab_name:eui.Label;
    private img_hp:eui.Image;
    private img_shield:eui.Image;
    // private img_killCount:egret.Bitmap;
    private img_killCount:eui.Image;
    private lab_killCount:eui.Label;
    private lab_cdTime:eui.Label;
    private img_skillMask:eui.Image;
    private lab_stage:egret.BitmapText;
    private img_skillBg:eui.Image;
    private lab_exp:eui.Label;
    private lab_soul:eui.Label;
    private lab_max:egret.BitmapText;
    /**精英怪图标 */
    private img_boss:Array<eui.Image>;
    private img_boss1:eui.Image;
    private img_boss2:eui.Image;
    private img_boss3:eui.Image;
    private img_boss4:eui.Image;
}