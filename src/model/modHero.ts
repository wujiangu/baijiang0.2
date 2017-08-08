namespace modHero {

    /**根据英雄的id获取索引 */
    export function getIndextFromId(id:number):number {
        let index:number;
        for (let i = 0; i < ConfigManager.tcHero.length; i++) {
            if (ConfigManager.tcHero[i].hero_id == id) {
                index = i;
                curIndex = i;
                break;
            }
        }
        return index;
    }

    /**根据英雄的id获取英雄名字 */
    export function getNameFromId(id:number):string {
        let name:string;
        for (let i = 0; i < ConfigManager.tcHero.length; i++) {
            if (ConfigManager.tcHero[i].hero_id == id) {
                name = ConfigManager.tcHero[i].name;
                break;
            }
        }
        return name;
    }

    export function getCurIndex():number {
        return curIndex;
    }

    /**
     * 根据key获取id
     */
    export function getIdFromKey(name:string):number {
        let id:number = 1;
        let data = HeroData.getHeroData(name);
        id = data.id;
        return id;
    }

    /**
     * 获取英雄的配置
     */
    export function getHeroConfig(name:string) {
        // let heroConfig = HeroData.list[name];
        let heroConfig = ConfigManager.heroConfig[name];
        return heroConfig;
    }

    /**
     * 加入装备的基本数值
     */
    export function addEquipAttr(data:any):any {
        let attr:any;
        let heroConfig = getHeroConfig(data[0]);
        let equip:number = heroConfig.equip;
        attr = data[1];
        if (equip == 0) {
            // attr = data[1];
        }else{
            Common.log("人物属性---->", JSON.stringify(data[1]));
            let equipInfo = modEquip.EquipData.GetInstance().GetEquipFromId(equip, 0);
            Common.log("装备信息----->", JSON.stringify(equipInfo));
            let equipAttr = equipInfo.GetEquipAttr();
            attr.hp += Math.ceil(equipAttr[0]);
            attr.def += Math.ceil(equipAttr[1]);
            attr.atk += Math.ceil(equipAttr[2]);
            let crt = parseFloat(equipAttr[3].toFixed(2));
            attr.crt += crt;
            let attrType = equipInfo.GetAttrType();
            if (attrType.length > 0) {
                addWashAttr(attrType, attr);
            }
        }
        Common.log("装备后属性----->", JSON.stringify(attr));
        return attr;
    }

    /**
     * 加入装备的洗练数值
     */
    export function addWashAttr(attrType, attr):void {
        for (let i = 0; i < attrType.length; i++) {
            let washAttr = attrType[i];
            switch (washAttr.type) {
                case 0:
                    attr.hp += Math.ceil(washAttr.value);
                break;
                case 1:
                    attr.def += Math.ceil(washAttr.value);
                break;
                case 2:
                    attr.atk += Math.ceil(washAttr.value);
                break;
                case 3:
                    let crt = parseFloat(washAttr.value.toFixed(2));
                    attr.crt += crt;
                break;
                case 4:
                    // attr.avo += 
                break;
            }
        }
    }

    var curIndex:number = 0;
}