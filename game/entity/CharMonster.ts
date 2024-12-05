
/**
 *  怪物类
 * @author
 */
class CharMonster extends CharEffect implements IChar {

	public AI_STATE: AI_State = AI_State.Stand;

	/** 文件名 */
	protected _fileName: string;
	protected _dieGroup: eui.Group;
	// protected _nameGroup: eui.Group;
	protected _buffGroup: eui.Group;
	protected _buffGroup2: eui.Group;
	/** 名字显示 */
	// protected _nameTxt: eui.Label;
	/** 血量条 */
	protected _hpBar: eui.ProgressBar;
	/**阵营 */
	protected _campImg: eui.Image;
	/**等级 */
	protected _levelTxt: eui.Label;
	public publicCD: number = 0;
	//语言气泡
	protected _bubbleGroup: eui.Group;
	protected _bubbleImage: eui.Image;
	protected _bubbleInfo: eui.Label;

	//技能气泡
	// protected _skillGroup: eui.Group;
	// protected _skillImage: eui.Image;
	// protected _skillInfo: eui.Label;
	/**滤镜效果 */
	protected filterDic: { [key: number]: number[] } = {};
	protected curFilter: EntityFilter;

	/** 是否硬直中(不允许直接赋值，需要调用addHardStraight接口) */
	public isHardStraight: boolean = false;
	/**是否定身 */
	public isFixedEntity: boolean = false;

	/** 技能效果列表 */
	public buffList: any;
	public buffEff: any;
	public effCount: any;
	public buffIcon: any;
	public iconCount: any;

	/** 特效列表 */
	private effs: any;

	/** 持续伤害计时器列表 */
	private damageOverTimeList: any;

	/** 是否攻击中 */
	public atking: boolean;

	public ifCanAtk: boolean = true;

	//用来死亡移除给当前目标添加 tween
	public dieTweenObj: { alpha: number };
	public moveTweenObj: { x: number, y: number };

	protected isShowBody: boolean = true;

	public canMove: boolean = false;

	// private buffDescList: CharBuffItem[];

	public constructor() {
		super();

		this.touchEnabled = true;
		this.touchChildren = false;

		this.buffList = {};
		this.buffEff = {};
		this.buffIcon = {};
		this.effCount = {};
		this.iconCount = {};
		this.damageOverTimeList = {};
		this.createTweenObj();
		this.effs = {};
		//	this.buffDescList = [];

		let dImg = new eui.Image();
		dImg.source = 'xuetiao_dengji';
		dImg.x = -30;
		dImg.y = -107;
		this.titleCantainer.addChild(dImg);

		this._hpBar = new eui.ProgressBar();
		this._hpBar.skinName = "bloodBarSkin";
		this._hpBar.anchorOffsetX = 30;
		this._hpBar.anchorOffsetY = 90;
		this._hpBar.labelDisplay.size = 14;
		this._hpBar.visible = true;
		this._hpBar.labelDisplay.visible = false;
		this._hpBar.labelFunction = () => '';
		this._hpBar.scaleX = this._hpBar.scaleY = 1.0;
		//	this.titleCantainer.addChild(this._hpBar);

		// this._campImg = new eui.Image;
		// this._campImg.x = -65;
		// this._campImg.y = -116;
		// this._campImg.scaleX = this._campImg.scaleY = 0.6;
		// this.titleCantainer.addChild(this._campImg);

		// this._levelTxt = new eui.Label;
		// this._levelTxt.size = 18;
		// // this._levelTxt.stroke = 2;
		// // this._levelTxt.strokeColor = 0x3f1b17;
		// this._levelTxt.textColor = 0xF3F1ED;
		// // this._levelTxt.x = -20;
		// this._levelTxt.y = -107;
		// this._levelTxt.bold = true;
		// this.titleCantainer.addChild(this._levelTxt);

		this.titleCantainer.x = 20;
		this.titleCantainer.y = this._bodyContainer.y - this._bodyContainer.height + 20;


		//this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.monsterClick, this);
		this.bubbleCreate();
		// this.skillCreate();
		this._dieGroup = new eui.Group();
		this.addChild(this._dieGroup);

		this._buffGroup = new eui.Group();
		let vlayout: eui.VerticalLayout = new eui.VerticalLayout();
		vlayout.horizontalAlign = egret.HorizontalAlign.CENTER;
		vlayout.verticalAlign = egret.VerticalAlign.BOTTOM;
		this._buffGroup.layout = vlayout;
		this._buffGroup.x = 0;
		this._buffGroup.y = 0;
		this._buffGroup.touchEnabled = false;
		this._buffGroup.touchChildren = false;
		this.addChild(this._buffGroup);

		this._buffGroup2 = new eui.Group();
		let vlayout2: eui.TileLayout = new eui.TileLayout();
		vlayout2.horizontalAlign = egret.HorizontalAlign.LEFT;
		vlayout2.verticalAlign = egret.VerticalAlign.BOTTOM;
		this._buffGroup2.layout = vlayout2;
		this._buffGroup2.x = -60;
		this._buffGroup2.y = -200;
		this._buffGroup2.width = 250;
		this._buffGroup2.height = 200;
		this._buffGroup2.scaleX = this._buffGroup2.scaleY = 0.45;
		this._buffGroup2.touchEnabled = false;
		this._buffGroup2.touchChildren = false;
		this.addChild(this._buffGroup2);

	}
	public setTitleCantainer(y: number): void {
		//this.titleCantainer.x = x;
		this.titleCantainer.y = y;
	}

