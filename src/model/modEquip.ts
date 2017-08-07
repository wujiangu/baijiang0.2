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
        public static UPSTARCONSUME:number = 10000;
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

       public constructor(id:number, star:number, quality:number, lv:number = 1){
           this.id   = id;
           this.star = star;
           this.quality = quality;
           this.lv   = lv;
           this.typeID = 0;
           this.attrType = [];
           this.attr_list = [];
           this.origin_attr_list = [];

           let tempData:any = TcManager.GetInstance().GetEquipUpAttrFromGrade(quality);
           for(let i:number = 0; i < 4; i++){
               this.origin_attr_list[i] = tempData.init[i];
               this.attr_list[i] = GetEquipUpAttr(this, 1, i);
            }
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

        public ChangeAttrType(index:number, type:number, value:number, quality:number):void{
            if(index < 0 || index > this.attrType.length) return;
            this.attrType[index].Type  = type;
            this.attrType[index].Value = value;
            this.attrType[index].Quality = quality;
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
            for(let i:number = 0; i < 4; i++){
                this.attr_list[i] = attrList[i];
            }
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

        private id:number;                      //装备id
        private lv:number;                      //装备等级
        private star:number;                    //装备星级
        private quality:number;                 //装备的品质
        private typeID:number;                  //装备的类型id 主要是区别id一样的时候不同的typeid
        private attr_list:Array<number>;        //[1]生命[2]护甲[3]攻击[4]暴击[5]闪避
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
                let attrType = new AttrType(equipInfo.affix[i].type, equipInfo.affix[i].value, 0);
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
        if(type == AttrType.ATTACK) return "攻击+" + Math.ceil(value);
        else if(type == AttrType.DEFEND) return "护甲+" + Math.ceil(value);
        else if(type == AttrType.BLOOD) return "生命+" + Math.ceil(value);
        else if(type == AttrType.CRIT) return "暴击+" + Math.ceil(value * 10) / 10 + "%";
        else if(type == AttrType.DODGE) return "闪避+" + Math.ceil(value) + "%";
    }

    /** 计算升级成功的概率 */
    export function GetSuccessGoodsLv(upInfo:EquipInfo, consumeInfo:EquipInfo):number{
        let consumeData:any = TcManager.GetInstance().GetTcEquipStarUpData(consumeInfo.Quality, consumeInfo.Star);
        let upData:any = TcManager.GetInstance().GetTcEquipStarUpData(upInfo.Quality, upInfo.Star + 1);
        let successRate:number = Math.floor((consumeData.bassValue / upData.needValue) * 100 );

        return successRate;
    }

    let reset_list:any = [[[150,250],[18,30],[150,250],[0,4]],[[200,280],[22,36],[200,280],[1,4]],[[250,320],[26,42],[250,320],[2,4]],
                 [[280,360],[31,45],[280,360],[2,5]],[[320,380],[35,48],[320,380],[3,5]]];
    let complete:any = [0.25,0.34,0.5,0.75,1]
    export function GetResetEquipData(info:EquipInfo):any{
        let type:number = Math.floor((Math.random() * 100) % 4), value:number = 0;
        let quality:number = Math.floor(Math.random() * 100 % 5);
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

    export function GetEquipColorFromQuality(quality:number,type:number = 1):any{
        let imgName:string = type == 1 ? "star" : "point";

        if(quality == null || quality == -1) return {color:0x858685,img:imgName + "_00_png"};
        if(quality == 0) return {color:0x858685,img:imgName + "_01_png"};
        else if(quality == 1) return {color:0x5e972b,img:imgName + "_02_png"};
        else if(quality == 2) return {color:0x2f76b0,img:imgName + "_03_png"};
        else if(quality == 3) return {color:0x852f9b,img:imgName + "_04_png"};
        else if(quality == 4) return {color:0xab5515,img:imgName + "_05_png"};
    }

    let star_up_attr:any = [7.047,0.688,7.13,0.0291];
    let star_init_attr:any = [300,50,200,0];
    export function GetEquipUpAttr(info:EquipInfo, lv:number, index:number):number{
        let value:number = 0;
        let upData:any = TcManager.GetInstance().GetEquipUpAttrFromGrade(info.Quality);
        let equipData:any = TcManager.GetInstance().GetTcEquipData(info.Id);
        let attr_list:any = info.GetAttrType();

        let first:number,second:number = 0,third:number = 0  
        if(info.Star == 0) first = lv * upData.up[index] + info.GetOriginAttr()[index];
        else first = (lv + (info.Quality + info.Star) * 100) * star_up_attr[index] + star_init_attr[index];

        if(equipData.attr[index] == 1) second = upData.character[index] * (info.Star + 1) / upData.character[4];

        if(info.Id > 15 && equipData.attr[2] == 1 && equipData.attr[3] == 1){
            second = upData.character[index] / 2 * (info.Star + 1) / upData.character[4];
        }

       for(let i in attr_list){
           if(index == 0 && attr_list[i].Type == AttrType.BLOOD){
               third += attr_list[i].Value;
           }
           else if(index == 1 && attr_list[i].type == AttrType.DEFEND)
           {
               third += attr_list[i].Value;
           }
           else if(index == 2 && attr_list[i].type == AttrType.ATTACK)
           {
               third += attr_list[i].Value;
           }
           else if(index == 3 && attr_list[i].type == AttrType.CRIT)
           {
               third += attr_list[i].Value;
           }
       }

       value = first + second + third;

        return value;
    }
}