/** sign dialog
 * @author hong
 * @date   2017/8/7
 */
class SignGoodsInfo extends eui.Group{
    public constructor(strDay:string){
        super();

        this.width = 120;

        this.txt_title = Common.CreateText(strDay,25,0xBC9745,true, "Microsoft YaHei","center");
        this.txt_name = Common.CreateText("",18,0x00ffff,true, "Microsoft YaHei","center");
        this.txt_num = Common.CreateText("",18,0x706F6F,true, "Microsoft YaHei","center");
        this.img_goods = new egret.Bitmap();
        this.img_hook = new egret.Bitmap(RES.getRes("hook_png"));

        this.addChild(this.txt_title);
        this.addChild(this.txt_name);
        this.addChild(this.txt_num);
        this.addChild(this.img_goods);
        this.addChild(this.img_hook);

        this.ShowAndHideHook(false);
        Common.SetXY(this.txt_title, this.width - this.txt_title.width >> 1, 182);
    }

    public ChangeGoodsInfo(param:any):void{
        let name:string,strTexture:string,strNum:string = "x1",textColor:number;
        if(param.type == 1){
            let tempData:any = TcManager.GetInstance().GetTcEquipData(param.data);
            name = tempData.name;
            textColor = modEquip.GetEquipColorFromQuality(tempData.grade - 1).color;
            strTexture = `Sequip${25-param.data}_png`;
        }
        else if(param.type == 2)
        {
            let data_list:any = {exp:["经验","battle_0016_png",0xab5515],soul:["魂石","battle_0017_png",0x852f9b]};
            name = data_list[param.name][0];
            strTexture = data_list[param.name][1];
            strNum = `x${param.data}`;
            textColor = data_list[param.name][2];
        }

        this.txt_name.text = name;
        this.txt_name.textColor = textColor;
        this.txt_num.text = strNum;
        this.img_goods.texture = RES.getRes(strTexture);

        Common.SetXY(this.txt_name, this.width - this.txt_name.width >> 1, this.txt_title.y + this.txt_title.height + 40);
        Common.SetXY(this.img_goods, this.width - this.img_goods.width >> 1, this.txt_name.y + this.txt_name.height + 5);
        Common.SetXY(this.txt_num, this.width - this.txt_num.width >> 1, this.img_goods.y + this.img_goods.height);
        Common.SetXY(this.img_hook, this.img_goods.x + (this.img_goods.width - this.img_hook.width >> 1), this.img_goods.y + (this.img_goods.height - this.img_hook.height >> 1));
    }

    public ShowAndHideHook(isVisible):void{
        this.img_hook.visible = isVisible;
        Common.ChangeImgMatrixFilter(this.img_goods, isVisible ? "gray" : "");
    }

    public ShowClickSignEffect():void{
        this.ShowAndHideHook(true);
        
        let mask:egret.Shape = Common.CreateShape(this.img_hook.x, this.img_hook.y, this.img_hook.width, this.img_hook.height);
        this.addChild(mask);
        mask.x = -this.img_hook.width;
        this.img_hook.mask = mask;

        egret.Tween.get(this.img_hook.mask).to({x:0},800).call(()=>{
            egret.Tween.removeTweens(this.img_hook.mask);
        })
    }

    public GetImgSrcY():number{
        return this.img_goods.y;
    }

    /** TextField */
    private txt_title:egret.TextField;
    private txt_name:egret.TextField;
    private txt_num:egret.TextField;
    
    /** bitmap */
    private img_goods:egret.Bitmap;
    private img_hook:egret.Bitmap;
}

class SignDialog extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/SignDialogSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
        this.gooods_info_list = new Array();

        let day_list:any = ["第一天","第二天","第三天","第四天","第五天","第六天","第七天"];
        this.gooods_data = [{type:1,data:6,name:"equip"},{type:1,data:8,name:"equip"},{type:2,data:20000,name:"exp"},
                             {type:2,data:20000,name:"soul"},{type:1,data:16,name:"equip"},{type:1,data:18,name:"equip"},{type:1,data:20,name:"equip"}];

        for(let i:number = 0; i < 7; i++){
            this.gooods_info_list[i] = new SignGoodsInfo(day_list[i]);
            this.addChild(this.gooods_info_list[i]);
            this.gooods_info_list[i].ChangeGoodsInfo( this.gooods_data[i]);
            Common.SetXY(this.gooods_info_list[i], 148 + i * 120, 0);
        }

        this.img_click = new egret.Bitmap(RES.getRes("equip_0009_png"));
        this.addChild(this.img_click);
    }

    public Show():void{
        super.Show();

        this.showSignStatus();
        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_sign.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onSign, this);
    }

    public Close():void{
        Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });

        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
        this.btn_sign.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onSign, this);
    }

    private onSign(event:egret.TouchEvent):void{
        if(UserDataInfo.GetInstance().GetBasicData("isSign")){
            Animations.showTips("您已经领取当天奖励！", 1, true);
            return;
        }

        let signTime = UserDataInfo.GetInstance().GetBasicData("sign");

        this.gooods_info_list[signTime].ShowClickSignEffect();
        Common.DealReward(this.gooods_data[signTime]);
        Animations.ShowGoodsPopEffect(this.gooods_data[signTime]);

        UserDataInfo.GetInstance().SetBasicData("isSign", true);
        UserDataInfo.GetInstance().SetBasicData("sign", UserDataInfo.GetInstance().GetBasicData("sign") + 1);
        this.showSignStatus();
    }

    private showSignStatus():void{
        let signTime:number = UserDataInfo.GetInstance().GetBasicData("sign");
        for(let i:number = 0; i < signTime; i++){
            this.gooods_info_list[i].ShowAndHideHook(true);
        }

        this.img_click.visible = signTime < 7 ? true : false;
        if(signTime >= 7) return;
        Common.SetXY(this.img_click, this.gooods_info_list[signTime].x + (this.gooods_info_list[signTime].width - this.img_click.width >> 1), this.gooods_info_list[signTime].GetImgSrcY());
    }

    /*** label */
    private lab_title:eui.Label;

    /** button */
    private btn_close:eui.Button;
    private btn_sign:eui.Button;

    /** img */
    private img_click:egret.Bitmap;

    /** class */
    private gooods_info_list:Array<SignGoodsInfo>;

    /** other */
    private gooods_data:any;
}