	public showTitleCantainer(bool: boolean): void {
		this.titleCantainer.visible = bool;
	}

	public setCamp(camp: number): void {
		this._campImg.source = `wujiangtitle${camp}`;
	}

	public setLevel(level: number): void {
		this._levelTxt.text = level + '';
		this._levelTxt.anchorOffsetX = this._levelTxt.width / 2;
	}

	//语言气泡
	protected bubbleCreate(): void {
		this._bubbleGroup = new eui.Group();
		this._bubbleGroup.touchEnabled = false;
		// this._bubbleGroup.height = 80;
		// this._bubbleGroup.width = 120;
		this._bubbleGroup.x = 20;
		// if (GameSYBMap.fbType == FbType.type0 || !BattleCC.ins().getShowScene()) {
		// 	this._bubbleGroup.y = -100;
		// } else {
		// 	this._bubbleGroup.y = -160;
		// }
		// this._bubbleGroup.anchorOffsetY = Math.floor(this._bubbleGroup.height + 2);
		// this._bubbleGroup.anchorOffsetX = Math.floor(this._bubbleGroup.width >> 1);
		this._bubbleGroup.visible = false;

		this._bubbleImage = new eui.Image;
		this._bubbleImage.source = "zhandou_di9";
		this._bubbleImage.touchEnabled = false;
		// this._bubbleImage.width = 299;
		// this._bubbleImage.height = 112;
		this._bubbleImage.scale9Grid = new egret.Rectangle(75, 17, 5, 4);
		this._bubbleImage.left = -16;
		this._bubbleImage.right = -16;
		this._bubbleImage.bottom = -45;
		this._bubbleImage.top = -14;
		this._bubbleGroup.addChild(this._bubbleImage);

		this._bubbleInfo = new eui.Label;
		this._bubbleInfo.touchEnabled = false;
		this._bubbleInfo.size = 20;
		this._bubbleInfo.fontFamily = "CustomFont1";
		this._bubbleInfo.textAlign = "left";
		this._bubbleInfo.textColor = 0x914F2E;
		// this._bubbleInfo.bold = true;
		this._bubbleInfo.horizontalCenter = 0;
		this._bubbleInfo.verticalCenter = 0;
		this._bubbleGroup.addChild(this._bubbleInfo);
		this.addChild(this._bubbleGroup);
	}

	public bubbleShow(show: boolean, strVal: string = "", wait: number = 2000): void {
		if (show) {
			this._bubbleGroup.visible = true;
			this._bubbleGroup.alpha = 1;
			// let cfgKeysLen = Object.keys(GlobalConfig.BattleBubbleConfig).length;
			// if (strVal == "") {
			// 	let str = GlobalConfig.BattleBubbleConfig[Math.floor(Math.random() * cfgKeysLen) + 1].desc;
			// 	this._bubbleInfo.textFlow = TextSYBFlowMaker.generateTextFlow1(str);
			// 	let w = this._bubbleInfo.width;
			// 	this._bubbleInfo.width = w > 210 ? 210 : w;
			// } else {
			// 	this._bubbleInfo.textFlow = TextSYBFlowMaker.generateTextFlow1(strVal);
			// }
			// egret.Tween.get(this._bubbleGroup, { loop: false }).wait(wait).to({ "alpha": 0 }, 300).call(() => { this._bubbleGroup.visible = false });

		} else {
			this._bubbleGroup.visible = false;
		}
	}

	// private monsterClick(e: egret.TouchEvent): void {

	// 	if (!this.infoModel || this.infoModel.type != EntitySYBType.Monster)
	// 		return;

	// 	e.stopImmediatePropagation();
	// }

