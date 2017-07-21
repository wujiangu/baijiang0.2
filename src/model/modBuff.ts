/**
 * buff模块
 */
namespace modBuff {
    /**
     * 根据id获取buff配置
     */
    export function getBuff(id:number) {
        for (let i = 0; i < ConfigManager.buffConfig.length; i++) {
            let buffcof = ConfigManager.buffConfig[i];
            if (id == buffcof.id) return buffcof;
        }
        return null
    }

    /**
     * 是否存在buff
     */
    export function isExistBuff(buff:Array<any>, id:number):boolean {
        for (let i = 0; i < buff.length; i++) {
            if (buff[i].buffData.id == id) return true;
        }
        return false;
    }

    /**
     * 是否技能冷却缩短
     */
    export function isCdShorten(obj:Hero):boolean {
        for (let i = 0; i < obj.buff.length; i++) {
            //智谋
            if (obj.buff[i].buffData.id == 32) {
                obj.buff[i].update();
                return true
            }
        }
        return false;
    }

    /**
     * 检测是否有免疫伤害的buff或者反弹伤害的buff
     */
    export function isImmuneBuff(obj:Hero):boolean {
        for (let i = 0; i < obj.buff.length; i++) {
            //护盾
            if (obj.buff[i].buffData.id == 4) {
                // obj.skillArmature.visible = false;
                obj.buff[i].update();
                return true
            }
            //回避伤害(以40%概率测试)
            else if (obj.buff[i].buffData.id == 5) {
                let random = MathUtils.getRandom(1, 100);
                if (random <= 10) {
                    obj.buff[i].update();
                    return true;
                }
            }
            //圆波剑舞
            else if (obj.buff[i].buffData.id == 6) {
                if (!modBuff.isExistBuff(obj.buff, 4)) obj.buff[i].update();
                // return false;
            }
        }
        return false;
    }

    /**
     * 是否复活
     */
    export function isRevival(obj:Hero):boolean {
        let status:boolean = false;
        for (let i = 0; i < obj.buff.length; i++) {
            //秘密储备
            if (obj.buff[i].buffData.id == 28) {
                // obj.skillArmature.visible = false;
                obj.buff[i].update(obj, (isRevival)=>{
                    status = isRevival;
                });
            }
        }
        return status;
    }

    /**
     * 检测是否有普通攻击的buff
     */
    export function isAttackBuff(obj:Hero, target:any):boolean {
        let status:boolean = false;
        // let len:number = obj.buff.length;
        for (let i = 0; i < obj.buff.length; i++) {
            //击晕(以10%概率测试)
            if (obj.buff[i].buffData.id == 7) {
                let random = MathUtils.getRandom(1, 100);
                if (random <= obj.buff[i].buffData.probability) {
                    obj.buff[i].update(target);
                    status = true;
                }
            }
            //新鲜血液
            else if (obj.buff[i].buffData.id == 22) {
                obj.buff[i].update(target);
                i -- ;
                status = true;
            }
            //猎人
            else if (obj.buff[i].buffData.id == 24) {
                obj.buff[i].update(target);
                status = true;
            }
            //战争热诚
            else if (obj.buff[i].buffData.id == 25) {
                obj.buff[i].update(target);
                status = true;
            }
            //无情
            else if (obj.buff[i].buffData.id == 30) {
                obj.buff[i].update(target);
                status = true;
            }
            //死神的赠礼
            else if (obj.buff[i].buffData.id == 31) {
                obj.buff[i].update(target);
                i -- ;
                status = true;
            }
            //雷霆领主的法令
            else if (obj.buff[i].buffData.id == 33) {
                obj.buff[i].update(target);
                // i -- ;
                status = true;
            }
        }
        return status;
    }
}