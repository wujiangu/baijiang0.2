class EquipUpStarWindow extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/EquipUpStarSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
        this.equip_list = [];
        this.icon_list =  [];
        this.click_list = [];
        this.source_list = [this.img_source1, this.img_source2, this.img_source3];;

        for(let i:number = 0; i < 3; i++){
            this.icon_list[i] = new egret.Bitmap(RES.getRes("equip_0009_png"));
            this.scrollGroup.addChild(this.icon_list[i]);
        }
        this.initData();
    }

    private initData():void{

        for(let i:number = 0; i < 3; i++){
            this.set_obj_attr(i, false, 0,"-1", "");
        }

        this.lab_sole.text = "";
        this.showEquipSusscess()
    }

    public Show(equip_info:modEquip.EquipInfo):void{
        super.Show();
        
        this.equip_info = equip_info;
        
        this.initData();
        this.showGoodsView();

        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upStar.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpStar, this);
        for(let i = 0; i < 3; i++){
            this.source_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSource, this);
        }
    }

    public Close():void{
        Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });
        
        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_upStar.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchUpStar, this);

        for(let i = 0; i < 3; i++){
            this.source_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchSource, this);
        }

        for(let i:number = 0; i < this.equip_list.length; i++){
            this.equip_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
        }

        this.dispatchEventWith(modEquip.EquipSource.UPSTAR, false, -1);
    }

    private onTouchUpStar(event:egret.TouchEvent):void{
        if(!this.isHaveEquip()){         //如果当前没有装备 则不能点击升级
            Animations.showTips("装备不足，无法升星", 1, true);
            return;
        }

        if(!UserDataInfo.GetInstance().IsHaveGoods("soul",modEquip.EquipSource.UPSTARCONSUME)){
            Common.ShowLackDataPopup("soul", ()=>{
                this.dispatchEventWith(modEquip.EquipSource.UPSTAR, false, 0);
            })
            return;
        } 

        //移除所有的监听 防止去除后又重复监听
        for(let i:number = 0; i < this.equip_list.length; i++){
            this.equip_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
        }

        let equipData:Array<modEquip.EquipInfo> = [];
        for(let i:number = 0; i < this.click_list.length; i++){
            if(this.click_list[i] != 0){                //得到填入的装备槽的装备
                let info:modEquip.EquipInfo = modEquip.EquipData.GetInstance().GetEquipFromIndex(parseInt(this.source_list[i].name));
                equipData.push(info);
            }  
        }
       
        for(let i:number = 0; i < equipData.length; i++){
            modEquip.EquipData.GetInstance().RemoveEquipInfo(equipData[i]);
        }
        LeanCloud.GetInstance().SaveEquipData();

        //判断是否升星成功
        if(this.isUpStar(this.successNum)){
            let tempData:any = modEquip.GetResetEquipData(this.equip_info);
            let attrType:modEquip.AttrType = new modEquip.AttrType(tempData.type, tempData.value, tempData.quality);
            this.equip_info.InsertAttrType(attrType);
            this.equip_info.Lv = 1;
            this.equip_info.Star++;
            Animations.showTips("升星成功", 1);
            this.dispatchEventWith(modEquip.EquipSource.UPSTAR, false, 1);
            modEquip.update(this.equip_info);
            this.Close();
        }
        else 
        {
            for(let i:number = 0; i < equipData.length; i++) modEquip.EquipData.GetInstance().Lucky += equipData[i].Quality * 10;
            if(modEquip.EquipData.GetInstance().Lucky >= 100) modEquip.EquipData.GetInstance().Lucky = 100;
            
            Animations.showTips("升星失败", 1);
            this.dispatchEventWith(modEquip.EquipSource.UPSTAR, false, 2);
            this.initData();
            this.showGoodsView();
        }
    }

    private onTouchSource(event:egret.TouchEvent):void{
        let name = event.target.name;
        for(let i:number = 0; i < this.source_list.length; i++){
            if(name == this.source_list[i].name){
                this.set_obj_attr(i, false, 0,"-1", "");
                this.showEquipSusscess(modEquip.EquipData.GetInstance().GetEquipFromIndex(parseInt(name)), -1, true)
                break;
            }
        }

        if(!this.isHaveEquip()) this.lab_sole.text = "";
    }

    /** 显示当前拥有的装备 */
    private showGoodsView():void{
        let img:eui.Image;
        for(let i:number = 0; i < this.equip_list.length; i++) this.equip_list.pop();

        this.scrollGroup.removeChildren();

        let index:number = 0;
        let raw:number, col:number;
        let list:any = modEquip.EquipData.GetInstance().GetEquipList();
        let currHero = HeroData.getHeroData(GameData.curHero);
        currHero["typeId"] = currHero["typeId"] != null ? currHero["typeId"] : 0;
        for(let i:number = 0; i < list.length; i++){
            if( (list[i].Id == this.equip_info.Id && list[i].TypeID != this.equip_info.TypeID) || list[i].Id != this.equip_info.Id){
                if((currHero.equip == list[i].Id && currHero["typeId"] != list[i].TypeID) || currHero.equip != list[i].Id){
                    raw = Math.floor(index / 4);
                    col = index % 4;
                    let img:eui.Image = new eui.Image();
                    img.source = `Sequip${25-list[i].Id}_png`;
                    this.scrollGroup.addChild(img); 
                    this.equip_list.push(img);
                    Common.SetXY(img, 4 + 104*col, 4 + 104*raw);
                    img.name = i + "";
                    index++;
                    img.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
                }
            }
        }

        for(let i:number = 0; i < 3; i++){
            this.scrollGroup.addChild(this.icon_list[i]);
        }
    }

    /** 是否是相同的装备
     * @param target 目标对象
     */
    private isSameEquip(target:any):boolean{
        let isSame:boolean = false;
        for(let i:number = 0; i < this.source_list.length; i++){
            if(target.name == this.source_list[i].name){
                isSame = true;
                this.set_obj_attr(i, false, 0,"-1", "");
                this.showEquipSusscess(modEquip.EquipData.GetInstance().GetEquipFromIndex(parseInt(target.name)), -1, true)
                break;
            }
        }
        if(!this.isHaveEquip()) this.lab_sole.text = "";
        return isSame;
    }

    private onTouchEquip(event:egret.TouchEvent):void{
        let target = event.target;

       if(this.isSameEquip(target)) return;

        let index = this.getEmptyIndex();
        if(index == -1){
            return;
        }

        this.icon_list[index].visible = true;
        Common.SetXY(this.icon_list[index], target.x, target.y);
        this.changeObjectStatus(this.source_list[index], target.name, target.source);
        this.showEquipSusscess(modEquip.EquipData.GetInstance().GetEquipFromIndex(parseInt(target.name)), 1, true)

        if(this.isHaveEquip()) this.lab_sole.text = `${modEquip.EquipSource.UPSTARCONSUME}`;
    }

    /** 获得当前没满的索引  */
     private getEmptyIndex():number{
        let temp:number = -1;
        for(let i:number = 0; i < 3; i++){
            if(this.click_list[i] == 0) 
            {
                this.click_list[i] = 1;
                temp = i;
                break;
            }
        }
        return temp;
    }

    /** 判断是否有装备  */
    private isHaveEquip():boolean{
        for(let i:number = 0; i < 3; i++){
            if(this.click_list[i] != 0) return true;
        }
        return false;
    }

    private changeObjectStatus(obj:any, name:string, source:string):void{
        if(obj == null) return;
        obj.source = source;
        obj.name   = name;
    }

    /** 设置对象的属性 */
    private set_obj_attr(index:number, isVisible:boolean, clickNum:number, strName:string, strSource:string):void{
        this.changeObjectStatus(this.source_list[index], strName, strSource);
        this.icon_list[index].visible = isVisible;
        this.click_list[index] = clickNum;
    }

    /**判断是否可以升星 */
    private isUpStar(rate:number):boolean{
        let isSuccess:boolean = false;
        let rand = Math.floor((Math.random() % 100) * 100);
        if(rate > rand) isSuccess = true;
        return isSuccess;
    }

    private showEquipSusscess(info:modEquip.EquipInfo = null, num:number = 0, isClick:boolean = false):void{

        if(num == 0) this.successNum = 0;
        else this.successNum += modEquip.GetSuccessGoodsLv(this.equip_info, info) * num;

        let actual = this.successNum;
        if(actual > 100) actual = 100;
        else if(actual < 0) actual = 0;
        
        if(isClick && actual == 0){
            for(let i:number = 0; i < this.click_list.length; i++){
                if(this.click_list[i] != 0){
                    actual = 1;
                }
            }
        }

        this.lab_lucky.textFlow = <Array<egret.ITextElement>>[{text:"当前成功率: "}, {text:actual + "%", style:{"size":45}}];
    }

    private img_source1:eui.Image;
    private img_source2:eui.Image;
    private img_source3:eui.Image;
    private lab_lucky:eui.Label;
    private lab_sole:eui.Label;

    private btn_close:eui.Button;
    private btn_upStar:eui.Button;

    private scrollGroup:eui.Scroller;
    private equip_list:Array<eui.Image>;
    private icon_list:Array<egret.Bitmap>;
    private click_list:Array<number>;
    private source_list:any;
    private successNum:number;
    
    private equip_info:modEquip.EquipInfo;
}