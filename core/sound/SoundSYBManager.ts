/**
 * Created by yangsong on 15-1-14.
 * Sound管理类
 */
class SoundSYBManager extends BaseSYBClass {
	/**
	 * 音乐文件清理时间
	 * @type {number}
	 */
	public static CLEAR_TIME: number = 3 * 60 * 1000;

	private effect: SoundSYBEffects;
	private bg: SoundSYBBg;
	private effectOn: boolean;
	private bgOn: boolean;
	private currBg: string = "";
	private bgVolume: number;
	private effectVolume: number;
	private inBattle: boolean;

	/**
	 * 构造函数
	 */
	public constructor() {
		super();

		this.bgOn = true;
		this.effectOn = true;

		this.bgVolume = 0.5;
		this.effectVolume = 0.5;

		this.bg = new SoundSYBBg();
		this.bg.setVolume(this.bgVolume);

		this.effect = new SoundSYBEffects();
		this.effect.setVolume(this.effectVolume);
	}

	public static ins(): SoundSYBManager {
		return super.ins() as SoundSYBManager;
	}

	/**
	 * 播放音效
	 * @param effectName
	 */
	public playEffect(effectName: string): void {
		if (!this.effectOn)
			return;

		this.effect.play(effectName);
	}


	public playSceneBg(param: number = 3): void {
		let music: string = '';

		//if (this.currBg == music) return;
		this.currBg = music;
		if (!this.bgOn)
			return;

		this.bg.play(this.currBg);
	}
	public playBattleBg(): void {
		this.inBattle = true;
		var bgName = ""
		this.currBg = bgName;
		if (!this.bgOn)
			return;

		this.bg.play(bgName);
	}
	// public playShopBg(): void {
	// 	this.inBattle = false;
	// 	var bgName = SoundUtil.ins().getShopBg();
	// 	this.currBg = bgName;
	// 	if (!this.bgOn)
	// 		return;

	// 	this.bg.play(bgName);
	// }


	/**
	 * 播放背景音乐
	 * @param key
	 */
	public playBg(bgName: string): void {
		this.currBg = bgName;
		if (!this.bgOn)
			return;

		this.bg.play(bgName);
	}

	/**
	 * 停止背景音乐
	 */
	public stopBg(): void {
		this.bg.stop();
	}

	//点击播放
	public touchBg(): void {
		if (egret.Capabilities.isMobile && egret.Capabilities.os == 'iOS') {
			this.bg.touchPlay();
			//UserSYBTips.ins().showTips("ios");
		}
	}

	/**
	 * 设置音效是否开启
	 * @param $isOn
	 */
	public setEffectOn($isOn: boolean): void {
		this.effectOn = $isOn;
	}

	/**
	 * 设置背景音乐是否开启
	 * @param $isOn
	 */
	public setBgOn($isOn: boolean): void {
		this.bgOn = $isOn;
		if (!this.bgOn) {
			this.stopBg();
		} else {
			if (this.currBg) {
				this.playBg(this.currBg);
			}
		}
	}

	/**
	 * 设置背景音乐音量
	 * @param volume
	 */
	public setBgVolume(volume: number): void {
		volume = Math.min(volume, 1);
		volume = Math.max(volume, 0);
		this.bgVolume = volume;
		this.bg.setVolume(this.bgVolume);
	}

	/**
	 * 获取背景音乐音量
	 * @returns {number}
	 */
	public getBgVolume(): number {
		return this.bgVolume;
	}

	/**
	 * 设置音效音量
	 * @param volume
	 */
	public setEffectVolume(volume: number): void {
		volume = Math.min(volume, 1);
		volume = Math.max(volume, 0);
		this.effectVolume = volume;
		this.effect.setVolume(this.effectVolume);
	}

	/**
	 * 获取音效音量
	 * @returns {number}
	 */
	public getEffectVolume(): number {
		return this.effectVolume;
	}

}