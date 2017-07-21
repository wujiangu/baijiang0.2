/**
 * 战争热诚
 * 普通攻击命中敌人的时候产生1层热诚效果，每层效果提升攻击力2%，持续时间3秒，可叠加
 */
class WarSincere extends BuffBase {
    public constructor() {
        super();
        this._extraValue = new Array();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "WarSincere";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration * 1000;
        this.buffData.frequency = this.getTalentValue();
        this._count = 0;
        this._extraValue = [];
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    /**结束 */
    public buffEnd() {
        Common.log(this._count);
    }

    /** */

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        if (this._count < this.buffData.frequency) {
            let atk:number = Math.floor(this.target.attr.atk * 0.02);
            this._extraValue.push(atk);
            this.target.attr.atk += atk;
            Common.log("WarSincere", this.target.attr.atk)
            egret.setTimeout(()=>{
                this._count -- ;
                this.target.attr.atk -= this._extraValue[0];
                this._extraValue.shift();
            }, this, this.buffData.duration);
            this._count ++ ;
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
    
    //已叠加的层数
    private _count:number;
    private _extraValue:Array<number>;
    private target:any;
}