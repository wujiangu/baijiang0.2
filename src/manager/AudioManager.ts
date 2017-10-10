/**
 * 音乐管理类
 * @author hong
 * @date   2017/9/28
 */

class AudioManager{

    public static MAIN_BG_MUSIC:string   = "MAIN_BG";       //主背景音乐
    public static BATTLE_BG_MUSIC:string = "BATTLE_BG";     //战斗北京音乐
    public static CLICK_MUSIC:string     = "CLICK_MUSIC";   //点击音乐
    public static ATTACK_MUSIC:string    = "ATTACK_MUSIC";  //攻击音乐
    public static BOMP_MUSIC:string      = "BOMP_MUSIC";    //爆炸音乐
    public static DEAD_MUSIC:string      = "DEAD_MUSIC";    //死亡人物音效
    public static HIT_MUSIC:string       = "HIT_MUSIC";     //命中音效
    public static POWER_MUSIC:string     = "POWER_MUSIC";   //释放技能音效
    public static START_MUSIC:string     = "START_MUSIC";   //START_MUSIC
    public static CLOSE_MUSIC:string     = "CLOSE_MUSIC";   //close

    public constructor(){
        this.music_list   = {};
        this.load_list    = {};
        this.channel_list = {};
    }

    public static Instance:AudioManager;
    public static GetIns():AudioManager{
        if(this.Instance == null){
            this.Instance = new AudioManager();
        }
        return this.Instance;
    }

    public PlayMusic(strType:string):void{
        let name:string = this.getNameFromType(strType);
        if(this.load_list[name] == null){
            this.LoadMusic(name);
        }
        else
        {
            this.play(name);
        }
    }

    private play(name:string):void{
        if(this.load_list[name] == null){
            return;
        }

        if(name == "main_bg" || name == "battle_bg"){
           this.channel_list[name] = this.music_list[name].play(0, -1);
        }
        else
            this.music_list[name].play(0, 1);
    }

    private LoadMusic(name:string):void{
        this.music_list[name] = new egret.Sound();
        this.music_list[name].addEventListener(egret.Event.COMPLETE, ()=>{
            this.load_list[name] = 1;
            this.play(name);
        },this);
        this.music_list[name].load(this.getMusicUrl(name));
    }

    public Stop(strType:string):void{
        let name:string = this.getNameFromType(strType);
        if(this.channel_list[name] == null) return;
        this.channel_list[name].stop();
        this.channel_list[name] = null;
    }

    private getNameFromType(strType:string):string{
        if(AudioManager.MAIN_BG_MUSIC == strType) return "main_bg";
        else if(AudioManager.BATTLE_BG_MUSIC == strType) return "battle_bg";
        else if(AudioManager.CLICK_MUSIC == strType) return "click";
        else if(strType == AudioManager.ATTACK_MUSIC) return "attack";
        else if(strType == AudioManager.DEAD_MUSIC) return "dead";
        else if(strType == AudioManager.HIT_MUSIC) return "hit";
        else if(strType == AudioManager.POWER_MUSIC) return "power";
        else if(strType == AudioManager.BOMP_MUSIC) return "bomp";
        else if(strType == AudioManager.CLOSE_MUSIC) return "close";
        else if(strType == AudioManager.START_MUSIC) return "start";
    }

    private getMusicUrl(name:string):string{
        if(name == "main_bg") return "resource/assets/audio/beijing.mp3";
        else if(name == "battle_bg") return "resource/assets/audio/battle.mp3";
        else if(name == "click") return "resource/assets/audio/click.wav";
        else if(name == "attack") return "resource/assets/audio/attack.wav";
        else if(name == "dead") return "resource/assets/audio/dead.wav";
        else if(name == "hit") return "resource/assets/audio/hit.wav";
        else if(name == "power") return "resource/assets/audio/power.wav";
        else if(name == "bomp") return "resource/assets/audio/bomp.wav";
        else if(name == "start") return "resource/assets/audio/start.wav";
        else if(name == "close") return "resource/assets/audio/close.wav";
    }

    /** other */
    private load_list:any; 
    private music_list:any;
    private channel_list:any;
}