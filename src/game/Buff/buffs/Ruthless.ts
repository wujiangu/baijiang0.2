/**
 * 无情
 * 对生命值低于40%的敌人造成额外伤害。
 */
class Ruthless extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Ruthless";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;
        this._value = this.getTalentValue();
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    /**结束 */
    public buffEnd() {

    }


    /**重置复活次数 */
    public reset():void {
        
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        if (target.attr.hp <= target.originHP * 0.4) {
            let hurtValue:number = this.target.getHurtValue() * (this._value/100+1);
            this.target.setHurtValue(hurtValue);
            Common.log("无情开启", hurtValue, this.target.getHurtValue());
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
    
    private _value:number;
    private target:any;
}