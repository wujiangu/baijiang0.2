/**
 * 英雄
 */
class Hero extends BaseGameObject {
    public constructor() {
        super();
    }

    private initDragonBonesArmature(name:string):void {
        this.armature.register(DragonBonesFactory.getInstance().makeArmature(name, name, 20.0), [
            BaseGameObject.Action_Enter,
            BaseGameObject.Action_Idle,
            BaseGameObject.Action_Hurt,
            BaseGameObject.Action_Attack01,
            BaseGameObject.Action_Attack02,
            BaseGameObject.Action_Attack03,
            BaseGameObject.Action_Attack04,
            BaseGameObject.Action_Attack05,
            Hero.Action_Run01,
            Hero.Action_Run02,
            Hero.Action_Run03
        ]);
        this.createSwordLight();
        // this.hideBone(name, "effect_att01");
        //增加动画帧执行函数
        this.armature.addFrameCallFunc(this.armatureFrame, this);

        //受伤动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("daoguang_effect", "daoguang_effect", 8), [
            BaseGameObject.Action_Hurt
        ]);

        //buff动画
        this.buffArmature.register(DragonBonesFactory.getInstance().makeArmature("buff", "buff", 10), [
            "Burning",
            "xuanyun"
        ]);
        this.buffArmature.visible = false;
        this.buffArmature.scaleX = 1.5;
        this.buffArmature.scaleY = 1.5;
        /**从配置文件读取技能动画 */
        // let heroConfig = HeroData.list[name];
        let heroConfig = ConfigManager.heroConfig[name];
        let skillArmature = `${name}_skill`;
        this.skillArmature.register(DragonBonesFactory.getInstance().makeArmature(skillArmature, skillArmature, 10), [
            Hero.Effect_Skill01,
            Hero.Effect_SKill02,
            Hero.Effect_SKill03
        ]);
        this.skillArmature.addFrameCallFunc(this.armatureFrame, this);

        this.skill = ObjectPool.pop(heroConfig["skill"]);
        this.skill.init();
        this.armature.scaleX = 1.5;
        this.armature.scaleY = 1.5;
        this.effectArmature.scaleX = 1.5;
        this.effectArmature.scaleY = 1.5;
        this.skillArmature.scaleX = 1.5;
        this.skillArmature.scaleY = 1.5;
        this.img_swordLight.texture = RES.getRes(`${name}-pugong_png`);
    }

    public init(data:Array<any>, isPVP:boolean=false) {
        this.isInvincible = true;
        super.init(data);
        this.initDragonBonesArmature(data[0]);
        this.attr.initHeroAttr(data[1]);
        this.atk_timer.delay = this.attr.wsp * 1000;
        this.name = data[0];
        this.offset = [[1, -113], [77, -109], [121, -50], [75, 14], [0, 23]];
        // this.offset = [[2, -74], [49, -71], [79, -32], [50, 9], [0, 15]]
        this.speed = 40;
        this.originHP = this.attr.hp;
        this._shieldCount = 0;
        this.atk_range = 200;
        this.atk_speed = 150;
        this.isEnemy = false;
        this.isPlay = false;
        this.isPVP = isPVP;
        this.skill_status = false;
        this.enermy = [];
        this.buff = [];
        this.lastKill = 0;
        this.lastAnimation = "";
        this.skill.skillData.skill_range = 150;
        this.visible = false;
        this.shadow.visible = false;
        this.canMove = false;
        // this.curState = BaseGameObject.Action_Enter;
        egret.setTimeout(()=>{
            this.visible = true;
            this.gotoEnter();
        }, this, 500);
        this.effectArmature.visible = false;
        this._hurtValue = 0;
        if (data[2]) this.attr.hp = data[3];
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
        if (!isPVP) SceneManager.battleScene.showComboLayer();
    }

    /**
     * 无敌状态
     */
    public gotoInvincible(time:number = 1500):void {
        Animations.flash(this, time, 190, ()=>{this.isInvincible = false});
    }

    /**
     * 设置硬直时间
     */
    public setWSPDelay():void {
        this.atk_timer.delay = Math.floor(this.attr.wsp * 1000);
    }

    /**
     * 设置技能冷却时间
     */
    public setSkillCd(value:number) {
        this.skill.cd = value;
    }

    public getSkillCd():number {
        return this.skill.cd;
    }

    /**设置护盾的值 */
    public setShieldCount(value:number) {
        this._shieldCount = value;
    }

    /**获取护盾的值 */
    public getShieldCount():number {
        return this._shieldCount;
    }

    public setSwordStatus(status:boolean):void {
        this.img_swordLight.visible = status;
    }

    /**
     * 设置buff或被动技能
     */
    public setBuff():void {
        // let buff:Array<number> = ConfigManager.heroConfig[this.name].buff;  //test
        // let talent:Array<any> = GameData.testTalent.talent;     //test
        let buff = HeroData.list[this.name].buff;
        let curPage:number = UserDataInfo.GetInstance().GetBasicData("curTalentPage") - 1;
        let talent:Array<any> = modTalent.getData(curPage).talent;
        // Common.log("talent---->", JSON.stringify(talent));
        for (let i = 0; i < talent.length; i++) {
            let id = talent[i][0] + 19;
            buff.push(id);
        }
        for (let i = 0; i < buff.length; i++) {
            let buffConfig = modBuff.getBuff(buff[i]);
            let newBuff = ObjectPool.pop(buffConfig.className);
            newBuff.buffInit(buffConfig)
            this.addBuff(newBuff);
        }
    }

    /**增加buff */
    public addBuff(buff:any):void {
        if (this.isExistBuff(buff) && (buff.buffData.controlType == ControlType.YES) && (buff.buffData.superpositionType == SuperpositionType.SuperpositionType_None)) return;
        Common.log("增加buff----->", buff.buffData.className);
        this.buff.push(buff);
        buff.buffStart(this);
    }

    /**回收技能类 */
    public recycleSkill():void {
        this.skill.end();
        for (let i = 0; i < this.buff.length; i++) {
            if (this.buff[i].buffData.className) {
                this.buff[i].recycleBuff();
            }
        }
        ConfigManager.heroConfig[this.name].buff.splice(2);
        HeroData.list[this.name].buff.splice(2);         //test
        let data:any = HeroData.getHeroData(GameData.curHero);
        HeroData.update();
    }

    /**
     * 设置敌人(当英雄进行攻击、释放技能时，判断受到影响的敌人)
     */
    public setEnermy():void {
        this.enermy = [];
        if (!this.isPVP) {
            for (let i = 0; i < GameData.boss.length; i++) {
                this.enermy.push(GameData.boss[i]);
            }
            for (let i = 0; i < GameData.monsters.length; i++) {
                this.enermy.push(GameData.monsters[i]);
            }
        }else{
            for (let i = 0; i < GameData.stakes.length; i++) {
                this.enermy.push(GameData.stakes[i]);
            }
        }
    }

    /**
     * 获取敌人
     */
    public getEnermy():any {
        return this.enermy;
    }

    /**
     * 每帧数据更新
     */
    public update(time:number):void {
        super.update(time);
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
        // this.skill.update(this);
    }

    /**
     * 奔跑状态
     */
    public state_run(time:number):void {
        if ((this.originX == this.endX) && (this.originY == this.endY)) {
            return;
        }
        let gotoX = this.x + this.deltaX;
        let gotoY = this.y + this.deltaY;
        if (!this.isPVP) {
            let isMove:boolean = this.isCollison(gotoX, gotoY);
            if (!isMove) return;
        }
        if (!this.canMove) return;
        this.x = Math.floor(gotoX);
        this.y = Math.floor(gotoY);
    }

    /**
     * 攻击状态
     */
    public state_attack(time:number):void {
        //滑行结束
        if (Math.abs(this.sumDeltaX) > this.atk_rangeX || Math.abs(this.sumDeltaY) > this.atk_rangeY) {
            this.gotoIdle();
            this.img_swordLight.visible = false;
            let count:number = 0;
            //怪物到中点的距离
            for (let i = 0; i < this.enermy.length; i++) {
                let radian = MathUtils.getRadian2(this.centerX, this.centerY, this.enermy[i].x, this.enermy[i].y);
                let dis = MathUtils.getDistance(this.centerX, this.centerY, this.enermy[i].x, this.enermy[i].y);
                let angle = Math.abs(this.atk_radian - radian);
                let dx = dis*Math.cos(angle);
                let dy = dis*Math.sin(angle);
                if ((Math.abs(dx) <= this.atk_range/2) && (Math.abs(dy) <= 30) && (this.enermy[i].attr.hp > 0)) {
                    this.setHurtValue(this.attr.atk);
                    if (!this.isPVP && this.enermy[i]) {
                        let state = this.enermy[i].curState;
                        if (state != Enermy.Action_Dead && state != BaseGameObject.Action_Hurt && !this.enermy[i].isReadSkill) {
                            this.isHit = true;
                        }
                        modBuff.isAttackBuff(this, this.enermy[i]);
                    }
                    if (this.isCrit()){
                        this._hurtValue *= 1.5;
                    }
                    this.enermy[i].gotoHurt(this._hurtValue);
                    if (!this.isPVP && this.enermy[i]) {
                        let state = this.enermy[i].getCurState();
                        if (this.enermy[i].attr.hp <= 0 && state != Enermy.Action_Dead) count ++;
                    }
                }
            }
            if (!this.isPVP && count > 0){
                let killCount:number = modBattle.getSumkill();
                if (this.lastKill != killCount) {
                    this.lastKill = killCount;
                    SceneManager.battleScene.update(killCount);
                }
                if (count >= 2) {
                    SceneManager.battleScene.updateInstantKill(count);
                }
            }
            return;
        }
        if (Math.abs(this.sumDeltaX)>this.atk_rangeX/3){
            this.img_swordLight.visible = true;
        }
        let gotoX = this.x + this.deltaX;
        let gotoY = this.y + this.deltaY;
        if (!this.isPVP) {
            let isMove:boolean = this.isCollison(gotoX, gotoY);
            if (!isMove) {
                let buffConfig = modBuff.getBuff(2);
                let extraBuff = ObjectPool.pop(buffConfig.className);
                extraBuff.buffInit(buffConfig);
                extraBuff.effectName = "xuanyun";
                extraBuff.buffData.id = buffConfig.id;
                extraBuff.buffData.duration = buffConfig.duration;
                extraBuff.buffData.postionType = PostionType.PostionType_Head;
                this.addBuff(extraBuff);
                this.armature.play(BaseGameObject.Action_Hurt, 0);
                this.img_swordLight.visible = false;
                return;
            }
        }
        if (!this.canMove){
            this.img_swordLight.visible = false;
            return;
        }
        this.x = Math.floor(gotoX);
        this.y = Math.floor(gotoY);
        // this.x = this.x + this.deltaX;
        // this.y = this.y + this.deltaY;
        this.sumDeltaX = this.sumDeltaX + this.deltaX;
        this.sumDeltaY = this.sumDeltaY + this.deltaY;
    }
    /**
     * 收到攻击状态
     */
    public state_hurt(time:number):void {
        // Common.log(this.effectArmature.getState(this.curState));
    }
    /**
     * 走到指定的位置
     * 
     */
    public moveToTarget(gotoX:number, gotoY:number, func:Function = null):void {
        super.moveToTarget(gotoX, gotoY, func);
        this.img_swordLight.visible = false;
        // if (this.isAttack || this.curState == BaseGameObject.Action_Hurt || this.curState == Hero.Action_Skill || this.curState == BaseGameObject.Action_Enter) return;
        if (this.curState == BaseGameObject.Action_Hurt || this.curState == Hero.Action_Skill || this.curState == BaseGameObject.Action_Enter) return;
        if (func != null) {
            func();
        }
    }

    /**
     * 进入待机状态
     */
    public gotoIdle() {
        this.curState = Hero.Action_Idle;
        // this.isAttack = false;
        this.isPlay = false;
        this.img_swordLight.visible = false;
        super.gotoIdle();
    }

    /**奔跑 */
    public gotoRun() {
        if (!this.canMove) return;
        if (this.curState == "skill") return;
        this.curState = "run";
        let useSpeed:number = this.speed * 0.1;
        this.radian = MathUtils.getRadian2(this.x, this.y, this.endX, this.endY);
        let animation = this.getWalkPosition("run", this.radian);
        let tempX = Math.cos(this.radian) * useSpeed;
        let tempY = Math.sin(this.radian) * useSpeed;
        this.deltaX = parseFloat(tempX.toFixed(2));
        this.deltaY = parseFloat(tempY.toFixed(2));
        this.reverse(this, this.radian);
        if (!this.isPlay || this.lastAnimation != animation) {
            this.lastAnimation = animation;
            this.armature.play(animation, 0, 1, 0, 2);
            // this.armature.setTimeScale(animation, 2);
            this.isPlay = true;
        }
    }

    /**
     * 是否闪避
     */
    public isDodge():boolean {
        let random = MathUtils.getRandom(1, 100);
        if (random <= this.attr.avo) return true;
        return false;
    }

    /**
     * 是否暴击
     */
    public isCrit():boolean {
        let random = MathUtils.getRandom(1, 100);
        if (random <= this.attr.crt) return true;
        return false;
    }

    /**
     * 是否存在溢出血量的护盾
     */
    public overFlow(value:number):number {
        let hurt:number = 0;
        if (this._shieldCount >= value) {
            this._shieldCount -= value;
        }else{
            hurt = value - this._shieldCount;
            this._shieldCount = 0;
        }
        for (let i = 0; i < this.buff.length; i++) {
            //风语者的祝福
            if (this.buff[i].buffData.id == 40) {
                this.buff[i].shieldBeAttack(value);
                break;
            }
        }
        SceneManager.battleScene.battleSceneCom.setShieldProgress(this._shieldCount);
        return hurt;
    }

    /**
     * 受伤
     */
    public gotoHurt(value:number = 1) {
        if (this.isInvincible) return;
        //回避
        if (this.isDodge()) return;
        //护盾
        let shieldCount:number = this.overFlow(value);
        if (shieldCount == 0) return;
        else value = shieldCount;
        //免疫伤害
        if (!this.skill_status){
            if (modBuff.isImmuneBuff(this)) return;
        }
        if (this.curState == BaseGameObject.Action_Hurt || this.curState == "attack") return;
        SceneManager.battleScene.bloodTween();
        this.hurtHandler(value);
    }

    /**
     * 受伤处理
     */
    public hurtHandler(value:number):void {
        super.hurtHandler(value);
        if (this.isInvincible) return;
        this.curState = BaseGameObject.Action_Hurt;
        this.img_swordLight.visible = false;
        if (!this.skill_status) {
            this.armature.play(this.curState, 0);
            this.effectArmature.play(BaseGameObject.Action_Hurt, 1);
            this.effectArmature.visible = true;
            this.effectArmature.x = -15;
        }
        this.attr.hp -= value;
        if (this.attr.hp <= 0) {
            return;
        }
        SceneManager.battleScene.battleSceneCom.setHpProgress(this.attr.hp);
        this.setInvincible(true);
        this.gotoInvincible();
    }

    /**
     * 击杀增加的buff
     */
    public killBuff() {
        for (let i = 0; i < this.buff.length; i++) {
            //增加属性
            if (this.buff[i].buffData.id == 8) {
                this.buff[i].update(this);
            }
            //刺客
            else if (this.buff[i].buffData.id == 29) {
                this.buff[i].update(this);
            }
            //盛宴
            else if (this.buff[i].buffData.id == 36) {
                this.buff[i].update(this);
            }
            //探云手
            else if (this.buff[i].buffData.id == 37) {
                this.buff[i].update(this);
            }
            //风语者的祝福
            else if (this.buff[i].buffData.id == 40) {
                this.buff[i].update(this);
            }
        }
    }


    /**攻击 */
    public gotoAttack() {
        if (!this.isComplete) return;
        if (!this.canMove) return;
        if (this.curState != BaseGameObject.Action_Idle) return;
        // Common.log("进入攻击", this.curState, this.isComplete);
        this.isComplete = false;
        this.atk_timer.start();
        this.curState = "attack";
        // this.isAttack = true;
        this.setEnermy();
        let useSpeed = this.atk_speed * 0.1;
        this.sumDeltaX = 0;
        this.sumDeltaY = 0;
        this.originX = this.x;
        this.originY = this.y;
        /**攻击的弧度 */
        this.radian = MathUtils.getRadian2(this.originX, this.originY, this.endX, this.endY);
        let animation = this.getAttackPosition(this.radian);
        this.offsetIndex = animation["id"];

        //人物原来位置到剑端直线弧度
        let endX = this.endX + this.offset[this.offsetIndex][0];
        let endY = this.endY + this.offset[this.offsetIndex][1] + 33;
        if (this.reverse(this, this.radian)) {
            endX = this.endX - this.offset[this.offsetIndex][0];
        }
        this.atk_radian = MathUtils.getRadian2(this.originX, this.originY, endX, endY);
        let dis_atk:number = MathUtils.getDistance(this.originX, this.originY, this.endX, this.endY);
        if (dis_atk > this.atk_range) dis_atk = 200;
        else if (dis_atk <= 100) dis_atk = 100;
        this.img_swordLight.scaleX = dis_atk/280;
        //实际角度
        let trueAngle:number = Math.floor(MathUtils.getAngle(this.atk_radian));
        //剑尖角度
        let swordAngle:number = 45 * this.offsetIndex - 90;
        if (this.reverse(this, this.atk_radian)) {
            this.img_swordLight.scaleX = -dis_atk/280;
            trueAngle = Math.floor(-MathUtils.getAngle(this.atk_radian));
            swordAngle = 45 * this.offsetIndex + 90;
            if (trueAngle < 0) trueAngle += 360;
        }
        this.img_swordLight.rotation = swordAngle + ((trueAngle - swordAngle)/2.25);
        let dx = Math.cos(this.atk_radian) * dis_atk;
        let dy = Math.sin(this.atk_radian) * dis_atk;
        this.atk_rangeX = parseFloat(Math.abs(dx).toFixed(2));
        this.atk_rangeY = parseFloat(Math.abs(dy).toFixed(2));
        /**怪物的弧度 */
        this.centerX = Math.floor((2*this.originX + dx)/2);
        this.centerY = Math.floor((2*this.originY + dy)/2);

        let tempX = Math.cos(this.atk_radian) * useSpeed;
        let tempY = Math.sin(this.atk_radian) * useSpeed;
        this.deltaX = parseFloat(tempX.toFixed(2));
        this.deltaY = parseFloat(tempY.toFixed(2));
        this.img_swordLight.x = this.offset[this.offsetIndex][0];
        this.img_swordLight.y = this.offset[this.offsetIndex][1];
        this.armature.play(animation["posName"], 0);
    }

    /**
     * 技能
     */
    public gotoSkill() {
        if (!this.canMove) return;
        if (this.curState != BaseGameObject.Action_Idle) return;
        this.skillArmature.visible = true;
        this.curState = Hero.Action_Skill;
        this.skill_status = true;
        this.skill.start(Hero.Effect_Skill01, this);
        if (this.isPVP){
            SceneManager.pvpScene.onCDTime(this.skill.cd);
        }else{
            SceneManager.battleScene.battleSceneCom.onCDTime(this.skill.cd);
        }
    }

    /**
     * 进场
     */
    public gotoEnter() {
        this.curState = BaseGameObject.Action_Enter;
        this.armature.play(this.curState, 1);
    }

    /**
     * 帧事件处理函数
     */
    private armatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        switch (evt) {
            case "shake":
                ShakeTool.getInstance().shakeObj(SceneManager.curScene, 1, 5, 5);
                //增加动画完成函数
                this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
                this.skillArmature.addCompleteCallFunc(this.skillArmaturePlayEnd, this);
            break;
            case "idleEnd":
                this.armature.visible = false;
            break;
            case "disappear":
                this.visible = false;
            case "evtStart":
                this.skill.update(this);
            break;
            case "shildEnd":
                this.skillArmature.visible = false;
            break;
            default:
            break;
        }
    }

    /**
     * 特效动画播放完成函数
     */
    private effectArmaturePlayEnd():void {
        this.effectArmature.visible = false;
        if (!this.canMove) return;
        if (this.attr.hp <= 0) {
            this.removeComplete();
            if (modBuff.isRevival(this)) Common.log("复活");
            else SceneManager.battleScene.battleSceneCom.onFailPop();
        }else{
            this.gotoIdle();
        }
    }

    private armaturePlayEnd():void {
        switch (this.curState) {
            case Hero.Action_Skill:
                // this.curState = BaseGameObject.Action_Idle;
                this.skill.end();
            break;
            case BaseGameObject.Action_Enter:
                this.gotoInvincible();
                this.gotoIdle();
                this.setBuff();
                this.shadow.visible = true;
                this.canMove = true;
                if (this.isPVP) SceneManager.pvpScene.createCountDown();
                else SceneManager.battleScene.battleSceneCom.setShieldProgress(this._shieldCount);
                Common.log(JSON.stringify(this.attr));
            break;
        }
    }

    private skillArmaturePlayEnd():void {
        this.skill_status = false;
        this.skillArmature.visible = false;
        this.armature.visible = true;
        this.gotoIdle();
    }
    /**
     * 停止动画
     */
    public removeComplete():void {
        this.armature.removeCompleteCallFunc(this.armaturePlayEnd, this)
        this.effectArmature.removeCompleteCallFunc(this.effectArmaturePlayEnd, this);
    }

    /**
     * 隐藏bone
     */
    private hideBone(skeletonName:string, boneName:string):void {
        this.attack_effect = this.armature.getBone(skeletonName, boneName, this);
        this.attack_effect.visible = true;
    }

    /**
     * 创建剑光
     */
    private createSwordLight():void {
        this.img_swordLight = Utils.createBitmap("diaochan-pugong_png");
        this.img_swordLight.anchorOffsetX = this.img_swordLight.width;
        this.img_swordLight.anchorOffsetY = this.img_swordLight.height/2;
        this.img_swordLight.visible = false;
        this.addChild(this.img_swordLight);
    }
    /**是否正在运行跑步骨骼 */
    private isPlay:boolean;
    /**上次击杀 */
    private lastKill:number;
    // private isAttack:boolean;
    /**技能状态 0:没有释放 1:开始释放 */
    private skill_status:boolean;
    public  isPVP:boolean;
    /**攻击到的敌人 */
    private enermy:Array<any>;

    public name:string;
    public skillEffect:any;
    public skillEffectArmature:Array<DragonBonesArmatureContainer>;

    /*************英雄的动作***************/
    private static Action_Run01:string = "run01";
    private static Action_Run02:string = "run02";
    private static Action_Run03:string = "run03";
    private static Action_Skill:string = "skill";
    private static Effect_Skill01:string = "skill01";
    private static Effect_SKill02:string = "skill02";
    private static Effect_SKill03:string = "skill03";

    private atk_radian:number;

    /**护盾 */
    private _shieldCount:number;
    /**技能 */
    private skill:any;
    /**技能范围 */
    private skill_range:number;
    /************************************/

    private attack_effect:dragonBones.Bone;
    private img_swordLight:egret.Bitmap;
    /**剑光的偏移 */
    private offset:any[];
    private offsetIndex:number;
    /**是否攻击到敌人 */
    private isHit:boolean;
}