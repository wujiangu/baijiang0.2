/**
 * 箭筒
 */
class ArrowTube extends BaseRandomItem {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_jian");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.armatures = new Array();
        this._deltaX = new Array();
        this._deltaY = new Array();
        for (let i = 0; i < 8; i++) {
            let arrow:DragonBonesArmatureContainer = new DragonBonesArmatureContainer();
            arrow.register(DragonBonesFactory.getInstance().makeArmature("buffdiaoluo", "buffdiaoluo", 20), [
                "skill01_01",
                "skill01_02",
                "skill01_03"
            ]);
            arrow.scaleX = 1.5;
            arrow.scaleY = 1.5;
            arrow.rotation = i * 45;
            arrow.visible = false;
            this.armatures.push(arrow);
        }
    }

    public init(target:any):void {
        super.init();
        this.target = target;
        this._deltaX = [];
        this._deltaY = [];
        this.arrows = this.armatures;
        for (let i = 0; i < this.arrows.length; i++) {
            let radian:number = MathUtils.getRadian(this.arrows[i].rotation);
            let deltaX:number = Math.ceil(Math.cos(radian) * 12);
            let deltaY:number = Math.ceil(Math.sin(radian) * 12);
            this._deltaX.push(deltaX);
            this._deltaY.push(deltaY);
        }
        this.isFly = false;
        TimerManager.getInstance().doTimer(20, 0, this.action, this);
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        super.update(target, callBack);
    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target, ()=>{
            for (let i = 0; i < this.arrows.length; i++) {
                this.arrows[i].visible = true;
                this.arrows[i].play("skill01_02", 0);
                this.arrows[i].x = this.icon.x;
                this.arrows[i].y = this.icon.y;
                SceneManager.battleScene.effectLayer.addChild(this.arrows[i]);
            }
            this.isFly = true;
        });
    }

    public action():void {
        if (this.isFly) {
            for (let i = 0; i < this.arrows.length; i++) {
                this.fly(i);
            }
        }
    }

    /**飞行 */
    private fly(id:number):void {
        this.arrows[id].x += this._deltaX[id];
        this.arrows[id].y += this._deltaY[id];
        if (this.arrows[id].x < 20) this._bound(id);
        if (this.arrows[id].y < 20) this._bound(id);
        if (this.arrows[id].x > Common.SCREEN_W - 20) this._bound(id);
        if (this.arrows[id].y > Common.SCREEN_H - 20) this._bound(id);
    }

    private _bound(id:number):void {
        if (this._deltaX[id] == 0 || this._deltaY[id] == 0) return;
        let target = this.arrows[id];
        egret.setTimeout(()=>{
            target.visible = false;
            if (target && target.parent){
                target.parent.removeChild(target);
            }
        }, this, 100);
        target.play("skill01_03", 1);
        this._deltaX[id] = 0;
        this._deltaY[id] = 0;
    }

    private armatures:Array<DragonBonesArmatureContainer>;
    /**箭组 */
    private arrows:Array<DragonBonesArmatureContainer>;
    /**横向变化值 */
    private _deltaX:Array<number>;
    /**纵向变化值 */
    private _deltaY:Array<number>;
    /**运行状态 */
    private isFly:boolean;
}