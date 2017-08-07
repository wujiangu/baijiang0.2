/**
 * 怒发冲冠(震开敌人，兵造成可持续伤害)
 */
class Bristle extends SkillBase {
    public constructor() {
        super();
        this.img_effect = Utils.createBitmap("buClip1_png");
        this.img_effect.anchorOffsetX = this.img_effect.width/2;
        this.img_effect.anchorOffsetY = this.img_effect.height/2;
        this.img_effect.x = Common.SCREEN_W/2;
        this.img_effect.y = Common.SCREEN_H/2;

        var data = RES.getRes("buClip_json");
        var txtr = RES.getRes("buClip_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("buClip"));
        this._mc1.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        this._mc1.anchorOffsetX = this._mc1.width/2;
        this._mc1.anchorOffsetY = this._mc1.height/2;
        this._mc1.x = Common.SCREEN_W/2-7;
        this._mc1.y = Common.SCREEN_H/2-5;
        this._mc1.visible = false;
        this.img_effect.visible = false;
        SceneManager.curScene.addChild(this.img_effect);
        SceneManager.curScene.addChild(this._mc1);
    }

    public init() {
        super.init();
        this.buffIndex = 1;
        this.push_range = 200;
        this.cd = 300;
    }

    private onComplete(event:egret.MotionEvent) {
        this._mc1.visible = false;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        this.target = target;
        target.setInvincible(true);
        target.skillArmature.play(animation, 1);
        this.img_effect.visible = true;
        this.img_effect.scaleX = 0;
        this.img_effect.scaleY = 0;
        egret.setTimeout(()=>{
            egret.Tween.get(this.img_effect).to({scaleX:1.0, scaleY:1.0}, 300, egret.Ease.elasticOut).call(()=>{
                this.img_effect.visible = false;
                this._mc1.visible = true;
                this._mc1.gotoAndPlay(1, 1);
            });
        }, this, 400);
    }

    public update(target:any) {
        target.setEnermy();
        let enermy = target.getEnermy();
        this.duration = target.attr.dur;
        this.damage = target.attr.skd;
        for (let i = 0; i < enermy.length; i++) {
            if (enermy[i]._isAvatar) enermy[i].gotoHurt(1, true);
            else{
                let buffConfig = modBuff.getBuff(3);
                if (!target.isPVP) enermy[i].removeActComplete();
                this.buff = ObjectPool.pop(buffConfig.className);
                buffConfig.duration = this.duration;
                buffConfig.damage = this.damage;
                this.buff.buffInit(buffConfig);
                switch (this.buffIndex) {
                    //烧伤
                    case 1:
                        //特效名字
                        this.buff.effectName = "Burning";
                        //作用点
                        this.buff.buffData.postionType = PostionType.PostionType_Body;
                    break;
                    //中毒
                    case 2:
                    break;
                }
                enermy[i].addBuff(this.buff);   
            }
        }
    }

    public end() {
        super.end();
        ObjectPool.push(this);
    }

    /**若有附加buff，设置buff的id */
    public setBuffId(value:number) {
        this.buffIndex = value;
    }

    private target:any;
    private buff:ContinuousInjury;
    private buffIndex:number;
    /**震开距离 */
    private push_range:number;
    /** */
    private img_effect:egret.Bitmap;
    /**动画数据 */
    private _mc1:egret.MovieClip;
}