/**
 * 请在白鹭引擎的Main.ts中调用 platform.login() 方法调用至此处。
 */
import mgsdk from "./mgsdk_20240423.min.js";

class WxgamePlatform {
    openid="";
    timestamp ="";
    username ="";
    actorname ="";
    actorid = 0;
    sign = "";
    /*系统 0web 1ios 3android*/
    system = 1;
    systemInfo = {};
    settingInfo = {};
    loginSession = true;
    shareCount = 0;
    inviteCount = 0;
    newClient = 0;
    serverId = 0;
    shareText = [["敢欺负我阿鱿，看我不收拾你！", "https://cdnws.shanyougz.com/webms/lingyue_wx/share/share1.jpg"],["可爱与实力并存，非我胖欧莫属！", "https://cdnws.shanyougz.com/webms/lingyue_wx/share/share2.jpg"],["萌趣冒险，来玩即领超值福利！", "https://cdnws.shanyougz.com/webms/lingyue_wx/share/share3.jpg"],["全新东方英雄，自由搭配，输出爆表！", "https://cdnws.shanyougz.com/webms/lingyue_wx/share/share4.jpg"],["全新果蔬大战玩法，即刻来体验！", "https://cdnws.shanyougz.com/webms/lingyue_wx/share/share5.jpg"],["帅酷炸天，实力秒杀！", "https://cdnws.shanyougz.com/webms/lingyue_wx/share/share6.jpg"],["我很强，选我选我，快选我！", "https://cdnws.shanyougz.com/webms/lingyue_wx/share/share7.jpg"],];
    //这个标志是第二个帐号
    //项目二main->egmain  defaut.thm.min->skin
    //微信返回用户私人信息
    //接口信息

    configData = {}
    is_ban_phone = false;

    configLoaded = false
    rewardedVideoAd = null;
    rewardedFunc = null;

    gameClubBtn;
    buttonShow = true;
    loginData
    loginBackData

    authorizeBtn;
   

    constructor(){
      this.rewardedVideoAd = {};
      //setTimeout(()=>{ console.log("this.addAuthrize()", this.canShowSubscribe()) }, 5000);
      //setTimeout(()=>{ this.showVideo(()=>{console.log("vd 2");}) }, 55000);
			this.initSetting()
			console.log(new Date().getTime()+":start ")
			mgsdk.init({
				channelid:100000708,
				appkey:"22B5823150BF645AE2882ACC3E568AB2",
				gameversion:"1.0.0",
				callback: (res) => {
					mgsdk.login({
						callback: (res) => {
							console.log("mgsdk.login callback", res);
							console.log(new Date().getTime()+":end ")
							this.openid = this.username = res.data.userid
							//this.openid = this.username = "client2504"
							this.loginBackData = res.data
							//Authorize.Instance.SDK.SDKData.LoginSucceed = true;
						}
					})
				}
			})
			
    }

    isIOS() {
			//return false;
      return this.system == 1;
    }

    hideFirstPage(){
      if(GameGlobal.LoadingManager){
        GameGlobal.LoadingManager.destroy().then(() => {
          // callback
        })
      }
    }

    loadConfigs(urlStr){
      console.log("loadConfigs start", new Date().getTime());
      // return;
      wx.request({
        url: urlStr,
        method:"GET",
        success:(res) =>{
          console.log("loadConfigs ok", new Date().getTime());
          this.configData = res.data;
          this.configLoaded = true;
          res = null;
        },
        complete:(res) =>{
          //resolve()
        }
      })
     
    }     


    /*检查登录状态是否失效*/
    checkSession(){
      return new Promise((resolve, reject) => {
        this.loginSession = true;
        resolve();
      })
    }



    /*检查登录状态是否失效*/
    checkWord(msg){
      return new Promise((resolve, reject) => {
        console.log("checkWord msg", msg);
        mgsdk.msgSecCheck({
          content:msg,
          scene:4,
          callback:(res)=>{
              console.log("checkWord res", res);
              resolve(res.code == 0);
  
            }
        })
        
      })
    }

    loadJson(url, func){
      wx.request({
        url: url,
        method:"GET",
        success:(res) =>{
          console.log();
          if(func){
            func(res.data);
          }
        },
        complete:(res) =>{
          //resolve()
        }
      })
                  
        
    }

    init(data) {
      return new Promise((resolve, reject) => {
				resolve()
         
      })
    }

    /*取jscode*/
    login(data) {
      // XKHY_SDK.getToken(function(res){
      //   console.log("getToken", res)
			// })
			console.log(new Date().getTime()+":start ")
      this.loginData = data;
      return new Promise((resolve, reject) => {
				if(this.openid){
					resolve()
				}
        
        // XKHY_SDK.SdkInitLogin(loginData, (res) => {
        //     //此处加载游戏逻辑
        //   console.log("SdkInitLogin", res)
        // if(res.state ==  1){
        //     this.username = res.data.uid;
        //     this.openid =  res.data.uid
        //     this.is_ban_phone = res.data.bind_phone == 1;
        //     this.LingYueData = res.data
        //     //this.openid = this.username = "63c779e61d6b48sb3g"
        //     //this.username = this.username = "client2508"
        //     //this.openid = this.username = "ceshi123"
        //     //this.username = this.username = "lol1234"
        //     //this.username = this.username = "4303566"
        //     //this.username = this.username = "4308290"
        //     resolve()
        // }
        // })
        
         
      })
    }

