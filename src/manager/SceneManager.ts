/**
* 游戏事件管理
*/
class SceneManager {
	/**开始游戏场景 */
	public static enterGameScene:EnterGameScene;
	/**主场景 */
	public static mainScene:MainScene;
    /**战斗场景 */
    public static battleScene:BattleScene;
	/**PVP战斗场景 */
	public static pvpScene:PVPScene;
	/**当前场景 */
	public static curScene:any;
	/**下一个场景 */
	public static nextScene:any;
}