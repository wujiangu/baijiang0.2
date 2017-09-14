/**
 * 英雄
 */
class Hero extends Alliance {
    public constructor() {
        super();
    }

    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
        //增加动画帧执行函数
        this.armature.addFrameCallFunc(this.armatureFrame, this);

        //受伤动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("daoguang_effect", "daoguang_effect", 8), [
            BaseGameObject.Action_Hurt
        ]);

        /**从配置文件读取技能动画 */
        let heroConfig = modHero.getHeroConfig(name);
        let skillArmature = `${name}_skill`;
        this.skillArmature.register(DragonBonesFactory.getInstance().makeArmature(skillArmature, skillArmature, 10), [
            Hero.Effect_Skill01,
            Hero.Effect_SKill02,
            Hero.Effect_SKill03
        ]);
        this.skillArmature.addFrameCallFunc(this.armatureFrame, this);

        this.skill = ObjectPool.pop(heroConfig["skill"]);
        this.skill.init();
        this.effectArmature.scaleX = 1.5;
        this.effectArmature.scaleY = 1.5;
        this.skillArmature.scaleX = 1.5;
        this.skillArmature.scaleY = 1.5;
    }

    public init(data:Array<any>, isPVP:boolean=false) {
        super.init(data);
        let attr = modHero.addEquipAttr(data);      //test
        this.attr.initHeroAttr(data[1]);
        this.atk_timer.delay = this.attr.wsp * 1000;
        this.originHP = this.attr.hp;
        this._shieldCount = 0;
        this.isPVP = isPVP;
        this.skill_status = false;
        this.lastKill = 0;
        this.skill.skillData.skill_range = 150;
        this._isRevival = data[2];
        this.visible = false;
        egret.setTimeout(()=>{
            this.visible = true;
            this.gotoEnter();
        }, this, 500);
        if (data[2]) this.attr.hp = data[3];
        this.armature.addCompleteCallFunc(this.armaturePlayEnd, this);
        if (!isPVP){
            SceneManager.battleScene.showComboLayer();
            SceneManager.battleScene.battleSceneCom.setSumHp(this.originHP);
        }
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
            newBuff.buffInit(buffConfig);
            this.addBuff(newBuff);
        }
    }

    /**回收技能类 */
    public recycleSkill():void {
        this.img_swordLight.visible = false;
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
            this.addVictim(GameData.boss);
            this.addVictim(GameData.monsters);
            this.addVictim(GameData.chests);
        }else{
            this.addVictim(GameData.stakes);
        }
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
            // if (SceneManager.battleScene.guideStage == 1 && this.x > 810 && this.x < 830 && this.y > 330 && this.y < 350) {
            //     this.gotoIdle();
            //     this.canMove = false;
            //     SceneManager.battleScene.clearGuide(1);
            // }
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
            this.setInvincible(false);
            let count:number = 0;
            //怪物到中点的距离
            for (let i = 0; i < this.enermy.length; i++) {
                let radian = MathUtils.getRadian2(this.centerX, this.centerY, this.enermy[i].x, this.enermy[i].y);
                let dis = MathUtils.getDistance(this.centerX, this.centerY, this.enermy[i].x, this.enermy[i].y);
                let angle = Math.abs(this.atk_radian - radian);
                let dx = dis*Math.cos(angle);
                let dy = dis*Math.sin(angle);
                if ((Math.abs(dx) <= this.atk_range/2) && (Math.abs(dy) <= 40)) {
                    if (this.enermy[i].type == 0) {
                        //道具或宝箱
                        this.enermy[i].gotoHurt();
                    }
                    else if(this.enermy[i].type == 1 && this.enermy[i].attr.hp > 0) {
                        this.setHurtValue(this.attr.atk);
                        if (!this.isPVP && this.enermy[i]) {
                            let state = this.enermy[i].curState;
                            modBuff.isAttackBuff(this, this.enermy[i]);
                        }
                        if (this.isCrit()) this._hurtValue *= 1.5;
                        // if (!this.isPVP && SceneManager.battleScene.guideStage == 2) this._hurtValue = 100;
                        if (this.enermy[i] && this.enermy[i].gotoHurt) this.enermy[i].gotoHurt(this._hurtValue);
                        if (!this.isPVP && this.enermy[i]) {
                            let state = this.enermy[i].curState;
                            if (this.enermy[i].attr && this.enermy[i].attr.hp <= 0 && state != Enermy.Action_Dead) count ++;
                        }
                    }
                }
            }
            if (!this.isPVP && count > 0){
                if (count >= 2) {
                    SceneManager.battleScene.updateInstantKill(count);
                }
            }
            return;
        }
        super.state_attack(time);
    }

    /**
     * 走到指定的位置
     * 
     */
    public moveToTarget(gotoX:number, gotoY:number, func:Function = null):void {
        super.moveToTarget(gotoX, gotoY, func);
        this.img_swordLight.visible = false;
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
        this.img_swordLight.visible = false;
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
        super.gotoHurt();
        //护盾
        let shieldCount:number = this.overFlow(value);
        if (shieldCount == 0) return;
        else value = shieldCount;
        //免疫伤害
        if (!this.skill_status && modBuff.isImmuneBuff(this)) return;
        if (this.curState == BaseGameObject.Action_Hurt || this.curState == "attack") return;
        SceneManager.battleScene.bloodTween();
        let index:number = modBuff.hurtChange(this);
        value *= (1+index*0.5);
        modBuff.reflection(this);
        // Common.log("受到伤害------>", value, index);
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
        this.img_swordLight.visible = false;
        if (!this.isComplete) return;
        if (!this.canMove) return;
        if (this.curState != BaseGameObject.Action_Idle) return;
        this.setEnermy();
        super.gotoAttack();
    }

    /**
     * 技能
     */
    public gotoSkill() {
        this.img_swordLight.visible = false;
        // if (!this.isPVP && SceneManager.battleScene.guideStage == 3) this.canMove = true;
        if (!this.canMove) return;
        if (this.curState != BaseGameObject.Action_Idle) return;
        this.skillArmature.visible = true;
        this.curState = Hero.Action_Skill;
        this.skill_status = true;
        this.skill.start(Hero.Effect_Skill01, this);
        if (this.isPVP){
            SceneManager.pvpScene.onCDTime(this.skill.cd);
        }else{
            modBuff.isInstanteKill(this);
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

    /**死亡处理 */
    public deadHandler():void {
        this.removeComplete();
        if (modBuff.isRevival(this)) Common.log("复活");
        else SceneManager.battleScene.battleSceneCom.onFailPop(false);
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
                this.buffArmature.addCompleteCallFunc(this.buffArmaturePlayEnd, this);
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
    public effectArmaturePlayEnd():void {
        super.effectArmaturePlayEnd();
        this.effectArmature.visible = false;
        if (!this.canMove) return;
        if (this.attr.hp <= 0) {
            this.deadHandler();
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
                else {
                    SceneManager.battleScene.battleSceneCom.setShieldProgress(this._shieldCount);
                    if (SceneManager.battleScene.guideStage == 2 && !this._isRevival) {
                        SceneManager.battleScene.createGuide();
                        modBattle.stop();
                        // this.isComplete = false;
                    }
                }
            break;
        }
    }

    private skillArmaturePlayEnd():void {
        if (this.name != "zhaoyun") this.setInvincible(false);
        this.skill_status = false;
        this.skillArmature.visible = false;
        this.armature.visible = true;
        this.gotoIdle();
    }

    private buffArmaturePlayEnd():void {
        if (!this.isBuffLoop) this.buffArmature.visible = false;
    }

    /**
     * 停止动画
     */
    public removeComplete():void {
        this.armature.removeCompleteCallFunc(this.armaturePlayEnd, this)
        this.effectArmature.removeCompleteCallFunc(this.effectArmaturePlayEnd, this);
    }

    /**是否复活 */
    private _isRevival:boolean;
    /**上次击杀 */
    private lastKill:number;
    /**技能状态 0:没有释放 1:开始释放 */
    private skill_status:boolean;

    public skillEffect:any;
    public skillEffectArmature:Array<DragonBonesArmatureContainer>;

    /*************英雄的动作***************/
    private static Action_Skill:string = "skill";
    private static Effect_Skill01:string = "skill01";
    private static Effect_SKill02:string = "skill02";
    private static Effect_SKill03:string = "skill03";

    /**护盾 */
    private _shieldCount:number;
    /**技能 */
    private skill:any;
    /**技能范围 */
    private skill_range:number;
}