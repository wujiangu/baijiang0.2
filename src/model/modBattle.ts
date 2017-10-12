/**
 * 战斗相关的逻辑模块
 */
namespace modBattle {
    /**
     * 创建一个刷新怪物的定时器
     */
    export function createTimer():void{
        timer = new egret.Timer(1000);
        timer.stop();
        timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, update, modBattle);
        maxEachWave = new Array();
    }

    /**
     * 初始化并启动定时器
     */
    export function init():void {
        timer.delay = 2000;
        timer.repeatCount = 1;
        productCount = 0;
        sumDead = 0;
        sumKill = 0;
        surviveCount = 0;
        exp = 0;
        soul = 0;
        isBoss = false;
        getEnermyDistribute(GameData.curStage);
        timer.start();
        // if (SceneManager.battleScene.guideStage == 2) timer.start();
        Common.addEventListener(GameEvents.EVT_PRODUCEMONSTER, onEnermyDead, modBattle);
    }

    export function addSumkill():void {
        sumKill ++;
    }

    export function getStage():any {
        return tcStage;
    }

    /**
     * 获取杀敌的总数
     */
    export function getSumkill():number {
        return sumKill;
    }

    /**
     * 魂石掉落
     */
    export function getSoulCount():number {
        let value:number = 0;
        let random:number = MathUtils.getRandom(1, 100);
        if (random <= 5) value = 5;
        else if (random > 5 && random <= 15) value = 4;
        else if (random > 15 && random <= 35) value = 3;
        else if (random > 35 && random <= 65) value = 2;
        else value = 1;
        return value;
    }

    /**设置经验 */
    export function setExp(value:number):void {
        exp += value;
    }

    /**设置魂石 */
    export function setSoul(value:number):void {
        soul += value;
    }

    /**获取经验 */
    export function getExp():number {
        return exp;
    }

    export function getSoul():number {
        return soul;
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
        let monsterCount = GameData.monsters.length;
        let bossCount = GameData.boss.length;
        recycleHero();
        recycleChests();
        for (let i = 0; i < monsterCount; i++) {
            let monster:Monster = GameData.monsters[i];
            monster.recycle();
            monster.removeComplete();
            if (monster && monster.parent && monster.parent.removeChild) {
                monster.parent.removeChild(monster);
            }                  
            ObjectPool.push(GameData.monsters[i]);
        }
        for (let i = 0; i < bossCount; i++) {
            let boss:Boss = GameData.boss[i];
            boss.recycle();
            boss.removeComplete();
            if (boss && boss.parent && boss.parent.removeChild) {
                boss.parent.removeChild(boss);
            }                  
            ObjectPool.push(GameData.boss[i]);
        }
        for (let i = 0; i < monsterCount; i++) GameData.monsters.pop();
        for (let i = 0; i < bossCount; i++) GameData.boss.pop();
        Common.removeEventListener(GameEvents.EVT_PRODUCEMONSTER, onEnermyDead, modBattle);
    }

    /**
     * 回收英雄
     */
    export function recycleHero() {
        let heroCount = GameData.heros.length;
        for (let i = 0; i < heroCount; i++) {
            let hero:Hero = GameData.heros[i];
            hero.removeComplete();
            hero.recycleSkill();
            // hero.stopDragonBonesArmature();
            if (hero && hero.parent && hero.parent.removeChild) hero.parent.removeChild(hero);
            ObjectPool.push(GameData.heros[i]);
        }
        for (let i = 0; i < heroCount; i++) GameData.heros.pop();
    }

    export function summonEnermy() {
        //每次生产的数量
        let count:number = MathUtils.getRandom(1, 2);
        let len:number = tcStage.monster.length - 1;
        for (let i = 0; i < count; i++){
            //敌人的类型索引
            let index:number = MathUtils.getRandom(len);
            //生产的敌人数据
            let id:number = tcStage.monster[index];
            let lv:number = tcStage.lv;
            let monsterData = setMonsterData(id, lv);
            SceneManager.battleScene.createSingleMonster(monsterData, false, true);
        }
    }

    /**
     * 获取敌人存活的数量
     */
    export function getSurviveCount():void{
        //地图上的敌人数量
        let count:number = GameData.monsters.length;
        let bossCount:number = GameData.boss.length;
        surviveCount = 0;
        for (let i = 0; i < count; i++) {
            if (GameData.monsters[i].attr.hp > 0) surviveCount ++;
        }
        for (let i = 0; i < bossCount; i++) {
            if (GameData.boss[i].attr.hp > 0) surviveCount ++;
        }
        // SceneManager.battleScene.battleSceneCom.update();
    }

    export function getEnermyData(id:number):any {
        let enermyConf:any;
        for (let j = 0; j < ConfigManager.enermyConfig.length; j++) {
            if (ConfigManager.enermyConfig[j].id == id) {
                enermyConf = ConfigManager.enermyConfig[j];
                break;
            }
        }
        return enermyConf;
    }

    /**
     * 设置小兵的配置数据
     */
    export function setMonsterData(id:number, lv:number, isBoss:boolean = false, k_hp:number = 1, k_atk:number = 1):any {
        let colorId:number = Math.ceil(GameData.curStage/5) % 4;
        if (colorId == 0) colorId = 4;
        let type:string = `monster${id}_${colorId}`;
        let data = Utils.cloneObj(getEnermyData(id));
        if (isBoss){
            type = `Boss0${id - 99}`;
            data["attr"] = Utils.cloneObj(ConfigManager.boss[id-100][lv-1]);
        }else{
            //精英怪带的buff个数
            let buffCount:number = MathUtils.getRandom(1, 2);
            let arrayBuff:Array<number> = [];
            //简单随机排序
            let originArray:Array<number> = [1, 2, 3, 4, 5, 6];
            originArray.sort(function(){ return 0.5 - Math.random(); });
            for (let i = 0; i < buffCount; i++) {
                arrayBuff.push(originArray[i]);
                // let id:number = 4;
                // arrayBuff.push(id);
            }
            data["attr"] = Utils.cloneObj(ConfigManager.monsters[id-1][lv-1]);
            data["arrayBuff"] = arrayBuff;
            data["isAvatar"] = false;
            data["direction"] = 0;
        }
        data["attr"].hp *= k_hp;
        data["attr"].atk *= k_atk;
        return [type, data];
    }

    /**
     * 获取当前章节的总小兵数
     */
    export function getCurChapterSum(curStage:number):number {
        let sum:number = 0;
        let baseNum:number = Math.ceil(curStage/5);
        let count:number = baseNum * 5;
        for (let i = count; i > count - 5; i--) {
            let tempCount = ConfigManager.tcStage[i-1].count;
            Common.log("tempCount--->", tempCount);
            sum += tempCount;
        }
        return sum;
    }

    /**
     * 回收宝箱
     */
    function recycleChests():void {
        let count = GameData.chests.length;
        for (let i = 0; i < count; i++) {
            let chest:Chest = GameData.chests[i];
            chest.recycle();
            if (chest && chest.parent && chest.parent.removeChild) chest.parent.removeChild(chest);
            ObjectPool.push(chest);
        }
        for (let i = 0; i < count; i++) GameData.chests.pop();
    }

    /**
     * 定时结束回调函数
     */
    function update():void{
        if (productCount < maxEachWave[curWave]) {
            production();
        }else{
            timer.reset();
        }
    }

    /**
     * 计算关卡的敌人分别情况
     */
    function getEnermyDistribute(stage:number):void {
        //关卡的数据
        tcStage = ConfigManager.tcStage[stage-1];
        //敌人的最大数量
        let maxCount:number = tcStage.count;
        //波数
        let waveCount:number = tcStage.wave;
        //敌方的配置
        maxEachWave = MathUtils.randomStage(maxCount, waveCount);
        // Common.log("敌方配置---->", maxEachWave);
        curWave = 0;

        //关卡背景
        let stageId:number = Math.ceil(GameData.curStage/5) % 3;
        if (stageId == 0) stageId = 3;
        SceneManager.battleScene.changeBg(stageId);
        curChapterSum = getCurChapterSum(stage);
        Common.log("当前章节总数----->", curChapterSum);
    }

    /**
     * 敌方死亡函数监听
     */
    function onEnermyDead(event:lcp.LEvent):void {
        let obj:any = event.param;
        getSurviveCount();
        if (obj.isSummon && surviveCount > 0) return;
        if (obj.isBoss && surviveCount > 0) return;
        if (obj.isElite) {
            SceneManager.battleScene.battleSceneCom.changeEliteIcon(GameData.curStage%5);
        }else{
            sumDead ++;
            if (sumDead <= curChapterSum){
                SceneManager.battleScene.battleSceneCom.update(sumDead, curChapterSum);
            }else{
                if (obj.isSummon && surviveCount == 0) sumDead = 0;
                if (obj.isBoss && surviveCount == 0) sumDead = 0;
                SceneManager.battleScene.battleSceneCom.update(sumDead, curChapterSum, true);
            }
        }
        timer.reset();
        productRule();
    }

    /**
     * 生产小兵
     */
    function production():void{
        //每次生产的数量
        let count:number = MathUtils.getRandom(1, 2);
        count = Math.min(count, maxEachWave[curWave]-productCount);
        let len:number = tcStage.monster.length - 1;
        for (let i = 0; i < count; i++){
            //敌人的类型索引
            // let index:number = MathUtils.getRandom(len);
            let index:number = getMonsterIndex(len);
            //生产的敌人数据
            let id:number = tcStage.monster[index];
            let lv:number = tcStage.lv;
            let monsterData = setMonsterData(id, lv);
            SceneManager.battleScene.createSingleMonster(monsterData);
            productCount ++;
        }
        getSurviveCount();
        timer.reset();
        productRule();
    }

    /**
     * 生产boss
     */
    function productBoss():void {
        // let index:number = MathUtils.getRandom(tcStage.boss.length-1);
        let data:Array<any> = tcStage.boss;
        let monsterData:any;
        if (data[0] < 100) {
            monsterData = setMonsterData(data[0], data[3], false, data[1], data[2]);
            SceneManager.battleScene.createSingleMonster(monsterData, true);
        }else{
            monsterData = setMonsterData(data[0], data[3], true, data[1], data[2]);
            SceneManager.battleScene.createBoss(monsterData);
        }
    }

    /**
     * 刷新下一波
     */
    function updateNextWave():void {
        if (isBoss) {
            if (surviveCount > 0) return;
            GameData.curStage ++;
            if (GameData.curStage > ConfigManager.tcStage.length) GameData.curStage = 1;
            HttpRequest.getInstance().send("POST", "userinfo", {stage:GameData.curStage});
            getEnermyDistribute(GameData.curStage);
            productCount = 0;
            // sumDead = 0;
            isBoss = false;
        }else{
            if (curWave == tcStage.wave - 1) {
                //刷新boss
                productBoss();
                isBoss = true;
            }else{
                productCount = 0;
                curWave ++;
            }
        }
    }

    /**
     * 敌人的刷新规则
     */
    function productRule():void{
        if (productCount >= maxEachWave[curWave] && surviveCount <= 0) {
            updateNextWave();
        }
        if (surviveCount == 0) {
            //没有敌人立即刷新
            timer.delay = 0;
        }
        else if (surviveCount >= 1 && surviveCount < 3) {
            //当（3＞场上怪物数量≥1）时，刷新间隔为0.5秒
            timer.delay = 500;
        }
        else if (surviveCount >= 3 && surviveCount < 6) {
            //当（6＞场上怪物数量≥3）时，刷新间隔为1秒
            timer.delay = 1000
        }
        else if (surviveCount >= 6 && surviveCount < 10) {
            //当（9≥场上怪物数量≥6）时，刷新间隔为2秒
            timer.delay = 2000;
        }
        else{
            //当（场上怪物数量＞9）时，刷新间隔为4秒
            timer.delay = 4000;
        }
        timer.repeatCount = 1;
        timer.start();
    }

    /**获取小怪的索引 */
    function getMonsterIndex(len:number):number {
        let arr:Array<number> = [];
        let index:number = 0;
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }
        let random:number = MathUtils.getRandom(1, 100);
        let seed:number = Math.ceil(GameData.curStage/20) * 10;
        if (random < seed) {
            index = 1;
        }else{
            arr.splice(1, 1);
            let temp:number = 0;
            if (arr.length > 1) temp = MathUtils.getRandom(arr.length);
            index = arr[temp];
        }
        // Common.log("当前关卡："+curWave, "随机："+random, "seed："+seed, "index："+index);
        return index;
    }

    /**存活的敌人数量 */
    export var surviveCount:number;
    /**生产的敌人数量 */
    var productCount:number;
    /**死亡的总数 */
    var sumDead:number;
    /**杀敌的总数 */
    var sumKill:number;
    /**关卡的配置数据 */
    var tcStage:any;
    /**每波敌方的最大数量 */
    var maxEachWave:Array<number>;
    /**当前的波数 */
    var curWave:number;
    /**当前章节的总数 */
    var curChapterSum:number;
    /**boss标记 */
    var isBoss:boolean;
    /**定时器 */
    var timer:egret.Timer;
    /**魂石掉落概率分布 */
    var soulProbabity:Array<number> = [5, 10, 20, 30, 35];
    /**经验数量 */
    var exp:number;
    /**魂石数量 */
    var soul:number;
}