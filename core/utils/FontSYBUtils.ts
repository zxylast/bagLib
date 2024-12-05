/**
 * Created by shadows on 24-2-21.
 */
declare namespace egret {
	export function registerFontMapping(name: string, path: string): void;
}

namespace FontSYBUtils {
	export var fontArray: Array<string> = [];
	export var count: number = 0;
	export var downCount: number = 0;
	export var loadArray = ["font"];

	export function getResSavePath(fontType: string) {
		return window['wx'].env.USER_DATA_PATH + "/font/" + fontType + ".ttf";
		//return RES_DIR_FONT + fontType + '.ttf';
	}

	export function getResUrl(fontType: string) {
		return '/font/' + fontType + '.ttf';
		//return RES_DIR_FONT + fontType + '.ttf';
	}

	export function getResDownUrl(fontType: string) {
		return RES_DIR_FONT + fontType + ".ttf?v=?" + CONFIG_VER;
		//return RES_DIR_FONT + fontType + '.ttf';
	}




	export function getResCssUrl(name: string) {
		return '/' + name + '.css';
		//return RES_DIR_FONT + name + '.css';
	}

	export async function goDownFile(fontType: string, obj: { callbackSucceed: Function, callbackFailure: Function }, callbackThisObj: any) {

		const fs = window['wx'].getFileSystemManager()
		fs.mkdir({
			dirPath: `${window['wx'].env.USER_DATA_PATH}/font`,
			recursive: false,
			success(res) {
				//console.log(res)
			},
			fail(res) {
				//console.error(res)
			}
		})

		FontSYBUtils.downCount++;
		await loadFileWx(FontSYBUtils.getResDownUrl(fontType), FontSYBUtils.getResSavePath(fontType)).then(res => {
			//console.log("文件：" + res);


		}).catch(() => {
			FontSYBUtils.reDown(fontType, obj, callbackThisObj);
		})

	}

	// export async function downttfFile(fontType: string, obj: { callbackSucceed: Function, callbackFailure: Function }, callbackThisObj: any) {
	// 	if (DeviceSYBUtils.IsWxgame) {
	// 		const fs = window['wx'].getFileSystemManager();
	// 		fs.getFileInfo({
	// 			filePath: FontSYBUtils.getResSavePath(fontType),
	// 			success(res) {

	// 			},
	// 			fail(res) {
	// 				FontSYBUtils.goDownFile(fontType, obj, callbackThisObj);
	// 			}
	// 		})
	// 	}
	// }
	export async function loadFont2(fontType: string, obj: { callbackSucceed: Function, callbackFailure: Function }, callbackThisObj: any) {
		let url: string = FontSYBUtils.getResUrl(fontType);
		FontSYBUtils.count++;
		loadFontWx(url).then(res => {
			obj.callbackSucceed.call(callbackThisObj);
			FontSYBUtils.fontArray.push(fontType);
			//console.log("wx字体加载成功", res);
		}).catch(() => {
			FontSYBUtils.reLoad(fontType, obj, callbackThisObj);
			//FontSYBUtils.reLoad(fontType, obj, callbackThisObj);
			//console.error("wx字体加载失败", url);
		})
	}

	export async function loadFont(fontType: string, obj: { callbackSucceed: Function, callbackFailure: Function }, callbackThisObj: any) {
		if (FontSYBUtils.fontArray.indexOf(fontType) != -1) {
			return obj.callbackSucceed.call(callbackThisObj);
		}

		if (DeviceSYBUtils.IsWxgame) {
			const fs = window['wx'].getFileSystemManager();
			fs.getFileInfo({
				filePath: FontSYBUtils.getResSavePath(fontType),
				success(res) {
					setTimeout(() => {
						//console.log("sueccess downFile");
						FontSYBUtils.loadFont2(fontType, obj, callbackThisObj);
					}, 200);
				},
				fail(res) {
					//console.log("fail downFile");
					FontSYBUtils.goDownFile(fontType, obj, callbackThisObj);
					setTimeout(() => {
						//console.log("complete downAction");
						FontSYBUtils.loadFont(fontType, obj, callbackThisObj);
					}, 1000);
				},
				complete(res) {

				}
			})

			await wait(500);

			// let url: string = FontSYBUtils.getResUrl(fontType);
			// FontSYBUtils.count++;
			// loadFontWx(url).then(res => {
			// 	obj.callbackSucceed.call(callbackThisObj);
			// 	FontSYBUtils.fontArray.push(fontType);
			// 	console.log("wx字体加载成功", res);
			// }).catch(() => {
			// 	setTimeout(() => { FontSYBUtils.reLoad(fontType, obj, callbackThisObj); }, 200);
			// 	//FontSYBUtils.reLoad(fontType, obj, callbackThisObj);
			// 	console.error("wx字体加载失败", url);
			// })
		} else if (DeviceSYBUtils.IsRuntime) {
			FontSYBUtils.loadApp(fontType, obj, callbackThisObj);
		} else {
			FontSYBUtils.loadttf(fontType, (num) => {
				//console.log(fontType);
				FontSYBUtils.count++;
				if (num != 2) {
					FontSYBUtils.count = 0;
					obj.callbackSucceed.call(callbackThisObj);
					FontSYBUtils.fontArray.push(fontType);
				} else {
					FontSYBUtils.reLoad(fontType, obj, callbackThisObj);
				}
			})
		}
	}

