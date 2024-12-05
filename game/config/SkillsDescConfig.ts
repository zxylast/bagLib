/**
 * Created by Administrator on 2017/6/27.
 */
interface SkillsDescConfig {
	readonly id: number;
	readonly name: string;
	readonly desc: string;
	readonly cd: number;
	readonly actionType: string;
	readonly wordEff: string;
	readonly sound: string;
	readonly show: number;
	readonly effectId: string;
	readonly castRange: number;
	/** 对怪物伤害减少比例 */
	readonly herdMonRate: number;
	/** 对玩家伤害减少比例 */
	readonly herdPlayerRate: number;
	/**技能类型 */
	readonly type: number;
}