/**
 * 实体管理器
 */
class EntitySYBManager extends BaseSYBClass {

    public static CHAR_DEFAULT_HEIGHT = 118;
    public static CHAR_DEFAULT_TYPEFACE = 110;

    private distances: { priority: number, target: CharMonster }[] = [];

    /**保存玩家上阵英雄id */
    public togetherHeroData: { [masterHandle: number]: { [heroId: number]: { heroId: number, onlyEquipId: number } } } = {};

    public static ins(): EntitySYBManager {
        return super.ins() as EntitySYBManager;
    }

    constructor() {
        super();
        this.listCount = [];
    }


    private entityList: any = {};
    private transferList: any = {};//传送点


    private listCount: number[];

    public getAllEntity() {
        return this.entityList;
    }

    public resetRole(): void {
        // let model: Role = SubRoles.ins().getSubRoleByIndex();
        // model.name = Actor.myName;
        // if (!this.getEntityByHandle(model.handle)) {
        //     debug.log("--------------所有角色重置----------------");
        //     model.setAtt(AttributeSYBType.atHp, model.getAtt(AttributeSYBType.atHpMax));
        //     //GameSYBLogic.ins().createEntityByModel(model, Team.My);
        // } else {
        //     let char = this.getEntityByHandle(model.handle);
        //     char.infoModel.setAtt(AttributeSYBType.atHp, model.getAtt(AttributeSYBType.atHpMax));
        //     char.updateBlood(true);
        // }

    }

    private addList(char): void {
        if (!char.infoModel.handle)
            char.infoModel.handle = char.hashCode;
        if (this.entityList[char.infoModel.handle] == char) {
            return;
        }
        this.entityList[char.infoModel.handle] = char;

        let count: number = this.listCount[char.team] || 0;
        this.listCount[char.team] = ++count;
    }

    /**
        * 获取敌方血上限最少怪物或者根据施法目标获取目标
        */
    public screeningTargetByCastType(selfTarget: CharMonster, maxNum: number = 1, list, isCastType: number = 7): CharMonster[] {
        let tempArr: CharMonster[] = [];
        let hCode: any = selfTarget.infoModel.handle;
        let charArr: CharMonster[] = [];
        for (let i in list) {
            let target: CharMonster = list[i];
            if (target.infoModel.handle == hCode || target.AI_STATE == AI_State.Die || target.checkPos()) continue;

            charArr.push(target);
        }
        if (isCastType == castType.ranAtkCnt) {
            for (let i = 0; i < maxNum; i++) {
                let ran = Math.floor(Math.random() * charArr.length);
                if (charArr[ran])
                    tempArr.push(charArr[ran]);
            }
        } else {
            if (isCastType == castType.targAtkMax) {
                charArr.sort(this._sortAtkMax);
            } else {
                charArr.sort(this._sortHpMin);
            }
            for (let key = 0; key < charArr.length; key++) {
                if (key < maxNum) {
                    tempArr.push(charArr[key]);
                }
            }
        }
        if (tempArr.length > 0) {
            return tempArr;
        }
        return null;
    }

    public screeningTargetByDistance(pos: { x: number, y: number }, maxNum: number = 0, range: number = Number.MAX_VALUE, list): CharMonster[] {
        let disFun: Function = MathSYBUtils.getDistanceX2ByObject;//优化算法，只算距离的平方值，不开方。所以不用 MathSYBUtils.getDistance;

        let range2: number = range;
        if (range != Number.MAX_VALUE) {
            //索敌范围的平方
            range2 = (range * GameSYBMap.CELL_SIZE) * (range * GameSYBMap.CELL_SIZE);
        }
        let tempValue: number;
        let distances: { priority: number, target: CharMonster }[] = [];
        for (let i in list) {
            let element: CharMonster = list[i];

            if (element.AI_STATE == AI_State.Die || element.x <= 10 || element.x >= 710 || element.y >= 1420 || element.y <= 10)
                continue;

            tempValue = disFun({ x: pos.x, y: pos.y }, element);

            if (tempValue > range2)
                continue;

            distances.push({
                priority: tempValue,
                target: element
            });
        }

        distances.sort(this.sortFunc);

        let tempArr: CharMonster[] = [];
        let len: number = 0;
        if (distances.length > maxNum) {
            let arr = MathSYBUtils.onArrayRandomMultiple(distances, maxNum);
            for (let j = 0; j < arr.length; j++) {
                tempArr[j] = arr[j].target;
            }
        } else {
            len = distances.length;
            for (let j = 0; j < len; j++) {
                tempArr[j] = distances[j].target;
            }
        }

        return tempArr;
    }

