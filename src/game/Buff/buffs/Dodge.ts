/**
 * 闪避攻击
 */
class Dodge extends BuffBase {
    public constructor() {
        super();
        // this.buffInit();
    }

    /**初始化 */
    public buffInit() {
        super.buffInit();
        this.buffData.className = "Dodge";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = 5;
        this.effectName = "skill02";
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    /**结束 */
    public buffEnd() {
        this.HideEffect();
        // this.target.effectArmature.removeCompleteCallFunc(this.buffEnd, this);
    }

    /**刷新数据 */
    public update() {
        this.AddEffect(this.target);
    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.ShowEffect();
        target.skillArmature.play(this.effectName, 1);
        // target.skillArmature.addCompleteCallFunc(this.buffEnd, this);
        switch (this.buffData.postionType) {
            case PostionType.PostionType_Foot:
                target.skillArmature.x = 0;
                target.skillArmature.y = 0;
            break;
            case PostionType.PostionType_Head:
                target.skillArmature.x = 0;
                target.skillArmature.y = -90;
            break;
            case PostionType.PostionType_Body:
                target.skillArmature.x = 3;
                target.skillArmature.y = 0;
            break;
        }
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