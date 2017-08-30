/**
 * 武器逻辑
 */
namespace modEquip {

    /**
     * 更新各个装备信息
     * 
     */
    export function update(equip:any) {
        if (SceneManager.mainScene.readyDialog){
            SceneManager.mainScene.readyDialog.updateEquip(equip);
        }
    }

    /**装备的通用资源 */
    export class EquipSource{
        public static EQUIPLV:number = 100;             //武器最大等级
        public static UPSTARPRICE:number = 10000;       //武器升星价格
        public static RESETPRICE:number = 20;           //武器洗练价格
        public static RESETATTR:string = "RESETATTR";
        public static UPSTAR:string = "UPSTAR";
        public static UPGRADE:string = "UPGRADE";
        public static CHANGEEQUIP:string = "CHANGEEQUIP";
    }

    /** 撞瘪的属性类型 */
    export class AttrType{
        public static BLOOD:number  = 0;
        public static DEFEND:number = 1;
        public static ATTACK:number = 2;
        public static CRIT:number   = 3;
        public static DODGE:number  = 4;

        public constructor(type:number, value:number,quality:number){
            this.type = type;
            this.value = value;
            this.quality = quality;
        }
        
        public set Type(val:number){
            this.type = val;
        }

        public get Type(){
            return this.type;
        }

        public set Value(val:number){
            this.value = val;
        }

        public get Value(){
            return this.value;
        }

        public set Quality(val:number){
            this.quality = val;
        }

        public get Quality(){
            return this.quality
        }

        private type:number;
        private value:number;
        private quality:number;
    }

    /** 装备信息 */
   export class EquipInfo{

       public constructor(id:number, star:number, quality:number, lv:number = 1,equipId:number = modEquip.getRandEquipId()){
           this.id   = id;
           this.star = star;
           this.quality = quality;
           this.lv   = lv;
           this.equipId = equipId;
           this.type_list = new Array();
           this.attr_list = new Array();
           this.origin_attr_list = new Array();

           let tempData:any = TcManager.GetInstance().GetEquipUpAttrFromGrade(quality);
           for(let i:number = 0; i < 4; i++){
               this.origin_attr_list[i] = tempData.init[i];
               this.attr_list[i] = GetEquipUpAttr(this, lv, i);
            }
       }

        public set EquipId(val:number){
            this.equipId = val;
        }

        public get EquipId(){
            return this.equipId;
        }

        public set Id(val:number){
            this.id = val;
        }

        public get Id(){
            return this.id;
        }

        public set Lv(val:number){
            this.lv = val;
        }

        public get Lv(){
            return this.lv;
        }

        public set Star(val:number){
            this.star = val;
        }

        public set Quality(val:number){
            this.quality = val;
        }

        public get Quality(){
            return this.quality;
        }

        public get Star(){
            return this.star;
        }

        public InsertAttrType(attrType:AttrType):void{
            this.type_list.push(attrType);
        }

        /** 增加洗练属性类型 
         * @param num 洗脸属性的数量
        */
        public AddAttrType(num:number = 1):void{
            if(this.type_list.length + num > 6) return;
            for(let i:number = 0; i < num; i++){
                let tempData:any = modEquip.GetResetEquipData(this);
                this.type_list.push(new modEquip.AttrType(tempData.type, tempData.value, tempData.quality));
            }
        }

        public ChangeAttrType(index:number, type:number, value:number, quality:number):void{
            if(index < 0 || index > this.type_list.length) return;
            this.type_list[index].Type  = type;
            this.type_list[index].Value = value;
            this.type_list[index].Quality = quality;
            this.UpdateData();
        }

        public GetAttrType():any{
            return this.type_list;
        }

        public GetPointTypeFromIndex(index:number):AttrType{
            if(index < 0 || index > this.type_list.length) return null;
            return this.type_list[index];
        }

         public GetEquipAttr():any{
            return this.attr_list;
        }

        public GetOriginAttr():any{
            return this.origin_attr_list;
        }

        /** 更新基本属性 */
        public UpdataBaseAttr():void{
            for(let i:number = 0; i < 4; i++){
                this.attr_list[i] = GetEquipUpAttr(this, this.lv, i);
            }
        }

        public UpdateData():void{
            modEquip.ReqInsertAndUpEquip(this);
        }

        private equipId:number;                 //装备索引id
        private id:number;                      //装备id
        private lv:number;                      //装备等级
        private star:number;                    //装备星级
        private quality:number;                 //装备的品质
        private attr_list:Array<number>;        //[1]生命[2]护甲[3]攻击[4]暴击[5]闪避
        private origin_attr_list:Array<number>;    //源氏的数据列表
        private type_list:Array<AttrType>;       //属性类型
    }

    /** 装备数据 负责所有的装备信息 */
   export class EquipData{
        public constructor(){
            this.equip_list = [];
        }

