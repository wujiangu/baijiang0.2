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
        public static EQUIPLV:number = 100;
        public static RESETATTR:string = "RESETATTR";
        public static UPSTAR:string = "UPSTAR";
        public static UPGRADE:string = "UPGRADE";
        public static CHANGEEQUIP:string = "CHANGEEQUIP";
    }

    /** 撞瘪的属性类型 */
    export class AttrType{
        public static BLOOD:number  = 1;
        public static ATTACK:number = 2;
        public static DEFEND:number = 3;
        public static CRIT:number   = 4;
        public static DODGE:number  = 5;

        public constructor(type:number, value:number){
            this.type = type;
            this.value = value;
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

        private type:number;
        private value:number;
    }

    /** 装备信息 */
   export class EquipInfo{

       public constructor(id:number, star:number, quality:number, lv:number = 1){
           this.id   = id;
           this.star = star;
           this.quality = quality;
           this.lv   = lv;
           this.typeID = 0;
           this.attrType = [];
           this.attr_list = [];
           this.origin_attr_list = [];

           for(let i:number = 0; i < 5; i++){
               if(this.quality >= i){
                   if(i >= 3) this.set_attr(i, this.quality * 20);
                   else this.set_attr(i, this.quality * 100);
               }
               else
               {
                   this.set_attr(i, 0);
               }
            }
       }

       private set_attr(i:number, val:number):void{
           this.attr_list[i] = val;
           this.origin_attr_list[i] = val / 100;
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

        public get Star(){
            return this.star;
        }

        public get Quality(){
            return this.quality;
        }

        public set Quality(val:number){
            this.quality = val;
        }

        public set TypeID(val:number){
            this.typeID = val;
        }

        public get TypeID(){
            return this.typeID;
        }

        public InsertAttrType(attrType:AttrType):void{
            this.attrType.push(attrType);
        }

        public ChangeAttrType(index:number, type:number, value:number):void{
            if(index < 0 || index > this.attrType.length) return;
            this.attrType[index].Type  = type;
            this.attrType[index].Value = value;
        }

        public GetAttrType():any{
            return this.attrType;
        }

        public GetPointTypeFromIndex(index:number):AttrType{
            if(index < 0 || index > this.attrType.length) return null;
            return this.attrType[index];
        }

         public GetEquipAttr():any{
            return this.attr_list;
        }

        public SetEquipAttr(attrList:Array<number>):void{
            for(let i:number = 0; i < 5; i++){
                this.attr_list[i] = attrList[i];
            }
        }

        public GetOriginAttr():any{
            return this.origin_attr_list;
        }

        private id:number;                      //装备id
        private lv:number;                      //装备等级
        private star:number;                    //装备星级
        private quality:number;                 //装备的品质
        private typeID:number;                  //装备的类型id 主要是区别id一样的时候不同的typeid
        private attr_list:Array<number>;        //[1]生命[2]攻击[3]护甲[4]暴击[5]闪避
        private origin_attr_list:Array<number>;    //源氏的数据列表
        private attrType:Array<AttrType>;       //属性类型
    }

    /** 装备数据 负责所有的装备信息 */
   export class EquipData{
        public constructor(){
            this.equip_list = [];
            this.id_list = [];
            this.lucky = 0;
            for(let i:number = 1; i <= 24; i++) this.id_list[i] = 0;
        }

        public static instance:EquipData;
        public static GetInstance():EquipData{
            if(this.instance == null){
                this.instance = new EquipData();
            }

            return this.instance;
        }

        public Add(val:EquipInfo, type:number = 0):void{
            val.TypeID = this.id_list[val.Id]++;
            this.equip_list.push(val);
            this.listSort();
            if(type == 1) LeanCloud.GetInstance().SaveEquipData();
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

        /** 根据指定的id获得武器 */
        public GetEquipFromId(id:number, typeId:number):EquipInfo{
            for(let i in this.equip_list){
                if(this.equip_list[i].Id == id && typeId == this.equip_list[i].TypeID) return this.equip_list[i];
            }

            return null;
        }

        /** 插入装备信息 */
        public InsertEquipInfo(equipInfo:any):void{
            let info:EquipInfo = new EquipInfo(equipInfo.id, equipInfo.star, TcManager.GetInstance().GetTcEquipData(equipInfo.id).grade);
            for(let i:number = 0; i < equipInfo.affix.length; i++){
                let attrType = new AttrType(equipInfo.affix[i].type, equipInfo.affix[i].value);
                info.InsertAttrType(attrType);
            }
            info.TypeID = this.id_list[info.Id]++;

            this.equip_list.push(info);
            this.listSort();
            LeanCloud.GetInstance().SaveEquipData();
        }

        public InsertEquipList(list:any):void{
            if(list.length == 0) return;

            for(let i of list){
                let info = new EquipInfo(i, 0, TcManager.GetInstance().GetTcEquipData(i).grade);
                this.Add(info);
            }
            LeanCloud.GetInstance().SaveEquipData();
        }

        /** 移除装备信息 */
        public RemoveEquipInfo(info:EquipInfo):void{
            for(let i:number = 0; i < this.equip_list.length; i++){
                if(info.Id == this.equip_list[i].Id && info.TypeID == this.equip_list[i].TypeID){
                    for(let j:number = i; j < this.equip_list.length - 1; j++){
                        this.equip_list[j] = this.equip_list[j + 1];
                    }
                    break;
                }
            }
            this.equip_list.pop();
            this.changeIdListNumber(info);
        }

        private changeIdListNumber(info:EquipInfo):void{
            let currHero = HeroData.getHeroData(GameData.curHero);

            let info_list:Array<EquipInfo> = [];
            for(let i in this.equip_list){
                if(this.equip_list[i].Id == info.Id){
                    info_list.push(this.equip_list[i]);
                } 
            }
            this.id_list[info.Id] = info_list.length;
            for(let i:number = 0; i < this.id_list[info.Id]; i++){
                if(currHero.equip == info_list[i].Id && currHero["typeId"] == info_list[i].TypeID)
                    currHero["typeId"] = i;
                info_list[i].TypeID = i;
            }
            info_list = [];
        }

        public set Lucky(val:number){
            this.lucky = val;
        }

        public get Lucky(){
            return this.lucky;
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
        private lucky:number;
        private id_list:Array<number>;
    }

    /** 根据对应的类型和值 来获得对应的字符信息 */
    export function GetAttrInfo(type:number, value:number):string{
        if(type == AttrType.ATTACK) return "攻击+" + value + "%";
        else if(type == AttrType.DEFEND) return "护甲+" + value + "%";
        else if(type == AttrType.BLOOD) return "生命+" + value + "%";
        else if(type == AttrType.CRIT) return "暴击+" + value + "%";
        else if(type == AttrType.DODGE) return "闪避+" + value + "%";
    }

    export function GetEquipLvFromValue(value):any{

        if(value == 0) return {color:0x858685,img:"star_00_png"};

        if(value < 20){
            return {color:0x858685,img:"star_01_png"};
        }
        else if(value >= 20 && value < 40)
        {
            return {color:0x5e972b,img:"star_02_png"};
        }
        else if(value >= 40 && value < 60)
        {
            return {color:0x2f76b0,img:"star_03_png"};
        }
        else if(value >= 60 && value < 80)
        {
            return {color:0x852f9b,img:"star_04_png"};
        }
        else if(value >= 80)
        {
            return {color:0xab5515,img:"star_05_png"};
        }
    }

    /** 计算升级成功的概率 */
    export function GetSuccessGoodsLv(upInfo:EquipInfo, consumeInfo:EquipInfo):number{
        let consumeData:any = TcManager.GetInstance().GetTcEquipStarUpData(consumeInfo.Quality, consumeInfo.Star);
        let upData:any = TcManager.GetInstance().GetTcEquipStarUpData(upInfo.Quality, upInfo.Star + 1);
        let successRate:number = Math.floor((consumeData.bassValue / upData.needValue) * 100 );

        return successRate;
    }
}