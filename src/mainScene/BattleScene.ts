/**
 * 战斗场景
 */
class BattleScene extends Base {
    public constructor() {
        super();
        GameData.heros = new Array();
        GameData.monsters = new Array();
        GameData.boss = new Array();
        GameData.chests = new Array();
        this.timer = new egret.Timer(10, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        // this.comboTimer = new egret.Timer(20, 100);
        // this.comboTimer.stop();
        // this.comboTimer.addEventListener(egret.TimerEvent.TIMER, this.onCombo, this);
        // this.comboTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onComboComplete, this);
        modBattle.createTimer();
    }
    protected createChildren(): void{
        this.createMap();
        this.createComboGroup();
        this.createRewardCombo();
        this.createRewardGroup();
    }

    protected childrenCreated(): void{
        RES.loadGroup("battleBack");
        this.createParticle();
        this.init();
        // this.createGuide();
    }
    public init():void {
        // if (UserDataInfo.GetInstance().GetBasicData("stage") == 0) this.guideStage = 1;
        // else this.guideStage = 0;
        this.guideStage = 2;
        TimerManager.getInstance().startTimer();
        GameLayerManager.gameLayer().panelLayer.removeChildren();
        this.battleLayer.removeChildren();
        if (!this.battleSceneCom) this.battleSceneCom = new BattleSceneCom();
        this.battleSceneCom.show();
        this.topLayer.addChild(this.battleSceneCom.group_top);
        this.addChild(this.battleSceneCom.group_btn);
        modBattle.init();
        this.areaCollison = [];
        this.isHit = false;
        this.comboStatus = false;
        // Common.log(JSON.stringify(modTalent.getData(0)));
        DragonBonesFactory.getInstance().startTimer();
        this.createHero();
        this.x = 0;
        this.y = 0;
        // if (this.guideStage != 0) this.battleSceneCom.btnStatus(false);
        AudioManager.GetIns().PlayMusic(AudioManager.BATTLE_BG_MUSIC);
    }

    /**加入连击的显示层 */
    public showComboLayer():void {
        if (this.comboGroup) {
            this.comboGroup.visible = false;
            this.instantKill.visible = false;
            this.effectLayer.addChild(this.comboGroup);
            this.effectLayer.addChild(this.instantKill);
            this.effectLayer.addChild(this.rewardGroup);
        }
    }

    private timerFunc(event:egret.TimerEvent) {
        this.moveCount = (<egret.Timer>event.target).currentCount;
    }

    /**按下监听 */
    private onTouchBin(event:egret.TouchEvent):void {
        this.timer.start();
    }
    /**拖动监听 */
    private onTouchMove(event:egret.TouchEvent):void {
        this.mouseX = event.stageX;
        this.mouseY = event.stageY;
        if (this.moveCount > 10) {
            this.hero.moveToTarget(this.mouseX, this.mouseY, ()=>{
                this.hero.gotoRun();
            });
        }
    }
    /**放开监听 */
    private onTouchEnd(event:egret.TouchEvent):void {
        this.timer.reset();
        if (this.moveCount <= 10 && this.hero.curState == "idle") {
            this.hero.moveToTarget(event.stageX, event.stageY, ()=>{
                this.hero.gotoAttack();
           });
        }
        else if (this.moveCount > 10 && this.hero.curState != "attack"){
            if (this.hero.getCurState() != BaseGameObject.Action_Enter) this.hero.gotoIdle();
        }
        this.moveCount = 0;
    }

    /**
     * 创建连击显示组
     */
    private createComboGroup():void {
        this.comboGroup = new egret.DisplayObjectContainer();
        this.comboGroup.x = 0;
        this.comboGroup.y = 550;

        let bg:egret.Bitmap = Utils.createBitmap("combo_bg_png");
        bg.scaleX = 3;
        bg.scaleY = 3;
        this.comboGroup.addChild(bg);
        // let comboText:egret.TextField = Utils.createText("斩", 150, 15, 30, 0x501414);
        // comboText.bold = true;
        // comboText.fontFamily = "Microsoft YaHei";
        // this.comboGroup.addChild(comboText);

        //位图字体
        let font = RES.getRes("killFnt_fnt");
        this.comboCount = new egret.BitmapText();
        this.comboCount.font = font;
        this.comboCount.textAlign = "center";
        this.comboCount.x = 25;
        this.comboCount.y = 30;
        this.comboCount.text = "0";
        this.comboCount.letterSpacing = 1;
        this.comboGroup.addChild(this.comboCount);
        // this.comboGroup.visible = false;
    }

    /**
     * 更新连击数字
     */
    public update(value:number) {
        // this.isHit = true;
        let str:string = value.toString();
        this.comboCount.text = str + "斩";
        this.comboCount.anchorOffsetY = this.comboCount.height/2;
        // if (!this.comboStatus) {
        //     this.comboTimer.start();
        //     this.comboStatus = true;
        //     this.comboGroup.alpha = 0;
        //     Animations.fadeOut(this.comboGroup, 200, null, ()=>{
        //         this.comboGroup.visible = true;
        //         Animations.stamp(this.comboCount, 300, 450, 10, 5);
        //         // Animations.fadeIn(this.comboGroup, 500);
        //     })
        // }else{
        //     this.comboGroup.visible = true;
        //     Animations.stamp(this.comboCount, 300, 450, 10, 5);
        // }
        this.comboGroup.visible = true;
        this.comboCount.scaleX = 2;
        this.comboCount.scaleY = 2;
        egret.Tween.get(this.comboCount).to({scaleX:1, scaleY:1}, 300, egret.Ease.bounceOut);
        if (value%50 == 0) {
            this.updateRewardGroup(value);
        }
    }

    /**
     * 隐藏连击组
     */
    public hideCombo():void {
        this.comboStatus = false;
        this.comboGroup.visible = false;
    }

    /**
     * 连击计时器监听
     */
    private onCombo(event:egret.TimerEvent):void {
        if (this.isHit){
            this.isHit = false;
            this.comboTimer.reset();
            this.comboTimer.start();
        }
    }

    /**
     * 连击结束监听
     */
    private onComboComplete():void {
        this.comboTimer.reset();
        this.comboStatus = false;
        Animations.fadeIn(this.comboGroup, 500);
    }

    /**
     * 创建一次击杀奖励组
     */
    private createRewardCombo():void {
        this.instantKill = new egret.DisplayObjectContainer();
        this.instantKill.x = 150;
        this.instantKill.y = 150;
        this.img_insKill = Utils.createBitmap("kill_0002_png");
        this.img_insKill.anchorOffsetX = this.img_insKill.width/2;
        this.img_insKill.anchorOffsetY = this.img_insKill.height/2;
        this.instantKill.addChild(this.img_insKill);
    }

    /**
     * 更新一次击杀数据
     */
    public updateInstantKill(value:number):void {
        this.instantKill.visible = true;
        let num:number = value;
        if (value >= 5) num = 5;
        this.img_insKill.texture = RES.getRes(`kill_000${num}_png`);
        Animations.stamp(this.instantKill, 300, 300);
    }

    /**
     * 创建击杀奖励组
     */
    private createRewardGroup():void {
        this.rewardGroup = new egret.DisplayObjectContainer();
        this.rewardGroup.x = 300;
        this.rewardGroup.y = 80;
        this.killTips = Common.CreateMovieClip("killTipsBgClip", true);
        this.killTips.visible = false;
        this.killTips.addEventListener(egret.Event.COMPLETE, this.onTipsBgComplete, this);
        this.rewardGroup.addChild(this.killTips);
        this.rewardGroup["count"] = Utils.createText("击杀怪物数 100!", 150, 100, 30, 0xF7D890);
        this.rewardGroup["count"].visible = false;
        this.rewardGroup.addChild(this.rewardGroup["count"]);
        this.rewardGroup["count"].bold = true;
        this.rewardGroup["exp"] = Utils.createText("+30000点经验奖励", 240, 120, 30, 0xF7D890);
        this.rewardGroup["exp"].anchorOffsetX = this.rewardGroup["exp"].width/2;
        this.rewardGroup["exp"].visible = false;
        this.rewardGroup.addChild(this.rewardGroup["exp"]);
        this.rewardGroup["exp"].bold = true;
    }

    /**更新击杀奖励 */
    private updateRewardGroup(value:number):void {
        let index:number = value/50;
        if (index > 5) return;
        this.killClip = Common.CreateMovieClip(`killTips${index}Clip`, true);
        this.killClip.anchorOffsetY = this.killClip.height/2;
        this.killClip.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        this.killClip.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        this.rewardGroup.addChild(this.killClip);
        this.killClip.x = 50;
        this.killClip.y = 50;
        this.killTips.visible = true;
        this.killTips.gotoAndPlay(1);
    }
    private onTipsBgComplete():void {
        this.killClip.gotoAndPlay(1);
    }
    private onMovie(event:egret.MovieClipEvent):void {
        let label:string = event.frameLabel;
        if (label == "@move") {
            this.killClip.y = -20;
            let value = modBattle.getSumkill();
            this.rewardGroup["count"].visible = true;
            this.rewardGroup["count"].text = "击杀数 " + Math.floor(value/50)*50 + "!";
        }
    }
    private onComplete():void {
        let value = modBattle.getSumkill();
        let exp:number = value * 40;
        this.rewardGroup["exp"].y = 120;
        this.rewardGroup["exp"].text = "+" + exp + "点经验奖励";
        this.rewardGroup["exp"].visible = true;
        egret.Tween.get(this.rewardGroup["exp"]).to({y:this.rewardGroup["exp"].y+20}, 100).call(()=>{
            modBattle.setExp(exp);
            modBattle.setSoul(0);
            SceneManager.battleScene.battleSceneCom.setExpAndSoul(modBattle.getExp(), modBattle.getSoul());
            egret.Tween.get(this.rewardGroup).to({alpha:0}, 800, egret.Ease.circIn).call(()=>{
                this.clearRewardGroup();
            })
        });
    }
    private clearRewardGroup():void {
        this.killClip.removeEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        this.killClip.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
        egret.Tween.removeTweens(this.rewardGroup);
        this.killTips.visible = false;
        this.rewardGroup["count"].visible = false;
        this.rewardGroup["exp"].visible = false;
        this.rewardGroup.alpha = 1.0;
        this.rewardGroup.removeChild(this.killClip);
        this.killClip = null;
    }

    /***********************************************************************************/
    /**
     * 创建地图背景
     */
    private createMap():void {
        this.battleLayer = new egret.DisplayObjectContainer();
        this.effectLayer = new egret.DisplayObjectContainer();
        this.otherLayer = new egret.DisplayObjectContainer();
        this.particleLayer = new eui.UILayer();
        this.particleLayer.touchEnabled = false;
        this.topLayer = new eui.UILayer();
        this.mapBg = new eui.Image();
        this.mapBg.source = "map1_png";
        this.mapBg.smoothing = false;
        this.topLayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBin, this);
        this.topLayer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.topLayer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.topLayer.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
        this.mapBg.scaleX = 2;
        this.mapBg.scaleY = 2;
        this.addChild(this.mapBg);
        this.mapBg.anchorOffsetX = this.mapBg.width/2;
        this.mapBg.anchorOffsetY = this.mapBg.height/2;
        this.mapBg.x = Common.SCREEN_W/2;
        this.mapBg.y = Common.SCREEN_H/2;

        this.blood = new eui.Image();
        this.blood.source = "blood_0001_png";
        this.blood.touchEnabled = false;
        this.blood.visible = false;
        this.addChild(this.particleLayer);
        this.addChild(this.otherLayer);
        this.addChild(this.battleLayer);
        this.addChild(this.effectLayer);
        this.addChild(this.blood);
        this.addChild(this.topLayer);
    }

