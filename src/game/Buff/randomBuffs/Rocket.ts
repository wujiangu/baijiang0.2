/**
 * 火箭
 */
class Rocket extends BaseRandomItem {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_lei");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.lightBalls = new Array();
        for (let i = 0; i < 3; i++) {
            let ball:DragonBonesArmatureContainer = new DragonBonesArmatureContainer();
            ball.register(DragonBonesFactory.getInstance().makeArmature("buffdiaoluo", "buffdiaoluo", 20), [
                "skill03_01",
                "skill03_02"
            ]);
            ball.scaleX = 1.5;
            ball.scaleY = 1.5;
            ball.visible = false;
            SceneManager.battleScene.effectLayer.addChild(ball);
            this.lightBalls.push(ball);
        }
    }

    public init(target:any):void {
        super.init();
        this.target = target;
        for (let i = 0; i < 3; i++) {
            this.lightBalls[i].visible = false;
        }
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        super.update(target, callBack);
    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target, ()=>{
            let object:Array<any> = new Array();
            GameData.heros[0].setEnermy();
            let enermy:Array<any> = GameData.heros[0].getEnermy();
            for (let i = 0; i < enermy.length; i++) {
                if (enermy[i].type == 1 && enermy[i].attr.hp > 0) {
                    enermy[i]["dis"] = MathUtils.getDistance(this.icon.x, this.icon.y, enermy[i].x, enermy[i].y);
                    object.push(enermy[i]);
                }
            }
            object.sort(function(a, b){
                return a.dis - b.dis;
            });
            modBattle.getSurviveCount();
            let count:number = modBattle.surviveCount;
            if (count >= 3) count = 3;
            for (let i = 0; i < count; i++) {
                this.lightBalls[i].visible = true;
                this.lightBalls[i].play("skill03_01", 0);
                this.lightBalls[i].x = this.icon.x;
                this.lightBalls[i].y = this.icon.y;
                object[i].setAttackTarget(true);
                object[i].setTrackTarget(this.lightBalls[i]);
            }

        });
    }

    /**电球 */
    private lightBalls:Array<DragonBonesArmatureContainer>;
}