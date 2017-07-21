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
            ObjectPool.push(GameData.heros[i]);
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
        }
        // for (let i = 0; i < len; i++) {
        //     if (GameData.stakes[i].hp )
        //     GameData.stakes.pop();
        // }
        curWave ++;
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
            if (GameData.stakes[i].hp > 0) surviveCount ++;
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
            productRule();
        }else{
            timer.start();
        }
    }

    /**
     * 生产木桩
     */
    function production(count:number):void{
        //每次生产的数量
        for (let i = 0; i < count; i++){
            SceneManager.pvpScene.createSingleStake();
            productCount ++;
        }
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
}