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

    private isHighDamage(damage):boolean{
        for(let i:number = 0; i < this.data_list.length; i++){
            if(damage > this.data_list[i]["damage"]){
                let len = this.data_list.length > 99 ? 99 : this.data_list.length;
                if(len < 99) this.data_list[len] = {};
                for(let j:number = len; j > i; j--){
                    this.data_list[j]["damage"] = this.data_list[j - 1]["damage"];
                    this.data_list[j]["name"] = this.data_list[j - 1]["name"];
                }
                this.data_list[i]["damage"] = damage;
                this.data_list[i]["name"] = damage + "";
                LeanCloud.GetInstance().SaveRankData();
                return true;
            }
        }
        return false;
    }

    public InsertData(damage:number):void{
       UserData.RoleName = "" + damage;
       UserData.rankDamage = damage;
       if(!this.isHighDamage(damage)){
           if(this.data_list.length < 100){
                let len = this.data_list.length;
                this.data_list[len] = {};
                this.data_list[len]["name"] = "" + damage;
                this.data_list[len]["damage"] = damage;
                LeanCloud.GetInstance().SaveRankData();
           }
       }
    }

    public GetRankNum():number{
        return this.data_list.length;
    }

     /** 根据伤害值获得伤害索引 */
    public GetIndexFromDamage(damage:number):number{
         for(let i:number = 0; i < this.data_list.length; i++){
            if(this.data_list[i].damage == damage){
                return i + 1;
            }
        }
        return -1;
    }

    public FindDataFromId():any{
        for(let i:number = 0; i < this.data_list.length; i++){
            if(this.data_list[i]["ObjectId"] == LeanCloud.ObjectId){
                return {index:(i + 1), data:this.data_list[i]};
            }
        }
        return null;
    }

    public GetDataList():any{
        return this.data_list;
    }

    public InitDataList(val:any):void{
        for(let i:number = 0; i < val.length; i++){
            this.data_list[i] = {};
            this.data_list[i]["name"] = val[i].name;
            this.data_list[i]["damage"] = val[i].damage;
        }
    }

    public set ChallengeNum(val:number){
        this.challengeNum = val == null ? 0 : val;
    }

    public get ChallengeNum(){
        return this.challengeNum;
    }

    private data_list:any;
    private challengeNum:number;
}