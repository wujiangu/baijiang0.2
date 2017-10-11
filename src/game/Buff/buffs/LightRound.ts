/**
 * 灵光绕射
 * 每20秒产生灵光自动攻击身边的敌人
 */
class LightRound extends BuffBase {
    public constructor() {
        super();
        // this.buffInit();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "LightRound";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.cd = options.cd;
        this.buffData.id = options.id;
        this.effectName = "skill02";
    }

    /**开始 */
    public buffStart(target:any) {
        this.AddEffect(target);
        let duration = this.buffData.cd * 1000;
        TimerManager.getInstance().doTimer(duration, 0, this.update, this);
    }

    /**
     * 被动技能的特效
     */
    private setPassiveEffect():void {
        
    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update() {
        this.ShowEffect();
        this.target.skillArmature.play(this.effectName, 1, 1, 0, 5);
        
    }

    /**动画播放完成监听 */
    private armaturePlayEnd():void {
    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
    }

    /**作用点 */
    private position(target:any):void {
        switch (this.buffData.postionType) {
            case PostionType.PostionType_Foot:
                target.x = 0;
                target.y = 0;
            break;
            case PostionType.PostionType_Head:
                target.x = 0;
                target.y = -90;
            break;
            case PostionType.PostionType_Body:
                target.x = 0;
                target.y = 0;
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