/**
 * 常山赵子龙
 * 普通攻击有10%的概率击晕敌人1.5s
 */
class Stunned extends BuffBase {
    public constructor() {
        super();
        // this.buffInit();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Stunned";
        this.buffData.probability = 10;
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = 7;
    }

    /**开始 */
    public buffStart(target:any) {
        this.AddEffect(target);
    }

    /**结束 */
    public buffEnd() {

    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        let buffConfig = modBuff.getBuff(2);

        this._extraBuff = ObjectPool.pop(buffConfig.className);
        this._extraBuff.buffInit(buffConfig);
        //特效名字
        this._extraBuff.effectName = "xuanyun";
        //id
        this._extraBuff.buffData.id = buffConfig.id;
        //持续时间
        this._extraBuff.buffData.duration = buffConfig.duration;
        //作用点
        this._extraBuff.buffData.postionType = PostionType.PostionType_Head;
        let value:number = this.target.getHurtValue();
        if (target.attr.hp > value){
            target.addBuff(this._extraBuff);
            // let value:number = this.target.getHurtValue();
            // target.gotoHurt(value);
        }
        if (callBack) {
            callBack();
        }
    }

    /**作用点 */
    private position(target:any):void {
        switch (this.buffData.postionType) {
            case PostionType.PostionType_Foot:
                target.x = 0;
                target.y = 0;
            break;
            case PostionType.PostionType_Head:
                target.x = 0;
                target.y = -90;
            break;
            case PostionType.PostionType_Body:
                target.x = 0;
                target.y = 0;
            break;
        }
    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
    }

    /**显示特效 */
    public ShowEffect() {
        this.target.skillArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        this.target.skillArmature.visible = false;
    }

    private target:any;
    private _extraBuff:UnableMove;
}