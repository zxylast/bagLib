/**
 * 中文数字控件
 * */
class ItemStage extends BaseItemSYBRender {
	private lv0:eui.BitmapLabel;

	constructor() {
		super();
		this.skinName = "LvSkin";

	}
	/**数字转换中文*/
	private convert(strNum:string[]){
		for( let i = 0;i < strNum.length;i++ ){
			strNum[i] = StringSYBUtils.NumberToChinese(Number(strNum[i]));
		}
		return strNum;
	}
	protected dataChanged(): void {
		if( !this.data || !(typeof this.data == "string"))return;
		let strNum:string[] = StringSYBUtils.getStrByRegExp(this.data);
		let strChn:string[] = StringSYBUtils.getStrByRegExp(this.data,/[\u4E00-\u9FA5]+/g);
		let stage = "";
		let tempF:string[] = [];//前组
		let tempA:string[] = [];//后组
		let tempFindex = this.data.indexOf(strNum[0]);
		let tempAindex = this.data.indexOf(strChn[0]);
		if( tempFindex >= 0 && tempAindex >= 0 ){
			if( tempFindex < tempAindex ){//找哪个在前
				tempF = this.convert(strNum);
				tempA = strChn;
			}else{
				tempF = strChn;
				tempA = this.convert(strNum);
			}
		}else{
			if( tempFindex == -1 ){
				tempF = strChn;
			}else{
				tempF = this.convert(strNum);
			}
		}
		for( let i = 0;i < tempF.length;i++ ){
			stage += tempF[i];
			if( tempA[i] ){
				stage += tempA[i];
			}
		}
		this.lv0.text = stage;
	}
	public destruct(): void {

	}


}