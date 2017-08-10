/**
 * 随机道具基类
 */
class BaseRandomItem extends egret.DisplayObjectContainer {
    public constructor() {
        super();
    }

    public init(target:any = null):void {

    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        
    }

    /**增加特效 */
    public AddEffect(target:any, callBack:Function = null) {
        this.icon.x = target.x;
        this.icon.y = target.y - 20;
        this.icon.visible = true;
        egret.Tween.get(this.icon).to({y:this.icon.y - 20}, 500).call(()=>{
            this.icon.visible = false;
            egret.Tween.removeTweens(this.icon);
            if (callBack) callBack();
            SceneManager.battleScene.effectLayer.removeChild(this.icon);
            this.recycle();
        });
        SceneManager.battleScene.effectLayer.addChild(this.icon);
    }

    /**回收 */
    public recycle():void {
        ObjectPool.push(this);
    }

    public target:Chest;
    /**buff图标 */
    public icon:egret.Bitmap;
}