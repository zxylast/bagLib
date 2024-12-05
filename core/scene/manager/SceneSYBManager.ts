/**
 * Created by yangsong on 2014/11/28.
 * 场景管理类
 */
class SceneSYBManager extends BaseSYBClass {
	static CREATE_ROLE:string = "CreateRoleScene";
	static MAIN:string = "MainScene";
	static LOADING:string = "LoadingScene";

	private _currScene: BaseSYBScene;

	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	public static ins(): SceneSYBManager {
		return super.ins() as SceneSYBManager;
	}

	/**
	 * 清空处理
	 */
	public clear(): void {
		let nowScene: BaseSYBScene = this._currScene;
		if (nowScene) {
			nowScene.onExit();
			this._currScene = undefined;
		}
	}

	/**
	 * 切换场景
	 * @param key 场景唯一标识
	 */
	public runScene(SceneClass: any): void {
		// //console.log(SceneClass);
		if (SceneClass == null) {
			Log.trace("runScene:scene is null");
			return;
		}

		let oldScene: BaseSYBScene = this._currScene;
		if (oldScene) {
			oldScene.onExit();
			oldScene = undefined;
		}
		let s: BaseSYBScene = new SceneClass();
		s.onEnter();
		this._currScene = s;
	}

	/**
	 * 获取当前Scene
	 * @returns {number}
	 */
	public getCurrScene(): BaseSYBScene {
		return this._currScene;
	}

	public getSceneName():string{
		if(this._currScene) {
			return egret.getQualifiedClassName(this._currScene);
		}
		return '';
	}
}
