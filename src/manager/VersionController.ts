/**
 * 版本控制器
 */
class VersionController {
    /**
     * 初始化并创建一个版本控制器
     */
    public static initVc():void {
        this.vc = new RES.VersionController();
    }

    /**
     * 对指定的资源进行版本控制(修改资源的版本)
     */
    public static modifiedVersion():void {
        this.initVc();
        for (let i = 0; i < this.vcList.length; i++) {
            Common.log("路径---->", this.vcList[i]);
            this.getUrlAndRegister(this.vcList[i]);
        }
    }

    /**
     * 获取实际资源的url并注入版本控制器
     */
    private static getUrlAndRegister(url:string) {
        this.vc.getVirtualUrl = function(url:string):string {
            return url + "?v=" + window["Version"];
        }
        RES.registerVersionController(this.vc);
    }

    private static vc:RES.VersionController;
    private static vcList:Array<any> = [
        "resource/config/heroConfig.json",
    ]
}