/**
 * Created by Administrator on 2023/4/3.
 */
class RoleSYBAI extends BaseSYBClass {

    /** AI循环时间 */
    static AI_UPDATE_TIME: number = 200;
    /** AI循环时间 */
    static MonsterAI_UPDATE_TIME: number = 500;
    //增加攻击速度
    public speed: number = 1;
    /**是否开始AI */
    public isStartMonsterAI: boolean = true;

    private inited: boolean;

    private aiList: Map<CharRole> = {};
    private aiMonsterList: Map<CharMonster> = {};

    /** 技能cd */
    private skillCD: Map<Map<number>>;
    private curSkill: Map<any>;
    private curTarget: Map<CharMonster>;
    private curTarget2: Map<CharMonster>;


    public playSpeed: number = 0;
    //保存上次使用技能类型
    private skillCastType: Map<number>;
    private skillTargetType: Map<number>;

    private atkCount: number = 0;

    public missionblood: number;
    public missionbloodMax: number;

    private isStartAtk: boolean;

    //范围技能
    private rangeSkill: { skillId: number, uniSkillId: number, damageCd: number, endTime: number, playTime: number, pos: { x: number, y: number } }[] = [];

    public static ins(...args: any[]): RoleSYBAI {
        return super.ins(args) as RoleSYBAI;
    }

    public init(): void {
        this.stop();
        this.inited = true;
        this.skillCD = {};

    }

    /** 开启AI */
    public start() {
        if (!this.inited)
            this.init();

        this.isStartAtk = false;
        this.setMissionBlood();
        this.isStartMonsterAI = true;

        if (this.starting)
            return;

        this.addMonsterAITimer();
        this.addAITimer();
    }



    public setMissionBlood(): void {
        this.missionblood = GlobalJYConfig.HeroBaseConfig.warBlood;
        let list = this.aiList;
        for (let i in list) {
            let selfTarget: CharMonster = list[i];
            let value = selfTarget.infoModel.attributeData[AttributeSYBType.atHpMax] ? selfTarget.infoModel.attributeData[AttributeSYBType.atHpMax] : 0;
            this.missionblood += value;
        }
        this.missionblood = Math.floor(this.missionblood)
        this.missionbloodMax = this.missionblood;
    }

    private updateMissionBlood(selfTarget: CharMonster, type: number): void {
        if (type == 0) {
            let maxValue = this.missionbloodMax + selfTarget.infoModel.attributeData[AttributeSYBType.atHpMax];
            let curValue = this.missionblood
            this.missionblood = Math.floor(maxValue > 0 ? this.missionblood * (maxValue / this.missionbloodMax) : this.missionblood);
        } else if (type == 1) {
            let maxValue = this.missionbloodMax - selfTarget.infoModel.attributeData[AttributeSYBType.atHpMax];
            let curValue = this.missionblood
            this.missionblood = Math.floor(maxValue > 0 ? this.missionblood * (maxValue / this.missionbloodMax) : this.missionblood);
        }
        this.missionbloodMax = this.missionblood;
    }
    public pauseAI() {
        this.stopAITimer();
        this.stopMonsterAITimer();
        let list = this.aiMonsterList;
        for (let i in list) {
            let selfTarget: CharMonster = list[i];
            selfTarget.stopMove();
        }

    }

    public restartAI() {
        this.addMonsterAITimer();
        this.addAITimer();
    }

    /** 关闭AI */
    public stop() {
        if (this.inited) {
            this.stopAITimer();
            this.stopMonsterAITimer();
        }
        for (let handle in this.curSkill) {
            if (this.curSkill[handle]) ObjectPool.push(this.curSkill[handle]);
        }
        this.skillCD = {};
        this.curSkill = {};
        this.curTarget = {};
        this.curTarget2 = {};
        this.skillCastType = {};
        this.skillTargetType = {};
    }

    public clearTarget(target) {
        if (target && target.infoModel) {
            let handle = target.infoModel.handle;
            delete this.skillCD[handle];
            delete this.curSkill[handle];
            delete this.curTarget[handle];
            delete this.skillCastType[handle];
            delete this.skillTargetType[handle];
        }
    }


    public checkTargetLive(target: CharMonster): boolean {
        if (target && target.infoModel) {
            let handle = target.infoModel.handle;
            return target.getHP() > 0;
        }
        return false
    }

    private addMonsterAITimer() {
        if (!TimerSYBManager.ins().isExists(this.startMonsterAI, this)) {
            TimerSYBManager.ins().doTimer(RoleSYBAI.MonsterAI_UPDATE_TIME, 0, this.startMonsterAI, this);
        }
    }

    public clearAIList(): void {
        this.aiList = {};
        this.aiMonsterList = {};
    }
    public clear() {
        this.stop();
        this.clearAIList();
        TimerSYBManager.ins().removeAll(this);
    }

    public get starting(): boolean {
        return TimerSYBManager.ins().isExists(this.startAI, this);
    }

    public addRole(char): void {
        if (char.infoModel.type == EntitySYBType.Role) {
            this.updateMissionBlood(char, 0);
            this.aiList[char.infoModel.handle] = char;
        }
    }

    public removeRole(char): void {
        if (char.infoModel.type == EntitySYBType.Role) {
            this.updateMissionBlood(char, 1);
            delete this.aiList[char.infoModel.handle];
        }
    }

    public getAIList() {
        return this.aiList;
    }

    private ifCanAttkTarget(selfTarget: CharMonster): boolean {
        let b = false;
        if (selfTarget.infoModel.isMy) {
            if (EntitySYBManager.ins().getAllEntity()) {
                b = true;
            }
        } else {
            b = true;
        }
        return b;
    }

    /**
        * 伤害后是否死亡
        * @returns {boolean}
        */
    private hramedDie(t: CharMonster, v: number): boolean {
        let value: number = t.infoModel.getAtt(AttributeSYBType.atHp) - v;
        if (v < 0) {
            let maxValue: number = t.infoModel.getAtt(AttributeSYBType.atHpMax);
            value = value > maxValue ? maxValue : value;
        }
        // if (t.team != Team.My && t instanceof CharRole) {
        // 	console.log(1,t.infoModel.handle,"扣血：",v,"剩余血量：",value,)
        // }
        t.infoModel.setAtt(AttributeSYBType.atHp, value);

        if (t.infoModel.getAtt(AttributeSYBType.atHp) <= 0) {
            return true;
        }
        return false;
    }

    //加入buff
    private addBuff(target: CharMonster, id: number, selfTarget?: CharMonster): void {
        // let effConfig = GlobalConfig.EffectsConfig[id];
        // let self = effConfig.type == SkillEffType.AdditionalDamage ? selfTarget : target;
        // let bool: boolean = false;
        // if (effConfig && effConfig.probabilityBuff) {
        //     if (GameSYBLogic.triggerValue(effConfig.probabilityBuff)) {
        //         bool = true;
        //     }
        // } else {
        //     bool = true;
        // }
        // if (bool) {
        //     let handle = selfTarget ? selfTarget.infoModel.handle : null;
        //     let buff: EntityBuff = EntityBuff.createBuff(id, self, target, target.infoModel.heroCamp, this.getArgs(id));
        //     if (RoleSYBAI.ins().speed > 1) {
        //         target.addBuff(buff, handle);
        //     } else {
        //         let effDelay = !effConfig.effDelay ? 0 : effConfig.effDelay / RoleSYBAI.ins().speed;
        //         TimerSYBManager.ins().doTimer(effDelay, 1, () => {
        //             target.addBuff(buff, handle);
        //         }, this)
        //     }
        // }
    }
    public skillEffValue(selfTarget: CharMonster, target: CharMonster, skillEff: EffectsConfig, args?: { a: number, b: number, c: number }): number {
        let effValue: number = 0;
        let addA: number = 0;
        let addC: number = 0;

        if (args) {
            addA = args.a || 0;
            addC = args.c || 0;
        }

        if (skillEff) {
            if (skillEff.args) {

                switch (skillEff.type) {


                }
            }
            effValue = effValue >> 0;
        }
        return effValue;
    }

    public getArgs(id: number) {
        let skillEff: EffectsConfig = GlobalJYConfig.EffectsConfig[id];
        let addA = 0, addC = 0, addTime = 0, addB = 0;
        if (skillEff.type == 3) {
            addA = skillEff.args.a ? skillEff.args.a : 0;
            addB = skillEff.args.b ? skillEff.args.b : 0;
            addC = skillEff.args.c ? skillEff.args.c : 0;

        } else if (skillEff.type == 4) {

        }
        return { a: addA, b: addB, c: addC, time: 0 };
    }

