/**
 * 斗气
 * 获得1个自身最大生命值10%的护盾，护盾打破后，需60秒时间进行恢复
 */
class FightAir extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "FightAir";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.cd = options.cd;
        this.buffData.id = 11;
    }

    /**开始 */
    public buffStart(target:any) {
        this.AddEffect(target);
        this._extraValue = Math.floor(this.target.originHP * 0.1);
        this.target.setShieldCount(this.target.getShieldCount()+this._extraValue);
    }

    /**结束 */
    public buffEnd() {
        Common.log("国术斗气开启");
        this.target.setShieldCount(this.target.getShieldCount()+this._extraValue);
        SceneManager.battleScene.battleSceneCom.setShieldProgress(this.target.getShieldCount());
        TimerManager.getInstance().remove(this.buffEnd, this);
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        if (target.getShieldCount() <= 0) {
            let duration = this.buffData.cd * 1000;
            TimerManager.getInstance().doTimer(duration, 0, this.buffEnd, this);
        }
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
    private _extraValue:number;
}