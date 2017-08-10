/**
 * 炸弹
 */
class Explosive extends BaseRandomItem {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_zhadan");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
    }

    public init(target:any):void {
        super.init();
        this.target = target;
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        super.update(target, callBack);
    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target, ()=>{
            this.target.setItemStatus(true);
            this.target.itemArmature.play("skill02", 1);
        });
    }
}