        public static instance:EquipData;
        public static GetInstance():EquipData{
            if(this.instance == null){
                this.instance = new EquipData();
            }

            return this.instance;
        }

        public Add(val:EquipInfo, isSave:boolean = true):void{
            this.equip_list.push(val);
            this.listSort();
            if(isSave) modEquip.ReqInsertAndUpEquip(val);
        }

        public Pop():void{
            this.equip_list.pop();
        }

        public GetEquipList():any{
            return this.equip_list;
        }

        public GetEquipNum():number{
            return this.equip_list.length;
        }

        /** 根据索引获得指定的物品 */
        public GetEquipFromIndex(index:number):EquipInfo{
            if(index < 0 || index > this.equip_list.length) return;

            return this.equip_list[index];
        }

        /** get equip from equipId */
        public GetEquipFromEquipId(equipId:number):EquipInfo{
            for(let i in this.equip_list){
                if(this.equip_list[i].EquipId == equipId) return this.equip_list[i];
            }
            return null;
        }

        /** 插入装备信息 */
        public InsertEquipInfo(equipInfo:any):void{
            let info:EquipInfo = new EquipInfo(equipInfo.id, equipInfo.star, TcManager.GetInstance().GetTcEquipData(equipInfo.id).grade);
            for(let i:number = 0; i < equipInfo.affix.length; i++){
                let attrType = new AttrType(equipInfo.affix[i].type, equipInfo.affix[i].value, 0);
                info.InsertAttrType(attrType);
            }

            this.equip_list.push(info);
            this.listSort();
            modEquip.ReqInsertAndUpEquip(info);
        }

        public InsertEquipList(list:any):void{
            if(list.length == 0) return;

            for(let i of list){
                let info = new EquipInfo(i, 0, TcManager.GetInstance().GetTcEquipData(i).grade);
                this.Add(info);
            }
        }

        /** 移除装备信息 */
        public RemoveEquipInfo(info:EquipInfo):void{
            for(let i:number = 0; i < this.equip_list.length; i++){
                if(info.EquipId == this.equip_list[i].EquipId){
                    for(let j:number = i; j < this.equip_list.length - 1; j++){
                        this.equip_list[j] = this.equip_list[j + 1];
                    }
                    break;
                }
            }
            this.equip_list.pop();
            modEquip.ReqRemoveEquip(info);
        }

        private swapData(i:number, j:number):void{
            let temp:EquipInfo = this.equip_list[i];
            this.equip_list[i] = this.equip_list[j];
            this.equip_list[j] = temp;
        }

        private listSort():void{
            for(let i:number = 0; i < this.equip_list.length; i++){
                for(let j:number = i + 1; j < this.equip_list.length; j++){
                    if(this.equip_list[i].Id < this.equip_list[j].Id){
                        this.swapData(i, j);
                    }
                }
            }
        }

        private equip_list:Array<EquipInfo>;
    }

    /** 根据对应的类型和值 来获得对应的字符信息 */
    export function GetAttrInfo(type:number, value:number):string{
        if(type == AttrType.ATTACK) return "攻击+" + Math.ceil(value);
        else if(type == AttrType.DEFEND) return "护甲+" + Math.ceil(value);
        else if(type == AttrType.BLOOD) return "生命+" + Math.ceil(value);
        else if(type == AttrType.CRIT) return "暴击+" + parseFloat(value.toFixed(2)) + "%";
        else if(type == AttrType.DODGE) return "闪避+" + Math.ceil(value) + "%";
    }

    /** 计算升级成功的概率 */
    export function GetSuccessGoodsLv(upInfo:EquipInfo, consumeInfo:EquipInfo):number{
        let consumeData:any = TcManager.GetInstance().GetTcEquipStarUpData(consumeInfo.Quality, consumeInfo.Star);
        let upData:any = TcManager.GetInstance().GetTcEquipStarUpData(upInfo.Quality, upInfo.Star + 1);
        let successRate:number = Math.floor((consumeData.bassValue / upData.needValue) * 100 );

        return successRate;
    }

    /** 获得装备洗练的随机品质*/
    function getEquipResetQuality():number{
        let rand = Math.floor(Math.random() * 100) % 100;
        if(rand < 35) return 0;
        else if(rand >= 35 && rand < 60) return 1;
        else if(rand >= 60 && rand < 80) return 2;
        else if(rand >= 80 && rand < 95) return 3;
        else if(rand >= 95) return 4;
    }

