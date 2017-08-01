/**
 * 英雄的数据
 */
class HeroData {

    /**
     * 从服务器获取数据
     */
    public static initData(hero:any):void {
        HeroData.list = hero;
    }

    /**
     * 设置英雄的属性数值
     */
    public static setHeroAttr(name:string, curLv:number):void {
        
    }

    /**
     * 根据英雄的名字获取数据
     */
    public static getHeroData(name:string) {
        let data:any;
        if (!HeroData.list){
            data = ConfigManager.heroConfig[name];
        }else{
            data = HeroData.list[name];
        }
        return data;
    }

    /**
     * 添加新的英雄
     */
    public static addHeroData(name:string, data:any) {
        let hero = data[name];
        HeroData.list[name] = hero;
        HeroData.list[name]["lv"] = 1;        
        this.update();
    }

    /**
     * 判断是否已有英雄
     */
    public static hasHero(name:string):boolean {
        let status = false;
        for (var key in HeroData.list) {
            if (key == name) {
                status = true;
                break;
            }
        }
        return status;
    }

    public static setCurHeroData(name:string):void{
        this._curHeroData = HeroData.list[name];
    }

    /**
     * 更新英雄的数据
     */
    public static update():void{
        if (HeroData.list) LeanCloud.GetInstance().SaveRoleData("hero", HeroData.list);
    }

    /**数据表 */
    public static list:any;
    /**当前英雄数据 */
    private static _curHeroData:any;
}