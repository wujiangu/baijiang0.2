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
        this.equip_object_list = new Array();
        this.icon_list =  new Array();
        this.click_list = new Array();
        this.source_list = [this.img_source1, this.img_source2, this.img_source3];

        for(let i:number = 0; i < 3; i++){
            this.icon_list[i] = new egret.Bitmap(RES.getRes("equip_res.equip_0009"));
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

        for(let i:number = 0; i < this.equip_object_list.length; i++){
            this.equip_object_list[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
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

        for(let i:number = 0; i < this.equip_object_list.length; i++){
            this.equip_object_list[i].removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
        }

        this.dispatchEventWith(modEquip.EquipSource.UPSTAR, false, -1);
    }

    private onTouchUpStar(event:egret.TouchEvent):void{
        if(!this.isHaveEquip()){         //如果当前没有装备 则不能点击升级
            Animations.showTips("装备不足，无法升星", 1, true);
            return;
        }

        if(!UserDataInfo.GetInstance().IsHaveGoods("soul",ModBasic.UPSTARSOUL)){
            Common.ShowLackDataPopup("soul", ()=>{
                this.dispatchEventWith(modEquip.EquipSource.UPSTAR, false, 0);
            })
            return;
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

        //判断是否升星成功
        if(this.isUpStar(this.successNum)){
            this.equip_info.AddAttrType();
            this.equip_info.Lv = 1;
            this.equip_info.Star++;
            Animations.showTips("升星成功", 1);
            this.dispatchEventWith(modEquip.EquipSource.UPSTAR, false, 1);
            this.equip_info.UpdateData();
            this.Close();
        }
        else 
        {
            for(let i:number = 0; i < equipData.length; i++) UserDataInfo.GetInstance().DealUserData("lucky", UserDataInfo.GetInstance().GetBasicData("lucky") + equipData[i].Quality * 10);
            if(UserDataInfo.GetInstance().GetBasicData("lucky") >= 100) UserDataInfo.GetInstance().DealUserData("lucky", 100);
            
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
        this.scrollGroup.removeChildren();

        let index:number = 0;
        let raw:number, col:number;
        let list:any = modEquip.EquipData.GetInstance().GetEquipList();
        let currHero = HeroData.getHeroData(GameData.curHero);

        for(let i:number = 0; i < list.length; i++){
            if(list[i].EquipId != this.equip_info.EquipId && currHero.equipId != list[i].EquipId ){
                if(this.equip_object_list.length <= index){
                    this.equip_object_list[index] = new EquipObject();
                    this.equip_object_list[index].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchEquip, this);
                }

                this.equip_object_list[index].ChangeEquipSource(list[i]);
                this.equip_object_list[index].Index = i;
                this.scrollGroup.addChild(this.equip_object_list[index]); 

                raw = Math.floor(index / 4);
                col = index % 4;
                Common.SetXY(this.equip_object_list[index], 4 + 104*col, 4 + 104*raw);
                index++;
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
            if(target.Index == this.source_list[i].name){
                isSame = true;
                this.set_obj_attr(i, false, 0,"-1", "");
                this.showEquipSusscess(modEquip.EquipData.GetInstance().GetEquipFromIndex(parseInt(target.Index)), -1, true)
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
        this.changeObjectStatus(this.source_list[index], `${target.Index}`, `equip_res.Sequip${25-target.GetId()}`);
        this.showEquipSusscess(modEquip.EquipData.GetInstance().GetEquipFromIndex(target.Index), 1, true)

        if(this.isHaveEquip()) this.lab_sole.text = `${ModBasic.UPSTARSOUL}`;
    }

    /** 获得当前没满的索引  */
     private getEmptyIndex():number{
        for(let i:number = 0; i < 3; i++){
            if(this.click_list[i] == 0) 
            {
                this.click_list[i] = 1;
                return i;
            }
        }
        return -1;
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
        let rand = Math.floor((Math.random() % 100) * 100);
        return rate > rand ? true : false;
    }

    private showEquipSusscess(info:modEquip.EquipInfo = null, num:number = 0, isClick:boolean = false):void{

        this.successNum = num == 0 ? 0 : this.successNum + modEquip.GetSuccessGoodsLv(this.equip_info, info) * num;
        let actual:number = this.successNum > 100 ? 100 : this.successNum < 0 ? 0 : this.successNum;
        
        if(isClick && actual == 0){
            for(let i:number = 0; i < this.click_list.length; i++){
                if(this.click_list[i] != 0){
                    actual = 1;
                }
            }
        }

        this.lab_lucky.textFlow = <Array<egret.ITextElement>>[{text:"当前成功率: "}, {text:actual + "%", style:{"size":45}}];
    }

    /** image */
    private img_source1:eui.Image;
    private img_source2:eui.Image;
    private img_source3:eui.Image;

    /** label */
    private lab_lucky:eui.Label;
    private lab_sole:eui.Label;

    /** button */
    private btn_close:eui.Button;
    private btn_upStar:eui.Button;

    private scrollGroup:eui.Scroller;
    private icon_list:Array<egret.Bitmap>;
    private click_list:Array<number>;
    private source_list:any;
    
    /** class */
    private equip_info:modEquip.EquipInfo;
    private equip_object_list:Array<EquipObject>;

    /** other */
    private successNum:number;
}