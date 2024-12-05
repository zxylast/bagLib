class ItemRewardData {
	public handle: number;//只有装备有handle 其他都是-1 装备出售后也是-1
	public id: number;
	public type: number;
	public count: number;
	public rate: number = 1;//设置倍数，默认为1即无倍数

	public parser(bytes: GameByteSYBArray) {
		this.type = bytes.readByte();
		this.id = bytes.readInt();
		this.count = bytes.readDouble();
		this.rate = bytes.readDouble();
	}
}