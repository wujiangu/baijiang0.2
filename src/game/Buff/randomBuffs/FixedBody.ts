/**
 * 定身
 */
class FixedBody extends BaseRandomItem {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_dingshen");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.createTextGroup("buff_fumiandi", "buff_009");
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
            GameData.heros[0].setEnermy();
            let enermy:Array<any> = GameData.heros[0].getEnermy();
            for (let i = 0; i < enermy.length; i++) {
                if (enermy[i].type == 1) {
                    enermy[i].removeActComplete();
                    let buffCofig = modBuff.getBuff(1);
                    let buff:UnableMove = ObjectPool.pop(buffCofig.className);
                    buffCofig.duration = 2;
                    buff.buffInit(buffCofig);
                    buff.effectName = "skill01";
                    buff.buffData.postionType = PostionType.PostionType_Foot;
                    enermy[i].addBuff(buff);
                }
            }
            egret.setTimeout(()=>{
                SceneManager.battleScene.battleSceneCom.removeBuffIcon(this.iconName);
            }, this, 2000);
        });
    }
}