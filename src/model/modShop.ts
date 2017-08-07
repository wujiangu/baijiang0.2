/**
 * 游戏商城的逻辑
 */
namespace modShop {
    /**抽卡roll的范围 */
    var rolls:Array<any> = [[1, 5400], [5401, 8900], [8901, 9900], [9901, 10000]]
    /**星级roll的范围 */
    var starRolls:Array<any> = [[1, 7000], [7001, 9500], [9501, 10000]]
    /**词缀roll的范围 */
    var affixRolls:Array<any> = [[1, 4000], [4001, 6900], [6901, 8500], [8501, 9500], [9501, 10000]]
    /**词缀增加的值roll的范围 */
    export var affixValueRolls:Array<any> = [[1, 20], [21, 40], [41, 60], [61, 80], [81, 100]];
    /**词缀属性类型 */
    var affixType:number = 3;
    /**
     * 抽卡逻辑(1~2:54, 3:35, 4:10, 5:1)
     * 1~2: [1, 5400]
     * 3: [5401, 8900]
     * 4: [8901, 9900]
     * 5: [9901, 10000]
     */
    function drawCard(roll:number):number {
        let id;
        if (roll >= rolls[0][0] && roll <= rolls[0][1]) {
            id = MathUtils.getRandom(1, 9);
        }
        else if (roll >= rolls[1][0] && roll <= rolls[1][1]) {
            id = MathUtils.getRandom(10, 14);
        }
        else if (roll >= rolls[2][0] && roll <= rolls[2][1]) {
            id = MathUtils.getRandom(15, 19);
        }
        else if (roll >= rolls[3][0] && roll <= rolls[3][1]) {
            id = MathUtils.getRandom(20, 24);
        }
        return id;
    }

    /**
     * 星级逻辑(抽卡和掉落)
     * 0: 70%,
     * 1: 25%,
     * 2: 5%
     */
    function starDistribute(roll:number):number {
        let star = 0;
        // if (roll >= starRolls[0][0] && roll <= starRolls[0][1]) {
        //     star = 0;
        // }
        // else if (roll >= starRolls[1][0] && roll <= starRolls[1][1]) {
        //     star = 1;
        // }
        // else if (roll >= starRolls[2][0] && roll <= starRolls[2][1]) {
        //     star = 2;
        // }
        return star;
    }

    /**
     * 词缀逻辑
     */
    function affixDistribute(roll:number):any {
        let value:number = 0;
        let type:number = 1;
        for (let i = 0; i < affixRolls.length; i++) {
            if (roll >= affixRolls[i][0] && roll <= affixRolls[i][1]) {
                type = MathUtils.getRandom(1, affixType);
                value = MathUtils.getRandom(affixValueRolls[i][0], affixValueRolls[i][1])
                break;
            }
        }
        return {"type":type, "value":value};
    }

    /**
     * 从紫色武器以上抽取(十抽情况下，前面9个在紫色品级一下的情况)
     */
    function certainlyPurple():any {
        Common.log("非洲难民");
        let roll:number = MathUtils.getRandom(8901, 10000);
        let id:number = drawCard(roll);
        let starRoll:number = MathUtils.getRandom(1, 10000);
        let star:number = 0;starDistribute(starRoll);
        let affixs:Array<number> = new Array();
        // for (let i = 0; i < star; i ++) {
        //     let affixRoll:number = MathUtils.getRandom(1, 10000);
        //     let affix:any = affixDistribute(affixRoll);
        //     affixs.push(affix);
        // }
        return {"id":id, "star":star, "affix":affixs};
    }

    /**
     * fisher-yates shuffle算法(洗牌算法)
     */
    function shuffle(arr:Array<any>):void {
        let len = arr.length;
        if (len == 0) return;
        let temp:any;
        for (let i = 0; i < len; i++) {
                let j = MathUtils.getRandom(1, len);
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
        }
    }

    /**
     * 单抽(1~5星)
     * @return {"id":1, "star":1, "affixs":[{"type":1, "value":1}]}
     */
    export function drawOnce():any {
        let roll:number = MathUtils.getRandom(1, 10000);
        let id:number = drawCard(roll);
        let starRoll:number = MathUtils.getRandom(1, 10000);
        let star:number = 0;//starDistribute(starRoll);
        let affixs:Array<any> = new Array();
        // for (let i = 0; i < star; i ++) {
        //     let affixRoll:number = MathUtils.getRandom(1, 10000);
        //     let affix:any = affixDistribute(affixRoll);
        //     affixs.push(affix);
        // }
        return {"id":id, "star":star, "affix":affixs};
    }

    /**
     * 十连(必出紫色武器以上)
     */
    export function drawTen():Array<any> {
        let ids:Array<any> = new Array();
        let isPurple:boolean = false;
        // 十抽
        for (let i = 0; i < 10; i++) {
            let arrId = drawOnce();
            // 判断是否有紫色武器以上
            if (arrId[0] >= 15 && arrId[0] <= 24) {
                isPurple = true;
            }
            ids.push(arrId);
        }
        if (isPurple == false) {
            ids.pop();
            let arrId = certainlyPurple();
            ids.push(arrId);
        }
        shuffle(ids);
        for (let i = 0; i < ids.length; i ++) {
            if (typeof(ids[i]) == "undefined") ids.splice(i, 1);
        }
        // Common.log("洗牌", ids, ids.length);
        return ids;
    }

    /**
     * 将物品放入背包
     */
    export function putPackage(ids:Array<any>):void {
        
        ids.forEach(e=>{
            modEquip.EquipData.GetInstance().InsertEquipInfo(e)
        })
    }

    /**
     * 返回数组相同元素并且计算个数
     */
    function repeatCount(ids:Array<number>):any {
        var list = [];
        var listMap = {};
        for (let i = 0; i < ids.length; i++) {
            let id = ids[i];
            if (!!listMap[id]) {
                listMap[id] ++;
            }else{
                listMap[id] = 1;
            }
        }
        for (var item in listMap) {
            list.push({
                id:item,
                count:listMap[item]
            })
        }
        return list;
    }
}