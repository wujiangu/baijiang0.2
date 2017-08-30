/** res load manager
 * @author hong
 * @date  2017/8/22
 */

class ResLoadManager{
    public constructor(){
        this.load_list = {};
        this._configs = new Array();
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
            this._name     = name;
            Animations.ShowLoadAnimation();
        }
        else
        {
            if(listener) listener();
        }
    }

    public Listener():void{
        // if(this._name == "ready" || this._name == "battle") ConfigManager.InitBattleConfig(this._name);
        if(this._name == "ready" || this._name == "battleGroup" || this._name == "pvpGroup" || this._name == "battleBack") {
                ConfigManager.InitBattleConfig(this._name);
        }

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

    /**
     * 添加一个配置文件
     * @param jsonPath res.json文件路径
     * @param filePath 资源路径
     */
    public addConfig(jsonPath:string, filePath:string):void {
        this._configs.push([jsonPath, filePath]);
    }

    /**
     * 开始加载配置文件
     * 
     */
    public startLoadConfig(onComplete:Function, onCompleteObj:any):void {
        this._onComplete = onComplete;
        this._onCompleteObj = onCompleteObj;
        this.loadNextConfig();
    }

    /**
     * 加载下一个配置文件
     */
    private loadNextConfig():void {
        if (this._configs.length == 0) {
            //配置文件加载完成
            this._onComplete.call(this._onCompleteObj);
            this._onComplete = null;
            this._onCompleteObj = null;
            return;
        }

        //获取第一个配置文件
        let config:any = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onCompleteHandle, this);
        RES.loadConfig(config[0], config[1]);
    }

    /**
     * 单个配置文件加载完成回调
     */
    private onCompleteHandle():void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onCompleteHandle, this);
        this.loadNextConfig();
    }


    /**配置文件 */
    private _configs:Array<any>
    /**所有配置文件加载完成回调 */
    private _onComplete:Function;
    /**加载配置文件完成回调所属对象 */
    private _onCompleteObj:any;
    private isLoad:boolean = false;
    private load_list:any;
    private _listener:Function;
    private _name:string;
}