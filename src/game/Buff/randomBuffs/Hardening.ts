/**
 * 硬化
 */
class Hardening extends BaseRandomBuff {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_yinghua");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.createTextGroup("buff_fumiandi", "buff_002");
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit(options);
        this.iconName = "randomBuffIcon_json.buff_yinghua";
        this.options = options;
        this.buffData.className = "Hardening";
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
        if (callBack) {
            callBack(this._extraValue);
        }
    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target);
        GameData.heros[0].buffIcon.texture = RES.getRes("randomBuffIcon1_json.sbuff_yinghua");
        SceneManager.battleScene.effectLayer.addChild(this.icon);
        SceneManager.battleScene.battleSceneCom.addBuffIcon(this.textGroup, "randomBuffIcon_json.buff_yinghua");
    }

    public addProperty():void {
        super.addProperty();
        if (this._extraValue == 0){
            this._extraValue = -1;
        }
    }

    /**
     * 定时完成
     */
    public _onComplete(event:egret.TimerEvent) {
        super._onComplete(event);
        this._extraValue = 0;
    }

    /**显示特效 */
    public ShowEffect() {
        
    }

    /**隐藏特效 */
    public HideEffect() {
        
    }
}