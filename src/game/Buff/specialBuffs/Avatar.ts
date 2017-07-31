/**
 * 分身
 * 
 */
class Avatar extends BuffBase {
    public constructor() {
        super();
        var data = RES.getRes("Avatar_json");
        var txtr = RES.getRes("Avatar_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("Avatar"));
        this._mc1.scaleX = 1.5;
        this._mc1.scaleY = 1.5;
        this._mc1.anchorOffsetX = 40;
        this._mc1.anchorOffsetY = 80;
        this._mc1.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        this._mc1.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Avatar";
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
        this.target.setInvincible(true);
        this.releaseBegin();
    }

    /**
     * 开始释放
     */
    private releaseBegin():void {
        if (this.target.attr.hp <= 0) return;
        // this.target.specialArmature.visible = true;
        this.target.gotoIdle();
        this.target.setCanMove(false);
        this._mc1.visible = true;
        this._mc1.gotoAndPlay("skill04", 1);
        this.target.addChild(this._mc1);
        this.target.setChildIndex(this._mc1, this.target.numChildren+1);
        // this.target.specialArmature.play("skill04", 1);
    }

    private onMovie(event:egret.MovieClipEvent) {
        let label:string = event.frameLabel;
        if (label == "@split") {
            this.target.splite();
        }
    }

    private onComplete(event:egret.MotionEvent) {
        this._mc1.visible = false;
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
    // public recycleBuff() {
    //     super.recycleBuff();
    //     TimerManager.getInstance().remove(this.releaseBegin, this);
    //     // TimerManager.getInstance().remove(this.getRandom, this);
    // }

    public startTimer():void{
        Common.log("启动定时器---->")
        TimerManager.getInstance().doTimer(this.buffData.cd*1000, 1, this.releaseBegin, this);
    }

    public removeTimer():void {
        Common.log("清除定时器");
        TimerManager.getInstance().remove(this.releaseBegin, this);
    }

    private target:any;
    /**动画数据 */
    private _mc1:egret.MovieClip;
}