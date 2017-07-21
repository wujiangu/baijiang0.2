/**
 * 无法行动的buff(包括禁锢、眩晕、冰冻等)
 */
class UnableMove extends BuffBase {
    public constructor() {
        super();
        // this.buffInit();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "UnableMove";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.YES;
        this.buffData.id = options.id;
        this.buffData.duration = options.duration;
    }

    /**开始 */
    public buffStart(target:any) {
        this.AddEffect(target);
        target.setCanMove(false);
        let duration = this.buffData.duration * 1000;
        TimerManager.getInstance().doTimer(duration, 0, this.buffEnd, this);
    }

    /**结束 */
    public buffEnd() {
        this.target.setCanMove(true);
        this.target.isSkillHurt = false;
        this.HideEffect();
        let index = this.target.buff.indexOf(this.buffData.id);
        this.target.buff.splice(index, 1);
        if (this.target.attr.hp > 0) {
            this.target.gotoRun();
        }
        // this.target.removeEffectComplete();
        // this.target.addEffectComplete();
        ObjectPool.push(this);
        TimerManager.getInstance().remove(this.buffEnd, this);
    }

    /**刷新数据 */
    public update() {

    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
        this.ShowEffect();
        if (this.buffData.id != 1) target.buffArmature.play(this.effectName, 0);
        switch (this.buffData.postionType) {
            case PostionType.PostionType_Foot:
                // target.buffArmature.x = 0;
                // target.buffArmature.y = 0;
            break;
            case PostionType.PostionType_Head:
                target.buffArmature.x = -10;
                target.buffArmature.y = -90;
            break
        }
    }

    /**显示特效 */
    public ShowEffect() {
        switch(this.buffData.id) {
            case 1:
                //禁锢
                this.target.armature.filters = [this.target.colorFlilter];
            break;
            case 2:
                this.target.buffArmature.visible = true;
            break;
        }
    }

    /**隐藏特效 */
    public HideEffect() {
        switch(this.buffData.id) {
            case 1:
                //禁锢
                this.target.armature.filters = [this.target.defaultFlilter];
            break;
            case 2:
                this.target.buffArmature.visible = false;
            break;
        }
    }

    private target:any;
}