/**
 * 八卦太极掌
 * 震开敌人并造成眩晕和伤害
 */
class TaijiPalm extends SkillBase {
    public constructor() {
        super();
        this.img_effect = Utils.createBitmap("buClip1_png");
        this.img_effect.anchorOffsetX = this.img_effect.width/2;
        this.img_effect.anchorOffsetY = this.img_effect.height/2;
        this.img_effect.x = Common.SCREEN_W/2;
        this.img_effect.y = Common.SCREEN_H/2;
        this.img_effect.visible = false;
        SceneManager.curScene.addChild(this.img_effect);
    }

    public init() {
        super.init();
        this.push_range = 100;
        this.cd = 30;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
        target.setInvincible(true);
        target.skillArmature.play(animation, 1);
    }

    public update(target:any) {
        target.setEnermy();
        let enermy = target.getEnermy();
        for (let i = 0; i < enermy.length; i++) {
            let dis = MathUtils.getDistance(target.x, target.y, enermy[i].x, enermy[i].y);
            if (dis <= this.skillData.skill_range) {
                if (enermy[i].isSkillHurt) return;
                enermy[i].isSkillHurt = true;
                enermy[i].removeActComplete();
                let radian = MathUtils.getRadian2(target.x, target.y, enermy[i].x, enermy[i].y);
                let dx = Math.cos(radian) * this.push_range;
                let dy = Math.sin(radian) * this.push_range;
                let changeX = enermy[i].x + dx;
                let changeY = enermy[i].y + dy;
                egret.Tween.get(enermy[i]).to({x:changeX, y:changeY}, 100).call(()=>{
                    enermy[i].hp --;
                    if (enermy[i].hp <= 0) {
                        enermy[i].gotoDead();
                    }else{
                        this.buff = ObjectPool.pop("UnableMove");
                        //特效名字
                        this.buff.effectName = "skill01";
                        //id
                        this.buff.buffData.id = 2;
                        //持续时间
                        this.buff.buffData.duration = 3;
                        //作用点
                        this.buff.buffData.postionType = PostionType.PostionType_Head;
                        enermy[i].addBuff(this.buff);
                    }
                }, this);
            }
        }
    }

    public end() {
        super.end();
        ObjectPool.push(this);
    }

    private buff:UnableMove;
    private target:any;
    /**震开距离 */
    private push_range:number;
    private img_effect:egret.Bitmap;
}