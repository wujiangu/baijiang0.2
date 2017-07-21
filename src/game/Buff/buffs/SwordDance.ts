/**
 * 剑舞
 * 受到伤害时对周围的敌人造成伤害
 */
class SwordDance extends BuffBase {
    public constructor() {
        super();
        // this.buffInit();
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "SwordDance";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_DeBuff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.postionType = PostionType.PostionType_Body;
        this.buffData.cd = options.cd;
        this.buffData.id = options.id;
        this.effectName = "skill02";
        this.isTimeOut = true;
    }

    /**开始 */
    public buffStart(target:any) {
        // this.setPassiveEffect();
        this.AddEffect(target);
        // let duration = this.buffData.cd * 1000;
        // TimerManager.getInstance().doTimer(duration, 0, this.buffEnd, this);
    }

    /**
     * 被动技能的特效
     */
    private setPassiveEffect():void {
        this.passiveLight = [];
        this.passiveOffset = [[40,50,-90], [-40,-35,90], [-40,50,0]];
        this.passiveDelta = [[4,0], [-4,0], [0,4]]
        for (let i = 0; i < 3; i++) {
            this.passiveLight[i] = Utils.createBitmap("swordDance_png");
            this.passiveLight[i].scaleX = 1.5;
            this.passiveLight[i].scaleY = 1.5;
            this.passiveLight[i].visible = false;
            SceneManager.battleScene.effectLayer.addChild(this.passiveLight[i])
        }
    }

    /**结束 */
    public buffEnd() {
        this.isTimeOut = true;
        let newBuff = ObjectPool.pop(this.buffData.className);
        newBuff.buffInit(this.options);
        this.target.addBuff(newBuff);
        // this.target.playMultiBuff();
        TimerManager.getInstance().remove(this.buffEnd, this);
        // this.target.setPassiveRelease();
        // this.passiveSumDeltaX = [];
        // this.passiveSumDeltaY = [];
        // for (let i = 0; i < 3; i++) {
        //     this.passiveLight[i].visible = true;
        //     this.passiveLight[i].x = this.target.x + this.passiveOffset[i][0];
        //     this.passiveLight[i].y = this.target.y + this.passiveOffset[i][1];
        //     this.passiveLight[i].rotation = this.passiveOffset[i][2];
        //     this.passiveSumDeltaX[i] = 0;
        //     this.passiveSumDeltaY[i] = 0;
        // }
    }

    /**刷新数据 */
    public update() {
        //发射3个光(弃用)
        // for (let i = 0; i < 3; i++) {
        //     if (Math.abs(this.passiveSumDeltaX[i]) > 150 || Math.abs(this.passiveSumDeltaY[i]) > 150) {
        //         this.target.passiveRelease = false;
        //         this.passiveLight[i].visible = false;
        //     }
        //     this.passiveLight[i].x = this.passiveLight[i].x + this.passiveDelta[i][0];
        //     this.passiveLight[i].y = this.passiveLight[i].y + this.passiveDelta[i][1];
        //     let radian = 0;
        //     let centX = this.passiveLight[i].x + 50;
        //     let centY = this.passiveLight[i].y + this.passiveLight[i].height/2;
        //     switch (this.passiveLight[i].rotation) {
        //         case -90:
        //         radian = -Math.PI/2;
        //         centX = this.passiveLight[i].x + this.passiveLight[i].height/2;
        //         centY = this.passiveLight[i].y - 50;
        //         break;
        //         case 90:
        //         radian = Math.PI/2;
        //         centX = this.passiveLight[i].x - this.passiveLight[i].height/2;
        //         centY = this.passiveLight[i].y + 50;
        //         break;
        //     }
        //     this.passiveSumDeltaX[i] = this.passiveSumDeltaX[i] + this.passiveDelta[i][0];
        //     this.passiveSumDeltaY[i] = this.passiveSumDeltaY[i] + this.passiveDelta[i][1];
        //     this.target.setEnermy();
        //     for (let i = 0; i < this.target.enermy.length; i++) {
        //         let dis = MathUtils.getDistance(centX, centY, this.target.enermy[i].x, this.target.enermy[i].y);
        //         let tempRadian = MathUtils.getRadian2(centX, centY, this.target.enermy[i].x, this.target.enermy[i].y);
        //         let deltax = dis*Math.cos(tempRadian + radian);
        //         let deltay = dis*Math.sin(tempRadian + radian);
        //         if ((Math.abs(deltax) <= 65) && (Math.abs(deltay) <= 8)) {
        //             this.target.enermy[i].gotoHurt();
        //         }
        //     }
        // }
        if (this.isTimeOut) {
            this.isTimeOut = false;
            this.ShowEffect();
            this.target.skillArmature.play(this.effectName, 1, 1, 0, 2);
            this.position(this.target.skillArmature);
            let index = this.target.buff.indexOf(this);
            this.target.buff.splice(index, 1);
            ObjectPool.push(this);
            let duration = this.buffData.cd * 1000;
            TimerManager.getInstance().doTimer(duration, 0, this.buffEnd, this);
            this.target.setEnermy();
            let enermy = this.target.getEnermy();
            for (let i = 0; i < enermy.length; i++) {
                let dis = MathUtils.getDistance(this.target.x, this.target.y, enermy[i].x, enermy[i].y);
                if (dis <= 150) {
                    let value:number = this.target.attr.atk * 0.5;
                    enermy[i].gotoHurt(value);
                }
            }
        }
    }

    /**动画播放完成监听 */
    private armaturePlayEnd():void {
    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
    }

    /**作用点 */
    private position(target:any):void {
        switch (this.buffData.postionType) {
            case PostionType.PostionType_Foot:
                target.x = 0;
                target.y = 0;
            break;
            case PostionType.PostionType_Head:
                target.x = 0;
                target.y = -90;
            break;
            case PostionType.PostionType_Body:
                target.x = 0;
                target.y = 0;
            break;
        }
    }

    /**显示特效 */
    public ShowEffect() {
        this.target.skillArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        this.target.skillArmature.visible = false;
    }

    private isTimeOut:boolean;
    private target:any;
    private passiveOffset:any[];
    private passiveLight:egret.Bitmap[];
    private passiveDelta:any[];
    private passiveSumDeltaX:any[];
    private passiveSumDeltaY:any[];
}