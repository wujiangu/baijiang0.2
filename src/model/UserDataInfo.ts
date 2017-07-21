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

    public SetBasicData(name:string, val:number):void{
        this.basicData[name] = val;
    }

    public GetBasicData(name:string):number{
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

    /**用户数据 */
    private _userInfo:any;
    private basicData:any;
}