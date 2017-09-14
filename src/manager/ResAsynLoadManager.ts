/** Res Asyn Load Manager 
 * @author hong
 * @date 2017/9/11
*/

class ResAsynLoadManager{
   
    public static LoadMainScene():void{
        for(let i:number = 1; i <= 24; i++) RES.getResAsync(`equip${i}_png`,()=>{},this);
        let str_list:Array<string> = ["equip_0006_png","curtain_png","title_res","goodsBg_png","TcBoss01_json","TcMonster01_json","TcMonster02_json","TcMonster03_json"];
        for(let str of str_list) RES.getResAsync(str, ()=>{}, this);
    }

    public static LoadReadyScene():void{
        let str_list:Array<string> = ["map1_png"];
        for(let str of str_list) RES.getResAsync(str, ()=>{}, this);
    }
}