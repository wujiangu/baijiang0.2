/**
 * 随机道具基类
 */
class BaseRandomItem extends egret.DisplayObjectContainer {
    public constructor() {
        super();
    }

    /**创建文字组 */
    public createTextGroup(strBg:string, strText:string):void {
        this.textGroup = new egret.DisplayObjectContainer();
        let bg:egret.Bitmap = Utils.createBitmap("randomBuffSheet_json."+strBg);
        this.textGroup.addChild(bg);
        let text:egret.Bitmap = Utils.createBitmap("randomBuffSheet_json."+strText);
        text.x = 50;
        text.y = 2;
        this.textGroup.addChild(text);
        this.iconName = "randomBuffSheet_json."+strText;
    }

    public init(target:any = null):void {
        this.isAction = false;
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
            if (!this.isAction) this.recycle();
        });
        SceneManager.battleScene.effectLayer.addChild(this.icon);
        SceneManager.battleScene.battleSceneCom.addBuffIcon(this.textGroup, this.iconName, 2);
    }

    /**回收 */
    public recycle():void {
        Common.log("回收random---->", this);
        ObjectPool.push(this);
    }

    public target:Chest;
    /**buff图标 */
    public icon:egret.Bitmap;
    /**图标的名字 */
    public iconName:string;
    /**buff文字组 */
    public textGroup:egret.DisplayObjectContainer;
    /**是否有运行动画 */
    public isAction:boolean;
}