    /**设置战场的背景 */
    public changeBg(id:number):void {
        this.mapBg.source = `map${id}_png`;
    }

    /**
     * 创建英雄
     */
    public createHero(revivalType:number = 0, hp:number = 0):void {
        this.hero = ObjectPool.pop("Hero");
        GameData.heros.push(this.hero);
        //测试
        let data = ConfigManager[`${GameData.curHero}Attr`];
        let level:number = HeroData.getHeroData(GameData.curHero).lv
        let attr = Utils.cloneObj(data[level - 1]);
        //数据结构后续优化
        this.hero.init([GameData.curHero, attr, revivalType, hp]);
        this.hero.x = Common.SCREEN_W/2;
        this.hero.y = Common.SCREEN_H/2;
        // this.hero.anchorOffsetY = -33;
        this.hero.anchorOffsetY = -50;
        this.battleLayer.addChild(this.hero);
    }

    /**
     * 创建镜像
     */
    public createMirror(data:Array<any>, isPVP:boolean=false) {
        let mirror = ObjectPool.pop("AvatarHero");
        GameData.heros.push(mirror);
        mirror.init(data, isPVP);
        mirror.x = MathUtils.getRandom(100, 1050);
        mirror.y = MathUtils.getRandom(100, 550);
        // mirror.anchorOffsetY = -33;
        mirror.anchorOffsetY = -50;
        this.battleLayer.addChild(mirror);
        return mirror;
    }

