/**
 * 加速
 * 攻速/移速翻倍
 */
class SpeedUp extends BaseRandomBuff {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_jiasu");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.createTextGroup("buff_fumiandi", "buff_003");
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit(options);
        this.iconName = "randomBuffIcon_json.buff_jiasu";
        this.options = options;
        this.buffData.className = "SpeedUp";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_Overlay;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this._extraWSP = 0;
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

    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target);
        GameData.heros[0].buffIcon.texture = RES.getRes("randomBuffIcon1_json.sbuff_jiasu");
        SceneManager.battleScene.effectLayer.addChild(this.icon);
        SceneManager.battleScene.battleSceneCom.addBuffIcon(this.textGroup, "randomBuffIcon_json.buff_jiasu");
    }

    public addProperty():void {
        super.addProperty();
        if (this._extraValue == 0){
            let speed:number = this.target.getSpeed();
            this._extraValue = Math.floor(speed * 0.5);
            this.target.setSpeed(speed + this._extraValue);
            this._extraWSP = this.target.attr.wsp * 0.5;
            this.target.attr.wsp -= this._extraWSP;
            this.target.setWSPDelay();
        }
    }

    /**
     * 定时完成
     */
    public _onComplete(event:egret.TimerEvent) {
        super._onComplete(event);
        let speed:number = this.target.getSpeed();
        this.target.setSpeed(speed - this._extraValue);
        this.target.attr.wsp += this._extraWSP;
        this.target.setWSPDelay();
        this._extraValue = 0;
        this._extraWSP = 0;
    }

    /**显示特效 */
    public ShowEffect() {
        
    }

    /**隐藏特效 */
    public HideEffect() {
        
    }

    /**额外攻击速度 */
    private _extraWSP:number;
}