    public screeningTargetByPos(selfTarget: CharMonster, sameTeam: boolean = false, maxNum: number = 0, range: number = Number.MAX_VALUE, list): CharMonster[] {

        let disFun: Function = MathSYBUtils.getDistanceX2ByObject;//优化算法，只算距离的平方值，不开方。所以不用 MathSYBUtils.getDistance;

        let range2: number = range;
        if (range != Number.MAX_VALUE) {
            //索敌范围的平方
            range2 = (range * GameSYBMap.CELL_SIZE) * (range * GameSYBMap.CELL_SIZE);
        }

        this.distances.length = 0;

        let tempValue: number;
        for (let i in list) {
            let element: CharMonster = list[i];

            if (sameTeam && element.team != selfTarget.team)
                continue;

            if (!sameTeam && element.team == selfTarget.team)
                continue;

            if (element.AI_STATE == AI_State.Die)
                continue;

            tempValue = disFun(selfTarget, element);

            if (tempValue > range2)
                continue;

            this.distances.push({
                priority: tempValue,
                target: element
            });
        }
        this.distances.sort(this.sortFunc);

        let tempArr: CharMonster[] = [];
        let len: number = 0;
        if (this.distances.length > maxNum) {
            let arr = MathSYBUtils.onArrayRandomMultiple(this.distances, maxNum);
            for (let j = 0; j < arr.length; j++) {
                tempArr[j] = arr[j].target;
            }
        } else {
            len = this.distances.length;
            for (let j = 0; j < len; j++) {
                tempArr[j] = this.distances[j].target;
            }
        }

        return tempArr;
    }


    /**获取最顶层的ActorHandle */
    public getRootMasterHandle(handle) {
        let target: CharRole = EntitySYBManager.ins().getEntityByHandle(handle) as CharRole;
        if (target && target.infoModel && target.infoModel.masterHandle > 0 && target.infoModel.masterHandle != handle) {
            return this.getRootMasterHandle(target.infoModel.masterHandle);
        }
        else {
            return handle;
        }
    }


    public removeTransferById(configID) {
        let char = this.transferList[configID];
        if (char) {
            delete this.transferList[configID];
            DisplaySYBUtils.removeFromParent(char);
        }
    }

    public getTransferById(configID) {
        return this.transferList[configID];
    }


    public checkAnyMonsterExist(): boolean {
        for (let i in this.entityList) {
            let role: CharMonster = this.entityList[i];
            if (role.team == Team.Monster) {
                return true;
            }
        }
        return false;
    }


