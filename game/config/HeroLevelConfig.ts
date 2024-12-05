class HeroLevelConfig {
	public readonly id: number;
	public readonly lv: number;
	public readonly costNeed: RewardData[];
	public readonly attr: AttributeSYBData[];
	public readonly buffShowStr: string[];
	public readonly showAttr: any[];
	public readonly extraAttr: { attr: AttributeSYBData[], stage: number, target: number };
}