	public checkPos(): boolean {
		let addRate = UserFbSYBCC.ins().zoomScale == 1 ? 1.5 : 1;
		if (this.x <= (StageSYBUtils.ins().getWidth() - (StageSYBUtils.ins().getWidth() - 10) * addRate)
			|| this.x >= 710 * addRate || this.y >= 1420 * addRate
			|| this.y <= (StageSYBUtils.ins().getHeight() - (StageSYBUtils.ins().getHeight() - 10) * addRate)) {
				//此位置不可攻击
			return true;
		}
		return false;
	}

	protected createTweenObj() {
		let self = this;
		this.dieTweenObj = {
			set alpha(al) {
				self.alpha = al;
			},
			get alpha() {
				return self.alpha;
			}
		};

		this.moveTweenObj = {
			set x(x) {
				self.x = x >> 0;
			},
			set y(y) {
				self.y = y >> 0;
			},
			get x() {
				return self.x;
			},
			get y() {
				return self.y;
			}
		};
	}

	public get infoModel(): EntitySYBModel {
		return this._infoModel as EntitySYBModel;
	}

	public set infoModel(model: EntitySYBModel) {
		this._infoModel = model;
	}

	/**
	 * 播放动作
	 * @action    动作常量EntityAction.ts
	 */
	public playAction(action: EntityAction, callBack?: () => void, frameRate?: number, battleBool: boolean = false): void {

		if ((this._state == action && !this.isAtkAction()) || (this.isActionPriority(action, this._state))) {
			if (this._state != EntityAction.HIT || action != EntityAction.HIT) {
				return;
			}
		}
		//if (this._state == EntityAction.DIE && action == EntityAction.HIT) return;
		if (this.hasFilter(EntityFilter.hard) && action != EntityAction.DIE) {
			// //console.log("已石化中，不能播放其他动作");
			return;
		}
		// if (action == EntityAction.DIE) {
		// 	let cfg = GlobalConfig.MonstersConfig;
		// 	if (this.infoModel.type == EntitySYBType.Monster &&
		// 		cfg[this.infoModel.configID] &&
		// 		cfg[this.infoModel.configID].GetType() == 4) {
		// 		//烈焰戒指无受击与死亡特效
		// 		return;
		// 	}
		// }
		super.playAction(action, callBack, frameRate);
	}

	public addBuff(buff: EntityBuff, handle?: number): void {
		let config: EffectsConfig = buff.effConfig;

		let groupID: number = config.group;

		let oldBuff = this.buffList[groupID];

		if (oldBuff) {
			//叠加倍率
			let oldBuffCfg = oldBuff.effConfig;
			if (oldBuffCfg.overlayType == 2) {
				let multRate = oldBuff.multRate + 1;
				if (multRate > oldBuffCfg.overMaxCount)
					multRate = oldBuffCfg.overMaxCount;
				buff.multRate = multRate;
			}

			this.removeBuff(oldBuff);
		}

		// if (config.removeBuff) {
		// 	this.purifyBuffAll(config.removeBuff);
		// }

		this.buffList[groupID] = buff;

		if (config.effName) {
			if (this.buffEff[groupID]) {
				DisplaySYBUtils.removeFromParent(this.buffEff[groupID]);
				delete this.buffEff[groupID];
			}
			let mc: MovieSYClip = new MovieSYClip();
			let s = RES_DIR_SKILLEFF + config.effName;
			this.playFile(mc, s);
			this.addChild(mc);
			this.buffEff[groupID] = mc;
		}
		if (config.effID) {
			this.addEffect(config.effID);
		}
		// if (config.buffDesc) {
		// 	this._addBuffDesc(config.buffDesc);
		// }

		// if (config.type == SkillEffType.AdditionalState) {
		// 	this._buffAdditionalState(buff, handle);
		// }
		this.addGroup(groupID);

		// //更新主界面buff
		// if (this.infoModel.isMy) {
		// 	GameSYBLogic.ins().postaddBuffChange(config);
		// }
		// if (config.type == SkillEffType.Summon && this.infoModel.type != EntitySYBType.Summon) {
		// 	this._addSummonEntity(buff);
		// }
	}

