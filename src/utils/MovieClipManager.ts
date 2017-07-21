class MovieClipManager extends egret.DisplayObjectContainer{
    public constructor(name:string){
        super();
        let data = RES.getRes(name + "_json");
        let texture = RES.getRes(name + "_png");
        this._mcData = new egret.MovieClipDataFactory(data, texture);
        this._mc = new egret.MovieClip();
        this.addChild(this._mc);
    }

    public Wait():void{
        this._mc.movieClipData = this._mcData.generateMovieClipData("wait");
    }

    public Action(action:string = "action", playTime:number = 1):void{
        this._mc.movieClipData = this._mcData.generateMovieClipData(action)
        this._mc.gotoAndPlay(1, playTime);
        if(playTime != -1) {
            this._mc.addEventListener(egret.Event.COMPLETE, this.onEvent, this);
        }
    }

    public MoreAction(name:string, playTime:number, type:number):void{
        if(type == 1){
            this._mc.addEventListener(egret.Event.COMPLETE, this.onAction1, this);
        }   
        else
        {
            this._mc.addEventListener(egret.Event.COMPLETE, this.onAction2, this);
        }

        this._mc.movieClipData = this._mcData.generateMovieClipData(name);
        this._mc.gotoAndPlay(1, playTime);
    }

    private onAction1():void{
        this._mc.removeEventListener(egret.Event.COMPLETE, this.onAction1, this);
        this._mc.movieClipData = this._mcData.generateMovieClipData("action12");
        this._mc.play(1);
    }

    private onAction2():void{
        this._mc.removeEventListener(egret.Event.COMPLETE, this.onAction2, this);
        this._mc.addEventListener(egret.Event.COMPLETE, this.onAction22, this);
        this._mc.movieClipData = this._mcData.generateMovieClipData("action22");
        this._mc.gotoAndPlay(1, 4);
    }

    private onAction22():void{
        this._mc.removeEventListener(egret.Event.COMPLETE, this.onAction22, this);
        this._mc.addEventListener(egret.Event.COMPLETE, this.onEvent, this);
        this._mc.movieClipData = this._mcData.generateMovieClipData("action23");
        this._mc.gotoAndPlay(1, 1);
    }

    private onEvent(){
        this._mc.removeEventListener(egret.Event.COMPLETE, this.onEvent, this);
        this.Wait();
    }

    private _mc:egret.MovieClip;
    private _mcData:egret.MovieClipDataFactory;
}