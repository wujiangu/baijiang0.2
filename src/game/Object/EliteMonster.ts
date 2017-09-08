/**
 * 精英怪
 */
class EliteMonster extends Monster {
    public constructor() {
        super();
        this.img_halo = Utils.createBitmap("battleComon.Elitemonster000");
        this.img_halo.scaleX = 1.5;
        this.img_halo.scaleY = 1.5;
        this.img_halo.x = -30;
        this.img_halo.y = -96;
        this.addChild(this.img_halo);
        this.img_type = new Array();
        for (let i = 0; i < 3; i++) {
            let img_type = Utils.createBitmap("battleComon.Elitemonster001");
            img_type.y = -100;
            this.addChild(img_type);
            img_type.visible = false;
            this.img_type.push(img_type);
        }

        this.arrayBuffs = new Array();
        // this.createSpecialArmature();
    }

    /**
     * 初始化龙骨动画
     */
    public initDragonBonesArmature(name:string):void {
        super.initDragonBonesArmature(name);
        this.img_halo.visible = true;
        // this.img_type.visible = true;
        this.armature.visible = true;
        this.specialArmature.visible = false;
        this.visible = true;
        this.alpha = 1.0;
    }

    /**
     * 初始化数据
     */
    public init(data:Array<any>, isElite:boolean = false, isSummon:boolean = false) {
        super.init(data, isElite, isSummon);
        this.arrayBuffs = data[1].arrayBuff;
        this._type = data[0];
        this._data = Utils.cloneObj(data[1]);
        this._groupIndex = 0;
        this.isFaster = false;
        if (this._isAvatar && this.direction) {
            this.specialArmature.visible = true;
            if (this.direction == 1) {
                egret.Tween.get(this).to({x:this.x-100}, 50);
            }else{
                this.scaleX = -1;
                egret.Tween.get(this).to({x:this.x+100}, 50);
            }
        }else{
            this.addChild(this.specialArmature);
            this.specialArmature.x = 0;
            this.specialArmature.y = 0;
        }
        for (let i = 0; i < this.arrayBuffs.length; i++) {
            let Image:string = `battleComon.Elitemonster00${this.arrayBuffs[i]}`;
            this.img_type[i].x = -5 * (this.arrayBuffs.length - 1) + 10 * i;
            this.img_type[i].visible = true;
            this.img_type[i].texture = RES.getRes(Image);
        }
    }

    public setGroupIndex():void {
        this._groupIndex ++;
    }

    public update(time:number):void {
        super.update(time);
    }

    /**
     * 待机状态
     */
    public state_idle(time:number):void {
        super.state_idle(time);
    }

    /**死亡状态 */
    public state_dead(time:number):void {
        super.state_dead(time);
    }

