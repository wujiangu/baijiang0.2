/**
 * 飞燕
 * 普通攻击有10%概率对敌方单位造成2次伤害
 */
class Swallow extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Swallow";
        this.buffData.probability = 10;
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = 10;
    }

    /**开始 */
    public buffStart(target:any) {
        this.AddEffect(target);
    }

    /**结束 */
    public buffEnd() {

    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        Common.log("飞燕刺开启");
        let value:number = this.target.getHurtValue();
        this.target.setHurtValue(2*value);
        if (callBack) {
            callBack();
        }
    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
    }

    /**显示特效 */
    public ShowEffect() {
        this.target.skillArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        this.target.skillArmature.visible = false;
    }

    private target:any;
}