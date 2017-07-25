/**
 * 战斗场景
 */
class BattleScene extends Base {
    public constructor() {
        super();
        GameData.heros = new Array();
        GameData.monsters = new Array();
        GameData.boss = new Array();
        this.timer = new egret.Timer(10, 0);
        this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerFunc, this);
        modBattle.createTimer();
    }
    protected createChildren(): void{
        this.createMap();
        this.createComboGroup();
    }

    protected childrenCreated(): void{
        this.createParticle();
        this.init();
    }
    public init():void {
        TimerManager.getInstance().startTimer();
        GameLayerManager.gameLayer().panelLayer.removeChildren();
        if (!this.battleSceneCom) {
            this.battleSceneCom = new BattleSceneCom();
            this.battleSceneCom.show();
        }else{
            this.battleSceneCom.show();
        }
        this.addChild(this.battleSceneCom);

        if (this.comboGroup) {
            this.comboGroup.visible = false;
            this.effectLayer.addChild(this.comboGroup);
        }
        modBattle.init();
        this.areaCollison = [];
        // Common.log(JSON.stringify(modTalent.getData(0)));
        DragonBonesFactory.getInstance().startTimer();
        this.createHero();
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
            this.hero.gotoIdle();
        }
        this.moveCount = 0;
    }

    /**
     * 创建连击显示组
     */
    private createComboGroup():void {
        this.comboGroup = new egret.DisplayObjectContainer();
        this.comboGroup.x = 0;
        this.comboGroup.y = 260;

        let bg:egret.Bitmap = Utils.createBitmap("combo_bg_png");
        bg.scaleX = 3;
        bg.scaleY = 3;
        this.comboGroup.addChild(bg);
        let comboText:egret.TextField = Utils.createText("连击", 20, 15, 26, 0x501414);
        comboText.bold = true;
        comboText.fontFamily = "Microsoft YaHei";
        this.comboGroup.addChild(comboText);

        //位图字体
        let font = RES.getRes("combo_fnt");
        this.comboCount = new egret.BitmapText();
        this.comboCount.scaleX = 3;
        this.comboCount.scaleY = 3;
        this.comboCount.font = font;
        this.comboCount.x = 100;
        this.comboCount.y = 30;
        this.comboCount.text = "0";
        this.comboCount.letterSpacing = 1;
        this.comboGroup.addChild(this.comboCount);
        this.comboGroup.visible = false;
        this.comboStatus = false;
    }

    /**
     * 更新连击数字
     */
    public update(value:number) {
        this.comboGroup.visible = true;
        if (value >= 10) this.comboCount.x = 90;
        let str:string = value.toString();
        this.comboCount.anchorOffsetY = this.comboCount.height/2;
        this.comboCount.text = str;
        if (this.lastCombo == value) return;
        if (!this.comboStatus) {
            this.comboStatus = true;
            this.lastCombo = value;
            Animations.fadeOut(this.comboGroup, 500, ()=>{
                Animations.zoomIn(this.comboCount);
            })
        }else{
            this.lastCombo = value;
            Animations.zoomIn(this.comboCount);
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
     * 创建地图背景
     */
    private createMap():void {
        this.battleLayer = new egret.DisplayObjectContainer();
        this.effectLayer = new egret.DisplayObjectContainer();
        this.otherLayer = new egret.DisplayObjectContainer();
        this.particleLayer = new eui.UILayer();
        this.particleLayer.touchEnabled = false;
        this.mapBg = new eui.Image();
        this.mapBg.source = "map_png";
        this.mapBg.smoothing = false;
        this.mapBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBin, this);
        this.mapBg.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.mapBg.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.mapBg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
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
    }

    /**
     * 创建英雄
     */
    public createHero(isRevival:boolean = false, hp:number = 1):void {
        this.hero = ObjectPool.pop("Hero");
        GameData.heros.push(this.hero);
        //测试
        let data = ConfigManager[`${GameData.curHero}Attr`];
        // Common.log(HeroData.getHeroData(GameData.curHero));
        // let level:number = HeroData.getHeroData(GameData.curHero).lv
        // let attr = data[level - 1];
        let attr = data[0];
        //数据结构后续优化
        this.hero.init([GameData.curHero, attr, isRevival, hp]);
        this.hero.x = Common.SCREEN_W/2;
        this.hero.y = Common.SCREEN_H/2;
        // this.hero.anchorOffsetY = -33;
        this.hero.anchorOffsetY = -50;
        this.battleLayer.addChild(this.hero);
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
        this.monster.init(data, isElite, isSummon);
        this.monster.x = MathUtils.getRandom(100, 1050);
        this.monster.y = MathUtils.getRandom(100, 550);
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
     * 清除子对象
     */
    public cleanChildren():void {
        modBattle.recycleObject();
        this.effectLayer.removeChildren();
        // GameLayerManager.gameLayer().effectLayer.removeChildren();
        GameLayerManager.gameLayer().sceneLayer.removeChild(this);
    }

    /**设置碰撞范围 */
    public setCollison(data:any):void {
                // var shp:egret.Shape = new egret.Shape();
                // shp.x = data.pos[0];
                // shp.y = data.pos[1];
                // shp.graphics.lineStyle( 1, 0x00ff00 );
                // shp.graphics.beginFill( 0xff0000, 1);
                // shp.graphics.drawCircle( 0, 0, 5 );
                // shp.graphics.endFill();
                // this.addChild( shp );
        switch (data.type) {
            case 1:
                data.minX = data.x - 73;
                data.maxX = data.x + 73;
                data.minY = data.y - 98;
                data.maxY = data.y - 30;
            break;
            case 2:
                data.minX = data.x - 30;
                data.maxX = data.x + 30;
                data.minY = data.y - 100;
                data.maxY = data.y + 40;     
            break;
        }
        Common.log(this.areaCollison)
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
        Common.log(this.areaCollison)
    }

    /**获取碰撞区域 */
    public getCollison() {
        return this.areaCollison;
    }

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
    /** */
    private moveCount:number;
    /**连击显示组 */
    private comboGroup:egret.DisplayObjectContainer;
    /**连击显示组的状态 */
    private comboStatus:boolean;
    /**上一次的连击数 */
    private lastCombo:number;
    /**连击数字 */
    private comboCount:egret.BitmapText;
}