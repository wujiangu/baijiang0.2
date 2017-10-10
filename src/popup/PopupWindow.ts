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

    public Close(type:number = 0):void{
        AudioManager.GetIns().PlayMusic(AudioManager.CLOSE_MUSIC);
        if(type == 1){
            Animations.PopupBackIn(this, 350,  ()=>{
                if(this.parent) this.parent.removeChild(this);
            });
        }
        else
        {
            if(this.parent) this.parent.removeChild(this);
        }
    }
}