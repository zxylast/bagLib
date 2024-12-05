class ShopItemConfig {
	public readonly type: number;
	public readonly id: number;
	public readonly limitType: number;
	public readonly limit: number;
	public readonly buyCost: RewardData[];
	public readonly rewards: RewardData[];
	public readonly discount: number;
	public readonly autobuy: number;
	public readonly childType: number;
	// public readonly buyLimit: { type: number, cond: number };
	public readonly checkRed: number;
	public readonly freeNum: number;
	public readonly progressBar: number;

	public readonly maxprogressBar: number;
	public readonly freeGetNum: number;
	public readonly referGup: { name: string, bg: string, icon: string, desc: string };
	public readonly BarLevel: number;


}