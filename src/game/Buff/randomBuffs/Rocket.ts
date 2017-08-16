/**
 * 火箭
 */
class Rocket extends BaseRandomItem {
    public constructor() {
        super();
        this.icon = Utils.createBitmap("randomBuffIcon_json.buff_lei");
        this.icon.anchorOffsetX = this.icon.width/2;
        this.icon.anchorOffsetY = this.icon.height/2;
        this.createTextGroup("buff_fumiandi", "buff_010");
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
            // SceneManager.battleScene.effectLayer.addChild(ball);
            this.lightBalls.push(ball);
        }
        this.object = new Array();
    }

    public init(target:any):void {
        super.init();
        this.target = target;
        for (let i = 0; i < 3; i++) {
            this.lightBalls[i].visible = false;
        }
        this.isFly = false;
        this.isAction = true;
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        super.update(target, callBack);
    }

    /**增加特效 */
    public AddEffect(target:any) {
        super.AddEffect(target, ()=>{
            this.object = [];
            GameData.heros[0].setLiveEnermy();
            let enermy:Array<any> = GameData.heros[0].getEnermy();
            for (let i = 0; i < enermy.length; i++) {
                if (enermy[i].attr.hp > 0) {
                    enermy[i]["dis"] = MathUtils.getDistance(this.icon.x, this.icon.y, enermy[i].x, enermy[i].y);
                    this.object.push(enermy[i]);
                }
            }
            this.object.sort(function(a, b){
                return a.dis - b.dis;
            });
            modBattle.getSurviveCount();
            this.ballCount = modBattle.surviveCount;
            if (this.ballCount >= 3) this.ballCount = 3;
            for (let i = 0; i < this.ballCount; i++) {
                this.lightBalls[i].visible = true;
                this.lightBalls[i].play("skill03_01", 0);
                this.lightBalls[i].x = this.icon.x;
                this.lightBalls[i].y = this.icon.y;
                this.lightBalls[i]["isHurt"] = false;
                SceneManager.battleScene.effectLayer.addChild(this.lightBalls[i]);
                // object[i].setAttackTarget(true);
                // object[i].setTrackTarget(this.lightBalls[i]);
            }
            this.isFly = true;
            this.count = 0;
            TimerManager.getInstance().doFrame(1, 0, this.action, this);
        });
    }

    public action():void {
        if (this.isFly) {
            for (let i = 0; i < this.ballCount; i++) {
                this.beTrack(i);
            }
        }
    }

    public beTrack(id:number):void {
        if (this.lightBalls[id]["isHurt"]) return;
        let tempRadian = MathUtils.getRadian2(this.lightBalls[id].x, this.lightBalls[id].y, this.object[id].x, this.object[id].y);
        let deltax = Math.cos(tempRadian) * 10;
        let deltay = Math.sin(tempRadian) * 10;
        this.lightBalls[id].x += deltax;
        this.lightBalls[id].y += deltay;
        var dis = MathUtils.getDistance(this.lightBalls[id].x, this.lightBalls[id].y, this.object[id].x, this.object[id].y);
        if (dis < 10) {
            // this.setAttackTarget(false);
            this.object[id].gotoHurt(GameData.heros[0].attr.atk * 0.5, true);
            this.lightBalls[id].play("skill03_02", 1);
            egret.setTimeout(()=>{
                this.lightBalls[id].visible = false;
                this.lightBalls[id]["isHurt"] = true;
                if (this.lightBalls[id] && this.lightBalls[id].parent){
                    this.lightBalls[id].parent.removeChild(this.lightBalls[id]);
                    this.count ++;
                    if (this.count == this.ballCount) {
                        this.recycle();
                        this.isFly = false;
                        TimerManager.getInstance().remove(this.action, this);
                        SceneManager.battleScene.battleSceneCom.removeBuffIcon(this.iconName);
                    }
                }
            }, this, 100);
        }
    }

    /**电球 */
    private lightBalls:Array<DragonBonesArmatureContainer>;
    /**运行状态 */
    private isFly:boolean;
    /** */
    private count:number;
    /**选中的敌人 */
    private object:Array<any>;
    /**球的数量 */
    private ballCount:number;
}