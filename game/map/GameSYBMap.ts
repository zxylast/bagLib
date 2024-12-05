/**
 *
 * 地图网格辅助类
 */
class GameSYBMap {

	/** 当前地图格子大小 */
	public static CELL_SIZE: number;
	/** 当前地图最大宽度 */
	public static MAX_WIDTH: number;
	/** 当前地图最大高度 */
	public static MAX_HEIGHT: number;
	public static COL: number;
	public static ROW: number;

	/** 格子数据 */
	private static grid: MapSYBGrid;

	/** 地图mData文件包 */
	private static mapZip: Map<MapSYBInfo>;

	/** 副本id */
	private static _fubenID: number = 0;
	/** 地图id */
	public static mapID: number;

	public static mapX: number;
	public static mapY: number;
	/**副本类型,对应fbMgr中的FB开头的枚举 */
	public static _fbType: number = 1;

	public static fbName: string;
	public static fbDesc: string;
	/**副本战斗类型 (1: pvp 0: pve) */
	public static fbCombatType: number;

	public static inited: boolean = false;

	/** 初始化 */
	static init(data: Map<MapSYBInfo>): void {
		this.grid = this.grid || new MapSYBGrid;

		//this.mapZip = data;

		//用屏幕大小定义地图
		let mapInfo = this.createMap();
		this.grid.initMapInfo(mapInfo, 0);
		this.inited = true;


	}

	/** 更新数据 */
	static update(): void {
	}

	/**
	 * 移动实体
	 * @param entity
	 * @param endX
	 * @param endY
	 */
	static moveEntity(entity: CharMonster, endX: number, endY: number, isStraightLine: boolean = false): void {

		let size: number = GameSYBMap.CELL_SIZE;

		let sx: number = Math.floor(entity.x / size);
		//let sy: number = Math.floor(entity.y / size);
		let tx: number = Math.floor(endX / size);
		//let ty: number = Math.floor(endY / size);

		let path: AStarSYBNode[];

		if (isStraightLine) {
			path = [new AStarSYBNode(endX, endY, DirSYBUtil.get2DirBy2Point({ x: entity.x, y: entity.y }, {
				x: endX,
				y: endY
			}))];
		}
		// else if (sx == tx && sy == ty)
		// 	path = [new AStarSYBNode(tx, ty, DirSYBUtil.get8DirBy2Point({ x: entity.x, y: entity.y }, {
		// 		x: endX,
		// 		y: endY
		// 	}))];
		// else {
		// 	path = this.aStar.getPath(sx, sy, tx, ty);
		// 	if (!path) {
		// 		// Assert(false, `寻路异常，mapId:${GameSYBMap.mapID},fbid:${GameSYBMap.fubenID},fbType:${GameSYBMap.fbType},sx:${sx},sy:${sy},tx:${tx},ty:${ty}`);
		// 		return;
		// 	}
		// }

		GameSYBLogic.ins().postMoveEntity(entity, path, !isStraightLine);

	}

	/**
	 * 获取一个路径参数为网格坐标
	 * @param fromX
	 * @param fromY
	 * @param targetX
	 * @param targetY
	 */
	// static getPatch(fromX: number, fromY: number, targetX: number, targetY: number): any {
	// 	let path: AStarSYBNode[] = this.aStar.getPath(fromX, fromY, targetX, targetY);
	// 	return path;
	// }

	/**
	 * 全体人员去到某个点
	 * @param tx
	 * @param ty
	 * @param fun
	 * @param funThis
	 */
	static myMoveTo(tx: number, ty: number, fun: Function, funThis?: any): void {
		// let len: number = SubRoles.ins().subRolesLen;
		// let char: CharRole;
		// for (let i: number = 0; i < len; i++) {
		// 	char = EntitySYBManager.ins().getMainRole(i);
		// 	if (char)
		// 		this.moveEntity(char, tx, ty);
		// }

		// let tempFunc: Function = function () {
		// 	let isCom: boolean = true;
		// 	for (let i: number = 0; i < len; i++) {

		// 		char = EntitySYBManager.ins().getMainRole(i);
		// 		if (char && char.action == EntityAction.RUN) {
		// 			if (MathSYBUtils.getDistance(char.x, char.y, tx, ty) < 100) {
		// 				char.stopMove();
		// 				char.playAction(EntityAction.STAND);
		// 			}
		// 			isCom = false;
		// 		}
		// 	}
		// 	if (isCom) {
		// 		TimerSYBManager.ins().remove(tempFunc, this);
		// 		fun && fun.call(funThis);
		// 	}
		// };

		//TimerSYBManager.ins().doTimer(500, 0, tempFunc, this);
	}

