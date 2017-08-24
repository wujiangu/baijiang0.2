/** 窗口管理类 */
class WindowManager{
    public constructor(){
        this.obj_list = {};
    }

    public static Instance:WindowManager;
    public static GetInstance():WindowManager{
        if(this.Instance == null){
            this.Instance = new WindowManager();
        }
        return this.Instance;
    }

    public getObjFromStr(strName:string):any{
        for(let key in this.obj_list){
            if(key == strName) return this.obj_list[key];
        }
        return null;
    }

    public GetWindow(strName:string):PopupWindow{
        let result:PopupWindow = this.getObjFromStr(strName);
        if(result == null){
            result = this.GetClassName(strName);
            result.Init();
            this.obj_list[strName] = result;
        }
        result.Reset();
        this.lastPopupWindowName = strName;
        return result;
    }

    public CloseAllWindow():void{
        for(let key in this.obj_list) this.obj_list[key].Close();
    }

    public CloseLastWindow():void{
        for(let key in this.obj_list){
            if(key == this.lastPopupWindowName){
                this.obj_list[key].Close();
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
