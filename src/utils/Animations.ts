/**
 * 公用动画
 */
namespace Animations {
    //抖动对象特效
    // 1：抖动  2：震动
    export function shakeScreen(target:any, effectType: number = 1): void {
        var panel = target;
        var shakeNum = 20;
        var oldX: number = panel.x;
        var oldY: number = panel.y;
        if (effectType == 1) {
            egret.Tween.get(panel).to({ x: panel.x - 10 }, shakeNum);

            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20 }, shakeNum);
            }, this, shakeNum * 2);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x - 20 }, shakeNum);
            }, this, shakeNum * 3);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 20 }, shakeNum);
            }, this, shakeNum * 4);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: oldX }, shakeNum);
            }, this, shakeNum * 5);
        } else {
            egret.Tween.get(panel).to({ x: panel.x - 2, y: panel.y }, shakeNum);

            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x + 5, y: panel.y }, shakeNum);
            }, this, shakeNum * 2);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y + 3 }, shakeNum);
            }, this, shakeNum * 3);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y - 5 }, shakeNum);
            }, this, shakeNum * 4);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: panel.x, y: panel.y + 2 }, shakeNum);
            }, this, shakeNum * 5);
            egret.setTimeout(function () {
                egret.Tween.get(panel).to({ x: oldX, y: oldY }, shakeNum);
            }, this, shakeNum * 6);
        }
    }

    //淡出淡入
    export function fadeOutIn(target:any, delay:number = 1000):void {
        egret.Tween.get(target).to({ alpha: 1.0 }, 200, egret.Ease.quintOut);
        egret.setTimeout(function () {
                egret.Tween.get(target).to({ alpha: 0 }, 200, egret.Ease.quintIn);
            }, this, delay);
    }

    /**
     * 闪烁
     */
    export function flash(target:any, time:number = 1000, unitTime:number = 100, func:Function = null) {
        let count:number = Math.floor(time/(2*unitTime));
        let num:number = 0;
        var animate = function() {
            egret.Tween.get(target).to({alpha:0.5},unitTime).call(()=>{
                egret.Tween.get(target).to({alpha:1},unitTime).call(()=>{
                    egret.Tween.removeTweens(target);
                    num ++;
                    if (num < count){
                        animate()
                    }else{
                        if (func) func();
                    }
                },this)
            },this);
        }.bind(this);
        animate();
    }

    /**
    * 显示对象上下浮动特效
    * obj           对象
    * time          浮动时间 毫秒
    * space         浮动高度
    */
    export function flyObj(obj, time, space: number = 50): void {
        var onComplete1: Function = function () {
            if (obj != null) {
                var onComplete2: Function = function () {
                    egret.Tween.get(obj).to({ y: obj.y - space }, time).call(onComplete1, this);
                };
                egret.Tween.get(obj).to({ y: obj.y + space }, time).call(onComplete2, this);
            }
        };
        onComplete1();
    }

    //淡出
    export function fadeOut(target:any, time:number = 500, func:Function = null, completeFunc:Function = null):void {
        target.alpha = 0;
        egret.Tween.get(target).to({ alpha: 1.0 }, time, egret.Ease.circOut).call(()=>{
            if (completeFunc) {
                completeFunc();
            }
        });
        if (func) {
            func();
        }
    }
    /**淡入 */
    export function fadeIn(target:any, time:number = 500, func:Function = null):void {
        target.alpha = 1.0;
        egret.Tween.get(target).to({ alpha: 0 }, time, egret.Ease.circIn).call(()=>{
            if (func) {
                func();
            }
        });
    }

    /**放大后缩小 */
    export function zoomIn(target:any, func:Function = null):void {
        egret.Tween.get(target).to({scaleX:6, scaleY:6}, 100, egret.Ease.circOut).call(()=>{
            egret.Tween.get(target).to({scaleX:3, scaleY:3}, 100, egret.Ease.circIn).call(()=>{
                if (func) {
                    func();
                }
            });
        })
    }

    /**
    * str             提示内容
    * effectType      动画类型 1：从下到上弹出 2：从左至右弹出 3：从右至左弹出 4：从中间弹出渐渐消失 5：从大变小 等等
    * isWarning       是否是警告，警告是红色
    */
    export function showTips(str: string = "", effectType: number = 1, isWarning: boolean = false): void {
        switch (effectType) {
            case 1:
                TipsUtils.showTipsDownToUp(str, isWarning);
                break;
            case 2:
                TipsUtils.showTipsLeftOrRight(str, isWarning, true);
                break;
            case 3:
                TipsUtils.showTipsLeftOrRight(str, isWarning, false);
                break;
            case 4:
                TipsUtils.showTipsFromCenter(str, isWarning);
                break;
            case 5:
                TipsUtils.showTipsBigToSmall(str, isWarning);
                break;
            default:
            // TODO: Implemente default case
        }

    }

    /**幕布 */
    var curtainImage:egret.Bitmap;
    /**
     * 场景幕布过度动画
     */
    export function sceneTransition(func:Function):void {
        GameLayerManager.gameLayer().loadLayer.addChild(Common.globalMask);
        if (!curtainImage) {
            curtainImage = Utils.createBitmap("curtain_png");
        }
        curtainImage.alpha = 1.0;
        GameLayerManager.gameLayer().loadLayer.addChild(curtainImage);
        curtainImage.x = Common.SCREEN_W;
        curtainImage.y = 0;
        let toX = Common.SCREEN_W - curtainImage.width;
        egret.Tween.get(curtainImage).to({x:toX}, 600).call(()=>{
            if (func) {
                func();
            }
            egret.Tween.get(curtainImage).to({alpha:0}, 300).call(()=>{
                GameLayerManager.gameLayer().loadLayer.removeChildren();
            });
        });
    }

    /**弹窗弹出动画 */
    export function popupOut(target:any, time:number=500, func:Function=null) {
        target.scaleX = 0;
        target.scaleY = 0;
        egret.Tween.get(target).to({scaleX:1.0, scaleY:1.0}, time, egret.Ease.backOut).call(()=>{
            if (func) func();
        });;
    }

    /**弹窗回收动画 */
    export function popupIn(target:any, time:number=500, func:Function=null) {
        egret.Tween.get(target).to({scaleX:0, scaleY:0}, time, egret.Ease.backIn).call(()=>{
            if (func) func();
        });
    }

    /** 窗口类型弹窗 大图类型
     * @param obj 对象数据
     * @param time 缓动时间
     * @param func 回调函数
     */
    export function PopupBackOut(obj:any, time:number, func?):void{
        obj.scaleX = 0,obj.scaleY = 0;
        obj.x = obj.width / 2;
        obj.y = obj.height / 2;
        egret.Tween.get(obj).to({scaleX:1,scaleY:1,x:0,y:0},time, egret.Ease.backOut).call(()=>{
            egret.Tween.removeTweens(obj);
            if(func) func();
        },this);
    }

    /** 窗口类型缩小效果 */
    export function PopupBackIn(obj:any, time:number, func?){
        egret.Tween.get(obj).to({scaleX:0,scaleY:0,x:obj.width / 2,y:obj.height / 2},time, egret.Ease.backIn).call(()=>{
            egret.Tween.removeTweens(obj);
            if(func) func();
        },this);
    }

    /**
     * 抽卡动画
     * 星级分布:
     * 2:72 108
     * 3:54 90 126
     * 4:36 72 108 144
     * 5:18 54 90 126 162
     * 6:0 36 72 108 144 180
     */
    export function drawCard(type:string, card:any, func:Function = null) {
        //动画是否播放完成
        let isFinish:boolean = false;
        let equipGrade:number = 0;
        let name:string = ""
        for (let i = 0; i < ConfigManager.tcEquip.length; i++) {
            let equipConf = ConfigManager.tcEquip[i];
            if (equipConf.id == card.id) {
                equipGrade = equipConf.grade;
                name = equipConf.name;
                break;
            }
        }

        let group:eui.Group = new eui.Group();
        let bg:egret.Bitmap = Utils.createBitmap("drawCardBg_png");
        bg.width = Common.SCREEN_W;
        bg.height = Common.SCREEN_H;
        group.addChild(bg);
        //武器
        let equipGroup:eui.Group = new eui.Group();
        // equipGroup.alpha = 0;
        group.addChild(equipGroup);
        let equipBg:egret.Bitmap = Utils.createBitmap(`drawCard0${equipGrade}_png`);
        equipBg.alpha = 0;
        equipBg.x = 186;
        equipGroup.addChild(equipBg);
        let nameText:egret.TextField = Utils.createText(name, Common.SCREEN_W/2, 79, 45, 0x0A0000);
        nameText.alpha = 0;
        nameText.fontFamily = "Microsoft YaHei";
        nameText.bold = true;
        nameText.stroke = 3;
        nameText.strokeColor = 0xfcfaf9;
        nameText.anchorOffsetX = nameText.width/2;
        equipGroup.addChild(nameText);
        let img_equip:egret.Bitmap = Utils.createBitmap(`equip${25-card.id}_png`);
        img_equip.visible = false;
        img_equip.anchorOffsetX = img_equip.width/2;
        img_equip.x = nameText.x;
        img_equip.y = 181;
        equipGroup.addChild(img_equip);
        let starGroup:eui.Group = new eui.Group();
        equipGroup.addChild(starGroup);

        let ArrayStar:Array<egret.Bitmap> = []
        for (let i = 0; i < equipGrade+1; i++) {
            let img_star:egret.Bitmap = Utils.createBitmap("equip_res.star_00");
            ArrayStar.push(img_star);
            img_star.visible = false;
            img_star.x = 36 * i;
            starGroup.addChild(img_star);
        }
        starGroup.anchorOffsetX = (equipGrade+1)*18;    //(width/2)
        starGroup.x = Common.SCREEN_W/2;
        starGroup.y = nameText.y + 65;
        for (let i = 0; i < card.affix.length; i++) {
            let imgId = 0;
            for (let j = 0; j < modShop.affixValueRolls.length; j++) {
                let affixInfo = modShop.affixValueRolls[j];
                if (card.affix[i].value >= affixInfo[0] && card.affix[i].value <= affixInfo[1]) {
                    imgId = j + 1;
                    break;
                }
            }
            let img_affix:egret.Bitmap = Utils.createBitmap(`equip_res.star_0${imgId}`);
            // img_affix.visible = false;
            img_affix.x = 36 * i;
            starGroup.addChild(img_affix);
        }

       //动画
        var data = RES.getRes("drawCardClip_json");
        var txtr = RES.getRes("drawCardClip_png");
        var mcFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory( data, txtr );
        var mc1:egret.MovieClip = new egret.MovieClip( mcFactory.generateMovieClipData( "drawCardClip" ) );
        mc1.x = Common.SCREEN_W/2 - 395;
        mc1.y = Common.SCREEN_H/2 - 325;
        mc1.visible = false;
        group.addChild(mc1);

        /********************动画********************/
        var step2 = function() {
            for (let i = 0; i < ArrayStar.length; i++) {
                egret.setTimeout(()=>{
                    ArrayStar[i].visible = true;
                    ArrayStar[i].scaleX = 0;
                    ArrayStar[i].scaleY = 0;
                    egret.Tween.get(ArrayStar[i]).to({scaleX:1.0, scaleY:1.0}, 120, egret.Ease.elasticOut);
                }, this, 100*i);
            }
            egret.setTimeout(()=>{
                isFinish = true;
            }, this, 120*ArrayStar.length);
        }
        var step1 = function() {
            mc1.visible = true;
            mc1.gotoAndPlay(1);
        }
        /*******************************************/
        step1();
        GameLayerManager.gameLayer().maskLayer.addChild(group);
        //跳过
        if (type == "ten") {
            var btn_Jump:egret.TextField = Utils.createText("跳过", 1057, 7, 30, 0xA86B18);
            btn_Jump.fontFamily = "Microsoft YaHei";
            btn_Jump.bold = true;
            GameLayerManager.gameLayer().maskLayer.addChild(btn_Jump);

            function btn_flash() {
              egret.Tween.get(btn_Jump).to({alpha:0.2},1000,egret.Ease.circIn).call(()=>{
                    egret.Tween.get(btn_Jump).to({alpha:1},1000).call(btn_flash, this);
                },this)
            }
            btn_flash();

            btn_Jump.touchEnabled = true;
            btn_Jump.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                egret.Tween.removeTweens(group);
                egret.Tween.removeTweens(btn_Jump);
                GameLayerManager.gameLayer().maskLayer.removeChildren();
                let cards = ShopDialog.instance.getCards();
                ShopDialog.instance.createEquipPop(cards, "ten");
            }, this);
        }
        //添加播放完成事件
        mc1.addEventListener(egret.Event.COMPLETE, function (){
            mc1.visible = false;
            step2();
        }, this);
        //添加播放播放过程事件
        mc1.addEventListener(egret.MovieClipEvent.FRAME_LABEL, (event:egret.MovieClipEvent)=>{
            let label:string = event.frameLabel;
            if (label == "@show") {
                img_equip.visible = true;
                img_equip.scaleX = 2.0;
                img_equip.scaleY = 2.0;
                egret.Tween.get(img_equip).to({scaleX:1.0, scaleY:1.0}, 200);
                egret.Tween.get(nameText).to({alpha:1.0}, 300);
                egret.Tween.get(equipBg).to({alpha:1.0}, 300);
            }
        }, this);
        group.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
            if (isFinish) {
                egret.Tween.removeTweens(group);
                GameLayerManager.gameLayer().maskLayer.removeChildren();
                if (func) {
                    func();
                }
            }
        }, this);
    }

    /**
     * 伤害弹出并消失
     */
    export function hurtTips(target:any, offset:number = 50, callBack:Function = null) {
        target.alpha = 0;
        // if (target.parent.contains(target)) {
        //     target.parent.removeChild(target);
        //     egret.Tween.removeTweens(obj);
        // }
        var step2:Function = function() {
            target = null;
            if (callBack) callBack();
        }

        var step1:Function = function() {
            egret.Tween.get(target).to({alpha:0},500).call(step2);
        }
        egret.Tween.get(target).to({y:target.y - offset,alpha:1},500,egret.Ease.backOut).call(step1);
    }

    let img_list:Array<egret.Bitmap> = new Array();
    let txt_list:Array<egret.TextField> = new Array();

    /** 显示获得物品弹窗效果 
     * @param list 数组列表 指定武器对应的id目前只支持武器id
    */
    export function ShowGoodsPopEffect(list:any):void{

        for(let i in img_list) egret.Tween.removeTweens(img_list[i]);
        for(let i in txt_list) egret.Tween.removeTweens(txt_list[i]);

        for(let i:number = 0; i < list.length; i++){
            egret.setTimeout(()=>{
                if(img_list[i] == null){
                    img_list[i] = new egret.Bitmap();
                    txt_list[i] = Common.CreateText("",30,0xff0000,true,"Microsoft YaHei");
                }

                img_list[i].texture = Common.GetTextureFromType(list[i]);
                if(list[i].type == 1){
                    txt_list[i].text  = "恭喜获得" + TcManager.GetInstance().GetTcEquipData(list[i].id).name;
                }
                else txt_list[i].text = "x" + list[i].count;

                GameLayerManager.gameLayer().maskLayer.addChild(img_list[i]);
                GameLayerManager.gameLayer().maskLayer.addChild(txt_list[i]);
                Common.SetXY(img_list[i], 1136 / 2 - 150, 640 - img_list[i].height >> 1);
                Common.SetXY(txt_list[i], img_list[i].x + img_list[i].width + 10, img_list[i].y + (img_list[i].height - txt_list[i].height >> 1));
                egret.Tween.get(img_list[i]).to({x:img_list[i].x, y:img_list[i].y - 100},500);
                egret.Tween.get(txt_list[i]).to({x:txt_list[i].x, y:txt_list[i].y - 100},500).call(()=>{
                    GameLayerManager.gameLayer().maskLayer.removeChild(img_list[i]);
                    GameLayerManager.gameLayer().maskLayer.removeChild(txt_list[i]);
                })
            }, null, i * 400)
        }
    }
    
    /**
     * 盖章效果
     */
    export function stamp(target:any, timeStamp:number, timeDisappear:number, b_scale:number = 2, a_scale:number = 1, func:Function = null, func1:Function=null):void {
        target.scaleX = b_scale;
        target.scaleY = b_scale;
        target.alpha = 1.0;
        var step2 = function () {
            egret.Tween.get(target).to({alpha:0}, timeDisappear).call(()=>{
                if (func) func();
            })
        }
        var step1 = function () {
            egret.Tween.get(target).to({scaleX:a_scale, scaleY:a_scale}, timeStamp, egret.Ease.bounceOut).call(()=>{
                step2();
                if (func1) func1();
            })
        }
        step1();
    }

    /** object fade effect 
     * @param obj 
     */
    export function ObjFadeEffect(obj:any):void{
        let randTime:number = Math.floor((Math.random() % 10) * 1000);
        randTime = randTime < 100 ? 100 : randTime;
        egret.Tween.get(obj).to({alpha:0.5},randTime).call(()=>{
            egret.Tween.get(obj).to({alpha:1},randTime).call(()=>{
                egret.Tween.removeTweens(obj);
                ObjFadeEffect(obj);
            },this)
        },this);
    }

    let img:egret.Bitmap;
    export function ShowLoadAnimation():void{
        if(img == null){
            img = new egret.Bitmap(RES.getRes("load_res.loading2"));
            Common.SetXY(img, img.width / 2 + (Common.SCREEN_W - img.width >> 1) , img.height / 2 +(Common.SCREEN_H - img.height >> 1));
            img.anchorOffsetX = img.width / 2;
            img.anchorOffsetY = img.height / 2;
        }
        img.rotation = 0;
        GameLayerManager.gameLayer().panelLayer.addChild(img);
        egret.Tween.get(img, {loop:true}).to({rotation:360},1000);
    }

    export function HideLoadAnimation():void{
        if(img){
            egret.Tween.removeTweens(img);
            GameLayerManager.gameLayer().panelLayer.removeChild(img);
        }
    }

    function CreateRewardsGoods(data:any):egret.Sprite{
        if(data == null) return;

        let group:egret.Sprite = new egret.Sprite();
        let bg:egret.Bitmap = new egret.Bitmap(RES.getRes("box_res.goodsLight"));
        group.addChild(bg);

        let img:egret.Bitmap = new egret.Bitmap(Common.GetTextureFromType(data));
        group.addChild(img);

        let text:egret.TextField = Common.CreateText(`${data.count}`,25,0xffffff,true,"Microsoft YaHei","right");
        text.width = img.width - 10;
        group.addChild(text);

        let str:string = "恭喜获得" + (data.type == 1 ? TcManager.GetInstance().GetTcEquipData(data.id).name : ModBasic.BasicNameList[data.name]);
        let szTitle:egret.TextField = Common.CreateText(str,25,0xff0000,true,"Microsoft YaHei","right");
        group.addChild(szTitle);

        group.width = bg.width + szTitle.width;
        Common.SetXY(szTitle, 0, szTitle.y + (bg.height - szTitle.height >> 1));
        Common.SetXY(bg, szTitle.x + szTitle.width, 0);
        Common.SetXY(img, bg.x + (bg.width - img.width >> 1), bg.height - img.height >> 1);
        Common.SetXY(text, img.x + 5, img.y + img.height - text.height - 5);

        return group;
    }

    function onShowBoxLight(event:egret.Event):void{
        let target = event.target;
        target.removeEventListener(egret.Event.COMPLETE, onShowBoxLight, this);
        egret.Tween.get(target).to({alpha:0},150).call(()=>{
            egret.Tween.removeTweens(target);
        })
    }
    /**
     * @params: let data = [{name:"diamond",id:0,count:100,type:2},{name:"equip",id:1,count:1,type:1}]
     */
    function getBoxPosition(x1,y1,x2,y2,x3,y3):any{
        return {lightX:x1,lightY:y1,mcX:x2,mcY:y2,lightMcX:x3,lightMcY:y3};
    }

    // show open box Animation
    export function ShowOpenBoxAnimation(list:any,boxType:number,listener:Function = null):void{

        let mainGroup = new egret.Sprite();
        GameLayerManager.gameLayer().maskLayer.addChild(mainGroup);

        let mask = Common.CreateShape(0, 0, Common.SCREEN_W, Common.SCREEN_H);
        mainGroup.addChild(mask);
        mask.alpha = 0.35;mask.touchEnabled = true;

        let boxGroup = new egret.Sprite();
        let goodsGroup = new egret.Sprite();

        mainGroup.addChild(boxGroup)
        mainGroup.addChild(goodsGroup);

        let str:string = "";
        let position:any;
        if(boxType == ModBasic.IRONBOX){
            str = "iron";
            position = getBoxPosition(-1,65,35,0,25,-80);
        }
        else if(boxType == ModBasic.SILVERBOX){
            str = "silver";
            position = getBoxPosition(-2,77,0,0,0,-70);
        }
        else if(boxType == ModBasic.GOLDBOX){
            str = "gold";
            position = getBoxPosition(-1,57,0,0,-5,-80);
        }

        let box = new egret.Bitmap(RES.getRes(`box_res.${str}Box`));
        let boxLight = new egret.Bitmap(RES.getRes(`box_res.${str}Light`));
        boxGroup.addChild(box);
        boxGroup.addChild(boxLight);
        boxGroup.width = box.width;boxGroup.height = box.height;
        boxGroup.anchorOffsetX = boxGroup.width / 2;boxGroup.anchorOffsetY = boxGroup.height / 2;
        
        Common.SetXY(boxGroup, (Common.SCREEN_W - boxGroup.width >> 1) + boxGroup.width / 2, Common.SCREEN_H / 2);
        Common.SetXY(boxLight, box.x + (box.width - boxLight.width >> 1) + position.lightX,box.y + position.lightY);

        boxLight.visible = false;
        boxGroup.scaleX = 2;boxGroup.scaleY = 2;
        egret.Tween.get(boxGroup).to({scaleX:0.8,scaleY:0.8},150).to({scaleX:1.2,scaleY:1.2},80).to({scaleX:1,scaleY:1},80).wait(100).call(()=>{
            boxLight.visible = true;
            egret.Tween.get(boxGroup).to({rotation:3},100).to({rotation:-3},100).to({rotation:3},100).to({rotation:-3},100).to({rotation:0},100).call(()=>{
                boxGroup.visible = false;
                egret.Tween.removeTweens(boxGroup);

                //boxMC
                let boxMc = Common.CreateMovieClip(`${str}Movie`,true);
                goodsGroup.addChild(boxMc);
                boxMc.play(1);
                Common.SetXY(boxMc, boxGroup.x - boxGroup.width / 2, boxGroup.y - boxGroup.height / 2);

                // //starMc
                let starBgMc = Common.CreateMovieClip("starSprite",true);
                goodsGroup.addChild(starBgMc);
                starBgMc.play(1);
                Common.SetXY(starBgMc, boxMc.x - boxGroup.width / 4 - 10, boxMc.y + (boxMc.height - starBgMc.height >> 1));
                starBgMc.addEventListener(egret.Event.COMPLETE, onShowBoxLight, this);

                // //imgLight
                let imgLight = new egret.Bitmap(RES.getRes("box_res.bgLight"));
                Common.SetXY(imgLight, boxMc.x + (boxMc.width - imgLight.width >> 1) + position.mcX, boxMc.y + (boxMc.height - imgLight.height >> 1));
                
                goodsGroup.addChild(imgLight);
                egret.Tween.get(imgLight).wait(50).call(()=>{
                    let boxBgLightMc = Common.CreateMovieClip("boxBgLight",true);
                    goodsGroup.addChild(boxBgLightMc);
                    boxBgLightMc.play(-1);
                    Common.SetXY(boxBgLightMc, boxMc.x + (boxMc.width - boxBgLightMc.width >> 1) + position.lightMcX, boxMc.y + position.lightMcY);

                    let rewardGroup= CreateRewardsGoods(list[0]);
                    goodsGroup.addChild(rewardGroup);
                    rewardGroup.alpha = 0;rewardGroup.scaleX = 0.5;rewardGroup.scaleY = 0.5;
                    rewardGroup.anchorOffsetX = rewardGroup.width / 2;
                    Common.SetXY(rewardGroup, boxMc.x + (boxGroup.width - rewardGroup.width >> 1) + rewardGroup.anchorOffsetX , imgLight.y + 150);
                    egret.Tween.get(rewardGroup).to({alpha:1,y:imgLight.y,scaleX:1,scaleY:1},150);

                    let szContent = Common.CreateText("点击任意位置继续",35,0xffff00,true,"Microsoft YaHei");
                    goodsGroup.addChild(szContent);
                    Common.SetXY(szContent, Common.SCREEN_W - szContent.width >> 1, Common.SCREEN_H - 100);

                    mask.addEventListener(egret.TouchEvent.TOUCH_TAP, ()=>{
                        let obj_list:any = [box,boxLight,boxMc,starBgMc,imgLight,boxBgLightMc,rewardGroup,szContent,boxGroup,goodsGroup,mask,mainGroup];
                        for(let obj of obj_list){
                            egret.Tween.removeTweens(obj);
                            if(obj.parent){
                                obj.parent.removeChild(obj);
                                obj = null;
                            }
                        }
                        obj_list = [];

                        if(listener) listener()

                    }, this)
                }).to({alpha:0},300)
            });
        })
    }
}