/**
 * 用户角色管理
 * @author
 *
 */
class RoleSYBMgr extends BaseSYBSystem {

	private errorCode: string[] = ["",
		"sql错误",
		"用户没登陆",
		"游戏服务没准备好",
		"角色上一次保存数据是否出现异常",
		"客户端选择角色的常规错误",
		"角色名称重复",
		"角色不存在",
		"错误的性别",
		"随机生成的名字已经分配完",
		"客户端上传的角色阵营参数错误",
		"客户端上传的角色职业参数错误",
		"名称无效，名称中包含非法字符或长度不合法",
		"如果玩家是帮主，不能删除该角色，需要玩家退帮",
		"已经登陆到其他服务器",
		"已经超过最大可建角色数量"
	];
	public static LONGIN_ERROR_CODE: any[] = [
		"",
		"密码错误",
		"没有这个账号",
		"网络异常，请刷新页面，最长需等待3分钟后重新登录",
		"服务器忙",
		"服务器维护中",
		"Session服务器出错，可能数据库没连接好",
		"不存在这个服务器",
		"账号已纳入防沉迷系统，是否需要进行身份证信息填写？"
	];

	private canEnter: boolean = false;
	private enterID: number = -1;
	public isFirstEnter: boolean = true;
	public lastRoleID: number = -1;//上次进入角色id
	public randomName: string = "";


	public static ins(): RoleSYBMgr {
		return super.ins() as RoleSYBMgr;
	}

	public constructor() {
		super();
		this.sysId = PackageSYBID.Login;

		this.regNetMsg(1, this.doCheckAccount);
		this.regNetMsg(2, this.postCreateRole);
		this.regNetMsg(4, this.doRoleList);
		this.regNetMsg(5, this.doEnterGame);
		this.regNetMsg(6, this.doRandom);

		this.observe(GameApp.ins().postPerLoadComplete, this.perCom);
	}

	private perCom(): void {
		this.canEnter = true;
		if (this.enterID != -1) {
			this.sendEnterGame(this.enterID);
		}
	}

	/**
	 * 连接服务器
	 */
	public connectServer(): void {
		GameSYBSocket.ins().login(LocationSYBProperty.openID, LocationSYBProperty.password, LocationSYBProperty.srvid, LocationSYBProperty.serverIP, LocationSYBProperty.serverPort);
	}


	/**
	 * 处理登录认证
	 * 255-1
	 * @param bytes
	 */
	private doCheckAccount(bytes: GameByteSYBArray): void {
		let result: number = bytes.readByte();
		if (result == 0) {
			//登录成功，请求角色列表
			let bytes: GameByteSYBArray = this.getBytes(4);
			bytes.writeByte(LocationSYBProperty.severGroupID);
			this.sendToServer(bytes);
		} else if (result == 3) {
			GameSYBSocket.accountCheck = false;
			
			let func = () => {
				Authorize.Instance.SDK.Reload();
			};
		} else {
			//alert("Connect failed:" + RoleSYBMgr.LONGIN_ERROR_CODE[result]);
		}
	}

	/**
	 * 处理角色列表
	 * 255-4
	 * @param bytes
	 */
	private doRoleList(bytes: GameByteSYBArray): void {
		let id: number = bytes.readInt();
		let code: number = bytes.readByte();
		switch (code) {
			case 0:
				RoleSYBMgr.ins().sendRandomName(1);
				//	SceneSYBManager.ins().runScene(CreateRoleScene);
				break;
			case 1:
				this.gameAppLoad().then(() => {
					let roleNum: number = bytes.readInt();
					let roleArr: SelectRoleData[] = [];
					for (let i: number = 0; i < roleNum; i++) {
						let role = new SelectRoleData(bytes);
						roleArr.push(role);
					}
					if (roleNum == 1) {
						this.enterID = roleArr[0].id;
						this.sendEnterGame(roleArr[0].id);
					} else if (!this.isFirstEnter && this.lastRoleID != -1) {
						this.sendEnterGame(this.lastRoleID);
					} else {
						SceneSYBManager.ins().runScene(SelectRoleScene);
					}
				});
				break;
		}
	}

	private async gameAppLoad() {
		if (SceneSYBManager.ins().getSceneName() == SceneSYBManager.CREATE_ROLE) {
			SceneSYBManager.ins().runScene(LoadingScene);
		}
		else {
			GameApp.ins().load();
		}
		while (true) {
			if (!GameApp.ins().isLoading()) {
				break;
			}
			await wait();
		}
	}


