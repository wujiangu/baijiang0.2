/**
 * 木桩
 */
class Stakes extends egret.DisplayObjectContainer {
    public constructor() {
        super();
        this.isPVP = true;
        this.buffArmature = new DragonBonesArmatureContainer();
        let data = RES.getRes("stakes_json");
        let texture = RES.getRes("stakes_png");
        let mcData = new egret.MovieClipDataFactory(data, texture);
        this._mc = new egret.MovieClip(mcData.generateMovieClipData("stakes"));
        this.addChild(this._mc);
        this.addChild(this.buffArmature);
        this.hurtText = Utils.createBitmapText("hurtFnt_fnt", this);
        this.hurtText.x = 60;
       //添加播放完成事件
        this._mc.addEventListener(egret.Event.COMPLETE, this._onClipComplete, this);
    }

    public init() {
        this.alpha = 1.0;
        this.attr.hp = 5;
        this.curState = "";
        this.buff = [];
        //buff动画
        this.buffArmature.register(DragonBonesFactory.getInstance().makeArmature("buff", "buff", 10), [
            "Burning"
        ]);
        this.buffArmature.visible = false;
        this.buffArmature.scaleX = 1.5;
        this.buffArmature.scaleY = 1.5;
    }

    public gotoHurt(hurtValue:number = 1):void {
        if (this.attr.hp <= 0) return;
        if (this.curState == "hurt") return;
        // ShakeTool.getInstance().shakeObj(SceneManager.pvpScene, 1, 5, 5);
        this.curState = "hurt";
        this._mc.gotoAndPlay("stakes", 1);
        this.attr.hp --;
        // let hurtValue = MathUtils.getRandom(100, 2000);
        this.hurtText.text = `-${hurtValue.toString()}`;
        this.hurtText.anchorOffsetX = this.hurtText.width/2;
        this.hurtText.y = 50;
        Animations.hurtTips(this.hurtText);
        SceneManager.pvpScene.updateValue(hurtValue);
    }
    public gotoDead():void {
        this.clearObject();
        this.clearList();
        Common.dispatchEvent(GameEvents.EVT_PRODUCEMONSTER);
    }

    public clearObject():void {
        this.buffArmature.visible = false;
        Animations.fadeIn(this, 500, ()=>{
            ObjectPool.push(this);
            if (this.parent && this.parent.removeChild) this.parent.removeChild(this);
        })
    }

    public clearList():void {
        let index = GameData.stakes.indexOf(this);
        GameData.stakes.splice(index, 1);
    }

    /**增加buff */
    public addBuff(buff:any) {
        if (this.isExistBuff(buff) && (buff.buffData.controlType == ControlType.YES) && (buff.buffData.superpositionType == SuperpositionType.SuperpositionType_None)) return;
        this.buff.push(buff);
        buff.buffStart(this);
    }

    /**检查是否应经存在buff */
    public isExistBuff(buff:any):boolean {
        let status:boolean = false;
        for (let i = 0; i < this.buff.length; i++) {
            if (buff.buffData.id == this.buff[i].buffData.id) {
                status = true;
                break;
            }
        }
        return status;
    }
    /**
     * 设置状态
     */
    public setCurState(state:string):void {
        this.curState = state;
    }

    /**回收技能和buff */
    public recycle():void {
        for (let i = 0; i < this.buff.length; i++) {
            if (this.buff[i].buffData.className) {
                this.buff[i].recycleBuff();
            }
        }
    }

    /**
     * 从列表中清除
     */
    private _clearForList():void {
        
    }

    private _onClipComplete():void {
        this.curState = "";
        if (this.attr.hp <= 0) {
            this.gotoDead();
        }
    }

    public isPVP:boolean;
    private _mc:egret.MovieClip;
    public hp:number;
    public attr:any = {"hp":0};
    private curState:string;
    /**身上带的buff */
    public buff:any[];
    /**角色受到buff影响的骨架 */
    public buffArmature:DragonBonesArmatureContainer;
    /**伤害位图 */
    public hurtText:egret.BitmapText;
}