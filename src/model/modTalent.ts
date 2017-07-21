/**
 * 天赋逻辑
 */
namespace modTalent {
    /**天赋的个数 */
    export var talentCount:number = 21;
    /**最多点亮天赋个数 */
    export var maxCount = 10;
    /**天赋名称 */
    var talentName = ["浩劫", "风行", "回复"];
    /**
     * 解锁条件：
     * 1:[[1,2], [8, 9], [15, 16]]， 无条件
     * 2:[[3], [10], [17]]，1层等级总和达到10
     * 3:[[4,5], [11, 12], [18, 19]]，1、2层等级总和达到28
     * 4:[[6], [13], [20]]，1、2、3层等级总和达到48
     * 5:[[7], [14], [21]]
     */
    /**天赋的分布2-1-2-1-1 */
    var distribute = {
        "1":[[1,2], [8, 9], [15, 16]],
        "2":[[3], [10], [17]],
        "3":[[4,5], [11, 12], [18, 19]],
        "4":[[6], [13], [20]],
        "5":[[7], [14], [21]]
    }
    /**解锁的最小点数需求 */
    var unlockCondition = [10, 25, 33, 44];
    /**每种天赋的总点数 */
    var sumEachCount:Array<number> = [0, 0, 0];
    /**玩家解锁的天赋 */
    var talent:Array<any> = new Array();
    /**玩家天赋页数据 */
    var talentPage:Array<any> = new Array();
    /**服务端获得数据 */
    export function initData(data:Array<any>):void {
        talentPage = data;
    }
    /**获取玩家天赋 */
    export function getTalentData():Array<any> {
        return talentPage;
    }
    /**
     * talent状态:(设cur为玩家的天赋数据结构)
     * 1. cur = [], talent = [[1, 0], [2, 0], [8, 0], [9, 0], [15, 0], [16, 0]]
     * 2. cur = [[1,1]], talent = [[1, 1], [2, 0], [8, 0], [9, 0], [15, 0], [16, 0]]
     * 3. cur = [[1,10]], talent = [[1, 10], [2, 0], [8, 0], [9, 0], [15, 0], [16, 0], [3, 0]]
     * 4. cur = [[1,5], [2,5]], talent = [[1, 5], [2, 5], [8, 0], [9, 0], [15, 0], [16, 0], [3, 0]]
     * 5. cur = [[1,10], [3,1]], talent = [[1, 10], [2, 0], [8, 0], [9, 0], [15, 0], [16, 0], [3, 1]]
     */
    /**
     * 每种天赋的总点数
     */
    export function eaceTalentCount(curPage:number):void {
        let curTalent = talentPage[curPage];
        sumEachCount = [0, 0, 0];
        for (let i = 0; i < curTalent.talent.length; i++) {
            let ids = curTalent.talent[i];
            if (ids[0] >= 1 && ids[0] <= 7) {
                sumEachCount[0] += ids[1];
            }
            else if (ids[0] >= 8 && ids[0] <= 14) {
                sumEachCount[1] += ids[1];
            }
            else if (ids[0] >= 15 && ids[0] <= 21) {
                sumEachCount[2] += ids[1];
            }
        }
        // Common.log(JSON.stringify(sumEachCount));
    }

    /**
     * 获取每种天赋的总点数
     */
    export function getEachTalentCount():Array<number> {
        return sumEachCount;
    }

    /**
     * 获取玩家解锁的天赋
     */
    export function getUnlockTalent():Array<any> {
        return talent;
    }
    
    /**
     * 判断解锁状态
     */
    export function isUnlock(curPage:number, talentId:number):boolean {
        //解锁标志
        let unlock:boolean = false;
        for (let i = 0; i < talent.length; i++) {
            if (talent[i][0] == talentId) {
                unlock = true;
                break;
            }
        }
        return unlock;
    }

    /**
     * 判断天赋是否点满
     */
    export function isTalentFull(curPage:number, talentId:number):boolean {
        let status:boolean = false;
        let isActive:boolean = false;
        let curTalent = talentPage[curPage];
        for (let i = 0; i < curTalent.talent.length; i++) {
            if (curTalent.talent[i][0] == talentId) {
                isActive = true;
                break;
            }
        }
        if (curTalent.talent.length >= maxCount && !isActive) status = true;
        return status;
    }

