class GameSYBLocalStorage {

	private static _instance: GameSYBLocalStorage = null;
	private data: any;

	public static get Instance(): GameSYBLocalStorage {
		if (!GameSYBLocalStorage._instance) {
			GameSYBLocalStorage._instance = new GameSYBLocalStorage();
		}
		return GameSYBLocalStorage._instance;
	}

	public init() {
		var value = egret.localStorage.getItem(Authorize.Instance.SDK.SDKData.UserID);
		if (value) {
			this.data = JSON.parse(value);
		} else {
			this.data = new Object();
		}
	}

	public SetValue(key: string, value: string) {
		if (this.HasValue(key) && this.GetValue(key) == value) {
			return;
		}
		this.data["key"] = value;
		egret.localStorage.setItem(Authorize.Instance.SDK.SDKData.UserID, JSON.stringify(this.data));
	}

	public HasValue(key: string): boolean {
		if (this.data) {
			return this.data["key"];
		}
		return false;
	}

	public GetValue(key: string): string {
		return this.data["key"];
	}

}