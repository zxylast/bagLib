/**
 * Created by hrz on 2017/8/8.
 *
 * 简单实体 仅仅包含特效（可包含武器翅膀等），头顶层
 */


class CharEffect extends egret.DisplayObjectContainer {
	/** 形象主体 */
	protected _body: MovieSYClip | dragonBones.EgretArmatureDisplay;
	/** 中间容器 */
	protected _bodyContainer: egret.DisplayObjectContainer;
	protected _bottomImage: eui.Image;
	protected titleCantainer: egret.DisplayObjectContainer;

	public myHeight: number = EntitySYBManager.CHAR_DEFAULT_HEIGHT;
	public typeface: number = EntitySYBManager.CHAR_DEFAULT_TYPEFACE;

	//显示对象数组,包括身体,武器,翅膀和影子
	protected _disOrder: { [key: number]: egret.DisplayObject };
	//特效名字表
	protected _mcFileName: { [key: number]: string };

	/** 方向（默认向右） */
	protected _dir: number = 0;
	/** 状态（默认stand） */
	protected _state: EntityAction = EntityAction.STAND;

	protected _infoModel: EffectModel;

	protected playComplete: () => void;

	protected shadow: eui.Image;

	/**不同方向的身体显示对象显示顺序 */
	public static FRAME_ODER: number[][] = [
		// [CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.BODY, CharMcOrder.WING, CharMcOrder.ZHANLING],//上
		// [CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.WING, CharMcOrder.ZHANLING],//右上
		[CharMcOrder.BODY, CharMcOrder.YB],//右
		// [CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.ZHANLING],//右下
		// [CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.ZHANLING],//下
		// [CharMcOrder.WING, CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.ZHANLING],//左下
		[CharMcOrder.BODY, CharMcOrder.YB],//左
		//[CharMcOrder.BODY, CharMcOrder.WEAPON, CharMcOrder.SOUL, CharMcOrder.WING, CharMcOrder.ZHANLING],//左上
	];

	public static ACTION_ODER: { [id: number]: EntityAction[] } = {
		8: [EntityAction.STAND, EntityAction.RUN, EntityAction.ATTACK],
	}

	/** 有方向的特效*/
	public hasDir: CharMcOrder[] = [CharMcOrder.BODY, CharMcOrder.YB];

	public constructor() {
		super();

		this._disOrder = {};
		this._mcFileName = {};

		this._bottomImage = new eui.Image();
		this._bottomImage.source = "juese_di_png";
		// this._bottomImage.scaleX = this._bottomImage.scaleY = 0.8;
		this._bottomImage.anchorOffsetX = 62;
		this._bottomImage.anchorOffsetY = -48;
		// if (GameSYBMap.fbType == FbType.type0 || !BattleCC.ins().getShowScene()) {
		// 	this._bottomImage.scaleX = this._bottomImage.scaleY = 0.6;
		// 	this._bottomImage.x = 5;
		// 	this._bottomImage.y = 30;
		// } else {
		// 	this._bottomImage.scaleX = this._bottomImage.scaleY = 1;
		// 	this._bottomImage.x = this._bottomImage.y = 0;
		// }
		this.addChild(this._bottomImage);

		this._bodyContainer = new egret.DisplayObjectContainer();
		this.addChild(this._bodyContainer);

		//if (DragonBones.ins().getSYWeChat()) {
			this._body = ObjectPool.pop(`MovieSYClip`);
			this._body.width = 0;
			this._body.height = 0;
			this._body.y = -90;
			this._bodyContainer.width = 0;
			this._bodyContainer.height = 0;
		// } else {
		// 	this._body = ObjectPool.pop(`dragonBones.EgretArmatureDisplay`);
		// 	this._body.y = 0;
		// }
		this._bodyContainer.addChild(this._body);
		this._bodyContainer.y = 70;
		this._disOrder[CharMcOrder.BODY] = this._body;
		// this._bodyContainer.scaleX = this._bodyContainer.scaleY = 1.2;
		this.titleCantainer = new egret.DisplayObjectContainer;
		this.titleCantainer.anchorOffsetY = this.myHeight;
		this.addChild(this.titleCantainer);

	}

	public setBodyScale(value: number): void {
		this._bodyContainer.scaleX = this._bodyContainer.scaleY = value;
		// this.myHeight = this.myHeight * value;
		// this.typeface *= value;
		// this.titleCantainer.anchorOffsetY = Math.floor(this.myHeight);
	}

	set infoModel(model: EffectModel) {
		this._infoModel = model;
	}

	get infoModel(): EffectModel {
		return this._infoModel;
	}

