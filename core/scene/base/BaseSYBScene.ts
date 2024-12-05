/**
 * Created by yangsong on 15-1-7.
 * Scene基类
 */
class BaseSYBScene {
	//当前所有Layer
	private _layers: Array<egret.DisplayObjectContainer>;

	/**
	 * 构造函数
	 */
	public constructor() {
		this._layers = new Array<egret.DisplayObjectContainer>();
	}

	/**
	 * 进入Scene调用
	 */
	public onEnter(): void {

	}

	/**
	 * 退出Scene调用
	 */
	public onExit(): void {
		ViewSYBManager.ins().closeAll();
		this.removeAllLayer();
	}

	/**
	 * 添加一个Layer到舞台
	 * @param layer
	 */
	public addLayer(layer: egret.DisplayObjectContainer): void {
		if (layer instanceof BaseSpriteLayer) {
			StageSYBUtils.ins().getStage().addChild(layer);
			this._layers.push(layer);
		}
		else if (layer instanceof BaseEuiSYBLayer) {
			StageSYBUtils.ins().getUIStage().addChild(layer);
			this._layers.push(layer);
		}
	}

	/**
	 * 添加一个Layer到舞台
	 * @param layer
	 */
	public addLayerAt(layer: egret.DisplayObjectContainer, index: number): void {
		if (layer instanceof BaseSpriteLayer) {
			StageSYBUtils.ins().getStage().addChildAt(layer, index);
			this._layers.push(layer);
		}
		else if (layer instanceof BaseEuiSYBLayer) {
			StageSYBUtils.ins().getUIStage().addChildAt(layer, index);
			this._layers.push(layer);
		}
	}

	/**
	 * 在舞台移除一个Layer
	 * @param layer
	 */
	public removeLayer(layer: egret.DisplayObjectContainer): void {
		if (layer instanceof BaseSpriteLayer) {
			StageSYBUtils.ins().getStage().removeChild(layer);
			this._layers.splice(this._layers.indexOf(layer), 1);
		}
		else if (layer instanceof BaseEuiSYBLayer) {
			StageSYBUtils.ins().getUIStage().removeChild(layer);
			this._layers.splice(this._layers.indexOf(layer), 1);
		}
	}

	/**
	 * Layer中移除所有
	 * @param layer
	 */
	public layerRemoveAllChild(layer: egret.DisplayObjectContainer): void {
		if (layer instanceof BaseSpriteLayer) {
			layer.removeChildren();
		}
		else if (layer instanceof BaseEuiSYBLayer) {
			(<BaseEuiSYBLayer>layer).removeChildren();
		}
	}

	/**
	 * 移除所有Layer
	 */
	public removeAllLayer(): void {
		while (this._layers.length) {
			let layer: egret.DisplayObjectContainer = this._layers[0];
			this.layerRemoveAllChild(layer);
			this.removeLayer(layer);
		}
	}
}