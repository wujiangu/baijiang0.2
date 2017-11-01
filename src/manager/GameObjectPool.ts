/**
 * 对象池管理
 */
class GameObjectPool {
    /**
     * 从对象池中获取实例
     * 传入class名称，获取class的实例
     */
    public static pop(name:string, className:string, ...args:any[]):any {
        let poolName = name + className;
        if (!GameObjectPool._poolData[poolName]) {
            GameObjectPool._poolData[poolName] = [];
        }
        let list:Array<any> = GameObjectPool._poolData[poolName];
        if (list.length) {
            return list.pop();
        }else{
            let item:any;
            let cls:any = egret.getDefinitionByName(className);
            let argsLen:number = args.length;
            if (argsLen == 0) {
                item = new cls();
            }
            else if (argsLen == 1) {
                item = new cls(args[0]);
            }
            else if (argsLen == 2) {
                item = new cls(args[0], args[1]);
            }
            item.ObjectKey = poolName;
            return item;
        }
    }

    /**
     * 释放object，使object回到pool池，可以继续重复利用
     */
    public static push(obj:any) {
        if (!obj) return;
        let name:string = obj.ObjectKey;
        // Common.log("回收", name);
        if (!GameObjectPool._poolData[name]) return;
        GameObjectPool._poolData[name].push(obj);
    }

    /**
     * 清除所有的对象
     */
    public static clear() {
        GameObjectPool._poolData = {};
    }

    /**
     * 检查对象池是否有特定名称的对象
     */
    public static hasObject(name:string):boolean {
        if (!GameObjectPool._poolData[name]) return false;
        return true;
    }

    /**
     * 查询对象池
     */
    public static Inquire():any {
        return GameObjectPool._poolData;
    }

    /**池数据 */
    private static _poolData:any = {}
}