	public removeBuff(buff: EntityBuff): void {
		let config: EffectsConfig = buff.effConfig;
		let groupID: number = config.group;
		if (this.buffList[groupID] == buff) {
			buff.dispose();
			ObjectPool.push(this.buffList[groupID]);
			delete this.buffList[groupID];

			if (this.buffEff[groupID]) {
				DisplaySYBUtils.removeFromParent(this.buffEff[groupID]);
				delete this.buffEff[groupID];
			}

			if (config.effID) {
				this.removeEffect(config.effID);
			}

			//移除联合buff
			if (config.unionBuff) {
				for (let i in config.unionBuff) {
					let union = this.buffList[config.unionBuff[i]];
					if (union) this.removeBuff(union);
				}
			}

			if (config.type == SkillEffType.AdditionalAttributes) {
				let val: number = 0;
				if (buff.value >= 0) {
					val = this.infoModel.getAtt(buff.effConfig.args.b) - buff.value;
				} else {
					val = this.infoModel.getAtt(buff.effConfig.args.b) + buff.value;
				}
				let buffVal = 0;
				// let buffArgs = buff.effConfig.args;
				// if (buffArgs.b == AttributeSYBType.atFrostResistance || buffArgs.b == AttributeSYBType.atFireResistance || buffArgs.b == AttributeSYBType.atPoisonResistance
				// 	|| buffArgs.b == AttributeSYBType.atLightningResistance || buffArgs.b == AttributeSYBType.atAtkPercent || buffArgs.b == AttributeSYBType.atAttackSpeedEnhance
				// ) {
				// 	buffVal = val;
				// } else {
				buffVal = val <= 0 ? 0 : val;
				// }
				this.infoModel.setAtt(buff.effConfig.args.b, buffVal);
			}
		}
		this.removeGroup(groupID);
		// if (this.infoModel.isMy) {
		// 	GameSYBLogic.ins().postremoveBuffChange(buff.effConfig);
		// }
	}

	public removeAllBuff(): void {
		for (let i in this.buffList)
			this.removeBuff(this.buffList[i]);
	}


	/**动作优先级 */
	private isActionPriority(action, state): boolean {
		//有上场英雄和角色怪物全部死亡优先级无效
		// if (HeroSYBCC.ins().fightHero.length > 0 && (!RoleDieCC.ins()._isRoleDieInfo() || !RoleDieCC.ins()._isMonsterDieInfo())) {
		// 	return false;
		// }
		if (EntityAction.isActionState[state] < EntityAction.isActionState[action] && this.isEntityCompleted(state)) {
			return true;
		}
		return false;
	}

	public stopMove(): void {
		//停止移动 坐标取整，解决血条变暗问题
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.canMove = false;
		egret.Tween.removeTweens(this.moveTweenObj);
	}

	public get dir(): number {

		return this._dir;
	}

	public set dir(value: number) {
		if (this._dir == value || this.hasFilter(EntityFilter.hard))
			return;
		if (this._state == EntityAction.DIE) {
			return;
		}

		this._dir = value;
		this.loadBody();
	}

	public get action(): EntityAction {
		return this._state;
	}

	/** 慎用（一般使用playAction） */
	public set action(value: EntityAction) {
		if (this._state == EntityAction.DIE) return;
		this._state = value;
	}



	public get moveSpeed(): number {
		if (!this.infoModel)
			return 0;

		//目前先固定300
		let t = this.infoModel.getAtt(AttributeSYBType.atMoveSpeed) + this.infoModel.getAtt(AttributeSYBType.atMoveSpeed) * (1 + this.infoModel.getAtt(AttributeSYBType.atMoveSpeedRate) / 10000);
		//	console.log("速度：" + (t * 10 / GameSYBMap.CELL_SIZE));
		let addRate = UserFbSYBCC.ins().zoomScale == 1 ? 1 : 1.2;//根据缩放改变移速倍率
		return t * 10 * addRate / GameSYBMap.CELL_SIZE;
	}

	public hram(value: number): void {
		this._hpBar.value = Math.min(this.getRealHp(), this.infoModel.getAtt(AttributeSYBType.atHpMax));
		// if (this.team != Team.My && this instanceof CharRole) {
		// 	console.log(2,this.infoModel.handle,"扣血：",value,"剩余血量：",this._hpBar.value,)
		// }
	}


	public getHP(): number {
		return this._hpBar.value;
	}

	public getRealHp(): number {
		return this.infoModel.getAtt(AttributeSYBType.atHp);
	}

	public getMaxHp(): number {
		return this.infoModel.getAtt(AttributeSYBType.atHpMax);
	}

	public getMaxAtk(): number {
		return this.infoModel.getAtt(AttributeSYBType.atAttack);
	}

	public hramMp(value: number): void {
		// let val = 0;
		// if (value > 0 || value < 0) {
		// 	let v = this._mpBar.value + value;
		// 	val = v <= 0 ? 0 : v;
		// }
		// this._mpBar.value = Math.min(val, this._mpMax);
	}

	// public getMP(): number {
	// 	return this._mpBar.value;
	// }

	// public getMaxMp(): number {
	// 	return this._mpMax;
	// }

