/**
 * PVP战斗场景
 */
class PVPScene extends Base {
    public constructor() {
        super();
        GameData.heros = new Array();
        GameData.stakes = new Array();
        this.timer = new egret.Timer(10, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this._timerFunc, this);
        this.addEventListener(eui.UIEvent.COMPLETE, this.uiCompleteHandler, this);
        modPVP.createTimer();
        this.skinName = "resource/game_skins/pvpSceneSkin.exml"
    }
    protected createChildren(): void{
        this._createMap();
    }

    protected childrenCreated(): void{
        this.init();
    }

    public init():void {
        TimerManager.getInstance().startTimer();
        this._curValue = 0;
        this._cdTime = 90;
        this.lab_cdSkill.visible = false;
        this.lab_cdTime.text = `${this._cdTime}`;
        this.lab_value.text = `${this._curValue}`;
        this._createHero();
        DragonBonesFactory.getInstance().startTimer();
    }

    /**
     * 创建PVP倒计时
     */
    public createCountDown():void {
        modPVP.init();
        this.onCDTime(300);
        TimerManager.getInstance().doTimer(1000, this._cdTime, this._onTimeCD, this, this._onTimeComplete, this);
    }

    /**
     * 停止倒计时
     */
    public stopTimer():void {
        TimerManager.getInstance().stopTimer();
    }

    /**
     * 创建单个木桩
     */
    public createSingleStake():void {
        this._stake = ObjectPool.pop("Stakes");
        GameData.stakes.push(this._stake);
        this._stake.init();
        this._stake.x = MathUtils.getRandom(100, 1050);
        this._stake.y = MathUtils.getRandom(100, 550);
        this._stake.anchorOffsetX = this._stake.width/2;
        this._stake.anchorOffsetY = this._stake.height/2;
        this.battleLayer.addChild(this._stake);
    }

    /**
     * 更新伤害值
     */
    public updateValue(value:number):void {
        this.cd_time -= 5;
        this.lab_cdTime.text = `${this._cdTime}`;
        this._curValue += value;
        this.lab_value.text = `${this._curValue}`;
    }

    /**技能cd */
    public onCDTime(cd:number):void {
        this.cd_time = cd;
        this.lab_cdSkill.text = `${this.cd_time}`;
        this.lab_cdSkill.visible = true;
        this.img_skillMask.visible = true;
        TimerManager.getInstance().doTimer(1000, 0, this.timerCD, this);
    }

    /**
     * 清除子对象
     */
    public cleanChildren():void {
        RankData.GetInstance().InsertData(this._curValue);
        modPVP.recycleObject();
        TimerManager.getInstance().remove(this.timerCD, this);
        TimerManager.getInstance().remove(this._onTimeCD, this);
        TimerManager.getInstance().removeComplete(this._onTimeComplete, this);
        this._effectLayer.removeChildren();
        // GameLayerManager.gameLayer().effectLayer.removeChildren();
        GameLayerManager.gameLayer().sceneLayer.removeChild(this);
    }

    private timerCD():void {
        if (this.cd_time == 0) return;
        this.cd_time --;
        this.lab_cdSkill.text = `${this.cd_time}`;
        if (this.cd_time <= 0) {
            TimerManager.getInstance().remove(this.timerCD, this);
            this.lab_cdSkill.visible = false;
            this.img_skillMask.visible = false;
        }
    }