	public setConfig(avatar: string) {
		// let config: MonstershpConfig = GlobalConfig.MonstershpConfig[avatar];
		// if (config) {
		// 	this.myHeight = config.hp;
		// 	this.typeface = config.hp;
		// } else {
		// 	this.myHeight = EntitySYBManager.CHAR_DEFAULT_HEIGHT;
		// 	this.typeface = EntitySYBManager.CHAR_DEFAULT_TYPEFACE;
		// }
		// this.titleCantainer.anchorOffsetY = Math.floor(this.myHeight);
	}

	public updateModel() {

	}

	public get dir(): number {
		return this._dir;
	}

	public set dir(value: number) {
		if (this._dir == value)
			return;
		this._dir = value;
		this.loadBody();
	}

	/**
	 * 播放动作
	 * @action    动作常量EntityAction.ts
	 */
	public playAction(action: EntityAction, callBack?: () => void, frameRate?: number): void {
		this._state = action;
		this.playComplete = callBack;
		if (this._body instanceof MovieSYClip) {
			this._body.clearComFun();
			if (frameRate) {
				this._body.rate = frameRate;
			}
			else {
				this._body.rate = 1;
			}
		} else {
			if (frameRate > 0 && this._body.armature != null) {
				this._body.animation.timeScale = frameRate;
			}
		}
		this.loadBody();
	}

	//加载身体模型
	protected loadBody(): void {
		if (this._body instanceof MovieSYClip) {
			this._body.stop();
		}
		this._body.addEventListener(egret.Event.CHANGE, this.playBody, this);

		if (this.hasDir.indexOf(CharMcOrder.BODY) >= 0) {
			this.loadFile(this._body, this.getFileName(CharMcOrder.BODY), CharMcOrder.BODY);
		} else {
			if (this._body instanceof MovieSYClip) {
				this.playFile(this._body, this.getFileName(CharMcOrder.BODY));
			} else {
				this.playFileDragonBones(this._body, this.getFileName(CharMcOrder.BODY), CharMcOrder.BODY);
			}
		}
	}

	//加载其他模型 如武器翅膀
	protected loadOther(mcType: CharMcOrder): void {
		let mc = this.getMc(mcType) as MovieSYClip | dragonBones.EgretArmatureDisplay;
		if (!mc) return;
		if (mc instanceof MovieSYClip) {
			mc.stop();
		}
		mc.addEventListener(egret.Event.CHANGE, this.syncFrame, this);
		this.loadFile(mc, this.getFileName(mcType), mcType);
	}

	protected loadNoDir(mcType: CharMcOrder) {
		let mc = this.getMc(mcType) as MovieSYClip | dragonBones.EgretArmatureDisplay;
		if (mc instanceof MovieSYClip) {
			this.playFile(mc, this.getFileName(mcType));
		} else {
			this.playFileDragonBones(mc, this.getFileName(mcType), mcType);
		}
	}

	protected getFileName(mcType: CharMcOrder): string {
		return this._mcFileName[mcType];
	}

	protected playFile(mc: MovieSYClip, fileName: string) {
		mc.playFile(fileName, -1, null, false);
	}

	protected playFileDragonBones(mc: dragonBones.EgretArmatureDisplay, fileName: string, mcType: CharMcOrder) {
		let atkBool = this._state == EntityAction.ATTACK;
		let runBool = this._state == EntityAction.RUN;
		let standBool = this._state == EntityAction.STAND;
		if (!mc.armature || this._bodyContainer.numChildren <= 0) {
			let playState = runBool || standBool ? 0 : -1;
			// DragonBones.ins().getDragonBonesAdd(fileName, (this._state as string), playState, null, this.modelCall.bind(this, mcType, mc), null, 1);
		} else {
			mc.animation.reset();
			if (!runBool) {
				if (standBool) {
					mc.animation.play((this._state as string), 0);
				} else {
					let num = this._state == EntityAction.HIT ? -1 : 1;
					mc.animation.play((this._state as string), num);
				}
			} else {
				mc.animation.play(EntityAction.RUN, 0);
			}
			// mc.animation.timeScale = BattleCC.ins().getShowScene() ? BattleCC.ins().speed : atkBool ? 2 : 1;
		}
		if (this.playComplete) {
			this.playComplete();
		}
	}

