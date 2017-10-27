/**
 * 基础类模块
 * 其他场景或者模块可以继承这个类，Base内部可以有共通的方法
 */
class Base extends eui.Component{
    public constructor() {
        super();
    }

    /**初始话游戏数据 */
    public initGameData():void {
        HeroData.initData();
        modTalent.initData();
        modEquip.ReqGetEquip();
        modShare.GetShareNum();
        UserDataInfo.GetInstance().InitSignData();
        modShop.getRechargeAward();
        ModEmail.ReqGetEmail();
    }
}