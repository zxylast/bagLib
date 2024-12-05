/**
 * Created by hrz on 2017/11/27.
 */

class SelectRoleScene extends BaseSYBScene {
    constructor(){
        super();
    }

    /**
     * 进入Scene调用
     */
    public onEnter(): void {
        super.onEnter();

        this.addLayer(LayerSYBManager.UI_Main);
        this.addLayer(LayerSYBManager.UI_Tips);

        // // 播放背景音乐
        // SoundSYBManager.ins().playBg("login_mp3");
    }

    /**
     * 退出Scene调用
     */
    public onExit(): void {
        super.onExit();
    }
}