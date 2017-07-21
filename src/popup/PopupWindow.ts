class PopupWindow extends Base{
    public constructor(){
        super();
    }

    public Init():void{
    }

    public Show(...arg):void{
        GameLayerManager.gameLayer().panelLayer.addChild(this);
    }

    public Reset(...arg):void{

    }

    public Close():void{
        if(this.parent) this.parent.removeChild(this);
    }
}