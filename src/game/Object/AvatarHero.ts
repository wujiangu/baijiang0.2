/**
 * 自身镜像
 */
class AvatarHero extends Alliance {
    public constructor() {
        super();
    }

    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
        //受伤动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("daoguang_effect", "daoguang_effect", 8), [
            BaseGameObject.Action_Hurt
        ]);
        //出场动画
        this.effectArmature.register(DragonBonesFactory.getInstance().makeArmature("enter_monster_01", "enter_monster_01", 10.0), [
            BaseGameObject.Action_Enter
        ]);

        this.effectArmature.addCompleteCallFunc(this.effectArmaturePlayEnd, this);
        this.effectArmature.scaleX = 1.5;
        this.effectArmature.scaleY = 1.5;
    }

    public init(data:Array<any>, isPVP:boolean=false):void {
        super.init(data);
        this.attr = data[1];
        this.atk_timer.delay = this.attr.wsp * 1000;
        this.isPVP = isPVP;
        this.visible = true;
        this.gotoEnter();
    }

    /**
     * 攻击状态
     */
    public state_attack(time:number):void {
        //滑行结束
        if (Math.abs(this.sumDeltaX) > this.atk_rangeX || Math.abs(this.sumDeltaY) > this.atk_rangeY) {
            this.gotoRun();
            this.img_swordLight.visible = false;
            this.setInvincible(false);
            //怪物到中点的距离
            for (let i = 0; i < this.enermy.length; i++) {
                let radian = MathUtils.getRadian2(this.centerX, this.centerY, this.enermy[i].x, this.enermy[i].y);
                let dis = MathUtils.getDistance(this.centerX, this.centerY, this.enermy[i].x, this.enermy[i].y);
                let angle = Math.abs(this.atk_radian - radian);
                let dx = dis*Math.cos(angle);
                let dy = dis*Math.sin(angle);
                if ((Math.abs(dx) <= this.atk_range/2) && (Math.abs(dy) <= 40)) {
                    if(this.enermy[i].type == 1 && this.enermy[i].attr.hp > 0) {
                        this.setHurtValue(this.attr.atk);
                        if (this.isCrit()) this._hurtValue *= 1.5;
                        if (this.enermy[i] && this.enermy[i].gotoHurt) this.enermy[i].gotoHurt(this._hurtValue);
                    }
                }
            }
            return;
        }
        super.state_attack(time);
    }
    /**
     * 奔跑状态
     */
    public state_run(time:number):void {
        if (this.lockTarget[0]) {
            this.moveToTarget(this.lockTarget[0].x, this.lockTarget[0].y, ()=>{
                if (this.lockTarget[0].attr.hp <= 0){
                    this.lockEnermy();
                    this.lastAnimation = "";
                    this.curState = "run";
                }
                let useSpeed:number = this.speed * 0.1;
                this.radian = MathUtils.getRadian2(this.x, this.y, this.endX, this.endY);
                let animation = this.getWalkPosition("run", this.radian);
                this.reverse(this, this.radian);
                if (animation != this.lastAnimation) {
                    this.lastAnimation = animation;
                    this.armature.play(animation, 0, 1, 0, 2);
                }
                let tempX:number = Math.cos(this.radian) * useSpeed;
                let tempY:number = Math.sin(this.radian) * useSpeed;
                this.deltaX = parseFloat(tempX.toFixed(2));
                this.deltaY = parseFloat(tempY.toFixed(2));
                let gotoX = this.x + this.deltaX;
                let gotoY = this.y + this.deltaY;
                let isMove:boolean = this.isCollison(gotoX, gotoY);
                if (!isMove) return;
                this.x += this.deltaX;
                this.y += this.deltaY;
                this.x = parseFloat(this.x.toFixed(2));
                this.y = parseFloat(this.y.toFixed(2));
                let distance:number = MathUtils.getDistance(this.endX, this.endY, this.x, this.y);
                if (this.isComplete == true) {
                    if (distance <= this.atk_range) {
                        this.gotoAttack();
                    }
                }
            });
        }else{
            this.gotoIdle();
            this.lockEnermy();
            if (this.lockTarget[0]) {
                this.gotoRun();
            }
        }
    }

    /************************************状态函数******************************************/
    /**
     * 进入待机状态
     */
    public gotoIdle() {
        this.img_swordLight.visible = false;
        super.gotoIdle();
    }

    /**奔跑 */
    public gotoRun() {
        this.img_swordLight.visible = false;
        if (this.attr.hp <= 0) return;
        this.lastAnimation = "";
        this.curState = "run";
        this.lockEnermy();
    }

    public gotoAttack():void {
        this.img_swordLight.visible = false;
        if (this.attr.hp <= 0) return;
        if (!this.isComplete) return;
        this.setLiveEnermy();
        super.gotoAttack();
    }

    /**
     * 进场
     */
    public gotoEnter() {
        this.curState = BaseGameObject.Action_Enter;
        this.effectArmature.visible = true;
        this.effectArmature.y = 10;
        this.effectArmature.play(this.curState, 1);
        this.gotoIdle();
    }

    /**
     * 受伤
     */
    public gotoHurt(value:number = 1) {
        if (this.isInvincible) return;
        if (this.curState == BaseGameObject.Action_Hurt || this.curState == "attack") return;
        this.hurtHandler(value);
    }
    /**
     * 受伤处理
     */
    public hurtHandler(value:number):void {
        super.hurtHandler(value);
        if (this.isInvincible) return;
        this.curState = BaseGameObject.Action_Hurt;
        this.img_swordLight.visible = false;
        this.armature.play(this.curState, 0);
        this.effectArmature.play(BaseGameObject.Action_Hurt, 1);
        this.effectArmature.visible = true;
        this.effectArmature.x = -15;
        this.attr.hp -= value;
        this.setInvincible(true);
    }
    /************************************其他函数******************************************/
    /**锁定攻击对象 */
    private lockEnermy():void {
        this.setLiveEnermy();
        this.lockTarget = [];
        for (let i = 0; i < this.enermy.length; i++) {
            if (this.enermy[i].attr.hp > 0 && this.enermy[i].curState != "dead") {
                this.enermy[i]["dis"] = MathUtils.getDistance(this.x, this.y, this.enermy[i].x, this.enermy[i].y);
                this.lockTarget.push(this.enermy[i]);
            }
        }
        this.lockTarget.sort(function(a, b){
            return a.dis - b.dis;
        });
    }

    /**死亡处理 */
    public deadHandler():void {
        this.curState = "";
        let index:number = GameData.heros.indexOf(this);
        GameData.heros.splice(index, 1);
        ObjectPool.push(this);
        if (this && this.parent && this.parent.removeChild) this.parent.removeChild(this);
    }
    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        if (this.curState == BaseGameObject.Action_Enter) {
            this.effectArmature.visible = false;
            this.shadow.visible = true;
            this.canMove = true;
            this.gotoRun();
        }
        else if (this.curState == BaseGameObject.Action_Hurt) {
            this.effectArmature.visible = false;
            this.setInvincible(false);
        }
        if (this.attr.hp <= 0) {
            this.deadHandler();
        }else{
            this.gotoRun();
        }
    }

    /**
     * 移动到指定的位置
     * 
     */
    public moveToTarget(gotoX:number, gotoY:number, func:Function = null):void {
        super.moveToTarget(gotoX, gotoY, func);
        if (func != null) {
            func();
        }
    }

    /*************************************************************************************/
    /**锁定的敌人 */
    private lockTarget:Array<any>;
}