    /**
     * 走路巡逻状态
     */
    public state_run(time:number):void {
        if (this._isAvatar) super.state_run(time);
        else{
            super.state_run(time, this.setFasterEffect);
            let distance:number = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, this.x, this.y);
            if (distance < 250 && this.curState == "run") {
                for (let i = 0; i < this.buff.length; i++) {
                    if (this.buff[i].buffData.id == 53) {
                        this.buff[i].begin();
                        break;
                    }
                }
            }
        }
    }

    /**
     * 收到攻击状态
     */
    public state_hurt(time:number):void {
        super.state_hurt(time);
    }

    /**攻击状态 */
    public state_attack(time:number):void {
        super.state_attack(time);
    }

    /**
     * 进场
     */
    public gotoEnter() {
        super.gotoEnter();
    }

    /**奔跑 */
    public gotoRun() {
        super.gotoRun();
        for (let i = 0; i < this.buff.length; i++) {
            if (this.buff[i].buffData.id == 55) {
                this._fasterBuff = this.buff[i];
                break;
            }
        }
    }

    /**
     * 技能
     */
    public gotoSkill() {
        super.gotoSkill();
    }

    /**攻击 */
    public gotoAttack() {
        super.gotoAttack();
        // if (this.isFaster) this.setFasterEffect(this.radian);
    }

    /**受到攻击 */
    public gotoHurt(hurtValue:number = 1, isSkillHurt:boolean = false) {
        if (this._isAvatar) {
            if (this.curState == Enermy.Action_Dead) return;
            this.armature.play("hurt", 0);
            this.curState = Enermy.Action_Dead;
            this.attr.hp = 0;
            Animations.fadeIn(this, 500, ()=>{
                this.disappear();
            });
            let enermy = GameData.heros[0].getEnermy();
            for (let i = 0; i < enermy.length; i++) {
                if (enermy[i].type == 1) {
                    let buff = enermy[i].buff;
                    for (let i = 0; i < buff.length; i++) {
                        if (buff[i].buffData.id == 54) {
                            buff[i].startTimer();
                            break;
                        }
                    }
                }
            }
            if (!isSkillHurt) {
                let buffConfig = modBuff.getBuff(2);
                let extraBuff = ObjectPool.pop(buffConfig.className);
                extraBuff.buffInit(buffConfig);
                extraBuff.effectName = "xuanyun";
                extraBuff.buffData.id = buffConfig.id;
                extraBuff.buffData.duration = buffConfig.duration;
                extraBuff.buffData.postionType = PostionType.PostionType_Head;
                GameData.heros[0].addBuff(extraBuff);
            }
        }else{
            if (modBuff.isBlind(GameData.heros[0])) return;
            this.removeAvatar();
            super.gotoHurt(hurtValue, isSkillHurt);
            if (this.isFaster) this._fasterBuff.HideEffect();
        }
    }

    /**增加buff */
    public addBuff(buff:any, isBind:boolean = false) {
        super.addBuff(buff, isBind);
    }

    /**蓄力 */
    public gotoReady() {
        super.gotoReady();
        if (this.isFaster) this._fasterBuff.HideEffect();
    }

    /**死亡 */
    public gotoDead() {
        super.gotoDead();
        for (let i = 0; i < this.buff.length; i++) {
            if (this.buff[i].buffData.id == 56) {
                this.armature.visible = false;
                this.buff[i].update();
            }
            else if(this.buff[i].buffData.id == 54) {
                this.buff[i].removeTimer();
            }
        }
        this.removeAvatar();
        this.img_halo.visible = false;
        for (let i = 0; i < this.arrayBuffs.length; i++) this.img_type[i].visible = false;
        // this.img_type.visible = false;
        if (this.isFaster) this.specialArmature.visible = false;
    }

    /**消失 */
    public disappear():void {
        super.disappear();
    }

    /**
     * 帧事件处理函数
     */
    public armatureFrame(event:any):void {
        super.armatureFrame(event);
    }

    /**
     * 特效动画播放完成函数
     */
    public effectArmaturePlayEnd():void {
        super.effectArmaturePlayEnd();
    }

    public skillArmatureFrame(event:dragonBones.FrameEvent):void {
        super.skillArmatureFrame(event);
    }

    /**
     * 动画播放完成函数
     */
    public armaturePlayEnd():void {
        super.armaturePlayEnd();
    }

    public specialArmatureFrame(event:dragonBones.FrameEvent):void {
        let evt:string = event.frameLabel;
        switch (evt) {
            case "buildEnd1":
                this.specialArmature.pause("skill01_01");
            break;
            case "buildEnd2":
                this.specialArmature.pause("skill01_02");
            break;
            case "End":
                this.specialArmature.play("skill02", 1, 2, 6);
            break;
            case "impact":
                let distance:number = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, this.x, this.y);
                if (distance <= 200 ) {
                    let buffConfig = modBuff.getBuff(2);
                    let extraBuff = ObjectPool.pop(buffConfig.className);
                    extraBuff.buffInit(buffConfig);
                    extraBuff.effectName = "xuanyun";
                    extraBuff.buffData.id = buffConfig.id;
                    extraBuff.buffData.duration = buffConfig.duration;
                    extraBuff.buffData.postionType = PostionType.PostionType_Head;
                    GameData.heros[0].addBuff(extraBuff);
                    GameData.heros[0].hurtHandler(this.attr.atk);
                }
            break;
            case "split":
                if (this.attr.hp <= 0) return;
                egret.Tween.get(this).to({x:this.x-100}, 50).call(()=>{
                    this.setInvincible(false);
                    this.setCanMove(true);
                    this.gotoRun();
                });
                this.createAvatar();
                GameData.monsters.push(this._avatar);
                this._avatar.init([this._type, this._data]);
                SceneManager.battleScene.battleLayer.addChild(this._avatar);
            break;
            case "blowup":
                let dis:number = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, this.x, this.y);
                if (dis <= 100) {
                    let hurt:number = this.attr.atk * 2;
                    GameData.heros[0].hurtHandler(hurt);
                }
            break;
        }
        
    }

    /**
     * 创建分身
     */
    public createAvatar():void {
        this._avatar = ObjectPool.pop("EliteMonster");
        this._avatar.x = this.x;
        this._avatar.y = this.y;
        this._avatar.alpha = 1.0;
        this._avatar.visible = true;
        this._avatar.anchorOffsetY = -50;
        this._data["isAvatar"] = true;
    }

    /**
     * 分裂
     */
    public splite():void {
        if (this.attr.hp <= 0) return;
        let avatarPos = MathUtils.getRandom(1, 2);
        if (avatarPos == 1) {
            this.scaleX = -1;
            egret.Tween.get(this).to({x:this.x+100}, 50).call(()=>{
                this.afterSplite();
            });
        }else{
            egret.Tween.get(this).to({x:this.x-100}, 50).call(()=>{
                this.afterSplite();
            });
        }
        this.createAvatar();
        this._data["direction"] = avatarPos;
        GameData.monsters.push(this._avatar);
        this._avatar.init([this._type, this._data]);
        SceneManager.battleScene.battleLayer.addChild(this._avatar);
    }

    private afterSplite():void {
        this.setInvincible(false);
        this.setCanMove(true);
        this.gotoRun();
    }

    /**
     * 自爆
     */
    public blew():void {
        let dis:number = MathUtils.getDistance(GameData.heros[0].x, GameData.heros[0].y, this.x, this.y);
        if (dis <= 100) {
            let hurt:number = this.attr.atk * 2;
            GameData.heros[0].hurtHandler(hurt);
        }
    }

    /**
     * 清除分身
     */
    public removeAvatar():void {
        GameData.heros[0].setEnermy();
        let enermy = GameData.heros[0].getEnermy();
        for (let i = 0; i < enermy.length; i++) {
            if (enermy[i].type == 1 && enermy[i]._isAvatar) {
                enermy[i].gotoHurt(1, true);
            }
        }
    }

    public specialArmaturePlayEnd():void {
        if (!this.isFaster) this._fasterBuff.HideEffect();
    }

    /**
     * 停止动画
     */
    public removeComplete():void {
        super.removeComplete();
    }

    /**
     * 停止人物动作动画
     */
    public removeActComplete():void {
        super.removeActComplete();
    }

    public addEffectComplete() {
        super.addEffectComplete();
    }

    /**停止特效动画 */
    public removeEffectComplete():void {
        super.removeEffectComplete();
    }
    /**快速移动的特效 */
    private setFasterEffect = function(radian:number):void {
        // this.specialArmature.visible = true;
        let specialAnimate = this.getWalkPosition("skill05_", radian);
        let num:number = parseInt(specialAnimate.charAt(9));
        this._fasterBuff.releaseBegin(num);
    }.bind(this);

    private _type:string;
    private _data:any;
    private _avatar:EliteMonster;
    private _groupIndex:number;
    private _fasterBuff:Faster;
    /*************************图片************************/
    /**精英怪的标志图 */
    private img_halo:egret.Bitmap;
    /**精英怪的类型标志图 */
    private img_type:Array<egret.Bitmap>;
}