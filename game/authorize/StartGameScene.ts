/**
 *
 * @author
 *
 */
class StartGameScene extends BaseSYBScene {
	/**
	 * 构造函数
	 */
	public constructor() {
		super();
	}

	/**
	 * 进入Scene调用
	 */
	public onEnter(): void {
		super.onEnter();
		this.addLayer(LayerSYBManager.UI_Main);
		this.addLayer(LayerSYBManager.UI_Tips);
		ViewSYBManager.ins().open(StartGameView);
		GameApp.ins().state = 0;
		GameSYBSocket.ins().close();
		GameSYBSocket.ins().newSocket();
	}

	/**
	 * 退出Scene调用
	 */
	public onExit(): void {
		ViewSYBManager.ins().close(StartGameView);
		super.onExit();
	}

}
