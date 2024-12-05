/**
 * Created by yangsong on 15-1-7.
 */
class GameBaseEuiSYBLayer extends BaseEuiSYBLayer {

	bg:eui.Image;

	public constructor() {
		super();

		this.percentWidth = 100;
		this.percentHeight = 100;

		this.touchEnabled = false;
		this.addBg();
	}

	private addBg():void{
		this.bg = new eui.Image()
		this.addChild(this.bg);
		this.bg.percentWidth = 100;
		this.bg.percentHeight = 100;
		this.bg.source = "https://cdnws.shanyougz.com/game_base_bg.png"
		//console.log("addBg："+this.bg.source);

	}


}