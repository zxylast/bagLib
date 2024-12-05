class UniqueSkillBuffConfig {
	public readonly id: number;
	public readonly bId: number;
	public readonly showName: string;
	public readonly skillIcon: string;
	public readonly desc: string;
	public readonly ifRepeat: number;
	public readonly forWard: number;
	public readonly weight: number;
	public readonly limitLv: number;
	public readonly buffType: { type: number, value: number }[];
}