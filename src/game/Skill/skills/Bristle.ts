/**
 * 怒发冲冠(震开敌人，兵造成可持续伤害)
 */
class Bristle extends SkillBase {
    public constructor() {
        super();
    }

    public init() {
        super.init();
        this.buffIndex = 1;
        this.push_range = 200;
        this.cd = 5;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
        target.skillArmature.play(animation, 1);
    }

    public update(target:any) {
        target.setEnermy();
        let enermy = target.getEnermy();
        this.duration = target.attr.dur;
        this.damage = target.attr.skd;
        for (let i = 0; i < enermy.length; i++) {
            if (enermy[i]._isAvatar) enermy[i].gotoHurt(1, true);
            else{
                let buffConfig = modBuff.getBuff(3);
                if (!target.isPVP) enermy[i].removeActComplete();
                this.buff = ObjectPool.pop(buffConfig.className);
                buffConfig.duration = this.duration;
                buffConfig.damage = this.damage;
                this.buff.buffInit(buffConfig);
                switch (this.buffIndex) {
                    //烧伤
                    case 1:
                        //特效名字
                        this.buff.effectName = "Burning";
                        //作用点
                        this.buff.buffData.postionType = PostionType.PostionType_Body;
                    break;
                    //中毒
                    case 2:
                    break;
                }
                enermy[i].addBuff(this.buff);   
            }
        }
    }

    public end() {
        super.end();
        ObjectPool.push(this);
    }

    /**若有附加buff，设置buff的id */
    public setBuffId(value:number) {
        this.buffIndex = value;
    }

    private target:any;
    private buff:ContinuousInjury;
    private buffIndex:number;
    /**震开距离 */
    private push_range:number;
}