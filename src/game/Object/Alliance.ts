/**
 * 我方人物
 */
class Alliance extends BaseGameObject {
    public constructor() {
        super();
    }

    public initDragonBonesArmature(name:string):void {
        this.armature.register(DragonBonesFactory.getInstance().makeArmature(name, name, 20.0), [
            BaseGameObject.Action_Enter,
            BaseGameObject.Action_Idle,
            BaseGameObject.Action_Hurt,
            BaseGameObject.Action_Attack01,
            BaseGameObject.Action_Attack02,
            BaseGameObject.Action_Attack03,
            BaseGameObject.Action_Attack04,
            BaseGameObject.Action_Attack05,
            Alliance.Action_Run01,
            Alliance.Action_Run02,
            Alliance.Action_Run03
        ]);
        this.createSwordLight();
        //buff动画
        this.buffArmature.register(DragonBonesFactory.getInstance().makeArmature("buff", "buff", 10), [
            "Burning",
            "xuanyun",
            "dongjie",
            "hpShield_01",
            "hpShield_02",
            "leidian",
            "speedup",
            "xue",
            "xuejia"
        ]);
        this.buffArmature.visible = false;
        this.buffArmature.scaleX = 1.5;
        this.buffArmature.scaleY = 1.5;
        this.armature.scaleX = 1.5;
        this.armature.scaleY = 1.5;
        this.img_swordLight.texture = RES.getRes(`${name}-pugong_png`);
    }

    public init(data:Array<any>):void {
        this.isInvincible = true;
        super.init(data);
        this.initDragonBonesArmature(data[0]);
        this.name = data[0];
        this.offset = [[1, -113], [77, -109], [121, -50], [75, 14], [0, 23]];
        // this.offset = [[2, -74], [49, -71], [79, -32], [50, 9], [0, 15]]
        this.speed = 40;
        this.atk_range = 200;
        this.atk_speed = 150;
        this.isEnemy = false;
        this.isPlay = false;
        this.enermy = [];
        this.lastAnimation = "";
        this.shadow.visible = false;
        this.effectArmature.visible = false;
        this._hurtValue = 0;
        this.canMove = false;
        this.isBuffLoop = false;
        this.buff = [];
    }

    public update(time:number):void {
        super.update(time);
    }

    /**
     * 奔跑状态
     */
    public state_run(time:number):void {
        
    }

    public state_attack(time:number):void {
        if (Math.abs(this.sumDeltaX)>this.atk_rangeX/3){
            this.img_swordLight.visible = true;
        }
        let gotoX = this.x + this.deltaX;
        let gotoY = this.y + this.deltaY;
        if (!this.isPVP) {
            let isMove:boolean = this.isCollison(gotoX, gotoY);
            if (!isMove) {
                let buffConfig = modBuff.getBuff(2);
                let extraBuff = ObjectPool.pop(buffConfig.className);
                extraBuff.buffInit(buffConfig);
                extraBuff.effectName = "xuanyun";
                extraBuff.buffData.id = buffConfig.id;
                extraBuff.buffData.duration = buffConfig.duration;
                extraBuff.buffData.postionType = PostionType.PostionType_Head;
                this.isBuffLoop = true;
                this.addBuff(extraBuff);
                this.armature.play(BaseGameObject.Action_Hurt, 0);
                this.img_swordLight.visible = false;
                return;
            }
        }
        if (!this.canMove){
            this.img_swordLight.visible = false;
            return;
        }
        this.x = Math.floor(gotoX);
        this.y = Math.floor(gotoY);
        this.sumDeltaX = this.sumDeltaX + this.deltaX;
        this.sumDeltaY = this.sumDeltaY + this.deltaY;
    }


    /************************************状态函数******************************************/
    /**
     * 受伤
     */
    public gotoHurt(value:number = 1) {
        if (this.isInvincible) return;
        //回避
        if (this.isDodge()) return;
    }

