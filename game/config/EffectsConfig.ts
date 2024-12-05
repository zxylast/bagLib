/**
 * 技能效果配置
 */
class EffectsConfig {

	public readonly id: number;
	/** 是否增益 */
	public readonly isBuff: number;
	/**
	 * 效果类型
	 * 1 附加伤害 {a=系数,t=施法者属性类型,b=附加值}
	 * 2 加血 {a=系数,t=施法者属性类型,b=附加值}
	 * 3 附加属性 {a=系数,t1=施法者属性类型,b=附加值, t2=附加属性类型}
	 * 4 附加状态
	 * 5 召唤 {怪物1id,怪物2id，怪物3id…}
	 */
	public readonly type: SkillEffType;
	/** 效果参数 */
	public readonly args: { a: number, b: number, c: number, d: number, i: number };
	/** 持续时间（毫秒）*/
	public readonly duration: number;
	/** 作用间隔（毫秒）*/
	public readonly interval: number;
	/**
	 * 叠加类型
	 * id相同时的叠加类型：
	 * 0,不叠加，替换
	 * 1，时间延长
	 * 2，独立计算
	 * 3，刷新并延长（没必要且不想做）
	 */
	public readonly overlayType: number;
	/** 分组类型(分组相同的会替换) */
	public readonly group: number;
	/** 特效名字 */
	public readonly effName: string;
	/** 开头特效id */
	public readonly effID: number;
	/**buff图 */
	public readonly buffIcon: string;
	/**buff效果说明 */
	public readonly buffDesc: string;
	/**buff名 */
	public readonly buffName: string;

	//联合buff 当前buff移除，联合buff也要移除
	public readonly unionBuff: number[];

	//BUFF触发概率
	public readonly probabilityBuff: number;
	//同组类型叠加最大个数
	public readonly overMaxCount: number;
	/**复活附加buffid */
	public readonly reviveBuff: number[];
	/**效果延迟 */
	public readonly effDelay: number;
	/**移除buff 1:自己 2:友方全体 */
	public readonly removeBuff: number;
	/**buff触发类型 */
	public readonly buffType: number;

	static isAddBuff(config: EffectsConfig): boolean {
		return config.type == SkillEffType.AdditionalState || config.type == SkillEffType.AdditionalDamage ||
			config.type == SkillEffType.AdditionalAttributes || config.type == SkillEffType.Summon;
	}

	public static getArgs(config: EffectsConfig) {
		let addA = 0, addC = 0, addTime = 0, addB = 0;
		if (config.type == 3) {
			addA = config.args.a ? config.args.a : 0;
			addB = config.args.b ? config.args.b : 0;
			addC = config.args.c ? config.args.c : 0;
		}
		return { a: addA, b: addB, c: addC, time: 0 };
	}
}