	/**模型加载回调 */
	private modelCall(mcType: CharMcOrder, mc: dragonBones.EgretArmatureDisplay, model: dragonBones.EgretArmatureDisplay): void {
		if (model) {
			model.scaleX = mc.scaleX;
			model.scaleY = mc.scaleY;
			// let timeScale = mc.armature != null ? mc.animation.timeScale : BattleCC.ins().speed;
			// model.animation.timeScale = BattleCC.ins().getShowScene() ? timeScale : 1;
			// DragonBones.ins().removeEffModel(this._body['uid']);
			this._body = model;
			this._disOrder[mcType] = this._body;
			this._bodyContainer.removeChildren();
			this._bodyContainer.addChild(this._body);
			this._bodyContainer.alpha = 1;
			this._bodyContainer.y = 70;
		}
	}

	protected loadFile(mc: MovieSYClip | dragonBones.EgretArmatureDisplay, fileName: string, mcType: CharMcOrder): void {
		if (!fileName) return;

		// if (CharEffect.ACTION_ODER[mcType] && CharEffect.ACTION_ODER[mcType].indexOf(this._state) < 0)
		// 	return;

		//多方向时作翻转
		// let scale = GlobalConfig.MonstersConfig[this._infoModel.configID].scale;
		mc.scaleX = this.infoModel.dir > 0 ? -1 : 1;
		mc.scaleY = 1;
		if (mc instanceof MovieSYClip) {
			// mc.rate = BattleCC.ins().getShowScene() ? BattleCC.ins().speed : 1;
			let s: string = RES_DIR_BODY + fileName + "_" + this._state;
			mc.playFile(s, this.playCount(), this.playComplete, false);
		} else {
			this.playFileDragonBones(mc, fileName, mcType);
		}
		// if (this.playComplete) {
		// 	this.playComplete();
		// }
		// this._bodyContainer.anchorOffsetX = this._bodyContainer.width / 2;
		// this._bodyContainer.anchorOffsetY = this._bodyContainer.width;
	}

	protected playBody(e: egret.Event): void {
		let firstFrame: number = 1;

		if (this._body instanceof MovieSYClip) {
			this._body.gotoAndPlay(firstFrame, this.playCount());
		}
		this.removeBodyEvent(this._body);

		for (let mcType in this._disOrder) {
			let mc = this._disOrder[mcType];
			if (mc != this._body) {
				if (this.hasDir.indexOf(+(mcType)) >= 0 && (mc instanceof MovieSYClip || mc instanceof dragonBones.EgretArmatureDisplay)) {
					this.loadOther(+(mcType));
				}
			}
		}
		this.sortEffect();
		// this._bodyContainer.anchorOffsetX = this._bodyContainer.width / 2;
		// this._bodyContainer.anchorOffsetY = this._bodyContainer.height;
	}

	protected syncFrame(e: egret.Event): void {
		this.removeMcEvent(e.currentTarget);
		if (this._body instanceof MovieSYClip) {
			e.currentTarget.gotoAndPlay(this._body.currentFrame, this.playCount());
		}
	}

	protected removeBodyEvent(mc: MovieSYClip | dragonBones.EgretArmatureDisplay) {
		mc.removeEventListener(egret.Event.CHANGE, this.playBody, this);
	}

	protected removeMcEvent(mc: MovieSYClip | dragonBones.EgretArmatureDisplay) {
		mc.removeEventListener(egret.Event.CHANGE, this.syncFrame, this);
	}

	protected onImgLoaded(e: egret.Event) {
		let img: eui.Image = e.currentTarget;
		img.removeEventListener(egret.Event.COMPLETE, this.onImgLoaded, this);
		img.anchorOffsetX = img.width / 2;
		img.anchorOffsetY = img.height / 2;
	}

	protected playCount(): number {
		return -1;
	}

	public addMc(mcType: CharMcOrder, fileName: string, disType: number = 0): MovieSYClip | dragonBones.EgretArmatureDisplay | eui.Image {
		if (this._mcFileName[mcType] == fileName) return;
		this._mcFileName[mcType] = fileName;
		let mc = this._disOrder[mcType];
		if (!mc) {
			if (disType == 0) {
				//if (DragonBones.ins().getSYWeChat()) {
					mc = ObjectPool.pop(`MovieSYClip`);
					mc.y = -90;
				// } else {
				// 	this.loadBody();
				// 	return;
				// }
			} else {
				mc = new eui.Image();
			}
			this._bodyContainer.addChild(mc);
			this._disOrder[mcType] = mc;
		}
		if (mc instanceof MovieSYClip || mc instanceof dragonBones.EgretArmatureDisplay) {
			if (this.hasDir.indexOf(mcType) >= 0) {
				if (mc == this._body) {
					this.loadBody();
				} else {
					this.loadOther(mcType);
				}
			} else {
				this.loadNoDir(mcType);
			}
		} else {
			// DisplaySYBUtils.removeFromParent(this._body);
			(<eui.Image>mc).addEventListener(egret.Event.COMPLETE, this.onImgLoaded, this);
			if (disType == 2) {
				(<eui.Image>mc).source = fileName;
				(<eui.Image>mc).scaleX = -0.5;
				(<eui.Image>mc).scaleY = 0.5;
			} else if (disType == 3) {
				(<eui.Image>mc).source = fileName;
			} else {
				(<eui.Image>mc).source = RES_DIR_ITEM + fileName + '.png';
			}
			this._bodyContainer.y = 0;
		}
		this.sortEffect();
		return mc as any;
	}

