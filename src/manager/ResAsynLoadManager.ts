/** Res Asyn Load Manager 
 * @author hong
 * @date 2017/9/11
*/

class ResAsynLoadManager{
   
    public static LoadMainScene():void{
        for(let i:number = 1; i <= 24; i++) RES.getResAsync(`equip${i}_png`,()=>{},this);
        let str_list:Array<string> = ["0_0075_di_png","help_tip_png","signBg_png","equip_0006_png","curtain_png","share_0001_png","title_res","popmenu_0001_png","goodsBg_png"];
        for(let str of str_list) RES.getResAsync(str, ()=>{}, this);
    }

    public static LoadEquipScene():void{
        let str_list:Array<string> = ["equip_0001_png","equip_0012_png","equip_0004_png","equip_0003_png","equip_0011_png","equip_0010_png","equip_0008_png"];
        for(let str of str_list) RES.getResAsync(str, ()=>{}, this);
    }

    public static LoadReadyScene():void{
        let str_list:Array<string> = ["hero_0001_png","hero_0002_png","hero_0003_png","hero_0004_png","hero_0005_png","hero_0006_png","popmenu_0002_png","bg_readyAttr_png","bg_readyEquip_png","equip_0013_png"];
        for(let str of str_list) RES.getResAsync(str, ()=>{}, this);
    }

    public static LoadShopScene():void{
        let str_list:Array<string> = ["shop_0001_png","panel_shop_png","shop_0010_png","shop_0009_png","shop_0008_png"];
        for(let str of str_list) RES.getResAsync(str, ()=>{}, this);
    }
}