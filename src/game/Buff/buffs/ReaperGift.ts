/**
 * 死神的赠礼
 * 每60秒攻击对首个目标造成敌方最大n%生命值的伤害，对BOSS无效。
 */
class ReaperGift extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "ReaperGift";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;
        this.isFirst = false;
        this._value = this.getTalentValue();
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    /**结束 */
    public buffEnd() {
        let newBuff = ObjectPool.pop(this.buffData.className);
        newBuff.buffInit(this.options);
        this.target.addBuff(newBuff);
        this.isFirst = false;
        TimerManager.getInstance().remove(this.buffEnd, this);
    }


    /**重置复活次数 */
    public reset():void {

    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        let value:number = this.getTalentValue();
        Common.log("死神的赠礼开启");
        if (!this.isFirst) {
            this.isFirst = true;
            let extraHurt:number = target.originHP * (value/100);
            let hurtValue:number = this.target.getHurtValue() + extraHurt;
            this.target.setHurtValue(hurtValue);
            // Common.log("死神的赠礼开启", hurtValue, this.target.getHurtValue());
            let index = this.target.buff.indexOf(this);
            this.target.buff.splice(index, 1);
            ObjectPool.push(this);
            let duration = this.buffData.cd * 1000;
            TimerManager.getInstance().doTimer(duration, 0, this.buffEnd, this);
        }
    }

    /**增加特效 */
    public AddEffect(target:any) {
        // this.ShowEffect();
    }

    /**显示特效 */
    public ShowEffect() {
        // this.target.skillArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        // this.target.skillArmature.visible = false;
    }
    /**回收buff类 */
    public recycleBuff() {
        super.recycleBuff();
        TimerManager.getInstance().remove(this.buffEnd, this);
    }
    private isFirst:boolean;
    private _value:number;
    private target:any;
}