    /**
     * 受攻击特效
     */
    public bloodTween():void {
        this.blood.alpha = 1.0;
        this.blood.visible = true;
        egret.Tween.get(this.blood).to({alpha:0}, 1500, egret.Ease.circOut).call(()=>{
            this.blood.visible = false;
        })
    }

    public createSingleMonster(data:Array<any>, isElite:boolean = false, isSummon:boolean = false):void {
        if (isElite) this.monster = ObjectPool.pop("EliteMonster");
        else this.monster = ObjectPool.pop("Monster");
        GameData.monsters.push(this.monster);
        // Common.log("怪物的数据---->", data);
        this.monster.init(data, isElite, isSummon);
        // if (this.guideStage == 2) {
        //     this.monster.x = 900;
        //     this.monster.y = 350;
        // }else{
            this.monster.x = MathUtils.getRandom(100, 1050);
            this.monster.y = MathUtils.getRandom(100, 550);
        // }
        // this.monster.anchorOffsetY = -33;
        this.monster.anchorOffsetY = -50;
        this.battleLayer.addChild(this.monster);
    }

    /**
     * 创建Boss
     */
    public createBoss(data):void {
        this.boss = ObjectPool.pop("Boss");
        GameData.boss.push(this.boss);
        this.boss.init(data);
        this.boss.x = MathUtils.getRandom(100, 1050);
        this.boss.y = MathUtils.getRandom(100, 550); 
        // this.boss.anchorOffsetY = -33;
        this.boss.anchorOffsetY = -50;
        this.battleLayer.addChild(this.boss);
    }

