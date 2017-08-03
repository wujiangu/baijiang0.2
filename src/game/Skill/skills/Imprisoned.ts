/**
 * 禁锢技能(导致人物无法行动，包括禁锢、眩晕、冰冻等)
 */
class Imprisoned extends SkillBase {
    public constructor() {
        super();
        this._createGroup();
        this._effectGroup.alpha = 0;
        var data = RES.getRes("diaoClip_json");
        var txtr = RES.getRes("diaoClip_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        this._mc1 = new egret.MovieClip(mcFactory.generateMovieClipData("diaoClip"));
        this._mc1.anchorOffsetX = this._mc1.width/2;
        this._mc1.anchorOffsetY = this._mc1.height/2;
        this._mc1.x = Common.SCREEN_W/2;
        this._mc1.y = Common.SCREEN_H/2;
        this._mc1.visible = false;
        SceneManager.curScene.addChild(this._mc1);
    }

    public init() {
        super.init();
        this.buffIndex = 1;
        this.cd = 5;
    }

    public start(animation:string, target:any) {
        super.start(animation, target);
        target.armature.play(BaseGameObject.Action_Idle, 0);
        target.setInvincible(true);
        target.skillArmature.play(animation, 1, 1, 0, 2);
    }

    public update(target:any) {
        target.setEnermy();
        let enermy = target.getEnermy();
        this._effectGroup.alpha = 1;
        this._effectFunc();
        this.duration = target.attr.dur;
        this._mc1.visible = true;
        this._mc1.gotoAndPlay(1, 1);
        egret.Tween.get(this._effectGroup).to({alpha:0}, this.duration*1000).call(()=>{
            this._mc1.visible = false;
        });
        if (target.isPVP) return;
        for (let i = 0; i < enermy.length; i++) {
            if (enermy[i].isSkillHurt) return;
            enermy[i].isSkillHurt = true;
            enermy[i].removeActComplete();
            let buffCofig = modBuff.getBuff(1);
            this.buff = ObjectPool.pop(buffCofig.className);
            buffCofig.duration = this.duration;
            this.buff.buffInit(buffCofig);
            switch (this.buffIndex) {
                //禁锢
                case 1:
                    //特效名字
                    this.buff.effectName = "skill01";
                    //作用点
                    this.buff.buffData.postionType = PostionType.PostionType_Foot;
                break;
                //眩晕
                case 2:
                break;
            }
            enermy[i].addBuff(this.buff);
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

    /**
     * 技能附带的其他特效
     */
    private _additionEffect():void {
        
    }

    /**
     * 创建特效组
     */
    private _createGroup():void {
        this._effectGroup = new egret.DisplayObjectContainer();
        SceneManager.curScene.addChild(this._effectGroup);
        let mask:egret.Bitmap = Utils.createBitmap("imprisoned02_png");
        mask.width = Common.SCREEN_W;
        mask.height = Common.SCREEN_H;
        this._effectGroup.addChild(mask);

        let topImage:egret.Bitmap = Utils.createBitmap("imprisoned01_png");
        topImage.scaleX = 2;
        topImage.scaleY = 2;
        this._effectGroup.addChild(topImage);

        let bottomImage:egret.Bitmap = Utils.createBitmap("imprisoned01_png");
        bottomImage.scaleX = 2;
        bottomImage.scaleY = -2;
        bottomImage.y = Common.SCREEN_H;
        this._effectGroup.addChild(bottomImage);

        let rightImage:egret.Bitmap = Utils.createBitmap("imprisoned01_png");
        rightImage.rotation = 90;
        rightImage.x = Common.SCREEN_W;
        this._effectGroup.addChild(rightImage);

        let leftImage:egret.Bitmap = Utils.createBitmap("imprisoned01_png");
        leftImage.rotation = -90;
        leftImage.y = Common.SCREEN_H;
        this._effectGroup.addChild(leftImage);

        this._effectFunc = function() {
            topImage.y = -50;
            bottomImage.y =  Common.SCREEN_H + 50;
            rightImage.x = Common.SCREEN_W + 50;
            leftImage.x = -50;
            egret.Tween.get(topImage).to({y:0}, 100, egret.Ease.quintOut);
            egret.Tween.get(bottomImage).to({y:Common.SCREEN_H}, 100, egret.Ease.quintOut);
            egret.Tween.get(rightImage).to({x:Common.SCREEN_W}, 100, egret.Ease.quintOut);
            egret.Tween.get(leftImage).to({x:0}, 100, egret.Ease.quintOut);
        }
    }

    private buff:UnableMove;
    private buffIndex:number;

    private _effectGroup:egret.DisplayObjectContainer;

    private _effectFunc:Function;

    /**动画数据 */
    private _mc1:egret.MovieClip;
}