    /**
       * 使用技能 
       */
    public useSkill(selfTarget: CharMonster, target: CharMonster, skill: any, type?: number) {
        let affectCount = skill.affectCount ? skill.affectCount : 1;

        let atkModel = selfTarget.infoModel;

        let handle = selfTarget.infoModel.handle;

        let atkState = EntityAction.ATTACK;
        if (target.getHP() <= 0 || target.AI_STATE == AI_State.Die) {
            return;
        }
        //0.3
        if (target.getHP() > 0 && (!selfTarget.isAtking() || atkState == EntityAction.ATTACK2)) {
            selfTarget.playAction(atkState);//播放动作
        }

        let skillEff: EffectsConfig[] = [];//对敌方的buff
        let selfSkillEff: EffectsConfig[] = [];//附加自己buff
        if (skill.tarEff) {
            for (let i = 0; i < skill.tarEff.length; i++) {
                if (selfTarget.infoModel.lv >= skill.tarEff[i].lv) {
                    skillEff.push(GlobalJYConfig.EffectsConfig[skill.tarEff[i].buffId]);
                }
            }
        }

        if (skill.selfEff) {
            for (let i = 0; i < skill.selfEff.length; i++) {
                if (selfTarget.infoModel.lv >= skill.selfEff[i].lv) {
                    selfSkillEff.push(GlobalJYConfig.EffectsConfig[skill.selfEff[i].buffId]);
                }
            }
        }
        let pTarget: CharMonster = skill.castType == castType.Self ? selfTarget : target;
        let tempArr: CharMonster[] = [];
        let skillEffType: number = -1;
        let skillEffVal: number[] = [];

        //己方血最少
        // if (skill.castType == castType.SelfHpLess) {
        //     tempArr = EntitySYBManager.ins().screeningTargetByPos(selfTarget, true, 0, Number.MAX_VALUE, this.aiList);
        //     for (let m: number = 0; m < tempArr.length; m++) {
        //         if (tempArr[m].isCanAddBlood) {
        //             tempArr[0] = tempArr[m];
        //             break;
        //         }
        //     }
        // }
        // else 
        if (skill.castType == castType.TargHpLess) {//敌方血最少
            tempArr = EntitySYBManager.ins().screeningTargetByPos(selfTarget, false, affectCount, Number.MAX_VALUE, this.aiMonsterList);
            tempArr.sort(this._sortHp);
            tempArr = tempArr ? tempArr : [target];
        }
        else if (skill.castType == castType.DistanceMax) {//距离最远     
            let disChar = this.screeningTarget(selfTarget);
            tempArr[0] = disChar == null ? target : disChar;
        }
        else if (skill.castType == castType.DistanceMin) {//距离最近     
            // let disChar = this.screeningTargetByDistanceMin(selfTarget);
            // tempArr[0] = disChar == null ? target : disChar;
            tempArr = this.screeningTargetByDistanceMin(selfTarget, affectCount);
            tempArr = tempArr ? tempArr : [target];
        }
        else if (skill.castType == castType.targAtkMax) {//敌方攻击最高
            tempArr = EntitySYBManager.ins().screeningTargetByCastType(selfTarget, affectCount, this.aiMonsterList, castType.targAtkMax);
            tempArr = tempArr ? tempArr : [target];
        }
        else if (skill.castType == castType.BossDistanceMin) {//最近的boss
            tempArr = this.screeningBossTargetByDistanceMin(selfTarget, affectCount);
            tempArr = tempArr ? tempArr : [target];
        }
        else {
            //施法目标是友方，但是作用目标是敌方的
            if (skill.castType != castType.Other && skill.targetType == TargetType.Enemy) {
                tempArr = EntitySYBManager.ins().screeningTargetByPos(pTarget, false, affectCount, skill.affectRange, this.aiMonsterList);
            } else {
                tempArr = affectCount > 1 ? EntitySYBManager.ins().screeningTargetByPos(selfTarget, selfTarget.isMy == target.isMy, affectCount, skill.affectRange, this.aiMonsterList) : [target];
            }

            if (tempArr.length == 0) {
                tempArr = [target];
            }
        }



        let len = tempArr.length = Math.min(tempArr.length, affectCount);

        let effBuff: EntityBuff;
        let hitTargetInfo: {
            isDie: boolean,
            damageType: number,
            ttarget: CharMonster,
            hramValue: number,
            elemValue?: number[],
            damageType2?: number,
        }[][] = [];

        if (skill.targetType == TargetType.Friendly) {
            //作用于己方 主要为光环buff
            tempArr = [];
            let charList = EntitySYBManager.ins().getAllEntity();
            for (let i in charList) {
                let role: CharMonster = charList[i];
                if (selfSkillEff) {
                    if (role.infoModel.isMy == selfTarget.infoModel.isMy && role.AI_STATE != AI_State.Die) {
                        tempArr.push(role);
                        for (let b = 0; b < selfSkillEff.length; b++) {
                            let rbuff: EntityBuff = EntityBuff.createBuff(selfSkillEff[i].id, selfTarget, role, this.getArgs(selfSkillEff[i].id), skill.id);
                            role.addBuff(rbuff);
                        }

                        hitTargetInfo.push([{
                            isDie: false,
                            damageType: 1,
                            ttarget: role,
                            hramValue: 0,
                        }]);
                    }
                }
                if (skillEff) {
                    if (role.infoModel.isMy != selfTarget.infoModel.isMy && role.AI_STATE != AI_State.Die) {
                        tempArr.push(role);
                        for (let b = 0; b < skillEff.length; b++) {
                            let rbuff: EntityBuff = EntityBuff.createBuff(skillEff[i].id, selfTarget, role, this.getArgs(skillEff[i].id), skill.id);
                            role.addBuff(rbuff);
                        }

                        hitTargetInfo.push([{
                            isDie: false,
                            damageType: 1,
                            ttarget: role,
                            hramValue: 0,
                        }]);
                    }
                }
            }
        } else if (skill.targetType == TargetType.Enemy) {
            if (selfSkillEff) {
                for (let b = 0; b < selfSkillEff.length; b++) {
                    this.addBuff(selfTarget, selfSkillEff[b].id);
                }
            }
            if (skillEff) {
                for (let b = 0; b < skillEff.length; b++) {
                    this.addBuff(target, selfSkillEff[b].id);
                }
            }

            for (let j: number = 0; j < len; j++) {
                let ttarget: CharMonster = tempArr[j];
                // let tarInfo = ttarget.infoModel as EntitySYBModel;
                let isMainTar: boolean = j == 0;//是否主目标

                let hramValue: number = 0;

                //作用于敌方
                let isMiss: boolean = false;//是否闪避
                // let isLucky: boolean = false;
                // let isZhuiMing: boolean = false;//是否追命
                // let isZhiMing: boolean = false;//是否致命一击
                // let isSkillCri: boolean = skill.config.type == SkillsType.TYPE_I6;//是否必杀技或合击技
                //攻击命中值 ---------- 实际命中率=（A的命中率-B的闪避率）
                let selHitChance = Math.floor((atkModel.getAtt(AttributeSYBType.atHitRate) - ttarget.infoModel.getAtt(AttributeSYBType.atDodgeRate)) / 100);

                let hitMax = Math.max(20, selHitChance);
                isMiss = Math.random() * 100 <= hitMax ? false : true;
                if (isMiss) {
                    //todo 闪避的表现方式
                    // console.log("闪避"+egret.getTimer());
                    hramValue = 0;
                    //本次攻击是否死亡
                    let isDie: boolean = this.hramedDie(ttarget, hramValue);

                    if (isDie) {
                        ttarget.AI_STATE = AI_State.Die;
                        //ExSkillSYBAiLogic.ins().checkDieTrigger(selfTarget, [target]);
                    }
                    hitTargetInfo.push([{
                        isDie: isDie,
                        damageType: DamageTypes.Dodge,
                        ttarget: ttarget,
                        hramValue: hramValue,
                    }]);

                } else {

                    //计算基础伤害
                    let result: any[] = this.damageHeroBaseCalculation(selfTarget, ttarget, skill);
                    let isCrit = result[0];
                    let hramInfo = [];
                    for (let key in result[1]) {

                        hramValue = result[1][key];


                        let skillCfg = skill.config;


                        let seckillVal: number = 0;
                        if ((skillCfg.type == SkillsType.TYPE_I1 && !skillCfg.passive) || skillCfg.type == SkillsType.TYPE_I6 || skillCfg.type == SkillsType.TYPE_I7) {


                            for (let groupID in selfTarget.buffList) {
                                let buff: EntityBuff = selfTarget.buffList[groupID];
                                let sefBuff = buff.effConfig;
                                //秒杀
                                if (sefBuff.type == SkillEffType.AdditionalState && sefBuff.args.i == SkillArgsType.TYPE_I14) {
                                    let tarHp = target.infoModel.getAtt(AttributeSYBType.atHp);
                                    let hpMax = target.infoModel.getAtt(AttributeSYBType.atHpMax) * (sefBuff.args.a / 10000);
                                    if (tarHp <= hpMax) {
                                        seckillVal = target.infoModel.getAtt(AttributeSYBType.atHp);
                                    }
                                }
                            }
                        }

                        //群攻，对非主目标伤害降低
                        // if (!isMainTar && skill.targetType == TargetType.Enemy) {
                        //     if (tarInfo.type == EntitySYBType.Role) {
                        //         hramValue = hramValue * (skill.herdPlayerRate / 100);
                        //     } else {
                        //         hramValue = hramValue * (skill.herdMonRate / 100);
                        //     }
                        // }

                        let hurt: number = hramValue;
                        // if (isCrit) {
                        //     hurt = Math.floor(hurt / (selfTarget.infoModel.getAtt(AttributeSYBType.atCritDamage) / 10000));
                        // }
                        // if (seckillVal > 0) {
                        //     hurt = seckillVal;
                        // }


                        //本次攻击是否死亡
                        let isDie: boolean = this.hramedDie(ttarget, hurt);

                        if (isDie) {

                            ttarget.AI_STATE = AI_State.Die;

                        }
                        let damageType: number = 0;

                        if (selfTarget.team == Team.My) {
                            if (isMiss) {
                                damageType = DamageTypes.Dodge;
                            } else {
                                if (isCrit) {
                                    damageType = DamageTypes.CRIT;
                                }
                            }
                        }
                        //if (isSkillCri) damageType = DamageTypes.SkillCri;

                        if (selfTarget.team != ttarget.team && skill.calcType == 5) {
                            let h5 = (hramValue / 5) >> 0;
                            let h1 = (h5 * MathSYBUtils.limit(0, 0.05)) >> 0;
                            let h2 = (h5 * MathSYBUtils.limit(0, 0.05)) >> 0;
                            let hits = [h5 - h1, h5 + h1, h5 - h2, h5 + h2, hramValue - 4 * h5];
                            let hitInfo = [];
                            for (let i = 0; i < hits.length; i++) {
                                hitInfo.push({
                                    isDie: isDie,
                                    damageType: DamageTypes.Fujia,
                                    ttarget: ttarget,
                                    hramValue: hits[i]
                                })
                            }
                            hitTargetInfo.push(hitInfo);
                        } else {
                            hramInfo.push({
                                isDie: isDie,
                                damageType: damageType,
                                ttarget: ttarget,
                                hramValue: hramValue
                            });
                        }
                    }
                    hitTargetInfo.push(hramInfo);
                }
            }
        } else if (skill.targetType == TargetType.My) {

            tempArr = [];
            let charList = [];
            let skillEffCfg: EffectsConfig[];
            for (let i in EntitySYBManager.ins().getAllEntity()) {
                let role: CharMonster = EntitySYBManager.ins().getAllEntity()[i];
                if (selfSkillEff) {
                    skillEffCfg = selfSkillEff;
                    if (role.infoModel.isMy == selfTarget.infoModel.isMy && role.AI_STATE != AI_State.Die) {
                        charList.push(role);
                    }
                }
                if (skillEff) {
                    skillEffCfg = skillEff;
                    if (role.infoModel.isMy != selfTarget.infoModel.isMy && role.AI_STATE != AI_State.Die) {
                        charList.push(role);
                    }
                }
            }

            if (charList.length > affectCount) {
                let arr = MathSYBUtils.onArrayRandomMultiple(charList, affectCount);
                for (let key = 0; key < arr.length; key++) {
                    tempArr.push(arr[key]);
                    // let rbuff: EntityBuff = EntityBuff.createBuff(skillEffCfg.id, selfTarget, arr[key], this.getArgs(skillEffCfg.id));
                    // arr[key].addBuff(rbuff);

                    hitTargetInfo.push([{
                        isDie: false,
                        damageType: 1,
                        ttarget: arr[key],
                        hramValue: 0,
                    }]);
                }
            } else {
                for (let key = 0; key < charList.length; key++) {
                    tempArr.push(charList[key]);
                    for (let i = 0; i < skillEffCfg.length; i++) {
                        let rbuff: EntityBuff = EntityBuff.createBuff(skillEffCfg[i].id, selfTarget, charList[key], this.getArgs(skillEffCfg[i].id));
                        charList[key].addBuff(rbuff);
                    }

                    hitTargetInfo.push([{
                        isDie: false,
                        damageType: 1,
                        ttarget: charList[key],
                        hramValue: 0,
                    }]);
                }
            }

        } else {
            tempArr = [];
            if (selfTarget.AI_STATE != AI_State.Die) {
                tempArr.push(selfTarget);
                // for (let b = 0; b < skill.selfEff.length; b++) {
                //     this.addBuff(selfTarget, skill.selfEff[b]);
                // }

                hitTargetInfo.push([{
                    isDie: false,
                    damageType: 1,
                    ttarget: selfTarget,
                    hramValue: 0,
                }]);
            }
        }

        let fbType = GameSYBMap.fbType;
        let fbId = GameSYBMap.fubenID;

        let hitTime: number = 0;//受击次数
        GameSYBLogic.ins().playSkillEff(skill, selfTarget, tempArr, (probability: number) => {
            //切换场景后不处理上次的伤害
            if (GameSYBMap.fbType != fbType || fbId != GameSYBMap.fubenID) return;

            let pType: DamageTypes = 0;

            for (let i in tempArr) {
                let ttarget = tempArr[i];
                if (selfTarget.isMy == ttarget.isMy) continue;
                let ttInfo = ttarget.infoModel;
                let targetIsDie = hitTargetInfo[i][hitTargetInfo[i].length - 1].isDie;
                if (pTarget == ttarget) {
                    pType = hitTargetInfo[i][0].damageType;
                }

                let hramValue = 0;
                for (let j = 0; j < hitTargetInfo[i].length; j++) {
                    let targetInfo = hitTargetInfo[i][j];
                    pType = targetInfo.damageType;
                    hramValue += targetInfo.hramValue;

                    let rffVal = skillEffVal[j] ? skillEffVal[j] : 0;
                    let skillType = skill.config.type;
                    if (this.speed > 1) {

                        this.showHram(targetInfo.isDie,
                            targetInfo.damageType,
                            ttarget,
                            selfTarget,
                            targetInfo.hramValue,
                            skillEffType,
                            rffVal,
                            skill.name,
                            skill,
                        );
                    } else {
                        let hitDelay = 0;
                        // if (skill.castType == castType.ranAtkCnt) {
                        //     hitDelay = skill.hitDelay && skill.hitDelay[i] ? skill.hitDelay[i] : 500;
                        // } else {
                        hitDelay = skill.hitDelay ? skill.hitDelay[j] : 500;
                        // }
                        //let hitTimer = Math.floor(hitDelay / this.speed);
                        let hitTimer = Math.floor(hitDelay / 1);
                        TimerSYBManager.ins().doTimerDelay(hitTimer, 10, 1, () => {
                            // if (skillType != SkillsType.TYPE_I6 && skillType != SkillsType.TYPE_I7 && selfTarget.hramMpBool) {
                            //     selfTarget.hramMpBool = false;
                            //     let hramMpVal = selfTarget.infoModel.getAtt(AttributeSYBType.atSuckAnger);
                            //     selfTarget.hramMp(25 + hramMpVal);
                            // }
                            this.showHram(targetInfo.isDie,
                                targetInfo.damageType,
                                ttarget,
                                selfTarget,
                                targetInfo.hramValue,
                                skillEffType,
                                rffVal,
                                skill.name,
                                skill,
                            );
                        }, this)

                    }

                    if (targetInfo.isDie) break;
                }

                // ttarget.shakeIt();

                //击中目标后，如果目标没死则添加技能效果附加
                if (!targetIsDie && skill.targetType == TargetType.Enemy) {
                    // let tarEff: number[] = skill.tarEff;
                    // if (pTarget != ttarget && ttarget.infoModel.type == EntitySYBType.Role) {
                    //     tarEff = skill.otarEff || tarEff;
                    // }

                    // for (let k = 0; tarEff && k < tarEff.length; k++) {
                    //     // let args = this.getArgs(tarEff[k]);
                    //     if (!ttarget.isSuperArmor || (ttarget.isSuperArmor && skillEff.isBuff == 1) || ttarget.isNotSuperArmorBuff) {
                    //         // let buff: EntityBuff = EntityBuff.createBuff(tarEff[k], selfTarget, args);
                    //         // ttarget.addBuff(buff);
                    //         this.addBuff(ttarget, tarEff[k], selfTarget);
                    //     }
                    // }

                    //计算buff伤害
                    // this.showBuffHarm(selfTarget, ttarget, skill, hramValue);

                    //被攻击使用被动技能
                    // if (ttarget.passiveSkill) {
                    //     ttarget.passiveSkill = false;
                    //     this.tryUsePassiveSkill(selfTarget, ttarget, false, pType);
                    // }

                    /**被攻击时触发战宠技能 */
                    // this.tryUseBattlePetSkill(ttarget, selfTarget, false);

                } else {
                    //死亡后使用被动技能
                    // this.tryUseTargetDieSkill(selfTarget, ttarget);
                }
            }



        }, 1);

        //关联技能
        // if (skill.otherSkills) {
        //     let any = new any(skill.otherSkills);
        //     any.preId = skill.configID;
        //     if (skill.otherSkillsLimit) {
        //         //敌方剩一个时，不触发关联技能
        //         let idx: number = 0;
        //         for (let i in this.aiList) {
        //             if (!this.aiList[i].isMy) {
        //                 idx++;
        //             }
        //         }
        //         if (idx > 1 && GameSYBLogic.triggerValue(skill.otherSkillsLimit)) {
        //             this.useSkill(selfTarget, target, any);
        //         }
        //     } else {
        //         this.useSkill(selfTarget, target, any);
        //     }
        // }

        selfTarget.atking = false;

    }

