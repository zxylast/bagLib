class DrawSYBLine extends egret.Shape {
	private mIsDown: boolean;
	private mPoints: Array<Object> = [];
	private mGraph: egret.Graphics;
	private mSize: number = 4;
	private mColor: number = 0;
	private mSizeOff: number = 0.3;
	//private alpha: number = 1;                            //线段alpha
	private CapsStyle: string = egret.CapsStyle.ROUND;  //线段端点样式
	private JointStyle: string = egret.JointStyle.BEVEL;  //链接点样式

	// private thickNess: number = 15;                       //线段粗细
	private lineHasDraw: boolean = false;

	private harm: boolean = false;


	public constructor(_size: number = 4, _color: number = 0xff0000, _sizeOff: number = 0.3, harm: boolean = false) {
		super();
		this.mSize = _size;
		this.mColor = _color;
		this.mSizeOff = _sizeOff;
		this.mGraph = this.graphics;
		this.harm = harm;
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onStageHandler, this);
	}
	private onStageHandler(e: egret.Event) {
		this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onStageHandler, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginHandler, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveHandler, this);
		this.stage.addEventListener(egret.Event.ENTER_FRAME, this.onRenderHandler, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndHandler, this);
	}
	private onTouchBeginHandler(e: egret.TouchEvent) {
		if (ViewSYBManager.ins().hasFunView() || this.mIsDown) {
			this.lineHasDraw = true;
			return;
		}

		this.mIsDown = true;
		this.mPoints.push({ x: e.stageX, y: e.stageY, s: this.mSize });
	}
	private onTouchMoveHandler(e: egret.TouchEvent) {

		if (!this.lineHasDraw && this.mIsDown) {
			this.mPoints.push({ x: e.stageX, y: e.stageY, s: this.mSize });
			if (this.harm ) {
				this.checkCollision(e.stageX, e.stageY);
			}
		}
	}

	private onTouchEndHandler(e: egret.TouchEvent) {
		this.lineHasDraw = false;
		this.mIsDown = false;
		this.mPoints = [];
		TimerSYBManager.ins().remove(this.isCuttingTimer, this);
		TimerSYBManager.ins().doTimer(2000, 1, this.isCuttingTimer, this);

	}

	private isCuttingTimer(): void {
		TimerSYBManager.ins().remove(this.isCuttingTimer, this);
	}

	private checkCollision(stageX: number, stageY: number): void {
		/*** 本示例关键代码段开始 ***/
		// let list = EntitySYBManager.ins().getAllEntity();
		// for (let i in list) {
		// 	let tmp: CharMonster = list[i];
		// 	var bResult: boolean = tmp.hitTestPoint(stageX, stageY, SYwxSpecial ? false : true);
		// 	if (bResult && !tmp.isMy) {
		// 		//造成全体伤害
		// 		// if (GameSYBLogic.ins().hitCount == 20 || (GameSYBLogic.ins().hitCount > 0 && (GameSYBLogic.ins().hitCount % 50) == 0)) {
		// 		// 	GameSYBLogic.ins().setDamageMonsterAll(0, -50);
		// 		// } else {
		// 		// 	GameSYBLogic.ins().clickHarm(tmp, 'skill7022', 0, -50);
		// 		// }

		// 		// GameSYBLogic.ins().stillHarm = true;
		// 		// TimerSYBManager.ins().doTimer(125, 1, () => { GameSYBLogic.ins().stillHarm = false; }, this);
		// 		// TimerSYBManager.ins().remove(GameSYBLogic.ins().cleanHit, GameSYBLogic.ins());
		// 		// TimerSYBManager.ins().doTimer(1000, 0, GameSYBLogic.ins().cleanHit, GameSYBLogic.ins());

		// 	}
		// }

	}

	// private cleanHit(): void {
	// 	if (!GameSYBLogic.ins().stillHarm ) {
	// 		GameSYBLogic.ins().hitCount = 0;
	// 		GameSYBLogic.ins().postHitCount();
	// 		TimerSYBManager.ins().remove(this.cleanHit, this)
	// 	}
	// }

	private onRenderHandler(e: egret.Event) {
		if (this.lineHasDraw) {
			return;
		}
		this.mGraph.clear();
		let _count: number = this.mPoints.length;
		if (_count) {
			// for (let i: number = 0; i < _count; i++) {
			// 	let _config: Object = this.mPoints[i];
			// 	_config["s"] -= this.mSizeOff;
			// 	if (_config["s"] <= 0) {
			// 		this.mPoints.splice(i, 1);
			// 		i--;
			// 		_count--;
			// 	}
			// }
			_count = this.mPoints.length;
			let midIndex: number = _count * 3 / 7;        //线段中间最粗的位置
			let rate = this.mSize / midIndex;   //线段的粗细变化值
			// for (let i: number = 1; i < _count; i++) {
			// 	let p = this.mPoints[i];
			// 	let prePoint = this.mPoints[i - 1];
			// 	this.mGraph.lineStyle(p["s"], this.mColor, 1, true, null, this.CapsStyle, this.JointStyle);
			// 	this.mGraph.moveTo(prePoint["x"], prePoint["y"]);
			// 	this.mGraph.lineTo(p["x"], p["y"]);
			// }
			let less = this.harm ? 1 : 3;

			//绘制第二段，终点到中间，由细变粗
			rate = this.mSize / (_count - midIndex);
			let j = 0;
			for (let i = _count - less; i >= midIndex; i--) {
				j++;

				let p = this.mPoints[i];
				let prePoint = this.mPoints[i - 1];

				this.mGraph.lineStyle(rate * j, this.mColor, 1, true, null, this.CapsStyle, this.JointStyle);
				this.mGraph.moveTo(prePoint["x"], prePoint["y"]);
				this.mGraph.lineTo(p["x"], p["y"]);

			}

			//绘制第一段，起点到中间，由细变粗
			for (let i = 1; i < midIndex; i++) {

				let p = this.mPoints[i];
				let prePoint = this.mPoints[i - 1];

				this.mGraph.lineStyle(rate * i, this.mColor, 1, true, null, this.CapsStyle, this.JointStyle);
				this.mGraph.moveTo(prePoint["x"], prePoint["y"]);
				this.mGraph.lineTo(p["x"], p["y"]);

			}



			//删除生命周期结束的线。当线段数量<15时，只删除2个；当线段数量>=15时，删除2分之一的线段

			if (_count < 15) {
				for (let i = 0; i < 2; i++) {

					let _config: Object = this.mPoints[i];
					if (_config) {
						_config["s"] -= this.mSizeOff;
						if (_config["s"] <= 0) {
							this.mPoints.splice(i, 1);
							i--;
							_count--;
						}
					}
				}
			} else {
				_count = _count * 3 / 4;
				for (let i = 0; i < _count; i++) {
					let _config: Object = this.mPoints[i];
					if (_config) {
						_config["s"] -= this.mSizeOff;
						if (_config["s"] <= 0) {
							this.mPoints.splice(i, 1);
							i--;
							_count--;
						}
					}
				}
			}
		}
	}


}