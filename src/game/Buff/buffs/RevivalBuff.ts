/**
 * 秘密储备
 * 死亡时复活并恢复生命值，每次战斗只触发1次。
 */
class RevivalBuff extends BuffBase {
    public constructor() {
        super();
        this._count = 0;
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "RevivalBuff";
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


    /**重置复活次数 */
    public reset():void {
        this._count = 0;
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        let isRevival:boolean = false;
        if (this._count < 1) {
            this._count ++ ;
            let talentValue:number = this.getTalentValue();
            modBattle.recycleHero();
            SceneManager.battleScene.battleSceneCom.clearBuffIcon();
            SceneManager.battleScene.effectLayer.removeChildren();
            let value:number = Math.floor(this.target.originHP * talentValue/100);
            SceneManager.battleScene.createHero(true, value);
            SceneManager.battleScene.battleSceneCom.onRevive(true, value);
            isRevival = true;
        }
        if (callBack) {
            callBack(isRevival);
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
    
    //复活的次数
    private _count:number;
    private target:any;
}