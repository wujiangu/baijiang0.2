/** 
 *  hero content share 
 * @auto hong
 * date 2017/7/24
 */

class ShareWindow extends PopupWindow{

    public static KILLREQUIRE:number = 1000;

    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/ShareDialogSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
    }

    public Show(param:any, func?):void{
        super.Show();
        let str:string;
        this.listener = func;

        if(param.type == 1){            //pvp
            str = this.getPVPTitle(param.data);
            if(param.data <= 3) this.show_lab_text(`第${param.data}名`,str.substr(0,5), str.substr(5, 5));
            else this.show_lab_text(`第${param.data}名`,"", "",str);
        }
        else if(param.type == 2)       //battle
        {
            this.show_lab_text("千人斩","一骑当千！", "真-三国无双！");
        }
        else if(param.type == 3)      //hero
        {
            let name_list:any = {buxiaoman:"布小蛮", zhaoyun:"赵云",diaochan:"貂蝉"}
            this.show_lab_text(name_list[param.data],"","","",this.getHeroStage(param.data));
        }

        if(param.share == null){
            this.lab_share.text = "";
        } 
        else
        {
            let equipName:string = TcManager.GetInstance().GetTcEquipData(param.share).name;
            this.lab_share.textFlow = <Array<egret.ITextElement>>[{text:"分享即可获得：",style:{"textColor":0x4C4C4C}},
                                                                  {text:equipName, style:{"textColor":0x910F9B}}];
        }
        this.img_goods.texture = param.share == null ? null : RES.getRes(`equip_res.Sequip${25-param.share}`);
    }

    private onEventManage(type:number = 0){
        let btn_list:any = [this.btn_share, this.btn_close];
        Common.ListenerAndRemoveEvent(btn_list, this.onTouchBtn, this, type);
        btn_list = [];
    }

    public Reset():void{
        this.onEventManage(1);
    }

    public Close():void{
        super.Close();
        this.onEventManage();
        if(this.listener) this.listener();
    }

    private onTouchBtn(event:egret.TouchEvent):void{
       let target = event.target;
       switch(event.target){
           case this.btn_share:
           break;
           default:
            this.Close();
           break;
       }
    }

    private show_lab_text(title:string,content1:string, content2:string, content3:string = "", content4:string = ""):void{
        this.lab_title.text    = title;
        this.lab_content1.text = content1;
        this.lab_content2.text = content2;
        this.lab_content3.text = content3;
        this.lab_content4.textFlow = <Array<egret.ITextElement>>[{text:content4},{text:"\n",style:{"size":35}}];
    }

    private getPVPTitle(index):string{
        if(index == 1) return  "状元之才！中原之巅！";
        else if(index == 2) return "榜眼之才！万人之上！"
        else if(index == 3) return "探花之才！风流倜傥！"
        else if(index >= 4 && index <= 10) return "您已经超越了99%的玩家！"
        else if(index > 10) return "您已经超越了98%的玩家！"
    }

    private getHeroStage(name:string):string{
        if(name == "buxiaoman") return "从没想过，曾经威慑四方、天下第一的吕布，竟是她爹！";
        else if(name == "zhaoyun") return "七进七出！吾乃常山赵子龙是也！";
        else if(name == "diaochan") return "北方有佳人，遗世而独立，一顾倾人城，再顾倾人国！"
    }

    /** button */
    private btn_share:eui.Button;
    private btn_close:eui.Button;

    /** label */
    private lab_title:eui.Label;
    private lab_share:eui.Label;
    private lab_content1:eui.Label;
    private lab_content2:eui.Label;
    private lab_content3:eui.Label;
    private lab_content4:eui.Label;

    /** image */
    private img_goods:eui.Image;

    /** other */
    private listener:any;
  
}