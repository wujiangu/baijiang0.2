/**
 * 武器详情
 */
class EquipInfoDialog extends PopupWindow {
    public constructor() {
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/game_skins/equipInfoSkin.exml";
    }

    public Init():void{
        super.Init();
        
        this.self_attr_list = [];
        this.refine_attr_list = [];
        this.name_list = {diaochan:"貂蝉",zhaoyun:"赵云",buxiaoman:"布小蛮",wu:"无"};

        for(let i:number = 0; i < 4; i++){
            this.self_attr_list[i] = Common.CreateText("",19, 0x565656,true,"Microsoft YaHei");
            Common.SetXY(this.self_attr_list[i], this.lab_name.x, this.lab_equiptor.y + this.lab_equiptor.height + 10 + i * 30);
            this.addChild(this.self_attr_list[i]);
        }

        for(let i:number = 0; i < 6; i++){
            this.refine_attr_list[i] = Common.CreateText("+",19, 0xA01E8F,true,"Microsoft YaHei");
            Common.SetXY(this.refine_attr_list[i], this.lab_name.x, 350 + i * 30);
            this.addChild(this.refine_attr_list[i]);
        }
    }

    private onComplete():void {
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Show(info:modEquip.EquipInfo, name:string = "wu"):void{
        super.Show();
        this.lab_name.text = TcManager.GetInstance().GetTcEquipData(info.Id).name;
        this.lab_equiptor.text = this.name_list[name];
        this.lab_lv.text   = info.Lv + "/100";
        let str_list:any = ["攻击: ", "生命: ", "护甲: ", "暴击: "];

        for(let i in this.self_attr_list){
            this.self_attr_list[i].text = str_list[i] + Math.floor(info.GetEquipAttr()[i]);
        }

       let attrData = info.GetAttrType();
       for(let i in this.refine_attr_list){
           if(attrData.length > i) this.refine_attr_list[i].text = modEquip.GetAttrInfo(attrData[i].Type, attrData[i].Value);
           else this.refine_attr_list[i].text = "";
       }
    }

    public Reset():void{
        this.btn_closeDetail.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
    }

    public Close():void{
        super.Close();
        this.btn_closeDetail.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
    }

    /**武器配置文件 */
    private btn_closeDetail:eui.Group;

    private lab_name:eui.Label;
    private lab_lv:eui.Label;
    private lab_equiptor:eui.Label;
    private self_attr_list:Array<egret.TextField>;
    private refine_attr_list:Array<egret.TextField>;
    private name_list:any;
}