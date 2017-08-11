/**
 * 流血
 */
class Blooding extends BaseRandomBuff {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_liuxue");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.createTextGroup("buff_youyidi", "buff_011");
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit(options);
        this.iconName = "randomBuffIcon_json.buff_liuxue";
        this.options = options;
        this.buffData.className = "Blooding";
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
        
    }
    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target);
        SceneManager.battleScene.effectLayer.addChild(this.icon);
        SceneManager.battleScene.battleSceneCom.addBuffIcon(this.textGroup, "randomBuffIcon_json.buff_liuxue");
    }

    public addProperty():void {
        super.addProperty();
    }

    /**
     * 定时过程刷新数据
     */
    public _onUpdate(event:egret.TimerEvent) {
        super._onUpdate(event);
        let count:number = (<egret.Timer>event.target).currentCount;
        if (count%25 == 0 && count > 0) {
            this.target.attr.hp -= Math.floor(this.target.originHP * 0.01);
            if (this.target.attr.hp <= 0) {
                this.target.deadHandler();
                this.afterRemoveBuff();
            }else{
                SceneManager.battleScene.battleSceneCom.setHpProgress(this.target.attr.hp);
            }
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