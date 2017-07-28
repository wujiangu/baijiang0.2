/**
 * 猎人
 * 连击达到一定次后提升伤害50%。
 */
class Hunter extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Hunter";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        let value:number = this.getTalentValue();
        let hurtValue:number = this.target.getHurtValue();
        if (modBattle.getSumkill() > value) {
            hurtValue *= 1.5;
            this.target.setHurtValue(hurtValue);
        }
        // target.gotoHurt(hurtValue);
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
    
    private target:any;
}