	//最后一个点是随机坐标
	static moveTo(endX: number, endY: number) {
		let size: number = GameSYBMap.CELL_SIZE;
		let tx: number = Math.floor(endX / size);
		let ty: number = Math.floor(endY / size);

		// if (SysSetting.ins().getValue("mapClickTx") == tx && SysSetting.ins().getValue("mapClickTy") == ty) {
		// 	return false;
		// }
		//
		// SysSetting.ins().setValue("mapClickTx", tx);
		// SysSetting.ins().setValue("mapClickTy", ty);

		if (!this.checkWalkable(tx, ty)) {
			return false;
		}
		// let role = EntitySYBManager.ins().getNoDieRole();
		// if (!role) {
		// 	return false;
		// }
		// //如果被麻痹，也不可移动
		// if (role.hasFilter(EntityFilter.hard)) {
		// 	return false;
		// }


		// let sx: number = Math.floor(role.x / size);
		// let sy: number = Math.floor(role.y / size);
		// let path = this.aStar.getPath(sx, sy, tx, ty);
		// if (!path || path.length == 0) {
		// 	return false;
		// }
		// let lastNode: AStarSYBNode = path[0];
		// lastNode.nX = endX;
		// lastNode.nY = endY;
		//GameSYBLogic.ins().sendFindPathToServer(role.infoModel.handle, path, false);
		return true;
	}


	/** 检查是否不可移动 */
	static checkWalkable(x: number, y: number): boolean {
		let rtn = false;
		let node: MapGridSYBNode = this.grid.getNode(x, y);
		if (!node) {
			(debug.log("地图:" + this.mapID + "副本:" + this._fubenID + "坐标:" + x + "," + y + "出现问题!"));
		} else {
			rtn = node.walkable;
		}
		return rtn;
	}

	/** 检查是否需要透明 */
	static checkAlpha(x: number, y: number): boolean {
		let rtn = false;
		let node: MapGridSYBNode = this.grid.getNode(x, y);
		if (!node) {
			(debug.log("地图:" + this.mapID + "副本:" + this._fubenID + "坐标:" + x + "," + y + "出现问题!"));
		} else {
			rtn = node.hidden;
		}
		return rtn;

	}

	public static lastFbTyp: number = 0;
	public static lastFbId: number = 0;

	public static parser(bytes: GameByteSYBArray, fbId: number = 0): void {
		this.lastFbId = this.fubenID;
		if (fbId == 0) {
			this.fubenID = bytes.readInt();
		} else {
			this.fubenID = fbId;
		}
		this.lastFbTyp = this.fbType;
		// let fbConfig = GlobalConfig.InstanceConfig[this.fubenID];
		// this.fbType = fbConfig.type;
		// this.fbName = fbConfig.name;
		// this.fbDesc = fbConfig.desc;
		// this.fbCombatType = fbConfig.fbCombatType ? fbConfig.fbCombatType : 0;

		//用屏幕大小定义地图
		let mapInfo = this.createMap();
		this.grid.initMapInfo(mapInfo, 0);

	}

	private static createMap(): MapSYBInfo {
		let map: MapSYBInfo = ObjectPool.pop("BaseMapSYBInfo");

		//用屏幕大小定义地图
		this.CELL_SIZE = map.title_wh = 60;
		this.MAX_HEIGHT = map.pixHeight = StageSYBUtils.ins().getHeight();
		this.MAX_WIDTH = map.pixWidth = StageSYBUtils.ins().getWidth();
		this.COL = map.maxX = StageSYBUtils.ins().getWidth() / this.CELL_SIZE;
		this.ROW = map.maxY = StageSYBUtils.ins().getHeight() / this.CELL_SIZE;
		map.grids = [];
		for (let i = 0; i < this.ROW; i++) {
			for (let j = 0; j < this.COL; j++) {
				map.grids.push(1);
			}
		}

		return map;
	}


	public static get fubenID(): number {
		return this._fubenID;
	}

	public static set fubenID(value: number) {
		this._fubenID = value;

	}

	public static get fbType(): number {
		return this._fbType;
	}

	public static set fbType(value: number) {
		this._fbType = value;

	}

	//是否在主场景
	public static sceneInMain(): boolean {
		return GameSYBMap.fbType == 0 && GameSYBMap.fubenID == 0;
	}

	public static canStartAI(): boolean {
		return GameSYBMap.fbType == 0;
	}

	// public static getFileName(): string {
	// 	return GlobalConfig.ScenesConfig[this.mapID].mapfilename;
	// }

	public static getTurn(): number {
		// return GlobalConfig.ScenesConfig[this.mapID].turn;
		return 0;
	}

	/** 获取相对于目标的坐标矩形 */
	static getRectangle(target: CharMonster, x: number, y: number): egret.Rectangle {
		let _x = target.x + (x - 0.5) * GameSYBMap.CELL_SIZE;
		let _y = target.y + (y - 0.5) * GameSYBMap.CELL_SIZE;
		return new egret.Rectangle(_x, _y, GameSYBMap.CELL_SIZE, GameSYBMap.CELL_SIZE);
	}

	/**
	 * 获取坐标内的怪物列表
	 */
	static getIncludeElement(target: CharMonster, points: egret.Point[], charList: CharMonster[]): CharMonster[] {
		let list: CharMonster[] = [];
		for (let k in points) {
			let re = GameSYBMap.getRectangle(target, points[k].x, points[k].y);
			for (let p in charList) {
				let char = charList[p];
				if (char.x >= re.x && char.y >= re.y && char.x < re.x + re.width && char.y < re.y + re.height) {
					list.push(char);
				}
			}
		}
		return list;
	}

