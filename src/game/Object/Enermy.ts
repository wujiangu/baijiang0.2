class Enermy extends BaseGameObject {
    public constructor() {
        super();
        this.colorFlilter = new egret.ColorMatrixFilter(this.colorMatrix);
        this.defaultFlilter = new egret.ColorMatrixFilter(this.defaultMatrix);
        this.createExpAndSoul();
        this.img_sigh = Utils.createBitmap("img_sigh_png");
        this.img_sigh.scaleX = 0.5;
        this.img_sigh.scaleY = 0.5;
        this.img_sigh.y = -100;
        this.img_sigh.alpha = 0;
        this.addChild(this.img_sigh);
    }

    public initDragonBonesArmature(name:string):void {
        //受伤动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("daoguang_effect", "daoguang_effect", 8), [
            BaseGameObject.Action_Hurt
        ]);
        //死亡受伤动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("blood_die", "blood_die", 8), [
            Enermy.Action_HurtDie
        ]);
        //出场动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("enter_monster_01", "enter_monster_01", 10.0), [
            BaseGameObject.Action_Enter
        ]);

        //buff动画
        this.buffArmature.register(DragonBonesFactory.getInstance().makeArmature("buff", "buff", 10), [
            "Burning",
            "xuanyun",
            "dongjie",
            "hpShield_01",
            "hpShield_02",
            "leidian",
            "speedup",
            "xue",
            "xuejia"
        ]);
        this.buffArmature.visible = false;
        this.effectArmature.scaleX = 1.5;
        this.effectArmature.scaleY = 1.5;
        this.buffArmature.scaleX = 1.5;
        this.buffArmature.scaleY = 1.5;
        this.armature.filters = [this.defaultFlilter];
    }

    public init(data:Array<any>) {
        super.init(data);
        this.isInvincible = false;
        this.buff = [];
        this.isEnemy = true;
        this.isSummon = false;
        this.isBoss = false;
        this.isSkillHurt = false;
        this.isReadSkill = false;
        this.lastAnimation = "";
        this.atk_distance = data[1].mov;
        this.away_distance = data[1].away;
        // this.atk_timer.delay = this.attr.wsp * 1000;
        this.atk_timer.delay = 0;
        this.isRemote = data[1].isRemote;
        this.originHP = this.attr.hp;
        this.beAttackCount = 0;
        // this.maskImprisoned.mask = this;
    }

    public update(time:number):void {
        super.update(time);
        if (this.isMovExp) this.gainExpAndSoul(this.img_exp, 1, 16, -10);
        if (this.isMovSoul) this.gainExpAndSoul(this.img_soul, 2, 14, 10);
    }

    /*******************状态的帧回调**********************/
    /**
     * 待机状态
     */
    public state_idle(time:number):void {

    }

    /**死亡状态 */
    public state_dead(time:number):void {

    }

    /**
     * 受到攻击状态
     */
    public state_hurt(time:number):void {
        
    }

    /**攻击状态 */
    public state_attack(time:number):void {

    }

    /**
     * 走路巡逻状态
     */
    public state_run(time:number, func:Function = null):void {
        if (!this.canMove) return;
        this.moveToTarget(GameData.heros[0].x, GameData.heros[0].y, ()=>{
            let useSpeed:number = this.speed * 0.1;
            let distance:number = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, this.x, this.y);
            this.radian = MathUtils.getRadian2(this.x, this.y, this.endX, this.endY);
            let animation = this.getWalkPosition("run", this.radian);
            this.reverse(this, this.radian);
            if (animation != this.lastAnimation) {
                this.lastAnimation = animation;
                this.armature.play(animation, 0);
                if (this.isFaster) func(this.radian);
            }
            if (distance > 15 ){
                let tempX:number = Math.cos(this.radian) * useSpeed;
                let tempY:number = Math.sin(this.radian) * useSpeed;
                this.deltaX = parseFloat(tempX.toFixed(2));
                this.deltaY = parseFloat(tempY.toFixed(2));
                let gotoX = this.x + this.deltaX;
                let gotoY = this.y + this.deltaY;
                let isMove:boolean = this.isCollison(gotoX, gotoY);
                if (!isMove) return;
                this.x += this.deltaX;
                this.y += this.deltaY;
                this.x = parseFloat(this.x.toFixed(2));
                this.y = parseFloat(this.y.toFixed(2));
                // if (this.isFaster) func(this.radian);
            }
            if (this.isComplete == true) {
                // let dis:number = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, this.x, this.y);
                if (distance <= this.atk_distance) {
                    this.gotoReady();
                }
            }
        });
    }
    /****************************************************/


    /*******************进入状态**************************/
    /**
     * 进入待机状态
     */
    public gotoIdle() {
        this.curState = BaseGameObject.Action_Idle;
        super.gotoIdle();
    }

    /**
     * 进场
     */
    public gotoEnter() {
        this.curState = BaseGameObject.Action_Enter;
        this.effectArmature.visible = true;
        this.effectArmature.y = 10;
        this.effectArmature.play(this.curState, 1);
    }

    /**奔跑 */
    public gotoRun() {
        if (this.attr.hp <= 0) return;
        this.lastAnimation = "";
        this.curState = "run";
    }

    /**攻击 */
    public gotoAttack() {
        if (this.attr.hp <= 0) return;
        this.curState = "attack";
        this.originX = this.x;
        this.originY = this.y;
        /**攻击的弧度 */
        this.radian = MathUtils.getRadian2(this.originX, this.originY, GameData.heros[0].x, GameData.heros[0].y);
        this.reverse(this, this.radian);
    }

    /**
     * 技能
     */
    public gotoSkill() {
        if (this.attr.hp <= 0) return;
    }

    /**受到攻击 */
    public gotoHurt(hurtValue:number = 1, isSkillHurt:boolean = false) {
        if (this.isInvincible) return;
        if (this.attr.hp <= 0) return;
        if ((this.curState == Enermy.Action_Dead) || (this.curState == BaseGameObject.Action_Hurt)) return;
        ShakeTool.getInstance().shakeObj(SceneManager.battleScene, 1, 5, 5);
        this.curState = BaseGameObject.Action_Hurt;
        this.armature.play(this.curState, 0);
        this.effectArmature.visible = true;
        // if (!isSkillHurt) {
            if (this.attr.hp <= hurtValue) {
                this.effectArmature.play(Enermy.Action_HurtDie, 1);
                this.effectArmature.x = 0;
                this.effectArmature.y = 5;
                modBattle.addSumkill();
            }else{
                this.effectArmature.play(BaseGameObject.Action_Hurt, 1);
                this.effectArmature.x = -15;
                this.effectArmature.y = 5;
                if (this.attr.hp < 0){
                    this.gotoDead();
                    modBattle.addSumkill();
                }
            }
            this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
        // }
        this.attr.hp -= hurtValue;
        this.beAttackCount ++;
        this.hurtAnimate(hurtValue);
    }

    /**蓄力 */
    public gotoReady() {
        if (this.attr.hp <= 0) return;
    }

    /**死亡 */
    public gotoDead() {
        this.curState = Enermy.Action_Dead;
        this.armature.play(Enermy.Action_Dead, 1);
        Common.dispatchEvent(GameEvents.EVT_PRODUCEMONSTER, this);
        //隐藏buff动画
        this.buffArmature.visible = false;
        this.fallExpAndSoul();
        GameData.heros[0].killBuff();
        this.recycle();
        TimerManager.getInstance().doTimer(5000, 0, this.disappear, this);
    }
    /****************************************************/

    /***********************其他函数**********************/
    /**
     * 设置状态
     */
    public setCurState(state:string):void {
        this.curState = state;
    }
    /**
     * 移动到指定的位置
     * 
     */
    public moveToTarget(gotoX:number, gotoY:number, func:Function = null):void {
        super.moveToTarget(gotoX, gotoY, func);
        if (func != null) {
            func();
        }
    }
    /**消失 */
    public disappear():void {
        TimerManager.getInstance().remove(this.disappear, this);
        if (this.curState != Enermy.Action_Dead) return;
        ObjectPool.push(this);
        if (this.parent && this.parent.removeChild) this.parent.removeChild(this);
    }
    /**
     * 设置buff或被动技能
     */
    public setBuff():void {
        let buff:Array<number> = this.arrayBuffs;
        for (let i = 0; i < buff.length; i++) {
            let buffConfig = modBuff.getBuff(buff[i]+50);
            let newBuff = ObjectPool.pop(buffConfig.className);
            newBuff.buffInit(buffConfig)
            this.addBuff(newBuff);
        }
    }
    /**增加buff */
    public addBuff(buff:any, isBind:boolean = false) {
        if (isBind && this.curState != Monster.Action_Dead) {
            this.buffStartAct(buff);
            return;
        }
        if (this.curState == Monster.Action_Dead || this.curState == BaseGameObject.Action_Hurt) return;
        if (this.isExistBuff(buff) && (buff.buffData.controlType == ControlType.YES) && (buff.buffData.superpositionType == SuperpositionType.SuperpositionType_None)) return;
        this.buffStartAct(buff);
    }

    /**buff开始作用 */
    public buffStartAct(buff:any) {
        this.buff.push(buff);
        this.armature.play(BaseGameObject.Action_Hurt);
        buff.buffStart(this);
    }

    /**
     * 帧事件处理函数
     */
    public armatureFrame(event:any):void {
        
    }
    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        if (this.curState == BaseGameObject.Action_Enter) {
            this.effectArmature.visible = false;
            if (this.isElite) {
                this.setBuff();
                if (this.isExistBuff(55, true)) this.isFaster = true;
                else this.isFaster = false;
            }
        }
        else if (this.curState == BaseGameObject.Action_Hurt) {
            this.effectArmature.visible = false;
        }
        if (this.attr.hp <= 0) {
            this.gotoDead();
        }else{
            this.gotoRun();
            // this.gotoIdle();
        }
    }

    public armaturePlayEnd():void {
        
    }
    /**
     * 停止动画
     */
    public removeComplete():void {
        this.armature.removeCompleteCallFunc(this.armaturePlayEnd, this);
        this.effectArmature.removeCompleteCallFunc(this.effectArmaturePlayEnd, this);
    }
    /**回收技能和buff */
    public recycle():void {
        for (let i = 0; i < this.buff.length; i++) {
            if (this.buff[i].buffData.className) {
                this.buff[i].recycleBuff();
            }
        }
    }

    /**
     * 经验和魂石出现
     */
    public fallExpAndSoul():void {
        Animations.fadeOut(this.img_exp, 1000, null, ()=>{
            this.moveExpAndSoul(this.img_exp, 1);
        })
        // let probability:number = MathUtils.getRandom(1, 10000);
        // if (probability <= 9000) {
            Animations.fadeOut(this.img_soul, 1000, null, ()=>{
                this.moveExpAndSoul(this.img_soul, 2);
            })
        // }
    }

    /**
     * 经验和魂石漂移
     */
    public moveExpAndSoul(target:any, type:number):void {
        if (type == 1) this.isMovExp = true;
        else if (type == 2) this.isMovSoul = true;
        let point = target.localToGlobal();
        target.x = this.x;
        target.y = this.y + 20;
        SceneManager.battleScene.effectLayer.addChild(target);
    }

    /**
     * 收货经验和魂石
     */
    public gainExpAndSoul(target:any, type:number, spd:number, originx:number) {
        let tempRadian = MathUtils.getRadian2(target.x, target.y, GameData.heros[0].x, GameData.heros[0].y);
        let deltax = Math.cos(tempRadian) * spd;
        let deltay = Math.sin(tempRadian) * spd;
        target.x += deltax;
        target.y += deltay;
        var dis = MathUtils.getDistance(target.x, target.y, GameData.heros[0].x, GameData.heros[0].y);
        if (dis < 10) {
            if (type == 1) this.isMovExp = false;
            else if (type == 2){
                this.getExpAndSoulCount();
                this.isMovSoul = false;
            }
            target.x = originx;
            target.y = -20;
            target.alpha = 0;
            this.addChild(target);
        }
    }

    /**
     * 获取经验和魂石的数量
     */
    public getExpAndSoulCount():void {
        let stageData = modBattle.getStage();
        let exp:number = stageData.exp;
        let soul:number = modBattle.getSoulCount();
        modBattle.setExp(exp);
        modBattle.setSoul(soul);
        SceneManager.battleScene.battleSceneCom.setExpAndSoul(modBattle.getExp(), modBattle.getSoul());
    }

    /**
     * 创建经验和魂石的图片
     */
    public createExpAndSoul():void {
        this.img_exp = Utils.createBitmap("img_fallExp_png");
        this.img_exp.x = -10;
        this.img_exp.y = -20;
        this.img_exp.alpha = 0;
        this.addChild(this.img_exp);
        this.img_soul = Utils.createBitmap("img_fallSoul_png");
        this.img_soul.x = 10;
        this.img_soul.y = -20;
        this.img_soul.alpha = 0;
        this.addChild(this.img_soul);
    }

    /**设置受击次数 */
    public setBeAttackCount(value):void {
        this.beAttackCount = value;
    }

    /**获取受击次数 */
    public getBeAttackCount():number {
        return this.beAttackCount;
    }

    /**
     * 受击次数处理
     */
    public onAttackCount():void {
        // if (this.beAttackCount >= 2) {
            this.beAttackCount = 0;
            this.rangeDamage();
        // }
    }

    /**
     * 受到范围伤害处理
     */
    public rangeDamage():void {
        let enermy = GameData.heros[0].getEnermy();
        for (let i = 0; i < enermy.length; i++) {
            let dis = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, enermy[i].x, enermy[i].y);
            if (dis < 300 && enermy[i].attr.hp > 0) {
                let value:number = GameData.heros[0].attr.atk * 0.5;
                enermy[i].gotoHurt(value);
                enermy[i].buffArmature.visible = true;
                enermy[i].buffArmature.x = 0;
                enermy[i].buffArmature.y = -40;
                enermy[i].buffArmature.play("leidian", 1);
                egret.setTimeout(()=>{enermy[i].buffArmature.visible = false;}, this, 500);
                enermy[i].beAttackCount = 0;
            }
        }
    }

    /****************************************************/

    public colorMatrix = [
        1,0,0,0.4,0,
        1,0,0,0,0,
        1,0,0,0,0,
        0,0,0,1,0
    ]
    public colorFlilter:egret.ColorMatrixFilter;
    public defaultMatrix = [
        1,0,0,0,0,
        0,1,0,0,0,
        0,0,1,0,0,
        0,0,0,1,0
    ]
    public defaultFlilter:egret.ColorMatrixFilter;
    /**受到的伤害是否为技能伤害 */
    public isSkillHurt:boolean;
    /**是否远程攻击 */
    public isRemote:boolean;
    /**攻击距离 */
    public atk_distance:number;
    /**逃离距离 */
    public away_distance:number;
    /**是否为召唤兵 */
    public isSummon:boolean;
    /**是否为精英怪 */
    public isElite:boolean;
    /**是否为boss */
    public isBoss:boolean;
    /**是否快速移动 */
    public isFaster:boolean;
    /**是否技能准备 */
    public isReadSkill:boolean;
    /**经验图片 */
    public img_exp:egret.Bitmap;
    /**魂石图片 */
    public img_soul:egret.Bitmap;
    /**经验和魂石的移动 */
    public isMovExp:boolean;
    public isMovSoul:boolean;
    /**感叹号(攻击提示) */
    public img_sigh:egret.Bitmap;
    /**受击次数 */
    public beAttackCount:number;
    /**精英怪的特殊buff */
    public arrayBuffs:Array<number>;

    /*************敌方的状态***************/
    public static Action_Run01:string = "run01";
    public static Action_Run02:string = "run02";
    public static Action_Run03:string = "run03";
    public static Action_Dead:string = "dead";
    public static Action_HurtDie:string = "hurt_die";

}