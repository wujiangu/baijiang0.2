/** GM 
 * @author hong
 * @date 2017/7/28
 */

class GMWindow extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/GMWindowSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
    }

    public Show():void{
        super.Show();
        this.data_list = [];
        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.onEventManager(1);
    }

    public Close():void{
         Animations.PopupBackIn(this, 350,  ()=>{
            super.Close();
        });

        this.onEventManager(0);

        if(this.data_list.length > 0){
            let tempData:any = UserDataInfo.GetInstance().GetBasicData("email");
            let date = new Date();
            let strDate = "2017/" + date.getMonth() + "/" + date.getDay(); 
            tempData.push({status:3,title:"GM系统调试",content:"GM功能调试使用", reward:this.data_list,date:strDate,time:30});
            UserDataInfo.GetInstance().SetBasicData("email", tempData);
        }
    }

    private onEventManager(type:number = 0):void{
        let btn_list:any = [this.btn_weapon, this.btn_diamond, this.btn_exp, this.btn_soul, this.btn_power, this.btn_close];
        Common.ListenerAndRemoveEvent(btn_list, this.onTouchBtn, this, type);
        btn_list = [];
    }

    private onTouchBtn(event:egret.TouchEvent):void{

        if(this.data_list.length >= 5 && event.target != this.btn_close){
            Animations.showTips("一封邮件最多只能获得5份物品", 1, true);
            return;
        }

        switch(event.target){
            case this.btn_weapon:
                this.onClickWeapon();
            break;
            case this.btn_diamond:
                this.onAddGoods("diamond", this.input_diamond.text);
            break;
            case this.btn_exp:
                this.onAddGoods("exp", this.input_exp.text);
            break;
            case this.btn_soul:
                this.onAddGoods("soul", this.input_soul.text);
            break;
            case this.btn_power:
                this.onAddGoods("power", this.input_power.text);
            break;
            default:
                this.Close();
            break;
        }
    }

    private onClickWeapon():void{

        if(this.input_weapon.text.length == 0){
            Animations.showTips("请输入(1 - 24)的数字获得装备!", 1, true);
            return;
        }

        let str:string = this.input_weapon.text;
        let digit:number = parseInt(str);
        
        if(digit <= 0 || digit > 24){
            Animations.showTips("没有此类型装备请从(1 - 24)的id号进行筛选", 1, true);
            return;
        }

        this.data_list.push({type:1,data:digit, name:"equip"});
    }

    private onAddGoods(name:string, strNum:string):void{
        if(strNum.length == 0){
            Animations.showTips("请输入数值获得道具，不能为空", 1, true);
            return;
        }

        if(strNum.length > 10){
            Animations.showTips("sorry you input digit too longer", 1, true);
            return;
        }

        let num = parseInt(strNum);
        this.data_list.push({type:2,data:num,name:name});
    }

    /** button */
    private btn_weapon:eui.Button;
    private btn_diamond:eui.Button;
    private btn_exp:eui.Button;
    private btn_soul:eui.Button;
    private btn_power:eui.Button;
    private btn_close:eui.Button;

    /** text input */
    private input_weapon:eui.TextInput;
    private input_diamond:eui.TextInput;
    private input_exp:eui.TextInput;
    private input_soul:eui.TextInput;
    private input_power:eui.TextInput;

    /** other */
    private data_list:Array<any>;
    
}