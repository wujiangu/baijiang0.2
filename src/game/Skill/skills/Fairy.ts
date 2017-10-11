/**
 * 仙法
 * 
 */
class Fairy extends SkillBase {
    public constructor() {
        super();
        this.mask = Utils.createBitmap("battleComon.sevenInOut");
        this.mask.width = Common.SCREEN_W;
        this.mask.height = Common.SCREEN_H;
        this.mask.alpha = 0;
        SceneManager.curScene.addChild(this.mask);
        this.img_effect = Utils.createBitmap("battleComon.menglingtong_skill01_04");
        this.img_effect.anchorOffsetX = this.img_effect.width/2;
        this.img_effect.anchorOffsetY = this.img_effect.height/2;
        this.img_effect.x = Common.SCREEN_W/2;
        this.img_effect.y = Common.SCREEN_H/2;
        this.img_effect.visible = false;
        SceneManager.curScene.addChild(this.img_effect);

        this.skillData.skill_range = 200;
    }

    public init() {
        super.init();
        this.cd = 5;
        // this.img_effect.alpha = 0;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
        
    }

    public update(target:any) {
        this.img_effect.visible = true;
        
    }

    public end() {
        super.end();
        ObjectPool.push(this);
    }

    private target:any;
    private img_effect:egret.Bitmap;
    private mask:egret.Bitmap;
}