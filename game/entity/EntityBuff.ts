class EntityBuff {
	/** 效果配置 */
	effConfig: EffectsConfig;
	/** 添加时间 */
	addTime: number;
	endTime: number;
	/** 计算后的值 */
	value: number;
	/** 总执行次数 */
	count: number;
	/** 当前执行次数 */
	step: number;

	multRate: number = 1;//倍率

	hostsHandle: number[];//宿主handle

	/** 施法者 */
	source;
	/**目标 */
	target;
	/**光环技能id */
	haloSkillId;

	dispose() {
		this.source = null;
		this.hostsHandle = null;
		this.multRate = 1;
	}


	static createBuff(id: number, selfTarget: CharMonster, target: CharMonster,  args?: { a: number, b: number, c: number, time: number }, skillId?: number) {
		let config = GlobalJYConfig.EffectsConfig[id];
		//Assert(config, `EffectsConfig中 ${id} 配置为空！！！`);
		//let arg=args?args:config.args;
		let effValue = RoleSYBAI.ins().skillEffValue(selfTarget, target, config);
		if (config.type == SkillEffType.AdditionalAttributes) {
			let val = selfTarget.infoModel.getAtt(args.b) + effValue;
			let selfVal = 0;
			// if (args.b == AttributeSYBType.atFrostResistance || args.b == AttributeSYBType.atFireResistance || args.b == AttributeSYBType.atPoisonResistance
			// 	|| args.b == AttributeSYBType.atLightningResistance || args.b == AttributeSYBType.atAtkPercent || args.b == AttributeSYBType.atAttackSpeedEnhance
			// ) {
			// 	selfVal = val;
			// } else {
			selfVal = val <= 0 ? 0 : val;
			// }
			selfTarget.infoModel.setAtt(args.b, selfVal);
			// Actor.ins()._atAllElementsPercentAdd(selfTarget, args.b, effValue);
		}
		let addTime = args ? args.time || 0 : 0;
		return EntityBuff.createBaseBuff(id, selfTarget, target, effValue, (config.duration + addTime) / RoleSYBAI.ins().speed, skillId);
	}

	static createBaseBuff(id: number, selfTarget: CharMonster, target: CharMonster, value?: number, duration?: number, skillId?: number) {
		let config = GlobalJYConfig.EffectsConfig[id];
		// Assert(config, `EffectsConfig中 ${id} 配置为空！！！`);
		let buff: EntityBuff = ObjectPool.pop("EntityBuff");
		buff.effConfig = config;
		buff.value = value;
		buff.addTime = egret.getTimer();
		buff.endTime = buff.addTime + (duration ? duration : config.duration);
		buff.count = ((duration ? duration : config.duration) / config.interval) >> 0;
		buff.step = 0;
		buff.source = selfTarget;
		buff.target = target;
		buff.haloSkillId = skillId;

		if (config.type == SkillEffType.HostAddAttributes) {
			if (buff.hostsHandle == null) {
				buff.hostsHandle = [];
			}

			let mh = EntitySYBManager.ins().getRootMasterHandle(selfTarget.infoModel.handle);
			if (buff.hostsHandle.indexOf(mh) < 0) {
				buff.hostsHandle.push(mh);
			}
		}

		return buff;
	}

	/**
	 * 是否可以执行buff效果
	 * @returns {boolean}
	 */
	isExecute(): boolean {
		return egret.getTimer() - this.addTime > this.step * this.effConfig.interval / RoleSYBAI.ins().speed;
	}

	/**
	 * 是否可以移除buff
	 * @returns {boolean}
	 */
	canRemove(): boolean {
		return this.effConfig.type != SkillEffType.Summon && egret.getTimer() >= this.endTime;
	}

	isCanotHit(): boolean {
		return this.effConfig.type == SkillEffType.AdditionalState && this.effConfig.args.i == SkillArgsType.TYPE_I1
	}
}