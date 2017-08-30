class UserDataInfo{
    public constructor(){
        this.login_time_list = new Array();
    }

    public static instance:UserDataInfo;
    public static GetInstance():UserDataInfo{
        if(this.instance == null){
            this.instance = new UserDataInfo();
        }
        return this.instance;
    }

    public SaveData(data:any):void{
        this.userData = data;
    }

    public getUserInfo():any {
        return this.userData;
    }

    public SetBasicData(data:any):void{
        for(let key in data){
            this.userData[key] = data[key];
        }
        this.ReqUpdateData(data);
    }

    public DealUserData(name:string, val:number):void{
        let tempData = {}
        tempData[name] = val;
        this.SetBasicData(tempData);
    }

    public GetBasicData(name:string):any{
        return this.userData[name];
    }

    /** 判断是否有足够的物品
     * @param name 当前物品名字
     * @param needNum 当前物品需要的量
     * @param func 回调函数
     */
    public IsHaveGoods(name:string, needNum:number):boolean{
        if(this.userData[name] >= needNum){
            this.DealUserData(name, this.userData[name] - needNum);
            return true;
        }
        return false;
    }

    /** 判断是否有足够的物品 两件或者两件以上 */
    public IsHaveOhterGoods(name1:string, need1:number, name2:string, need2:number):boolean{
        if(this.userData[name1] >= need1 && this.userData[name2] >= need2){
            let tempData = {};
            tempData[name1] = this.userData[name1] - need1;
            tempData[name2] = this.userData[name2] - need2;
            this.SetBasicData(tempData);
            return true;
        }
        return false;
    }

    private ReqUpdateData(data):void{
        HttpRequest.getInstance().send("POST", "userinfo",data,()=>{},this);
    }

    /** 移除想要删除的文件根据索引 */
    public RemoveEmailFromIndex(index:number):void{
        if(index < 0 || index > this.userData["email"].length) return;

        for(let i:number = 0; i < this.userData["email"].length; i++){
            if(i == index){
                for(let j:number = i + 1; j < this.userData["email"].length; j++){
                    this.userData["email"][j - 1] = this.userData["email"][j];
                }
                break;
            }
        }
        this.userData["email"].pop();
    }

    public GetLastLoginTime():any{
        return this.login_time_list;
    }

    public IsDifferenceDate(val:any):boolean{
        let date = new Date();
        if(val == null){
            this.login_time_list = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
            return true;
        }

        if(date.getFullYear() == val[0] && date.getMonth() + 1 == val[1] && val[2] == date.getDate()) return false;
        else if(date.getFullYear() != val[0] || date.getMonth() + 1 != val[1] || date.getDate() != val[2]){
            this.login_time_list = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
        }
        return true;
    }

    /**用户数据 */
    private userData:any;
    private login_time_list:Array<number>;
}