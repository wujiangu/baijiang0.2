/**
 * 战斗暂停弹窗
 */
class BattleFailPop extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/battleFailPopSkin.exml";
    }

    protected childrenCreated():void {
        
    }

    private onComplete():void {
        this.btn_giveup.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
        this.btn_reavival.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnHandler, this);
    }

    /**按钮监听 */
    private onBtnHandler(event:egret.TouchEvent):void {
        // this.parent.removeChild(this);
        switch (event.currentTarget) {
            case this.btn_reavival:
                if (this.typeBtn2 == 0) {
                    if (!GameData.isDebug) {
                        if(UserDataInfo.GetInstance().IsHaveGoods("diamond", this.value)){
                            this.count ++;
                            SceneManager.mainScene.show_label_text();
                            UserDataInfo.GetInstance().SetBasicData("revivalCount", this.count);
                        }else{
                            Animations.showTips("钻石不足，无法复活", 1, true);
                            return;
                        }
                    }
                    modBattle.recycleHero();
                    egret.setTimeout(()=>{
                        SceneManager.battleScene.effectLayer.removeChildren();
                        SceneManager.battleScene.createHero();
                        TimerManager.getInstance().startTimer();
                        SceneManager.battleScene.battleSceneCom.onRevive();
                    }, this, 200);
                    this.parent.removeChild(this);
                }else{
                    Animations.sceneTransition(()=>{
                        SceneManager.battleScene.cleanChildren();
                        GameData.curStage = 1;
                        DragonBonesFactory.getInstance().removeTimer();
                        GameLayerManager.gameLayer().sceneLayer.addChild(SceneManager.mainScene);
                    });
                    this.parent.removeChild(this);
                }
            break;
            default:
                if (this.typeBtn1 == 0) {
                    this.toRewardWindow();
                }else{
                    Common.log("分享");
                }
            break;
        }
    }

    /**切换为结算界面 */
    private toRewardWindow():void {
        Animations.popupIn(this.group_fail, 300, ()=>{
            let img_diammond:any = this.btn_reavival.getChildAt(2);
            img_diammond.visible = false;
            this.img_bg.source = "battle_0006_png";
            this.group_killCount1.visible = false;
            this.group_killProg.visible = false;
            this.group_killCount2.visible = true;
            this.group_item.visible = true;
            this.group_hero.visible = true;
            this.btn_giveup.label = "分享";
            this.btn_reavival.label = "返回主界面";
            this.typeBtn1 = 1;
            this.typeBtn2 = 1;
            Animations.popupOut(this.group_fail, 300, ()=>{
                if (this._isUp) {
                    this.img_upgrade.visible = true;
                    egret.Tween.get(this.img_upgrade).to({y:this.img_upgrade.y - 100, alpha:0}, 800).call(()=>{
                        this.img_upgrade.visible = false;
                        egret.Tween.removeTweens(this.img_upgrade);
                    });
                }
                egret.Tween.get(this.img_exp).to({scaleX:this._scaleX}, 300).call(()=>{
                    egret.Tween.removeTweens(this.img_exp);
                });
            });
        })
    }

    /**设置弹出的内容显示 */
    public Show():void {
        super.Show();
        //阵亡界面内容
        this.img_bg.source = "battle_0008_png";
        let maxCount:number = 0;
        let killCount:number = modBattle.getSumkill();
        this.lab_killCount1.text = killCount.toString();
        this.lab_curKill.text = killCount.toString();
        if (killCount <= 1000) maxCount = 1000;
        else{
            maxCount = Math.ceil(killCount/1000) * 1000;
        }
        this.lab_maxKill.text = maxCount.toString();
        this.prog_killCount.scaleX = killCount/maxCount;
        this.img_knife.x = 112 + 450 * (killCount/maxCount);
        this.btn_giveup.label = "结束";
        this.count = UserDataInfo.GetInstance().GetBasicData("revivalCount");
        this.value = (this.count <= 5 ? this.count:5) * 10;
        let img_diammond:any = this.btn_reavival.getChildAt(2);
        img_diammond.visible = true;
        if (this.count == 0) {
            img_diammond.visible = false;
            this.btn_reavival.label = `复活(免费)`;
        }else{
            this.btn_reavival.label = `复活     ${this.value}`;
        }

        //结算界面内容
        this.lab_killCount2.text = killCount.toString();
        this.lab_exp.text = modBattle.getExp().toString();
        this.lab_soul.text = modBattle.getSoul().toString();
        this.img_heroIcon.source = `img_${GameData.curHero}1_png`;
        this.img_upgrade.visible = false;
        this.img_upgrade.y = 0;
        let id = modHero.getIdFromKey(GameData.curHero);
        this.lab_name.text = modHero.getNameFromId(id);
        this.img_exp.scaleX = 0;
        //英雄数据
        let tcHeroUp = ConfigManager.tcHeroUp;
        let data:any = HeroData.getHeroData(GameData.curHero);
        let level:number = data.lv;
        let exp:number = data.exp;
        let getExp:number = modBattle.getExp() + exp;
        let upLv = 0;
        let upExp = 0;
        this._isUp = false;
        Common.log("before等级---->", level, exp, getExp, tcHeroUp[0]);
        for (let i = level-1; i < 300; i++) {
            if (getExp >= tcHeroUp[i].exp) {
                getExp -= tcHeroUp[i].exp;
            }else{
                upLv = i + 1;
                upExp = getExp;
                break;
            }
        }
        if (upLv > level) this._isUp = true;
        this.lab_lv.text = `lv.${upLv.toString()}`;
        this._scaleX = upExp/tcHeroUp[upLv-1].exp;
        Common.log("after等级---->", upLv, upExp)
        // this.img_exp.scaleX = upExp/tcHeroUp[upLv-1].exp;
        data["lv"] = upLv;
        data["exp"] = upExp;
        HeroData.update();
    }

    public Init():void {

    }
    public Reset():void{
        this.group_killCount1.visible = true;
        this.group_killProg.visible = true;
        this.group_killCount2.visible = false;
        this.group_item.visible = false;
        this.group_hero.visible = false;
        this.typeBtn1 = 0;
        this.typeBtn2 = 0;
    }
    /**离开 */
    private btn_giveup:eui.Button;
    /**继续 */
    private btn_reavival:eui.Button;
    /**按钮1类型 0:结束 1:分享 */
    private typeBtn1:number;
    /**按钮2类型 0:复活 1:返回主界面 */
    private typeBtn2:number;
    /**复活次数 */
    private count:number;
    /**复活消耗 */
    private value:number;
    /**是否升级 */
    private _isUp:boolean;
    /**经验长度 */
    private _scaleX:number;

    /***********************组***************************/
    /**挑战失败组 */
    private group_fail:eui.Group;
    /**击杀显示1 */
    private group_killCount1:eui.Group;
    /**击杀进度 */
    private group_killProg:eui.Group;
    /**击杀显示2 */
    private group_killCount2:eui.Group;
    /**获得奖励 */
    private group_item:eui.Group;
    /**英雄信息 */
    private group_hero:eui.Group;
    /*******************图片和文字************************/
    /**背景 */
    private img_bg:eui.Image;
    /**击杀数值 */
    private lab_killCount1:eui.Label;
    /**击杀进度条 */
    private prog_killCount:eui.Image;
    /**进度图标 */
    private img_knife:eui.Image;
    /**当前击杀 */
    private lab_curKill:eui.Label;
    /**最大击杀 */
    private lab_maxKill:eui.Label;
    /**击杀数值2 */
    private lab_killCount2:eui.Label;
    /**获得的经验 */
    private lab_exp:eui.Label;
    /**获得的魂石 */
    private lab_soul:eui.Label;
    /**英雄头像 */
    private img_heroIcon:eui.Image;
    /**英雄名字 */
    private lab_name:eui.Label;
    /**英雄等级 */
    private lab_lv:eui.Label;
    /**英雄经验 */
    private img_exp:eui.Image;
    /**升级图片 */
    private img_upgrade:eui.Image;
}