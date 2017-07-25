/**
 * 精英怪
 */
class EliteMonster extends Monster {
    public constructor() {
        super();
        this.img_halo = Utils.createBitmap("Elitemonster000_png");
        this.img_halo.scaleX = 1.5;
        this.img_halo.scaleY = 1.5;
        this.img_halo.x = -30;
        this.img_halo.y = -96;
        this.addChild(this.img_halo);
        this.arrayBuffs = new Array();
        this.createSpecialArmature();
    }

    /**
     * 创建特殊龙骨动画
     */
    private createSpecialArmature():void {
        this.specialArmature.register(DragonBonesFactory.getInstance().makeArmature("Elitemonster_skill", "Elitemonster_skill", 5), [
            "skill01_01",
            "skill01_02",
            "skill02",
            "skill03",
            "skill04",
            "skill05_01",
            "skill05_02",
            "skill05_03",
            "skill06"
        ]);
        this.specialArmature.addFrameCallFunc(this.specialArmatureFrame, this);
        //增加动画完成函数
        this.specialArmature.addCompleteCallFunc(this.specialArmaturePlayEnd, this);

        this.specialArmature.scaleX = 1.5;
        this.specialArmature.scaleY = 1.5;
    }

    /**
     * 初始化龙骨动画
     */
    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
        this.img_halo.visible = true;
        this.armature.visible = true;
        this.specialArmature.visible = false;
    }

    /**
     * 初始化数据
     */
    public init(data:Array<any>, isElite:boolean = false, isSummon:boolean = false) {
        super.init(data, isElite, isSummon);
        this.arrayBuffs = data[1].arrayBuff;
        Common.log(JSON.stringify(data[1]));
    }

    public update(time:number):void {
        super.update(time);
    }

    /**
     * 待机状态
     */
    public state_idle(time:number):void {
        super.state_idle(time);
    }

    /**死亡状态 */
    public state_dead(time:number):void {
        super.state_dead(time);
    }

    /**
     * 走路巡逻状态
     */
    public state_run(time:number):void {
        super.state_run(time, this.setFasterEffect);
    }

    /**
     * 蓄力状态
     */
    public state_xuli01(time:number):void {
        super.state_xuli01(time);
    }

    /**
     * 收到攻击状态
     */
    public state_hurt(time:number):void {
        super.state_hurt(time);
    }

    /**攻击状态 */
    public state_attack(time:number):void {
        super.state_attack(time);
    }

    /**
     * 进场
     */
    public gotoEnter() {
        super.gotoEnter();
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
    }

    /**攻击 */
    public gotoAttack() {
        super.gotoAttack();
        // if (this.isFaster) this.setFasterEffect(this.radian);
    }

    /**受到攻击 */
    public gotoHurt(hurtValue:number = 1, isSkillHurt:boolean = false) {
        super.gotoHurt(hurtValue, isSkillHurt);
        if (this.isFaster) this.specialArmature.visible = false;
    }

    /**增加buff */
    public addBuff(buff:any, isBind:boolean = false) {
        super.addBuff(buff, isBind);
    }

    /**蓄力 */
    public gotoReady() {
        super.gotoReady();
        if (this.isFaster) this.specialArmature.visible = false;
    }

    /**死亡 */
    public gotoDead() {
        super.gotoDead();
        this.img_halo.visible = false;
        if (this.isFaster) this.specialArmature.visible = false;
        for (let i = 0; i < this.buff.length; i++) {
            if (this.buff[i].buffData.id == 56) {
                this.armature.visible = false;
                this.buff[i].update();
                break;
            }
        }
    }

    /**消失 */
    public disappear():void {
        super.disappear();
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
        super.effectArmaturePlayEnd();
    }

    public skillArmatureFrame(event:dragonBones.FrameEvent):void {
        super.skillArmatureFrame(event);
    }

    /**
     * 动画播放完成函数
     */
    public armaturePlayEnd():void {
        super.armaturePlayEnd();
    }

    public specialArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        switch (evt) {
            case "buildEnd1":
                this.specialArmature.pause("skill01_01");
            break;
            case "buildEnd2":
                this.specialArmature.pause("skill01_02");
            break
        }
        
    }

    public specialArmaturePlayEnd():void {
        this.specialArmature.visible = false;
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
        super.removeActComplete();
    }

    public addEffectComplete() {
        super.addEffectComplete();
    }

    /**停止特效动画 */
    public removeEffectComplete():void {
        super.removeEffectComplete();
    }
    /**快速移动的特效 */
    private setFasterEffect = function(radian:number):void {
        this.specialArmature.visible = true;
        let specialAnimate = this.getWalkPosition("skill05_", radian);
        let num:number = parseInt(specialAnimate.charAt(9));
        this.setChildIndex(this.specialArmature, 0);
        switch (num) {
            case 1:
                this.setChildIndex(this.specialArmature, this.numChildren+1);
                this.specialArmature.x = 5;
                this.specialArmature.y = 0;
            break;
            case 2:
                this.specialArmature.x = -13;
                this.specialArmature.y = 0;
            break;
            case 3:
                this.specialArmature.x = 5;
                this.specialArmature.y = 0;
            break;
        }
        this.specialArmature.play(specialAnimate, 0);
    }.bind(this);

    /*************************图片************************/
    private img_halo:egret.Bitmap;
}