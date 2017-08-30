/**
 * 英雄的数据
 */
class HeroData {

    /**
     * 从服务器获取数据
     */
    public static initData(hero:any=null):void {
        //获取英雄列表
        HttpRequest.getInstance().send("GET", "hero", {}, (result)=>{
            for (let i = 0; i < result.hero.length; i++) {
                let hero:any = result.hero[i];
                for (let name in ConfigManager.heroConfig) {
                    let curHeroConf = ConfigManager.heroConfig[name];
                    if (hero.heroId == curHeroConf.heroId) {
                        HeroData.list[name] = hero;
                        HeroData.list[name]["buff"] = Utils.cloneObj(curHeroConf.buff);
                        HeroData.list[name]["skill"] = curHeroConf.skill;
                        break;
                    }
                }
            }
            HeroData.addHeroAttr();
            // egret.log("英雄列表信息--->", JSON.stringify(HeroData.list))
        }, this);
    }

    public static addHeroAttr():void {
        for (let key in HeroData.list) {
            HeroData.addSingleHeroAttr(key);
        }
    }

    /**
     * 加入单个英雄属性
     */
    public static addSingleHeroAttr(name:string):void {
            HeroData.list[name].attr = [];
            let data = ConfigManager[`${name}Attr`];
            let level:number = HeroData.list[name].lv;
            let attr = Utils.cloneObj(data[level - 1]);
            HeroData.list[name].attr.push(attr["hp"]);
            HeroData.list[name].attr.push(attr["atk"]);
            HeroData.list[name].attr.push(attr["def"]);
            HeroData.list[name].attr.push(attr["avo"]);
            HeroData.list[name].attr.push(attr["crt"]);
            HeroData.list[name].attr.push(attr["wsp"]);
    }

    /**
     * 设置英雄的属性数值
     */
    public static setHeroAttr(name:string, curLv:number):void {
        let data = ConfigManager[`${name}Attr`];
        let attr = Utils.cloneObj(data[curLv - 1]);
        HeroData.list[name].attr[0] = attr["hp"];
        HeroData.list[name].attr[1] = attr["atk"];
        HeroData.list[name].attr[2] = attr["def"];
        HeroData.list[name].attr[3] = attr["avo"];
        HeroData.list[name].attr[4] = attr["crt"];
        HeroData.list[name].attr[5] = attr["wsp"];
    }

    /**
     * 根据英雄的名字获取数据
     */
    public static getHeroData(name:string) {
        let data:any;
        if (Object.keys(HeroData.list).length == 0){
            data = ConfigManager.heroConfig[name];
        }else{
            data = HeroData.list[name];
        }
        return data;
    }

    /**
     * 添加新的英雄
     */
    public static addHeroData(name:string) {
        let currentHero = HeroData.getHeroData(GameData.curHero);
        let hero = ConfigManager.heroConfig[name];
        HeroData.list[name] = Utils.cloneObj(hero);
        if (currentHero.equipId != 0) HeroData.list[name]["equipId"] = currentHero.equipId;
        let data:any = {};
        data["heroId"] = HeroData.list[name].heroId;
        data["equipId"] = HeroData.list[name].equipId;
        data["exp"] = HeroData.list[name].exp;
        data["lv"] = HeroData.list[name].lv;
        HttpRequest.getInstance().send("POST", "hero", data);
        HeroData.addSingleHeroAttr(name);
        this.update();
    }

    /** up same */
    public static AddHero(name:string):void{
        let hero = ConfigManager.heroConfig[name];
        HeroData.list[name] = hero;
        HeroData.list[name]["equipId"] = HeroData.getHeroData(GameData.curHero).equipId;
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
        // if (HeroData.list) LeanCloud.GetInstance().SaveRoleData("hero", HeroData.list);
    }

    /**数据表 */
    public static list:any = {};
    /**当前英雄数据 */
    private static _curHeroData:any;
}