    private tryUseUniSkill(): void {
        let target: CharMonster;
        for (let i in UniqueSkillCC.ins().fightUniSkill) {
            let skill = UniqueSkillCC.ins().fightUniSkill[i];
            this.screeningTarget2(skill.id);//根据距离筛选受击对象
            target = this.curTarget2[skill.id] ? this.curTarget2[skill.id] : null;
            if (target) {
                if (target.getHP() <= 0 || target.AI_STATE == AI_State.Die) {
                    // console.log("目标死亡")
                    delete this.curTarget2[skill.id];
                    continue;
                }
                if (!skill.realCd || egret.getTimer() >= skill.realCd) {
                    let cfg = GlobalJYConfig.UniqueSkillConfig[skill.id][UniqueSkillCC.ins().any[skill.id].level];
                    for (let i = 0; i < skill.releaseTime; i++) {
                        this.useUniSkill(skill.id, target, skill.useSkill, i);
                    }
                    skill.realCd = egret.getTimer() + (cfg.cd * (1 - skill.cdMinus / 100));
                } else {
                    // console.log("冷却！");
                }
            }
        }
    }
    /**
     * 检测范围技能伤害
     */
    public calulateRangeSkill(): void {
        if (this.rangeSkill) {
            for (let i = this.rangeSkill.length - 1; i >= 0; i--) {
                let skill = this.rangeSkill[i];
                let any = new any(skill.skillId);
                let tempArr: CharMonster[] = [];

                let skillCfg = GlobalJYConfig.SkillsConfig[skill.skillId];
                tempArr = EntitySYBManager.ins().screeningTargetByDistance(skill.pos, skillCfg.affectCount, skillCfg.affectRange, this.aiMonsterList);
                let skillEffType: number = -1;
                let skillEffVal: number[] = [];
                if (tempArr.length == 0) {
                    continue;
                }
                if (egret.getTimer() >= skill.endTime) {
                    this.rangeSkill.splice(i, 1);
                    continue;
                }
                if (egret.getTimer() < skill.damageCd) {
                    continue;
                }

                skill.damageCd += skillCfg.damageTime;

                let hitTargetInfo: {
                    isDie: boolean,
                    damageType: number,
                    ttarget: CharMonster,
                    hramValue: number,
                    elemValue?: number[],
                    damageType2?: number,
                }[][] = [];

                for (let j: number = 0; j < tempArr.length; j++) {
                    let ttarget: CharMonster = tempArr[j];
                    // let tarInfo = ttarget.infoModel as EntitySYBModel;
                    let isMainTar: boolean = j == 0;//是否主目标

                    let hramValue: number = 0;



                    //计算基础伤害
                    let result: number = this.damageBaseUniCalculation(skill.uniSkillId);
                    let isDie: boolean = this.hramedDie(ttarget, result);
                    if (isDie) {

                        ttarget.AI_STATE = AI_State.Die;

                    }
                    let damageType: number = 0;

                    let hramInfo = [];
                    hramInfo.push({
                        isDie: isDie,
                        damageType: damageType,
                        ttarget: ttarget,
                        hramValue: result
                    });

                    hitTargetInfo.push(hramInfo);
                }
                if (this.rangeSkill[i].playTime == 0) {
                    GameSYBLogic.ins().playUniSkillEff2(any, skill.pos, (probability: number) => {

                        let pType: DamageTypes = 0;

                        for (let i in tempArr) {
                            let ttarget = tempArr[i];
                            let ttInfo = ttarget.infoModel;
                            let targetIsDie = hitTargetInfo[i][hitTargetInfo[i].length - 1].isDie;
                            // if (pTarget == ttarget) {
                            //     pType = hitTargetInfo[i][0].damageType;
                            // }

                            let hramValue = 0;
                            for (let j = 0; j < hitTargetInfo[i].length; j++) {
                                let targetInfo = hitTargetInfo[i][j];
                                pType = targetInfo.damageType;
                                hramValue += targetInfo.hramValue;

                                let rffVal = skillEffVal[j] ? skillEffVal[j] : 0;
                                let skillType = any.config.type;
                                if (this.speed > 1) {

                                    this.showHram(targetInfo.isDie,
                                        targetInfo.damageType,
                                        ttarget,
                                        null,
                                        targetInfo.hramValue,
                                        skillEffType,
                                        rffVal,
                                        any.name,
                                        any,
                                    );
                                } else {
                                    let hitDelay = 0;
                                    hitDelay = any.hitDelay ? any.hitDelay[j] : 500;
                                    let hitTimer = Math.floor(hitDelay / 1);
                                    TimerSYBManager.ins().doTimerDelay(hitTimer, 10, 1, () => {

                                        this.showHram(targetInfo.isDie,
                                            targetInfo.damageType,
                                            ttarget,
                                            null,
                                            targetInfo.hramValue,
                                            skillEffType,
                                            rffVal,
                                            any.name,
                                            any,
                                        );
                                    }, this)

                                }

                                if (targetInfo.isDie) break;
                            }

                        }

                    }, 1);
                } else {
                    let pType: DamageTypes = 0;

                    for (let i in tempArr) {
                        let ttarget = tempArr[i];
                        let ttInfo = ttarget.infoModel;
                        let targetIsDie = hitTargetInfo[i][hitTargetInfo[i].length - 1].isDie;
                        // if (pTarget == ttarget) {
                        //     pType = hitTargetInfo[i][0].damageType;
                        // }

                        let hramValue = 0;
                        for (let j = 0; j < hitTargetInfo[i].length; j++) {
                            let targetInfo = hitTargetInfo[i][j];
                            pType = targetInfo.damageType;
                            hramValue += targetInfo.hramValue;

                            let rffVal = skillEffVal[j] ? skillEffVal[j] : 0;
                            let skillType = any.config.type;
                            if (this.speed > 1) {

                                this.showHram(targetInfo.isDie,
                                    targetInfo.damageType,
                                    ttarget,
                                    null,
                                    targetInfo.hramValue,
                                    skillEffType,
                                    rffVal,
                                    any.name,
                                    any,
                                );
                            } else {
                                let hitDelay = 0;
                                hitDelay = any.hitDelay ? any.hitDelay[j] : 500;
                                let hitTimer = Math.floor(hitDelay / 1);
                                TimerSYBManager.ins().doTimerDelay(hitTimer, 10, 1, () => {

                                    this.showHram(targetInfo.isDie,
                                        targetInfo.damageType,
                                        ttarget,
                                        null,
                                        targetInfo.hramValue,
                                        skillEffType,
                                        rffVal,
                                        any.name,
                                        any,
                                    );
                                }, this)

                            }

                            if (targetInfo.isDie) break;
                        }

                    }
                }

                this.rangeSkill[i].playTime++;
            }
        }
    }

