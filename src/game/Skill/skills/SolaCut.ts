/**
 * 暴怒空斩
 */
class SolaCut extends SkillBase {
    public constructor() {
        super();
        this.skillPoint = new egret.Point();
    }

    public init(target:any = null) {
        super.init();
        this.name = "SolaCut";
        TimerManager.getInstance().doTimer(5000, 0, this._release, this);
        this.target = target;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
    }

    public update(deltaX:number=null, deltaY:number=null) {
        this.target.skillArmature.x = this.target.skillArmature.x + deltaX;
        this.target.skillArmature.y = this.target.skillArmature.y + deltaY;
        //人物到技能的坐标
        let dx = 82 * Math.cos(this.target.radian+Math.PI/2);
        let dy = 82 * Math.sin(this.target.radian+Math.PI/2);
        //初始点的对角点
        this.skillPoint = this.target.skillArmature.localToGlobal();
        let beginX = this.skillPoint.x;
        let beginY = this.skillPoint.y;
        let x1;
        let y1;
        if (this.target.scaleX == -1) {
            x1 = beginX + this.target.skillArmature.width * Math.cos(this.target.radian) + dx;
            y1 = beginY + this.target.skillArmature.width * Math.sin(this.target.radian) + dy;
        }else{
            x1 = beginX + this.target.skillArmature.width * Math.cos(this.target.radian) - dx;
            y1 = beginY + this.target.skillArmature.width * Math.sin(this.target.radian) - dy;
        }
        let centerX = (beginX + x1)/2;
        let centerY = (beginY + y1)/2;
        let dis = MathUtils.getDistance(centerX, centerY, GameData.heros[0].x, GameData.heros[0].y);
        let tempRadian = MathUtils.getRadian2(centerX, centerY, GameData.heros[0].x, GameData.heros[0].y);
        let angle = Math.abs(tempRadian - this.target.radian);
        let deltax = dis*Math.cos(angle);
        let deltay = dis*Math.sin(angle);
        if ((Math.abs(deltax) <= 45) && (Math.abs(deltay) <= 43)) {
            if (!this.target.skill_atkStatus) {
                this.target.skill_atkStatus = true;
                GameData.heros[0].gotoHurt(this.target.attr.atk);
            }
        }
    }

    public end() {
        super.end();
        ObjectPool.push(this);
        TimerManager.getInstance().remove(this._release, this);
    }

    private _release():void {
        if (this.target.hp <= 0) return;
        if (this.target.curState == "attack") return;
        this.target.gotoSkill();
    }

    private target:any;
    /**技能的坐标 */
    private skillPoint:egret.Point;
}