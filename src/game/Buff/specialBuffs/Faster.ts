/**
 * 快速
 * 速度增加一倍
 */
class Faster extends BuffBase {
    public constructor() {
        super();
        var data = RES.getRes("Faster_json");
        var txtr = RES.getRes("Faster_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("Faster"));
        this._mc1.scaleX = 1.5;
        this._mc1.scaleY = 1.5;
        this._mc1.visible = false;
        this._mc1.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        this._mc1.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Faster";
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
        let movSpeed:number = this.target.getSpeed() * 2;
        this.target.setSpeed(Math.floor(movSpeed));
        this.target.addChild(this._mc1);
    }

    /**开始释放 */
    public releaseBegin(num:number):void {
        this.target.setChildIndex(this._mc1, 0);
        switch (num) {
            case 1:
                this.target.setChildIndex(this._mc1, this.target.numChildren+1);
                this._mc1.x = -23;
                this._mc1.y = -75;
            break;
            case 2:
                this._mc1.x = -150;
                this._mc1.y = -75;
            break;
            case 3:
                this._mc1.x = -23;
                this._mc1.y = -180;
            break;
        }
        this._mc1.visible = true;
        this._mc1.gotoAndPlay(`skill05_0${num}`, -1);
        // this.specialArmature.play(specialAnimate, 0);
    }

    private onMovie(event:egret.MovieClipEvent) {
        let label:string = event.frameLabel;
        if (label == "@split") {
            
        }
    }

    private onComplete(event:egret.MotionEvent) {
        // this._mc1.visible = false;
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
        this._mc1.visible = false;
    }
    /**动画数据 */
    private _mc1:egret.MovieClip;
    private target:any;
}