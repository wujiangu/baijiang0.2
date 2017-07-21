/**
 * 召唤
 */
class Summon extends SkillBase {
    public constructor() {
        super();
    }

    public init(target:any = null) {
        super.init();
        this.name = "Summon";
        TimerManager.getInstance().doTimer(13000, 0, this._onCall, this);
        this.target = target;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
    }

    public update(target:any=null) {
        // //每次生产的数量
        // let count:number = MathUtils.getRandom(1, 2);
        // for (let i = 0; i < count; i++){
        //     //敌人的类型索引
        //     let index:number = MathUtils.getRandom(2);
        //     //生产的敌人数据
        //     let data:Array<any> = this._summon[index];
        //     let monsterData = modBattle.setMonsterData(data[0], data[1]);
        //     SceneManager.battleScene.createSingleMonster(data, true);
        // }
        modBattle.summonEnermy();
    }

    public end() {
        super.end();
        ObjectPool.push(this);
        TimerManager.getInstance().remove(this._onCall, this);
    }

    /**
     * 召唤
     */
    public call():void {
        if (this.target.curState == "skill01" || this.target.curState == "attack") return;
        Common.log("召唤小兵");
        this.target.curState = "skill02";
        setTimeout(()=>{
            Animations.fadeOutIn(this.target.img_sigh, 200);
        }, 50);
        this.target.armature.play("skill02", 1);
    }


    private _onCall():void {
        if (this.target.hp <= 0) return;
        Common.log("开始召唤")
        this.call();
    }

    private target:any;
    private _summon:Array<any> = [
        [1, 1],
        [2, 1],
        [3, 1]
    ]
}