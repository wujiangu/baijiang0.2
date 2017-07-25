/**
 * 增加人物的基础属性
 * 
 */
class AddProperty extends BuffBase {
    public constructor() {
        super();
        // this.buffInit();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "AddProperty";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_Overlay;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.duration = options.duration;
        this.buffData.id = options.id;
        this._extraValue = 0;
        this._extraSpeed = 0;

        if (this.buffData.duration > 0) {
            let count = 50 * this.buffData.duration;
            if (!this._tempTimer) this._tempTimer = new egret.Timer(20, count);
            this._tempTimer.stop();
            this._tempTimer.addEventListener(egret.TimerEvent.TIMER, this._onUpdate, this);
            this._tempTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this._onComplete, this);
        }
    }

    /**开始 */
    public buffStart(target:any) {
        this.AddEffect(target);
        let value:number;
        if (this.buffData.id >= 20) value = this.getTalentValue();
        switch (this.buffData.id) {
            //梨花落雨
            case 9:
                this.target.attr.crt += 20;
            break;
            //狂怒
            case 20:
                this.target.attr.wsp *= (1 - value/100);
                this.target.setWSPDelay();
            break;
            //巫术
            case 21:
                this.target.attr.skd = Math.floor(this.target.attr.skd*(1+value/100))
            break;
            //先天资质
            case 23:
                let level:number = HeroData.getHeroData(GameData.curHero).lv;
                this.target.attr.atk += (value * (level - 1));
            break;
            //智谋
            case 32:
                let cd:number = this.target.getSkillCd();
                this.target.setSkillCd(Math.floor(cd*(1-value/100)));
            break;
            //漫游者
            case 38:
                let speed:number = this.target.getSpeed() * (1 + value/100);
                this.target.setSpeed(Math.floor(speed));
            break;
            //快速(精英怪专属buff)
            case 55:
                let movSpeed:number = this.target.getSpeed() * 2;
                this.target.setSpeed(Math.floor(movSpeed));
            break;
        }
    }

    /**结束 */
    public buffEnd() {

    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        this._isReset = true;
        if (this._extraValue == 0 && this._extraSpeed == 0){
            let speed:number = this.target.getSpeed();
            Common.log("增加属性buff")
            //增加的属性(后续扩展可以增加任何属性)
            this._extraSpeed = speed * 0.5;
            this.target.setSpeed(speed + this._extraSpeed);
            this._extraValue = Math.floor(this.target.attr.atk * 0.15);
            this.target.attr.atk += this._extraValue;
        }
        if (this.buffData.duration > 0) this._tempTimer.start();
    }

    /**
     * 定时过程刷新数据
     */
    private _onUpdate(event:egret.TimerEvent) {
        if (this._isReset) {
            this._tempTimer.reset();
            this._tempTimer.start();
            this._isReset = false;
        }
    }

    /**
     * 定时完成
     */
    private _onComplete(event:egret.TimerEvent) {
        this._isReset = false;
        Common.log("buff 结束");
        //恢复原来数值(后续扩展)
        let speed:number = this.target.getSpeed();
        this.target.setSpeed(speed - this._extraSpeed);
        this.target.attr.atk -= this._extraValue;
        this._extraSpeed = 0;
        this._extraValue = 0;
        this._tempTimer.reset();
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

    /**回收buff */
    public recycleBuff() {
        super.recycleBuff();
        if (this.buffData.duration > 0) this._tempTimer.reset();
    }

    private target:any;
    /**附加的攻击值 */
    private _extraValue:number;
    /**附加的移动速度值 */
    private _extraSpeed:number;
    private _extraBuff:UnableMove;
    private _tempTimer:egret.Timer;
    private _isReset:boolean;
}