    public createEntity(model: any, param?: any): egret.DisplayObject {
        switch (model.type) {
            case EntitySYBType.Role:
                let roleModel: Role = model;
                roleModel.team = Team.My;
                roleModel.type = EntitySYBType.Role;

                //后续有时间再查对象池数据没清理
                let role: CharRole = ObjectPool.pop('CharRole');
                role.reset();



                role.infoModel = roleModel;
                role.x = roleModel.x;
                role.y = roleModel.y;
                role.dir = roleModel.dir;
                //role.infoModel.setAtt(AttributeSYBType.atAttack, 20);
                //防止生成时无属性，直接死亡
                // if (!role.infoModel.getAtt(AttributeSYBType.atHpMax) || role.infoModel.getAtt(AttributeSYBType.atHpMax) <= 0) {
                //     role.infoModel.setAtt(AttributeSYBType.atHpMax, 1000);
                //     role.infoModel.setAtt(AttributeSYBType.atHp, role.infoModel.getAtt(AttributeSYBType.atHpMax));
                // } else {
                //     role.infoModel.setAtt(AttributeSYBType.atHp, role.infoModel.getAtt(AttributeSYBType.atHpMax));
                // }
                let hCfg = GlobalJYConfig.HeroLevelConfig[roleModel.configID][roleModel.lv];
                for (let i = 0; i < hCfg.attr.length; i++) {
                    role.infoModel.setAtt(hCfg.attr[i].type, hCfg.attr[i].value);
                    if (hCfg.attr[i].type == AttributeSYBType.atHpMax) {
                        role.infoModel.setAtt(AttributeSYBType.atHp, hCfg.attr[i].value);
                    }
                    else if (hCfg.attr[i].type == AttributeSYBType.atSpeedRate) {//攻速万分比
                        let lastValue = model.attributeData[AttributeSYBType.atSpeed];
                        let curValue = lastValue / (1 + role.infoModel.getAtt(AttributeSYBType.atSpeedRate) / 10000);
                        role.infoModel.setAtt(AttributeSYBType.atSpeed, curValue);
                    }
                }

                let hgCfg = GlobalJYConfig.HeroGirdConfig[roleModel.configID][roleModel.stage];
                if (hgCfg.attr) {
                    for (let i = 0; i < hgCfg.attr.length; i++) {
                        let curValue = role.infoModel.getAtt(hgCfg.attr[i].type);
                        let nowValue = curValue + hgCfg.attr[i].value;
                        role.infoModel.setAtt(hgCfg.attr[i].type, nowValue);
                        if (hgCfg.attr[i].type == AttributeSYBType.atHpMax) {
                            role.infoModel.setAtt(AttributeSYBType.atHp, nowValue);
                        }
                        else if (hgCfg.attr[i].type == AttributeSYBType.atSpeedRate) {//攻速万分比
                            let lastValue = model.attributeData[AttributeSYBType.atSpeed];
                            let curValue = lastValue / (1 + role.infoModel.getAtt(AttributeSYBType.atSpeedRate) / 10000);
                            role.infoModel.setAtt(AttributeSYBType.atSpeed, curValue);
                        }
                    }
                }
                this.addList(role);
                RoleSYBAI.ins().addRole(role);
                let isBody: boolean = true;

                isBody ? role.showBodyContainer() : role.hideBodyContainer();
                role.updateModel();
                return role;

            case EntitySYBType.Monster:
                model.team = Team.Monster;

                //取对象池里的缓存
                let monster: CharMonster = ObjectPool.pop('CharMonster');
                //重置缓存
                monster.reset();
                //设置model数据
                // let cfg = GlobalConfig.MonstersConfig[model.configID];
                // let modelCfg = GlobalConfig.MonstersModelConfig[cfg.m];

                let mCfg = GlobalJYConfig.MonsterConfig[model.configID];
                for (let i = 0; i < mCfg.attr.length; i++) {
                    model.setAtt(mCfg.attr[i].type, mCfg.attr[i].value);
                    if (mCfg.attr[i].type == AttributeSYBType.atHpMax) {
                        model.setAtt(AttributeSYBType.atHp, mCfg.attr[i].value);
                    }
                    else if (mCfg.attr[i].type == AttributeSYBType.atSpeedRate) {//攻速万分比
                        let lastValue = model.attributeData[AttributeSYBType.atSpeed];
                        let curValue = lastValue / (1 + model.attributeData[i] / 10000);
                        model.setAtt(AttributeSYBType.atSpeed, curValue);
                    }
                }

                monster.infoModel = model;
                monster.x = model.x;
                monster.y = model.y;
                monster.dir = 1;
                // monster.name = cfg.name;
                monster.rotation = 0;
                monster.infoModel.type = EntitySYBType.Monster;
                //monster.infoModel.setlv(cfg.l);
                // if (UserFbSYBCC.ins().mAttr) {
                //     for (let i = 0; i < UserFbSYBCC.ins().mAttr.length; i++) {
                //         monster.infoModel.setAtt(UserFbSYBCC.ins().mAttr[i][0], UserFbSYBCC.ins().mAttr[i][1]);

                //         //设置变动属性
                //         if (UserFbSYBCC.ins().mAttr[i][0] == AttributeSYBType.atHpMax) {
                //             //生成时最终生命=最大生命值（属性类型0）*（1-降低怪物出现最大生命值）
                //             let hp = UserFbSYBCC.ins().mAttr[i][1];
                //             hp = hp > 0 ? hp : 0;
                //             monster.infoModel.setAtt(AttributeSYBType.atHpMax, hp);
                //             monster.infoModel.setAtt(AttributeSYBType.atHp, hp);
                //         }

                //     }
                // }


                //   monster.infoModel.setPower();


                this.addList(monster);
                RoleSYBAI.ins().addMonster(monster);

                let isShowBody: boolean = true;

                isShowBody ? monster.showBodyContainer() : monster.hideBodyContainer();
                monster.updateModel();

                return monster;
        }
        return null;
    }