	public reset(): void {
		this.stopMove();
		this._state = EntityAction.STAND;
		this.AI_STATE = AI_State.Stand;
		this.dir = 1;
		//this._hpBar.slideDuration = 500;
		this.alpha = 1;
		// this.scaleX = this.scaleY = 1;
		this.titleCantainer.visible = true;
		this.titleCantainer.y = 70 - this._bodyContainer.height + 50;
		this.removeAllFilters();
		this.buffStateInit();
		this._dieGroup.removeChildren();
		// this._hpBar.value = 1;
		// this._hpBar.maximum = 1;
	}

	public buffStateInit(): void {
		this.isHardStraight = false;
		this.isFixedEntity = false;
		this.removeTimeAll();
	}

	public removeTimeAll(): void {
		TimerSYBManager.ins().removeAll(this);
	}

	public destruct(): void {
		//this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.monsterClick, this);
		this.destroy();
		ObjectPool.push(this);
	}
	//销毁实体
	public destroy() {
		super.destroy();
		this.deadDelay();
		this.alpha = 1;
		this.AI_STATE = AI_State.Stand;
		this.removeAllEffect();
		this.removeAllFilters();
		this.stopMove();
		DisplaySYBUtils.removeFromParent(this);
		this.removeTimeAll();
		ObjectPool.push(this);
	}

	public deadDelay(): void {
		//this._hpBar.slideDuration = 0;
		this._hpBar.value = 0;
		//屏蔽原因：当死亡资源没有加载时候，会出现死亡时候玩家死亡特效未播放完就stop，然后因为body移除了事件，导致武器播放的不是死亡特效，屏蔽后并不会造成内存泄漏等问题
		// this._body.stop();
		// this._body.removeEventListener(egret.Event.CHANGE, this.playBody, this);

		this.removeHardStraight();
		for (let i in this.damageOverTimeList) {
			let element: egret.Timer = this.damageOverTimeList[i];
			this.deleteDamageOverTimer(element);
		}
		this.removeAllBuff();
		this.atking = false;
		if (this.haloMc) {
			DisplaySYBUtils.removeFromParent(this.haloMc);
		}
	}

	/** 设置硬直时间 */
	public addHardStraight(time: number): void {
		this.isHardStraight = true;
		TimerSYBManager.ins().doTimer(time, 1, this.removeHardStraight, this);
	}

	public removeHardStraight(): void {
		this.isHardStraight = false;
	}

	/**设置定身时间 */
	public addFixedEntity(time: number): void {
		this.isFixedEntity = true;
		TimerSYBManager.ins().doTimer(time, 1, this.removeFixedEntity, this);
	}

	public removeFixedEntity(): void {
		this.isFixedEntity = false;
	}

	/**
	 * 设置主体动画
	 * @param str 文件名
	 */
	public initBody(fileName?: string, type?: number): void {
		let cnt = type ? 0 : CharMcOrder.BODY;
		this.addMc(cnt, fileName, type);
		//ResourceSYBMgr.ins().reloadImg(this.shadow);
	}

	/**检查是否有动画状态正在播放 */
	public isPlaying(): boolean {
		return this._body instanceof MovieSYClip ? this._body.isPlaying : this._body.armature && this._body.animation.isPlaying;
	}

	/**获取指定的动画状态 */
	public isGetState(str: string): any {
		return this._body instanceof MovieSYClip ? null : this._body.armature && this._body.animation.getState(str);
	}

	/**检测必杀技是否播放完毕 */
	public isSkillCompleted(): boolean {

		return true;
	}

	/**检测实体动作是否播放完毕 */
	public isEntityCompleted(entity: string): boolean {
		// if (DragonBones.ins().getSYWeChat()) {
		// 	if (this._body instanceof MovieClip && !this._body.isCompleted) {
		// 		return true;
		// 	}
		// } else {
			let state = this.isGetState(entity);
			if (state && !state.isCompleted) {
				return true;
			}
		// }
		return false;
	}

	/**检查是否所有的动画状态均已播放完毕 */
	public isCompleted(): boolean {
		return this._body instanceof MovieSYClip ? this.isPlaying() : this._body.armature && this._body.animation.isCompleted;
	}

	public isAtking(): boolean {
		return this._state == EntityAction.ATTACK && this.isPlaying();
	}

	public isAtkAction(): boolean {
		return this._state == EntityAction.ATTACK;
	}

	protected playBody(e: egret.Event): void {
		super.playBody(e);
	}

	protected loadBody() {
		if (!this.isShowBody) return;
		super.loadBody();
	}

	protected loadOther(mcType: CharMcOrder): void {
		if (!this.isShowBody) return;
		super.loadOther(mcType);
	}

