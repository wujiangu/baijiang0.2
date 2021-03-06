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
        this.changeAttrInfo(attrType.Type, attrType.Value, attrType.Quality);

        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_reset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReset, this);
    }

    public Close():void{
        super.Close(1);

        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_reset.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchReset, this);
        this.dispatchEventWith(modEquip.EquipSource.RESETATTR, false, -1);
        
    }

    private onTouchReset(event:egret.TouchEvent):void{

        AudioManager.GetIns().PlayMusic(AudioManager.CLICK_MUSIC);
        if(!UserDataInfo.GetInstance().IsHaveGoods("diamond", ModBasic.RESETDIAMOND,()=>{
            let data = modEquip.GetResetEquipData(this.equip_info);
            let type = data.type
            let value = data.value;
            let quality = data.quality;

            if(UserDataInfo.GetInstance().GetBasicData("lucky") == 100){
                UserDataInfo.GetInstance().DealUserData("lucky", 0);
                value = modEquip.GetQualityMaxValue(this.equip_info.Quality, type);
                quality = 4;
            }
            else
            {
                UserDataInfo.GetInstance().DealUserData("lucky", UserDataInfo.GetInstance().GetBasicData("lucky") + 2);
            } 
            this.equip_info.ChangeAttrType(this._index, type, value, quality);
            this.changeAttrInfo(type, value, quality);
            Animations.showTips("洗练成功", 1);
            this.dispatchEventWith(modEquip.EquipSource.RESETATTR, false, {type:type,value:value,index:this._index, quality:quality});
        }))
        {
            Animations.showTips("钻石不足，无法洗练", 1, true);
            return;
        }
    }

    private changeAttrInfo(type:number, value:number, quality:number){
        let data = modEquip.GetEquipColorFromQuality(quality);
        this.lab_attr.text = modEquip.GetAttrInfo(type, value);
        this.lab_attr.textColor = data.color;
        this.imgStar.source = data.img;
        this.lab_lucky.text = "当前幸运值: " + UserDataInfo.GetInstance().GetBasicData("lucky");
    }

    private imgStar:eui.Image;

    private lab_attr:eui.Label;
    private lab_lucky:eui.Label;

    private btn_reset:eui.Button;
    private btn_close:eui.Image;

    private equip_info:modEquip.EquipInfo;
    private _index:number;
}