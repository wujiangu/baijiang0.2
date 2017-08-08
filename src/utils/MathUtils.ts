/**
 * 数学计算相关
 */
namespace MathUtils {
    /**
     * 直线公式，已知指定的两个点，确定一条直线
     * y = k * x + b，此函数即返回k = point.x和b = point.y
     * @param p1 一个点对象(点击的点)
     * @param p2 另外一个点对象(初始的点)
     * @return (kb) 返回直线公式的两个参数
     * */
    export function lineFunc(p1X:number, p1Y:number, p2X:number, p2Y:number):any{
        var k:number;
        var b:number;
        var kb:any = {};
        if (p1X == p2X) {
            //垂直线
            kb["k"] = -1;
            //向上
            if (p1Y <= p2Y) {
                kb["b"] = 0;
            }else{
                kb["b"] = 1;
            }
        }
        else if (p1Y == p2Y) {
            //水平线
            kb["k"] = 0;
            //向左
            if (p1X <= p2X) {
                kb["b"] = 0;
            }else{
                kb["b"] = 1;
            }
        }
        else{
            //普通线
            kb["k"] = (p1Y - p2Y) / (p1X - p2X);
            kb["b"] = p1Y - (p1Y - p2Y) / (p1X - p2X) * p1X;
        }
        return kb;
    }

    /**
     * 已知一条直线的公式和一个点的坐标，确定其垂直直线的公式(暂不考虑水平和垂直的线)
     */
    export function getVerticalLine(k:number, x:number, y:number) {
        var kb:any = {};
        kb["k"] = -1/k;
        kb["b"] = y - (kb["k"] * x);
        return kb;
    }

    /**
     * 点到直线的距离(直线公式为:kx-y+b=0)
     */
    export function pointToLineDistance(x:number, y:number, kb:any) {
        var dis:number = 0;
        var disQ:number = kb["k"] * kb["k"] + 1;
        dis = Math.abs(kb["k"]*x - y + kb["b"])/Math.sqrt(disQ);
        return dis;
    }

    /**
     * 直线的角度
     * @param point0
     * @param point1
     * @returns {number}
     */
    export function getLineAngle(point0:egret.Point, point1:egret.Point):number {
        var tmp_x:number = point1.x - point0.x;
        var tmp_y:number = point1.y - point0.y;
        var tmp_angle:number = -Math.atan2( tmp_y, tmp_x );
        return tmp_angle;
    }

    /**
     * 弧度转角度
     */
    export function radianToAngle(radian:any):number {
        let angle = Math.floor(180*(radian/Math.PI));
        return angle;
    }

    /**
     * 已知直线的长度和角度，以及初始点的坐标，根据三角函数公式确定另一个坐标
     * @param p1 初始坐标(人物坐标)
     * @param angle 直线的角度
     * @param distance 距离
     * @return (Point) 返回另一个坐标
     */
    export function coordinate(p1:egret.Point, angle:number, distance:number):any {
        var point:any = {};
        var dx:number = distance*Math.cos(angle);
        var dy:number = distance*Math.sin(angle);
        point["x"] = p1.x + dx;
        point["y"] = p1.y - dy;
        return point;
    }

    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    export function getAngle(radian:number):number {
        return 180 * radian / Math.PI;
    }

    /**
     * 角度值转换为弧度制
     * @param angle
     */
    export function getRadian(angle:number):number {
        return angle / 180 * Math.PI;
    }

    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    export function getRadian2(p1X:number, p1Y:number, p2X:number, p2Y:number):number {
        var xdis:number = Math.round(p2X - p1X);
        var ydis:number = Math.round(p2Y - p1Y);
        var tmp_angle:number = Math.atan2(ydis, xdis);
        var angle = parseFloat(tmp_angle.toFixed(2));
        return angle;
    }

    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    export function getDistance(p1X:number, p1Y:number, p2X:number, p2Y:number):number {
        var disX:number = Math.round(p2X - p1X);
        var disY:number = Math.round(p2Y - p1Y);
        var disQ:number = disX * disX + disY * disY;
        var temp:number = InvSqrt(disQ);
        var dis:number = 1/temp;
        return Math.floor(dis);
    }

