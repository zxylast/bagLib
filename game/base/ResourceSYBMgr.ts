/**
 * Created by hrz on 2018/1/25.
 */

class ResourceSYBMgr extends BaseSYBSystem {
    private isFirstEnter: boolean = true;

    private resDisTime: any = {};

    constructor() {
        super();
        // this.observe(GameSYBLogic.ins().postEnterMap, this.destroy);
        // this.start();
    }

    static ins(): ResourceSYBMgr {
        return super.ins() as ResourceSYBMgr;
    }

    public start() {
        //30秒清一次
        TimerSYBManager.ins().doTimer(30*1000, 0, this.destroy, this);
    }

    private isDelayDestroy: boolean = false;

    private destroy() {
        if (!this.isFirstEnter) {
            // ViewSYBManager.ins().destroyAllNotShowView();
            this.destroyRes();
        } else {
            this.isFirstEnter = false;
            this.start();
        }
    }


    public destroyWin() {
        // ViewSYBManager.ins().destroyAllNotShowView();
        this.destroyUIRes();
    }

    public disposeResTime(hashCode: number) {
        this.resDisTime[hashCode] = egret.getTimer();
    }

    @callDelay(3000)
    private destroyRes() {
        let list = RES["config"].config.fileSystem["fsData"];
        if(!list){
            return;
        }
        let t = egret.getTimer();
        for(var key in list){
            if (list[key]["url"].indexOf("/fnt/") >= 0)
                continue;
            if (list[key]["url"].indexOf("/qianruxiaoyouxi") >= 0)
                continue;
            if (list[key]["url"].indexOf("/dragonbonesmin") >= 0){
                continue;
            }
            let texture = RES.getRes(key);
            if(texture && texture.$bitmapData){
                if (this.checkCanDestroy(texture) && this.checkMcCanDestroy(texture.bitmapData)) {
                // bit += texture.bitmapData.width * texture.bitmapData.height * 4;
                    RES.destroyRes(key);
                }
            }
            // if (egret.getTimer() - t > 15) {
            //     //console.log("bareak clear", key);
            //     break;
            // }
        }
        // DragonBones.ins().checkDestory();
        // //console.log("destroyRes Time:"+(egret.getTimer()-t));

        // //console.log("time:"+(egret.getTimer() - t), "bit:"+bit);
    }

    @callDelay(3000)
    private destroyUIRes() {
        // let baseAnalyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE);
        // let fileDic = baseAnalyzer['fileDic'];

        // let baseJson = RES.getAnalyzer(RES.ResourceItem.TYPE_JSON);
        // let resConfig: RES.ResourceConfig = baseJson["resourceConfig"];
        // let t = egret.getTimer();
        // // let bit:number = 0;//释放字节
        // for (let key in fileDic) {
        //     let json = resConfig.getRawResourceItem(key);
        //     if (json && json.url.indexOf("public/") >= 0) {
        //         continue;
        //     }

        //     // if (key.indexOf(MAP_DIR) >= 0 ||(key.indexOf(RES_DIR) >= 0)) continue;
        //     if ((key.indexOf(RES_DIR) >= 0)) continue;
        //     let texture: egret.Texture = fileDic[key];

        //     if (this.checkCanDestroy(texture) && this.checkMcCanDestroy(texture.bitmapData)) {
        //         // bit += texture.bitmapData.width * texture.bitmapData.height * 4;
        //         RES.destroyRes(key);
        //     }

        //     if (egret.getTimer() - t > 3) {
        //         break;
        //     }
        // }

        // //console.log("time:"+(egret.getTimer() - t), "bit:"+bit);

    }

    public checkBitmapSize() {
        // let baseAnalyzer = RES.getAnalyzer(RES.ResourceItem.TYPE_IMAGE);
        // let fileDic = baseAnalyzer['fileDic'];
        // let bit: number = 0;
        // for (let key in fileDic) {
        //     let texture: egret.Texture = baseAnalyzer.getRes(key);
        //     bit += texture.bitmapData.width * texture.bitmapData.height * 4;
        // }
        // //console.log("bit:" + bit);
        // return bit;
    }

    private checkCanDestroy(bitmapData: egret.Texture) {
        let hashCode: number;
        if ((<egret.Texture>bitmapData).bitmapData && (<egret.Texture>bitmapData).bitmapData.hashCode) {
            hashCode = (<egret.Texture>bitmapData).bitmapData.hashCode;
        }
        else {
            hashCode = bitmapData.hashCode;
        }
        if (!hashCode) {
            return false;
        }
        let arr = egret.BitmapData['_displayList'][hashCode];
        if (!arr || !arr.length) {
            if (!this.resDisTime[hashCode])
                return true;
            if ((egret.getTimer() - this.resDisTime[hashCode]) > 10000) {
                delete egret.BitmapData['_displayList'][hashCode];
                delete this.resDisTime[hashCode];
                return true;
            }

        }
        return false;
    }

    private checkMcCanDestroy(bitmapData: egret.BitmapData) {
        if (!bitmapData) return false;
        let hashCode = bitmapData.hashCode;
        let arr = MovieSYClip.displayList[hashCode];
        if (!arr || !arr.length) {
            if (!this.resDisTime[hashCode])
                return true;
            if ((egret.getTimer() - this.resDisTime[hashCode]) > 10000) {
                delete MovieSYClip.displayList[hashCode];
                delete this.resDisTime[hashCode];
                return true;
            }

        }
        return false;
    }

    public reloadContainer(obj: egret.DisplayObjectContainer, focus: boolean = false) {
        let num = obj.numChildren;
        for (let i = 0; i < num; i++) {
            let img = obj.getChildAt(i);
            if (img instanceof eui.Image) {
                this.reloadImg(img, focus);
            } else if (img instanceof egret.DisplayObjectContainer) {
                this.reloadContainer(img, focus);
            }
        }
    }

    public reloadImg(image: eui.Image, focus: boolean = false) {
        let source = image.source;
        if (source) {
            if (!focus) {
                if (image.$bitmapData || (image.texture && image.texture.bitmapData))
                    return;
            }

            image.source = null;
            image.source = source;
        }
    }
}

namespace GameSystem {
    export let resourceMgr = ResourceSYBMgr.ins.bind(ResourceSYBMgr);
}