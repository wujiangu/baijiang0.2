/** 物品弹窗 */
class GoodsTipWindow extends egret.DisplayObjectContainer{
    public constructor(){
        super();
        this.init();
    }

    public static _instance:GoodsTipWindow;
    public static GetInstance():GoodsTipWindow{
        if(this._instance == null){
            this._instance = new GoodsTipWindow();
        }
        return this._instance;
    }

    private init():void{
        this.group = new egret.Sprite();
        this.img_mask = Common.CreateShape(0, 50, 1136, 640 - 50);
        this.img_bg= new egret.Bitmap(RES.getRes("goodsBg_png"));
        this.img_icon = new egret.Bitmap();
        this.txt_name = Common.CreateText("", 25,0xafaa9b, true, "Microsoft YaHei");
        this.txt_content = Common.CreateText("", 20,0x625f57, true, "Microsoft YaHei");

        this.txt_content.width = this.img_bg.width - 20;
        this.img_mask.alpha = 0;
        this.img_mask.touchEnabled = true;

        this.addChild(this.img_mask);
        this.addChild(this.group);
        this.group.addChild(this.img_bg);
        this.group.addChild(this.img_icon);
        this.group.addChild(this.txt_name);
        this.group.addChild(this.txt_content);

    }

    public Show(parent:any, type:number,x:number, y:number):void{
        if(this.parent) this.parent.removeChild(this);
        parent.addChild(this);

        let type_data = this.getTypeString(type);
        this.img_icon.texture = RES.getRes(type_data.source);
        this.txt_name.text = type_data.name;
        this.txt_content.textFlow = <Array<egret.ITextElement>>[{text:type_data.content, style:{"size":20}},{text:"\n",style:{"size":30}}];

        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);

        Common.SetXY(this.img_icon, 16, 16);
        Common.SetXY(this.txt_name, this.img_icon.x + this.img_icon.width + 15, this.img_icon.y + (this.img_icon.height - this.txt_name.height >> 1));
        Common.SetXY(this.txt_content, this.img_bg.width - this.txt_content.width >> 1, this.img_icon.y + this.img_icon.height + 8);
        Common.SetXY(this.group, x, y);
    }

    private close():void{
        if(this.parent) this.parent.removeChild(this);
        this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.close, this);
    }

    public SetGroupPosition(x,y):void{

    }

     private getTypeString(type:number):any{
        if(type == 0) return {source:"common_res.power_0002",name:"天赋点",content:"通过对战获得，可升级天赋"};
        else if(type == 1) return {source:"common_res.exp_0002",name:"经验",content:"通过对战获得，可升级人物和装备"};
        else if(type == 2) return {source:"common_res.sole_0002",name:"魂石",content:"通过战斗获得，可升级装备"};
        else if(type == 3) return {source:"common_res.crystal_0002",name:"钻石",content:"通过充值或者奖励获得"};
    }

    private img_mask:egret.Shape;
    private group:egret.Sprite;
    private img_bg:egret.Bitmap;
    private img_icon:egret.Bitmap;
    private txt_name:egret.TextField;
    private txt_content:egret.TextField;
}