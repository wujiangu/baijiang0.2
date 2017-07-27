class UserDataInfo{
    public constructor(){
        this.basicData = {};
    }

    public static instance:UserDataInfo;
    public static GetInstance():UserDataInfo{
        if(this.instance == null){
            this.instance = new UserDataInfo();
        }
        return this.instance;
    }

    public SaveData(data:any):void{
        this._userInfo = data;
    }

    public getUserInfo():any {
        return this._userInfo;
    }

    public SetBasicData(name:string, val:any):void{
        this.basicData[name] = val;
    }

    public GetBasicData(name:string):any{
        return this.basicData[name];
    }

    /** 判断是否有足够的物品
     * @param name 当前物品名字
     * @param needNum 当前物品需要的量
     * @param func 回调函数
     */
    public IsHaveGoods(name:string, needNum:number):boolean{
        if(this.basicData[name] >= needNum){
            this.SetBasicData(name, this.basicData[name] - needNum);
            return true;
        }
        return false;
    }

    /** 判断是否有足够的物品 两件或者两件以上 */
    public IsHaveOhterGoods(name1:string, need1:number, name2:string, need2:number):boolean{
        if(this.basicData[name1] >= need1 && this.basicData[name2] >= need2){
            this.SetBasicData(name1, this.basicData[name1] - need1);
            this.SetBasicData(name2, this.basicData[name2] - need2);
            return true;
        }
        return false;
    }

    /** 移除想要删除的文件根据索引 */
    public RemoveEmailFromIndex(index:number):void{
        if(index < 0 || index > this.basicData["email"].length) return;

        for(let i:number = 0; i < this.basicData["email"].length; i++){
            if(i == index){
                for(let j:number = i + 1; j < this.basicData["email"].length; j++){
                    this.basicData["email"][j - 1] = this.basicData["email"][j];
                }
                break;
            }
        }
        this.basicData["email"].pop();
    }

    /**用户数据 */
    private _userInfo:any;
    private basicData:any;
}