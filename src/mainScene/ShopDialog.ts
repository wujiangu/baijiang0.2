/**
 * 商城
 */
class ShopDialog extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/shopSkin.exml";
        this.tcShop = RES.getRes("TcShop_json");
        ShopDialog.instance = this;
    }

    protected createChildren(): void{
        this.stack_shop.selectedIndex = 0;
        this.btn_soul.selected = true;
        this.cards = new Array();
    }

    protected childrenCreated(): void{
        RES.loadGroup("shopback");
        HttpRequest.getInstance().send("GET", "order", {}, (result)=>{
            let isFirst:boolean = true;
            if (result.order.length > 0) {
                for (let i = 0; i < result.order.length; i++) {
                    if (result.order[i].status == "s") {
                        isFirst = false;
                        break;
                    }
                }
            }
            this.createContent(this.scrollDiamond, this.tcShop.diamond, "diamond", isFirst);
        }, this);
        this.createContent(this.scrollReward, this.tcShop.packs, "packs");
        this.createContent(this.scrollHero, this.tcShop.heros, "heros");
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);

        this.btn_soul.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_equip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_reward.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_hero.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);

        this.btn_back.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);

        this.btn_free.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_oneDraw.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_tenDraw.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);

        this.btn_top = [this.btn_soul, this.btn_equip, this.btn_reward, this.btn_hero];
    }

    public onPurchaseData(event:egret.Event):void{
        this.show_label_text();
    }

    public Init():void{
        this.show_label_text();
        egret.log("免费次数---->", UserDataInfo.GetInstance().GetBasicData("freeCount"));
        if (UserDataInfo.GetInstance().GetBasicData("freeCount") == 0) {
            this.btn_free.visible = true;
            this.btn_oneDraw.visible = false;
        }
    }

    public Reset(){
        GameLayerManager.gameLayer().addEventListener(UserData.PURCHASEDATA, this.onPurchaseData, this);
    }

    public Close(){
        AudioManager.GetIns().PlayMusic(AudioManager.CLOSE_MUSIC);
        GameLayerManager.gameLayer().removeEventListener(UserData.PURCHASEDATA, this.onPurchaseData, this);
        GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA);
        this.show_label_text();
        modLogin.closePayHeart();
    }

    private onButtonHandler(event:egret.TouchEvent) {
        let target = event.currentTarget;
        switch (target) {
            case this.btn_soul:
                Utils.viewStackStatus(this.stack_shop, this.btn_top, 0);
            break;
            case this.btn_equip:
                Utils.viewStackStatus(this.stack_shop, this.btn_top, 1);
            break;
            case this.btn_reward:
                Utils.viewStackStatus(this.stack_shop, this.btn_top, 2);
            break;
            case this.btn_hero:
                Utils.viewStackStatus(this.stack_shop, this.btn_top, 3);
            break;
            case this.btn_free:
                this.cards = [];
                let cardInfo = modShop.drawOnce();
                this.cards.push(cardInfo);
                egret.log("一抽--->", JSON.stringify(this.cards));
                Animations.drawCard("once", cardInfo, ()=>{
                    this.createEquipPop(this.cards, "once");
                    this.btn_free.visible = false;
                    this.btn_oneDraw.visible = true;
                    UserDataInfo.GetInstance().DealUserData("freeCount", UserDataInfo.GetInstance().GetBasicData("freeCount") + 1);
                    GameLayerManager.gameLayer().dispatchEventWith(UserData.REDEVENT);
                });
            break;
            case this.btn_oneDraw:
                if(this.haveEnoughDiamond(1)){
                    this.cards = [];
                    let cardInfo = modShop.drawOnce();
                    this.cards.push(cardInfo);
                    egret.log("一抽--->", JSON.stringify(this.cards));
                    Animations.drawCard("once", cardInfo, ()=>{
                        this.createEquipPop(this.cards, "once")
                    });
                }
            break;
            case this.btn_tenDraw:
              if(this.haveEnoughDiamond(10)){
                    this.cards = [];
                    this.cards = modShop.drawTen();
                    let startLen = 0;
                    var popFunc = function() {
                        if (startLen >= 10) {
                            this.createEquipPop(this.cards, "ten");
                        }else{
                            Animations.drawCard("ten", this.cards[startLen.toString()], ()=>{
                                startLen ++;
                                popFunc();
                            });
                        }
                    }.bind(this);

                    popFunc();
              }
            break;
            default:
                this.Close();
            break;
        }
    }

    /**
     * 创建显示内容
     */
    private createContent(scroller:eui.Scroller, content:Array<any>, type:string, isShowGroup:boolean=true):void {
        let group = new eui.Group();
        for (let i = 0; i < content.length; i++) {
            let panel:shopItemIR = new shopItemIR();
            panel.Show(content[i], type, i, isShowGroup);
            panel.x = 290 * i;
            group.addChild(panel);
        }
        scroller.viewport = group;
    }

    private haveEnoughDiamond(num:number):boolean{
        let value:number = this.tcShop.cards[0];
        if (num == 10) value = this.tcShop.cards[1];
        if(UserDataInfo.GetInstance().IsHaveGoods("diamond", value,()=>{
            this.lab_money.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
        }))
        {
            return true;
        }
        else Animations.showTips("钻石不足，无法开启", 1, true);
        return false;
    }

    public show_label_text():void{
        this.lab_soul.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("soul"));
        this.lab_money.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("diamond"));
        this.lab_exp.text = Common.TranslateDigit(UserDataInfo.GetInstance().GetBasicData("exp"));
    }

    /**
     * 获取卡组
     */
    public getCards():Array<any> {
        return this.cards;
    }

    /**
     * 创建弹窗
     */
    public createEquipPop(infos:Array<any>, type:string) {
        let pop:PopupWindow = WindowManager.GetInstance().GetWindow("DrawCardPop");
        pop.Show(infos, type);
        Animations.PopupBackOut(pop, 500);
    }

    public static instance:ShopDialog;
    /**商城的配置文件 */
    private tcShop:any;
    /**金币 */
    private lab_money:eui.Label;
    /**魂石 */
    private lab_soul:eui.Label;
    private lab_exp:eui.Label;

    /*****************顶部按钮*******************/
    private btn_top:eui.ToggleButton[];
    private btn_soul:eui.ToggleButton;
    private btn_equip:eui.ToggleButton;
    private btn_reward:eui.ToggleButton;
    private btn_hero:eui.ToggleButton;
    /*******************************************/

    /*******************叠层********************/
    private stack_shop:eui.ViewStack;
    private groupEquip:eui.Group;
    private scrollDiamond:eui.Scroller;
    private scrollReward:eui.Scroller;
    private scrollHero:eui.Scroller;
    /*******************************************/

    private btn_back:eui.Button;

    /**免费抽 */
    private btn_free:eui.Button;
    /**单抽按钮 */
    private btn_oneDraw:eui.Button;
    /**十连按钮 */
    private btn_tenDraw:eui.Button;
    /**卡组 */
    private cards:Array<any>;
}