class ResetEqiopAttrWindow extends PopupWindow{

    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/ResetEquipAttrSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{

    }

    public Show(equipInfo:modEquip.EquipInfo, index:number):void{
        super.Show();

        this._index = index;
        this.equip_info = equipInfo;
        let attrType = this.equip_info.GetPointTypeFromIndex(index);
        this.changeAttrInfo(attrType.Type, attrType.Value);

        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_reset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReset, this);
    }

    public Close():void{
        Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });

        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_reset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReset, this);
        this.dispatchEventWith(modEquip.EquipSource.RESETATTR, false, -1);
        
    }

    private onTouchReset(event:egret.TouchEvent):void{

        if(!UserDataInfo.GetInstance().IsHaveGoods("diamond", 50)){
            Animations.showTips("钻石不足，无法洗练", 1, true);
            return;
        }

        let rand = Math.floor((Math.random() % 100 * 100));
        let type = rand % 5 == 0 ? 5:rand % 5;
        let value = rand % 100 == 0 ? 1 : rand % 100;
        if(modEquip.EquipData.GetInstance().Lucky == 100){
            modEquip.EquipData.GetInstance().Lucky = 0;
            value = 100;
        }
        else
        {
            modEquip.EquipData.GetInstance().Lucky += 2;
        } 
        this.equip_info.ChangeAttrType(this._index, type, value);
        this.changeAttrInfo(type, value);
        Animations.showTips("洗练成功", 1);
        this.dispatchEventWith(modEquip.EquipSource.RESETATTR, false, {type:type,value:value,index:this._index})
    }

    private changeAttrInfo(type:number, value:number){
        let data = modEquip.GetEquipLvFromValue(value);
        this.lab_attr.text = modEquip.GetAttrInfo(type, value);
        this.lab_attr.textColor = data.color;
        this.imgStar.source = data.img;
        this.lab_money.text = "当前幸运值: " + modEquip.EquipData.GetInstance().Lucky;
    }

    private imgStar:eui.Image;

    private lab_attr:eui.Label;
    private lab_money:eui.Label;

    private btn_reset:eui.Button;
    private btn_close:eui.Image;

    private equip_info:modEquip.EquipInfo;
    private _index:number;
}