    /**攻击 */
    public gotoAttack() {
        this.isComplete = false;
        this.setInvincible(true);
        this.atk_timer.start();
        this.curState = "attack";
        // this.isAttack = true;
        let useSpeed = this.atk_speed * 0.1;
        this.sumDeltaX = 0;
        this.sumDeltaY = 0;
        this.originX = this.x;
        this.originY = this.y;
        /**攻击的弧度 */
        this.radian = MathUtils.getRadian2(this.originX, this.originY, this.endX, this.endY);
        let animation = this.getAttackPosition(this.radian);
        this.offsetIndex = animation["id"];

        //人物原来位置到剑端直线弧度
        let endX = this.endX + this.offset[this.offsetIndex][0];
        let endY = this.endY + this.offset[this.offsetIndex][1] + 33;
        if (this.reverse(this, this.radian)) {
            endX = this.endX - this.offset[this.offsetIndex][0];
        }
        this.atk_radian = MathUtils.getRadian2(this.originX, this.originY, endX, endY);
        let dis_atk:number = MathUtils.getDistance(this.originX, this.originY, this.endX, this.endY);
        if (dis_atk > this.atk_range) dis_atk = 200;
        else if (dis_atk <= 100) dis_atk = 100;
        this.img_swordLight.scaleX = dis_atk/280;
        //实际角度
        let trueAngle:number = Math.floor(MathUtils.getAngle(this.atk_radian));
        //剑尖角度
        let swordAngle:number = 45 * this.offsetIndex - 90;
        if (this.reverse(this, this.atk_radian)) {
            this.img_swordLight.scaleX = -dis_atk/280;
            trueAngle = Math.floor(-MathUtils.getAngle(this.atk_radian));
            swordAngle = 45 * this.offsetIndex + 90;
            if (trueAngle < 0) trueAngle += 360;
        }
        this.img_swordLight.rotation = swordAngle + ((trueAngle - swordAngle)/2.25);
        let dx = Math.cos(this.atk_radian) * dis_atk;
        let dy = Math.sin(this.atk_radian) * dis_atk;
        this.atk_rangeX = parseFloat(Math.abs(dx).toFixed(2));
        this.atk_rangeY = parseFloat(Math.abs(dy).toFixed(2));
        /**怪物的弧度 */
        this.centerX = Math.floor((2*this.originX + dx)/2);
        this.centerY = Math.floor((2*this.originY + dy)/2);

        let tempX = Math.cos(this.atk_radian) * useSpeed;
        let tempY = Math.sin(this.atk_radian) * useSpeed;
        this.deltaX = parseFloat(tempX.toFixed(2));
        this.deltaY = parseFloat(tempY.toFixed(2));
        this.img_swordLight.x = this.offset[this.offsetIndex][0];
        this.img_swordLight.y = this.offset[this.offsetIndex][1];
        this.armature.play(animation["posName"], 0);
    }

    /************************************其他函数******************************************/
    /**增加buff */
    public addBuff(buff:any, isTemp:boolean=false):void {
        if (this.isExistBuff(buff) && isTemp) return;
        if (this.isExistBuff(buff) && (buff.buffData.controlType == ControlType.YES) && (buff.buffData.superpositionType == SuperpositionType.SuperpositionType_None)) return;
        Common.log("增加buff----->", buff.buffData.className);
        this.buff.push(buff);
        buff.buffStart(this);
    }

    /**增加攻击对象队列 */
    public addVictim(target:any) {
        for (let i = 0; i < target.length; i++) {
            this.enermy.push(target[i]);
        }
    }

    public setLiveEnermy():void {
        this.enermy = [];
        this.addVictim(GameData.boss);
        this.addVictim(GameData.monsters);
    }

    /**设置buff循环 */
    public setBuffStatus(status:boolean):void {
        this.isBuffLoop = status;
    }

    /**
     * 获取敌人
     */
    public getEnermy():any {
        return this.enermy;
    }

    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        
    }

    /**
     * 是否暴击
     */
    public isCrit():boolean {
        let random = MathUtils.getRandom(1, 100);
        if (random <= this.attr.crt) return true;
        return false;
    }

    /**
     * 是否闪避
     */
    public isDodge():boolean {
        let random = MathUtils.getRandom(1, 100);
        if (random <= this.attr.avo) return true;
        return false;
    }

    /**
     * 创建剑光
     */
    public createSwordLight():void {
        this.img_swordLight = Utils.createBitmap("diaochan-pugong_png");
        this.img_swordLight.anchorOffsetX = this.img_swordLight.width;
        this.img_swordLight.anchorOffsetY = this.img_swordLight.height/2;
        this.img_swordLight.visible = false;
        this.addChild(this.img_swordLight);
    }

    /*************************************************************************************/

    /**动作 */
    public static Action_Run01:string = "run01";
    public static Action_Run02:string = "run02";
    public static Action_Run03:string = "run03";
    /**名字 */
    public name:string;
    /**剑光 */
    public img_swordLight:egret.Bitmap;
    /**剑光的偏移 */
    public offset:any[];
    public offsetIndex:number;
    /**是否正在运行跑步骨骼 */
    public isPlay:boolean;
    /**攻击到的敌人 */
    public enermy:Array<any>;
    /**攻击路径弧度 */
    public atk_radian:number;
    public isPVP:boolean;
    public isBuffLoop:boolean;
}