    /**获取两点的中点坐标 */
    export function getMidCoordinate(x1:number, y1:number, x2:number, y2:number) {
        var point:any = {};
        var x:number = (x1 + x2)/2;
        var y:number = (y1 + y2)/2;
        point["x"] = x;
        point["y"] = y;
        return point;
    }

    /**获取从n~m之间的随机数 */
    export function getRandom(...args:any[]) {
        let argsLen:number = args.length;
        let random:number;
        switch (argsLen) {
            case 0:
                random = Math.random();
            break;
            case 1:
                random = Math.floor((args[0] + 1)*Math.random());
            break;
            default:
                random = Math.floor(Math.random()*(args[1]-args[0]+1) + args[0]);
            break;
        }
        return random;
    }

   function isObject(o) {
       return Object.prototype.toString.call(o) === '[object Object]';
   }
   function isArray(o) {
       return Object.prototype.toString.call(o) === '[object Array]';
   }
   /**
    * 合并数组内相同的元素并返回新的数组
    */
   export function duplicate(arr) {
       var tmp;
       if (!arr || arr.length === 0) {
           return [];
       }
       for (var i = 0, len = arr.length; i < len; i++) {
           tmp = arr[i];
           if (isArray(tmp)) {
               for (var j = i + 1; j < len; j++) {
                   if (isArray(arr[j]) && tmp.length === arr[j].length) {
                       var flag = false;
                       for (var k = 0; k < tmp.length; k++) {
                           if (tmp[k] !== arr[j][k]) {
                               flag = true;
                               break;
                           }
                       }
                       if (!flag) {
                           arr.splice(j, 1);
                           len--;
                           j--;
                       }
                   }
               }
           } else if (isObject(tmp)) {
               for (var j = i + 1; j < len; j++) {
                   if (isObject(arr[j])) {
                       var tmpKey = [], objKey = [], flag = false;
                       for (var key in tmp) {
                           tmpKey.push(key);
                       }
                       for (var l in arr[j]) {
                           objKey.push(l);
                       }
                       if (tmpKey.length === objKey.length) {
                           for (var key in tmp) {
                               if (tmp[key] !== arr[j][key]) {
                                   flag = true;
                                   break;
                               }
                           }
                       }
                       if (!flag) {
                           arr.splice(j, 1);
                           len--;
                           j--;
                       }
                   }
               }
           } else {
               for (var j = i + 1; j < len; j++) {
                   if (tmp === arr[j]) {
                       arr.splice(j, 1);
                       len--;
                       j--;
                   }
               }
           }
       }
       return arr;
   }

   /**
    * 随机count次数值，所有数值之和为sum，每次数值至少为1
    */
    export function randomStage(sum:number, count:number) {
        let array:Array<number> = new Array();
        let tempSum:number = 0;
        for (let i = 0; i < count; i++) {
            if (i == count - 1) {
                array.push(sum - tempSum - array[i-1]);
                break;
            }
            if (array.length > 0) {
                tempSum += array[i-1];
            }
            let maxValue:number = sum - tempSum - (count - (i+1))*5;
            let data:number = getRandom(5, maxValue);
            array.push(data);
        }
        return array;
    }

    /**
     * 平方根倒数
     */
    export function InvSqrt(n:number, precision:number = 1) {
        let y = new Float32Array(1);
        let i = new Int32Array(y.buffer);
        y[0] = n;
        i[0] = 0x5f375a86 - (i[0] >> 1);
        for (let iter = 0; iter < precision; iter ++) {
            y[0] = y[0] * (1.5 - ((n * 0.5) * y[0] * y[0]));
        }
        return y[0];
    }
}