	/**
	 * 请求进入游戏
	 * 255-5
	 */
	public sendEnterGame(roleID: number): void {
		let bytes: GameByteSYBArray = this.getBytes(5);
		// bytes.writeCmd(this.sysId, 5);
		bytes.writeInt(roleID);
		bytes.writeString(Authorize.Instance.SDK.SDKData.PlatformId);
		bytes.writeString(LocationSYBProperty.pfid);
		bytes.writeString(LocationSYBProperty.appid);
		this.sendToServer(bytes);
		this.lastRoleID = roleID;
	}


	/**
	 * 处理进入游戏
	 * 255-5
	 * @param bytes
	 */
	private doEnterGame(bytes: egret.ByteArray): void {
		let result: number = bytes.readByte();
		switch (result) {
			case 0:
				break;
			case 1:
				//验证成功，正在登录游戏
				//debug.log("进入游戏成功");
				//成功进入游戏后，将正在连接的跨服状态关掉
				SceneSYBManager.ins().runScene(MainScene);
				ServerSYBManager.Instance.Save();
				//进入打点数据 避免创角后断网重新链接，造成数据多发
				if (this.isFirstEnter) {
					this.isFirstEnter = false;
				}
				break;
			case -7:
				 UserSYBTips.ins().showTaskTips("账号异常，请联系客服");
				break;
			default:
				//alert("错误码:" + result);
				break;
		}
	}


	/**
	 * 请求创建角色
	 * 255-2
	 * @param roleName
	 * @param sex
	 * @param job
	 * @param head
	 * @param camp
	 * @param pf
	 */
	public sendCreateRole(roleName: string, sex: number, job: number, head: number, camp: number, pf: string): void {
		let bytes: GameByteSYBArray = this.getBytes(2);
		bytes.writeString(roleName);
		bytes.writeByte(sex);
		bytes.writeByte(job);
		// bytes.writeByte(head);
		bytes.writeString(Authorize.Instance.SDK.SDKData.PlatformId);
		bytes.writeString(LocationSYBProperty.pfid);
		bytes.writeString(LocationSYBProperty.appid);
		bytes.writeByte(LocationSYBProperty.severGroupID);
		this.sendToServer(bytes);
	}

	/**
	 * 处理创建角色
	 * 255-2
	 * @param bytes
	 * @returns {boolean}是否有资源没加载完
	 */
	public postCreateRole(bytes: GameByteSYBArray): number | boolean {
		let id: number = bytes.readInt();
		let result: number = bytes.readByte();
		if (result != 0) {
			this.showErrorTips(result);
			return result;
		}

		SoundUtil.ins().playEffect(SoundUtil.CREATE_ROLE);
		SoundUtil.ins().delayTime(3000);//播放完创建角色声音才播放其他声音

		if (!LocationSYBProperty.isFirstLoad || this.canEnter) {
			this.gameAppLoad().then(() => {
				this.sendEnterGame(id);
			});
			return false;
		}
		this.enterID = id;
		return false;
	}

	/**
	 * 请求随机名字
	 * 255-6
	 * @param sex
	 */
	public sendRandomName(sex: number): void {
		let bytes: GameByteSYBArray = this.getBytes(6);
		bytes.writeByte(sex);
		this.sendToServer(bytes);
	}

	/**
	 * 处理随即名字
	 * 255-6
	 * @param bytes
	 */
	private doRandom(bytes: GameByteSYBArray): void {
		let result: number = bytes.readByte();
		if (result == 0) {
			let sex: number = bytes.readByte();
			let name: string = bytes.readUTF();
			//	this.setName(name);
			this.randomName = name;

			RoleSYBMgr.ins().sendCreateRole(
				name,		//角色名字
				0,				//性别
				1,				//职业
				0,							//头像
				0,							//阵营
				""							// 平台
			);
		}
	}

	// private setName(str: string): void {
	// 	this.createRoleView.setName(str);
	// }

	// private get createRoleView(): CreatRoleView2 {
	// 	return <CreatRoleView2>ViewSYBManager.ins().getView(CreatRoleView2);
	// }

	/**
	 * 弹出错误提示
	 */
	public showErrorTips(result: number): void {
		if (result == 0)
			return;
		UserSYBTips.ins().showTips(this.errorCode[Math.abs(result)]);
	}


}

namespace GameSystem {
	export let roleMgr = RoleSYBMgr.ins.bind(RoleSYBMgr);
}