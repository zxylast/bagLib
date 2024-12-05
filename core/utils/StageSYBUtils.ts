/**
 * Created by yangsong on 2014/12/3.
 * Stage相关工具类
 */
class StageSYBUtils extends BaseSYBClass {
	//UIStage单例
	private static _uiStage: eui.UILayer;

	private rect1: eui.Rect = new eui.Rect;
	private rect2: eui.Rect = new eui.Rect;

	/**初始化帧率 */
	public frameRate: number;

	/**
	 * 构造函数
	 */
	public constructor() {
		super();
		this.rect1.touchEnabled = false;
		this.rect1.fillColor = 0x000000;
		this.rect1.alpha = 1;
		this.rect2.touchEnabled = false;
		this.rect2.fillColor = 0x000000;
		this.rect2.alpha = 1;
		if (StageSYBUtils._uiStage == null) {
			StageSYBUtils._uiStage = new eui.UILayer();
			StageSYBUtils._uiStage.touchEnabled = false;
			// StageSYBUtils._uiStage.percentHeight = 100;
			// StageSYBUtils._uiStage.percentWidth = 100;
			this.getStage().addChild(StageSYBUtils._uiStage);
		}
		this.getStage().addEventListener(egret.Event.RESIZE, this.onResize, this);
		this.frameRate = this.getStage().frameRate;

	}

	/**
	 * 屏幕尺寸变化时调用
	 */
	protected onResize(): void {
		let stageWidth = this.getStage().stageWidth;
		let stageHeight = this.getStage().stageHeight;
		// window["SYsendLog"] && window["SYsendLog"]("resize:"+stageWidth+",stageHeight:"+stageHeight+",_uiStageHeight:"+StageSYBUtils._uiStage.height
		// 	+"_uiStageY:"+StageSYBUtils._uiStage.y+",this.getStage().y:"+this.getStage().y);
		this.fixIphoneX(true);
	}

	public fixIphoneX(resize = false): void {
		let stageWidth = this.getStage().stageWidth;
		let stageHeight = this.getStage().stageHeight;
		// !resize && window["SYsendLog"] && window["SYsendLog"]("stageWidth:"+stageWidth+",stageHeight:"+stageHeight+",_uiStageHeight:"+StageSYBUtils._uiStage.height
		// 	+"_uiStageY:"+StageSYBUtils._uiStage.y+",this.getStage().y:"+this.getStage().y);
		let rate = stageHeight / stageWidth
		// if( StageSYBUtils._uiStage.height-stageHeight<2 && GameApp.ins().state >=5 && resize){
		// 	StageSYBUtils._uiStage.y = 0
		// 	return;
		// }
		StageSYBUtils._uiStage.y = 0
		if (rate > 2.0) {
			this.getStage().addChild(this.rect1);
			this.getStage().addChild(this.rect2);
			let height = ((rate - 2.0) / rate * 0.5) * stageHeight;
			//StageSYBUtils._uiStage.y = ((rate-2.0)/rate*0.5)*stageHeight;
			StageSYBUtils._uiStage.height = 2.0 / rate * stageHeight;
			StageSYBUtils._uiStage.x = 0;
			StageSYBUtils._uiStage.y = height+20;
			StageSYBUtils._uiStage.top = height+20;
			StageSYBUtils._uiStage.bottom = height-20;
			this.rect1.width = stageWidth;
			this.rect1.height = height+20;
			this.rect2.x = 0;
			this.rect2.width = stageWidth;
			this.rect2.height = height
			this.rect2.y = stageHeight - height+20;
		}
		else if (rate < (16 / 9)) {
			this.getStage().addChild(this.rect1);
			this.getStage().addChild(this.rect2);
			//StageSYBUtils._uiStage.y = (((16/9)-rate)/rate*0.5)*stageWidth;
			StageSYBUtils._uiStage.width = rate / (16 / 9) * stageWidth;
			this.rect1.width = (stageWidth - StageSYBUtils._uiStage.width) / 2;
			this.rect1.height = StageSYBUtils._uiStage.height;
			this.rect2.width = this.rect1.width;
			this.rect2.height = this.rect1.height;
			this.rect2.x = this.rect1.width + StageSYBUtils._uiStage.width;
			this.rect2.y = 0;
			StageSYBUtils._uiStage.x = this.rect1.width;
			StageSYBUtils._uiStage.y = 0;
			//StageSYBUtils.ins().setScaleMode(egret.StageScaleMode.FIXED_WIDTH);
		}
		//console.log("stageWidthHeight", stageWidth, stageHeight, StageSYBUtils._uiStage.height);


	}


	public static ins(): StageSYBUtils {
		return super.ins() as StageSYBUtils;
	}
	/**
	 * 获取游戏的高度
	 * @returns {number}
	 */
	public getHeight(): number {
		return this.getStage().stageHeight;
	}

	/**
	 * 获取游戏宽度
	 * @returns {number}
	 */
	public getWidth(): number {
		return this.getStage().stageWidth;
	}

	/**
	 * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
	 * @param value
	 */
	public setTouchChildren(value: boolean): void {
		this.getStage().touchChildren = value;
	}

	/**
	 * 设置同时可触发几个点击事件，默认为2
	 * @param value
	 */
	public setMaxTouches(value: number): void {
		this.getStage().maxTouches = value;
	}

	/**
	 * 设置帧频
	 * @param value
	 */
	public setFrameRate(value: number): void {
		this.getStage().frameRate = value;
	}

	/**
	 * 设置适配方式
	 * @param value
	 */
	public setScaleMode(value: string): void {
		this.getStage().scaleMode = value;
	}

	/**
	 * 获取游戏Stage对象
	 * @returns {egret.MainContext}
	 */
	public getStage(): egret.Stage {
		return egret.MainContext.instance.stage;
	}

	/**
	 * 获取唯一UIStage
	 * @returns {eui.UILayer}
	 */
	public getUIStage(): eui.UILayer {
		return StageSYBUtils._uiStage;
	}
}
