class HeroGirdConfig {
	public readonly id: number;
	public readonly stage: number;
	public readonly mainNeed: { id: number, stage: number };
	public readonly secondNeed: { id: number, stage: number };
	public readonly limit: number;
	public readonly heroImage: string;
	public readonly skillId: { lv: number, id: number }[];
	public readonly attr:AttributeSYBData[];
}