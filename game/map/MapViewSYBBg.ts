/**
 * MapView
 */
class MapViewSYBBg extends egret.DisplayObjectContainer {

	private maxImagX: number;
	private maxImagY: number;

	private mapName: string;

	private thumbnail: eui.Image;

	private _shape: egret.Shape = new egret.Shape;

	private _imageList: eui.Image[][];

	private lastUpdateX: number = 0;
	private lastUpdateY: number = 0;

	public isThumbnailComplete: boolean;

	private showImages: eui.Image[];

	private _poolImages:eui.Image[];

	private turn: number = 0;

	private _fileDic:{[key:string]:number};
	// private oldImgs = {};

	constructor() {
		super();

		//this.cacheAsBitmap = true;

		this.touchChildren = false;
		this.touchEnabled = false;


		let s: eui.Image = new eui.Image();
		this.addChild(s);
		this.thumbnail = s;
		this.thumbnail.addEventListener(egret.Event.COMPLETE, this.onThumbnailComplete, this);

		this._imageList = [];
		this.showImages = [];
		this._poolImages = [];
		this._fileDic = {};
	}

	public destructor(): void {
		this.thumbnail.removeEventListener(egret.Event.COMPLETE, this.onThumbnailComplete, this);
		this.removeChildren();
		this._imageList.length = 0;
	}

	private onThumbnailComplete(e: egret.Event): void {
		this.isThumbnailComplete = true;
		
		//this.updateHDMap({x: 0, y: 0}, true);
		if (e.target && e.target.name == this.mapName)
			this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
	}


	public initThumbnail(w: number, h: number, fName: string, turn: number): void {
		if (this.mapName != fName) {
			this.isThumbnailComplete = false;
			/**清空对象池 */
			// ObjectPool.clear();
		}
		// if (this.turn != turn && this.isThumbnailComplete == false) {
		// 	ObjectPool.clear();
		// }

		if (this.mapName != fName || this.turn != turn) {
			this.clearHDMap();
		}

		if (this.mapName != fName) {
			this.destroyFile();
		}

		this.mapName = fName;
		this.turn = turn;
		this.thumbnail.width = w;
		this.thumbnail.height = h;
		//this.thumbnail.source = `${MAP_DIR}${this.mapName}/small.jpg`;
		this.thumbnail.scaleX = turn ? -1 : 1;
		this.thumbnail.x = turn ? w : 0;
		this.thumbnail.name = this.mapName;

		let imgSize: number = 256;
		this.maxImagX = Math.floor(w / imgSize);
		this.maxImagY = Math.floor(h / imgSize);

		this.updateHDMap({ x: this.lastUpdateX, y: this.lastUpdateY }, true);
	}

	private clearHDMap(): void {
		// for (let j in this._imageList) {
		// 	let imgList = this._imageList[j];
		// 	for (let i in imgList) {
		// 		let img = imgList[i];
		// 		if(img) {
		// 			img.source = null;
		// 			img.scaleX = 1;
        //
		// 			if(this._poolImages.indexOf(img) < 0) {
		// 				this._poolImages.push(img);
		// 			}
		// 		}
		// 	}
		// }

		this._imageList = [];
		this.showImages = [];
		this.removeChildren();
		this.addChild(this.thumbnail);
	}

	private destroyFile() {
		// let baseAnalyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE);
		// for (let url in this._fileDic) {
		// 	baseAnalyzer.destroyRes(url);
		// }
		// this._fileDic = {};
	}

	private getImage(){
		return this._poolImages.pop() || new eui.Image();
	}

