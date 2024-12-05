/**
 * Created by husong on 4/10/15.
 */
class EasySYBLoading extends BaseSYBClass {

	private content: egret.Sprite = null;
	private speed: number = 10 / (1000 / 60);
	private averageUtils: AverageSYBUtils;
	private uiImageContainer: egret.DisplayObjectContainer;
	private uiImage: egret.Bitmap;

	constructor() {
		super();
		this.init();
	}

	public static ins(): EasySYBLoading {
		return super.ins() as EasySYBLoading;
	}

	private init(): void {
		this.averageUtils = new AverageSYBUtils();

		this.content = new egret.Sprite();
		this.content.graphics.beginFill(0x000000, 0.2);
		this.content.graphics.drawRect(0, 0, StageSYBUtils.ins().getWidth(), StageSYBUtils.ins().getHeight());
		this.content.graphics.endFill();
		this.content.touchEnabled = true;

		this.uiImageContainer = new egret.DisplayObjectContainer();
		this.uiImageContainer.x = this.content.width * 0.5;
		this.uiImageContainer.y = this.content.height * 0.5;
		this.content.addChild(this.uiImageContainer);

		this.uiImage = new egret.Bitmap();
		this.uiImageContainer.addChild(this.uiImage);

		this.loadReel();

		GameSYBSocket.ins().setOnClose(this.showLoading, this);
		GameSYBSocket.ins().setOnConnected(this.hideLoading, this);
	}

	private loadReel() {
		let self = this;
		let load_Reel =(RES_DIR + "/load_Reel.png");
		load_Reel = load_Reel.replace('//load_Reel','/load_Reel');
		RES.getResByUrl(load_Reel, function (texture: egret.Texture): void {
			let img: egret.Bitmap = self.uiImage;
			img.texture = texture;
			img.x = -img.width * 0.5;
			img.y = -img.height * 0.5;
		}, this, RES.ResourceItem.TYPE_IMAGE);
	}

	public showLoading(): void {
		StageSYBUtils.ins().getStage().addChild(this.content);
		this.loadReel();
		// egret.Ticker.getInstance().register(this.enterFrame, this);
		egret.startTick(this.enterFrame, this);
	}

	public hideLoading(): void {
		if (this.content && this.content.parent) {
			StageSYBUtils.ins().getStage().removeChild(this.content);
			this.uiImageContainer.rotation = 0;
		}
		egret.stopTick(this.enterFrame, this);
	}

	private enterFrame(time: number): boolean {
		this.averageUtils.push(this.speed * time);
		this.uiImageContainer.rotation += this.averageUtils.getValue();
		return false;
	}
}
