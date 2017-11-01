/**
 * pvp相关的逻辑模块
 */
namespace modPVP {
    /**
     * 创建一个刷新木桩的定时器
     */
    export function createTimer():void{
        timer = new egret.Timer(15000, 0);
        timer.stop();
        timer.addEventListener(egret.TimerEvent.TIMER, onTimeUp, modPVP);
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, update, modPVP);
    }

    /**
     * 初始化并启动定时器
     */
    export function init():void {
        // timer.delay = 1000;
        // timer.repeatCount = 1;
        curWave = 1;
        isProduct = false;
        productRule();
        Common.addEventListener(GameEvents.EVT_PRODUCEMONSTER, onEnermyDead, modPVP);
    }

    /**
     * 开启或启动定时器
     */
    export function start():void {
        timer.start();
    }

    /**
     * 停止定时器
     */
    export function stop():void {
        timer.stop();
    }

    /**
     * 重置定时器
     */
    export function reset():void {
        timer.reset();
    }

    /**
     * 对象（战斗对象）回收
     */
    export function recycleObject():void {
        let heroCount = GameData.heros.length;
        let stakeCount = GameData.stakes.length;
        for (let i = 0; i < heroCount; i++) {
            let hero:Hero = GameData.heros[i];
            hero.removeComplete();
            hero.recycleSkill();
            // hero.stopDragonBonesArmature();
            if (hero && hero.parent && hero.parent.removeChild) hero.parent.removeChild(hero);
            GameObjectPool.push(GameData.heros[i]);
        }
        for (let i = 0; i < stakeCount; i++) {
            let stakes:Stakes = GameData.stakes[i];
            stakes.recycle();
            if (stakes && stakes.parent && stakes.parent.removeChild) {
                stakes.parent.removeChild(stakes);
            }
            ObjectPool.push(GameData.stakes[i]);
        }
        for (let i = 0; i < heroCount; i++) GameData.heros.pop();
        for (let i = 0; i < stakeCount; i++) GameData.stakes.pop();
        Common.removeEventListener(GameEvents.EVT_PRODUCEMONSTER, onEnermyDead, modPVP);
    }

    /**
     * 获取奖励的具体描述
     */
    export function detailReward():Array<string> {
        let rewardConf = ConfigManager.tcRankReward;
        let rank = rewardConf.rank;
        let strs:Array<string> = new Array();
        for (let i = 0; i < rank.length; i++) {
            let soul:number = rewardConf.reward[i].soul/10000;
            let exp:number = rewardConf.reward[i].exp/10000;
            let diamond:number = rewardConf.reward[i].diamond;
            let str:string = "  魂石"+soul+"W、"+"经验"+exp+"W、"+diamond+"钻石"
            let equipId:number = rewardConf.reward[i].equip.id;
            if (equipId > 0) {
                let star:number = rewardConf.reward[i].equip.star;
                let equip_data = TcManager.GetInstance().GetTcEquipData(equipId);
                let name:string = equip_data.name;
                str += "、"+star+"星"+name;
            }
            strs.push(str);
        }
        return strs;
    }

    /**
     * 获取当前排名的奖励
     */
    export function getCurReward(curRank:number) {
        let rewardConf = ConfigManager.tcRankReward;
        let rank = rewardConf.rank;
        if (curRank <= 3) return rewardConf.reward[curRank-1];
        else if (curRank >= rank[rank.length-1]) return rewardConf.reward[rank.length-1];
        for (let i = 3; i < rank.length-1; i++) {
            if (curRank >= rank[i][0] && curRank <= rank[i][1]) {
                return rewardConf.reward[i];
            }
        }
    }

    /**
     * 定时结束回调函数
     */
    function update():void{

    }

    /**
     * 定时时间到达监听
     */
    function onTimeUp():void {
        let len:number = GameData.stakes.length;
        for (let i = 0; i < GameData.stakes.length; i++) {
            GameData.stakes[i].clearObject();
            GameData.stakes[i].clearList();
            i --;
        }
        // getSurviveCount();
        curWave ++;
        // Common.log("时间到达---->", surviveCount, curWave, GameData.stakes.length);
        productRule();
    }

    /**
     * 计算木桩分别情况
     */
    function getEnermyDistribute(stage:number):void {
        
    }

    /**
     * 获取木桩的数量
     */
    function getSurviveCount():void{
        surviveCount = 0;
        let count:number = GameData.stakes.length;
        for (let i = 0; i < count; i++) {
            if (GameData.stakes[i].attr.hp > 0) surviveCount ++;
        }
    }

    /**
     * 木桩消失函数监听
     */
    function onEnermyDead():void {
        getSurviveCount();
        if (surviveCount <= 0) {
            timer.reset();
            curWave ++;
            // Common.log("全部死亡---->", surviveCount, curWave, GameData.stakes.length);
            productRule();
        }
    }

    /**
     * 生产木桩
     */
    function production(count:number):void{
        //每次生产的数量
        // Common.log("生产的个数----->", count);
        for (let i = 0; i < count; i++){
            SceneManager.pvpScene.createSingleStake();
        }
        isProduct = false;
    }

    /**
     * 刷新下一波
     */
    function updateNextWave():void {

    }

    /**
     * 木桩的刷新规则
     */
    function productRule():void{
        if (isProduct) return;
        isProduct = true;
        timer.start();
        if (curWave <= 5) {
            production(curWave);
        }else{
            let count:number = MathUtils.getRandom(2, 5);
            production(count);
        }
    }

    /**生产的木桩数量 */
    var productCount:number;
    /**存活的木桩数量 */
    var surviveCount:number;
    /**当前波数 */
    var curWave:number;
    /**定时器 */
    var timer:egret.Timer;
    /**是否正在生产 */
    var isProduct:boolean;
}