	public updateHDMap(p: { x: number, y: number }, force: boolean = false): void {

		let imgSize: number = 256;

		if (force || Math.abs(this.lastUpdateX - p.x) > imgSize / 4 || Math.abs(this.lastUpdateY - p.y) > imgSize / 4 || this.lastUpdateX == 0) {

			this.lastUpdateX = p.x;
			this.lastUpdateY = p.y;

			if (!this.isThumbnailComplete)
				return;

			let shows: eui.Image[] = [];
			let ww: number = StageSYBUtils.ins().getWidth();
			let hh: number = StageSYBUtils.ins().getHeight();

			let imgX: number = Math.max(Math.floor(-p.x / imgSize) - 1, 0);
			let imgY: number = Math.max(Math.floor(-p.y / imgSize) - 1, 0);

			let imgXCount: number = imgX + Math.floor(ww / imgSize) + 2;
			let imgYCount: number = imgY + Math.floor(hh / imgSize) + 2;
			// egret.log("aaa:" + imgXCount);
			// egret.log("bbb:" + this.maxImagX);
			if (this.turn) {
				for (let i = imgX; i <= imgXCount && i < this.maxImagX; i++) {
					let index: number = this.maxImagX - i > 0 ? this.maxImagX - i - 1 : 0;
					for (let j = imgY; j <= imgYCount && j < this.maxImagY; j++) {

						this._imageList[j] = this._imageList[j] || [];

						if (!this._imageList[j][index]) {
							//let sourceName: string = `${MAP_DIR}${this.mapName}/image/${j}_${index}.jpg`;
							// this._fileDic[sourceName] = 1;

							// let s: eui.Image = this.getImage();
							// s.source = sourceName;
							// s.name = sourceName;
							// s.scaleX = -1;
							// s.x = (i + 1) * imgSize;
							// s.y = j * imgSize;
							// this.addChild(s);
							// this._imageList[j][index] = s;
						} else {
							if(!this._imageList[j][index].parent){
								this.addChild(this._imageList[j][index]);
							}
						}
						shows.push(this._imageList[j][index]);
					}
				}
			} else {

				for (let i = imgX; i <= imgXCount && i < this.maxImagX; i++) {

					for (let j = imgY; j <= imgYCount && j < this.maxImagY; j++) {

						this._imageList[j] = this._imageList[j] || [];

						if (!this._imageList[j][i]) {
							// let sourceName: string = `${MAP_DIR}${this.mapName}/image/${j}_${i}.jpg`;
							// this._fileDic[sourceName] = 1;

							// let s: eui.Image = this.getImage();
							// s.source = sourceName;
							// s.name = sourceName;
							// s.x = i * imgSize;
							// s.y = j * imgSize;
							// this.addChild(s);
							// this._imageList[j][i] = s;
						} else {
							if(!this._imageList[j][i].parent){
								this.addChild(this._imageList[j][i]);
							}
						}
						shows.push(this._imageList[j][i]);
					}
				}
			}

			let len: number = this.showImages.length;
			for (let i: number = len - 1; i >= 0; i--) {
				if (shows.indexOf(this.showImages[i]) >= 0)
					continue;
				DisplaySYBUtils.removeFromParent(this.showImages[i]);
				// this.showImages.splice(i, 1); //无需移除 反正数组会被替换
			}
			this.showImages = shows;
		}



		// if (false) {
		// 	let ww = (StageSYBUtils.ins().getWidth() / 1) >> 0;
		// 	let hh = (StageSYBUtils.ins().getHeight() / 1) >> 0;
        //
		// 	let gsx = Math.max(Math.floor(-p.x / GameSYBMap.CELL_SIZE), 0);
		// 	let gsy = Math.max(Math.floor(-p.y / GameSYBMap.CELL_SIZE), 0);
        //
		// 	let gex = gsx + Math.ceil(ww / GameSYBMap.CELL_SIZE);
		// 	let gey = gsy + Math.ceil(hh / GameSYBMap.CELL_SIZE);
		// 	this.drawGrid({ x: gsx, y: gsy }, { x: gex, y: gey });
		// }
	}

	//调试用,网格
	private shape: egret.Shape[] = [];
	private shapeContainer: egret.DisplayObjectContainer;

	private drawGrid(s: XY, e: XY): void {
		this.clearDrawGrid();
		this.shapeContainer = this.shapeContainer || new egret.DisplayObjectContainer();
		this.shapeContainer.cacheAsBitmap = true;
		this.shapeContainer.touchEnabled = false;
		this.shapeContainer.touchChildren = false;
		for (let i = s.x; i < e.x; i++) {
			for (let j = s.y; j < e.y; j++) {
				let index = i * e.x + j;
				let rect: egret.Shape = this.shape[index];
				if (!rect)
					rect = this.shape[index] = new egret.Shape;
				rect.graphics.lineStyle(1, 0xFFFFFF);
				if (GameSYBMap.checkAlpha(i, j)) {
					rect.graphics.beginFill(0x0000ff, 0.8);
				}
				else if (GameSYBMap.checkWalkable(i, j)) {
					rect.graphics.beginFill(0x00ff00, 0.8);
				}
				else {
					rect.graphics.beginFill(0xff0000, 0.8);
				}
				rect.graphics.drawRect(0, 0, GameSYBMap.CELL_SIZE, GameSYBMap.CELL_SIZE);
				rect.graphics.endFill();
				rect.x = i * GameSYBMap.CELL_SIZE;
				rect.y = j * GameSYBMap.CELL_SIZE;

				let text: eui.Label = new eui.Label();
				text.size = 12;
				text.text = `${i},${j}`;
				text.x = i * GameSYBMap.CELL_SIZE;
				text.y = j * GameSYBMap.CELL_SIZE;
				text.name = "label" + i + "," + j;
				this.shapeContainer.addChild(text);
				this.shapeContainer.addChild(rect);
			}
		}
		this.addChild(this.shapeContainer);
	}

	public clearDrawGrid(): void {
		if (this.shapeContainer && this.shape) {
			while (this.shapeContainer.numChildren > 0) {
				this.shapeContainer.removeChildAt(0);
			}
			this.shape.length = 0;
		}
	}
}