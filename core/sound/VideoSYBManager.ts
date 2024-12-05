class VideoSYBManager extends BaseSYBClass {

    private loadVideo:egret.Video;
    private lastUrl:string;
    private loaded:boolean = false;
    private playEnd:boolean = false;

	public constructor() {
        super();
        this.loadVideo = new egret.Video();
        this.loadVideo.x = 200;
        this.loadVideo.y = 200;
        this.loadVideo.width = 200;
        this.loadVideo.visible = false;
        this.loadVideo.height = 400;
        this.loadVideo.addEventListener(egret.Event.COMPLETE, this.onResourceLoadComplete, this);
        this.loadVideo.addEventListener(egret.Event.ENDED, this.onPlayEnd, this);
        StageSYBUtils.ins().getStage().addChild(this.loadVideo)
    }

    public static ins(): VideoSYBManager {
		return super.ins() as VideoSYBManager;
	}

    public loadAndPlay(videoUrl:string, ...args):void{
        this.loadVideo.load(videoUrl);
        this.lastUrl = videoUrl;
    }


	/**
	 * 资源加载完成
	 * @param event
	 */
	private onResourceLoadComplete():void {
		this.loadVideo.play();
	}

    /**
	 * 资源加载完成
	 * @param event
	 */
	private onPlayEnd():void {
		this.loadVideo.close();
	}

}