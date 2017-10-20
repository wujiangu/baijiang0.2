/**
 * 商店购买内容
 */
class shopItemIR extends Base {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/shopItemIRSkin.exml";
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);

        // this.btn_itemDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.btn_buy.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
        this.img_item.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonHandler, this);
    }

    /**
     * 按钮监听
     */
    private onButtonHandler(event:egret.TouchEvent):void {
        let target = event.currentTarget;
        switch (target) {
            case this.img_item:
                let pop = WindowManager.GetInstance().GetWindow("ShopItemPop");
                pop.Show(this.content, this.btn_buy.name);
                Animations.PopupBackOut(pop, 500);
            break;
            case this.btn_buy:
                if(this.btn_buy.name == "diamond"){
                    modPay.preOrder({amount:this.content.money, subject:"钻石", diamond:this.content.count});
                    // Animations.showTips("无法购买，现金充值尚未开放", 1, true);
                }
                else if(this.btn_buy.name == "packs"){
                    if(!UserDataInfo.GetInstance().IsHaveGoods("diamond", this.content.price,()=>{
                        Animations.showTips("购买礼包成功", 1);
                        if(this.content.type == "pack"){
                            let info = new modEquip.EquipInfo(20, 0, 5);
                            modEquip.EquipData.GetInstance().Add(info);
                            let soul:number = UserDataInfo.GetInstance().GetBasicData("soul") + ModBasic.PACKSOUL;
                            let exp:number = UserDataInfo.GetInstance().GetBasicData("exp") + ModBasic.PACKEXP;
                            UserDataInfo.GetInstance().SetBasicData({soul:soul,exp:exp});
                            UserDataInfo.GetInstance().DealAllData("diamond", ModBasic.PACKDIAMOND, ModBasic.GET);
                        }
                        else if(this.content.type == "exp" || this.content.type == "soul")
                        {
                            UserDataInfo.GetInstance().DealAllData(this.content.type, this.content.count, ModBasic.GET);
                        }
                        GameLayerManager.gameLayer().dispatchEventWith(UserData.PURCHASEDATA);
                    }))
                    {
                        Animations.showTips("钻石不足，无法购买", 1,true);
                    }
                }
                else if(this.btn_buy.name == "heros")
                {
                    if (HeroData.hasHero(this.content.key)){
                        Animations.showTips(`已有英雄${this.content.name}`, 1);
                    }
                    else
                    {
                        if(!UserDataInfo.GetInstance().IsHaveGoods("diamond", this.content.price,()=>{
                            Animations.showTips(`购买英雄${this.content.name}成功`, 1);
                            HeroData.addHeroData(this.content.key);
                            if (WindowManager.GetInstance().getObjFromStr("ReadyDialog")) {
                                WindowManager.GetInstance().getObjFromStr("ReadyDialog").updateList();
                            }
                            WindowManager.GetInstance().GetWindow("ShareWindow").Show({type:3,data:this.content.key});
                            GameLayerManager.gameLayer().dispatchEventWith(UserData.PURCHASEDATA);
                        }))
                        {
                            Animations.showTips("钻石不足，无法购买", 1);
                        }
                    }
                }
            break;
        }
    }

    /**
     * 显示
     */
    public Show(content:any, type:string, index:number, isShowGroup:boolean=true):void {
        this.content = content;
        this.lab_name.text = content.name;
        this.img_item.source = content.imgItem;
        this.btn_buy.name = type;
        if(type == "diamond") {
            let str:string = this.content.count + "钻石";
            this.img_diamond.visible = false;
            if (content.price == 6) {
                this.img_reward.source = "battle_res.img_guanyu";
                str = "关羽";
            }
            else if (content.price == 1) {
                this.img_reward.source = "common_res.img_syitian";
                str = "倚天剑";
            }
            else this.img_reward.visible = false;
            this.set_label_Text("","￥"+content.price, "首冲送" + str, true, isShowGroup);
        }
        else if(content.discount == 1){
            this.set_label_Text(content.price,"", "限时折扣：    折",true, isShowGroup);
            // this.btn_itemDetail.y = this.btn_itemDetail.y - this.diamondGroup.height;
            this.lab_discount.visible = true;
            this.lab_discount.text = `${(content.price / content.initPrice) * 10}`;
        } 
        else this.set_label_Text(content.price,"", "",true);
    }

    private set_label_Text(btnName:string, strMoney:string, strReward:string, isVisible:boolean, isShowGroup:boolean = false):void{
        this.btn_buy.label = btnName;
        this.lab_money.text = strMoney;
        this.lab_reward.text = strReward;
        this.img_diamond.visible = isVisible;
        // this.btn_itemDetail.visible = isVisible;
        this.diamondGroup.visible = isShowGroup;
    }

    /**标题 */
    private lab_name:eui.Label;
    /**图片 */
    private img_item:eui.Image;
    /**详情按钮 */
    private btn_itemDetail:eui.Button;
    /**购买的获得物品图片 */
    private img_soul01:eui.Image;
    /**购买按钮 */
    private btn_buy:eui.Button;
    /**购买按钮的图标 */
    private img_btnBuy:any;
    /**奖励图标 */
    private img_reward:eui.Image;
    /**内容 */
    private content:any;
    private img_diamond:eui.Image;
    private lab_money:eui.Label;
    private lab_reward:eui.Label;
    private lab_discount:eui.Label;
    private diamondGroup:eui.Group;

}