/**
 * 加载配置文件管理
 */
namespace ConfigManager {
    /**关卡配置文件 */
    export var tcStage:any;
    /**英雄数据配置文件 */
    export var heroConfig:any;
    /**敌方配置文件 */
    export var enermyConfig:any;
    /**buff配置文件 */
    export var buffConfig:any;
    /**貂蝉属性配置 */
    export var diaochanAttr:any;
    /**不小曼属性配置 */
    export var buxiaomanAttr:any;
    /**赵云属性配置 */
    export var zhaoyunAttr:any;
    /**孙鲁班属性配置 */
    export var sunlubanAttr:any;
    /**关羽属性配置 */
    export var guanyuAttr:any;
    /**梦凌统属性配置 */
    export var menglingtongAttr:any;
    /**小兵的属性配置 */
    export var monsters:Array<any> = new Array();
    /**boss的属性配置 */
    export var boss:Array<any> = new Array();

    /**装备配置文件 */
    export var tcEquip:any;
    /**英雄描述配置文件 */
    export var tcHero:any;
    /**英雄升级消耗 */
    export var tcHeroUp:any;
    /**技能配置文件 */
    export var tcSkill:any;
    /**天赋配置文件 */
    export var tcTalent:any;
    /**天赋消耗配置文件 */
    export var tcTalentUp:any;
    /**能量点获取配置文件 */
    export var tcPower:any;
    /**解锁天赋页配置文件 */
    export var tcUnlockTalentPage:any;
    /**竞技场奖励配置文件 */
    export var tcRankReward:any;
    /**骨架数据(后续分组) */
    // export var armatures:Array<string> = ["diaochan", "zhaoyun", "buxiaoman", "sunluban", "guanyu", "menglingtong",
    //     "enter_monster_01", "blood_die", "monster2_1", "monster02_skill", "monster1_1", "daoguang_effect", "diaochan_skill",
    //     "zhaoyun_skill", "buxiaoman_skill", "sunluban_skill", "guanyu_skill", "menglingtong_skill", "buff",
    //     "buffdiaoluo", "monster1_2", "monster1_3", "monster1_4", "monster2_2", "monster2_3", "monster2_4", "monster3_1",
    //     "monster3_2", "monster3_3", "monster3_4", "Boss01", "Boss01_effect01"];
    export var armatures:Array<string> = ["diaochan", "zhaoyun", "buxiaoman", "sunluban", "guanyu", "menglingtong",
        "enter_monster_01", "blood_die", "monster2_1", "monster02_skill", "monster1_1", "daoguang_effect", "buff",
        "buffdiaoluo", "monster1_2", "monster1_3", "monster1_4", "monster2_2", "monster2_3", "monster2_4", "monster3_1",
        "monster3_2", "monster3_3", "monster3_4", "Boss01", "Boss01_effect01"];
    /**
     * 加载配置文件
     */
    export function loadConfig() {
        tcStage = RES.getRes("TcStage_json");
        heroConfig = RES.getRes("heroConfig_json");
        enermyConfig = RES.getRes("enermyConfig_json");
        buffConfig = RES.getRes("buffConfig_json");

        tcEquip = RES.getRes("TcEquip_json");
        tcHero = RES.getRes("TcHero_json");
        tcHeroUp = RES.getRes("TcHeroUp_json");
        tcSkill = RES.getRes("TcSkill_json");
        tcTalent = RES.getRes("TcTalent_json");
        tcTalentUp = RES.getRes("TcTalentUp_json");
        tcUnlockTalentPage = RES.getRes("TcUnlockTalentPage_json");
        tcRankReward = RES.getRes("TcRankReward_json");
        tcPower = RES.getRes("TcPower_json");
        loadHeroConfig();
    }

    /** init battle config */
    export function InitBattleConfig(scene:string):void{
        if(scene == "ready"){
            initBattleDragonBones(0, 7);
            loadEnermyConfig();
        }
        else if(scene == "battleGroup")
        {
            if (!b_armatures) {
                initBattleDragonBones(6, 11);
                InitBattleCommon();
                b_armatures = true;
            }
        }
        else if (scene == "pvpGroup") {
            if (!p_armatures) {
                InitBattleCommon();
                p_armatures = true;
            }
        }
        else if (scene == "battleBack") {
            initBattleDragonBones(14, armatures.length);
        }
    }

    var isCommon:boolean = false;
    /**初始化战斗共同配置 */
    function InitBattleCommon():void {
        if (!isCommon) {
            initBattleDragonBones(11, 14);
            isCommon = true
        }
    }

    /**加载英雄的配置文件 */
    function loadHeroConfig() {
        diaochanAttr = RES.getRes("TcChanAttr_json");
        buxiaomanAttr = RES.getRes("TcManAttr_json");
        zhaoyunAttr = RES.getRes("TcYunAttr_json");
        sunlubanAttr = RES.getRes("TcSunAttr_json");
        guanyuAttr = RES.getRes("TcGuanAttr_json");
        menglingtongAttr = RES.getRes("TcMengAttr_json");
    }

    /**加载敌方的配置文件(暂定) */
    function loadEnermyConfig() {
        //小兵
        for (let i = 1; i <= 3; i++) {
            let file:string = `TcMonster0${i}_json`;
            let data:any = RES.getRes(file);
            monsters.push(data);
        }
        //boss
        for (let i = 1; i <= 1; i++) {
            let file:string = `TcBoss0${i}_json`;
            let data:any = RES.getRes(file);
            boss.push(data);
        }
    }

    export function isInArmatures(name:string):boolean {
        let status:boolean = false;
        for (let i = 0; i < armatures.length; i++) {
            if (armatures[i] == name) {
                status = true;
                break;
            }
        }
        return status;
    }

    /**
     * 初始化骨骼的动画数据
     */
    function initBattleDragonBones(startIndex:number, endIndex:number):void {
         for(let i:number = startIndex; i < endIndex; i++){
            let name:string = armatures[i];
            let skeletonData = RES.getRes(name+"_ske_dbbin");
            let textureData = RES.getRes(name+"_tex_json");
            let texture = RES.getRes(name+"_tex_png");
            DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture);
        }
    }

    /**battle armatures status */
    var b_armatures:boolean = false;
    /**pvp armatures status */
    var p_armatures:boolean = false;
}