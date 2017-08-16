/**
 * 镜像
 */
class Mirror extends BaseRandomItem {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_jingxiang");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.createTextGroup("buff_fumiandi", "buff_008");
    }

    public init(target:any):void {
        super.init();
        this.target = target;
        this.isAction = true;
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        super.update(target, callBack);
    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target, ()=>{
            this.target.setItemStatus(true);
            let name = GameData.heros[0].name;
            let attr = Utils.cloneObj(GameData.heros[0].attr);
            attr["atk"] = Math.floor(attr["atk"] * 0.25);
            this.mirror = SceneManager.battleScene.createMirror([name, attr]);
            TimerManager.getInstance().doTimer(10000, 1, this.disappear, this);
            TimerManager.getInstance().doTimer(2000, 1, this.onIcon, this);
        });
    }

    private disappear() {
        this.mirror.gotoIdle();
        this.mirror.curState = "";
        let index:number = GameData.heros.indexOf(this.mirror);
        GameData.heros.splice(index, 1);
        ObjectPool.push(this.mirror);
        if (this.mirror && this.mirror.parent && this.mirror.parent.removeChild) this.mirror.parent.removeChild(this.mirror);
        this.recycle();
    }

    private onIcon():void {
        SceneManager.battleScene.battleSceneCom.removeBuffIcon(this.iconName);
    }

    private mirror:any;
}