    /**
       * 使用绝技
       */
    public useUniSkill(uniSkillId: number, target: CharMonster, skill: any, type?: number) {
        let affectCount = skill.affectCount ? skill.affectCount : 1;
        if (target.getHP() <= 0 || target.AI_STATE == AI_State.Die) {
            delete this.curTarget2[uniSkillId];
            if (type && type > 0) {
                this.screeningTarget2(skill.id);//根据距离筛选受击对象
                target = this.curTarget2[skill.id] ? this.curTarget2[skill.id] : null;
                if (target) {
                    this.useUniSkill(uniSkillId, target, skill);
                }

            }
            return;
        }

        let pTarget: CharMonster = target;
        let tempArr: CharMonster[] = [];
        let skillEffType: number = -1;
        let skillEffVal: number[] = [];
        if (skill.config.type == SkillsType.TYPE_I8) {
            let tmp = { skillId: skill.id, uniSkillId: uniSkillId, damageCd: egret.getTimer(), endTime: egret.getTimer() + skill.config.damageDuraTime, playTime: 0, pos: { x: target.x, y: target.y } };
            this.rangeSkill.push(tmp);
            if (!TimerSYBManager.ins().isExists(this.calulateRangeSkill, this)) {
                TimerSYBManager.ins().doTimer(100, 0, this.calulateRangeSkill, this);
            }
            return;
        }

        // if (skill.castType != castType.Other && skill.targetType == TargetType.Enemy) {
        tempArr = EntitySYBManager.ins().screeningTargetByPos(pTarget, false, affectCount, skill.affectRange, this.aiMonsterList);
        // }

        if (tempArr.length == 0) {
            tempArr = [target];
        }




        let len = tempArr.length = Math.min(tempArr.length, affectCount);

        let effBuff: EntityBuff;
        let hitTargetInfo: {
            isDie: boolean,
            damageType: number,
            ttarget: CharMonster,
            hramValue: number,
            elemValue?: number[],
            damageType2?: number,
        }[][] = [];

        if (skill.targetType == TargetType.Enemy) {

            for (let j: number = 0; j < len; j++) {
                let ttarget: CharMonster = tempArr[j];
                // let tarInfo = ttarget.infoModel as EntitySYBModel;
                let isMainTar: boolean = j == 0;//是否主目标

                let hramValue: number = 0;



                //计算基础伤害
                let result: number = this.damageBaseUniCalculation(uniSkillId);
                let isDie: boolean = this.hramedDie(ttarget, result);
                if (isDie) {

                    ttarget.AI_STATE = AI_State.Die;

                }
                let damageType: number = 0;

                let hramInfo = [];
                hramInfo.push({
                    isDie: isDie,
                    damageType: damageType,
                    ttarget: ttarget,
                    hramValue: result
                });

                hitTargetInfo.push(hramInfo);
            }
        }

        // let fbType = GameSYBMap.fbType;
        // let fbId = GameSYBMap.fubenID;

        let hitTime: number = 0;//受击次数
        GameSYBLogic.ins().playUniSkillEff(skill, tempArr, (probability: number) => {
            //切换场景后不处理上次的伤害
            //if (GameSYBMap.fbType != fbType || fbId != GameSYBMap.fubenID) return;

            let pType: DamageTypes = 0;

            for (let i in tempArr) {
                let ttarget = tempArr[i];
                let ttInfo = ttarget.infoModel;
                let targetIsDie = hitTargetInfo[i][hitTargetInfo[i].length - 1].isDie;
                if (pTarget == ttarget) {
                    pType = hitTargetInfo[i][0].damageType;
                }

                let hramValue = 0;
                for (let j = 0; j < hitTargetInfo[i].length; j++) {
                    let targetInfo = hitTargetInfo[i][j];
                    pType = targetInfo.damageType;
                    hramValue += targetInfo.hramValue;

                    let rffVal = skillEffVal[j] ? skillEffVal[j] : 0;
                    let skillType = skill.config.type;
                    if (this.speed > 1) {

                        this.showHram(targetInfo.isDie,
                            targetInfo.damageType,
                            ttarget,
                            null,
                            targetInfo.hramValue,
                            skillEffType,
                            rffVal,
                            skill.name,
                            skill,
                        );
                    } else {
                        let hitDelay = 0;
                        hitDelay = skill.hitDelay ? skill.hitDelay[j] : 500;
                        let hitTimer = Math.floor(hitDelay / 1);
                        TimerSYBManager.ins().doTimerDelay(hitTimer, 10, 1, () => {

                            this.showHram(targetInfo.isDie,
                                targetInfo.damageType,
                                ttarget,
                                null,
                                targetInfo.hramValue,
                                skillEffType,
                                rffVal,
                                skill.name,
                                skill,
                            );
                        }, this)

                    }

                    if (targetInfo.isDie) break;
                }

            }

        }, 1);

    }

