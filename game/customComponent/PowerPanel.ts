/**
 * 战斗力
 */
class PowerPanel extends BaseSYBView {
	protected totalPower: egret.DisplayObjectContainer;
	private flameMC: MovieSYClip;
	public flameGroup: eui.Group;
	private powerImg: eui.Image;
	private bgImg: eui.Image;
	private showBg: boolean = true;
	private imgWidth: number = 72;
	/**
	 * 战斗力
	 */
	public power: number;

	public _isInit: boolean = false;

	constructor() {
		super();
	}

	public childrenCreated(): void {
		this.init();
	}

	public init(): void {
		if (this._isInit) {

		} else {
			this._isInit = true;
			//this.playFlameMC();
			this.totalPower = BitmapSYBNumber.ins().createNumPic(0, "8", 5);
			this.totalPower.x = 120;
			this.totalPower.y = 20;
			this.totalPower.scaleX = this.totalPower.scaleX = 1.2;
			this.addChild(this.totalPower);
			this.initPos();

		}
	}

	public setPower(value: number) {
		this.power = value;
		if (!this.totalPower) {
			this.init();
		}
		BitmapSYBNumber.ins().changeNum(this.totalPower, value, "8", 5);
		this.initPos();
	}

	private initPos(): void {
		if (!this.showBg) return;
		this.showBg = false;
		//let tempWidth = this.totalPower.width > 30 ? this.totalPower.width : 30;
		let tempWidth = this.totalPower.width > 145 ? this.totalPower.width : 145;
		this.totalPower.x = this.width - tempWidth - 60;
		this.powerImg.x = this.totalPower.x - this.imgWidth - 10;
	}

	public setBgVis(bool: boolean): void {
		this.bgImg.visible = bool;
		this.flameGroup.visible = bool;
		this.showBg = bool;
	}

	public setBgSource(str: string): void {
		this.bgImg.source = str;
	}

	public setMcVisible(bool) {
		this.flameGroup.visible = bool;
	}

	public setPowerXY(bgImgWid: number, y: number): void {//传入背景图片的宽
		if (bgImgWid > 85) {//85=默认图片的宽
			this.totalPower.x = this.totalPower.x + (bgImgWid - 85);
		}
		this.totalPower.y = y;
	}

	public setScale(scale: number): void {
		this.totalPower.scaleX = this.totalPower.scaleY = scale;
	}

	/**
	 * 播放火焰动画
	 */
	private playFlameMC() {
		if (this.flameMC) {
			this.flameMC.play(-1);
		}
		else {
			this.flameMC = new MovieSYClip();
			this.flameMC.x = 76;
			this.flameMC.y = 23;
			this.flameMC.playFile(RES_DIR_EFF + "zhanduolibeijing", -1);
			this.flameGroup.addChild(this.flameMC);
		}
	}

	public destructor(): void {
		DisplaySYBUtils.removeFromParent(this);
	}
}