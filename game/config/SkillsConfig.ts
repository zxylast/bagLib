/**
 * SkillsConfig
 */
interface SkillsConfig {

	readonly id: number;
	/** 技能类型 */
	readonly type: number;
	/** 被动技能参数 */
	readonly passive: { rate: number, cond: number, p1: number, p2: number };
	/** 描述扩展数字 */
	readonly desc_ex: number[];
	/**
	 * 施法目标类型
	 * 1、友方
	 * 2、敌方
	 * 3、自己
	 */
	readonly castType: number;
	/**
	 * 作用目标类型
	 * 1、友方
	 * 2、敌方
	 */
	readonly targetType: number;

	/**
	 * 伤害计算类型
	 * 0、没有伤害
	 * 1、造成伤害
	 * 2、加血
	 */
	readonly calcType: number;
	/**
	 * 作用范围大小
	 * 按格子
	 * 0、单攻
	 * 1、目标周围1格
	 */
	readonly affectRange: number;
	/** 最大作用个数 */
	readonly affectCount: number;
	/**
	 * 参数列表
	 */
	readonly args: { b: number, a: number, c: number }[];
	/**关联其他技能*/
	readonly otherSkills: number;
	/**关联其他技能限制 */
	readonly otherSkillsLimit: number;
	/**关联秘籍技能 */
	readonly bookSkills: number;
	/**
	 * 次要目标附加效果 对人物有效
	 */
	readonly otarEff: number[];

	/**
	 * 目标附加效果
	 */
	readonly tarEff: { lv: number, buffId: number }[];
	/**
	 * 自身附加效果 
	 */
	readonly selfEff: { lv: number, buffId: number }[];
	/** 自身是否位移（0否1是） */
	readonly teleport: number;
	/** 附加击退（距离） */
	readonly repelDistance: number;
	/**击退概率(万分比) */
	readonly repelProbability: number;
	/**击退僵直持续时间 */
	readonly durationTime: number;
	/**是否闪现 */
	readonly isFlash: number;
	/** 特效播放类型  x:类型,y:特效名,z:延迟 */
	readonly effType: any[];
	/**
		 * 描述id
		 */
	readonly desc: number;

	readonly needMp: number;
	/**受击延迟 */
	readonly hitDelay: number[];
	/**技能阵营增伤 */
	readonly skillCamp: number[];
	/**震屏 */
	readonly shock: number[];
	/**伤害间隔 */
	readonly damageTime: number;
	/**伤害持续 */
	readonly damageDuraTime:number;
}