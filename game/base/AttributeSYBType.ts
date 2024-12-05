/**
 *
 * @author
 *
 */

enum AttributeSYBType {
	atHp = 0, // 当前生命

	// 基础属性
	atAttack = 1, // 攻击
	atHpMax = 2, // 生命
	atDefense = 3, // 防御
	atSpeed = 4, // 攻击速度

	// 特殊属性
	atCritRate = 5, // 暴击(万分比)  
	atCritDamage = 6,//暴击伤害率
	atOpposeCritRat = 7, // 爆抗(万分比)
	atHitRate = 8, // 命中(万分比)
	atDodgeRate = 9, // 闪避(万分比)
	atAddDamage = 10, // 增伤(万分比)
	atReduceDamage = 11, // 免伤(万分比)
	atPhyAddDamage = 12, // 物理增伤(万分比)
	atPhyReduceDamage = 13, // 物理免伤(万分比)
	atMagAddDamage = 14, // 魔法增伤(万分比)
	atMagReduceDamage = 15, // 魔法免伤(万分比)
	atRange = 16,//攻击距离
	// 基础万分比属性
	atAttackRate = 21, // 攻击(万分比)
	atMaxHpRate = 22, // 生命(万分比)
	atSpeedRate = 24, // 攻击速度(万分比)

	//回血属性
	atHpCover = 25,//固定回血
	atHpCoverRate = 26,//百分比回血

	//移速
	atMoveSpeed = 27,//怪物每秒可移动的像素距离
	atMoveSpeedRate = 28,//增加/减少怪物移动速度

	//金币
	atGold = 29,//回合结束获取固定金币
	//伤害类型
	atDamageType = 30,//物理1，法术2，默认物理
	atCount,

}
