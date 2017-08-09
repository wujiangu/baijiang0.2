/**
 * 击杀敌人单位获得的buff
 * 
 */
class KillBuff extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "KillBuff";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;

        this._extraSpeed = 0;
        this._extraShield = 0;
        if (this.buffData.duration > 0) {
            let count = 50 * this.buffData.duration;
            if (!this._tempTimer){
                this._tempTimer = new egret.Timer(20, 1);
                this._tempTimer.addEventListener(egret.TimerEvent.TIMER, this._onUpdate, this);
                this._tempTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this._onComplete, this);
            }
            this._tempTimer.repeatCount = count;
            this._tempTimer.stop();
        }
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    /**结束 */
    public buffEnd() {
        
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
        if (this.buffData.id == 29) {
            let speed:number = this.target.getSpeed();
            this.target.setSpeed(speed - this._extraSpeed);
            this._extraSpeed = 0;
            Common.log("刺客buff结束--->", this.target.getSpeed());
        }
        else if (this.buffData.id == 40) {
            let shield:number = this.target.getShieldCount();
            this.target.setShieldCount(shield - this._extraShield);
            SceneManager.battleScene.battleSceneCom.setShieldProgress(this.target.getShieldCount());
            this._extraShield = 0;
        }
        this._tempTimer.reset();
    }

    /**
     * 护盾减少
     */
    public shieldBeAttack(value:number):void {
        if (this._extraShield >= value) {
            this._extraShield -= value;
        }else{
            this._extraShield = 0;
        }
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        let value = this.getTalentValue();
        switch (this.buffData.id) {
            //刺客
            case 29:
                this._isReset = true;
                if (this._extraSpeed == 0) {
                    this.AddEffect({x:0, y:-80, actions:"speedup"});
                    let speed:number = this.target.getSpeed();
                    this._extraSpeed = Math.floor(speed * (value/100));
                    this.target.setSpeed(speed + this._extraSpeed);
                    Common.log("刺客buff开启--->", this.target.getSpeed())
                }
                this._tempTimer.start();
            break;
            //盛宴
            case 36:
                if (this.target.attr.hp < this.target.originHP) {
                    let afterRecover:number = this.target.attr.hp + value;
                    let recover:number = value;
                    if (afterRecover > this.target.originHP) {
                        let overFlow:number = afterRecover - this.target.originHP;
                        recover = value - overFlow;
                    }
                    this.target.attr.hp += recover;
                    SceneManager.battleScene.battleSceneCom.setHpProgress(this.target.attr.hp);
                }
            break;
            //探云手
            case 37:
                modBattle.setExp(value);
            break;
            //风语者的祝福
            case 40:
                this._isReset = true;
                this.AddEffect({x:0, y:-40, actions:"hpShield_02"});
                let shield:number = this.target.getShieldCount();
                this.target.setShieldCount(shield - this._extraShield);
                Common.log("风语者的祝福开启--->", this.target.getShieldCount(), this._extraShield);
                this._extraShield = Math.floor(this.target.originHP * (value/100));
                this.target.setShieldCount(this.target.getShieldCount() + this._extraShield);
                
                SceneManager.battleScene.battleSceneCom.setShieldProgress(this.target.getShieldCount());
                this._tempTimer.start();
            break;
        }
    }

    /**增加特效 */
    public AddEffect(params:any) {
        this.ShowEffect();
        this.target.buffArmature.x = params.x;
        this.target.buffArmature.y = params.y;
        this.target.setBuffStatus(false);
        this.target.buffArmature.play(params.actions, 1);
    }

    /**显示特效 */
    public ShowEffect() {
        this.target.buffArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        this.target.buffArmature.visible = false;
    }
    /**回收buff */
    public recycleBuff() {
        super.recycleBuff();
        if (this.buffData.duration > 0) this._tempTimer.reset();
    }

    /**附加的移动速度值 */
    private _extraSpeed:number;
    /**原本的护盾值 */
    private _originShield:number;
    /**附加的护盾值 */
    private _extraShield:number;
    /**不叠加buff的刷新定时器 */
    private _tempTimer:egret.Timer;
    /**是否刷新 */
    private _isReset:boolean;
    private target:any;
}