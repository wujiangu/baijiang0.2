/**
 * 战斗场景部件
 */
class BattleSceneCom extends Base {
    public name = "BattleSceneCom"
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/battleSkin.exml";
        this.img_killCount = Utils.createBitmap("battle_0010_png");
        this.img_killCount.x = 350;
        this.img_killCount.y = 594;
        this.img_killCount.width = 414;
        this.group_top.addChild(this.img_killCount);
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
        TimerManager.getInstance().stopTimer();
        modBattle.stop();
        let pop = WindowManager.GetInstance().GetWindow("BattlePausePop");
        pop.Show();
        Animations.fadeOut(pop);
    }

    /**失败弹窗 */
    public onFailPop():void {
        // Common.log("杀敌总数------>", modBattle.getSumkill());
        TimerManager.getInstance().stopTimer();
        modBattle.stop();
        this.battleFailPop = WindowManager.GetInstance().GetWindow("BattleFailPop");
        this.battleFailPop.Show();
        SceneManager.battleScene.addChild(this.battleFailPop);
        Animations.fadeOut(this.battleFailPop);
    }

    /**设置弹出的内容显示 */
    public show():void {
        //测试
        if (GameData.curStage == ConfigManager.tcStage.length) GameData.curStage = 1;
        let tcStage = ConfigManager.tcStage[GameData.curStage-1];
        this.img_skillMask.visible = false;
        this.img_killCount.scaleX = 0;
        this.img_skillBg.source = `${GameData.curHero}_skillBg_png`;
        let object:any = this.btn_skill.getChildAt(0);
        let skill = this._getActSkill();
        object.source = `skill_${skill.image_id}_png`;
        this.img_hp.scaleX = 1.0;
        this.img_shield.scaleX = 0;
        this.cd_time = 0;
        this.lab_cdTime.visible = false;
        this.lab_killCount.text = `0/${tcStage.count}`;
        this.lab_stage.text = `第${GameData.curStage}关`;
        this.lab_stage.alpha = 0;
        this.lab_exp.text = "0";
        this.lab_soul.text = "0";
        let id = modHero.getIdFromKey(GameData.curHero);
        let index = modHero.getIndextFromId(id);
        this.lab_name.text = ConfigManager.tcHero[index].name;
        this.img_headIcon.source = ConfigManager.tcHero[index].icon;
        //英雄的数据
        let data = ConfigManager[`${GameData.curHero}Attr`];
        let level:number = HeroData.getHeroData(GameData.curHero).lv;
        let attr = data[level - 1];
        // let attr = data[0];
        this._sumHP = attr.hp;
        Animations.fadeOutIn(this.lab_stage);
    }

    /**设置经验魂石的值 */
    public setExpAndSoul(exp:number, soul:number):void {
        this.lab_exp.text = exp.toString();
        this.lab_soul.text = soul.toString();
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
            sum = ConfigManager.tcStage[curStage-1].count;
            this.lab_stage.text = `第${curStage}关`;
            this.lab_stage.alpha = 0;
            Animations.fadeOutIn(this.lab_stage);
        }
        this.lab_killCount.text = `${num}/${sum}`;
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

    /**复活 */
    public onRevive(isPassive:boolean = false, value:number = 1):void {
        if (!isPassive){
            this.cd_time = 0;
            this.lab_cdTime.visible = false;
            this.img_skillMask.visible = false;
            value = this._sumHP;
        }
        Common.log("实际--->", value, "总共---->", this._sumHP);
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

    public group_top:eui.Group;
    public group_btn:eui.Group;
    private _sumHP:number;
    /**暂停 */
    private btn_pause:eui.Button;
    private btn_skill:eui.Button;
    private battleFailPop:PopupWindow;
    private stage_count:number;
    private cd_time:number;

    /*******************图片和文字************************/
    private img_headIcon:eui.Image;
    private lab_name:eui.Label;
    private img_hp:eui.Image;
    private img_shield:eui.Image;
    private img_killCount:egret.Bitmap;
    private lab_killCount:eui.Label;
    private lab_cdTime:eui.Label;
    private img_skillMask:eui.Image;
    private lab_stage:eui.Label;
    private img_skillBg:eui.Image;
    private lab_exp:eui.Label;
    private lab_soul:eui.Label;
}