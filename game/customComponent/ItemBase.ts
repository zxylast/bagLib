/**
 * 基础道具显示类
 * (注意：内部带了touch事件，需要手动析构)
 */
class ItemBase extends BaseItemSYBRender {

	//白,绿,蓝,紫,橙,红,金
	public static QUALITY_COLOR: number[] = [0xf3f1ed, 0x01BC01, 0x237696, 0xd15aef, 0xF4A61F, 0xf14d41, 0xFFD700];
	protected itemIcon: ItemIcon;
	protected itemConfig: ItemConfig;
	protected itemData: ItemData;
	private count: eui.Label;
	private handle: number = 0;
	//是否是货币
	private isCurrency: boolean = false;
	private curCount: number;

	protected itemEffect: MovieSYClip;

	constructor() {
		super();
		this.skinName = 'ItemSkin';
		this.init();
	}

	/**触摸事件 */
	public init(): void {
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
	}

	protected dataChanged(): void {
		this.clear();
		this.isCurrency = false;
		if (!this.data) {
			this.itemIcon.setData(null);
			this.count.text = '';
			return;
		}
		if (this.data.type == 0) {
			let q: number = RewardData.getCurrencyQuality(this.data.id);
			this.isCurrency = true;
			this.itemIcon.img_Icon.source = RewardData.getCurrencyRes((<RewardData>this.data).id);
			this.itemIcon.img_bg.source = `gezi_${q}`;
			this.setCount(this.data.count);
			this.curCount = this.data.count;

			if (this.data.id != 2) {
				this.showItemEffect3(q)
			}
		} else {
			let q = 0;
			if (this.data instanceof ItemData) {
				this.itemData = this.data;
				this.itemConfig = this.data.itemConfig;
				this.itemIcon.setData(this.itemConfig, this.itemData.quality);
				this.setCount(this.itemData.count);
				this.curCount = this.itemData.count;
				q = this.itemData.quality;
			} else if (this.data instanceof ItemRewardData) {
				this.handle = this.data.handle;
				this.itemConfig = GlobalJYConfig.ItemConfig[this.data.id];
				this.itemIcon.setData(this.itemConfig, this.itemConfig.quality);
				this.setCount(this.data.count);
				this.curCount = this.data.count;

				q = this.itemConfig.quality;
			} else {
				this.itemConfig = GlobalJYConfig.ItemConfig[this.data.id];
				this.itemIcon.setData(this.itemConfig, this.itemConfig.quality);
				let c = this.data.count ? this.data.count : 1;
				this.setCount(c);
				this.curCount = c;
				q = this.itemConfig.quality;
			}
			if (this.itemConfig.eff) {
				this.showItemEffect(this.itemConfig.eff);
			} else {
				this.showItemEffect2(q);
			}

		}
		this.once(egret.Event.REMOVED_FROM_STAGE, () => {
			this.clear();
		}, this);
	}

	/**
	 * 清除格子数据
	 */
	protected clear(): void {
		this.itemConfig = null;
		this.itemData = null;
		if (this.itemIcon && typeof this.itemIcon.setData == 'function') {
			this.itemIcon.setData(null);
		}
		if (this.itemEffect) this.itemEffect.destroy();
		DisplaySYBUtils.removeFromParent(this.itemEffect);
	}

	public destruct(): void {
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onClick, this);
	}


	public onClick() {
		this.showCurrency();
		this.showDetail();
	}

	public getShowCurrency(isShow: number = 0): void {
		this.showCurrency(isShow);
	}

	public getShowDetail(isShow: number = 0): void {
		this.showDetail(isShow);
	}

	/** 货币 */
	protected showCurrency(isShow: number = 0) {
		if (!this.isCurrency) {
			return;
		}
		// ViewSYBManager.ins().open(BagMoneyDetailedView, this.data);
		// switch (this.data.id) {
		// 	case MoneyConst.NumericType_YB://元宝
		// 		break;
		// }
	}

	/** 非货币 */
	protected showDetail(isShow: number = 0) {
		if (!this.itemConfig) {
			return;
		}
		switch (this.itemConfig.type) {
			case BagMainType.Type1:
				break;
			case BagMainType.Type2:
				switch (this.itemConfig.subType) {
					case BagSubType.Type3:
						let cfgTips3 = GlobalJYConfig.ItemRandomConfig[this.itemConfig.id];
						if (cfgTips3) {
							ViewSYBManager.ins().open(ShopBXTips2, cfgTips3);
						}
						break;
				}

			default:

				break;
		}
	}

	public setCount(num: number): void {
		this.count.text = num && num > 1 ? CommonSYBUtils.overLengthChange(num) : "";
	}

	public showItemEffect(effectName: string): void {

		this.itemEffect = this.itemEffect || new MovieSYClip();
		this.itemEffect.touchEnabled = false;
		this.itemEffect.x = 52;
		this.itemEffect.y = 55;
		this.addChild(this.itemEffect);
		this.itemEffect.playFile(RES_DIR_EFF + effectName, -1);
	}

	public showItemEffect2(quality: number): void {
		if (quality < 5) return;
		let effectName: string = "";
		this.itemEffect = this.itemEffect || new MovieSYClip();
		this.itemEffect.touchEnabled = false;

		effectName = "itemEff_" + quality;
		if (quality < 6) {
			this.itemEffect.x = 47;
			this.itemEffect.y = 51;
			this.itemEffect.scaleX = 0.97;
			this.itemEffect.scaleY = 0.97;
		} else {
			this.itemEffect.x = 75;
			this.itemEffect.y = 65;
			this.itemEffect.scaleX = 1.6;
			this.itemEffect.scaleY = 1.6;
		}
		this.addChild(this.itemEffect);
		this.itemEffect.playFile(RES_DIR_EFF + effectName, -1);
	}

	public showItemEffect3(q: number): void {
		if (q < 4) return;
		let effectName: string = "";
		this.itemEffect = this.itemEffect || new MovieSYClip();
		this.itemEffect.touchEnabled = false;

		effectName = "itemEff_" + q;
		this.itemEffect.x = 47;
		this.itemEffect.y = 51;
		this.itemEffect.scaleX = 0.97;
		this.itemEffect.scaleY = 0.97;

		this.addChild(this.itemEffect);
		this.itemEffect.playFile(RES_DIR_EFF + effectName, -1);
	}

	public showBg(isShow: boolean) {
		this.itemIcon.img_bg.visible = isShow;
	}

	public showItemEff(isShow: boolean) {
		if (!isShow) {
			DisplaySYBUtils.removeFromParent(this.itemEffect);
		}
	}

	public showNum(isShow: boolean) {
		this.count.visible = isShow;
	}

	public getItemIcon() {
		return this.itemIcon;
	}
}