	protected loadNoDir(mcType: CharMcOrder) {
		if (!this.isShowBody) return;
		super.loadNoDir(mcType);
	}

	public showBodyContainer() {
		if (this.isShowBody) return;
		this.isShowBody = true;
		this.addChildAt(this._bodyContainer, 1);
		//添加到舞台，重新播放资源
		this.loadBody();

		for (let mcType in this._disOrder) {
			let t = +mcType;
			if (this._disOrder[mcType] instanceof MovieSYClip && this.hasDir.indexOf(t) < 0) {
				this.loadNoDir(t);
			}
		}

	}

	public hideBodyContainer() {
		if (!this.isShowBody) return;
		this.isShowBody = false;
		this.removeChild(this._bodyContainer);

	}

	public getIsShowBody(): boolean {
		return this.isShowBody;
	}

	public getBodyContainer(): any {
		return this._bodyContainer;
	}

	public resetStand(): void {
		if (!this.isAtkAction())
			return;
		this.playAction(EntityAction.STAND);
	}

	public hasEffById(id: number): boolean {
		if (this.effs && this.effs[id]) {
			return true;
		}
		return false;
	}

	/**
	 * 更新数据显示
	 */
	public updateBlood(force: boolean = false): void {
		if (!this.infoModel)
			return;
		this._hpBar.maximum = this.infoModel.getAtt(AttributeSYBType.atHpMax);

		this._hpBar.value = this.infoModel.getAtt(AttributeSYBType.atHp);

	}



	/**
	 * 死亡处理（表现方面）
	 * @returns void
	 */
	public onDead(callBack?: () => void): void {
		this.stopMove();
		//this.showBlood(true);
		this.playAction(EntityAction.STAND);
		/**策划要求怪物无死亡资源用站立资源替代 */
		//this.playAction(EntityAction.DIE);
		// this._dropChange();
		// if (this.infoModel.type == EntitySYBType.Monster) {
		// 	let monsterConfig = GlobalConfig.MonstersConfig[this.infoModel.configID];
		// 	let modelCfg = GlobalConfig.MonstersModelConfig[monsterConfig.m];
		// 	if (modelCfg.monsterPng) {
		// 		this.titleCantainer.visible = false;
		// 		this._dieImg();
		// 	} else {
		// 		this._dieState();
		// 	}
		// } else {
		this._dieState();
		//}
		//egret.Tween.get(this, { loop: false }).to({ x: this.x }, 500).to({ x: 700 }, 500);
		if (callBack) {
			// let t = DragonBones.ins().getSYWeChat() ? 1000 : 1000;
			TimerSYBManager.ins().doTimer(200, 1, callBack, this);
		}
	}



	private _dieImg(): void {
		let t = egret.Tween.get(this);
		t.to({ rotation: 1080, x: 520, y: 1400, scaleX: 0.3, scaleY: 0.3 }, 600).call(() => {
			egret.Tween.removeTweens(this);
			this._dieGroup.removeChildren();
		})
	}

	public _dieState(battleBool: boolean = false): void {
		this._bodyContainer.alpha = 0;
		// DragonBones.ins().getDragonBonesOrMovieClip('yanwu', 'die', 1, null, this.modelDieCall.bind(this, battleBool), null, 1);
	}

	/**模型加载回调 */
	private modelDieCall(battleBool: boolean, model: any): void {
		if (model) {
			this._dieGroup.y = this._dieGroup.height / 2 + 60;
			this._dieGroup.removeChildren();
			this._dieGroup.addChild(model);

			TimerSYBManager.ins().doTimerDelay(300, 10, 1, () => {
				if (model instanceof MovieSYClip) {
					// this._bodyContainer.alpha = 1;
					egret.Tween.get(this._bodyContainer).to({ alpha: 1 }, 150);//优化实体出现效果
					this._dieGroup.removeChildren();
					// DragonBones.ins().removeEffModel(model['uid']);
					this.playAction(EntityAction.DIE);
					TimerSYBManager.ins().doTimerDelay(500, 10, 1, () => {
						let t = egret.Tween.get(this);
						t.to({ alpha: 0 }, 200).call(() => {
							egret.Tween.removeTweens(this);
							// DisplaySYBUtils.removeFromParent(model);

						})
					}, this)
				} else {
					this._bodyContainer.alpha = 1;
					this.playAction(EntityAction.DIE, null, null, battleBool);
					TimerSYBManager.ins().doTimerDelay(500, 10, 1, () => {
						let t = egret.Tween.get(this);
						t.to({ alpha: 0 }, 200).call(() => {
							egret.Tween.removeTweens(this);
							// DragonBones.ins().removeEffModel(model['uid']);
							// DisplaySYBUtils.removeFromParent(model);
							this._dieGroup.removeChildren();

						})
					}, this)
				}
			}, this);
		} else {
			let t = egret.Tween.get(this);
			t.to({ alpha: 0 }, 200).call(() => {
				egret.Tween.removeTweens(this);
				this._dieGroup.removeChildren();
			})
		}
	}

