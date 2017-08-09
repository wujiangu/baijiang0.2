/**
 * 必杀
 */
class InstanteKill extends BaseRandomBuff {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_bisha");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit(options);
        this.iconName = "randomBuffIcon_json.buff_bisha";
        this.options = options;
        this.buffData.className = "InstanteKill";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_Overlay;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
    }

    /**开始 */
    public buffStart(target:any) {
        super.buffStart(target);
    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        this.removeBuff();
    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target);
        SceneManager.battleScene.effectLayer.addChild(this.icon);
        SceneManager.battleScene.battleSceneCom.addBuffIcon("randomBuffIcon_json.buff_bisha");
    }

    public addProperty():void {
        super.addProperty();
        let time:number = SceneManager.battleScene.battleSceneCom.getCDtime();
        if (time > 0) SceneManager.battleScene.battleSceneCom.cdTimeClear();
    }

    /**
     * 定时完成
     */
    public _onComplete(event:egret.TimerEvent) {
        super._onComplete(event);
        
    }

    /**显示特效 */
    public ShowEffect() {
        
    }

    /**隐藏特效 */
    public HideEffect() {
        
    }
}