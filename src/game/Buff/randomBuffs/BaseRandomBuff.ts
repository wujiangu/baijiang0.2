/**
 * 随机效果基类
 */
class BaseRandomBuff extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.buffData.duration = options.duration;
        this._extraValue = 0;
        if (this.buffData.duration > 0) {
            let count = 25 * this.buffData.duration;
            if (!this._tempTimer){
                this._tempTimer = new egret.Timer(40, 1);
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

    /**获取额外值 */
    public getExtraValue():number {
        return this._extraValue;
    }

    /**
     * 定时过程刷新数据
     */
    public _onUpdate(event:egret.TimerEvent) {
        if (this._isReset) {
            this._tempTimer.reset();
            this._tempTimer.start();
            this._isReset = false;
        }
    }

    /**
     * 定时完成
     */
    public _onComplete(event:egret.TimerEvent) {
        this.removeBuff();
        Common.log("buff时间到");
        this._isReset = false;
        this._tempTimer.reset();
    }

    /**
     * 移除buff
     */
    public removeBuff():void {
        SceneManager.battleScene.battleSceneCom.removeBuffIcon(this.iconName);
        let index = GameData.heros[0].buff.indexOf(this);
        GameData.heros[0].buff.splice(index, 1);
        ObjectPool.push(this);
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        
    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target);
        this.icon.x = target.x - 5;
        this.icon.y = target.y - 20;
        this.icon.scaleX = 1.5;
        this.icon.scaleY = 1.5;
        this.icon.visible = true;
        this.icon.alpha = 1.0;
        egret.Tween.get(this.icon).to({scaleX:1.0, scaleY:1.0}, 200).call(()=>{
            egret.Tween.get(this.icon).to({y:this.icon.y - 20, alpha:0}, 500).call(()=>{
                this.icon.visible = false;
                egret.Tween.removeTweens(this.icon);
            });
        });
    }

    public addProperty():void {
        this._isReset = true;
        if (this.buffData.duration > 0) this._tempTimer.start();
    }

    /**显示特效 */
    public ShowEffect() {
        
    }

    /**隐藏特效 */
    public HideEffect() {
        
    }

    /**回收buff */
    public recycleBuff() {
        super.recycleBuff();
        if (this.buffData.duration > 0) this._tempTimer.reset();
    }

    public target:any;
    /**图标的名字 */
    public iconName:string;
    /**buff图标 */
    public icon:egret.Bitmap;
    /**附加的值 */
    public _extraValue:number;
    /**不叠加buff的刷新定时器 */
    private _tempTimer:egret.Timer;
    /**是否刷新 */
    private _isReset:boolean;
}