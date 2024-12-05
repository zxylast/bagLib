class ItemIcon extends BaseItemSYBRender {

	public config: ItemConfig;
	public img_bg: eui.Image;
	public img_Icon: eui.Image;

	public constructor() {
		super();
		this.skinName = "ItemIconSkin";
	}

	//装备品质随机获取,默认最低品质
	public setData(config: ItemConfig, quality: number = 0) {
		this.config = config;
		if (!config) {
			this.img_Icon.source = '';
			this.img_bg.source = 'gezi_di';
		} else {
			this.img_Icon.source = ItemConfig.GetIcon(config);
			this.img_bg.source = 'gezi_' + quality;

		}
	}
}