/**
 * 持续性伤害(包括流血、中毒、烧伤等)
 * 
 */
class ContinuousInjury extends BuffBase {
    public constructor() {
        super();
        this.bloodTips = Utils.createBitmapText("hurtFnt_fnt");
    }

    /**初始化 */
    public buffInit(options:any) {
        super.buffInit();
        this.options = options;
        this.buffData.className = "ContinuousInjury";
        this.buffData.superpositionType = SuperpositionType.SuperpositionType_None;
        this.buffData.buffType = BuffType.BuffType_Buff;
        this.buffData.disperseType = DisperseType.DisperseType_NoClear;
        this.buffData.controlType = ControlType.NO;
        this.buffData.id = options.id;
        this.buffData.duration = options.duration;
        this.damage = options.damage;
    }

    /**开始 */
    public buffStart(target:any) {
        if (!target.isPVP) target.gotoRun();
        this.AddEffect(target);
        TimerManager.getInstance().doTimer(1000, this.buffData.duration, this.update, this, this.buffEnd, this);
    }

    /**持续过程 */
    public buffEnd() {
        if (!this.target.isPVP) this.target.isSkillHurt = false;
        this.HideEffect();
        let index = this.target.buff.indexOf(this.buffData.id);
        this.target.buff.splice(index, 1);
        ObjectPool.push(this);
        TimerManager.getInstance().removeComplete(this.buffEnd, this);
    }

    /**扣血特效 */
    public bloodEffect() {
        this.target.addChild(this.bloodTips);
        this.bloodTips.text = `-${this.damage.toString()}`;
        this.bloodTips.alpha = 0;
        this.bloodTips.anchorOffsetX = this.bloodTips.width/2;
        this.bloodTips.y = this.target.y;
        this.bloodTips.x = this.target.x;
        SceneManager.curScene.effectLayer.addChild(this.bloodTips);

        var callBack = function() {
            if (this.target.isPVP) {
                SceneManager.pvpScene.updateValue(this.damage);
            }else{
                this.target.attr.hp -= this.damage;
                if (this.target.attr.hp <= 0){
                    TimerManager.getInstance().remove(this.update, this);
                    this.target.gotoDead();
                    this.target.updateKillCount();
                }
            }
        }.bind(this);
        Animations.hurtTips(this.bloodTips, 50, callBack);
    }

    /**刷新数据 */
    public update() {
        if (this.target.attr.hp > 0) {
            if (!this.target.isPVP && this.target.curState != "xuli"){
                this.target.gotoRun();
            }
            this.bloodEffect();
        }
    }

    /**增加特效 */
    public AddEffect(target:any) {
        this.target = target;
        this.ShowEffect();
        target.buffArmature.play(this.effectName, 0);
        switch (this.buffData.postionType) {
            case PostionType.PostionType_Foot:
                target.buffArmature.x = 0;
                target.buffArmature.y = 0;
            break;
            case PostionType.PostionType_Head:
                target.buffArmature.x = 0;
                target.buffArmature.y = -90;
            break;
            case PostionType.PostionType_Body:
                target.buffArmature.x = 0;
                target.buffArmature.y = -50;
                if (target.isPVP){
                     target.buffArmature.x = target.width/2 - 25;
                     target.buffArmature.y = target.height/2 - 50;
                }
            break;
        }
    }

    /**显示特效 */
    public ShowEffect() {
        this.target.buffArmature.visible = true;
    }

    /**隐藏特效 */
    public HideEffect() {
        this.target.buffArmature.visible = false;
    }

    /**回收buff类 */
    public recycleBuff() {
        TimerManager.getInstance().remove(this.update, this);
        TimerManager.getInstance().removeComplete(this.buffEnd, this);
        super.recycleBuff();
    }

    private target:any;
    private bloodTips:egret.BitmapText;
}