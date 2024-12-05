/**
 * Created by Administrator on 2017/1/14.
 */

/**微信 微信上士 快手 字节小游戏 IOS原生*/
let SYWeixin = true;
//上士的抖音也要设置为true

let CONFIG_VER = window['config_ver'];
let RES_VER = window['res_ver'];
let GAME_URL = window['url'];
let CDN = window['cdn'];
let SY_WWW_HOST = window['sy_www_host'];
/**小游戏类型 */
let SYWXPlat = SYWeixin;

/**处理没有目录的地址 */
// if (SYWeChat || SYKuaiShou || SYTT) {
//     GAME_URL = "https://cdnws.shanyougz.com/webms/yueyou106";
//     CDN = "https://cdnws.shanyougz.com/";
//     SY_WWW_HOST = "https://gamecs.quickplaytec.com/web/yueyou106";
// }

/**灵月新地址 */
if (SYWeixin) {
    // GAME_URL = "https://cdnws.shanyougz.com/webkp/lingyue_kp02";
    // CDN = "https://cdnws.shanyougz.com/";
    // SY_WWW_HOST = "https://gamecs.quickplaytec.com/web/lingyue_kapai02";
    GAME_URL = "https://cdnws.shanyougz.com/webbagtower3";
    CDN = "https://cdnws.shanyougz.com/";
    SY_WWW_HOST = "https://gamecs.quickplaytec.com/web/bag";
    
}

/**之前拓展改了目录 */
let SY_RES_DIR = '/res_bag';
let SY_RES_DIR1 = '/res_kp_1';
//let SY_MAP_DIR = '/res/xs/map'

let RES_RESOURCE =  `${GAME_URL}/resource`;
var RES_DIR = `${CDN}${SY_RES_DIR}`;
//let MAP_DIR = `${CDN}${SY_MAP_DIR}`;
var RES_DIR_BLOOD = `${RES_DIR}/blood/`;
var RES_DIR_BODY = `${RES_DIR}/monster/`;
var RES_DIR_EFF = `${RES_DIR}/eff/`;
var RES_DIR_MERCENARY = `${RES_DIR}/mercenary/`;
var RES_DIR_MONSTER = `${RES_DIR}/monster/`;
var RES_DIR_MONSTER_HEAD = `${RES_DIR}/monsterHead/`;
var RES_DIR_SKILL = `${RES_DIR}/skill/`;
var RES_DIR_SKILLEFF = SYWeixin ? `${RES_DIR}/skilleff/` : `${RES_DIR}/skilleff/`;
var RES_DIR_MAP = `${RES_DIR}/changjing/`;
var RES_DIR_SKILL_ICON = `${RES_DIR}/skillicon_new/`;
var RES_DIR_ITEM = `${RES_DIR}/item/`;
var RES_DIR_ROLE = `${RES_DIR}/role/`;
var RES_DIR_EVENT = `${RES_DIR}/RandomEvents/`;
var RES_DIR_DRAGON = `${RES_DIR}/dragonbonesmin_kp/`
var RES_DIR_EQUIPEFF = `${RES_DIR}/equipeff/`
var RES_DIR_PETS = `${RES_DIR}/pets/`
var RES_DIR_FAIRY = `${RES_DIR}/xiangeeff/`
var RES_DIR_FONT= `${RES_DIR}/font4/`