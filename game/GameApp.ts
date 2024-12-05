/**
 * @author
 */
class GameApp extends BaseSYBClass {

	public preload_load_count: number = 0;
	public map_load_count: number = 0;

	public state: number = 0;

	public isLoginAgainBool: boolean = false;

	public constructor() {
		super();
	}

	static ins(): GameApp {
		return super.ins() as GameApp;
	}

	public load() {
		if (this.state == 0) {
			this.LoadGame().catch(e => {
				//console.log(e);
			})
		} else if (this.state < 6) {
			this.loadGameRes().catch(e => {
				//console.log(e);
			});
		}
	}

	private async LoadGame() {
		//加载创角组
		this.state = 1;
		await RES.loadGroup("firstLoad", 0);
		LocationSYBProperty.setLoadProgress(30, "加载创角资源...");
		RoleSYBMgr.ins().connectServer();
	}

	/**
	 * 第二段加载的内容
	 */
	public async loadGameRes() {
		// if(SYIOS){
		// 	let loadVersion = false;
		// 	let versionData:any = false;
		// 	console.log("iosVersion下载开始："+CONFIG_VER);
		// 	RES.getResByUrl(`${RES_RESOURCE}iosVersion.json`, function (data) {
		// 		loadVersion = true;
		// 		versionData = data;
		// 		console.log("iosVersion下载结束:"+versionData.version);
		// 	}, this, RES.ResourceItem.TYPE_JSON);
		// 	while (true) {
		// 		if(loadVersion){
		// 			if(versionData.version != CONFIG_VER){
		// 				WarnWin.show("需要更新版本才可进入游戏,请确定以开始更新",()=>{
		// 					egret.ExternalInterface.call("StartLoad", "");
		// 					LocationSYBProperty.setLoadProgress(50, "更新资源中...");
		// 				},this,()=>{

		// 				});
		// 			}
		// 			break;
		// 		}
		// 		await wait();
		// 	}
		// 	if(versionData.version != CONFIG_VER){
		// 		while (true) {
		// 			await wait();
		// 		}
		// 	}
		// }
		//加载地图
		if (this.state < 2) {
			//await this.loadMap();
			if (!GameSYBMap.inited) {
				GameSYBMap.init(null);
			}
			LocationSYBProperty.setLoadProgress(50, "加载地图...");
			this.state = 2;
		}
		//初始化配置表
		if (this.state < 3) {
			setTimeout(()=> {
				if(!GlobalJYConfig.loaded || !GlobalJYConfig.chapterLoaded){
					this.load();
				}
			}, 22000);
			GlobalJYConfig.load();
			GlobalJYConfig.chapterLoadSplitCfg();
			while (true) {
				if (SYWeixin && platformWX.configLoaded) {
					GlobalJYConfig.loaded = true;
				}
				if (GlobalJYConfig.loaded) {
					if (!GlobalJYConfig.inited) {
						GlobalJYConfig.init();
					}
					//GlobalConfig.loadSplitConfig("configTest.json");
					break;
				}
				await wait();
			}
			//加载关卡配置
			while (true) {
				if (GlobalJYConfig.chapterLoaded) {
					break;
				}
				await wait();
			}
			this.state = 3;
		}
		//初始化模块
		if (this.state < 4) {
			// setTimeout(()=> {
			// 	this.state = 4
			// }, 600*1000);
			// while (true) {
			// 	if (this.state == 4) {
			// 		break;
			// 	}
			// 	await wait();
			// }
			for (let i in GameSystem) {
				GameSystem[i]();
			}
			LocationSYBProperty.setLoadProgress(60, "初始化模块...");
			this.state = 4;
		}
		if (this.state < 5) {
			RES.loadGroup("preload", 0);
			while (true) {
				if (RES.isGroupLoaded("preload")) {
					break;
				}
				await wait();
			}
			LocationSYBProperty.setLoadProgress(85, "预加载中...");
			this.state = 5;
		}
		if (this.state <= 6) {
			eui.Label.default_fontFamily = "微软雅黑";
			RoleSYBAI.ins().init();
			LocationSYBProperty.setLoadProgress(100, "进入游戏...");
			this.state = 6;
		}
	}

	public isLoading(): boolean {
		return this.state < 6;
	}

	private loadMap() {
		return new Promise((resolve, reject) => {
			RES.getResByUrl(``, (data) => {
				// //地图网格初始化
				if (!GameSYBMap.inited) {
					GameSYBMap.init(data);
				}
				resolve();
			}, this, );
		})
	}

	public postPerLoadProgress(itemsLoaded: number, itemsTotal: number): number[] {
		return [itemsLoaded, itemsTotal];
	}

	public postPerLoadComplete() {
	}

	public postLoginInit(): void {
	}

	public postZeroInit(): void {
	}

	public postBgInit(): void {
	}

	public postLoginAgain(): void {
	}

}

MessageSYBCenter.compile(GameApp);