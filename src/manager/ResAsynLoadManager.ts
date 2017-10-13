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

    public static LoadCurHeroSource(name:string):void {
        let isExist:boolean = false;
        this.isLoaded = false;
        for (let i = 0; i < this.existRes.length; i++) {
            if (this.existRes[i] == name) {
                isExist = true;
                break;
            }
        }
        if (isExist) {
            this.isLoaded = true;
            return;
        }
        this.existRes.push(name);
        RES.getResAsync(name + "_skill_ske_dbbin", ()=>{
            RES.getResAsync(name + "_skill_tex_json", ()=>{
                RES.getResAsync(name + "_skill_tex_png", ()=>{
                    let skeletonData = RES.getRes(name+"_skill_ske_dbbin");
                    let textureData = RES.getRes(name+"_skill_tex_json");
                    let texture = RES.getRes(name+"_skill_tex_png");
                    DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture);
                    this.isLoaded = true;
                }, this);
            }, this);
        }, this);
    }

    private static existRes:Array<string> = [];
    public static isLoaded:boolean;
}