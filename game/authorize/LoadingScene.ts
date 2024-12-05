/**
 * Created by egret on 15-1-7.
 */
class LoadingScene extends BaseSYBScene {
	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	/**
	* 进入Scene调用
	*/
	public onEnter(): void {
		super.onEnter();

		if(window["SYSpecialServer"]){
			if(window["SYSpecialServer"][ServerSYBManager.Instance.GetCurrServer().serverID] && !window["SYSelectServer"]){
				window.location.href = LoadingScene.replaceSelectUrl(ServerSYBManager.Instance.GetCurrServer().serverID);
				return;
			}
			else if(!window["SYSpecialServer"][ServerSYBManager.Instance.GetCurrServer().serverID] && window["SYSelectServer"]){
				window.location.href = LoadingScene.replaceSelectUrl(0);
				return;
			}
		}

		this.addLayer(LayerSYBManager.UI_Main);
		this.addLayer(LayerSYBManager.UI_Tips);
		this.addLayer(LayerSYBManager.UI_Popup2);
		ViewSYBManager.ins().open(LoadingView);
		// ViewSYBManager.ins().open(StartDragonBonesView, 1);
	}

	/**
	 * 退出Scene调用
	 */
	public onExit(): void {
		super.onExit();
	}

	public static replaceSelectUrl(serverId:number):string{
		let urlSource = window.location.href
		var whIndex = urlSource.indexOf("?");
		var desUrl = ""; 
		var urlParam = {};
		if (whIndex != -1) {
			var param = urlSource.slice(whIndex + 1).split("&");
			desUrl =  urlSource.slice(0, whIndex+1);
			var strArr;
			for (var i = 0; i < param.length; i++) {
				strArr = param[i].split("=");
				urlParam[strArr[0]] = strArr[1];
			}
		}
		else{
			desUrl = urlSource+"?"
		}
		urlParam["SYSelectServer"] = serverId;
		let front = "";
		for (var key in urlParam) {
			if (key != "") {
				desUrl += front + key + "=" + urlParam[key];
				front = "&"
			}
		}
		return desUrl;
	}

}