/**
 * 爆炸
 * 死亡后1.5s爆炸
 */
class BlowUp extends BuffBase {
    public constructor() {
        super();
        var data = RES.getRes("BlowUp_json");
        var txtr = RES.getRes("BlowUp_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("BlowUp"));
        this._mc1.scaleX = 1.5;
        this._mc1.scaleY = 1.5;
        this._mc1.anchorOffsetX = 44;
        this._mc1.anchorOffsetY = 60;
        this._mc1.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        this._mc1.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        // this._mc1.visible = false;
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "BlowUp";
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
        this._mc1.visible = false;
        this.target.addChild(this._mc1);
    }

    private onMovie(event:egret.MovieClipEvent) {
        let label:string = event.frameLabel;
        if (label == "@blowup") {
            this.target.blew();
        }
    }

    private onComplete(event:egret.MotionEvent) {
        this._mc1.visible = false;
        this.target.shadow.visible = false;
    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        // this.target.specialArmature.visible = true;
        // this.target.specialArmature.play("skill06", 1);
        this._mc1.visible = true;
        this._mc1.gotoAndPlay("skill06", 1);
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
    /**动画数据 */
    private _mc1:egret.MovieClip;
    private target:any;
}