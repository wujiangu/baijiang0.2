/**
 * 持续性伤害(包括流血、中毒、烧伤等)
 * 
 */
class ContinuousInjury extends BuffBase {
    public constructor() {
        super();
        // this.buffInit();
        this.bloodTips = new egret.TextField();
        this.bloodTips.size = 24;
        this.bloodTips.textColor = Common.TextColors.red;
        this.bloodTips.stroke  = 2;
        this.bloodTips.bold = true;
        this.bloodTips.textAlign = egret.HorizontalAlign.CENTER;
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
        // if (this.target.scaleX == -1) this.bloodTips.scaleX = -1;
        this.target.addChild(this.bloodTips);
        this.bloodTips.text = `-${this.damage}`;
        this.bloodTips.alpha = 0;
        this.bloodTips.x = this.target.x;
        // this.bloodTips.y = this.target.buffArmature.y + this.target.y;
        this.bloodTips.y = this.target.y;
        SceneManager.battleScene.effectLayer.addChild(this.bloodTips);
        var step2:Function = function(){
            this.target.attr.hp -= this.damage;
            if (this.target.attr.hp <= 0){
                TimerManager.getInstance().remove(this.update, this);
                this.target.gotoDead();
            }
        };
        var step1:Function = function(){
            egret.Tween.get(this.bloodTips).to({alpha:0}, 400).call(step2, this);   
        };
        egret.Tween.get(this.bloodTips).to({y:this.target.y - 50,alpha:1}, 400, egret.Ease.backOut).call(step1, this);
    }

    /**刷新数据 */
    public update() {
        if (this.target.attr.hp > 0) {
            if (!this.target.isPVP && this.target.curState != "xuli01"){
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

    private target:any;
    private bloodTips:egret.TextField;
}