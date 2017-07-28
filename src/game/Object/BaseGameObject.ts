/**
 * 人物的基本类
 */
class BaseGameObject extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.attr = new BaseCharactorData();
        this.armature = new DragonBonesArmatureContainer();
        this.effectArmature = new DragonBonesArmatureContainer();
        this.buffArmature = new DragonBonesArmatureContainer();
        this.skillArmature = new DragonBonesArmatureContainer();
        this.specialArmature = new DragonBonesArmatureContainer();
        this.addChild(this.specialArmature);
        this.addChild(this.armature);
        this.addChild(this.effectArmature);
        this.addChild(this.buffArmature);
        this.addChild(this.skillArmature);
        this.shadow = Utils.createBitmap("shadow_png");
        this.shadow.y = -this.shadow.height/2;
        this.shadow.scaleX = 1.5;
        this.shadow.anchorOffsetX = this.shadow.width/2;
        this.addChild(this.shadow);
        this.atk_timer = new egret.Timer(1000, 1);
        this.atk_timer.stop();
        this.atk_timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onAttack, this);
        this.hurtText = Utils.createBitmapText("hurtFnt_fnt", this);
        this.hurtText.x = -10;
    }

    public init(data:Array<any> = null) {
        TimerManager.getInstance().doFrame(1, 0, this.onFrame, this);
        this.isEnemy = true;
        this.speed = 3;
        this.hp = 0;
        this.originX = 0;
        this.originY = 0;
        this.deltaX = 0;
        this.deltaY = 0;
        this.radian = 0;
        this.sumDeltaX = 0;
        this.sumDeltaY = 0;
        this.canMove = true;
        this.isReverse = false;
        this.isComplete = true;
        this.curState = "";
    }

    /**设置控制状态 */
    public setCanMove(status:boolean):void {
        this.canMove = status;
    }
    /**设置无敌状态 */
    public setInvincible(status:boolean):void {
        this.isInvincible = status;
    }
    /**
     * 设置速度
     */
    public setSpeed(value:number):void {
        this.speed = value
    }
    /**
     * 获取移动速度
     */
    public getSpeed():number {
        return this.speed;
    }
    /**
     * 设置攻击范围
     */
    public setAttackRange(value:number):void {
        this.atk_range = value;
    }
    /**设置伤害数值 */
    public setHurtValue(value):void {
        this._hurtValue = value;
    }

    /**伤害数值 */
    public getHurtValue():number {
        return this._hurtValue;
    }
    /**
     * 帧执行函数
     */
    private onFrame(time:number):void {
        this.update(time);
    }

    /**
     * 获取当前的状态
     */
    public getCurState() {
        return this.curState;
    }

    /**障碍物判断 */
    public isCollison(gotoX:number, gotoY:number):boolean {
        let collison = SceneManager.battleScene.getCollison();
        let isMove:boolean = true;
        if (collison.length > 0) {
            for (let i = 0; i < collison.length; i++) {
                let minX:number = collison[i].minX;
                let maxX:number = collison[i].maxX;
                let minY:number = collison[i].minY;
                let maxY:number = collison[i].maxY;
                if (gotoX >= minX && gotoX <= maxX && gotoY >= minY && gotoY <= maxY) {
                    if (collison[i].type < 3) {
                        isMove = false;
                        break;
                    }
                    else if (collison[i].type == 3 && !this.isEnemy) {
                        let value:number = Math.floor(this.originHP * 0.1);
                        this.hurtHandler(value);
                    }
                }
            }
        }
        return isMove;
    }

    /**
     * update
     */
    public update(time:number):void {
        if (this.x < 50) this.x = 50;
        if (this.y < 50) this.y = 50;
        if (this.x > Common.SCREEN_W - 50) this.x = Common.SCREEN_W - 50;
        if (this.y > Common.SCREEN_H - 50) this.y = Common.SCREEN_H - 50;
        let func:string = "state_" + this.curState;
        if (this.curState && this[func]) {
            this[func](time);
        }
    }

    /**待机 */
    public gotoIdle() {
        this.armature.play(BaseGameObject.Action_Idle, 0);
    }

    /**
     * 移动到指定的位置
     */
    public moveToTarget(gotoX:number, gotoY:number, func:Function = null):void {
        this.endX = gotoX;
        this.endY = gotoY;
    }

    /**
     * 清除特效
     */
    public removeEffect(actionName:string):void{
        this.effectArmature.stop();
        this.effectArmature.parent.removeChild(this.effectArmature);
    }

    /**
     * 播放特效
     */
    public playEffect(actionName:string) {
        if (this.effectArmature.play(actionName, 1)) {
            this.addChild(this.effectArmature);
        }else{
            this.removeEffect(actionName);
        }
    }

    /**走路方向(怪物的攻击也可以使用这个) */
    public getWalkPosition(name:string, radian:number) {
        let posName:string;
        let pi:number = Math.PI;
        if ((radian >= -0.75*pi) && (radian < -pi/4)) {
            posName = name + "01";
        }
        else if ((radian >= -pi/4 && radian < pi/4) || (radian > -pi && radian < -0.75*pi) || (radian > 0.75*pi && radian < pi)) {
            posName = name + "02";
        }
        else if (radian >= pi/4 && radian < 0.75*pi) {
            posName = name + "03"
        }
        return posName;
    }

    /**攻击方向 */
    public getAttackPosition(radian:number) {
        let pos:any = {};
        let pi:number = Math.PI;
        if ((radian >= -0.625*pi) && (radian < -0.375*pi)) {
            pos["posName"] = BaseGameObject.Action_Attack01;
            pos["id"] = 0;
        }
        else if ((radian >= -0.375*pi && radian < -0.125*pi) || (radian >= -0.875*pi && radian < -0.625*pi)) {
            pos["posName"] = BaseGameObject.Action_Attack02;
            pos["id"] = 1;
        }
        else if ((radian >= -0.125*pi && radian < 0.125*pi) || (radian >= -pi && radian < -0.875*pi) || (radian >= 0.875*pi && radian <= pi)) {
            pos["posName"] = BaseGameObject.Action_Attack03;
            pos["id"] = 2;
        }
        else if ((radian >= 0.125*pi && radian < 0.375*pi) || (radian >= 0.625*pi && radian < 0.875*pi)) {
            pos["posName"] = BaseGameObject.Action_Attack04;
            pos["id"] = 3;
        }else{
            pos["posName"] = BaseGameObject.Action_Attack05;
            pos["id"] = 4;
        }
        return pos;
    }

    /**反向 */
    public reverse(target:any, radian:number):boolean {
        if ((radian > -Math.PI/2) && (radian < Math.PI/2)) {
            target.scaleX = 1;
            this.isReverse = false;
            return false;
        }else{
            target.scaleX = -1;
            this.isReverse = true;
            return true;
        }
    }

    /**检查是否应经存在buff */
    public isExistBuff(buff:any, isID:boolean = false):boolean {
        let status:boolean = false;
        if (isID) {
            for (let i = 0; i < this.buff.length; i++) {
                if (buff == this.buff[i].buffData.id) {
                    status = true;
                    break;
                }
            }
        }else{
            for (let i = 0; i < this.buff.length; i++) {
                if (buff.buffData.id == this.buff[i].buffData.id) {
                    status = true;
                    break;
                }
            }
        }
        return status;
    }

    /**
     * 受伤处理
     */
    public hurtHandler(value:number):void {

    }

    /**硬直计时器监听 */
    private onAttack():void {
        this.atk_timer.reset();
        Common.log("可以攻击")
        this.isComplete = true;
    }

    /**
     * 受伤表现
     */
    public hurtAnimate(value:number):void {
        this.addChild(this.hurtText);
        value = Math.floor(value);
        this.hurtText.text = `-${value.toString()}`;
        this.hurtText.anchorOffsetX = this.hurtText.width/2;
        this.hurtText.y = this.y;
        this.hurtText.x = this.x;
        SceneManager.battleScene.effectLayer.addChild(this.hurtText);
        Animations.hurtTips(this.hurtText);
    }

    public static Action_Enter:string = "enter";
    public static Action_Idle:string = "idle";
    public static Action_Attack01:string = "attack01";
    public static Action_Attack02:string = "attack02";
    public static Action_Attack03:string = "attack03";
    public static Action_Attack04:string = "attack04";
    public static Action_Attack05:string = "attack05";
    public static Action_Hurt:string = "hurt";

    /**是否无敌状态 */
    public isInvincible:boolean;
    /**伤害位图 */
    public hurtText:egret.BitmapText;
    public attr:BaseCharactorData;
    /**阴影 */
    public shadow:egret.Bitmap;
    /**当前人物运动状态 */
    public curState:string;
    /**上一次状态的动画 */
    public lastAnimation:string;
    /**是否反向 */
    public isReverse:boolean;
    /**攻击间隔计数器 */
    public atk_timer:egret.Timer;
    /**攻击cd结束标志 */
    public isComplete:boolean;
    /**初始位置 */
    public originX:number = 0;
    public originY:number = 0;
    /**移动过程中的位置增量 */
    public deltaX:number;
    public deltaY:number;
    /**攻击或者释放技能的弧度 */
    public radian:number;
    /**移动过程中的增加之和，用于判断释放移动完成 */
    public sumDeltaX:number;
    public sumDeltaY:number;
    /**攻击或技能伤害区域的中心点 */
    public centerX:number;
    public centerY:number;
    /**移动的终点 */
    public endX:number;
    public endY:number;
    public isEnemy:boolean;
    /**角色肢体动作的骨架 */
    public armature:DragonBonesArmatureContainer;
    /**角色身上带有的特效骨架，包括受伤和被动等 */
    public effectArmature:DragonBonesArmatureContainer;
    /**角色受到buff影响的骨架 */
    public buffArmature:DragonBonesArmatureContainer;
    /**角色释放主动技能的骨架 */
    public skillArmature:DragonBonesArmatureContainer;
    /**角色特殊效果的骨架 */
    public specialArmature:DragonBonesArmatureContainer;
    /***************************人物的基本属性************************/
    /**身上带的buff */
    public buff:any[];
    /**buff的特效组 */
    public buffEffect:any[];
    /**buff的id */
    public buffId:any[];
    /**攻击范围 */
    public atk_range:number;
    /**攻击范围X轴分量 */
    public atk_rangeX:number;
    /**攻击范围Y轴分量 */
    public atk_rangeY:number;
    /**攻击速度 */
    public atk_speed:number;
    /**是否受到控制 */
    public canMove:boolean;
    public speed:number;
    public hp:number;
    /**初始血量 */
    public originHP:number;
    /**对敌人的伤害值 */
    public _hurtValue:number;
}