/**
 * 冰霜
 * 发出蓝色的冲击波，击中眩晕1s
 */
class Frost extends BuffBase {
    public constructor() {
        super();
        var data = RES.getRes("Frost_json");
        var txtr = RES.getRes("Frost_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("Frost"));
        this._mc1.scaleX = 1.5;
        this._mc1.scaleY = 1.5;
        this._mc1.anchorOffsetX = 125;
        this._mc1.anchorOffsetY = 110;
        this._mc1.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        this._mc1.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Frost";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;
        this._isFinish = true;
        this._animateStatus = true;
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
    }

    public begin():void {
        if (this._isFinish && this._animateStatus) {
            this._isFinish = false;
            this.releaseBegin();
            TimerManager.getInstance().doTimer(this.buffData.cd*1000, 0, this.release, this);
        }
    }

    /**
     * 开始释放
     */
    private releaseBegin():void {
        this._animateStatus = false;
        // this.target.specialArmature.visible = true;
        this._mc1.visible = true;
        this._mc1.gotoAndPlay("skill03", 1);
        this.target.addChild(this._mc1);
        this.target.setChildIndex(this._mc1, 0);
        // this.target.specialArmature.play("skill03", 1, 1, 0, 0.6);
    }

    /**
     * 释放buff
     */
    private release():void {
        this._isFinish = true;
    }
    private onMovie(event:egret.MovieClipEvent) {
        let label:string = event.frameLabel;
        if (label == "@impact") {
            let distance:number = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, this.target.x, this.target.y);
            if (distance <= 200 ) {
                let buffConfig = modBuff.getBuff(2);
                let extraBuff = ObjectPool.pop(buffConfig.className);
                extraBuff.buffInit(buffConfig);
                extraBuff.effectName = "xuanyun";
                extraBuff.buffData.id = buffConfig.id;
                extraBuff.buffData.duration = buffConfig.duration;
                extraBuff.buffData.postionType = PostionType.PostionType_Head;
                GameData.heros[0].addBuff(extraBuff);
                GameData.heros[0].hurtHandler(this.target.attr.atk);
            }
        }
    }

    private onComplete(event:egret.MotionEvent) {
        this._mc1.visible = false;
        this._animateStatus = true;
    }
    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        
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

    /**回收buff类 */
    public recycleBuff() {
        super.recycleBuff();
        TimerManager.getInstance().remove(this.release, this);
    }
    private target:any;
    /**动画数据 */
    private _mc1:egret.MovieClip;
    /**cd是否结束 */
    private _isFinish:boolean;
    /**动画状态 */
    private _animateStatus:boolean;
}