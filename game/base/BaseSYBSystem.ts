/**
 * Created by zhangac on 2016/9/28.
 */

class BaseSYBSystem extends BaseSYBClass {
	public sysId: number;

	public constructor() {
		super();

		//必须在init前
		try{
			MessageSYBCenter.compile(egret.getDefinitionByName(egret.getQualifiedClassName(this)));
		}
		catch (e) {
			//console.log(egret.getQualifiedClassName(this));
			//console.log("BaseSYBSystem"+this);
		}

		this.observe(GameApp.ins().postLoginInit, this.initLogin);
		this.observe(GameApp.ins().postZeroInit, this.initZero);
		this.observe(GameApp.ins().postLoginAgain, this.loginAgain);
	}


	protected regNetMsg(msgId: number, fun: (...params: any[]) => void): void {
		GameSYBSocket.ins().registerSTCFunc(this.sysId, msgId, fun, this);
	}

	/**
	 * 游戏登录初始化
	 */
	protected initLogin(): void {

	}

	/**
	 * 0点游戏数据请求
	 */
	protected initZero(): void {

	}

	/**
	 * 选服登录
	 */
	protected loginAgain(): void {

	}

	/**
	 * 从对象池获取一个bytes对象
	 */
	private getGameByteArray(): GameByteSYBArray {
		return GameSYBSocket.ins().getBytes();
	}

	public getBytes(msgid: number): GameByteSYBArray {
		let bytes = this.getGameByteArray();
		bytes.writeCmd(this.sysId, msgid);
		return bytes;
	}

	public sendBaseProto(msgid: number) {
		let bytes = this.getGameByteArray();
		bytes.writeCmd(this.sysId, msgid);
		this.sendToServer(bytes);
	}

	/**
	 * 发送到服务器
	 * @param bytes
	 */
	public sendToServer(bytes: GameByteSYBArray): void {
		GameSYBSocket.ins().sendToServer(bytes);
	}

	public observe(func: Function, myfunc: Function) {
		MessageSYBCenter.addListener(func, myfunc, this);
	}

	public removeObserve() {
		MessageSYBCenter.ins().removeAll(this);
	}

	protected associated(fun: Function, ...funs: Function[]): void {

		let isDelayCall: boolean = false;

		let callFunc = () => {
			isDelayCall = false;
			fun.call(this);
		}

		let delayFunc = () => {
			if (!isDelayCall) {
				isDelayCall = true;
				TimerSYBManager.ins().doTimer(60, 1, callFunc, this);
			}
		}

		for (let i of funs) {
			this.observe(i, delayFunc);
		}
	}

}

MessageSYBCenter.compile(BaseSYBSystem);
