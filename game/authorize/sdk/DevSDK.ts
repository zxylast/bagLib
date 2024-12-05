class DevSDK extends SYSuperSDK {

	public constructor() {
		super();
		this._sdkData.Key = PlatFormID.DEV;
		this._sdkData.PlatformId = "Dev"
	}

	public Init(): void {
		this.Inited("true");
	}

	public Login(): void {
		if(SYWeixin){
			this.Logined("test4,1,1,1");
			return;
		}
		if (!this._sdkData.LoginSucceed) {
			DevLogin();
		}
	}

	public Pay(id: number, orderID: string): void {
		this.Paid("true");
	}

}