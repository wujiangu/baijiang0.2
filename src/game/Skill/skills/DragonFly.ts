/**
 * 青龙腾飞斩
 * 
 */
class DragonFly extends SkillBase {
    public constructor() {
        super();
        this.mask = Utils.createBitmap("battleComon.sevenInOut");
        this.mask.width = Common.SCREEN_W;
        this.mask.height = Common.SCREEN_H;
        this.mask.alpha = 0;
        SceneManager.curScene.addChild(this.mask);
        this.img_effect = Utils.createBitmap("battleComon.guanyu_skill01_01");
        this.img_effect.anchorOffsetX = this.img_effect.width/2;
        this.img_effect.anchorOffsetY = this.img_effect.height/2;
        this.img_effect.x = Common.SCREEN_W/2;
        this.img_effect.y = Common.SCREEN_H/2;
        this.img_effect.visible = false;
        SceneManager.curScene.addChild(this.img_effect);

        this.img_dragon = Utils.createBitmap("battle_res.guanyu_skill01_02");
        this.img_dragon.anchorOffsetX = this.img_dragon.width/2;
        this.img_dragon.anchorOffsetY = this.img_dragon.height/2;
        this.img_dragon.x = Common.SCREEN_W/2;
        this.img_dragon.y = Common.SCREEN_H/2;
        this.img_dragon.visible = false;
        SceneManager.curScene.addChild(this.img_dragon);
        this.skillData.skill_range = 200;
    }

    public init() {
        super.init();
        this.cd = 30;
        // this.img_effect.alpha = 0;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
        target.armature.visible = false;
        target.setInvincible(true);
        target.skillArmature.play(animation, 1);
        target.skillArmature.visible = false;
    }

    public update(target:any) {
        this.img_effect.visible = true;
        Animations.stamp(this.img_effect, 200, 600, 5, 1, null, ()=>{
            this.img_dragon.visible = true;
            this.img_dragon.rotation = 0;
            this.img_dragon.alpha = 1.0;
            egret.Tween.get(this.img_dragon).to({rotation:-360, alpha:0}, 600, egret.Ease.cubicOut);
            Animations.fadeIn(this.mask, 600);
            target.setEnermy();
            let enermy = target.getEnermy();
            let damage:number = target.originAtk;
            for (let i = 0; i < enermy.length; i++) {
                if (enermy[i].type == 1) {
                    if (enermy[i]._isAvatar) enermy[i].gotoHurt(1, true);
                    else{
                        enermy[i].gotoHurt(damage, true);
                    }
                }
            }
        });
    }

    public end() {
        super.end();
        ObjectPool.push(this);
    }

    private target:any;
    private img_effect:egret.Bitmap;
    private img_dragon:egret.Bitmap;
    private mask:egret.Bitmap;
}