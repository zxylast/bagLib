/**
 *
 * @author
 *
 */
class Actor extends BaseSYBSystem {

	public static ins(): Actor {
		return super.ins() as Actor;
	}

	public static handle: number;

	/** 个人id */
	public static actorID: number;
		/** 名字 */
	private _myName: string;
		/**性别 */
	private _sex: number = 0;
		/** 等级 */
	private _level: number = 1;
		/** 创角时间 秒*/
	public static createTime: number;
		/**阶级 */
	private _stageLv: number = 0;
	/**货币数据 */
	public static moneyData: { [type: number]: number } = {};
	/**上一个货币数据 */
	public static lastMoneyData: { [type: number]: number } = {};

	public constructor() {
		super();

		this.sysId = PackageSYBID.Default;
		this.regNetMsg(1, this.postInit);
		this.regNetMsg(4, this.postResourcesData);
	}

	protected initLogin() {
		
	}

	/**初始化货币数据 */
	public initMoneyData(): void {
		Actor.moneyData = {};
		Actor.lastMoneyData = {};
		for (let i in GlobalJYConfig.MoneyConfig) {
			Actor.moneyData[GlobalJYConfig.MoneyConfig[i].id] = 0;
			Actor.lastMoneyData[GlobalJYConfig.MoneyConfig[i].id] = 0;
		}
	}

	/**
	 * 0-4
	 * 更新金钱资源
	 */
	public postResourcesData(bytes: GameByteSYBArray): void {
		let type = bytes.readShort();
		let value = bytes.readDouble();
		this.postMoneyChange(type, value);
	}

	/**
	 * 0-1
	 * 初始化角色数据
	 */
	postInit(bytes: GameByteSYBArray): void {
		this.initMoneyData();

		Actor.handle = bytes.readDouble();
		platformWX.actorid = Actor.actorID = bytes.readInt();
		GameServer.serverID = bytes.readInt();
		//一般使用readString接口读取
		//这里需要靠长度读取，有疑问看协议编辑器
		this.postNameChange(bytes.readUTFBytes(33));
		this._sex = bytes.readInt();
		let tmp = bytes.readInt();
		this._level = tmp > 0 ? tmp : 1;
		this.postMoneyChange(MoneyConst.NumericType_Gold, bytes.readDouble());
		this.postMoneyChange(MoneyConst.NumericType_YB, bytes.readDouble());
		let vipLevel=bytes.readInt();
		Actor.createTime = bytes.readInt();
		this._stageLv = bytes.readInt();
	}

	public postMoneyChange(type: number, value: number): void {
		Actor.lastMoneyData[type] = Actor.moneyData[type];
		if (Actor.moneyData[type] != value) {
			Actor.moneyData[type] = value;
		}
	}

	public postGetTmpGold(num: number): void {
		Actor.lastMoneyData[MoneyConst.NumericType_Gold] = Actor.moneyData[MoneyConst.NumericType_Gold];
		Actor.moneyData[MoneyConst.NumericType_Gold] += num;
	}

		public postNameChange(value: string) {
		if (this._myName != value) {
			this._myName = value;
		}
	}

}

namespace GameSystem {
	export let actor = Actor.ins.bind(Actor);
}