    /** 开始AI */
    private startAI() {
        let list = this.aiList;
        for (let i in list) {
            let selfTarget: CharMonster = list[i];
            let target: CharMonster;

            let handle = selfTarget.infoModel.handle;
            if (!selfTarget.ifCanAtk) {
                continue;
            }

            //根据公共cd修改战斗动画播放速度
            let targetSpeed = selfTarget.infoModel.getAtt(AttributeSYBType.atSpeed);
            let pCd = targetSpeed;
            this.playSpeed = pCd >= 1200 ? 1 : 1200 / pCd;
            //是否在公共cd中
            if (selfTarget.publicCD && egret.getTimer() - selfTarget.publicCD <= pCd) {
                if (selfTarget.isCompleted()) {
                    if (selfTarget.action != EntityAction.DIE) {
                        selfTarget.playAction(EntityAction.RUN);
                    }
                }
                continue;
            }

            if (!list[handle] || !selfTarget.isSkillCompleted()) continue;

            this.screeningTarget(selfTarget);//根据距离筛选受击对象
            target = this.curTarget[handle] ? this.curTarget[handle] : null;

            switch (selfTarget.AI_STATE) {
                case AI_State.Stand:
                    // selfTarget.resetStand();
                    // this.screeningTarget(selfTarget);
                    // this.screeningSkill(handle);

                    if (this.tryUseSkill(selfTarget)) {
                        selfTarget.AI_STATE = AI_State.Atk;
                    }
                    // else {
                    //     if (this.ifCanAttkTarget(selfTarget)) {
                    //         selfTarget.AI_STATE = AI_State.Run;
                    //         // this.startAI();//第一次切换状态攻击
                    //     }
                    // }

                    break;

                case AI_State.Run:
                    //英雄没有该状态
                    // if (!target || target.AI_STATE == AI_State.Die) {
                    //     selfTarget.AI_STATE = AI_State.Stand;
                    //     selfTarget.playAction(EntityAction.STAND);
                    //     delete this.curTarget[handle];
                    //     continue;
                    // }
                    break;

                case AI_State.Atk:
                    this.isStartAtk = true;
                    if (!target || target.AI_STATE == AI_State.Die) {
                        selfTarget.AI_STATE = AI_State.Stand;
                        delete this.curTarget[handle];
                        continue;
                    }

                    // this.teamAction[target.team] = true;
                    // if (selfTarget.atking)
                    //     continue;
                    this.screeningSkill(handle);

                    let skill = this.curSkill[handle];

                    if (!skill) continue;
                    //保存最后一次使用技能的时间
                    this.skillCD[handle][skill.id] = egret.getTimer();

                    // this.skillCastType[handle] = skill.castType;
                    //this.skillTargetType[handle] = skill.targetType;
                    //记录最后一次攻击时间
                    selfTarget.publicCD = egret.getTimer();
                    selfTarget.atking = true;

                    //使用攻击技能
                    this.useSkill(selfTarget, target, skill);

                    delete this.curSkill[handle];
                    break;

            }

        }
    }



    public addMonster(char): void {
        if (char.infoModel.type == EntitySYBType.Monster) {
            this.aiMonsterList[char.infoModel.handle] = char;
        }
    }

    public removeMonster(char): void {
        if (char.infoModel.type == EntitySYBType.Monster) {
            delete this.aiMonsterList[char.infoModel.handle];
        }
    }

    private checkMissionBlood(): boolean {
        if (this.missionblood <= 0) {
            this.clear();
            UserFbSYBCC.ins().fightResultBack(0);
        } else {
            // console.log("blood:" + this.missionblood);
        }
        return this.missionblood > 0;
    }

    private startMonsterAI() {
        let list = this.aiMonsterList;
        for (let i in list) {

            let selfTarget: CharMonster = list[i];


            let handle = selfTarget.infoModel.handle;

            // if (!selfTarget.ifCanAtk) {
            //     continue;
            // }

            if (!list[handle]) continue;

            //根据公共cd修改战斗动画播放速度
            let targetSpeed = selfTarget.infoModel.getAtt(AttributeSYBType.atSpeed);
            let pCd = targetSpeed;
            this.playSpeed = pCd >= 1200 ? 1 : 1200 / pCd;
            //是否在公共cd中
            if (selfTarget.publicCD && egret.getTimer() - selfTarget.publicCD <= pCd) {
                if (selfTarget.isCompleted()) {
                    if (selfTarget.action != EntityAction.DIE) {
                        selfTarget.playAction(EntityAction.RUN);
                    }
                }
                continue;
            }

            // if (selfTarget.isMy && selfTarget.action != EntityAction.RUN) {
            //     selfTarget.playAction(EntityAction.RUN);
            // }
            // let obj = Object.keys(EntitySYBManager.ins().getAllEntity());
            // let objTar = this.curTarget[obj[0]];
            // if (objTar) {
            //     for (let i in EntitySYBManager.ins().getAllEntity()) {
            //         let entity: CharMonster = EntitySYBManager.ins().getAllEntity()[i];
            //         if (entity.isMy && objTar.infoModel.handle != entity.infoModel.handle) {
            //             this.curTarget[entity.infoModel.handle] = objTar;
            //         }
            //     }
            // }
            // if (!objTar || !selfTarget.isMy) {
            //     this.screeningTarget(selfTarget);//根据距离筛选受击对象
            // }
            // target = this.curTarget[handle] ? this.curTarget[handle] : null;

            switch (selfTarget.AI_STATE) {
                case AI_State.Stand:
                    // selfTarget.resetStand();
                    // this.screeningTarget(selfTarget);
                    // this.screeningSkill(handle);
                    // this.screeningSkill(handle);

                    // if (this.tryUseSkill(selfTarget)) {
                    //     selfTarget.AI_STATE = AI_State.Atk;
                    // } else {
                    if (!this.checkMonsterPos(selfTarget)) {
                        if (this.checkMissionBlood()) {
                            selfTarget.AI_STATE = AI_State.Run;
                        } else {
                            selfTarget.AI_STATE = AI_State.Stand;
                        }
                    } else {
                        selfTarget.AI_STATE = AI_State.Atk;

                    }
                    // this.startAI();//第一次切换状态攻击
                    //}
                    // }

                    break;

                case AI_State.Run:
                    if (!this.checkMissionBlood()) {
                        selfTarget.AI_STATE = AI_State.Stand;
                        selfTarget.playAction(EntityAction.RUN);
                        continue;
                    }
                    if (this.checkMonsterPos(selfTarget)) {
                        selfTarget.AI_STATE = AI_State.Stand;
                        continue;
                    }

                    this.monsterScreeningByDistance(selfTarget);

                    break;

                case AI_State.Atk:
                    if (!this.checkMissionBlood()) {
                        selfTarget.AI_STATE = AI_State.Stand;
                        // delete this.curTarget[handle];
                        continue;
                    }
                    //记录最后一次攻击时间
                    selfTarget.publicCD = egret.getTimer();
                    // if (selfTarget.atking)
                    //     continue;
                    selfTarget.playAction(EntityAction.ATTACK);
                    this.mosterAtkHram(selfTarget);

                    // delete this.curSkill[handle];
                    break;

            }
        }
    }


