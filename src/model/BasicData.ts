/** basic data */
module ModBasic{
    /** diamond */
    export var PACKDIAMOND:number = 50;         //购买礼包的钻石数量
    export var RESETDIAMOND:number = 20;        //洗练的钻石价格
    export var QUICKPURCHASE:number = 100;      //快速购买
    export var RESETTALENT:number = 50;         //重置天赋
    export var PURCHASETALENT:number = 50;      //购买天赋


    /** soul */
    export var UPSTARSOUL:number = 10000;       //武器升星所需的魂石数量
    export var PACKSOUL:number = 1000;          //礼包的魂石

    /** exp */
    export var PACKEXP:number = 20000;          //礼包的经验

    /** other */
    export var BUY:number = 1;          //buy goods
    export var GET:number = 2;          //get goods

    export var KILLNUM:number = 1000;       //杀敌数量
    export var BasicNameList:any = {diamond:"钻石",soul:"魂石",power:"天赋点",exp:"经验"};

    /** box type */
    export var IRONBOX:number = 1;
    export var SILVERBOX:number = 2;
    export var GOLDBOX:number = 3;

    //deal type
    export var EQUIP_TYPE:number = 1;
    export var GOODS_TYPE:number = 2;
    export var HERO_TYPE:number  = 3;

    /** select show animation */
    export var NORMALTYPE:number = 1;
    export var BATTLETYPE:number = 2;
}