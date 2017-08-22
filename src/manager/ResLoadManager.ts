/** res load manager
 * @author hong
 * @date  2017/8/22
 */

class ResLoadManager{
    public constructor(){
        this.load_list = {};
    }

    public static Instance:ResLoadManager;
    public static GetInstance():ResLoadManager{
        if(this.Instance == null){
            this.Instance = new ResLoadManager();
        }
        return this.Instance;
    }

    public LoadGroup(name:string, listener:Function):void{
        if(this.load_list[name] == null){
            this.load_list[name] = 1;
            RES.loadGroup(name);
            this.isLoad = true;
            this._listener = listener;
            Animations.ShowLoadAnimation();
        }
        else
        {
            if(listener) listener();
        }
    }

    public Listener():void{
        if(this._listener){
            Animations.HideLoadAnimation();
            this._listener();
        } 
    }

    public set IsLoad(val:boolean){
        this.isLoad = val;
    }

    public get IsLoad(){
        return this.isLoad;
    }

    private isLoad:boolean = false;
    private load_list:any;
    private _listener:Function;
}