    private stopAITimer() {
        TimerSYBManager.ins().remove(this.startAI, this);
        TimerSYBManager.ins().remove(this.tryUseUniSkill, this);
        TimerSYBManager.ins().remove(this.calulateRangeSkill, this);
    }

    private stopMonsterAITimer() {
        TimerSYBManager.ins().remove(this.startMonsterAI, this);
    }

    private addAITimer() {
        if (!TimerSYBManager.ins().isExists(this.startAI, this)) {
            TimerSYBManager.ins().doTimer(RoleSYBAI.AI_UPDATE_TIME, 0, this.startAI, this);
            TimerSYBManager.ins().doTimer(RoleSYBAI.MonsterAI_UPDATE_TIME, 0, this.tryUseUniSkill, this);
            TimerSYBManager.ins().doTimer(100, 0, this.calulateRangeSkill, this);
        }
    }

    private screeningTarget(selfTarget: CharMonster, range: number = Number.MAX_VALUE, isSameTeam: boolean = false): CharMonster {
        let hCode: any = selfTarget.infoModel.handle;
        let charObj: { char: CharMonster, value: number }[] = [];
        for (let i in this.aiMonsterList) {
            let target: CharMonster = this.aiMonsterList[i];
            if (target.infoModel.handle == hCode || target.AI_STATE == AI_State.Die || target.checkPos()) continue;

            charObj.push({ char: target, value: MathSYBUtils.getDistance(selfTarget.x, selfTarget.y, target.x, target.y) });
        }
        charObj.sort(this._sort);
        if (charObj.length > 0) {
            this.curTarget[hCode] = charObj[0].char;
            return charObj[0].char;
        }
        return null;
    }

    private screeningTarget2(skillId: number): CharMonster {
        let hCode: any = skillId;
        let charObj: { char: CharMonster, value: number }[] = [];
        for (let i in this.aiMonsterList) {
            let target: CharMonster = this.aiMonsterList[i];
            if (target.infoModel.handle == hCode || target.AI_STATE == AI_State.Die || target.x <= 0 || target.x >= 720 || target.y >= 1440 || target.y <= 0) continue;

            charObj.push({ char: target, value: MathSYBUtils.getDistance(StageSYBUtils.ins().getStage().stageWidth / 2, StageSYBUtils.ins().getStage().stageHeight / 2, target.x, target.y) });
        }
        charObj.sort(this._sort);
        if (charObj.length > 0) {
            this.curTarget2[hCode] = charObj[charObj.length - 1].char;
            return charObj[charObj.length - 1].char;
        }
        return null;
    }

    private screeningTargetByDistanceMin(selfTarget: CharMonster, affectCount: number, range: number = Number.MAX_VALUE, isSameTeam: boolean = false): CharMonster[] {
        let tempArr: CharMonster[] = [];
        let hCode: any = selfTarget.infoModel.handle;
        let charObj: { char: CharMonster, value: number }[] = [];
        for (let i in this.aiMonsterList) {
            let target: CharMonster = this.aiMonsterList[i];
            if (target.infoModel.handle == hCode || target.AI_STATE == AI_State.Die || target.checkPos()) continue;
            let distance = MathSYBUtils.getDistance(StageSYBUtils.ins().getStage().stageWidth / 2, StageSYBUtils.ins().getStage().stageHeight / 2, target.x, target.y);
            if (distance > selfTarget.infoModel.getAtt(AttributeSYBType.atRange)) {
                continue;
            }
            charObj.push({ char: target, value: distance });
        }
        charObj.sort(this._sort);
        // charObj.reverse();
        if (charObj.length > 0) {
            // this.curTarget[hCode] = charObj[0].char;
            for (let i = 0; i < charObj.length; i++) {
                tempArr.push(charObj[i].char);
                if (tempArr.length >= affectCount) {
                    return tempArr;
                }
            }
            //return charObj[0].char;
        }
        return null;
    }
    private screeningBossTargetByDistanceMin(selfTarget: CharMonster, affectCount: number, range: number = Number.MAX_VALUE, isSameTeam: boolean = false): CharMonster[] {
        let tempArr: CharMonster[] = [];
        let hCode: any = selfTarget.infoModel.handle;
        let charBossObj: { char: CharMonster, value: number }[] = [];
        let charObj: { char: CharMonster, value: number }[] = [];
        for (let i in this.aiMonsterList) {
            let target: CharMonster = this.aiMonsterList[i];
            if (target.infoModel.handle == hCode || target.AI_STATE == AI_State.Die || target.checkPos()) continue;
            let distance = MathSYBUtils.getDistance(StageSYBUtils.ins().getStage().stageWidth / 2, StageSYBUtils.ins().getStage().stageHeight / 2, target.x, target.y);
            if (distance > selfTarget.infoModel.getAtt(AttributeSYBType.atRange)) {
                continue;
            }
            let mCfg = GlobalJYConfig.MonsterConfig[target.infoModel.configID];
            if (mCfg.ifBoss == 1) {
                charBossObj.push({ char: target, value: distance });
            } else {
                charObj.push({ char: target, value: distance });
            }
        }
        charBossObj.sort(this._sort);
        charObj.sort(this._sort);
        if (charBossObj.length > 0) {
            //this.curTarget[hCode] = charBossObj[0].char;
            for (let i = 0; i < charBossObj.length; i++) {
                tempArr.push(charBossObj[i].char);
                if (tempArr.length >= affectCount) {
                    return tempArr;
                }
            }
        }
        if (charObj.length > 0) {
            this.curTarget[hCode] = charObj[0].char;
            for (let i = 0; i < charObj.length; i++) {
                tempArr.push(charObj[i].char);
                if (tempArr.length >= affectCount) {
                    return tempArr;
                }
            }
            //return charObj[0].char;
        }
        return null;
    }


    private _sort(a: any, b: any): number {
        return a.value - b.value;
    }

    private _sortHp(a: CharMonster, b: CharMonster): number {
        return a.getHP() - b.getHP();
    }

    /**
     * 城墙回血
     */
    public recoverWarBlood(selfTarget: CharMonster): void {
        let hpReCover = selfTarget.infoModel.getAtt(AttributeSYBType.atHpCover);
        if (hpReCover) {
            this.missionblood += hpReCover;
        }
        let hpReCoverRate = selfTarget.infoModel.getAtt(AttributeSYBType.atHpCoverRate);
        if (hpReCoverRate) {
            let addRate = GlobalJYConfig.HeroBaseConfig.warBlood * (hpReCoverRate / 10000);
            let hpRate = this.missionblood + addRate;
            if (addRate > 0) {
                UserFbSYBCC.ins().postWallHpToChange("+"+addRate);
            }
            if (hpRate >= this.missionbloodMax) {
                this.missionblood = this.missionbloodMax;
            } else {
                this.missionblood = hpRate;
            }
        }
        UserFbSYBCC.ins().postWallHpChange();
    }

