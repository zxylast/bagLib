/**处理安卓广告预加载，未来可能会兼容IOS与微信小游戏的广告预加载 */
class AdvertSYBManager {

	private static _instance: AdvertSYBManager = null;

	public static get Instance(): AdvertSYBManager {
		if (!AdvertSYBManager._instance) {
			AdvertSYBManager._instance = new AdvertSYBManager();
		}
		return AdvertSYBManager._instance;
	}

	public init():void{
		

	}

	public loadAd():void{
		if(GameServer.serverOpenDay<3){
			return ;
		}
		// if(VipCC.ins().ifBuyLongCard()){
		// 	return ;
		// }
		/**安卓请求预加载 */
		if(window["SYNativeInterface"]){
			window["SYNativeLoadVedio"]("");
		}

	}

}