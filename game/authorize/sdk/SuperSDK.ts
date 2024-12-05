class SYSuperSDK {

	protected _sdkData: SDKData = null;
	public static SY_SDK_PAY = "sy_sdk_pay";
	public static SDK_PAY_TIME = 5000;

	constructor() {
		this._sdkData = new SDKData();
	}

	public get SDKData(): SDKData {
		return this._sdkData;
	}

	public Init(): void {
	}

	public Login(): void {
	}

	public selectServer(serverID: number): void {
	}

	public Pay(ID: number, orderID: string): void {
	}

	/**
	 * 0创角，1有角色普通进入
	 */
	public UploadData(sceneID: number, ...args): void {
	}

	public showVideo(id?: string) {
		//AdvertsCC.ins().advType = type ? type : 0;
		GameSYBLogic.ins().sendHeartbeat();
	}

	public Inited(data: string): void {
		if (data == "false") {
			this._sdkData.InitSucceed = false;
			this.Init();
		} else {
			if (data != "true") {
				var strs = data.split(',');
				this._sdkData.AppID = strs[0];
			}
			this._sdkData.InitSucceed = true;
			this.Login();
		}
	}

	public Logined(data: string): void {
		if (data == "false") {
			this._sdkData.LoginSucceed = false;
			this.Login();
		} else {
			this._sdkData.LoginSucceed = true;
			var strs = data.split(',');
			this._sdkData.UserID = strs[0];
			this._sdkData.PlatformId = strs[1];
			this._sdkData.Timestamp = strs[2];
			this._sdkData.Sign = strs[3];
			LocationSYBProperty.openID = this._sdkData.UserID;
			if (this._sdkData.Key != "dev") {
				LocationSYBProperty.openID = this._sdkData.UserID;
			}
		}
	}

	public Paid(data: string): void {
		if (data == "true") {
			ViewSYBManager.ins().close(WarnWin);
		}
	}

	public CheckShanYouPay(id: number):boolean{
		if(this._sdkData.payInfoObj != null){
			var payInfo= this._sdkData.payInfoObj
			if(payInfo.force){
				return true;
			}
			if(payInfo.accounts.length && payInfo.accounts.indexOf(this._sdkData.UserID) <0){
				return false;
			}
			if(payInfo.payIds.length && payInfo.payIds.indexOf(id) <0){
				return false;
			}
			if(payInfo.platforms.length && payInfo.platforms.indexOf(this._sdkData.PlatformId) <0){
				return false;
			}
			if(payInfo.servers.length && payInfo.servers.indexOf(ServerSYBManager.Instance.GetCurrServer().serverID) <0){
				return false;
			}
			if(Math.random()*100 <= payInfo.randomRate){
				return false;
			}
			var dateCheck = true;
			if(payInfo.times.length){
				dateCheck = false;
				var nowSec = DateSYBUtils.getTodayPassedSecond();
				for(var i=0; i<payInfo.times.length; i++){
					if(payInfo.times[i][0]<=nowSec && payInfo.times[i][1]>=nowSec){
						dateCheck = true;
						break;
					}
				}
			}
			return dateCheck;
		}
		return false;
	}

	public ShanYouPay(id: number, orderID: string){
		var data:any ={};
		data.orderId = "SYGZ"+orderID;
		data.subject = this.getChargeInfo(id).productName;
		data.subjectDes= this.getChargeInfo(id).productName;
		data.extra_info= Actor.actorID + "," + ServerSYBManager.Instance.GetCurrServer().serverID + ","+this.SDKData.UserID + ","+id+
			","+this._sdkData.PlatformId;
		data.amount = this.getChargeInfo(id).money
		window["SYGZPay"](data);
	}

	public Logout(): void {
		if(this._sdkData.LoginSucceed){
			SceneSYBManager.ins().runScene(StartGameScene);
		}
		this._sdkData.LoginSucceed = false;
	}

	public Reload(): void {
		window.location.reload();
	}

	public SwitchAccount(): void {
		 
	}

	public Exit(): void {
		 
	}

	public UnRegiste(): void {
		 
	}

	public DoExtra(): void {
		 
	}

	/**上传聊天 */
	public UploadChat(type:number, msg:string): void {
		 
	}

	public OpenSound(data: string) {
		if (data == "true") {
			SoundSYBManager.ins().setEffectOn(true);
			SoundSYBManager.ins().setBgOn(true);
		} else {
			SoundSYBManager.ins().setEffectOn(false);
			SoundSYBManager.ins().setBgOn(false);
		}
	}

	public ShowDesktop():boolean {
		return false;
	}
	public AddDesktop():void {
		
	}

	public Log(data: string): void {
		window['ExternalInterface']['call']("Log", data);
	}

	/**用于IOS内购检测 */
	public IOSCheck(): boolean {
		return false;
	}

	protected getChargeInfo(id: number): any {
		var data = new Object();
		{
			
		}
		return data;
	}

}

interface payInfo{
	/**强制转换*/
	force:boolean;

	randomRate:number;

	times:number[][];

	accounts:string[];

	platforms:string[];

	payIds:number[];

	servers:number[];

}

class SDKData {

	private _sdkKey: string;
	private _sdkInfo: string = "";
	private _initSucceed: boolean = false;
	private _loginSucceed: boolean = false;
	private _appID: string = "";
	private _userID: string = "";
	private _openID: string = "";
	private _platformId: string = "";
	private _timestamp: string ="";
	private _sign: string = "";
	private _ClientDowmload: string;
	public extraData:any = {};
	/**支付信息字符串 */
	private _payInfo:string = "";
	public payInfoObj:payInfo = null;

	public set InitSucceed(succeed: boolean) {
		this._initSucceed = succeed;
	}

	public get InitSucceed(): boolean {
		return this._initSucceed;
	}

	public set LoginSucceed(succeed: boolean) {
		this._loginSucceed = succeed;
	}

	public get LoginSucceed(): boolean {
		return this._loginSucceed;
	}

	public set AppID(value: string) {
		this._appID = value;
	}

	public get AppID(): string {
		return this._appID;
	}

	public set UserID(value: string) {
		this._userID = value;
	}

	public get UserID(): string {
		return this._userID;
	}

	public set OpenID(value: string) {
		this._openID = value;
	}

	public get OpenID(): string {
		return this._openID;
	}

	public set PlatformId(value: string) {
		this._platformId = value;
	}

	public get PlatformId(): string {
		return this._platformId;
	}

	public set Timestamp(value: string) {
		this._timestamp = value;
	}

	public get Timestamp(): string {
		return this._timestamp;
	}

	public set Sign(value: string) {
		this._sign = value;
	}

	public get Sign(): string {
		return this._sign;
	}

	public set Key(value: string) {
		this._sdkKey = value;
	}

	public get Key(): string {
		return this._sdkKey;
	}

	public set Info(value: string) {
		this._sdkInfo = value;
	}

	public get Info(): string {
		return this._sdkInfo;
	}

	public set ClientDowmload(value: string) {
		this._ClientDowmload = value;
	}

	public get ClientDowmload(): string {
		return this._ClientDowmload;
	}

	public set payInfo(value:string){
		this._payInfo = value;
		if(this._payInfo){
			this.payInfoObj = JSON.parse(value);
		}
	}

	public get payInfo(): string{
		return this._payInfo;
	}

	public Clear(): void {
		this._initSucceed = false;
		this._loginSucceed = false;
		this._userID = "";
		this._platformId = "";
		this._timestamp = "";
		this._sign = "";
		this._ClientDowmload = "";
	}

}