	public removeMc(mcType: CharMcOrder) {
		// if (mcType == CharMcOrder.BODY) return;
		let mc = this._disOrder[mcType];
		if (mc) {
			if (mc instanceof MovieSYClip) {
				this.removeMcEvent(mc);
				mc.destroy();
				// DragonBones.ins().removeEffModel(mc['uid']);
				// DisplaySYBUtils.removeFromParent(mc);
			} else if (mc instanceof dragonBones.EgretArmatureDisplay) {
				this.removeMcEvent(mc);
				// DragonBones.ins().removeEffModel(mc['uid']);
			} else {
				DisplaySYBUtils.removeFromParent(mc);
			}
			this.resetBodyContainer();
			delete this._mcFileName[mcType];
			delete this._disOrder[mcType];
		}
	}

	public getMc(mcType: CharMcOrder): MovieSYClip | dragonBones.EgretArmatureDisplay | eui.Image {
		return this._disOrder[mcType] as any;
	}

	public removeAll() {
		for (let mcType in this._disOrder) {
			let mc = this._disOrder[mcType];
			if (mc != this._body) {
				if (mc instanceof MovieSYClip) {
					this.removeMcEvent(mc);
					mc.destroy();
					// DragonBones.ins().removeEffModel(mc['uid']);
				} else if (mc instanceof dragonBones.EgretArmatureDisplay) {
					this.removeMcEvent(mc);
					// DragonBones.ins().removeEffModel(mc['uid']);
				} else {
					DisplaySYBUtils.removeFromParent(mc);
				}
				delete this._mcFileName[mcType];
				delete this._disOrder[mcType];
			}
		}
		if (this._body instanceof MovieSYClip) {
			this._body.dispose();
		} else {
			// DragonBones.ins().removeEffModel(this._body['uid']);
			this._body = null;
			this._body = ObjectPool.pop(`dragonBones.EgretArmatureDisplay`);
		}
		this._body.dispose();
		this.removeBodyEvent(this._body);
		this.resetBodyContainer();
		delete this._mcFileName[CharMcOrder.BODY];
		//delete this._disOrder[CharMcOrder.BODY];
	}

	protected addShadow() {
		if (!this.shadow) {
			this.shadow = new eui.Image(RES_DIR + "yingzi.png");
			this.addChildAt(this.shadow, 0);
			this.shadow.anchorOffsetX = 57 >> 1;
			this.shadow.anchorOffsetY = 37 >> 1;
		}
	}

	protected removeShadow() {
		if (this.shadow) {
			this.shadow.parent.removeChild(this.shadow);
			this.shadow = null;
		}
	}

	protected sortEffect() {
		// let order: number[] = CharEffect.FRAME_ODER[isNaN(this._dir) ? 4 : this.dir];
		// let len: number = order.length;
		// let childIndex: number = 0;
		// for (let i: number = 0; i < len; i++) {
		// 	let index: number = order[i];
		// 	if (this._disOrder[index] && this._disOrder[index].parent) {
		// 		this._bodyContainer.addChildAt(this._disOrder[index], childIndex);
		// 		childIndex += 1;
		// 	}
		// }
	}

	//层级优化
	public get weight() {
		return this.y;
	}

	public get team() {
		return this.infoModel.team;
	}

	public destroy() {
		this.removeAll();
	}

	public resetBodyContainer(): void {
		this._bodyContainer.x = 0;
		this._bodyContainer.y = 70;
		this._bodyContainer.width = 0;
		this._bodyContainer.height = 0;
		this._bodyContainer.alpha = 1;
		// if (GameSYBMap.fbType == FbType.type0 || !BattleCC.ins().getShowScene()) {
		// 	this._bodyContainer.scaleX = 0.5
		// 	this._bodyContainer.scaleY = 0.5;
		// } else {
		// 	this._bodyContainer.scaleX = 1;
		// 	this._bodyContainer.scaleY = 1;
		// }
		this._bodyContainer.visible = true;
		this._body.x = 0;
		this._body.y = this._body instanceof MovieSYClip ? -90 : 0;
	}
}