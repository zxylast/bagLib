/** 微信内容不允许单配置8m以上 拆分成四个配置 */
class GlobalJYConfig {

	public static loaded;
	public static inited = false;

	public static chapterLoaded;

	private static storageKey = "configVersion";
	private static configData;
	private static isZip = false;

	private static cfgName: string[] = [""];

	//只加载不初始化
	static load() {
		let self = this;
		if (self.inited) {
			return;
		}
		var value = egret.localStorage.getItem(self.storageKey);
		//if (value == CONFIG_VER) {
		if (!SYWeixin) {
			self.loadConfig();
		}
		else {
			var confJson = ServerSYBManager.Instance.IsLittle() ? "config_test57.json" : "config.json";
			platformWX.loadConfigs(`${RES_RESOURCE}config/${confJson}?v=` + CONFIG_VER);
		}
		// self.loadConfig();
	}

	//初始化
	static init() {
		let self = this;
		let config: any;

		if (SYWeixin) {
			config = platformWX.configData;
		} else {
			config = self.configData;
		}
		//console.log("解析开始：" + (egret.getTimer()));
		let parseKeys = function (obj: any, proto: any, key: number) {
			if (key == 0) {
				obj.__proto__ = proto;
			} else {
				for (let i in obj) {
					parseKeys(obj[i], proto, key - 1);
				}
			}
		}
		for (let key in config) {

			let value = config[key];
			let objCls = egret.getDefinitionByName(key);
			if (objCls && self.cfgName.indexOf(key) != -1) {
				//用来存储配置一个默认实例
				let objKey = `_obj${key}`;
				self[objKey] = new objCls();
				let boolKey = `_bool${key}`;
				//用来确认配置表是否已经设置 __proto__ 为 储存的实例（this[objKey])
				//将真正的配置存放在this[newKey]中
				let newKey = `_${key}_`;
				//创建key引用配置
				Object.defineProperty(self, key, {
					get: function () {
						let obj = self[newKey];

						if (self[boolKey]) {
							return obj;
						}
						let proto = self[objKey];
						parseKeys(obj, proto, GlobalJYConfig.keys[key] || 0);
						self[boolKey] = true;
						return obj;
					},
					set: function (val) {
						let obj = self[newKey];
						let proto = self[objKey];
						if (obj) {
							for (let i in val) {
								self[newKey][i] = val[i];
							}
							parseKeys(obj, proto, GlobalJYConfig.keys[key] || 0);
						}
						else {
							self[newKey] = val;
						}
					}
				});
			}
			//是否需要深拷贝赋值？
			self[key] = value;
		}
		// self.ChapterConfig
		// self.MonstersConfig
		self.configData = null;

		config = null;
		platformWX.configData = null;
		GlobalJYConfig.inited = true;
		//console.log("解析结束：" + (egret.getTimer()));
	}

	/**加载关卡分配置 */
	static chapterLoadSplitCfg() {
		//检测是否保存到关卡id
		let self = this;
		// let cfgVal = 0;
		// if (cfgVal > 0 && cfgVal >= 1000) {
		// 	//开始下载分配置
		// 	let chapterIdx = Math.floor(cfgVal / 1000);
		// 	GlobalConfig.loadSplitConfig(`chapter/chapter_${chapterIdx}.json`, () => {
		// 		self.chapterLoaded = true;
		// 		//检测当前配置是否还超过跃迁最高关卡数+10关
		// 		let cfgKey = GlobalConfig.ChapterConfig[cfgVal + 10 + GlobalConfig.ChapterBaseConfig.jumpChapter[GlobalConfig.ChapterBaseConfig.jumpChapter.length - 1]];
		// 		if (!cfgKey) {
		// 			//加载下一份配置
		// 			let chapIdx = Math.floor(cfgVal / 1000) + 1;
		// 			GlobalConfig.loadSplitConfig(`chapter/chapter_${chapIdx}.json`);
		// 		}
		// 	});
		// } else {
		self.chapterLoaded = true;
		// }
	}

