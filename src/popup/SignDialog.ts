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
        this.img_hook = new egret.Bitmap(RES.getRes("common_res.hook"));

        this.addChild(this.txt_title);
        this.addChild(this.txt_name);
        this.addChild(this.txt_num);
        this.addChild(this.img_goods);
        this.addChild(this.img_hook);

        this.ShowAndHideHook(false);
        Common.SetXY(this.txt_title, this.width - this.txt_title.width >> 1, 182);
    }

    public ChangeGoodsInfo(param:any):void{
        let name:string,strTexture:string,strNum:string = `x${param.count}`,textColor:number;
        if(param.type == 1){
            let tempData:any = TcManager.GetInstance().GetTcEquipData(param.id);
            name = param.id == 25 ? "随机橙装" : tempData.name;
            textColor = param.id == 25 ? 0xab5515 : modEquip.GetEquipColorFromQuality(tempData.grade - 1).color;
            strTexture = param.id == 25 ? "common_res.unknow" : `equip_res.Sequip${25-param.id}`;
        }
        else if(param.type == 2)
        {
            let data_list:any = {exp:["经验",0xab5515],soul:["魂石",0x852f9b],
                                 diamond:["钻石",0x2D6EA6],power:["天赋点",0xBC822B]};
            name = data_list[param.name][0];
            textColor = data_list[param.name][1];
            strTexture = `common_res.basic_${param.name}`;
        }
        else if(param.type == 3)
        {
            let name_list = {diaochan:"貂蝉",zhaoyun:"赵云",buxiaoman:"布小蛮"};
            strTexture = `img_${param.name}1_png`;
            name = name_list[param.name];
            textColor = 0xff00ff;
        }

        this.txt_name.text = name;
        this.txt_name.textColor = textColor;
        this.txt_num.text = strNum;
        this.img_goods.texture = RES.getRes(strTexture);
        if(param.type == 3) {
            this.img_goods.width = 100;this.img_goods.height = 100;
        }

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
        let tcSign:any = TcManager.GetInstance().GetTcListFromIndex(5);
        let signTime:number = UserDataInfo.GetInstance().GetBasicData("sign");
        let num:number = signTime < 7 ? 0 : UserDataInfo.GetInstance().GetBasicData("isSign") && signTime - 7 == 0 ? 0 : 7;
        let index:number = 0;

        for(let i:number = num; i < num + 7; i++){
            this.gooods_info_list[index] = new SignGoodsInfo(day_list[index]);
            this.addChild(this.gooods_info_list[index]);
            this.gooods_info_list[index].ChangeGoodsInfo(tcSign[i]);
            Common.SetXY(this.gooods_info_list[index], 148 + index * 120, 0);
            index++;
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

        let signTime:number = UserDataInfo.GetInstance().GetBasicData("sign");
        let tcSign:any = TcManager.GetInstance().GetTcListFromIndex(5);

        if(tcSign[signTime].type == 1 && tcSign[signTime].id == 25){
            let rand:number = Math.floor((Math.random() * 100) % 4) + 21;
            Common.DealReward({type:tcSign[signTime].type, name:tcSign[signTime].name, count:tcSign[signTime].count, id:rand});
        }
        else Common.DealReward(tcSign[signTime]);

        if(tcSign[signTime].type == 2) GameLayerManager.gameLayer().dispatchEventWith(UserData.CHANGEDATA, false, 1);

        this.gooods_info_list[this._currIndex].ShowClickSignEffect();
        // UserDataInfo.GetInstance().SetBasicData("isSign", true);
        // UserDataInfo.GetInstance().SetBasicData("sign", UserDataInfo.GetInstance().GetBasicData("sign") + 1);
        this.showSignStatus();
    }

    private showSignStatus():void{
        let signTime:number = UserDataInfo.GetInstance().GetBasicData("sign");
        signTime = signTime < 7 ? signTime : UserDataInfo.GetInstance().GetBasicData("isSign") && signTime - 7 == 0 ? 7 : signTime - 7;
        this._currIndex = signTime;

        for(let i:number = 0; i < signTime; i++){
            this.gooods_info_list[i].ShowAndHideHook(true);
        }

        this.img_click.visible = UserDataInfo.GetInstance().GetBasicData("isSign") == false && signTime < 7 ? true : false;
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
    private _currIndex:number;
}