    /**
   * 伤害表现
   * @param skillType:-1：无操作，0:吸血，1：吸怒气
   * @param skillVal: 技能伤害
   */
    private showHram(isDie: boolean, damageType: number, target, sourceTarget, hramValue: number, skillType: number = -1, skillVal: number = 0, logStr: string = "", skill: any = null): void {
        if (!target || !target.infoModel) return;
        this.trace(target.infoModel.handle + " -- 受到" + hramValue + ", 当前剩余血量:" + target.getHP() + "	--" + logStr);
        //this.trace("---剩余血量 " + target.getHP());

        if (hramValue >= 0) {
            target.playAction(EntityAction.HIT, () => {//受击动作
                target.playAction(EntityAction.STAND);
            });
        }

        //显示对象血条扣血
        target.hram(hramValue);

        if (skill && !SoundUtil.WINDOW_OPEN && skill.sound) {
            SoundUtil.ins().playEffect(skill.sound);
        }


        //飘血
        GameSYBLogic.ins().postEntityHpChange(target, sourceTarget, damageType, hramValue);
        //回血
        if (sourceTarget) {
            this.recoverWarBlood(sourceTarget);
        }
        //主界面血量
        //GameSYBLogic.ins().postHpChange(target);
        //死亡
        if (isDie) {
            target.removeAllFilters();
            target.stopMove();

            this.trace(target.infoModel.handle + " -- 死亡，等待删除形象");

            target.AI_STATE = AI_State.Die;
            //UserFbSYBCC.ins().addWaveKill();
            UserFbSYBCC.ins().postAddFbExp(target.infoModel.configID);

            target.playAction(EntityAction.DIE, () => {
                this.trace(target.infoModel.handle + " -- 删除");
                target.onDead(() => {
                    EntitySYBManager.ins().removeByHandle(target.infoModel.handle, true);
                    this.clearTarget(target);
                    target.deadDelay();

                    // RoleDieCC.ins()._isclearTarget(1);
                    // target.removeTimeAll();

                });
            });

            //防止实体死亡未被移除，做强制
            TimerSYBManager.ins().doTimer(1200, 1, () => {
                EntitySYBManager.ins().removeByHandle(target.infoModel.handle, true);
                this.clearTarget(target);
                target.deadDelay();
            }, this);
            // TimerSYBManager.ins().doTimer(300, 1, () => {
            //     this.trace(target.infoModel.handle + " -- 删除");


            //     target.onDead(() => {
            //         EntitySYBManager.ins().removeByHandle(target.infoModel.handle, true);
            //         this.clearTarget(target);
            //         target.deadDelay();
            //         // RoleDieCC.ins()._isclearTarget(1);
            //         // target.removeTimeAll();

            //     });
            // }, this);

        }
        else {
            //检测血量变更
            // ExSkillSYBAiLogic.ins().checkHPTrigger(target, sourceTarget);
        }
    }

    public monsterScreeningByDistance(selfTarget: CharMonster) {
        if (!this.checkMissionBlood()) {
            selfTarget.AI_STATE = AI_State.Stand;
            return;
        }
        if (!this.checkMonsterPos(selfTarget)) {

            //暂时不需要转向
            // let dir = DirSYBUtil.get2DirBy2Point({ x: selfTarget.x, y: selfTarget.y }, { x: UserFbSYBCC.ins().missionPos[selfTarget.infoModel.posType-1][selfTarget.infoModel.posIndex][0], y: UserFbSYBCC.ins().missionPos[selfTarget.infoModel.posType-1][selfTarget.infoModel.posIndex][1] });
            // selfTarget.infoModel.dir = dir;
            let dir = selfTarget.x > 360 ? 0 : 1;
            selfTarget.infoModel.dir = dir;
            let obj = Object.keys(EntitySYBManager.ins().getAllEntity());

            for (let i in EntitySYBManager.ins().getAllEntity()) {
                let entity: CharMonster = EntitySYBManager.ins().getAllEntity()[i];
                if (entity.infoModel.isMy && entity.infoModel.dir == selfTarget.infoModel.dir) {
                    entity.infoModel.dir = selfTarget.infoModel.dir == 1 ? 0 : 1;
                    entity.dir = selfTarget.infoModel.dir == 1 ? 0 : 1;
                }
            }
            let wallPos = GlobalJYConfig.ChapterBaseConfig.wallPos;

            this._seekpath(selfTarget, selfTarget.x, selfTarget.y, wallPos[selfTarget.infoModel.posType - 1][selfTarget.infoModel.posIndex][0], wallPos[selfTarget.infoModel.posType - 1][selfTarget.infoModel.posIndex][1]);
        } else {
            selfTarget.AI_STATE = AI_State.Stand;
        }

    }
    private checkMonsterPos(selfTarget: CharMonster): boolean {
        let wallPos = GlobalJYConfig.ChapterBaseConfig.wallPos;
        let attkPos: { x: number, y: number } = { x: wallPos[selfTarget.infoModel.posType - 1][selfTarget.infoModel.posIndex][0], y: wallPos[selfTarget.infoModel.posType - 1][selfTarget.infoModel.posIndex][1] };
        let distance = MathSYBUtils.getDistance(selfTarget.x, selfTarget.y, attkPos.x, attkPos.y);

        return distance <= selfTarget.infoModel.getAtt(AttributeSYBType.atRange);
    }

    private mosterAtkHram(selfTarget: CharMonster): void {
        if (!this.checkMissionBlood()) {
            return;
        }
        let result: number = this.damageBaseCalculation(selfTarget);
        this.missionblood = this.missionblood - result;
        UserFbSYBCC.ins().postWallHpChange();
        UserFbSYBCC.ins().postWallHpToChange("-"+result);
        GameSYBLogic.ins().postWallBeAttack(selfTarget.infoModel.posType);
    }

    //计算怪物伤害值 
    private damageBaseCalculation(selfTarget: CharMonster): number {
        //攻击方数据
        // let attrValue: number = 0;
        let damage: number = selfTarget.infoModel.getAtt(AttributeSYBType.atAttack);
        let critPer = Math.floor(selfTarget.infoModel.getAtt(AttributeSYBType.atCritRate) / 100);
        let ifPhysicalCrit = Math.random() * 100 <= critPer;


        if (ifPhysicalCrit) {
            damage = damage * (selfTarget.infoModel.getAtt(AttributeSYBType.atCritDamage) / 10000);
        } else {
            damage = damage;
        }
        return damage;
    }

    //计算绝技伤害值 
    private damageBaseUniCalculation(skillId: number): number {
        //攻击方数据
        // let attrValue: number = 0;
        let skillCfg = GlobalJYConfig.UniqueSkillConfig[skillId][UniqueSkillCC.ins().any[skillId].level];
        let damage: number = 0;
        for (let i = 0; i < skillCfg.attr.length; i++) {
            if (skillCfg.attr[i].type == AttributeSYBType.atAttack) {
                damage = skillCfg.attr[i].value;
            }
        }
        let data = UniqueSkillCC.ins().fightUniSkill[skillId];
        damage = damage * (1 + data.damageAdd / 100);

        return damage;
    }

