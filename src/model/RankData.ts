class RankData{
    public constructor(){
        this.data_list = [];
    }

    public static Instance:RankData;
    public static GetInstance():RankData{
        if(this.Instance == null){
            this.Instance = new RankData();
        }
        return this.Instance;
    }

    public GetRankNum():number{
        return this.data_list.length;
    }

     /** 根据伤害值获得伤害索引 */
    public GetIndexFromDamage(damage:number):number{
         for(let i:number = 0; i < this.data_list.length; i++){
            if(this.data_list[i].roleName == UserDataInfo.GetInstance().GetBasicData("roleName")){
                return i + 1;
            }
        }
        return -1;
    }

    public GetDataList():any{
        return this.data_list;
    }

    public ReqRankData(callBack:Function):void{
        HttpRequest.getInstance().send("GET", "rank",{},(data)=>{
            this.data_list = data.rank;
            if(callBack) callBack();
        }, this);
    }

    private data_list:any;
}