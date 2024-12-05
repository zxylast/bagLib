class ChapterConfig {
	public readonly index: number;
	public readonly fbId: number;
	public readonly rewards: RewardData[];
	public readonly waveRewards: { wave: number, rewards: RewardData[] }[];
	public readonly maxWave: number;
	public readonly title: string;
	public readonly bg: string;
	public readonly icon: string;
}