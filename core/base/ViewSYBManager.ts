class ViewSYBManager extends BaseSYBClass {
	/**
	 * 已注册的UI信息
	 */
	private _regesterInfo: any;
	/**
	 * ui实体
	 */
	private _views: any;

	private _hCode2Key: any;
	/**
	 * 开启中UI
	 */
	private _opens: Array<string>;
	/**
	 * 常驻界面
	 */
	private _constView: string[];

	/**打开较慢时间毫秒 */
	private longValue = 20;

	/**连续打开限制 */
	private gapTime = 0;
	/**连续打开限制延时时间 */
	private delayTime = 0;
	private delayOpens = [];
	private delayCloses = [];

	/**
	 * 构造函数
	 */
	public constructor() {
		super();
		this._regesterInfo = {};
		this._views = {};
		this._hCode2Key = {};
		this._opens = [];
		this._constView = ["GameSceneView", "ChatMainUI", "UIView2", "TipsView", "PlayFunView"];
	}

	/** 重载单例*/
	public static ins(): ViewSYBManager {
		return super.ins() as ViewSYBManager
	}

	/**
	 * 清空处理
	 */
	public clear(): void {
		this.closeAll();
		this._views = {};
	}

	/**
	 * 面板注册
	 * @param view 面板类
	 * @param layer 层级
	 */
	public reg(viewClass: any, layer: BaseSpriteLayer): void {
		if (viewClass == null) {
			return;
		}
		let keys: string = egret.getQualifiedClassName(viewClass);
		if (this._regesterInfo[keys]) {
			return;
		}
		this._regesterInfo[keys] = [viewClass, layer];
	}

	/**
	 * 销毁一个面板
	 * @param hCode
	 */
	public destroy(hCode: number): void {
		let keys: number = this._hCode2Key[hCode];
		delete this._views[keys];
		delete this._hCode2Key[hCode];
	}

	private getKey(nameOrClass: any): string {
		let key: string = "";
		if (typeof (nameOrClass) == "string")//类名
			key = nameOrClass;
		else if (typeof (nameOrClass) == "function")//构造函数
			key = egret.getQualifiedClassName(nameOrClass);
		else if ((nameOrClass) instanceof BaseSYBEuiView) {
			let keys = Object.keys(this._views);
			for (let i: number = 0, len = keys.length; i < len; i++) {
				let tempKey: string = keys[i];
				if (this._views[tempKey] == nameOrClass) {
					key = tempKey;
					break;
				}
			}
		}
		else{
			//debug.log("打开界面只支持类名和类名的字符串形式,关闭界面只支持类名和类名的字符串以及类的实例形式,错误编号:" + nameOrClass);
		}
		return key;
	}

	/**
	 * 检测能否开启
	 * @param key 类名
	 */
	public viewOpenCheck(key: string, ...param: any[]): boolean {
		let result: boolean = true;
		let info: any[] = this._regesterInfo[key];
		if (info != null) {
			let c: any = info[0];
			let f: Function = c["openCheck"] as Function;
			if (f != null) {
				result = f(...param);
			}
		}
		return result;
	}

	private filters: Array<string> = ["TipsView", "GameSceneView"];

	//关闭所有顶窗口时候排除以下窗口
	private closeTopFilters: Array<string> = [];

	/**
	 * 统一打开窗口函数
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @param param 打开窗口传入的参数
	 *  */
	public open(nameOrClass: any, ...param: any[]): BaseSYBEuiView {
		let key = this.getKey(nameOrClass);

		//检测能否开启
		if (!this.viewOpenCheck(key, ...param)) {
			return null;
		}

		if (StageSYBUtils.ins().frameRate != 60) {
			StageSYBUtils.ins().setFrameRate(60);
		}

		let view: BaseSYBEuiView = this.openEasy(key, param);
		if (this.filters.indexOf(key) == -1) {
			//debug.log("开始打开窗口:" + key);
		}

		//适配中根据高区做比例适应(1280~1440)
		let tmpHeight = StageSYBUtils.ins().getStage().stageHeight > 1440 ? 1440 : StageSYBUtils.ins().getStage().stageHeight;
		view.scaleX = view.scaleY = tmpHeight / 1440;

		if (view) {
			this.checkOpenView(view);
			// debug.log("成功打开窗口:" + key);
		} else {
			// debug.log("成功打开窗口:" + key);
		}
		return view;
	}

	/**
	 * 显示指定界面对界面部分UI进行动画播放播放
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 *
	 * */
	private setUIEff(className?: string) {
		// let layer:BaseEuiSYBLayer = this._regesterInfo[className][1];
		if (className) {
			let view: BaseSYBEuiView = this.getView(className);
			if (!view) {
				return;
			}
			if (view.parent == LayerSYBManager.UI_Popup2 && this.classNameBoolean(className)) {
				if (className != "BaseRewardTipsView") {
				}
				// if (!SYwxSpecial) {
				// 	view.playUIEff2(() => {
				// 		if (StageSYBUtils.ins().frameRate != 60) {
				// 			StageSYBUtils.ins().setFrameRate(StageSYBUtils.ins().frameRate);
				// 		}
				// 	});
				// }
			} else if (view.parent == LayerSYBManager.UI_Main2) {
				if (StageSYBUtils.ins().frameRate != 60) {
					StageSYBUtils.ins().setFrameRate(StageSYBUtils.ins().frameRate);
				}
			} else if (view.parent == LayerSYBManager.UI_Popup) {
				if (!SYWeixin) {
					view.playUIEff3(() => {
						if (StageSYBUtils.ins().frameRate != 60) {
							StageSYBUtils.ins().setFrameRate(StageSYBUtils.ins().frameRate);
						}

					});
				}
			}
			else if (view) {
				view.playUIEff(() => {
					if (StageSYBUtils.ins().frameRate != 60) {
						StageSYBUtils.ins().setFrameRate(StageSYBUtils.ins().frameRate);
					}
				});
			} else {
				if (StageSYBUtils.ins().frameRate != 60) {
					StageSYBUtils.ins().setFrameRate(StageSYBUtils.ins().frameRate);
				}
			}
		}
		//close
		//else{
		// if( this._opens.length == this._constView.length )
		// 	return;
		// let view:BaseSYBEuiView = this.getView(className);
		// if( view ){
		// 	view.closeUIEff(layer,this.checkCloseView);
		// }
		//}
	}

	private classNameBoolean(className: string): boolean {
		return className != "UIViewReturn" && className != "UIViewReturn2" && className != "HeroSkillTipsView" && className != "HeroTransferTipsView"
			&& className != "HangupRewardView" && className != "TalismanTipsView";
	}

	//简单的打开一个界面
	public openEasy(nameOrClass: any, param: any[] = null): BaseSYBEuiView {

		let keys: string = this.getKey(nameOrClass);
		let view: BaseSYBEuiView = this._views[keys];
		let info: any[] = this._regesterInfo[keys];
		if (!view) {
			// return;
			// if (!DEBUG && Assert(info, `ViewSYBManager.openEasy class ${keys} is null!!`)) {
			// 	return;
			// }
			view = new info[0]();
			// view.$setParent(info[1]);
			this._views[keys] = view;
			this._hCode2Key[view.hashCode] = keys;
		}
		if (view == null) {
			Log.trace("UI_" + keys + "不存在");
			return null;
		}

		//关闭互斥窗口
		for (let exclusionWin of view.exclusionWins) {
			this.closeEasy(exclusionWin);
		}

		if (view.isShow() || view.isInit()) {
			view.addToParent(info[1]);
			view.open.apply(view, param);
		} else {
			this.delayTime += this.gapTime;
			let openApply = () => {
				EasySYBLoading.ins().showLoading();
				view.loadResource(function () {
					view.addToParent(info[1]);
					view.setVisible(false);
				}.bind(this), function () {
					let tempTime = egret.getTimer();
					view.initUI();
					view.initData();
					view.open.apply(view, param);
					view.setVisible(true);
					EasySYBLoading.ins().hideLoading();
					let delayIndex = this.delayOpens.indexOf(keys)
					delayIndex >= 0 && this.delayOpens.splice(delayIndex, 1);
					this.delayTime -= this.gapTime;
					if (egret.getTimer() - tempTime >= this.longValue) {
						//console.log("long open view:" + keys + ", open ms:" + (egret.getTimer() - tempTime));
					}
				}.bind(this));
			}
			if (this.delayTime > 0 && this._constView.indexOf(keys) == -1) {
				this.delayOpens.indexOf(keys) < 0 && this.delayOpens.push(keys);
				setTimeout(() => {
					let closeIndex: number = this.delayCloses.indexOf(keys);
					if (closeIndex < 0) {
						openApply();
					}
					else {
						let openIndex: number = this.delayOpens.indexOf(keys);
						if (openIndex >= 0) {
							this.delayOpens.splice(openIndex, 1);
						}
						this.delayCloses.splice(closeIndex, 1);
						this.delayTime -= this.gapTime;
						this.checkCloseView()
					}
				}, this.delayTime);
			} else {
				openApply();
			}

		}

		let index = this._opens.indexOf(keys);
		if (index >= 0) {
			this._opens.splice(index, 1);
		}
		this._opens.push(keys);

		return view;
	}

	private lastResType: number = 1;
	private checkOpenView(view: BaseSYBEuiView): void {
		if (view.parent == LayerSYBManager.UI_Popup) {
			let viewInfo = view;
			ViewSYBManager.ins().closeViewByLevel(LayerSYBManager.UI_Main2);
		}
		else if (view.isTopLevel && view.parent != LayerSYBManager.UI_Popup2 && view.parent != LayerSYBManager.UI_Popup) {//1级界面,需要关闭其他
			// SoundUtil.WINDOW_OPEN = true; //目前打开窗口时也播放技能声音
			if (view.parent == LayerSYBManager.UI_Main2) {
				this.closePop2Level();
			}

			if (view.parent != LayerSYBManager.UI_Main_Bottom) {

			}
		}
		else if (view.parent == LayerSYBManager.UI_Popup2) {
			if (view.parent == LayerSYBManager.UI_Popup2 && !this.hasTopOrMainView()) {
				// this.unShowPlayFun()
			}

		}
		else if (view.parent == LayerSYBManager.UI_Main) {
			// if (egret.Capabilities.isMobile && egret.Capabilities.os == 'iOS') {
			// 	SoundUtil.ins().playEffect(SoundUtil.WINDOW);
			// }

		}

	}

	//----------------------------------------------------关闭-------------------------------------
	/**
	 * 统一关闭窗口函数
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @param param 关闭传入的参数
	 **/
	public close(nameOrClass: any, ...param: any[]): void {
		let key: string = this.getKey(nameOrClass);
		// debug.log("开始关闭窗口" + key);
		// if (this.filters.indexOf(key) == -1) {
		// 	debug.log("开始打开窗口:" + key);
		// 	UserSkill.ins().postViewOpen(0);
		// }
		this.closeEx(key, param);
		// let view: BaseSYBEuiView = this.closeEasy(key, param);
		// if (view) {
		// 	this.checkCloseView();
		// 	// debug.log("成功关闭窗口" + key);
		// } else {
		// 	// debug.log("窗口不存在" + key);
		// }
	}

	private closeEx(className: string, ...param: any[]) {
		if (className) {
			let view: BaseSYBEuiView = this.getView(className);
			if (view) {

				let self = this;
				if (view.isTopLevel) {
				}

				if (view.parent == LayerSYBManager.UI_Main2) {
					
				}
				// if ((className != "UIViewReturn" && className != "UIViewReturn2") && view.parent == LayerSYBManager.UI_Popup2 && !this.hasTopOrMainView()) {
				// 	this.showPlayFun();
				// } else if (view.parent == LayerSYBManager.UI_Main2) {
				// 	this.showPlayFun();
				// } else if (view.parent == LayerSYBManager.UI_Popup) {
				// 	ViewSYBManager.ins().getView(GameSceneView).setVisible(true);
				// 	ViewSYBManager.ins().getView(PlayFunView).setVisible(true);
				// }
				if (this.delayOpens.indexOf(className) >= 0) {
					this.delayCloses.indexOf(className) < 0 && this.delayCloses.push(className);
					return;
				}
				view.closeEx(function () {
					let view: BaseSYBEuiView = self.closeEasy(className, param);
					if (view) {
						self.checkCloseView();
						// debug.log("成功关闭窗口" + key);
					} else {
						// debug.log("窗口不存在" + key);
					}
				});
			}
		}

	}

	public closeLastTopView(): void {
		let len: number = this._opens.length;
		for (let k: number = len - 1; k >= 0; k--) {
			let win: BaseSYBEuiView = this.getView(this._opens[k]);
			if (win && win.isTopLevel) {
				if (win.parent == LayerSYBManager.UI_Main2) {
					this.showPopLevel();
				}
				this.close(win);

				break;
			}
		}
	}

	//简单关闭一个窗口
	private closeEasy(nameOrClass: any, ...param: any[]): BaseSYBEuiView {
		if (!this.isShow(nameOrClass)) {
			return null;
		}
		let key: string = this.getKey(nameOrClass);
		let view: BaseSYBEuiView = this.getView(key);
		if (view) {
			let viewIndex = this._opens.indexOf(key);
			if (viewIndex >= 0) {
				this._opens.splice(viewIndex, 1);
			}
			view.close.apply(view, param);
			view.$onClose.apply(view);
			view.removeFromParent();
		}
		return view;
	}

	private checkCloseView(): void {
		let hasTopLevelWin: boolean = false;//是否有一级窗口
		for (let key of this._opens) {
			let win: BaseSYBEuiView = this.getView(key);
			if (win && win.isTopLevel) {
				hasTopLevelWin = true;
				break;
			}
		}
		if (!hasTopLevelWin) {

			if (SceneSYBManager.ins().getSceneName() == SceneSYBManager.MAIN) {
				// if (!this.isShow(GameSceneView))
				// 	this.openEasy(GameSceneView);
				// if (!this.isShow(ChatMainUI))
				// 	this.openEasy(ChatMainUI);
			}
		}
	}

	/** 获取战斗场景 */
	// public static get gamescene(): GameSceneView {
	// 	return ViewSYBManager.ins().getView(GameSceneView) as GameSceneView;
	// }

	/**
	 * 获取一个UI对象
	 * 返回null代表未初始化
	 * @param nameOrClass  类名,类字符串名,或者类对象
	 * @returns BaseSYBEuiView
	 */
	public getView(nameOrClass: any): BaseSYBEuiView {
		let keys: string = this.getKey(nameOrClass);
		// if (this._views[keys] instanceof Array)
		// 	return null;
		return this._views[keys];
	}

	/**
	 * 关闭所有开启中的UI
	 */
	public closeAll(): void {
		while (this._opens.length) {
			this.closeEasy(this._opens[0], []);
		}
		this.destroyAllNotShowView();
		this.checkCloseView()
	}

	/**
	 * 关闭所有一级界面
	 */
	public closeTopLevel(): void {
		let filter = this.closeTopFilters;
		this.closeTopFilters = [];
		for (let i: number = this._opens.length - 1; i >= 0; i--) {
			let keys: string = this._opens[i];
			if (filter.indexOf(keys) >= 0) {
				continue;
			}

			let view: BaseSYBEuiView = this.getView(keys);
			let key: number = 1000000;
			if (!isNaN(parseInt(keys))) {
				key = parseInt(keys);
			}

			if (!view)
				continue;
			//if (Assert(view, "closeTopLevel view null. keys:" + keys)) continue;
			if (view.isTopLevel)
				this.closeEasy(keys, []);
		}
		this.checkCloseView();
	}

	/**
		 * 关闭对应层级界面
		 */
	public closeViewByLevel(lv: any): void {
		let filter = this.closeTopFilters;
		this.closeTopFilters = [];
		for (let i: number = this._opens.length - 1; i >= 0; i--) {
			let keys: string = this._opens[i];
			if (filter.indexOf(keys) >= 0) {
				continue;
			}
			let view: BaseSYBEuiView = this.getView(keys);
			let key: number = 1000000;
			if (!isNaN(parseInt(keys))) {
				key = parseInt(keys);
			}
			if (!view)
				continue;
			//if (Assert(view, "closeTopLevel view null. keys:" + keys)) continue;
			if (view.parent == lv) {
				this.close(view);
			}
		}

	}

	/**
	 * 关闭所有Pop界面
	 */
	public closePopLevel(): void {
		let filter = this.closeTopFilters;
		this.closeTopFilters = [];
		for (let i: number = this._opens.length - 1; i >= 0; i--) {
			let keys: string = this._opens[i];
			if (filter.indexOf(keys) >= 0) {
				continue;
			}

			let view: BaseSYBEuiView = this.getView(keys);
			let key: number = 1000000;
			if (!isNaN(parseInt(keys))) {
				key = parseInt(keys);
			}

			if (!view)
				continue;
			//if (Assert(view, "closeTopLevel view null. keys:" + keys)) continue;
			if (view.parent == LayerSYBManager.UI_Popup) {
				this.close(view);
			}
		}
		// ViewSYBManager.ins().getView(GameSceneView).setVisible(true);
		// ViewSYBManager.ins().getView(PlayFunView).setVisible(true);
		//ViewSYBManager.ins().getView(GameMapBgView).setVisible(true);
		//this.checkCloseView();
	}


	/**
 * 关闭所有Pop2界面
 */
	public closePop2Level(): void {
		let filter = this.closeTopFilters;
		this.closeTopFilters = [];
		for (let i: number = this._opens.length - 1; i >= 0; i--) {
			let keys: string = this._opens[i];
			if (filter.indexOf(keys) >= 0) {
				continue;
			}

			let view: BaseSYBEuiView = this.getView(keys);
			let key: number = 1000000;
			if (!isNaN(parseInt(keys))) {
				key = parseInt(keys);
			}

			if (!view)
				continue;
			//if (Assert(view, "closeTopLevel view null. keys:" + keys)) continue;
			if ((keys != "UIViewReturn" && keys != "UIViewReturn2") && view.parent == LayerSYBManager.UI_Popup2) {
				this.close(view);
			}
		}
	}


	public unShowPlayFun(): void {
		// let view = this.getView(PlayFunView);
		// if (view) view.setVisible(false);
	}


	public showPlayFun(): void {
		// let view = this.getView(PlayFunView);
		// if (this.hasPopView()) {
		// 	return;
		// }
		// if (view) view.setVisible(true);
	}

	public showGameScene(): void {
		// let sceneView = this.getView(GameSceneView);
		// if (this.hasPopView()) {
		// 	return;
		// }
		// if (sceneView) sceneView.setVisible(true);
	}

	/**检测最上的popup界面 */
	public onTopPop(): string {
		let str = "";
		for (let i: number = this._opens.length - 1; i >= 0; i--) {
			let keys: string = this._opens[i];


			let view: BaseSYBEuiView = this.getView(keys);
			let key: number = 1000000;
			if (!isNaN(parseInt(keys))) {
				key = parseInt(keys);
			}

			if (!view)
				continue;
			//if (Assert(view, "closeTopLevel view null. keys:" + keys)) continue;
			if (view.parent == LayerSYBManager.UI_Popup) {
				return keys;
			}
		}
		return str;
	}

	/**隐藏Popup */
	public unShowPopLevel(): void {
		for (let i: number = this._opens.length - 1; i >= 0; i--) {
			let keys: string = this._opens[i];


			let view: BaseSYBEuiView = this.getView(keys);
			let key: number = 1000000;
			if (!isNaN(parseInt(keys))) {
				key = parseInt(keys);
			}

			if (!view)
				continue;
			//if (Assert(view, "closeTopLevel view null. keys:" + keys)) continue;
			if (view.parent == LayerSYBManager.UI_Popup) {
				view.setVisible(false);
			}
		}
	}

	/**展示Popup */
	public showPopLevel(): void {
		for (let i: number = this._opens.length - 1; i >= 0; i--) {
			let keys: string = this._opens[i];


			let view: BaseSYBEuiView = this.getView(keys);
			let key: number = 1000000;
			if (!isNaN(parseInt(keys))) {
				key = parseInt(keys);
			}

			if (!view)
				continue;
			//if (Assert(view, "closeTopLevel view null. keys:" + keys)) continue;
			if (view.parent == LayerSYBManager.UI_Popup) {
				view.setVisible(true);
			}
		}
	}

	/**
	 * 当前ui打开数量
	 * @returns {number}
	 */
	public openNum(): number {
		return this._opens.length;
	}

	/**
	 * 检测一个UI是否开启中
	 * @param nameOrClass 类名,类字符串名,或者类对象
	 * @returns {boolean}
	 */
	public isShow(nameOrClass: any): boolean {
		return this._opens.indexOf(this.getKey(nameOrClass)) >= 0;
	}

	/**
	 * 是否打开1级界面
	 */
	public hasTopView(): boolean {
		for (let key of this._opens) {
			let win: BaseSYBEuiView = this.getView(key);
			if (win && win.isTopLevel) {
				return true;
			}
		}
		return false
	}

	/**
		 * 是否打开UI_Main2
		 */
	public hasTopOrMainView(): boolean {
		for (let key of this._opens) {
			if (key == "kpArenaMainWin" || key == "MissionMainWin") return false;
			let win: BaseSYBEuiView = this.getView(key);
			if (win && win.parent == LayerSYBManager.UI_Main2) {
				return true;
			}
		}
		return false
	}
	/**
		 * 是否打开UI_Main2
		 */
	public hasPop2View(): boolean {
		for (let key of this._opens) {
			let win: BaseSYBEuiView = this.getView(key);
			if (win && win.parent == LayerSYBManager.UI_Popup2) {
				return true;
			}
		}
		return false
	}

	/**
	 * 是否打开对应层级界面
	 */
	public hasViewByLevel(lv: any): boolean {
		for (let key of this._opens) {
			let win: BaseSYBEuiView = this.getView(key);
			if (win && win.parent == lv) {
				return true;
			}
		}
		return false
	}

	/**
	 * 是否打开功能级界面
	 */
	public hasFunView(): boolean {
		for (let key of this._opens) {
			let win: BaseSYBEuiView = this.getView(key);
			if (win && (win.parent == LayerSYBManager.UI_Popup || win.parent == LayerSYBManager.UI_Main || win.parent == LayerSYBManager.UI_Main2 || win.parent == LayerSYBManager.UI_Popup2)) {
				return true;
			}
		}
		return false
	}
	/**
	 * 释放所有已关闭但未释放的窗口
	 */
	public destroyAllNotShowView() {
		for (let code in this._hCode2Key) {
			let keys = this._hCode2Key[code];
			if (this._constView.indexOf(keys) == -1 && this._opens.indexOf(keys) == -1) {
				let win: BaseSYBEuiView = this.getView(keys);
				if (win && win.destoryView) {
					win.destoryView(false);
				}
			}
		}
	}

	/**
	 * 释放所
	 */
	public checkDestroy() {
		if (this._opens.length > this._constView.length) {
		}
		this.destroyAllNotShowView();

	}
}
