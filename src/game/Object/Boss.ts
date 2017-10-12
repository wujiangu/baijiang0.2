/**
 * Boss
 * 技能1的范围: 宽:180, 高:85
 */
class Boss extends Enermy {
    public constructor() {
        super();
        this._skill = new Array();
    }

    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
        this.armature.register(DragonBonesFactory.getInstance().makeArmature(name, name, 4.0), [
            BaseGameObject.Action_Hurt,
            BaseGameObject.Action_Attack01,
            BaseGameObject.Action_Attack02,
            BaseGameObject.Action_Attack03,
            Enermy.Action_Dead,
            Enermy.Action_Run01,
            Enermy.Action_Run02,
            Enermy.Action_Run03,
            Boss.Action_Idle01,
            Boss.Action_Skill01_01,
            Boss.Action_Skill01_02,
            Boss.Action_Skill01_03,
            Boss.Action_Skill02
        ]);
        //增加动画帧执行函数
        this.armature.addFrameCallFunc(this.armatureFrame, this);

        //释放主动技能动画
        this.skillArmature.register(DragonBonesFactory.getInstance().makeArmature("Boss01_effect01", "Boss01_effect01", 2.0), [
            "skill01"
        ]);

        this.armature.scaleX = 1.5;
        this.armature.scaleY = 1.5;
        // this.skillArmature.scaleX = 1.5;
        // this.skillArmature.scaleY = 1.5;
    }

    public init(data:Array<any>) {
        Common.log(JSON.stringify(data[1]));
        this.attr.initEnermyAttr(data[1].attr);
        super.init(data);
        this.initDragonBonesArmature(data[0]);
        //boss技能
        this._addSkill(data[1])
        this.skillPoint = new egret.Point();
        this.isBoss = true;
        this.offset = [[50, -25], [25, -25], [0, 0], [-50, 0], [-50, -25]]
        this.speed = 10;
        this.atk_range = 200;
        this.atk_speed = 75;
        this._remote = false;
        this.skill_atkStatus = false;
        //增加动画完成函数
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
        this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
        this.skillArmature.addCompleteCallFunc(this.skillArmaturePlayEnd, this);
        this.gotoEnter();
        this.hurtState = 0;
    }

    /**
     * 设置技能
     */
    private _addSkill(data:any):void {
        this._skill = [];
        for (let i = 0; i < data.skill.length; i++) {
            let skillConfig = data.skill[i];
            this._skill[i] = ObjectPool.pop(skillConfig);
            this._skill[i].init(this);
        }
    }

    /**
     * 到达边缘
     */
    private _bound():void {
        this._deltaX = 0;
        this._deltaY = 0;
        this._remote = false;
        this.skillArmature.visible = false;
    }

    public update(time:number):void {
        super.update(time);
        if (this._remote) {
            this._skill[1].update(this._deltaX, this._deltaY);
            let skillPoint = this.skillArmature.localToGlobal();
            if (skillPoint.x < 20) this._bound();
            if (skillPoint.y < 20) this._bound();
            if (skillPoint.x > Common.SCREEN_W - 20) this._bound();
            if (skillPoint.y > Common.SCREEN_H - 20) this._bound();
        }
    }

    /**
     * 待机状态
     */
    public state_idle(time:number):void {

    }

    /**
     * 释放技能
     */
    public state_skill01(time:number):void {

    }

    /**
     * 奔跑状态
     */
    public state_run(time:number):void {
        super.state_run(time);
    }

    /**
     * 攻击状态
     */
    public state_attack(time:number):void {
        if (!this.canMove) return;
        this.x = this.x + this.deltaX;
        this.y = this.y + this.deltaY;
        if (!this.skill_atkStatus) {
            var dis = MathUtils.getDistance(this.x, this.y, GameData.heros[0].x, GameData.heros[0].y);
            if (dis < 33) {
                this.skill_atkStatus = true;
                GameData.heros[0].gotoHurt(this.attr.atk);
            }
        }
    }
    /**
     * 收到攻击状态
     */
    public state_hurt(time:number):void {
        
    }

    /**奔跑 */
    public gotoRun() {
        super.gotoRun();
        this.isReadSkill = false;
    }

    /**
     * 受伤
     */
    public gotoHurt(hurtValue:number = 1, isSkillHurt:boolean = false) {
        if (this.attr.hp <=0 ) return;
        if (modBuff.isBlind(GameData.heros[0])) return;
        if (!this.isReadSkill) {
            if (this.curState == Boss.Action_Skill02 || this.curState == "skill01") {
                this.isReadSkill = true;
                this.attr.hp -= hurtValue;
                ShakeTool.getInstance().shakeObj(SceneManager.battleScene, 1, 5, 5);
                if (this.attr.hp <= 0){
                    this.curState = BaseGameObject.Action_Hurt;
                    this.armature.play(this.curState, 0);
                    this.effectArmature.visible = true;
                    this.effectArmature.play(Enermy.Action_HurtDie, 1);
                    this.effectArmature.x = 0;
                    this.effectArmature.y = 0;
                }
                this.beAttackCount ++;
                this.hurtAnimate(hurtValue);
            }else{
                super.gotoHurt(hurtValue, isSkillHurt);
            }
        }
        // this.filters = [this.defaultFlilter];
        this.skillArmature.visible = false;
        this.bloodTip();
    }

    /**蓄力 */
    public gotoReady() {
        this.gotoAttack();
    }

    /**攻击 */
    public gotoAttack() {
        super.gotoAttack();
        this.deltaX = 0;
        this.deltaY = 0;
        this.skill_atkStatus = true;
        setTimeout(()=>{
            Animations.fadeOutIn(this.img_sigh, 200);
        }, 200);
        this.atk_direction = this.getWalkPosition("attack", this.radian);
        this.armature.play(this.atk_direction, 1);
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
    }

    /**
     * 技能
     */
    public gotoSkill() {
        super.gotoSkill();
        this.curState = "skill01";
        this.originX = this.x;
        this.originY = this.y;
        setTimeout(()=>{
            Animations.fadeOutIn(this.img_sigh, 200);
        }, 500);
        /**攻击的弧度 */
        this.radian = MathUtils.getRadian2(this.originX, this.originY, GameData.heros[0].x, GameData.heros[0].y);
        this.atk_direction = this.getWalkPosition("skill01_", this.radian);
        this.armature.play(this.atk_direction, 1);
    }

    /**
     * 进场
     */
    public gotoEnter() {
        this.armature.play(Boss.Action_Idle01, 0);
        super.gotoEnter();
    }

    /**
     * 技能特效的角度及移动距离
     */
    private skillRadian() {
        this.sumDeltaX = 0;
        this.sumDeltaY = 0;
        this.originX = this.x;
        this.originY = this.y;
        let useSpeed = this.atk_speed * 0.1;
        this.radian = MathUtils.getRadian2(this.originX, this.originY, GameData.heros[0].x, GameData.heros[0].y);
        let animation = this.getAttackPosition(this.radian);
        this.offsetIndex = animation["id"];

        this._deltaX = Math.cos(this.radian) * useSpeed;
        this._deltaY = Math.sin(this.radian) * useSpeed;

        this.skillArmature.scaleX = 1;
        this.skillArmature.scaleY = 1;
        this.skillArmature.rotation = MathUtils.getAngle(this.radian) + 360;
        SceneManager.battleScene.effectLayer.addChild(this.skillArmature);
        this.skillArmature.x = this.x;
        this.skillArmature.y = this.y + 50;
        if (this.reverse(this, this.radian)) {
            this.skillArmature.y = this.y;
        }
    }

    /**增加buff */
    public addBuff(buff:any, isBind:boolean = false) {
        super.addBuff(buff, isBind);
    }

    /**死亡 */
    public gotoDead() {
        super.gotoDead();
        egret.Tween.removeTweens(this.armature);
        this.armature.filters = [this.defaultFlilter];
        if (this._skill) {
            for (let i = 0; i < this._skill.length; i++) {
                this._skill[i].end();
            }
        }
    }
    /**消失 */
    public disappear():void {
        super.disappear();
        let index = GameData.boss.indexOf(this);
        GameData.boss.splice(index, 1);
    }
    /**
     * 帧事件处理函数
     */
    public armatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "skill01") {
            this.skillArmature.visible = true;
            this.skill_atkStatus = false;
            this.skillRadian();
            this.skillArmature.play(this.curState, 1);
            this._remote = true;
        }
        else if (evt == "attack") {
            //怪物到英雄的距离
            let useSpeed = this.atk_distance * 0.035;
            let tempX:number = Math.cos(this.radian) * useSpeed;
            let tempY:number = Math.sin(this.radian) * useSpeed;
            this.deltaX = parseFloat(tempX.toFixed(2));
            this.deltaY = parseFloat(tempY.toFixed(2));
            this.skill_atkStatus = false;
        }
        else if (evt == "call") {
            this._skill[0].update();
        }
    }


    public skillArmaturePlayEnd():void {
        if (this.curState == "skill01") {
            this.isReadSkill = false;
            this.gotoRun();
        }
    }
    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        if (this.curState == BaseGameObject.Action_Enter) {
             this.effectArmature.visible = false;
             egret.setTimeout(()=>{this._skill[0].call();}, this, 50);
             return;
        }
        super.effectArmaturePlayEnd();
        // Common.log("effection----->", this.curState)
        // if (this.curState == BaseGameObject.Action_Enter) {
        //     if (this._skill[0].name == "Summon") {
        //         egret.setTimeout(()=>{this._skill[0].call();}, this, 50);
        //     }else{
        //         this.gotoRun();
        //     }
        // }
    }

    public armaturePlayEnd():void {
        super.armaturePlayEnd();
        switch (this.curState) {
            // case BaseGameObject.Action_Enter:
            //     if (this._skill[0].name == "Summon") {
            //         egret.setTimeout(()=>{this._skill[0].call();}, this, 50);
            //     }else{
            //         this.gotoRun();
            //     }
            // break;
            case "attack":
                this.gotoRun();
                this.isComplete = false;
                this.atk_timer.start();
            break;
            case Boss.Action_Skill02:
                this.gotoRun();
                this.isReadSkill = false;
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

    /**血量提示 */
    public bloodTip():void {
        if (this.attr.hp <= 0.5 * this.originHP &&　this.attr.hp > 0.25 * this.originHP && this.hurtState == 0) {
            egret.log("半血状态");
            this.hurtState = 1;
            this.flashTime = 1000;
            this.objFadeEffect();
        }
        else if (this.attr.hp <= 0.25 * this.originHP && this.hurtState == 1) {
            egret.log("残血状态");
            this.hurtState = 2;
            this.flashTime = 500;
        }
    }

    private objFadeEffect():void{
        this.armature.filters = [this.colorFlilter];
        egret.Tween.get(this.armature).to({}, this.flashTime).call(()=>{
            this.armature.filters = [this.defaultFlilter];
            egret.Tween.get(this.armature).to({}, this.flashTime).call(this.objFadeEffect, this);
        },this)
    }

    /**技能 */
    private _skill:Array<any>;
    private hurtState:number;
    private flashTime:number;
    public isSkillHurt:boolean;
    /**远程技能位移 */
    private _remote:boolean;
    private _deltaX:number;
    private _deltaY:number;
    /**技能的坐标 */
    private skillPoint:egret.Point;

    /*************英雄的动作***************/
    private static Action_Skill01_01:string = "skill01_01"
    private static Action_Skill01_02:string = "skill01_02"
    private static Action_Skill01_03:string = "skill01_03"
    private static Action_Skill02:string = "skill02";
    private static Action_Idle01:string = "idle01";

    private atk_direction:string;
    /**技能攻击状态 0:没有攻击到 1:已经攻击到 */
    public skill_atkStatus:boolean;
    /************************************/

    private offset:any[];
    private offsetIndex:number;
}