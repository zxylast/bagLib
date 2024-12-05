class ServerSYBManager {

	private saveServer: boolean = false;

	private wechatKey = "2.5";
	private ksKey = "7.4";
	private ttKey = "7.4";
	private qqKey = "1.2";
	private wechatVersion = "2.6";
	private ksVersion = "1.3";
	private ttVersion = "1.2";
	private qqVersion = "1.2";
	private storageKey: string;
	private groups: Array<ServerSYBGroup>;
	private servers: Array<ServerSYBData>;
	private currServer: ServerSYBData;
	private currGroup: ServerSYBGroup;
	private notice: GameSYBNotice;
	private safety: GameSYBNotice;
	private serverTime: number;
	private whiteList: Array<string>;
	private gameVersion: number;
	private inBlackList: boolean = false;
	private tryTime = 10;
	//小游戏(传入字符串"0000",按字符串下标获取0or1)
	private ifToExamine: string = "";
	private chatOpen: number = 0;

	private recentIds: number[];
	private specialAccountname: { [index: string]: number[] };

	private loadedComplete: any;

	private loadAll: boolean = false;


	public init($loadedComplete: any) {
		this.loadedComplete = $loadedComplete;
		this.storageKey = Authorize.Instance.SDK.SDKData.UserID + "server";
		var request: egret.HttpRequest = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT;
		request.once(egret.Event.COMPLETE, this.onPostComplete, this);
		request.once(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
		var name = Authorize.Instance.SDK ? Authorize.Instance.SDK.SDKData.UserID : "";
		request.open(`${SY_WWW_HOST}/serverInfoNew.php?accountname=` + name, egret.HttpMethod.GET);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send();
	}
	public loadAllServer() {
		if (this.loadAll) {
			return;
		}
		var request: egret.HttpRequest = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT;
		request.once(egret.Event.COMPLETE, this.onPostAllComplete, this);
		request.open(`${SY_WWW_HOST}/allServer.php`, egret.HttpMethod.GET);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send();
	}
	private onPostAllComplete(event: egret.Event): void {
		var request = <egret.HttpRequest>event.currentTarget;
		var data = JSON.parse(request.response);
		this.servers = data["servers"];
		this.filterServsers();
	}

	private filterServsers(first: boolean = false) {
		this.servers = this.servers.filter((v, i, a) => {
			if (this.InWhiteList()) {
				return true;
			}
			if ((v.openTime > this.serverTime)) {
				if ((SYWeixin && v.serverID < 1000 && this.wechatKey == this.wechatVersion) 
					 ) {
					return true;
				}
				return false;
			}
			if ((!v.openTime || v.openTime < this.serverTime)) {
				if ((SYWeixin && v.serverID > 1000 && this.wechatKey == this.wechatVersion)
					) {
					return false;
				}
				if ((SYWeixin && v.serverID < 1000 && this.wechatKey != this.wechatVersion)
					) {
					return false;
				}
				return true;
			}
			return false;

		})


		for (let hasNew = false, k = 0; k < this.servers.length; k++) {
			if (!this.servers[k]['state']) {
				if (!hasNew) {
					hasNew = true;
					this.servers[k]['state'] = 1;
				} else {
					this.servers[k]['state'] = 2;
				}
			}
		}
		var value = egret.localStorage.getItem(this.storageKey);
		if (value) {
			var data = JSON.parse(value);
			for (let k = 0; k < this.servers.length; k++) {
				let server = this.servers[k];
				server.logined = data[server.id];
				if (first && server.id == data["last"]) {
					this.UpdateCurrServer(server);
				}
			}
			this.currGroup = this.groups[0];
		} else if (this.recentIds) {
			if (this.recentIds.length) {
				for (let k = 0; k < this.servers.length; k++) {
					let serverRecent = this.servers[k];
					for (var i: number = 0; i < this.recentIds.length; i++) {
						if (serverRecent && serverRecent.id == this.recentIds[i]) {
							serverRecent.logined = true;
							if (i == 0 && first) {
								this.UpdateCurrServer(serverRecent);
							}
						}
					}
				}
			}
			this.currGroup = this.groups[0];
		} else {
			this.currGroup = this.groups[1];
		}
	}

	private onPostComplete(event: egret.Event): void {
		this.tryTime = 10;
		var request = <egret.HttpRequest>event.currentTarget;
		var data = JSON.parse(request.response);
		this.groups = data["serverGroups"];
		this.notice = data["notice"];
		this.safety = data["safety"];
		this.servers = data["servers"];
		this.serverTime = data["serverTime"];
		this.whiteList = data["whiteList"];
		this.gameVersion = data["gameVersion"];
		this.inBlackList = data.inBlackList;
		this.saveServer = data.saveServer;
		this.recentIds = data.recently_serverid;
		this.specialAccountname = data.specialAccountname;
		if (data.wechatVersion) {
			this.wechatVersion = data.wechatVersion;
		}
		if (data.ksVersion) {
			this.ksVersion = data.ksVersion;
		}
		if (data.ttVersion) {
			this.ttVersion = data.ttVersion;
		}
		if (data.qqVersion) {
			this.qqVersion = data.qqVersion;
		}
		if (data.ifToExamine) {
			this.ifToExamine = data.ifToExamine;
		}
		if (data.chatOpen) {
			this.chatOpen = data.chatOpen;
		}

		this.filterServsers(true);

		// egret.localStorage.clear();

		/**二次加载时强制选择 */
		if (window["SYSelectServer"]) {
			for (let k = 0; k < this.servers.length; k++) {
				let server = this.servers[k];
				if (server.serverID == window["SYSelectServer"]) {
					this.UpdateCurrServer(server);
					break;
				}
			}
		}
		if (!this.currServer) {
			//console.log("UpdateCurrServer", this.servers);
			this.UpdateCurrServer(this.servers[0]);
		}
		if (this.loadedComplete) {
			this.loadedComplete();
		}
	}

	private onPostIOError(e: egret.IOErrorEvent): void {
		if (this.tryTime > 0) {
			this.tryTime--;
			setTimeout(() => {
				this.init(this.loadedComplete);
			}, 1000);
		}
	}

	private static _instance: ServerSYBManager = null;

	public static get Instance(): ServerSYBManager {
		if (!ServerSYBManager._instance) {
			ServerSYBManager._instance = new ServerSYBManager();
		}
		return ServerSYBManager._instance;
	}

	public InWhiteList(): boolean {
		if (this.whiteList) {
			for (let k = 0; k < this.whiteList.length; k++) {
				if (LocationSYBProperty.openID == this.whiteList[k]) {
					return true;
				}
			}
		}
		return false;
	}
	public InBlackList(): boolean {
		return this.inBlackList ? true : false;
	}

	public IsTestServer(): boolean {
		return this.currServer ? this.currServer.id <= 1000 : false;
	}

	public IsDyTestServer(): boolean {
		return this.currServer ? this.currServer.id < 1000 : false;
	}

	public IsQQKeyBoolean(): boolean {
		// return this.qqKey == this.qqVersion;
		return false;
	}

	/**
	 * 返回微信，快手，抖音, QQ小游戏审核
	 */
	public IsLittle(): boolean {
		if (this.currServer) {
			if (this.currServer.id > 1000) {
				return false;
			}
			if (SYWeixin) {
				return this.wechatKey == this.wechatVersion;
			}
		}
		return false
	}

	/**重新加载，新号直接打开创角 */
	public loadscene(): boolean {
		return SYWeixin;
	}

	public CanLogin(server: ServerSYBData): boolean {
		//判断是否白名单
		if (this.InWhiteList()) {
			return true;
		}
		//判断是否能登录
		if (server.canLogin) {
			//判断是否开服
			if (this.CheckSDK() && server.openTime && server.serverID > 1000 && (Authorize.Instance.SDK.SDKData.PlatformId != 'lingyue_wxduan' && Authorize.Instance.SDK.SDKData.PlatformId != 'lingyue_ios2' && Authorize.Instance.SDK.SDKData.PlatformId != 'lingyue_ios3' && Authorize.Instance.SDK.SDKData.PlatformId != 'lingyue_zbtt')) {
				var date = new Date(server.openTime * 1000);
				// var year = date.getFullYear();
				// var month = date.getMonth() + 1;
				// var day = date.getDate();
				//var opentimestamp = (new Date(year, month - 1, day).getTime()) / 1000;//开服当天0点
				var opentimestamp = date.getTime() / 1000;//开服时间
				var t = 1;
				if (LocationSYBProperty.srvid > 40000 && LocationSYBProperty.srvid < 50000) {
					t = 30;
				}
				if (opentimestamp + t * 24 * 3600 <= this.serverTime) {//开服1天后新创角不能进入游戏
					if (this.recentIds && this.recentIds.length) {//最近服务器有记录，非新角可进入
						if (this.recentIds.indexOf(server.id) >= 0) {
							return true;
						}
					}
					if (this.specialAccountname) {//特定用户指定服务器可进入
						var name = Authorize.Instance.SDK ? Authorize.Instance.SDK.SDKData.UserID : "";
						if (name && this.specialAccountname[name] && this.specialAccountname[name].indexOf(server.id) >= 0) {
							return true;
						}
					}

					var value = egret.localStorage.getItem(this.storageKey);
					if (value) {//后台没有记录，用本地缓存
						//this.recentIds && this.recentIds.length <= 0 && this.saveToAdmin(value);//保存缓存至后台
						var data = JSON.parse(value);
						if (data[server.id]) {//缓存有记录，可进入
							return true;
						}
					}
					server.tips = '此服人数爆满，请换其他服';
					return false;
				}
			}
			// var value = egret.localStorage.getItem(this.storageKey);
			// if (this.CheckSDK() && value) {//后台没有记录，用本地缓存
			// 	this.recentIds && this.recentIds.length <= 0 && this.saveToAdmin(value);//保存缓存至后台
			// }
			return true;
		} else {
			return false;
		}
	}

	public GetGameVersion(): number {
		return this.gameVersion;
	}

	public GetNotice(): GameSYBNotice {
		return this.notice;
	}

	public GetSafety(): GameSYBNotice {
		return this.safety;
	}

	public GetIfToExamine(type: number): number {
		return this.ifToExamine.substr(type, 1) == '' ? 0 : parseInt(this.ifToExamine.substr(type, 1));
	}

	public GetChatOpen(): number {
		return this.chatOpen;
	}

	public GetGroups(): any {
		return this.groups;
	}

	public updateCurrGroup(index: number): void {
		this.currGroup = this.groups[index] ? this.groups[index] : this.groups[0];
	}

	public GetCurrGroup(): ServerSYBGroup {
		return this.currGroup;
	}

	public UpdateCurrServer(server: ServerSYBData): void {
		this.currServer = server;
		platformWX.serverId = LocationSYBProperty.srvid = server.serverID;
		LocationSYBProperty.uniSrvid = server.id;
		LocationSYBProperty.serverID = server.serverID.toString();
		LocationSYBProperty.severGroupID = server.serverGroupId ? server.serverGroupId : 1;
		LocationSYBProperty.serverIP = server.ip;
		LocationSYBProperty.serverPort = server.port;
	}

	public GetCurrServer(): ServerSYBData {
		return this.currServer as ServerSYBData;
	}

	public GetServers(): any {
		var list: eui.ArrayCollection = new eui.ArrayCollection();
		if (this.currGroup.id == 0) {
			for (let j: number = 0; j < this.servers.length; j++) {
				if (this.servers[j].logined == true) {
					list.addItem(this.servers[j]);
				}
			}
		} else {
			for (let j: number = 0; j < this.servers.length; j++) {
				if (this.servers[j].groupID == this.currGroup.id) {
					list.addItem(this.servers[j]);
				}
			}
		}
		return list;
	}

	public Save(): void {
		this.currServer.logined = true;
		let data = {};
		for (let k = 0; k < this.servers.length; k++) {
			let server = this.servers[k];
			if (server.logined) {
				data[server.id] = true;
			} else {
				data[server.id] = false;
			}
		}
		data["last"] = this.currServer.id;
		if (this.saveServer) {
			var request: egret.HttpRequest = new egret.HttpRequest();
			request.responseType = egret.HttpResponseType.TEXT;
			var name = Authorize.Instance.SDK ? Authorize.Instance.SDK.SDKData.UserID : "";
			request.open(`https://www.shanyougz.com/recentlyServerid.php?accountname=` + name + `&serverid=` + this.currServer.id, egret.HttpMethod.GET);
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			request.send();
		}
		egret.localStorage.setItem(this.storageKey, JSON.stringify(data));
	}

	private CheckSDK(): boolean {
		return false;
	}


	public saveToAdmin(value): void {
		var request: egret.HttpRequest = new egret.HttpRequest();
		request.responseType = egret.HttpResponseType.TEXT;
		var name = Authorize.Instance.SDK ? Authorize.Instance.SDK.SDKData.UserID : "";
		request.open(`https://www.shanyougz.com/recentlyServerid.php?accountname=` + name + `&saveToAdmin=true&data=` + value, egret.HttpMethod.GET);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.send();
	}

}