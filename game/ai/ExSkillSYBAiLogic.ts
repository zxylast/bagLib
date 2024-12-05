/**
 * 客户端特殊技能AI逻辑类
 * @author MPeter
 */
class ExSkillSYBAiLogic extends BaseSYBClass {
	

	/**检测间隔时间 */
	private triggerInterval: any = {};
	public constructor() {
		super();
	}

	/**
	 * 单例
	 * @returns NinjutsuLogic
	 */
	public static ins(): ExSkillSYBAiLogic {
		return super.ins() as ExSkillSYBAiLogic;
	}

	/**间隔执行方法 */
	private intervalDoFun(indx: number, cd: number, fun: Function): void {
		//间隔计算
		if (this.triggerInterval[indx] == undefined)
			this.triggerInterval[indx] = egret.getTimer();
		if (egret.getTimer() - this.triggerInterval[indx] >= 0) {
			fun();
		}
		this.triggerInterval[indx] = egret.getTimer() + cd;
	}
}