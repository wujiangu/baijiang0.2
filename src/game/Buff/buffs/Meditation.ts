/**
 * 冥想
 * 每n秒回复1%已损失的生命值。
 */
class Meditation extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.effectName = "xue";
        this.buffData.className = "Meditation";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;
        let value:number = this.getTalentValue();
        TimerManager.getInstance().doTimer(value * 1000, 0, this.onHeal, this);
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
        
    }
    /**愈合 */
    private onHeal():void {
        if (this.target.attr.hp < this.target.originHP) {
            this.AddEffect(this.target);
            let hurtValue:number = this.target.originHP - this.target.attr.hp;
            this._recoverCount = Math.floor(hurtValue * 0.01);
            this.target.attr.hp += this._recoverCount;
            Common.log("冥想---->", this._recoverCount);
            SceneManager.battleScene.battleSceneCom.setHpProgress(this.target.attr.hp);
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
        this.ShowEffect();
        target.buffArmature.x = 0;
        target.buffArmature.y = -40;
        target.setBuffStatus(false);
        target.buffArmature.play(this.effectName, 1);
    }

    /**显示特效 */
    public ShowEffect() {
        this.target.buffArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        this.target.buffArmature.visible = false;
    }
    /**回收buff类 */
    public recycleBuff() {
        super.recycleBuff();
        TimerManager.getInstance().remove(this.onHeal, this);
    }

    /**回复量 */
    private _recoverCount:number;
    private target:any;
}