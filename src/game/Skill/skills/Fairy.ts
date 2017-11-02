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
        this.mask.visible = false;
        SceneManager.curScene.addChild(this.mask);
        this.img_effect = Utils.createBitmap("battleComon.menglingtong_skill01_04");
        this.img_effect.anchorOffsetX = this.img_effect.width/2;
        this.img_effect.anchorOffsetY = this.img_effect.height/2;
        this.img_effect.x = Common.SCREEN_W/2;
        this.img_effect.y = Common.SCREEN_H/2;
        this.img_effect.visible = false;
        SceneManager.curScene.addChild(this.img_effect);

        this.skillData.skill_range = 200;
        this.mirrors = new Array();
    }

    public init() {
        super.init();
        this.cd = 30;
        // this.img_effect.alpha = 0;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
        target.setInvincible(true);
        this.mask.visible = true;
        this.img_effect.visible = true;
        Animations.fadeIn(this.mask, 800);
        Animations.stamp(this.img_effect, 200, 600, 5, 1, null, ()=>{
            this.target.skillEndHandle();
            if (this.mirrors.length > 0) this.disappear();
            let name:string = this.target.name;
            let attr = Utils.cloneObj(this.target.attr);
            attr["atk"] = Math.floor(attr["atk"]*0.5);
            for (let i = 0; i < 2; i++) {
                let mirror = SceneManager.curScene.createMirror([name, attr], this.target.isPVP);
                this.mirrors.push(mirror);
            }
            this.target.visible = true;
            TimerManager.getInstance().doTimer(10000, 1, this.disappear, this);
        });
    }

    /**
     * 镜像消失
     */
    private disappear():void {
        for (let i = 0; i < this.mirrors.length; i++) {
            Common.log(i, this.mirrors[i]);
            this.mirrors[i].gotoIdle();
            this.mirrors[i].curState = "";
            let index:number = GameData.heros.indexOf(this.mirrors[i]);
            GameData.heros.splice(index, 1);
            GameObjectPool.push(this.mirrors[i]);
            if (this.mirrors[i] && this.mirrors[i].parent && this.mirrors[i].parent.removeChild) {
                this.mirrors[i].parent.removeChild(this.mirrors[i]);
                this.mirrors.splice(i, 1);
                i -- ;
            }
        }
        TimerManager.getInstance().remove(this.disappear, this);
    }

    public update(target:any) {

    }

    public end() {
        super.end();
        ObjectPool.push(this);
    }

    private target:any;
    private img_effect:egret.Bitmap;
    private mask:egret.Bitmap;
    private mirrors:Array<AvatarHero>;
}