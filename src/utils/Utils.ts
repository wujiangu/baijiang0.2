/**
 * 工具
 */
namespace Utils {
    /**
     * 创建文本
     * @param str   显示的内容
     * @param x,y   文本的位置
     * @param size  文本的大小(默认24)
     * @param color 文本的颜色(默认白色)
     */
    export function createText(str:string, x:number, y:number, size:number = 24, color:number = 0xFFFFFF):egret.TextField{
        let text  = new egret.TextField();
        text.text = str;
        text.x    = x;
        text.y    = y;
        text.size = size;
        text.textColor = color;
        return text;
    }
    /**
     * 创建位图
     * @param name  位图的ID
     */
    export function createBitmap(name:string):egret.Bitmap {
        let bitMap = new egret.Bitmap();
        let texture:egret.Texture = RES.getRes(name);
        bitMap.texture = texture;
        return bitMap;
    }

    //设置控件位置
    export function setControlPosition(control:any, x:number, y:number):void{
        control.x = x;
        control.y = y;
    }

	/**
	 * @judgement the toggleButton status
	 * 判断叠层的状态
	 */
	export function viewStackStatus(viewstack:eui.ViewStack, toggleButton:any[], index:number): void{
		viewstack.selectedIndex = index;
		for (let i = 0; i < toggleButton.length; i++) {
			if (i != index) {
				toggleButton[i].selected = false;
			}
			else{
				toggleButton[i].selected = true;
			}
		}
	}
	/**
	 * @judgement the toggleButton status
	 * 判断切换按键的状态
	 */
	export function toggleButtonStatus(toggleButton:any[], index:number): void{
		for (let i = 0; i < toggleButton.length; i++) {
			if (i != index) {
				toggleButton[i].selected = false;
			}
			else{
				toggleButton[i].selected = true;
			}
		}
	}
    /**
     * 判断内存中是否已有界面，如有直接取出，没有则创建
     */
    export function getInterface(nextCls, own = GameLayerManager.gameLayer().panelLayer):any {
        let child;
        if (!own.getChildByName(nextCls.prototype['__class__'])) {
            child = new nextCls();
            Common.log("创建界面"+own.getChildByName(nextCls.prototype['__class__']));
        }else{
            child = own.getChildByName(nextCls.prototype['__class__']);
            Common.log("读取界面");
        }
        return child;
    }

    /**
     * 创建位图字体
     */
    export function createBitmapText(name:string, parent:any = null):egret.BitmapText {
        let bitmapText:egret.BitmapText = new egret.BitmapText();
        let font = RES.getRes(name);
        bitmapText.font = font;
        if (parent) parent.addChild(bitmapText);
        return bitmapText;
    }

    /**
     * 深复制对象方法
     */
    export function cloneObj(obj) {  
        var newObj = {};  
        if (obj instanceof Array) {  
            newObj = [];  
        }  
        for (var key in obj) {  
            var val = obj[key];    
            newObj[key] = typeof val === 'object' ? cloneObj(val): val;  
        }  
        return newObj;  
    }; 
}