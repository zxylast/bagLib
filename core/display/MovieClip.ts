/**
 *  动画类
 * @author
 */
class MovieSYClip extends egret.MovieClip {

	/** 原始帧频 */
	private static originalRate: any = {};

	/** 动画数据工厂类 */
	private _mcFactory: egret.MovieClipDataFactory;

	/** 播放次数 */
	public playCount: number;
	/** 播放完的回调函数 */
	public _compFun: () => void;
	/** 是否自动删除 */
	public remove: boolean;

	private jsonData: any;
	private texture: egret.Texture;

	private time: number;
	/**倍率 ,越大越快*/
	public rate: number = 1;

	public pixelHitTest: boolean = false;

	/**是否播放完成 */
	public isCompleted: boolean = true;

	public constructor() {
		super();
		this._mcFactory = new egret.MovieClipDataFactory();

		this.$hitTest = function (stageX: number, stageY: number): egret.DisplayObject {
			let values = this.$DisplayObject;
			if (!values) {
				return null;
			}
			if (!this.$renderNode || !this.$visible || values[0] == 0 || values[1] == 0) {
				return null;
			}
			let m = this.$getInvertedConcatenatedMatrix();
			if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {//防止父类影响子类
				return null;
			}
			let bounds = this.$getContentBounds();
			let localX = m.a * stageX + m.c * stageY + m.tx;
			let localY = m.b * stageX + m.d * stageY + m.ty;
			if (bounds.contains(localX, localY)) {
				if (!this.$children) {//容器已经检查过scrollRect和mask，避免重复对遮罩进行碰撞。

					let rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
					if (rect && !rect.contains(localX, localY)) {
						return null;
					}
					if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
						return null;
					}
					if (this.pixelHitTest && this instanceof MovieSYClip && !this.hitTestPoint(stageX, stageY, true)) {
						return null;
					}
				}
				return this;
			}
			return null;
		};
	}

	public playFile(name: string, playCount: number = 1, compFun: () => void = null, remove: boolean = true): void {
		if (!name || name.substring(name.length - 1, name.length) == "/") {
			return;
		}
		this.isCompleted = false;
		this.time = egret.getTimer();

		this._compFun = compFun;
		this.playCount = playCount;
		this.remove = remove;

		TimerSYBManager.ins().remove(this.playComp, this);

		if (this.texture && this.texture.bitmapData == null) {
			//资源已经被释放掉
		} else if (this.name == name) {
			this.createBody();
			return;
		}

		this.name = name;

		if (this.texture) {
			MovieSYClip.removeDisplayObject(this, this.texture.bitmapData);
		}

		this.jsonData = null;
		this.texture = null;

		RES.getResByUrl(this.name + ".json", (data, url) => {
			if (this.name + ".json" != url || !data) {
				return;
			}
			this.jsonData = data;
			this.createBody();
		}, this, RES.ResourceItem.TYPE_JSON);

		RES.getResByUrl(this.name + ".png", (data, url) => {
			if (this.name + ".png" != url || !data) {
				return;
			}
			this.texture = data;
			if (this.stage) {
				MovieSYClip.addDisplayObject(this, this.texture.bitmapData);
			}
			this.createBody();
		}, this, RES.ResourceItem.TYPE_IMAGE);
	}

	/**
	 * @private
	 * 显示对象添加到舞台
	 */
	$onAddToStage(stage: egret.Stage, nestLevel: number): void {
		super.$onAddToStage(stage, nestLevel);
		if (this.texture) {
			MovieSYClip.addDisplayObject(this, this.texture.bitmapData);
		}
	}

	/**
	 * @private
	 * 显示对象从舞台移除
	 */
	$onRemoveFromStage(): void {
		super.$onRemoveFromStage();
		if (this.texture) {
			MovieSYClip.removeDisplayObject(this, this.texture.bitmapData);
		}
	}

	/**
	 * 创建主体动画
	 */
	private createBody(): void {
		if (!this.jsonData || !this.texture) {
			return;
		}
		this._mcFactory.clearCache();
		this._mcFactory.mcDataSet = this.jsonData;
		this._mcFactory.texture = this.texture;

		let temp = this.name.split("/");
		let tempName = temp.pop();

		this.movieClipData = this._mcFactory.generateMovieClipData(tempName);

		if (!(this.name in MovieSYClip.originalRate)) {
			MovieSYClip.originalRate[this.name] = this.movieClipData.frameRate;
		}
		this.frameRate = (MovieSYClip.originalRate[this.name] * this.rate) >> 0;

		//从第一帧开始自动播放
		this.gotoAndPlay(1, this.playCount);

		this.visible = true;

		if (this.playCount > 0) {
			let tempTime = egret.getTimer() - this.time;
			tempTime = this.playTime * this.playCount - tempTime;
			if (tempTime > 0) {
				TimerSYBManager.ins().doTimer(tempTime, 1, this.playComp, this);
			} else {
				this.playComp();
			}
		}
		//抛出内容已经改变事件
		this.dispatchEventWith(egret.Event.CHANGE);
	}

	/**
	 * 自动播放次数完成处理
	 * @param e
	 */
	private playComp(): void {
		if (this.stage && this._compFun) {
			this._compFun();
		}
		if (this.remove) {
			// if (DragonBones.ins().getSYWeChat()) DragonBones.ins().destroy(this['uid']);
			DisplaySYBUtils.removeFromParent(this);
		}
		if (this.texture) {
			MovieSYClip.removeDisplayObject(this, this.texture.bitmapData);
		}
		this.isCompleted = true;
	}

	/** 播放总时长(毫秒) */
	private get playTime(): number {
		if (!this.movieClipData) {
			return 0;
		}
		return 1 / this.frameRate * this.totalFrames * 1000;
	}

	public clearComFun() {
		this._compFun = null;
	}

	//释放
	public dispose() {
		this.stop();
		this.resetMovieClip();
		this.clearComFun();
		TimerSYBManager.ins().removeAll(this);
	}

	//回收
	public destroy() {
		DisplaySYBUtils.removeFromParent(this);
		this.dispose();
		ObjectPool.push(this);
	}

	private resetMovieClip() {
		let mc = this;
		mc.rotation = 0;
		mc.scaleX = 1;
		mc.scaleY = 1;
		mc.alpha = 1;
		mc.anchorOffsetX = 0;
		mc.anchorOffsetY = 0;
		mc.x = 0;
		mc.y = 0;

		mc.rate = 1;
		if (mc.$renderNode) {
			mc.$renderNode.cleanBeforeRender();
		}

		mc._mcFactory.clearCache();
		mc._mcFactory.mcDataSet = null;
		mc._mcFactory.texture = null;

		mc.name = null;
		mc.jsonData = null;
		mc.filters = null;

		let bitmapData = mc.texture;
		if (bitmapData) {
			MovieSYClip.removeDisplayObject(mc, bitmapData.bitmapData);
		}

		mc.texture = null;
		mc.remove = false;

		egret.Tween.removeTweens(mc);
	}

	static displayList = egret.createMap<egret.DisplayObject[]>();

	static addDisplayObject(displayObject: egret.DisplayObject, bitmapData: egret.BitmapData): void {
		if (!bitmapData) {
			return;
		}
		let hashCode = bitmapData.hashCode;
		if (!MovieSYClip.displayList[hashCode]) {
			MovieSYClip.displayList[hashCode] = [displayObject];
			return;
		}
		let tempList: Array<egret.DisplayObject> = MovieSYClip.displayList[hashCode];
		if (tempList.indexOf(displayObject) < 0) {
			tempList.push(displayObject);
		}
	}

	static removeDisplayObject(displayObject: egret.DisplayObject, bitmapData: egret.BitmapData): void {
		if (!bitmapData) {
			return;
		}
		let hashCode = bitmapData.hashCode;
		if (!MovieSYClip.displayList[hashCode]) {
			return;
		}
		let tempList: Array<egret.DisplayObject> = MovieSYClip.displayList[hashCode];
		let index: number = tempList.indexOf(displayObject);
		if (index >= 0) {
			tempList.splice(index, 1);
		}
		if (tempList.length == 0) {
			delete MovieSYClip.displayList[hashCode];
			ResourceSYBMgr.ins().disposeResTime(hashCode);
		}
	}
}