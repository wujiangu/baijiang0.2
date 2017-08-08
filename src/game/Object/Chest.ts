/**
 * 宝箱类
 */
class Chest extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        this.chestArmature = new DragonBonesArmatureContainer();
        this.addChild(this.chestArmature);
        this.chestArmature.register(DragonBonesFactory.getInstance().makeArmature("buffdiaoluo", "buffdiaoluo", 20), [
            "diaoluoxiangzi",
        ]);
        this.chestArmature.addFrameCallFunc(this.chestArmatureFrame, this);

        this.itemArmature = new DragonBonesArmatureContainer();
        this.addChild(this.itemArmature);
        this.itemArmature.register(DragonBonesFactory.getInstance().makeArmature("buffdiaoluo", "buffdiaoluo", 10), [
            "skill01_01",
            "skill01_02",
            "skill01_03",
            "skill02",
            "skill03_01",
            "skill03_02"
        ]);
        this.itemArmature.addFrameCallFunc(this.itemArmatureFrame, this);

        this.chestArmature.scaleX = 1.5;
        this.chestArmature.scaleY = 1.5;
        this.itemArmature.scaleX = 1.5;
        this.itemArmature.scaleY = 1.5;
    }

    public init() {
        this.chestArmature.play("diaoluoxiangzi", 1);
    }


    /*********************************************************************/
    /**掉落动画监听 */
    private chestArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "stop") {
            this.chestArmature.pause("diaoluoxiangzi");
            TimerManager.getInstance().doTimer(10000, 1, this.disappear, this);
        }
    }

    /**随机战场buff监听 */
    private itemArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "explosion") {

        }
    }

    /**宝箱骨骼动画组 */
    private chestArmature:DragonBonesArmatureContainer;
    /**道具动画组 */
    private itemArmature:DragonBonesArmatureContainer;
}