/**
 * 裂缝
 * 地面上产生裂缝，触碰受伤，5s消失
 */
class Crack extends BuffBase {
    public constructor() {
        super();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "Crack";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.id = options.id;
        this.buffData.cd = options.cd;
        this.buffData.duration = options.duration;
    }

    /**开始 */
    public buffStart(target:any) {
        this.target = target;
        this.getRandom();
    }

    /**结束 */
    public buffEnd() {
        
    }

    /**刷新数据 */
    public update(target:any, callBack:Function = null) {
        
    }

    /**增加特效 */
    public AddEffect(target:any) {
        // this.ShowEffect();
    }

    /**显示特效 */
    public ShowEffect() {
        // this.target.skillArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        // this.target.skillArmature.visible = false;
    }
    
    private onWallDisappear():void {
        this.target.specialArmature.pause("skill02");
        this.target.specialArmature.play("skill02", 1, 2, 11);
        SceneManager.battleScene.removeCollison(this);
        if (this.target.curState == "dead"){
            TimerManager.getInstance().remove(this.onWallDisappear, this);
        }else{
            TimerManager.getInstance().doTimer(this.buffData.cd*1000, 1, this.getRandom, this);
        }
    }

    /**
     * 筑墙
     */
    private buildCrack(x:number, y:number):void {
        Common.log("位置--->", this.target.x, this.target.y, x, y);
        this.target.specialArmature.visible = true;
        SceneManager.battleScene.otherLayer.addChild(this.target.specialArmature);
        this.target.specialArmature.x = x;
        this.target.specialArmature.y = y;
        this.x = x;
        this.y = y;
        this.type = 3;
        this.target.specialArmature.play("skill02", 1);
        SceneManager.battleScene.addCollison(this);
        TimerManager.getInstance().doTimer(this.buffData.duration*1000, 1, this.onWallDisappear, this);
    }

    private getRandom():void {
        let randomX:number = MathUtils.getRandom(-200, 200) + this.target.x;
        let randomY:number = MathUtils.getRandom(-200, 200) + this.target.y;
        let isBound:boolean = false;
        if (randomX <= 75) isBound = true;
        if (randomX >= Common.SCREEN_W - 75) isBound = true;
        if (randomY <= 75) isBound = true;
        if (randomY >= Common.SCREEN_H - 75) isBound = true;

        let distance:number = MathUtils.getDistance(this.target.x, this.target.y, randomX, randomY);
        if (distance >= 50 && distance <= 200 && !isBound) {
            this.buildCrack(randomX, randomY);
        }else{
            this.getRandom();
        }
    }
    /**回收buff类 */
    public recycleBuff() {
        super.recycleBuff();
        // TimerManager.getInstance().remove(this.onWallDisappear, this);
        TimerManager.getInstance().remove(this.getRandom, this);
    }
    private target:any;
    /**墙的类型 */
    public type:number;
    /**x坐标 */
    public x:number;
    /**y坐标 */
    public y:number;
    /****************区域****************/
    public minX:number;
    public maxX:number;
    public minY:number;
    public maxY:number;
}