/**
 *  奖励数据
 * @author
 */
class RewardData {

	/**货币 */
	public static TYPE_RES: number = 0;
	/**道具装备 */
	public static TYPE_ITEM: number = 1;

	/**
	 * 奖励类型
	 * 0 货币奖励
	 * 1 道具装备奖励
	 */
	public type: number;
	/**
	 * id
	 * (货币类型的时候表示   0经验 1金币 2彩钻 3钻石 4神树经验)
	 * (道具装备的时候表示   道具id)
	 */
	public id: number;
	/**
	 * 数量
	 */
	public count: number;

	public rate: number;

	public constructor(type: number = 0, id: number = 0, count: number = 0, rate: number = 0) {
		this.type = type;
		this.id = id;
		this.count = count;
		this.rate = rate;
	}

	public parser(bytes: GameByteSYBArray) {
		this.type = bytes.readByte();
		this.id = bytes.readInt();
		this.count = bytes.readInt();
	}

	static getCurrencyRes(v: number): string {
		return GlobalJYConfig.MoneyConfig[v].icon;
	}

	static getCurrencyName(v: number): string {
		return GlobalJYConfig.MoneyConfig[v].name;
	}

	static getCurrencyDESC(v: number): string {
		return GlobalJYConfig.MoneyConfig[v].desc;
	}

	static getCurrencyQuality(v: number): number {
		return GlobalJYConfig.MoneyConfig[v].quality;
	}

	static getCostCount(reward: RewardData): number {
		let count = 0
		if (reward.type == 0) {
			count = this.getCurrencyHas(reward.id)
		}
		else {
			count = UserBagSYBCC.ins().getBagGoodsCountById(reward.id);
		}
		return count;
	}

	static getCostShowTips(reward: RewardData): void {
		if (reward.type == this.TYPE_ITEM) {
			// UserSYBWarn.ins().setBuyGoodsWarn(reward.id);
		} else {
			UserSYBTips.ins().showTips(this.getCurrencyName(reward.id) + "不足！");
		}
	}

	static getCurrencyHas(v: number): number {
		return Actor.moneyData && Actor.moneyData[v] ? Actor.moneyData[v] : 0;
	}

	static getLastCurrencyHas(v: number): number {
		return Actor.lastMoneyData && Actor.lastMoneyData[v] ? Actor.lastMoneyData[v] : 0;
	}

	/**
 * 一组奖励合并
 */
	static RewardMultition(reward1: RewardData[], reward2: RewardData[]): RewardData[] {
		let reward: RewardData[] = [];
		if (!reward1 && !reward2) {
			return null;
		}

		reward = !reward1 ? reward2 : reward1.concat(reward2);
		//合并相同属性
		let newObj: RewardData[] = [];
		let len = reward.length;
		let obj: { [id: number]: { type: number, id: number, count: number } } = {};
		for (let i: number = 0; i < len; i++) {
			if (obj[reward[i].id] == undefined) {
				obj[reward[i].id] = { type: reward[i].type, id: reward[i].id, count: reward[i].count };
			} else {
				obj[reward[i].id].count += reward[i].count;
			}
		}

		for (let key in obj)
			newObj.push(new RewardData(+obj[key].type, +obj[key].id, +obj[key].count));

		return newObj;
	}
}
