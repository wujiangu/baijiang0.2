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
        this.createSpecialArmature();
    }

    /**
     * 创建特殊龙骨动画
     */
    private createSpecialArmature():void {
        this.specialArmature.register(DragonBonesFactory.getInstance().makeArmature("Elitemonster_skill", "Elitemonster_skill", 10), [
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
    }

    /**
     * 初始化龙骨动画
     */
    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
    }

    /**
     * 初始化数据
     */
    public init(data:Array<any>, isElite:boolean = false, isSummon:boolean = false) {
        super.init(data, isElite, isSummon);
        Common.log(JSON.stringify(data[1]))
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
        super.state_run(time);
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
    }

    /**受到攻击 */
    public gotoHurt(hurtValue:number = 1, isSkillHurt:boolean = false) {
        super.gotoHurt(hurtValue, isSkillHurt);
    }

    /**增加buff */
    public addBuff(buff:any, isBind:boolean = false) {
        super.addBuff(buff, isBind);
    }

    /**蓄力 */
    public gotoReady() {
        super.gotoReady();
    }

    /**死亡 */
    public gotoDead() {
        super.gotoDead();
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

    public specialArmatureFrame():void {

    }

    public specialArmaturePlayEnd():void {

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


    /*************************图片************************/
    private img_halo:egret.Bitmap;
}