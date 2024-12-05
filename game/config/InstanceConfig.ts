class InstanceConfig {
	public readonly id: number;
	public readonly type: number;
	public readonly round: number;
	public readonly monsters: number[][];
	public readonly rsfTime: number;
	public readonly roundRsfTime: { roundTime: number, rsfNum: number, rsfTotal: number }[];
	public readonly bossId: number[];
	public readonly bossRound: number[];
	public readonly mTotal: number;
}