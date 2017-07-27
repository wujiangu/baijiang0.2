/**
 * 冰霜
 * 发出蓝色的冲击波，击中眩晕1s
 */
class Frost extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Frost";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;
        this._isFinish = true;
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    public begin():void {
        if (this._isFinish) {
            this._isFinish = false;
            this.releaseBegin();
            TimerManager.getInstance().doTimer(this.buffData.cd*1000, 0, this.release, this);
        }
    }

    /**
     * 开始释放
     */
    private releaseBegin():void {
        this.target.specialArmature.visible = true;
        this.target.setChildIndex(this.target.specialArmature, 0);
        this.target.specialArmature.play("skill03", 1, 1, 0, 0.6);
    }

    /**
     * 释放buff
     */
    private release():void {
        let random:number = MathUtils.getRandom(1, 100);
        if (random >= 0) {
            this.releaseBegin();
            this._isFinish = true;
        }
    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        
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
        TimerManager.getInstance().remove(this.release, this);
    }
    private target:any;

    /**cd是否结束 */
    private _isFinish:boolean;
}