    public removeAll(): void {
        for (let i in this.entityList) {
            this.removeByHandle(i);
        }

        for (let i in this.transferList) {
            this.removeTransferById(i);
        }

        // EncounterFight.ins().stop();

        this.entityList = {};

        this.transferList = {};

        this.listCount = [];
    }

    private isHideOther: boolean;


    public removeByHandle(handle: any, removeDisplay: boolean = true, expEffect: boolean = false): CharMonster {
        // return;
        let entity = this.entityList[handle];
        if (!entity)
            return;

        delete this.entityList[handle];

        for (let i in this.entityList) {
            if (this.entityList[i].infoModel.masterHandle &&
                this.entityList[i].infoModel.masterHandle == handle)
                this.removeByHandle(this.entityList[i].infoModel.handle);
        }

        let count: number = this.listCount[entity.team] || 0;
        this.listCount[entity.team] = --count;

        if (entity instanceof CharMonster) {
            entity.stopMove();//修复在野外寻怪走路过程中切换场景 场景镜头显示位置不对的bug
            entity.removeAllFilters();
        }
        egret.Tween.removeTweens(entity);

        if (removeDisplay) {
            DisplaySYBUtils.removeFromParent(entity);

            entity.destroy();

        }
        if (entity.type == EntitySYBType.Monster || entity.team == Team.Monster) {
            RoleSYBAI.ins().removeMonster(entity);
        } else if (entity == EntitySYBType.Role || entity.team == Team.My) {
            RoleSYBAI.ins().removeRole(entity);
        }
        // if ((GameSYBMap.sceneInMain() || GameSYBMap.fbType == UserFb.FB_TYPE_EXP) && entity.infoModel.type == EntitySYBType.Monster && expEffect) {
        //     GameSYBLogic.ins().postExpMc(entity);
        // }


        return entity;
    }

    public getEntityByHandle(handle) {
        return this.entityList[handle];
    }



    private _sortHpMin(a: CharMonster, b: CharMonster): number {
        return a.getMaxHp() - b.getMaxHp();
    }

    private _sortAtkMax(a: CharMonster, b: CharMonster): number {
        return b.getMaxAtk() - a.getMaxAtk();
    }


    private sortFunc(a: { priority: number, target: egret.DisplayObject }, b: { priority: number, target: egret.DisplayObject }): number {
        if (a.priority > b.priority)
            return 1;
        if (a.priority < b.priority)
            return -1;
        return 0;
    }

}