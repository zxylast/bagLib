class LocationSYBProperty {

	private static urlParam: any = {};

	public static init(): void {
		let str: string = window['paraUrl'];
		if (str) {
			let whIndex: number = str.indexOf("?");
			if (whIndex != -1) {
				let param: string[] = str.slice(whIndex + 1).split("&");
				let strArr: string[];
				for (let i: number = 0; i < param.length; i++) {
					strArr = param[i].split("=");
					this.urlParam[strArr[0]] = strArr[1];
				}
			}
		}
		let rv = LocationSYBProperty.ver_res;
		if (rv) {
			RES_RESOURCE += rv;
			RES_DIR += rv;
			//MAP_DIR += rv;
		}
		RES_RESOURCE += '/';
		RES_DIR += '/';
		//MAP_DIR += '/';
	}

	static get resAdd(): string {
		return this.urlParam['hosts'] || "";
	}

	static set resAdd(str: string) {
		this.urlParam['hosts'] = str;
	}

	static get openID(): string {
		return this.urlParam['user'];
	}

	static set openID(str: string) {
		this.urlParam['user'] = str;
	}

	static get srvid(): number {
		return parseInt(this.urlParam['srvid']);
	}

	static set srvid(v: number) {
		this.urlParam['srvid'] = v;
	}

	static get serverIP(): string {
		return this.urlParam['srvaddr'];
	}

	static set serverIP(str: string) {
		this.urlParam['srvaddr'] = str;
	}

	static get uniSrvid(): number {
		return parseInt(this.urlParam['uniSrvid']);
	}

	static set uniSrvid(v: number) {
		this.urlParam['uniSrvid'] = v;
	}

	static get serverPort(): number {
		return this.urlParam['srvport'] || 9001;
	}

	static set serverPort(v: number) {
		this.urlParam['srvport'] = v;
	}

	static get password(): string {
		return this.urlParam['spverify'] || "e10adc3949ba59abbe56e057f20f883e";
	}

	static get openKey(): string {
		return this.urlParam['openkey'];
	}

	/** //安卓：1， iOS：2 */
	static get zoneId(): number {
		return this.urlParam['zoneid'];
	}

	//srvid和服后的id
	//serverid和服前的id
	static set serverID(value: string) {
		this.urlParam['serverid'] = value;
	}

	//srvid和服后的id
	//serverid和服前的id
	static get serverID(): string {
		return this.urlParam['serverid'];
	}


	//服务器组id
	static set severGroupID(value: number) {
		this.urlParam['severGroupId'] = value;
	}

	//srvid和服后的id
	//serverid和服前的id
	static get severGroupID(): number {
		return this.urlParam['severGroupId'];
	}


	static get appid(): string {
		return this.urlParam['appid'] || "";
	}

	static get app_openid(): string {
		return this.urlParam['app_openid'] || "";
	}

	static get isSubscribe(): string {
		return this.urlParam['isSubscribe'];
	}

	static get nickName(): string {
		let str: string = this.urlParam['nickName'] || "";
		try {
			return str.length ? decodeURIComponent(str) : str;
		}
		catch (e) {
			return str;
		}
	}

	static get callUrl(): string {
		let str: string = this.urlParam['callUrl'] || "";
		return str.length ? decodeURIComponent(str) : str;
	}

	static get gifi(): string {
		return this.urlParam['gifi'];
	}

	static get roleCount(): number {
		return parseInt(this.urlParam['roleCount']);
	}

	static get isnew(): number {
		return parseInt(this.urlParam['isnew']);
	}

	static get login_ip(): string {
		return this.urlParam['login_ip'];
	}

	static get is_attention(): string {
		return this.urlParam['is_attention'];
	}

	static get isShowShare(): boolean {
		return window['isShowShare'];
	}

	static get v(): number {
		return parseInt(this.urlParam['v']);
	}

	static get isYelloVip(): number {
		return parseInt(this.urlParam['isYelloVip']);
	}

	static get isYelloYearVip(): number {
		return parseInt(this.urlParam['isYelloYearVip']);
	}

	static get yelloVipLevel(): number {
		return parseInt(this.urlParam['yelloVipLevel']);
	}

	static get isYelloHighVip(): number {
		return parseInt(this.urlParam['isYelloHighVip']);
	}

	static get logurl(): string {
		return decodeURIComponent(this.urlParam['logurl']);
	}

	static get isFirstLoad(): boolean {
		return !LocationSYBProperty.isLocation && LocationSYBProperty.roleCount == 0;
	}

	static get loadurl(): string {
		return decodeURIComponent(this.urlParam['loadurl']);
	}

	static get pfid(): string {
		return this.urlParam['pfid'] || "";
	}

	static get pf(): string {
		return this.urlParam['pf'] || "";
	}

	//资源版本
	static get ver_res(): number {
		return this.urlParam["ver_res"] ? parseInt(this.urlParam["ver_res"]) : 0;
	}

	static isCanLogin(): boolean {
		return this.openID != null &&
			this.password != null &&
			this.srvid != null &&
			this.serverIP != null &&
			this.serverPort != null;
	}


	/**
	 * 是否内网
	 */
	static get isLocation(): boolean {
		return SYWXPlat ? false : (location.href.indexOf("192.168.201") >= 0
			|| location.href.indexOf("127.0.0.1") >= 0
			|| location.href.indexOf("localhost") >= 0
			|| location.href.indexOf("cq.api.com") >= 0
			|| location.href.indexOf("10.10.1") >= 0
			|| location.href.indexOf("10.10.4") >= 0)
	}

	private static progress: any = 0;
	private static proDesc: string = "";

	/**
	 * 设置加载进度 & 描述
	 */
	static setLoadProgress(n: number, str: string): void {
		this.progress = n;
		this.proDesc = str;
	}

	static get progressDesc(): string {
		return this.proDesc;
	}

	static get loadProgress(): number {
		return this.progress;
	}

}

/**
 * 分享成功返回
 */
function shareCallback() {
	// PfActivity.ins().sendWeiXinInviteGift();
	// ViewSYBManager.ins().close(YqWin);
}

/**
 * 是否关注 -1关闭 0未关注 1已关注
 * @param code
 */
function isFocusCallback(code: string) {
	// PfActivity.ins().postGuanZhu(+code);
}

/**
 * 是否开启分享 -1关闭 其他开启
 * @param code
 */
function isShareCallback(code: string) {
	// PfActivity.ins().postShare(+code);
}
