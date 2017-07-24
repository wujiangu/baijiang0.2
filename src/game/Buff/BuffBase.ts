/**
 * 技能基类
 */
class BuffBase {
    public constructor () {
        this.buffData = new BuffData();
    }

    public buffData:BuffData;

    /**初始化 */
    public buffInit(options:any = null) {
        this.buffData.id = 1;
        this.buffData.name = "";
        this.buffData.lv = 1;
        this.buffData.className = "";
        this.buffData.description = "";
        this.buffData.duration = 0;
        this.buffData.frequency = 0;
        this.buffData.probability = 100;
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.controlType = ControlType.NO;
    }

    /**开始 */
    public buffStart(target:any) {

    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(callBack:Function = null) {

    }

    /**增加特效 */
    public AddEffect(target:any) {

    }

    /**显示特效 */
    public ShowEffect() {

    }

    /**隐藏特效 */
    public HideEffect() {

    }

    /**回收buff类 */
    public recycleBuff() {
        Common.log("回收---->", this.buffData.className)
        ObjectPool.push(this);
    }

    /**获取天赋的数值 */
    public getTalentValue():number {
        let id:number = this.buffData.id;
        let talent = modTalent.getTestData(id-19);
        // let curPage:number = UserDataInfo.GetInstance().GetBasicData("curTalentPage") - 1;
        // let talent = modTalent.getData(curPage, id-19);
        let lv = talent[1];
        let index:number = modTalent.getIndexFromId(id-19);
        let value:number = ConfigManager.tcTalent[index].value[lv-1];
        return value;
    }

    public options:any;
    /**伤害 */
    public damage:number;

    /*****************特效相关*******************/
    public effectName:string;
}