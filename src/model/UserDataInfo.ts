class UserDataInfo{
    public constructor(){
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

    public SetBasicData(data:any,callBack:Function = null):void{
        for(let key in data){
            this.userData[key] = data[key];
        }
        
        HttpRequest.getInstance().send("POST", "userinfo",data,()=>{
            if(callBack) callBack();
        },this);
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

    private isDifferentTime():boolean{
        let strOffTime:string = new Date(this.userData.lastOffLineTime * 1000).toLocaleDateString();
        let loginTime:string = new Date(modLogin.getBaseData("time") * 1000).toLocaleDateString();
        let off_list:any = strOffTime.split("/");
        let login_list:any = loginTime.split("/");
        if(off_list[0] != login_list[0] || off_list[1] != login_list[1] || off_list[2] != login_list[2]){
            return true;
        }
        return false;
    }

    public InitSignData():void{
        HttpRequest.getInstance().send("GET","checkin",{},(data)=>{
            let checkData:any = data.checkIn;
            this.isSign = checkData.isSign;
            this.signNum = checkData.signNum;

            if(this.isDifferentTime()){
                if(this.isSign){
                    this.isSign = false;
                }
                if(this.signNum >= 14){
                    this.signNum = 7;
                }
                this.setSignData(this.signNum, this.isSign);
                this.DealUserData("sportCount", 0);
            }
        },this);
    }

    public GetSignData(){
        return {isSign:this.isSign, signNum:this.signNum};
    }

    public setSignData(signNum:number, isSign:boolean){
        this.signNum = signNum;
        this.isSign = isSign;
        HttpRequest.getInstance().send("POST", "checkin", {signNum:signNum,isSign:isSign?1:0},()=>{}, this);
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

    /**用户数据 */
    private userData:any;
    private isSign:boolean;
    private signNum:number;
}