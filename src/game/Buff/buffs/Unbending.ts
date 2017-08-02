/**
 * 不屈
 * 开始时获得护盾。
 */
class Unbending extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.effectName = "hpShield_01";
        this.buffData.className = "Unbending";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
        let value:number = this.getTalentValue();
        let shieldCount:number = Math.floor(this.target.originHP * (value/100));
        this.target.setShieldCount(shieldCount);
        this.AddEffect(target);
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
    
    private target:any;
}