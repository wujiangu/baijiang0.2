/** Equip Object
 * @author hong
 * @date   2017/8/2
 */

class EquipObject extends eui.Group{
    public constructor(){
        super();

        this.img_list = new Array();
        this.img_weapon = new egret.Bitmap();
        this.img_bottom = new egret.Bitmap(RES.getRes("equip_res.equip_bottom"));
        this.txt_lv     = Common.CreateText("", 20,0xE58E0B, true,"Microsoft YaHei");
        
        this.addChild(this.img_weapon);
        this.addChild(this.img_bottom);
        this.addChild(this.txt_lv);

        for(let i:number = 0; i < 6; i++){
            this.img_list[i] = new egret.Bitmap(RES.getRes("equip_res.point_00"));
            this.addChild(this.img_list[i]);
        }
        this.width = 100;this.height = 100;
        this.txt_lv.width = 95;
    }

    /** 改变装备资源
     * @param  info 资源对象
     */
    public ChangeEquipSource(info:modEquip.EquipInfo):void{
        this.show_and_hide(true);
        this.img_weapon.texture = RES.getRes(`equip_res.Sequip${25-info.Id}`);
        Common.SetXY(this.img_bottom, this.img_weapon.width - this.img_bottom.width >> 1, this.img_weapon.height - this.img_bottom.height - 7);
        Common.SetXY(this.txt_lv, 10, 10);
        this.UpEquipData(info);
    }

    /** 改变对象资源 只是单纯的改变纹理和字体 以及字体对应的位置
     * @param texture 图片纹理
     * @param num     字体数量
     */
    public ChangeObjSource(texture:egret.Texture, num:number){
        this.show_and_hide(false);
        this.img_weapon.texture = texture;
        this.txt_lv.text = num > 0 ? Common.TranslateDigit(num) : "";
        Common.SetXY(this.txt_lv, 0, this.img_weapon.height - this.txt_lv.height - 7);
    }
    
    private show_and_hide(isShow):void{
        this.img_bottom.visible = isShow;
        for(let i in this.img_list) this.img_list[i].visible = false;
        this.txt_lv.textAlign = isShow ? "left" : "right";
        this.txt_lv.textColor = isShow ? 0xE58E0B : 0xffffff;
    }

    public UpEquipData(info:modEquip.EquipInfo):void{

        let list = info.GetAttrType();
        let srcX = this.img_weapon.width - ((info.Quality + 1) * 10) - 7;
        for(let i:number = 0; i < 6; i++){
            this.img_list[i].texture = RES.getRes(list.length > i ? modEquip.GetEquipColorFromQuality(list[i].Quality,0).img : "equip_res.point_00");
            this.img_list[i].visible = info.Quality + 1 > i ? true : false;
            Common.SetXY(this.img_list[i], srcX + 10 * i, this.img_bottom.y + (this.img_bottom.height - 8 >> 1));
        }

        this.txt_lv.text = `${info.Lv}`;
        this.id = info.Id;
        this.equipId = info.EquipId;
    }

    public ChangeImgMatrixFilter(strName):void{
        Common.ChangeImgMatrixFilter(this.img_weapon, strName);
    }
    
    public set Index(val:number){
        this.index = val;
    }

    public get Index(){
        return this.index
    }

    public GetId():number{
        return this.id;
    }

    public GetEquipId():number{
        return this.equipId;
    }

    /** image */
    private img_weapon:egret.Bitmap;
    private img_list:Array<egret.Bitmap>;
    private img_bottom:egret.Bitmap;

    /** label */
    private txt_lv:egret.TextField;

    private index:number;
    private equipId:number;
    private id:number;
}