/**
 * 筑墙
 * 筑起一道墙，撞到眩晕1s，5s后消失
 */
class BuildWall extends BuffBase {
    public constructor() {
        super();
        var data = RES.getRes("BuildWall_json");
        var txtr = RES.getRes("BuildWall_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("BuildWall"));
        this._mc1.scaleX = 1.5;
        this._mc1.scaleY = 1.5;
        this._mc1.addEventListener(egret.MovieClipEvent.FRAME_LABEL, this.onMovie, this);
        this._mc1.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        SceneManager.battleScene.otherLayer.addChild(this._mc1);
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "BuildWall";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;
    }

    private onMovie(event:egret.MovieClipEvent) {
        let label:string = event.frameLabel;
        if (label == "@buildEnd1" || label == "@buildEnd2") {
            this._mc1.stop();
        }
    }

    private onComplete(event:egret.MotionEvent) {
        this._mc1.visible = false;
    }


    /**开始 */
    public buffStart(target:any) {
        this.target = target;
        this.getRandom();
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
    
    private onWallDisappear():void {
        // this.target.specialArmature.play(`skill01_0${this.type}`, 1, 2, 4);
        this._mc1.play(1);
        SceneManager.battleScene.removeCollison(this);
        if (this.target.curState == "dead"){
            TimerManager.getInstance().remove(this.onWallDisappear, this);
        }else{
            TimerManager.getInstance().doTimer(this.buffData.cd*1000, 1, this.getRandom, this);
        }
    }

    /**
     * 筑墙
     */
    private buildWall(x:number, y:number):void {
        let radian = MathUtils.getRadian2(this.target.x, this.target.y, x, y);
        let direction:string = this.target.getWalkPosition("skill01_", radian);
        let num:number = parseInt(direction.charAt(9));
        Common.log("位置--->", this.target.x, this.target.y, x, y, num);
        // this.target.specialArmature.visible = true;
        // SceneManager.battleScene.otherLayer.addChild(this.target.specialArmature);
        // this.target.specialArmature.x = x;
        // this.target.specialArmature.y = y;
        this._mc1.x = x;
        this._mc1.y = y;
        this.x = x;
        this.y = y;
        if (num == 2) {
            this.type = 2;
        }else{
            this.type = 1;
        }
        // this.target.specialArmature.play(`skill01_0${this.type}`, 1);
        this._mc1.visible = true;
        this._mc1.gotoAndPlay(`skill01_0${this.type}`, 1);
        SceneManager.battleScene.addCollison(this);
        TimerManager.getInstance().doTimer(this.buffData.duration*1000, 1, this.onWallDisappear, this);
    }

    private getRandom():void {
        let randomX:number = MathUtils.getRandom(-200, 200) + this.target.x;
        let randomY:number = MathUtils.getRandom(-200, 200) + this.target.y;
        let isBound:boolean = false;
        if (randomX <= 75) isBound = true;
        if (randomX >= Common.SCREEN_W - 75) isBound = true;
        if (randomY <= 75) isBound = true;
        if (randomY >= Common.SCREEN_H - 75) isBound = true;

        let distance:number = MathUtils.getDistance(this.target.x, this.target.y, randomX, randomY);
        if (distance >= 50 && distance <= 200 && !isBound) {
            this.buildWall(randomX, randomY);
        }else{
            this.getRandom();
        }
    }
    /**回收buff类 */
    public recycleBuff() {
        super.recycleBuff();
        // TimerManager.getInstance().remove(this.onWallDisappear, this);
        TimerManager.getInstance().remove(this.getRandom, this);
    }
    private target:any;
    /**动画数据 */
    private _mc1:egret.MovieClip;
    /**墙的类型 */
    public type:number;
    /**x坐标 */
    public x:number;
    /**y坐标 */
    public y:number;
    /****************区域****************/
    public minX:number;
    public maxX:number;
    public minY:number;
    public maxY:number;
}