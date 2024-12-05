/**
 * Created by yangsong on 2014/11/23.
 * 游戏层级类
 */
class LayerSYBManager {
	/**
	 * 游戏背景层
	 * @type {BaseSpriteLayer}
	 */
	public static Game_Bg: BaseEuiSYBLayer = new BaseEuiSYBLayer();
	/**
	 * 主游戏层
	 * @type {BaseSpriteLayer}
	 */
	public static Game_Main: BaseEuiSYBLayer = new BaseEuiSYBLayer();

	/**
	 * 游戏主界面
	 * @type{BaseEuiSYBLayer}
	 */
	public static Main_View: BaseEuiSYBLayer = new BaseEuiSYBLayer();

	/**
	 * 被下方切换栏盖住的一层
	 * @type {BaseEuiSYBLayer}
	 */
	public static UI_Main_Bottom: BaseEuiSYBLayer = new BaseEuiSYBLayer();

	/**
	 * UI主界面，功能弹窗
	 * @type {BaseEuiSYBLayer}
	 */
	public static UI_Main: BaseEuiSYBLayer = new BaseEuiSYBLayer();


	/**
	 * UI弹出框层
	 * @type {BaseEuiSYBLayer}
	 */
	public static UI_Popup: BaseEuiSYBLayer = new BaseEuiSYBLayer();
	/**
 * UI弹出框层
 * @type {BaseEuiSYBLayer}
 */
	public static UI_MainTab: BaseEuiSYBLayer = new BaseEuiSYBLayer();
	/**
 * UI主界面2 比 MainTab 高一层
 * @type {BaseEuiSYBLayer}
 */
	public static UI_Main2: BaseEuiSYBLayer = new BaseEuiSYBLayer();
	/**
	 * UI弹出框层2
	 * @type {BaseEuiSYBLayer}
	 */
	public static UI_Popup2: BaseEuiSYBLayer = new BaseEuiSYBLayer();
	/**
	 * UI警告消息层
	 * @type {BaseEuiSYBLayer}
	 */
	public static UI_Message: BaseEuiSYBLayer = new BaseEuiSYBLayer();
	/**
	 * UITips层
	 * @type {BaseEuiSYBLayer}
	 */
	public static UI_Tips: BaseEuiSYBLayer = new BaseEuiSYBLayer();
	/**
	 * UITips2层
	 * @type {BaseEuiSYBLayer}
	 */
	public static UI_Tips2: BaseEuiSYBLayer = new BaseEuiSYBLayer();
}