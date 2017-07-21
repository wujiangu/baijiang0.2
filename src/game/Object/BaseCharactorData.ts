/**
 * 人物/怪物的基本属性类
 */
class BaseCharactorData {
    //初始话英雄的属性
    public initHeroAttr(data) {
        this.name = GameData.curHero;
        this.initAttr(data);
        this.avo = data.avo;
        this.skd = data.skd;
        this.dur = data.dur;
    }

    /**
     * 初始化敌方的属性数值
     */
    public initEnermyAttr(data) {
        this.initAttr(data);
    }

    /**
     * 初始化属性数值
     */
    private initAttr(data) {
        this.lv = data.lv;
        this.hp = data.hp;
        this.def = data.def;
        this.res = data.res;
        this.atk = data.atk;
        this.wsp = data.wsp;
        this.crt = data.crt;
    }

    /**英雄的id */
    public id:number;
    /**等级 */
    public lv:number;
    /**英雄的名字 */
    public name:string;
    /**血量 */
    public hp:number;
    /**护甲 */
    public def:number;
    /**抗性 */
    public res:number;
    /**闪避 */
    public avo:number;
    /**攻击 */
    public atk:number;
    /**攻击速度 */
    public wsp:number;
    /**暴击 */
    public crt:number;
    /**移动速度 */
    public mov:number;
    /**技能冷却 */
    public cd:number;
    /**技能伤害 */
    public skd:number;
    /**技能持续时间 */
    public dur:number;
}