/**
 * 怪物
 */
class Monster extends Enermy {
    public constructor(name:string) {
        super(name);
        this.initDragonBonesArmature(name);
    }

    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
        this.armature.register(DragonBonesFactory.getInstance().makeArmature(name, name, 2), [
            BaseGameObject.Action_Hurt,
            BaseGameObject.Action_Attack01,
            BaseGameObject.Action_Attack02,
            BaseGameObject.Action_Attack03,
            Enermy.Action_Idle1,
            Enermy.Action_Idle2,
            Enermy.Action_Idle3,
            Enermy.Action_Run01,
            Enermy.Action_Run02,
            Enermy.Action_Run03,
            Enermy.Action_Dead,
            Monster.Action_Ready01,
            Monster.Action_Ready02,
            Monster.Action_Ready03
        ]);
        //增加动画帧执行函数
        this.armature.scaleX = 1.5;
        this.armature.scaleY = 1.5;
    }

    public init(data:Array<any>, isElite:boolean = false, isSummon:boolean = false) {
        this.attr.initEnermyAttr(data[1].attr);
        super.init(data);
        this._isAvatar = data[1].isAvatar;
        this.direction = data[1].direction;
        // this.initDragonBonesArmature(data[0]);
        this.armature.addFrameCallFunc(this.armatureFrame, this);
        this.addSkillArmature(data[1].type);
        this.isSummon = isSummon;
        this.isElite = isElite;
        this.speed = 10;
        this.readyCount = 0;
        this.skill_atkStatus = false;
        //增加动画完成函数
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
        this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
        this.gotoEnter();
        // Common.log(JSON.stringify(this.confData));
    }

    /**
     * 主动或远程骨架添加
     */
    public addSkillArmature(name:string):void {
        //释放主动技能动画
        if (ConfigManager.isInArmatures(`${name}_skill`)) {
            this.skillArmature.register(DragonBonesFactory.getInstance().makeArmature(`${name}_skill`, `${name}_skill`, 10), [
                "skill01_01",
                "skill01_02"
            ]);
            this.skillArmature.addFrameCallFunc(this.skillArmatureFrame, this);
        }
        this.skillArmature.scaleX = 1.5;
        this.skillArmature.scaleY = 1.5;
    }

    /**
     * 到达边缘
     */
    private _bound():void {
        this.skillArmature.play("skill01_01", 1);
        this.deltaX = 0;
        this.deltaY = 0;
        this._remote = false;
    }

    /**
     * 技能释放或远程攻击状态
     */
    public skillFly() {
        this.skillArmature.x += this._deltaX;
        this.skillArmature.y += this._deltaY;
        //初始点的对角点
        let skillPoint = this.skillArmature.localToGlobal();
        if (!this.skill_atkStatus) {
            for (let i = 0; i < GameData.heros.length; i++) {
                let dis = MathUtils.getDistance(skillPoint.x, skillPoint.y, GameData.heros[i].x, GameData.heros[i].y);
                if (dis <= 30) {
                    let state = GameData.heros[i].getCurState();
                    if (state == "attack") {
                        this._bound();
                    }else{
                        GameData.heros[i].gotoHurt(this.attr.atk);
                        this._bound();
                    }
                    this.skill_atkStatus = true;
                }
            }
        }
        if (skillPoint.x < 20) this._bound();
        if (skillPoint.y < 20) this._bound();
        if (skillPoint.x > Common.SCREEN_W - 20) this._bound();
        if (skillPoint.y > Common.SCREEN_H - 20) this._bound();
    }

    public update(time:number):void {
        super.update(time);
        if (this._remote) {
            this.skillFly();
        }
    }

    /**
     * 待机状态
     */
    public state_idle(time:number):void {

    }

    /**死亡状态 */
    public state_dead(time:number):void {

    }

    /**
     * 走路巡逻状态
     */
    public state_run(time:number, func:Function = null):void {
        super.state_run(time, func);
    }

    /**
     * 收到攻击状态
     */
    public state_hurt(time:number):void {
        // Common.log(this.effectArmature.getState(this.curState));
    }

    /**攻击状态 */
    public state_attack(time:number):void {
        if (!this.canMove) return;
        if (Math.abs(this.sumDeltaX) > this.atk_rangeX || Math.abs(this.sumDeltaY) > this.atk_rangeY) {
            if (this.curState == BaseGameObject.Action_Hurt) {
                return;
            }
            this.gotoRun();
            this.isComplete = false;
            this.atk_timer.start();
            //怪物到英雄的距离
            // var dis = MathUtils.getDistance(this.centerX, this.centerY, GameData.heros[0].x, GameData.heros[0].y);
            // var dx = dis*Math.cos(this.heroRadian);
            // var dy = dis*Math.sin(this.heroRadian);
            // if ((Math.abs(dx) <= this.atk_distance/2) && (Math.abs(dy) <= 33)) {
            //     GameData.heros[0].gotoHurt();
            // }else{
            // }
        }
        let gotoX = this.x + this.deltaX;
        let gotoY = this.y + this.deltaY;
        let isMove:boolean = this.isCollison(gotoX, gotoY);
        if (!isMove) {
            this.gotoRun();
            return;
        }
        this.x = Math.floor(gotoX);
        this.y = Math.floor(gotoY);
        this.sumDeltaX = this.sumDeltaX + this.deltaX;
        this.sumDeltaY = this.sumDeltaY + this.deltaY;
        if (!this.skill_atkStatus) {
            for (let i = 0; i < GameData.heros.length; i++) {
                var dis = MathUtils.getDistance(this.x, this.y, GameData.heros[i].x, GameData.heros[i].y);
                if (dis < 33) {
                    GameData.heros[i].gotoHurt(this.attr.atk);
                    this.skill_atkStatus = true;
                }
            }
        }
    }

    /**
     * 进场
     */
    public gotoEnter() {
        super.gotoEnter();
        this.armature.play(Enermy.Action_Idle3, 0);
    }

    /**奔跑 */
    public gotoRun() {
        super.gotoRun();
    }

    /**
     * 技能
     */
    public gotoSkill() {
        super.gotoSkill();
        this.curState = "skill";
        let useSpeed = this.atk_distance * 0.02;
        this.originX = Math.floor(this.x);
        this.originY = Math.floor(this.y);
        /**攻击的弧度 */
        this.radian = MathUtils.getRadian2(this.originX, this.originY, GameData.heros[0].x, GameData.heros[0].y);
        this._deltaX = Math.ceil(Math.cos(this.radian) * useSpeed);
        this._deltaY = Math.ceil(Math.sin(this.radian) * useSpeed);
        this.skillArmature.rotation = MathUtils.radianToAngle(this.radian);
        this.skillArmature.visible = true;
        this.skillArmature.x = 0;
        this.skillArmature.y = -50;
        SceneManager.battleScene.effectLayer.addChild(this.skillArmature);
        this.skillArmature.x = Math.floor(this.x);
        this.skillArmature.y = Math.floor(this.y);
        this.skillArmature.play("skill01_02", 0);
        this._remote = true;
        this.skill_atkStatus = false;
    }

    /**攻击 */
    public gotoAttack() {
        super.gotoAttack();
        this.sumDeltaX = 0;
        this.sumDeltaY = 0;
        let useSpeed = this.atk_distance * 0.05;

        let animation = this.getWalkPosition("attack", this.radian);
        let dx = Math.cos(this.radian) * this.atk_distance;
        let dy = Math.sin(this.radian) * this.atk_distance;
        this.atk_rangeX = Math.abs(dx);
        this.atk_rangeY = Math.abs(dy);
        /**中心点 */
        // this.centerX = (2*this.originX + dx)/2;
        // this.centerY = (2*this.originY + dy)/2;
        // this.heroRadian = MathUtils.getRadian2(this.centerX, this.centerY, GameData.heros[0].x, GameData.heros[0].y);

        let tempX:number = Math.cos(this.radian) * useSpeed;
        let tempY:number = Math.sin(this.radian) * useSpeed;
        this.deltaX = parseFloat(tempX.toFixed(2));
        this.deltaY = parseFloat(tempY.toFixed(2));
        this.armature.play(animation, 0);
        this.skill_atkStatus = false;
    }

    /**受到攻击 */
    public gotoHurt(hurtValue:number = 1, isSkillHurt:boolean = false) {
        if (modBuff.isBlind(GameData.heros[0])) return;
        super.gotoHurt(hurtValue, isSkillHurt);
    }

    /**增加buff */
    public addBuff(buff:any, isBind:boolean = false) {
        super.addBuff(buff, isBind);
    }

    /**蓄力 */
    public gotoReady() {
        if (!this.canMove) return;
        super.gotoReady();
        this.curState = "xuli";
        let animation = this.getReadyPosition("xuli", this.radian, this.confData.isRemote);
        this.readyCount = 0;
        this.armature.play(animation, 6);
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
    }

    /**死亡 */
    public gotoDead() {
        super.gotoDead();
        // SceneManager.battleScene.createChest({x:this.x, y:this.y, id:84});
        let random:number = MathUtils.getRandom(1, 100);
        if (random <= 10) {
            let id:number = 0;
            let seed:number = MathUtils.getRandom(1, 100);
            if (seed <= 40) id = MathUtils.getRandom(70, 74);
            else if (seed > 40 && seed <= 60) id = MathUtils.getRandom(75, 79);
            else id = MathUtils.getRandom(80, 84);
            SceneManager.battleScene.createChest({x:this.x, y:this.y, id:id});
        }
    }

    public gotoIdle() {
        this.curState = Enermy.Action_Idle3;
        this.armature.play(Enermy.Action_Idle3, 0);
    }

    /**消失 */
    public disappear():void {
        super.disappear();
        let index = GameData.monsters.indexOf(this);
        GameData.monsters.splice(index, 1);
    }

    /**
     * 帧事件处理函数
     */
    public armatureFrame(event:any):void {
        super.armatureFrame(event);
    }

    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        if (this._isAvatar && this.attr.hp <= 0) this.gotoHurt(1, true);
        else super.effectArmaturePlayEnd();
    }

    public skillArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "evtFracture") {
            this.skillArmature.visible = false;
            this._remote = false;
            this.addChild(this.skillArmature);
        }
    }

    /**
     * 动画播放完成函数
     */
    public armaturePlayEnd():void {
        super.armaturePlayEnd();
        switch (this.curState) {
            case "xuli":
                this.readyCount ++;
                if (this.readyCount == 6) {
                    if (this.isRemote){
                        this.gotoSkill();
                        this.isComplete = false;
                        this.atk_timer.start();
                        this.gotoRun();
                    }else{
                        this.gotoAttack();
                    }
                }
                else if (this.readyCount == 4 && this.isElite) {
                    Animations.fadeOutIn(this.img_sigh, 200);
                }
            break;
        }
    }

    /**
     * 停止动画
     */
    public removeComplete():void {
        super.removeComplete();
    }

    /**
     * 停止人物动作动画
     */
    public removeActComplete():void {
        this.armature.removeCompleteCallFunc(this.armaturePlayEnd, this);
    }

    public addEffectComplete() {
        this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
    }

    /**停止特效动画 */
    public removeEffectComplete():void {
        this.effectArmature.removeCompleteCallFunc(this.effectArmaturePlayEnd, this);
    }

    public isSkillHurt:boolean;
    private readyCount:number;
    private heroRadian:number;
    /**是否为分身 */
    public _isAvatar:boolean;
    /**分身的初始方向 1:左, 1:右 */
    public direction:number;
    /**远程攻击标志 */
    private _remote:boolean;
    private _deltaX:number;
    private _deltaY:number;
    /**远程攻击击中 */
    private skill_atkStatus:boolean;
    /*************英雄的动作***************/
    private static Action_Ready01:string = "xuli01";
    private static Action_Ready02:string = "xuli02";
    private static Action_Ready03:string = "xuli03";
    private static Action_Skill:string = "skill01"
    /************************************/
}