    private uiCompleteHandler():void {
        this.btn_pause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onPause, this);
        this.btn_skill.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            if (this.cd_time <= 0) {
                GameData.heros[0].gotoSkill();
            }
        }, this);
    }

    /**
     * 暂停
     */
    private _onPause():void {
        TimerManager.getInstance().stopTimer();
        modPVP.stop();
        let pop = WindowManager.GetInstance().GetWindow("BattlePausePop");
        pop.Show();
        Animations.fadeOut(pop);
    }

    private _timerFunc(event:egret.TimerEvent) {
        this.moveCount = (<egret.Timer>event.target).currentCount;
    }
    /**按下监听 */
    private onTouchBin(event:egret.TouchEvent):void {
        this.timer.start();
    }
    /**拖动监听 */
    private onTouchMove(event:egret.TouchEvent):void {
        this._mouseX = event.stageX;
        this._mouseY = event.stageY;
        if (this.moveCount > 10) {
            this._hero.moveToTarget(this._mouseX, this._mouseY, ()=>{
                this._hero.gotoRun();
            });
        }
    }
    /**放开监听 */
    private onTouchEnd(event:egret.TouchEvent):void {
        this.timer.reset();
        if (this.moveCount <= 10) {
            this._hero.moveToTarget(event.stageX, event.stageY, ()=>{
                this._hero.gotoAttack();
           });
        }else{
            this._hero.gotoIdle();
        }
        this.moveCount = 0;
    }
    /**
     * 对象回收
     */
    private _cycleObject():void {

    }

    private _onTimeCD():void {
        this._cdTime --;
        this.lab_cdTime.text = `${this._cdTime}`;
    }

    private _onTimeComplete():void {
        TimerManager.getInstance().stopTimer();
        modPVP.stop();
        let pop = WindowManager.GetInstance().GetWindow("BattleWinPop");
        pop.Show();
        Animations.fadeOut(pop);

        let rankIndex = RankData.GetInstance().GetIndexFromDamage(this._curValue);

        if(rankIndex != -1){
            WindowManager.GetInstance().GetWindow("ShareWindow").Show({type:1,data:rankIndex,share:10});  
        }
    }

    /**
     * 创建英雄
     */
    private _createHero():void {
        this._hero = ObjectPool.pop("Hero");
        GameData.heros.push(this._hero);
        //测试
        let data = ConfigManager[`${GameData.curHero}Attr`];
        let attr = data[0];
        this._hero.init([GameData.curHero, attr], true);
        this._hero.x = Common.SCREEN_W/2;
        this._hero.y = Common.SCREEN_H/2;
        // this.hero.anchorOffsetY = -33;
        this._hero.anchorOffsetY = -50;
        this.battleLayer.addChild(this._hero);
    }

    /**
     * 创建地图
     */
    private _createMap():void {
        this.battleLayer = new egret.DisplayObjectContainer();
        this._effectLayer = new egret.DisplayObjectContainer();
        this.img_map.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBin, this);
        this.img_map.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.img_map.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.addChild(this.battleLayer);
        this.setChildIndex(this.battleLayer, 1);
        this.addChild(this._effectLayer);
    }

    /**英雄和怪物层 */
    public battleLayer:egret.DisplayObjectContainer;
    private _timer:egret.Timer;
    private _skillTimer:egret.Timer;

    /**鼠标或者点击的位置 */
    private _mouseX:number;
    private _mouseY:number;
    /**当前的伤害 */
    private _curValue:number;
    /**特效层（包括技能/buff等） */
    private _effectLayer:egret.DisplayObjectContainer;
    /**倒计时长 */
    private _cdTime:number;
    /**技能倒计时 */
    private cd_time:number;
    /**英雄 */
    private _hero:Hero;
    /**木桩 */
    private _stake:Stakes;
    /**定时器 */
    private timer:egret.Timer;
    /** */
    private moveCount:number;
    /**暂停按钮 */
    private btn_pause:eui.Button;
    /**技能释放按钮 */
    private btn_skill:eui.Button;
    /**背景 */
    private img_map:eui.Image;
    /**技能背景 */
    private img_skillBg:eui.Image;
    /**技能cd时的遮罩 */
    private img_skillMask:eui.Image;
    /**技能cd */
    private lab_cdSkill:eui.Label;
    /**pvp倒计时 */
    private lab_cdTime:eui.Label;
    /**伤害量 */
    private lab_value:eui.Label;
}