	/**加载分个配置*/
	static loadSplitConfig(url, comp = null) {
		let self = this;
		//console.log("分配置下载开始：" + (egret.getTimer()));
		if (SYWeixin) {
			platformWX.loadJson(`${RES_RESOURCE}config/${url}?=` + CONFIG_VER, (data) => {
				this.parseSplitData(data, comp);
				//console.log("分配置下载结束：" + (egret.getTimer()));
			});
		}
		else {
			RES.getResByUrl(`${RES_RESOURCE}config/${url}?=` + CONFIG_VER, function (data) {
				this.parseSplitData(data, comp)
				//console.log("分配置下载结束：" + (egret.getTimer()));
			}, this, RES.ResourceItem.TYPE_JSON);
		}
	}
	static parseSplitData(data, comp) {
		let self = this;
		for (let key in data) {
			//是否需要深拷贝赋值？
			// self[key] = data[key];
			if (self[key]) {
				for (let i in data[key]) {
					self[key][i] = data[key][i];
				}
			}
		}
		if (comp) {
			comp();
		}
	}

	private static loadConfig() {
		let self = this;
		//console.log("下载开始：" + (egret.getTimer()));
		var confJson = ServerSYBManager.Instance.IsLittle() ? "config_test57.json" : "config.json";
		RES.getResByUrl(`${RES_RESOURCE}config/${confJson}?=` + CONFIG_VER, function (data) {
			self.configData = data;
			self.loaded = true;
			self.isZip = false;
			//console.log("下载结束：" + (egret.getTimer()));
		}, this, RES.ResourceItem.TYPE_JSON);
	}
	static ItemConfig: ItemConfig[];
	static MoneyConfig: MoneyConfig[];
	static HeroGirdConfig: HeroGirdConfig[][];
	static HeroLevelConfig: HeroLevelConfig[][];
	static HeroShowConfig: HeroShowConfig[];
	static MonsterConfig: MonsterConfig[];
	static ChapterBaseConfig: ChapterBaseConfig;
	static ChapterConfig: ChapterConfig[];
	static ActivityConfig: ActivityConfig[];
	static ActivityType11Config: ActivityType11Config[][];
	static EffectsConfig: EffectsConfig[];
	static SkillsConfig: SkillsConfig[];
	static SkillsDescConfig: SkillsDescConfig[];
	static InstanceConfig: InstanceConfig[];
	static HeroBaseConfig: HeroBaseConfig;
	static FbLvConfig: FbLvConfig[];
	static ShopMainListConfig: ShopMainListConfig[];
	static ShopItemConfig: ShopItemConfig[][];
	static ShopConfig: ShopConfig[];
	static UniqueSkillShowConfig: UniqueSkillShowConfig[];
	static UniqueSkillConfig: UniqueSkillConfig[][];
	static UniqueSkillBuffConfig: UniqueSkillBuffConfig[][];
	static ItemRandomConfig: ItemRandomConfig[];


	private static keys = {
		"HeroBaseConfig": 0,
		"FbLvConfig": 1,
		"MoneyConfig": 1,
		"ItemConfig": 1,
		"InstanceConfig": 1,
		"HeroGirdConfig": 2,
		"HeroLevelConfig": 2,
		"HeroShowConfig": 1,
		"MonsterConfig": 1,
		"ChapterBaseConfig": 0,
		"ChapterConfig": 1,
		"EffectsConfig": 1,
		"SkillsConfig": 1,
		"SkillsDescConfig": 1,
		"ActivityConfig": 1,
		"ActivityType11Config": 2,
		"ShopMainListConfig": 1,
		"ShopItemConfig": 2,
		"ShopConfig": 1,
		"UniqueSkillShowConfig": 1,
		"UniqueSkillConfig": 2,
		"UniqueSkillBuffConfig": 2,
        "ItemRandomConfig": 1,
	};


}


