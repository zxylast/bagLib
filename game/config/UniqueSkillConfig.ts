class UniqueSkillConfig {
	public readonly id: number;
	public readonly level: number;
	public readonly cost: RewardData[];
	public readonly attr: { type: number, value: number }[];
	public readonly cd: number;
}