    /**
     * 创建宝箱
     */
    public createChest(params:any):void {
        let chest = ObjectPool.pop("Chest");
        GameData.chests.push(chest);
        chest.init(params.id);
        chest.x = params.x;
        chest.y = params.y + 20;
        this.battleLayer.addChild(chest);
    }

    private createParticle() {
        //获取纹理
        var texture = RES.getRes("newParticle_png");
        //获取配置
        var config = RES.getRes("newParticle_json");
        //创建 GravityParticleSystem
        var system = new particle.GravityParticleSystem(texture, config);
        //启动粒子库
        system.start();
        //将例子系统添加到舞台
        this.particleLayer.addChild(system);
    }

    /**
     * 创建新手引导
     */
    public createGuide():void {
        this.guideDialog = ObjectPool.pop("GuideDialog");
        this.guideDialog.init();
        GameLayerManager.gameLayer().maskLayer.addChild(this.guideDialog);
    }

    /**
     * 创建引导标记
     */
    public createGuideMov():void {
        let arrow:egret.Bitmap = Utils.createBitmap("battle_res.battle_0015");
        arrow.x = 800;
        arrow.y = 300;
        this.otherLayer.addChild(arrow);
        Animations.flyObj(arrow, 1000, 20);
        let shadow:egret.Bitmap = Utils.createBitmap("battle_res.shadow");
        shadow.x = arrow.x;
        shadow.y = arrow.y + 80;
        this.otherLayer.addChild(shadow);
    }

