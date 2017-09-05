/**
 * 新手引导
 */
class guideDialog extends Base {
    public constructor() {
        super();
        this.masks = Utils.createBitmap("mask_png");
        this.masks.width = Common.SCREEN_W;
        this.masks.height = Common.SCREEN_H;
        this.tipsText = Utils.createText("点击屏幕进行攻击", 800, 500, 30);
        this.tipsText.bold = true;
        this.tipsText.stroke = 3;
        this.tipsText.strokeColor = 0x274045;
        this.tipsText.fontFamily = "KaiTi";
        this.fingerMov = Common.CreateMovieClip("guideClip", true);
        this.fingerMov.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        this.fingerMov.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        this.fingerMov.x = this.tipsText.x + 50;
        this.fingerMov.y = this.tipsText.y - 160;
        this.beginX = this.fingerMov.x;
        this.beginY = this.fingerMov.y;
        this.addChild(this.masks);
        this.addChild(this.tipsText);
        this.addChild(this.fingerMov);
    }
    protected createChildren(): void{
        
    }

    protected childrenCreated(): void{
        this.createMoveGuide();
    }

    /**
     * 创建移动引导
     */
    private createMoveGuide():void {
        this.tipsText.text = "点击拖动进行移动";
        this.fingerMov.x = this.beginX;
        this.fingerMov.y = this.beginY;
        this.fingerMov.gotoAndPlay("guideClip", 1);
    }
    
    private onMovie(event:egret.MovieClipEvent):void {
        let label:string = event.frameLabel;
        if (label == "click_down") {
            this.fingerMov.stop();
            egret.Tween.get(this.fingerMov).to({x:this.fingerMov.x+100, y:this.fingerMov.y-50}, 1000).call(()=>{
                this.createMoveGuide();
            });
            // this.fingerMov.removeEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        }
    }

    private onComplete():void {

    }

    /**初始位置 */
    private beginX:number;
    private beginY:number;
    /**遮罩 */
    private masks:egret.Bitmap;
    /**提示字 */
    private tipsText:egret.TextField;
    /**点击提示动画 */
    private fingerMov:egret.MovieClip;
}