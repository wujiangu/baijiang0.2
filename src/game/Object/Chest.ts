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
        this.itemArmature.register(DragonBonesFactory.getInstance().makeArmature("buffdiaoluo", "buffdiaoluo", 20), [
            "skill01_01",
            "skill01_02",
            "skill01_03",
            "skill02",
            "skill03_01",
            "skill03_02"
        ]);
        this.itemArmature.addFrameCallFunc(this.itemArmatureFrame, this);
        this.itemArmature.addCompleteCallFunc(this.itemArmaturePlayEnd, this);

        this.chestArmature.scaleX = 1.5;
        this.chestArmature.scaleY = 1.5;
        this.itemArmature.scaleX = 1.5;
        this.itemArmature.scaleY = 1.5;
        this.type = 0;
    }

    public init(buffId:number) {
        this.buffId = buffId;
        this.setChestStatus(true);
        this.setItemStatus(false);
        this.chestArmature.play("diaoluoxiangzi", 1);
        this.buff = null;
        this.item = null;
        if (buffId >= 70 && buffId < 80) this.initBuffData(buffId);
        else this.initItemData(buffId);
        this.isOpen = true;
        this.isTimeOut = false;
    }

    /**初始buff数据 */
    private initBuffData(buffId:number) {
        // if (GameData.heros[0].isExistBuff(buffId, true)) return;
        let buffConfig:any = modBuff.getBuff(buffId);
        this.buff = ObjectPool.pop(buffConfig.className);
        this.buff.buffInit(buffConfig);
    }

    /**初始道具数据 */
    private initItemData(itemId:number):void {
        //不合理（后续可以添加道具配置文件）
        let itemConfig:any = modBuff.getBuff(itemId);
        this.item = ObjectPool.pop(itemConfig.className);
        this.item.init(this);
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
    
    /**设置道具动画的显示状态 */
    public setItemStatus(status:boolean):void {
        this.itemArmature.visible = status;
    }

    /**清除定时器 */
    public removeTimer():void {
        TimerManager.getInstance().remove(this.disappear, this);
    }

    /**回收处理 */
    public recycle():void {
        // Common.log("buff----->", this.buff, this.item);
        if (this.buff && this.buff.recycleBuff) this.buff.recycleBuff();
        if (this.item && this.item.recycle) this.item.recycle();
    }

    /**宝箱消失 */
    private disappear():void {
        this.isOpen = true;
        this.removeTimer();
        egret.Tween.get(this.chestArmature).to({alpha:0}, 500, egret.Ease.circOut).call(()=>{
            this.setChestStatus(false);
            let index = GameData.chests.indexOf(this);
            GameData.chests.splice(index, 1);
            ObjectPool.push(this);
            if (!this.isTimeOut) this.recycle();
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
            if (this.buffId >= 70 && this.buffId < 80) {
                //增益或减益
                if (GameData.heros[0]) GameData.heros[0].addBuff(this.buff, true);
                for (let i = 0; i < GameData.heros[0].buff.length; i++) {
                    //狂暴
                    if (GameData.heros[0].buff[i].buffData.id == this.buffId) {
                        GameData.heros[0].buff[i].AddEffect(this);
                        GameData.heros[0].buff[i].addProperty();
                    }
                }
                this.buff.AddEffect(this);
            }else{
                this.item.AddEffect(this);
            }
        }
    }

    /**宝箱动画完成监听 */
    private chestArmaturePlayEnd():void {
        this.isTimeOut = true;
        this.disappear();
    }

    /**随机道具监听 */
    private itemArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        if (evt == "explosion") {
            GameData.heros[0].setLiveEnermy();
            let object:Array<any> = GameData.heros[0].getEnermy();
            for (let i = 0; i < GameData.heros.length; i++) {
                object.push(GameData.heros[i]);
            }
            for (let i = 0; i < object.length; i++) {
                if (object[i].type == 1) {
                    let dis = MathUtils.getDistance(this.item.icon.x, this.item.icon.y, object[i].x, object[i].y);
                    if (dis < 100) {
                        object[i].gotoHurt(GameData.heros[0].attr.atk);
                    }
                }
            }
        }
    }

    /**道具动画完成监听 */
    private itemArmaturePlayEnd():void {
        this.setItemStatus(false);
    }

    /**对象类型 0:掉落的宝箱或道具，1:角色或敌人 */
    public type:number;
    /**buff */
    private buff:BaseRandomBuff;
    /**buffId或者道具id */
    private buffId:number;
    /**道具 */
    private item:BaseRandomItem;
    /**宝箱的状态*/
    private isOpen:boolean;
    /**宝箱计时 */
    private isTimeOut:boolean;
    /**宝箱骨骼动画组 */
    private chestArmature:DragonBonesArmatureContainer;
    /**道具动画组 */
    public itemArmature:DragonBonesArmatureContainer;
}