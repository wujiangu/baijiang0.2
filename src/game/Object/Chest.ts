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
        this.chestArmature.addCompleteCallFunc(this.chestArmaturePlayEnd, this);

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
        this.type = 0;
    }

    public init(buffId:number) {
        this.buffId = buffId;
        this.setChestStatus(true);
        this.chestArmature.play("diaoluoxiangzi", 1);
        this.initBuffData(buffId);
        this.isOpen = true;
    }

    private initBuffData(buffId:number) {
        // if (GameData.heros[0].isExistBuff(buffId, true)) return;
        let buffConfig:any = modBuff.getBuff(buffId);
        this.buff = ObjectPool.pop(buffConfig.className);
        this.buff.buffInit(buffConfig);
    }

    /*********************************************************************/
    public gotoHurt():void {
        if (this.isOpen) return;
        this.isOpen = true;
        this.chestArmature.play("diaoluoxiangzi", 1, 2, 3);
    }

    /*********************************************************************/
    /**设置宝箱的显示状态 */
    public setChestStatus(status:boolean):void {
        this.chestArmature.visible = status;
        this.chestArmature.alpha = 0;
        if (status) this.chestArmature.alpha = 1;
    }
    
    /**清除定时器 */
    public removeTimer():void {
        TimerManager.getInstance().remove(this.disappear, this);
    }

    /**宝箱消失 */
    private disappear():void {
        this.isOpen = true;
        this.removeTimer();
        egret.Tween.get(this.chestArmature).to({alpha:0}, 500, egret.Ease.circOut).call(()=>{
            this.setChestStatus(false);
            let index = GameData.chests.indexOf(this);
            GameData.chests.splice(index, 1);
        });
    }

    /**掉落动画监听 */
    private chestArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "stop") {
            this.isOpen = false;
            this.chestArmature.pause("diaoluoxiangzi");
            TimerManager.getInstance().doTimer(10000, 1, this.disappear, this);
        }
        else if (evt == "itemShow") {
            if (GameData.heros[0]) GameData.heros[0].addBuff(this.buff, true);
            for (let i = 0; i < GameData.heros[0].buff.length; i++) {
                //狂暴
                if (GameData.heros[0].buff[i].buffData.id == this.buffId) {
                    GameData.heros[0].buff[i].AddEffect(this);
                    GameData.heros[0].buff[i].addProperty();
                }
            }
            this.buff.AddEffect(this);
        }
    }

    /**宝箱动画完成监听 */
    private chestArmaturePlayEnd():void {
        this.disappear();
    }

    /**随机战场buff监听 */
    private itemArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "explosion") {

        }
    }

    /**对象类型 0:掉落的宝箱或道具，1:角色或敌人 */
    public type:number;
    /**buff或者道具 */
    private buff:BuffBase;
    /**buffId */
    private buffId:number;
    /**宝箱的状态*/
    private isOpen:boolean;
    /**宝箱骨骼动画组 */
    private chestArmature:DragonBonesArmatureContainer;
    /**道具动画组 */
    private itemArmature:DragonBonesArmatureContainer;
}