/** 窗口管理类 */
class WindowManager{
    public constructor(){
        this.obj_list = [];
    }

    public static Instance:WindowManager;
    public static GetInstance():WindowManager{
        if(this.Instance == null){
            this.Instance = new WindowManager();
        }
        return this.Instance;
    }

    public getObjFromStr(strName:string):any{
        for(let i:number = 0; i < this.obj_list.length; i++){
            if(this.obj_list[i].str == strName) return this.obj_list[i].obj;
        }
        return null;
    }

    public GetWindow(strName:string):PopupWindow{
        let result:PopupWindow = this.getObjFromStr(strName);
        if(result == null){
            result = this.GetClassName(strName);
            result.Init();
            let data:any = {str:strName, obj:result};
            this.obj_list.push(data);
        }
        result.Reset();
        this.lastPopupWindowName = strName;
        return result;
    }

    public CloseAllWindow():void{
        this.obj_list.foreach(e=>{
            e.obj.Close();
        })
    }

    public CloseLastWindow():void{
        for(let i:number = 0; i < this.obj_list.lengthl; i++){
            if(this.lastPopupWindowName == this.obj_list[i].str){
                this.obj_list[i].obj.Close();
                break;
            }
        }
    }

    private GetClassName(clsName:string):any{
        let instance;
        try{
            instance = Object.create(window[clsName].prototype);
            instance.constructor.apply(instance);
        }
        catch(error){

        }

        return instance;
    }

    private obj_list:any;
    private lastPopupWindowName:string;
}