    /**
     * 设置天赋的解锁状态
     */
    export function setUnlock(curPage:number) {
        // let pos:Array<any> = findPosition(talentId);
        // getEachLineSum(curPage, pos[0], pos[1]);
        let curTalent = talentPage[curPage];
        //每列天赋解锁的行数
        var lines = [0 ,0 ,0];
        eaceTalentCount(curPage);

        for (let i = 0; i < sumEachCount.length; i++) {
            let count = sumEachCount[i];
            if (count < unlockCondition[0]) {
                lines[i] = 1;
            }
            else if (count >= unlockCondition[0] && count < unlockCondition[1]) {
                lines[i] = 2;
            }
            else if (count >= unlockCondition[1] && count < unlockCondition[2]) {
                lines[i] = 3;
            }else if (count >= unlockCondition[2] && count < unlockCondition[3]){
                lines[i] = 4;
            }else{
                lines[i] = 5;
            }
        }
        // Common.log("行数", JSON.stringify(lines));

        talent = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            for (let j = 1; j <= line; j++) {
                let temp = distribute[j.toString()];
                let ids = temp[i];
                for (let obj = 0; obj < ids.length; obj++) {
                    let arrId = [ids[obj], 0];
                    talent.push(arrId);
                }
            }
        }
        for (let i = 0; i < curTalent.talent.length; i++) {
            let ids = curTalent.talent[i];
            for (let j = 0; j < talent.length; j++) {
                if (ids[0] == talent[j][0]) {
                    talent[j][1] = ids[1];
                    break;
                }
            }
        }
        // Common.log(JSON.stringify(talent));
    }

    /**
     * 设置玩家的天赋数据
     */
    export function setData(curPage:number, talentId:number, value:number) {
        let isExist:boolean = false;
        let curTalent = talentPage[curPage];
        for (let i = 0; i < curTalent.talent.length; i++) {
            if (curTalent.talent[i][0] == talentId) {
                isExist = true;
                curTalent.talent[i][1] = value;
                break;
            }
        }
        if (!isExist) talentPage[curPage].talent.push([talentId, 1]);
        curTalent.count ++;
        LeanCloud.GetInstance().SaveRoleData("talentPage", talentPage);
        setUnlock(curPage);
    }

    /**
     * 获取玩家的天赋数据
     */
    export function getData(curPage:number=null, talentId:number=null):any {
        let talent:any = null;
        if (curPage == null && talentId == null) {
            talent = talentPage;
        }
        else if(curPage != null && talentId == null) {
            talent = talentPage[curPage];
        }else{
            let curTalent = talentPage[curPage];
            for (let i = 0; i < curTalent.talent.length; i++) {
                if (curTalent.talent[i][0] == talentId) {
                    talent = curTalent.talent[i];
                    break;
                }
            }
        }
        return talent;
    }

    /**
     * 从测试数据获取天赋数据(仅测试使用)
     */
    export function getTestData(talentId:number):any {
        let talent:any;
        for (let i = 0; i < GameData.testTalent.talent.length; i++) {
            if (GameData.testTalent.talent[i][0] == talentId) {
                talent = GameData.testTalent.talent[i];
                break;
            }
        } 
        return talent;
    }


    /**未解锁状态的提示 */
    export function getTips(talentId:number, isTips:boolean = true):string {
        let pos = findPosition(talentId);
        let line:number = parseInt(pos[0]);
        let row:number = pos[1];
        let str = `解锁${line}层天赋需${talentName[row]}天赋等级总和达到${unlockCondition[line-2]}`;
        if (!isTips) str = `需${talentName[row]}天赋等级总和达到${unlockCondition[line-2]}`;
        return str;
    }

    /**
     * 根据id获取索引值
     */
    export function getIndexFromId(talentId:number):number {
        let index:number = 0;
        for (let obj = 0; obj < 21; obj++) {
            if (ConfigManager.tcTalent[obj].id == talentId) {
                index = obj;
                break;
            }
        }
        return index;
    }

    /**
     * 获取每行天赋的等级总和
     */
    function getEachLineSum(curPage:number, line:number, row:number) {
        let sumLv:number = 0;
        let ids:Array<number> = distribute[line][row];
        for (let i = 0; i < ids.length; i++) {
            let talent = getData(curPage, ids[i]);
            sumLv += talent[1];
        }
        // Common.log(sumLv);
    }

    /**
     * 查找天赋的位置(用来判断可以解锁的天赋)
     */
    function findPosition(talentId:number):Array<any> {
        let pos:Array<any> = [];
        for (var key in distribute) {
            let ids:Array<any> = distribute[key];
            for (let i = 0; i < ids.length; i++) {
                if (ids[i][0] == talentId || ids[i][1] == talentId) {
                    pos[0] = key;
                    pos[1] = i;
                    break;
                }
            }
        }
        return pos;
    }
}