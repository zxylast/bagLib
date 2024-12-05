/**
 *
 * @author
 *
 */
class EntitySYBModel extends NpcModel {

	public index: number;
	public masterHandle: number;
	public handle: number;
	public configID: number;
	public type: EntitySYBType;
	public x: number;
	public y: number;
	protected _name: string;
	public _avatar: number;
	public _scale: number;
	public _dirNum: number;

	public posType: number;//记录怪物生成位置
	public posIndex: number;

	public stage: number;
	public lv: number;
	/**
	 * 属性集
	 */
	public attributeData: number[] = [];
	public attributeExData: number[] = [];

	public team: Team;
	public killNum: number = 0;

	public isMy: boolean = false;


	constructor() {
		super();
		this.type = EntitySYBType.Monster;
	}







	public getAtt(attType: AttributeSYBType): number {
		return this.attributeData[attType] || 0;
	}

	public setAtt(attType: AttributeSYBType, value: number): void {
		this.attributeData[attType] = value;
	}



	public get avatarFileName(): string {
		return `monster` + this.avatar;
	}



	public get avatar() {
		// let cfg = GlobalConfig.MonstersConfig[this.configID];
		// let modelCfg = GlobalConfig.MonstersModelConfig[cfg.m];
		return this._avatar;
	}

	public get name(): string {
		// let cfg = GlobalConfig.MonstersConfig[this.configID];
		// let modelCfg = GlobalConfig.MonstersModelConfig[cfg.m];
		return this._name;
	}


	/**获取带服务器ID的名字(不换行，策划需求，跨服场景中，名字默认加服务器ID)*/
	// public getNameWithServer(): string {
	// 	return this._servId && KFServerSys.ins().isKF ? this.name + `S${this._servId}` : this.name;
	// }



	public get avatarScale(): number {

		return 1;
	}


	public get avatarEffect(): string {

		return "";
	}


	public get movePara(): any {
		// if (GlobalConfig.YouDangConfig[this.wandertime] && this.wanderrange) {
		// 	return [this.wanderrange, GlobalConfig.YouDangConfig[this.wandertime].fileName];
		// }
		return null;
	}

	public set name(str: string) {
		this._name = str;
	}


	public setPos(x: number, y: number): void {
		this.x = x;
		this.y = y;
	}

}
