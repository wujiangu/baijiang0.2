/**
 * 雷霆领主的法令
 * 对相同的敌人进行第三次攻击时候会召唤一次闪电打击，造成自身攻击力范围伤害，冷却时间90秒。
 */
class Thunderbolt extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Thunderbolt";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this._isTrigger = false;
    }

    /**触发 */
    private onTrigger():void {
        Common.log("可以触发雷霆");
        TimerManager.getInstance().remove(this.onTrigger, this);
        this._isTrigger = false;
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(enermy:any, callBack:Function = null) {
        // if (!this._isTrigger) {
        //     this._isTrigger = true;
        //     enermy.onAttackCount();
        //     TimerManager.getInstance().doTimer(this.buffData.cd * 1000, 1, this.onTrigger, this);
        // }
        let count = enermy.getBeAttackCount();
        if (count >= 2 && !this._isTrigger) {
            enermy.onAttackCount();
            this._isTrigger = true;
            TimerManager.getInstance().doTimer(this.buffData.cd * 1000, 1, this.onTrigger, this);
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
        TimerManager.getInstance().remove(this.onTrigger, this);
    }

    /**是否触发 */
    private _isTrigger:boolean;
    private target:any;
}