	export function reDown(fontType: string, obj: { callbackSucceed: Function, callbackFailure: Function }, callbackThisObj: any) {
		if (FontSYBUtils.downCount >= 5) {
			FontSYBUtils.downCount = 0;
			obj.callbackFailure.call(callbackThisObj);
		} else {
			FontSYBUtils.goDownFile(fontType, obj, callbackThisObj);
		}
	}

	export async function reLoad(fontType: string, obj: { callbackSucceed: Function, callbackFailure: Function }, callbackThisObj: any) {
		if (FontSYBUtils.count >= 10) {
			FontSYBUtils.count = 0;
			obj.callbackFailure.call(callbackThisObj);
		} else {
			await wait(500);
			FontSYBUtils.loadFont2(fontType, obj, callbackThisObj);
		}
	}

	//h5加载字体
	export function loadttf(name, callback) {
		//console.log("open");
		if (document["fonts"]) {
			var values = document["fonts"].values();
			var isLoaded = false;
			var item = values.next();
			while (!item.done && !isLoaded) {
				var fontFace = item.value;
				if (fontFace.famile == name) {
					isLoaded = true;
				}
				item = values.next();
			}

			if (isLoaded) {
				callback(1);
				return;
			}
		}

		if (window["FontFace"]) {
			var font = new window["FontFace"](name, "url(" + FontSYBUtils.getResDownUrl(name) + ")");
			font.load().then(function (loadedFontFace) {
				if (loadedFontFace.status == "loaded") {
					document["fonts"].add(loadedFontFace);
					callback(1);
				} else {
					callback(2);
				}
			});
		} else {
			if (window["document"]) {
				dynamicLoadCss(name);
				callback(3);
			} else {
				callback(2);
			}
		}

	}

	export function dynamicLoadCss(name) {
		var head = document.getElementsByTagName('head')[0];
		var link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = FontSYBUtils.getResCssUrl(name);
		head.appendChild(link);
		//console.log("开始加载css");
	}


	//app加载字体
	export function loadApp(name: string, obj: { callbackSucceed: Function, callbackFailure: Function }, callbackThisObj: any) {
		//console.log("开始加载loadApp");
		if (RES.hasRes(name + "_ttf")) {
			loadArray.push(name + "_ttf");
		}

	}

	//微信加载字体
	export function loadFontWx(_url: string): Promise<any> {
		return new Promise((resolve, reject) => {
			const fontName: string = window['wx'].loadFont(window['wx'].env.USER_DATA_PATH + _url);
			//const fontName: string =RES_DIR_FONT +  'FZCuYuan-M03S.ttf';
			//const fontName: string =  window['cdn'].loadFont(_url);
			if (fontName) {
				resolve(fontName);
			} else {
				reject(window['wx'].env.USER_DATA_PATH + _url);
			}
		})
	}



	//微信下载文件
	export function loadFileWx(_url: string, _path: string): Promise<any> {
		return new Promise((resolve, reject) => {

			const downFile: string = window['wx'].downloadFile({
				url: _url, //仅为示例，并非真实的资源
				filePath: _path,

				success(res) {
					// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
					if (res.statusCode === 200) {
						//console.log("文字下载成功！");

					}
				},
				fail(res) {
					//console.log("文字下载失败！");
				}

			})

			if (downFile) {
				resolve(downFile);
			} else {
				reject();
			}


		})



		// window['wx'].downloadFile({
		// 	url: RES_DIR_FONT + "myText.ttf", //仅为示例，并非真实的资源
		// 	filePath: window['wx'].env.USER_DATA_PATH+"/" + fontType + ".ttf",

		// 	success(res) {
		// 		// 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容

		// 		console.log("文字下载中！");
		// 		if (res.statusCode === 200) {
		// 			console.log("文字下载成功！" + res.tempFilePath);

		// 		}
		// 	},
		// 	fail(res) {
		// 		console.log("文字下载失败！");
		// 	}
		// })

	}

}