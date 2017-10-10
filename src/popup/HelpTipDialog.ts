/** Help tip dialog 
 * @author hong
 * @date   2017/8/9
*/

class HelpTipDialog extends PopupWindow{
    public constructor(){
        super();
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
        this.skinName = "resource/popup/HelpDialogSkin.exml";
    }

    private onComplete():void{
        this.removeEventListener(eui.UIEvent.COMPLETE, this.onComplete, this);
    }

    public Init():void{
        this.txt_list = [[{type:0,str:"1.天赋点通过"},{type:1,str:"人物升级"},{type:0,str:"获得;"},{end:true},
                          {type:0,str:"2.最多可点亮"},{type:1,str:"10个"},{type:0,str:"天赋技能;"},{end:true},
                          {type:0,str:"3.天赋升级可消耗"},{type:1,str:"钻石"},{type:0,str:"代替天赋点"},{end:true},
                          {type:0,str:"4.天赋重置只返还"},{type:1,str:"天赋点"},{type:0,str:"，消耗钻石会以天赋点返还;"},{end:true},
                          {type:0,str:"5.天赋页最多可拥有"},{type:1,str:"5页"},{type:0,str:"，选择即为切换;"},{end:true},{type:0,str:"6.切换天赋页不返还天赋点;"}],
                        [
                          {type:0,str:"1.装备最高等级为"},{type:1,str:"100级"},{type:0,str:"，满级后可进行升星;"},{end:true},
                          {type:0,str:"2.武器色泽不同武器"},{type:1,str:"星数"},{type:0,str:"也不同，白色2星，绿色3星，以此类推;"},{end:true},
                          {type:0,str:"3.升星需要消耗"},{type:1,str:"其他武器"},{type:0,str:"，武器色泽相差过大时，成功概率会"},
                          {type:1,str:"减少"},{type:0,str:"很多;"},{end:true},
                          {type:0,str:"4.升星后，装备等级"},{type:1,str:"重置"},{type:0,str:"再次升级到100可继续升星，直至满星;"},{end:true},
                          {type:0,str:"5.升星后，装备会多一条"},{type:1,str:"额外属性"},{type:0,str:"，属性也有不同"},{type:1,str:"色泽等级"},
                          {type:0,str:"，可消耗钻石进行"},{type:1,str:"洗练"},{end:true}]];
    }

    public Show(type:number):void{
        super.Show();

        this.lab_title.text = type == 1 ? "装备规则" : "天赋规则";
        let tempList:Array<any> = new Array();
        let list:any = this.txt_list[type];
        for(let i in list){
            if(list[i].end) tempList.push({text:"\n",style:{"size":35}});
            else if(list[i].end == null) tempList.push({text:list[i].str,style:{"textColor":list[i].type == 0 ? 0x515151 : 0xab5515}});
        }
        this.lab_content.textFlow = <Array<egret.ITextElement>>tempList;
        tempList = [];
        
        Animations.PopupBackOut(this, 350);
    }

    public Reset():void{
        this.btn_close.addEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
    }

    public Close():void{
        super.Close(1);
        this.btn_close.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.Close, this);
    }

    /** button */
    private btn_close:eui.Button;
    
    /** label */
    private lab_title:eui.Label;
    private lab_content:eui.Label;
    private txt_list:any;

}