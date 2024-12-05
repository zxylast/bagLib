class ItemData {

	public handle: number;
	public configID: number;
	public type: number;
	public childType: number
	public count: number;
	public star: number;//星级
	public quality: number;//装备品质
	public itemConfig: ItemConfig;
	public goldLevel: number;//金装等级

	public parser(bytes: GameByteSYBArray): void {
		this.handle = bytes.readDouble();
		this.configID = bytes.readInt();
		this.type = bytes.readInt();
		this.childType = bytes.readInt();
		this.count = bytes.readInt();
		this.star = bytes.readInt();
		this.quality = bytes.readInt();
		this.goldLevel = bytes.readInt();

		this.itemConfig = GlobalJYConfig.ItemConfig[this.configID];
		if (this.itemConfig) {
			this.quality = this.itemConfig.quality;
		} else {
			this.itemConfig = null;

		}

	}


}