    let reset_list:any = [[[150,250],[18,30],[150,250],[0,4]],[[200,280],[22,36],[200,280],[1,4]],[[250,320],[26,42],[250,320],[2,4]],
                 [[280,360],[31,45],[280,360],[2,5]],[[320,380],[35,48],[320,380],[3,5]]];
    let complete:any = [0.25,0.34,0.5,0.75,1]
    /** 获得洗练装备的数据值 随机洗练一个属性
     * @param info 当前装备对象信息
     */
    export function GetResetEquipData(info:EquipInfo):any{
        let type:number = Math.floor(Math.random() * 100) % 4, value:number = 0;
        let quality:number = getEquipResetQuality();
        let tempList:any = reset_list[info.Quality - 1];
        let minNum:number = tempList[type][1] - tempList[type][0];

        if(type < 3) value = Math.floor((Math.random() * minNum) % minNum) + tempList[type][0];
        else value = (Math.random() * minNum) % minNum + tempList[type][0];
        value = value * complete[quality];

        return {type:type,value:value,quality:quality};
    }

    export function GetQualityMaxValue(quality:number, type:number):number{
        return reset_list[quality - 1][type][1];
    }

    /** 根据物品品质获得装备的颜色和图片资源
     * @param quality  装备属性的品质
     * @param type     类型 1 是星星 2 点
     */
    export function GetEquipColorFromQuality(quality:number,type:number = 1):any{
        let imgName:string = type == 1 ? "star" : "point";

        if(quality == null || quality == -1) return {color:0x858685,img:"equip_res." +imgName + "_00"};
        if(quality == 0) return {color:0x858685,img:"equip_res." + imgName + "_01"};
        else if(quality == 1) return {color:0x5e972b,img:"equip_res." + imgName + "_02"};
        else if(quality == 2) return {color:0x2f76b0,img:"equip_res." + imgName + "_03"};
        else if(quality == 3) return {color:0x852f9b,img:"equip_res." + imgName + "_04"};
        else if(quality == 4) return {color:0xab5515,img:"equip_res." + imgName + "_05"};
    }

    let star_up_attr:any = [7.047,0.688,7.13,0.0291];
    let star_init_attr:any = [300,50,200,0];
    /** 获得装备的属性值
     * @param info 当前装备对象
     * @param lv 当前装备需要的等级
     * @param index 4个属性的索引
     */
    export function GetEquipUpAttr(info:EquipInfo, lv:number, index:number):number{
        let value:number = 0;
        let upData:any = TcManager.GetInstance().GetEquipUpAttrFromGrade(info.Quality);
        let equipData:any = TcManager.GetInstance().GetTcEquipData(info.Id);

        let first:number,second:number = 0;
        if(info.Star == 0) first = lv * upData.up[index] + info.GetOriginAttr()[index];
        else first = (lv + (info.Quality + info.Star) * 100) * star_up_attr[index] + star_init_attr[index];

        if(equipData.attr[index] == 1) second = upData.character[index] * (info.Star + 1) / upData.character[4];

        if(info.Id > 15 && equipData.attr[2] == 1 && equipData.attr[3] == 1){
            second = upData.character[index] / 2 * (info.Star + 1) / upData.character[4];
        }

       value = first + second;

        return value;
    }
    function isDiffEquipId(list:any, equipId:number):boolean{
         for(let info of list){
            if(info.EquipId == equipId)
                  return false;
          }
         return true;
    }

   export function getRandEquipId():number{
        let equipId:number = 0;
        let list:any = EquipData.GetInstance().GetEquipList();
        while(true){
            equipId = Math.floor(Math.random() * 10000) % 10000;
            if(isDiffEquipId(list, equipId))
                break;
        }

        return equipId;
    }

    /** insert and update equip */
    export function ReqInsertAndUpEquip(info:modEquip.EquipInfo):void{
        let reset_list:any = [];
        for(let i:number = 0; i < info.GetAttrType().length; i++){
            let reset = info.GetAttrType()[i];
            reset_list[i] = {type:reset.Type,value:reset.value,quality:reset.Quality};
        }
        let tempData:any = {star:info.Star,lv:info.Lv,quality:info.Quality,equipId:info.EquipId,categoryId:info.Id,resetAttrList:reset_list};
        HttpRequest.getInstance().send("POST", "equip", tempData, ()=>{},this);
    }

    /** get equip */
    export function ReqGetEquip():void{
        HttpRequest.getInstance().send("GET", "equip", {},(data)=>{
            let list:any = data.equip;
            for(let i in list){
                let info:EquipInfo = new EquipInfo(list[i].categoryId,list[i].star,list[i].quality,list[i].lv,list[i].equipId);
                for(let reset of list[i].rest_attr_list) info.InsertAttrType(new AttrType(reset.type,reset.value,reset.quality));
                EquipData.GetInstance().Add(info, false);
            }

        }, this)
    } 

    /** remove equip */
    export function ReqRemoveEquip(info):void{
        HttpRequest.getInstance().send("DELETE", "equip", {equipId:info.equipId},()=>{}, this);
    }
}