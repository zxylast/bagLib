/**
 * 角色
 * @author
 */
class CharRole extends CharMonster {

	public constructor() {
		super();

		this.touchEnabled = false;
		this.touchChildren = false;

		this.AI_STATE = AI_State.Stand;

	}

	protected playBody(e: egret.Event): void {
		super.playBody(e);
	}

	/**
	 * 更新数据显示
	 */
	public updateBlood(force: boolean = false): void {
		super.updateBlood(force);
	}

	public updateModel(): void {
		super.updateModel();
		//this.updateBlood(true);

	}

	protected parseModel() {

		// let monsterBody = "monster1";
		// this.initBody(monsterBody);
		// this.updateBlood(true);
	}

	public addBuff(): void {
		
	}


	public set infoModel(model: EntitySYBModel) {
		if (model) {
			this._infoModel = model;
		} else {
			Log.trace("设置infoModel异常,对象为空");
		}
	}

	public get infoModel(): EntitySYBModel {
		return this._infoModel as EntitySYBModel;
	}

	public reset() {
		super.reset();
		this.AI_STATE = AI_State.Stand;
	}


	public destruct(): void {
		super.destruct();
		this.AI_STATE = AI_State.Stand;

	}

	public deadDelay(): void {

		this.stopMove();
		this.removeHardStraight();

		this.atking = false;
		TimerSYBManager.ins().removeAll(this);
	}

	public showBodyContainer() {
		if (this.isShowBody) return;
		super.showBodyContainer();
	}

	public hideBodyContainer() {
		if (!this.isShowBody) return;
		super.hideBodyContainer();
	}

	/**
	 * 死亡处理（表现方面）
	 * @returns void
	 */
	// public onDead(callBack?: () => void): void {
	// 	this.stopMove();
	// 	this.playAction(EntityAction.DIE, callBack);
	// }

	public stopMove() {
		super.stopMove();
	}
}
