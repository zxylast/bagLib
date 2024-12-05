class Authorize {

	private static _instance: Authorize = null;

	public static get Instance(): Authorize {
		if (!Authorize._instance) {
			Authorize._instance = new Authorize();
		}
		return Authorize._instance;
	}

	private _sdk: SYSuperSDK;

	public get SDK(): SYSuperSDK {
		return this._sdk;
	}

	public Start() {
		if (SYWeixin || PlatFormID.SDK_TYPE.indexOf(PlatFormID.DEV) != -1) {
			this._sdk = new DevSDK();
			this._sdk.Init();
		}
	}

}