    /*使用jscode登录，后台返回玩家信息*/
    getUserInfo() {
        return new Promise((resolve, reject) => {
              resolve()
        })
    }
	
	setKeepScreenOn() {
      wx.setKeepScreenOn({
        keepScreenOn: true
      })
    }

    /**新角色 */
    createNew(params){
      // XKHY_SDK.SdkEvent(params,()=>{})
      // var obj = wx.getLaunchOptionsSync();
      // console.log("LaunchOption", obj);
      // if (obj.query && obj.query.share == 1) {
      //   wx.request({
      //     url: "https://czhddz.shanyougz.com/wxshare/addInviteReward",
      //     data: {
      //       server: obj.query.server,
      //       actorId:obj.query.actorId,
      //       uidInvite:obj.query.openid,
      //       uid:this.username,
      //     },
      //   success: (res) => {
      //       if (res.data.errcode == 0) {
      //       }
      //     },
      //     fail: (res) => {
      //     }
      //   })
      // }
      mgsdk.report(params)
    }

    addInvite(){
     
    }

    /**支付，IOS走客服会话，安卓走米大师充值
     * {"userId":ActorCQ.actorID,"amount":amount,"id":id,"name":name}
    */
    pay(obj){
      console.log("start pay", obj);
      //obj["amount"] = 100;
      //obj["dmoney"] = 1;
      // XKHY_SDK.SdkOrder(obj, (res)=>{
      //   console.log("payCreate",res);
      // })
      mgsdk.pay(obj)
    }

    /**登录上报，升级与进入游戏都上报*/
    createRole(params){
      mgsdk.report(params)
      mgsdk.pswitch(params);
      // if(window.Actor){
      //   console.log("Actor", Actor.actorID);
      // }
      // XKHY_SDK.SdkEvent(params, ()=>{})
      // //this.bindMessage("18026686648","7215");
      // var obj = wx.getLaunchOptionsSync();
      // console.log("createRole", params);
      
    }

    

    getInviteCount(){
      wx.request({
        url: "https://czhddz.shanyougz.com/wxshare/getInviteCount",
        method:"GET",
        data: {
          uid:this.username,
        },
        success:(requestRes) =>{
          if(requestRes.data && requestRes.data.errcode == 0){
            console.log("getInviteCount ok", requestRes);
            this.inviteCount = requestRes.data.inviteCount
          }
        },
        complete:(requestRes) =>{
          
        }
      })
    }



    shareOnce(){
        return new Promise((resolve, reject) => {
            let show = this.shareText[Math.floor(Math.random() * this.shareText.length)]
            var now = new Date().time;
            let query = "share=1&openid=" + this.username + "&server=" + this.serverId +  "&actorId=" + this.actorid
            wx.shareAppMessage({
              title: show[0],
              imageUrl:show[1],
              query:query+"&"+mgsdk.shareQueryStr(),
              sucess:()=>{
                console.log("shareOnce sucess");
              },
              complete:()=>{
                
                resolve()
              }
            })
        })
    }

		clearStorage(){
			wx.clearStorage()
			try {
				wx.clearStorageSync()
				wx.restartMiniProgram({
					
				})
			} catch(e) {
				// Do something when catch error
			}
		}

    showVideo(func, id){
     
    }

    showGameClub(show){
      

    }
    /**好友关卡排行榜 */
    showChapterCount(chapterId) {
      wx.setUserCloudStorage({
        KVDataList: [{ key: 'chapter', value: chapterId }],
        success(res) {
          console.log("create success", res);
        },
        fail(res) {
          console.log("create fail", res);
        },
        complete(res) {
          console.log("create complete", res);
        },
        });
    }
	
	// setClipboardData(str) {
  //       wx.setClipboardData({
  //           data: str,
  //           success (res) {
  //             wx.getClipboardData({
  //               success (res) {
  //                 console.log(res.data)
  //               }
  //             })
  //           }
  //         })
  //   }

    addGameClub(){
      
    }

    addSubscribeMessage(){
     
    }

    canShowSubscribe(){
      
      return true;
    }

    addSubscribeOneMes(tempids){
     
     
    }

    initSetting(){
      var that = this;
      wx.getSetting({
        withSubscriptions:true,
        success: function (res) {
          var authSetting = res.authSetting
          console.log("authSetting",res)
          that.settingInfo = res;
        },
        complete(res) {
        }
      })
    }

    changeSubscirbe(){
      
      console.log("changeSubscirbe", this.subscribeState);
    }

    addAuthrize(){
      
    }

    /**打开分享功能*/
    showShareMenu() {
      return new Promise((resolve, reject) => {
        let show = this.shareText[Math.floor(Math.random() * this.shareText.length)]
        wx.onShareAppMessage(() => {
          return {
            title: show[0],
            imageUrl: show[1]
          }
        })
        wx.showShareMenu({
          withShareTicket: true,
          success:()=>{
          },
          complete:()=>{
            resolve()
          }
        })
      })
    }
    getLocation(){
     
    }
  
    //openDataContext = new WxgameOpenDataContext();
}


window.platformWX = new WxgamePlatform();