	public get isCanAddBlood(): boolean {
		return this._hpBar.value / this._hpBar.maximum < 0.8;
	}

	/** 持续伤害 */
	private damageOverTime(e?: any): void {
		let timer: egret.Timer = e instanceof egret.Timer ? e : e.currentTarget;

		if (timer.currentCount == timer.repeatCount) {
			this.deleteDamageOverTimer(timer);
		}
	}

	private deleteDamageOverTimer(timer: egret.Timer): void {
		for (let i in this.damageOverTimeList) {
			if (this.damageOverTimeList[i] == timer) {
				delete this.damageOverTimeList[i];
				timer.stop();
				timer.removeEventListener(egret.TimerEvent.TIMER, this.damageOverTime, this);
			}
		}
	}

	public addEffect(effID: number): void {
		// let config: EffectConfig = GlobalConfig.EffectConfig[effID];
		// if (!config) {
		// 	return;
		// }
		// if (config.type == 0) {
		// 	let image: eui.Image = new eui.Image();
		// 	image.source = config.fileName;
		// 	this.addChild(image);
		// 	let t: egret.Tween = egret.Tween.get(image);
		// 	image.x = image.x - 23;
		// 	t.to({ y: -100 }, 2000).call(() => {
		// 		DisplaySYBUtils.removeFromParent(image);
		// 	});
		// 	return;
		// }
		// let mc: MovieClip = this.effs[effID] || ObjectPool.pop(`MovieClip`);
		// let s = RES_DIR_SKILLEFF + config.fileName;
		// this.playFile(mc, s);
		// this.addChild(mc);
		// this.effs[effID] = mc;
	}

	private haloMc: MovieSYClip;

	public addHalo(str: string): void {
		this.haloMc = this.haloMc ? this.haloMc : ObjectPool.pop(`MovieSYClip`);
		this.playFile(this.haloMc, RES_DIR_EFF + str);
		this.addChildAt(this.haloMc, 0);
	}

	public removeHalo(): void {
		if (this.haloMc) {
			DisplaySYBUtils.removeFromParent(this.haloMc);
			this.haloMc.dispose();
			this.haloMc = null;
		}
	}

	public removeEffect(effID: number): void {
		// let config: EffectConfig = GlobalConfig.EffectConfig[effID];
		// if (!config)
		// 	return;

		// if (config.type == 0)
		// 	return;

		// let mc: MovieClip = this.effs[effID];
		// if (!mc)
		// 	return;
		// if (mc instanceof MovieClip) mc.destroy();
		// delete this.effs[effID];
	}

	public removeAllEffect() {
		for (let effId in this.effs) {
			let mc: MovieSYClip = this.effs[effId];
			if (mc && mc instanceof MovieSYClip) {
				mc.destroy();
			}
		}
		this.effs = {};
	}

	public hasBuff(groupID: any): boolean {
		let bool: boolean = false;
		for (let i in groupID) {
			if (this.buffList[groupID[i]]) {
				bool = true;
				break;
			}
		}
		return bool;
	}





	public get team(): Team {
		return this._infoModel.team;
	}


	protected playCount(): number {
		return this._state == EntityAction.RUN || this._state == EntityAction.STAND ? -1 : 1
	}

	public shakeIt(): void {
		// if (this.action != EntityAction.STAND && this.action != EntityAction.HIT)
		// 	return;
		// DisplaySYBUtils.shakeItEntity(this, 3, 200, 1);
		//移动速度为0的视为木桩怪，木桩怪没有Hit
		// if (this.moveSpeed) {
		// 	this.playAction(EntityAction.HIT, () => {
		// 		this.playAction(EntityAction.STAND);
		// 	});
		// }
	}

	// public showName(b: boolean): void {
	// 	this._nameGroup.visible = b;
	// }

	// public showBlood(b: boolean): void {
	// 	this._hpBar.visible = b;
	// }

	public get isMy(): boolean {
		return this.infoModel.isMy;
	}

	//层级优化
	public get weight() {
		// if (this._infoModel && this.team == Team.My && this instanceof CharRole) {
		// 	return this.y + 32;//半个格子 GameSYBMap.CELL_SIZE>>1
		// }
		return this.y;
	}