    //计算伤害值 回传先预设 暴击，伤害的计算
    private damageHeroBaseCalculation(selfTarget: CharMonster, target: CharMonster, skill: any): any[] {
        //攻击方数据
        // let attrValue: number = 0;
        let damage: number[] = [];
        let skillValue: number = 0;
        // let buff: EntityBuff;
        //物理伤害值（A攻击最小值-A攻击最大值）浮动取值*（1+伤害追加）*暴击倍率*（1-B物理免伤）-最终减伤\
        let physicalDamage = 0;
        let baseDamage: number = 0;

        // let selfIsActor: boolean = false;
        // let targetIsActor: boolean = false;

        let attArga: number = 0;
        let attArgb: number = 0;
        let attArgc: number = 0;

        // if (selfTarget instanceof CharRole) {
        //     selfIsActor = true;
        // } else {
        //     selfIsActor = false;
        // }

        // if (target instanceof CharRole) {
        //     targetIsActor = true;
        // } else {
        //     targetIsActor = false;
        // }

        //攻击是否暴击(物理暴击和元素暴击)
        let ifPhysicalCrit: boolean = false;
        if (skill.targetType == TargetType.Enemy) {//对敌方造成伤害

            let atAddDamVal = 0;
            // if ((skill.config.type == SkillsType.TYPE_I1 && !skill.config.passive) || skill.config.type == SkillsType.TYPE_I6 || skill.config.type == SkillsType.TYPE_I7) {
            //     //敌方存活人数越少伤害越高，最大增加30%最终伤害
            //     for (let groupID in selfTarget.buffList) {
            //         let buff: EntityBuff = selfTarget.buffList[groupID];
            //         let sefBuff = buff.effConfig;
            //         if (sefBuff.type == SkillEffType.AdditionalState && sefBuff.args.i == SkillArgsType.TYPE_I13) {
            //             let cnt = EntitySYBManager.ins().getTagerEntityCount(selfTarget.isMy);
            //             if (cnt < 5) {
            //                 //少于5人 每少一人 伤害增加
            //                 atAddDamVal += ((5 - cnt) * sefBuff.args.a);
            //             }
            //         }
            //     }
            // }

            //	攻击命中值 ---------- 实际命中率=（A的命中率-B的闪避率）
            // let exHitChance = GameSYBLogic.calculateRealAttribute(selfTarget, AttributeSYBType.atHitChance, selfTarget);
            // let selHitChance = (atkModel.getAtt(AttributeSYBType.atHitRate) - defModel.getAtt(AttributeSYBType.atDodgeRate)) / 100;

            //暴击率=A玩家暴击率-B玩家抗暴率
            let critPer = Math.floor((selfTarget.infoModel.getAtt(AttributeSYBType.atCritRate) - target.infoModel.getAtt(AttributeSYBType.atOpposeCritRat)) / 100);
            //let critPer = Math.floor(selfTarget.infoModel.getAtt(AttributeSYBType.atCritRate) / 100);
            ifPhysicalCrit = Math.random() * 100 <= critPer;

            let tempAttack = selfTarget.infoModel.getAtt(AttributeSYBType.atAttack);
            let tempdefense = selfTarget.infoModel.getAtt(AttributeSYBType.atDefense) ? selfTarget.infoModel.getAtt(AttributeSYBType.atDefense) : 0;
            baseDamage = tempAttack - tempdefense;//(A的攻击力-B的防御力) * 0.7
            if (!selfTarget.infoModel.getAtt(AttributeSYBType.atDamageType) || selfTarget.infoModel.getAtt(AttributeSYBType.atDamageType) == 1) {
                let atAddDamage = selfTarget.infoModel.getAtt(AttributeSYBType.atAddDamage) ? selfTarget.infoModel.getAtt(AttributeSYBType.atAddDamage) : 0;
                let atPhyAddDamage = selfTarget.infoModel.getAtt(AttributeSYBType.atPhyAddDamage) ? selfTarget.infoModel.getAtt(AttributeSYBType.atPhyAddDamage) : 0;
                let atReduceDamage = target.infoModel.getAtt(AttributeSYBType.atReduceDamage) ? target.infoModel.getAtt(AttributeSYBType.atReduceDamage) : 0;
                let atPhyReduceDamage = target.infoModel.getAtt(AttributeSYBType.atPhyReduceDamage) ? target.infoModel.getAtt(AttributeSYBType.atPhyReduceDamage) : 0;
                if (ifPhysicalCrit) {
                    let atCritDamage = selfTarget.infoModel.getAtt(AttributeSYBType.atCritDamage) ? selfTarget.infoModel.getAtt(AttributeSYBType.atCritDamage) : 0;

                    physicalDamage = baseDamage * (1 + ((atAddDamage + atPhyAddDamage - atReduceDamage - atPhyReduceDamage) / 10000)) * (1.5 + atCritDamage / 10000);
                }
                else {
                    physicalDamage = baseDamage * (1 + ((atAddDamage + atPhyAddDamage - atReduceDamage - atPhyReduceDamage) / 10000));
                }
            } else {
                let atAddDamage = selfTarget.infoModel.getAtt(AttributeSYBType.atAddDamage) ? selfTarget.infoModel.getAtt(AttributeSYBType.atAddDamage) : 0;
                let atMagAddDamage = selfTarget.infoModel.getAtt(AttributeSYBType.atMagAddDamage) ? selfTarget.infoModel.getAtt(AttributeSYBType.atMagAddDamage) : 0;
                let atReduceDamage = target.infoModel.getAtt(AttributeSYBType.atReduceDamage) ? target.infoModel.getAtt(AttributeSYBType.atReduceDamage) : 0;
                let atMagReduceDamage = target.infoModel.getAtt(AttributeSYBType.atMagReduceDamage) ? target.infoModel.getAtt(AttributeSYBType.atMagReduceDamage) : 0;
                if (ifPhysicalCrit) {
                    let atCritDamage = selfTarget.infoModel.getAtt(AttributeSYBType.atCritDamage) ? selfTarget.infoModel.getAtt(AttributeSYBType.atCritDamage) : 0;

                    physicalDamage = baseDamage * (1 + ((atAddDamage + atMagAddDamage - atReduceDamage - atMagReduceDamage) / 10000)) * (1.5 + atCritDamage / 10000);
                }
                else {
                    physicalDamage = baseDamage * (1 + ((atAddDamage + atMagAddDamage - atReduceDamage - atMagReduceDamage) / 10000));
                }
            }
            let ran = MathSYBUtils.limitInteger(95, 104) / 100;
            physicalDamage = physicalDamage <= 1 ? 1 : Math.floor(physicalDamage * ran);

            //攻击技能
            if (skill.args) {
                //todo 伤害计算
                //todo先给与技能buff
                for (let i in skill.args) {
                    let argss = skill.args[i];
                    let tempAttack = GameSYBLogic.calculateRealAttribute(selfTarget, AttributeSYBType.atAttack, selfTarget);
                    let argb: number = !argss.b ? 0 : argss.b;

                    //根据敌方最高血量算伤害
                    if (argss.c) {
                        attArgc += argss.c * target.infoModel.getAtt(AttributeSYBType.atHp);
                    }
                    attArga = argss.a;
                    attArgb = argb;
                    skillValue = tempAttack;
                    damage.push(Math.floor((physicalDamage + skillValue) * attArga + attArgb + attArgc));
                }
            } else {
                let damageNum = skill.calcType == 1 ? physicalDamage : 0
                damage.push(damageNum);
            }
            //总伤害值
        }

        return [ifPhysicalCrit, damage];
    }

    private tryUseSkill(selfTarget: CharMonster): boolean {
        // let hCode: any = selfTarget.infoModel.handle;
        // let target: CharMonster = this.curTarget[hCode] ? this.curTarget[hCode] : null;
        // if (!target) {
        //     return false;
        // }
        // //计算距离
        // let xb: number = MathSYBUtils.getDistance(selfTarget.x, selfTarget.y, target.x, target.y);
        // //距离在技能范围内，攻击目标
        //return xb < this._attackDistance(selfTarget);
        return true;
    }

    //技能公共CD
    private _skillPublicCD: number = 0;

    private screeningSkill(hCode): void {
        let selfTarget: CharMonster = this.aiList[hCode];
        this.skillCD[hCode] = this.skillCD[hCode] || {};


        let baseSkill: any[] = [new any(GlobalJYConfig.HeroGirdConfig[selfTarget.infoModel.configID][selfTarget.infoModel.stage].skillId[0].id)];
        let canUseSkill = this.getCanUseSkillList(selfTarget);
        if (!canUseSkill && !baseSkill) return;

        // let arrSkill: any[] = [];
        let skill: any;

        // arrSkill.push(canUseSkill[0])
        if (canUseSkill) {
            skill = canUseSkill[0];

        } else {
            skill = baseSkill[0];

        }
        let tmpskill = skill;
        // for (let i = 0; i < arrSkill.length; i++) {
        //     let skillEff: EffectsConfig;
        //     let canskill = arrSkill[i];
        //     tmpskill = canskill;

        // }

        this.curSkill[hCode] = tmpskill;
    }

    //获取释放技能列表
    private getCanUseSkillList(selfTarget: CharMonster) {
        let skills: any[] = [];
        if (selfTarget instanceof CharRole) {
            let stageCfg = GlobalJYConfig.HeroGirdConfig[selfTarget.infoModel.configID][selfTarget.infoModel.stage];
            if (stageCfg.skillId) {
                for (let i = stageCfg.skillId.length - 1; i >= 0; i--) {
                    if (stageCfg.skillId[i].lv > 1 && selfTarget.infoModel.lv >= stageCfg.skillId[i].lv) {
                        skills.push(new any(stageCfg.skillId[i].id));
                    }
                }
                if (skills.length == 0) {
                    skills.push(new any(stageCfg.skillId[0].id));
                }
            }
        }
        return skills;
    }

    /**
       * 寻路检测(p1起始点，p2结束点)
       * @param p1X 
       * @param p1Y
       * @param p2X
       * @param p2Y
       */
    private _seekpath(selfTarget: CharMonster, p1X, p1Y, p2X, p2Y): void {
        let path: AStarSYBNode[] = ObjectPool.pop("AStarSYBNode");

        path = [new AStarSYBNode(p2X, p2Y, DirSYBUtil.get2DirBy2Point({ x: p1X, y: p1Y }, { x: p2X, y: p2Y }))];
        GameSYBLogic.ins().postMoveEntity(selfTarget, path, true);
        let obj = Object.keys(EntitySYBManager.ins().getAllEntity());

    }

    private isLog: boolean = false;

    private trace(str: string): void {
        if (this.isLog)
            console.warn(str);
    }

}

enum Team {
    My,
    Monster,
}

enum TargetType {
    Friendly = 1,
    Enemy,
    My,
}

enum AI_State {
    Stand,
    Run,
    Atk,
    Die,
    Patrol,
    End,
}