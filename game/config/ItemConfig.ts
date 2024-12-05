/**
 * ItemConfig
 */
class ItemConfig {

	/* 物品id(10开头的是装备) */
	public readonly id: number;
	public readonly name: string;
	public readonly type: number;//类型
	public readonly subType: number;//子类型
	public readonly level: number;//限制等级
	public readonly quality: number;//品质
	public readonly icon: number;//图标
	public readonly desc: string;//描述
	public readonly useType: number = 0;
	public readonly eff: string;

	public static GetIcon(config: ItemConfig): string {
		return RES_DIR_ITEM + config.icon + '.png';
	}

	static getQualityColor(config: ItemConfig): number {
		return ItemBase.QUALITY_COLOR[config.quality];
	}

}