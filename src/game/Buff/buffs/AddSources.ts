/**
 * 增加资源buff
 * 包括经验、天赋能量点
 */
class AddSources extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "AddSources";
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
    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        this.AddEffect(target);
        let value:number;
        if (this.buffData.id >= 20) value = this.getTalentValue();
        switch (this.buffData.id) {
            //灵羽探云手
            case 14:
                if (!this.target.isPVP) {
                    modBattle.setSoul(1);
                    SceneManager.battleScene.battleSceneCom.setExpAndSoul(modBattle.getExp(), modBattle.getSoul());
                }
            break;
            //符能亲和
            case 27:
                
            break;
            default:
            break;
        }
    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
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