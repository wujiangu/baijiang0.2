/**
 * 临时的护盾
 */
class TempShield extends BaseRandomBuff {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_hudun");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.createTextGroup("buff_fumiandi", "buff_004");
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit(options);
        this.iconName = "randomBuffIcon_json.buff_hudun";
        this.options = options;
        this.buffData.className = "TempShield";
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
        GameData.heros[0].buffIcon.texture = RES.getRes("randomBuffIcon1_json.sbuff_hudun");
        SceneManager.battleScene.effectLayer.addChild(this.icon);
        SceneManager.battleScene.battleSceneCom.addBuffIcon(this.textGroup, "randomBuffIcon_json.buff_hudun");
    }

    public addProperty():void {
        super.addProperty();
        
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