    /**
     * 清除引导标记
     */
    public clearGuide(num:number):void {
        switch (num) {
            case 1:
                //移动引导
                // egret.Tween.removeTweens(this.otherLayer);
                // this.otherLayer.removeChildren();
                this.guideDialog.createAttackGuide();
                // GameLayerManager.gameLayer().maskLayer.addChild(this.guideDialog);
                // let data = modBattle.setMonsterData(1, 1);
                // this.createSingleMonster(data);
            break;
            case 2:
                //攻击引导
                this.hero.canMove = true;
                this.hero.isComplete = true;
                modBattle.start();
            break;
            case 3:
                //技能引导
                this.battleSceneCom.btnStatus(true);
                this.guideDialog.createSkillGuide();
                this.hero.canMove = false;
                GameLayerManager.gameLayer().maskLayer.addChild(this.guideDialog);
            break;
            case 4:
                this.hero.canMove = true;
            break;
        }
    }


    /**
     * 清除子对象
     */
    public cleanChildren():void {
        // this.comboTimer.reset();
        modBattle.recycleObject();
        this.battleSceneCom.clearBuffIcon();
        this.effectLayer.removeChildren();
        this.otherLayer.removeChildren();
        // GameLayerManager.gameLayer().effectLayer.removeChildren();
        GameLayerManager.gameLayer().sceneLayer.removeChild(this);
    }

    /**设置碰撞范围 */
    public setCollison(data:any):void {
        switch (data.type) {
            case 1:
                data.minX = data.x;
                data.maxX = data.x + 146;
                data.minY = data.y - 40;
                data.maxY = data.y + 28;
            break;
            case 2:
                data.minX = data.x;
                data.maxX = data.x + 60;
                data.minY = data.y - 50;
                data.maxY = data.y + 90;     
            break;
            case 3:
                data.minX = data.x - 150;
                data.maxX = data.x + 140;
                data.minY = data.y - 49;
                data.maxY = data.y - 30;
            break;
        }
    }

    /**增加碰撞区域 */
    public addCollison(data:any):void {
        this.areaCollison.push(data);
        this.setCollison(data);
    }

    /**清除碰撞区域 */
    public removeCollison(target:any):void {
        let index = this.areaCollison.indexOf(target);
        this.areaCollison.splice(index, 1);
    }

    /**获取碰撞区域 */
    public getCollison() {
        return this.areaCollison;
    }

    /**是否新手引导 */
    public guideStage:number;
    private guideDialog:GuideDialog;
    /**鼠标或者点击的位置 */
    private mouseX:number;
    private mouseY:number;
    /**粒子层 */
    private particleLayer:eui.UILayer;
    /**英雄和怪物层 */
    public battleLayer:egret.DisplayObjectContainer;
    /**特效层（包括技能/buff等） */
    public effectLayer:egret.DisplayObjectContainer;
    /**其他元素层 */
    public otherLayer:egret.DisplayObjectContainer;
    /**顶层 */
    public topLayer:eui.UILayer;
    public hero:Hero;
    public monster:Monster;
    public boss:Boss;
    /**碰撞区域 */
    public areaCollison:Array<any>;
    /**场景部件 */
    public battleSceneCom:BattleSceneCom;
    /**地图 */
    public mapBg:eui.Image;
    /**受攻击的特效背景 */
    public blood:eui.Image;
    /**定时器 */
    private timer:egret.Timer;
    /**连击计时器 */
    private comboTimer:egret.Timer;
    /** */
    private moveCount:number;
    /**连击显示组 */
    private comboGroup:egret.DisplayObjectContainer;
    /**连击显示组的状态 */
    private comboStatus:boolean;
    /**是否连续击杀 */
    private isHit:boolean;
    /**连击数字 */
    private comboCount:egret.BitmapText;
    /**一次击杀奖励组 */
    private instantKill:egret.DisplayObjectContainer;
    /**一次击杀图片 */
    private img_insKill:egret.Bitmap;
    /**击杀数量奖励组 */
    private rewardGroup:egret.DisplayObjectContainer;
    /**击杀提示动画 */
    private killTips:egret.MovieClip;
    /**击杀动画 */
    private killClip:egret.MovieClip;
}