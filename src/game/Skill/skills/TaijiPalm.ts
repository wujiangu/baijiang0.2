/**
 * 八卦太极掌
 * 震开敌人并造成眩晕和伤害
 */
class TaijiPalm extends SkillBase {
    public constructor() {
        super();
        this.mask = Utils.createBitmap("battleComon.sevenInOut");
        this.mask.width = Common.SCREEN_W;
        this.mask.height = Common.SCREEN_H;
        this.mask.alpha = 0;
        SceneManager.curScene.addChild(this.mask);
        this.img_effect = Utils.createBitmap("battleComon.sunluban_skill01_01");
        this.img_effect.anchorOffsetX = this.img_effect.width/2;
        this.img_effect.anchorOffsetY = this.img_effect.height/2;
        this.img_effect.x = Common.SCREEN_W/2;
        this.img_effect.y = Common.SCREEN_H/2;
        this.img_effect.visible = false;
        
        this.img_bagua = Utils.createBitmap("battleComon.sunluban_skill01_02");
        this.img_bagua.anchorOffsetX = this.img_bagua.width/2;
        this.img_bagua.anchorOffsetY = this.img_bagua.height/2;
        this.img_bagua.x = Common.SCREEN_W/2;
        this.img_bagua.y = Common.SCREEN_H/2;
        this.img_bagua.visible = false;

        SceneManager.curScene.addChild(this.img_bagua);
        SceneManager.curScene.addChild(this.img_effect);

        this.skillData.skill_range = 150;
    }

    public init() {
        super.init();
        this.push_range = 100;
        this.cd = 30;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
        target.armature.visible = false;
        target.setInvincible(true);
        target.skillArmature.play(animation, 1);
    }

    public update(target:any) {
        this.img_effect.visible = true;
        this.img_bagua.visible = true;
        this.img_effect.scaleX = 0;
        this.img_effect.scaleY = 0;
        this.img_bagua.scaleX = 0;
        this.img_bagua.scaleY = 0;
        egret.Tween.get(this.img_bagua).to({scaleX:3.0, scaleY:3.0}, 400, egret.Ease.circIn).call(()=>{
            this.img_bagua.visible = false;
        });
        egret.Tween.get(this.img_effect).to({scaleX:1.0, scaleY:1.0}, 500, egret.Ease.quadOut).call(()=>{
            this.img_effect.visible = false;
        });
        Animations.fadeOut(this.mask, 500, null, ()=>{
            Animations.fadeIn(this.mask, 200);
        });
        target.setEnermy();
        let enermy = target.getEnermy();
        let damage:number = target.attr.skd;
        for (let i = 0; i < enermy.length; i++) {
            if (enermy[i].type == 1) {
                if (enermy[i]._isAvatar) enermy[i].gotoHurt(1, true);
                else{
                    if (!this.target.isPVP){
                        let dis = MathUtils.getDistance(target.x, target.y, enermy[i].x, enermy[i].y);
                        if (dis <= this.skillData.skill_range) {
                            let radian = MathUtils.getRadian2(target.x, target.y, enermy[i].x, enermy[i].y);
                            let dx = Math.cos(radian) * this.push_range;
                            let dy = Math.sin(radian) * this.push_range;
                            let changeX = enermy[i].x + dx;
                            let changeY = enermy[i].y + dy;
                            egret.Tween.get(enermy[i]).to({x:changeX, y:changeY}, 100).call(()=>{
                                enermy[i].gotoHurt(damage, true);
                            }, this);
                        }
                    }else{
                        enermy[i].gotoHurt(damage, true);
                    }
                }

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
    private img_bagua:egret.Bitmap;
    private mask:egret.Bitmap;
}