	public updateModel(): void {
		this.removeAll();
		this.parseModel();
		// if (!this.infoModel.isMy) {
		// 	this.anchorOffsetX = this.width / 2;
		// 	this.anchorOffsetY = this.height / 2;
		// }
	}

	/**模型加载回调 */
	private _modelGuideCall(model: any): void {
		if (model) {
			model.x = 0;
			model.y = model instanceof MovieSYClip ? 60 - 85 : 60;
			//model.animation.timeScale=1.2;
			// model.scaleX = this.heroEff.scaleX;
			// model.scaleY = this.heroEff.scaleY;
			this._dieGroup.addChild(model);

		}
	}
	private mType: number[] = [1, 2, 3];
	protected parseModel() {
		let monster = this;
		let model = monster.infoModel;
		monster.updateBlood(true);
		//设置主体形象
		let type = this.mType[Math.floor((Math.random() * this.mType.length))];
		let monsterBody = "monster" + type;

		// if (GameSYBLogic.ins().ifDy() && monsterBody == 'wandousheshou') {
		// 	monsterBody = 'shutiao';
		// }

		// if (modelCfg.avatar) {
		// 	let s = Setting.ins().lowLossBool ? 'jianying_png' : monsterBody;
		// 	let t = Setting.ins().lowLossBool ? 3 : 0;
		// 	monster.initBody(s, t);
		// } else {
		monster.initBody(monsterBody, 0);
		//}
		// }


		// let scale = modelCfg.scale;
		// monster._bodyContainer.scaleX = scale ? scale * 0.8 : 0.8;//不配默认1
		// monster._bodyContainer.scaleY = scale ? scale * 0.8 : 0.8;

		//替换boss血条位置
		// if (cfgType == 1) {
		// 	monster.setTitleCantainer(modelCfg.bloodPos);
		// } else {
		// 	monster.titleCantainer.y = this.titleCantainer.y;
		// }
		this.showTitleCantainer(true);
	}

	/** 添加石化、中毒滤镜 */
	protected addGroup(groupId: number): void {
		let filter = EntityFilterUtil.getEntityFilter(groupId);
		if (filter) {
			this.filterDic[filter] = this.filterDic[filter] || [];
			let index = this.filterDic[filter].indexOf(groupId);
			if (index == -1) {
				this.filterDic[filter].push(groupId);
				this.updateFilter();
			}
		}
	}

	protected removeGroup(groupId: number): void {
		let filterId = EntityFilterUtil.getEntityFilter(groupId);
		if (filterId) {
			let filters = this.filterDic[filterId];
			if (!filters) return;
			let index = filters.indexOf(groupId);
			if (index >= 0) {
				filters.splice(index, 1);
				this.updateFilter();
			}
		}
	}

	protected updateFilter() {
		let filter = EntityFilter.no;
		if (this.hasFilter(EntityFilter.hard)) {
			filter = EntityFilter.hard;
		} else if (this.hasFilter(EntityFilter.poison)) {
			filter = EntityFilter.poison;
		}
		if (this.curFilter != filter) {
			this.setFilter(filter);
		}
	}

	hasFilter(filter: EntityFilter): boolean {
		return !!(this.filterDic[filter] && this.filterDic[filter].length);
	}

	protected setFilter(filter: EntityFilter): void {
		this.curFilter = filter;
		if (filter) {
			this.setMcFilter(filter);
			if (filter == EntityFilter.hard) {
				this.setMcFilterPlayOrStop(false);
			} else {
				this.setMcFilterPlayOrStop(true);
			}
		} else {
			this.setMcFilter(filter);
			this.setMcFilterPlayOrStop(true);
		}
	}

	protected setMcFilter(filter: EntityFilter) {
		if (egret.Capabilities.renderMode != 'webgl') return;
		for (let mcType in this._disOrder) {
			if (+(mcType) != CharMcOrder.YB) {
				let mc = this._disOrder[mcType];
				mc.filters = filter ? EntityFilterUtil.buffFilter[filter].filters : null;
			}
		}
	}

	protected setMcFilterPlayOrStop(play: boolean) {
		for (let mcType of this.hasDir) {
			if (mcType == CharMcOrder.YB) continue;
			let mc = this.getMc(mcType) as MovieSYClip | dragonBones.EgretArmatureDisplay;
			if (mc) {
				if (play)
					mc instanceof MovieSYClip ? mc.play() : mc.animation.play();
				else
					mc instanceof MovieSYClip ? mc.stop() : mc.animation.stop();
			}
		}
	}

	removeAllFilters(): void {
		this.filterDic = {};
		this.curFilter = EntityFilter.no;
		for (let mcType in this._disOrder) {
			let mc = this._disOrder[mcType];
			mc.filters = null;
		}
	}
}
