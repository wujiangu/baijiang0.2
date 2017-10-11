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
     * 暂停临时buff的计时器
     */
    export function randomBuffStop(obj:Hero):void {
        for (let i = 0; i < obj.buff.length; i++) {
            if (obj.buff[i].buffData.id >= 70 && obj.buff[i].buffData.id <= 79) {
                obj.buff[i].stop();
            }
        }
    }

    /**开启临时buff的计时器 */
    export function randomBuffStart(obj:Hero):void {
        for (let i = 0; i < obj.buff.length; i++) {
            if (obj.buff[i].buffData.id >= 70 && obj.buff[i].buffData.id <= 79) {
                obj.buff[i].start();
            }
        }
    }


    /**
     * 是否盲目
     */
    export function isBlind(obj:Hero):boolean {
        if (!obj || !obj.buff) return false;
        for (let i = 0; i < obj.buff.length; i++) {
            //必杀
            if (obj.buff[i].buffData.id == 78) {
                let seed:number = MathUtils.getRandom(1, 100);
                if (seed <= 30) return true;
                else return false;
            }
        }
        return false;
    }

    /**
     * 是否技能冷却缩短
     */
    export function isCdShorten(obj:Hero):boolean {
        if (!obj || !obj.buff) return false;
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
     * 反弹伤害的buff
     */
    export function reflection(obj:Hero):void {
        if (!obj || !obj.buff) return ;
        for (let i = 0; i < obj.buff.length; i++) {
            //圆波剑舞
            if (obj.buff[i].buffData.id == 6) {
                obj.buff[i].update();
            }
        }
    }

    /**
     * 检测是否有免疫伤害的buff或者反弹伤害的buff
     */
    export function isImmuneBuff(obj:Hero):boolean {
        if (!obj || !obj.buff) return false;
        for (let i = 0; i < obj.buff.length; i++) {
            //护盾
            if (obj.buff[i].buffData.id == 4 || obj.buff[i].buffData.id == 73) {
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
        }
        return false;
    }

    /**
     * 是否伤害减少
     */
    export function hurtChange(obj:Hero):number {
        let hardening:number = 0;
        let brokeShield:number = 0;
        for (let i = 0; i < obj.buff.length; i++) {
            //硬化
            if (obj.buff[i].buffData.id == 71) {
                obj.buff[i].update(obj, (value)=>{
                    hardening = value;
                });
            }
            //易伤
            if (obj.buff[i].buffData.id == 76) {
                obj.buff[i].update(obj, (value)=>{
                    brokeShield = value;
                });
            }
        }
        return (hardening + brokeShield);
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
     * 是否有必杀buff
     */
    export function isInstanteKill(obj:Hero):boolean {
        for (let i = 0; i < obj.buff.length; i++) {
            //必杀
            if (obj.buff[i].buffData.id == 74) {
                obj.buff[i].update();
                return true
            }
        }
        return false;
    }

    /**
     * 检测是否有普通攻击的buff
     */
    export function isAttackBuff(obj:Alliance, target:any):boolean {
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
            //飞燕刺
            else if (obj.buff[i].buffData.id == 10) {
                let random = MathUtils.getRandom(1, 100);
                if (random <= obj.buff[i].buffData.probability) {
                    obj.buff[i].update(target);
                    status = true;
                }
            }
            //青龙劈空斩
            else if (obj.buff[i].buffData.id == 13) {
                obj.buff[i].update(target);
                status = true;
            }
            //灵羽探云手
            else if (obj.buff[i].buffData.id == 14) {
                obj.buff[i].update(target);
                status = true;
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