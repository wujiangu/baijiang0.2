/**
 * 舞台管理
 */
class StageManager {
    public static stageResizeInitData():void {
        //按照宽缩放，perW 为内容缩放比例
        var perW = Common.SCREEN_W / StageManager.contentWidth;
        var tempH = StageManager.contentHeight * perW;
        //如果缩放后的高是在分辨率中的
        if (tempH <= Common.SCREEN_H) {
            //内容全屏缩放的宽 等于 内容的宽
            StageManager.contentScaleFullWidth = StageManager.contentWidth;
            //内容全屏缩放的高 等于 舞台的高 / 除以缩放比例 ，这么做是为了，当设置缩放比例为 preW 的时候，能保证全屏
            StageManager.contentScaleFullHeight = Common.SCREEN_H / perW;

            //设置缩放比例
            StageManager.contentScale = StageManager.contentScaleFull = perW;
        } else {
            //按照高缩放，perH 为内容缩放比例
            var perH = Common.SCREEN_H / StageManager.contentHeight;
            var tempW = StageManager.contentWidth * perH;
            //如果缩放后的宽是在分辨率中
            if (tempW <= Common.SCREEN_W) {
                //内容全屏缩放的高 等于 内容的高
                StageManager.contentScaleFullHeight = StageManager.contentHeight;
                //内容全屏缩放的宽 等于 舞台的宽 / 除以缩放比例 ，这么做是为了，当设置缩放比例为 preH 的时候，能保证全屏
                StageManager.contentScaleFullWidth = Common.SCREEN_W / perH;

                //设置缩放比例
                StageManager.contentScale = StageManager.contentScaleFull = perH;
            }
        }
    }

    public static contentWidth: number = 1136;
    public static contentHeight: number = 640;

    public static contentScaleFullWidth: number = 0; //内容全屏缩放后的宽
    public static contentScaleFullHeight: number = 0; //内容全屏缩放后的高

    public static contentScale: number = 1; //内容等比缩放
    public static contentScaleFull: number = 1; //内容全屏缩放
}