	/**
	 * 通过下标及长宽获取相对坐标
	 * @param index
	 * @param w
	 * @param h
	 * @returns {egret.Point}
	 */
	static getPoint(index: number, w: number, h: number): egret.Point {
		let y = Math.floor(index / w) - Math.floor(h / 2);
		let x = Math.floor(index % w) - Math.floor(w / 2);
		return new egret.Point(x, y);
	}

	/**
	 * 获取目标的下标
	 * @param sour
	 * @param target
	 * @param width
	 * @param height
	 * @returns {number}
	 */
	static getTargetIndex(sour: CharMonster, target: CharMonster, width: number, height: number): number {
		let aX = target.x - sour.x + GameSYBMap.CELL_SIZE * (width / 2);
		let aY = target.y - sour.y + GameSYBMap.CELL_SIZE * (height / 2);
		let x = Math.floor(aX / GameSYBMap.CELL_SIZE);
		let y = Math.floor(aY / GameSYBMap.CELL_SIZE);
		return width * y + x;
	}

	/** 检查是否不可移动 ,参数为像素点*/
	static checkWalkableByPixel(x: number, y: number): boolean {
		let mapX: number = Math.floor(x / GameSYBMap.CELL_SIZE);
		let mapY: number = Math.floor(y / GameSYBMap.CELL_SIZE);
		return GameSYBMap.checkWalkable(mapX, mapY);
	}

	/**
	 * 返回随机一个在>=range范围的格子
	 * @param px 格子x
	 * @param py 格子y
	 * @param range 多少格子范围外的
	 * @returns {any}
	 */
	static getPosRange(px, py, range: number) {

		let _x = MathSYBUtils.limitInteger(-range, +range);
		let _y = MathSYBUtils.limitInteger(-range, +range);
		if (+_x != +range) {
			_y = Math.random() < 0.5 ? -range : range;
		}

		let count = 0;
		let i = _x, j = _y;
		while (true) {
			let walk: boolean = GameSYBMap.checkWalkable(px + i, py + j);
			if (walk) {
				return [px + i, py + j];
			}
			//格子顺时针检查
			if (i == range && j < range) { //右
				j += 1;
			} else if (j == range && i > -range) { //下
				i -= 1;
			} else if (i == -range && j > -range) { //左
				j -= 1;
			} else if (j == -range && i < range) { //上
				i += 1;
			}
			if (i == _x && j == _y) { //回到最初的格子则向外加一个格子
				if (_x == range) {
					i = _x = range + 1;
				}
				if (_x == -range) {
					i = _x = -range - 1;
				}
				if (_y == range) {
					j = _y = range + 1;
				}
				if (_y == -range) {
					j = _y = -range - 1;
				}
				range += 1;
			}
			count += 1;
			if (count > 100) {
				break;
			}
		}
		return [px, py];
	}

	//获取当前方向（dir）距离（px,py） （range）个格子的 格子
	static getPosRangeByDir(px, py, dir: number, range: number) {
		let _px = px, _py = py;
		if ((dir >= 0 && dir <= 1) || dir == 7) {
			_py -= range;
		}
		if (dir >= 3 && dir <= 5) {
			_py += range;
		}
		if (dir >= 1 && dir <= 3) {
			_px += range;
		}
		if (dir >= 5 && dir <= 7) {
			_px -= range;
		}
		return [_px, _py, GameSYBMap.checkWalkable(_px, _py)];
	}

	/**
	 * 获取目标点到方向格子的格子
	 * @param x 目标点
	 * @param y 目标点
	 * @param dir 目标点（x,y)到当前点（需要求的）的方向
	 * @returns {any[]}
	 */
	static getPosRangeRandom(x, y, dir: number, range: number = 1) {
		let px = GameSYBMap.point2Grip(x);
		let py = GameSYBMap.point2Grip(y);

		let arr = [dir];

		let random = Math.random();
		if (random > 0.66) { //-1
			dir = dir - 1 < 0 ? 7 : dir - 1;
			arr.unshift(dir);
			if (random > 0.8) {
				arr.push((dir + 2) % 8);
			} else {
				arr.splice(1, 0, (dir + 2) % 8);
			}
		} else if (random > 0.33) { //+1
			dir = dir + 1 > 7 ? 0 : dir + 1;
			arr.unshift(dir);
			if (random > 0.5) {
				arr.push((dir - 2 + 8) % 8);
			} else {
				arr.splice(1, 0, (dir - 2 + 8) % 8);
			}
		}

		let isGetPoint = false;
		let pos;
		for (let i = 0; i < arr.length; i++) {
			pos = GameSYBMap.getPosRangeByDir(px, py, arr[i], range);
			if (pos[2]) {
				isGetPoint = true;
				break;
			}
		}
		if (!isGetPoint) {
			pos = GameSYBMap.getPosRange(px, py, range);
		}

		return pos;
	}

	static point2Grip(x) {
		return Math.floor(x / GameSYBMap.CELL_SIZE);
	}

	static grip2Point(px) {
		return px * GameSYBMap.CELL_SIZE + (GameSYBMap.CELL_SIZE >> 1);
	}
}