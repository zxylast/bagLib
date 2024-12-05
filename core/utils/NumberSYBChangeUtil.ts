class NumberSYBChangeUtil {
	/**
 * 数字转阿拉伯字母
 * 例子:
 * NumberSYBChangeUtil.NumberToChinese(0) = "〇" (string）
 * */
	private static arabNumChar = ["〇", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"];

	public static NumberToChinese(num: number) {
		let unitPos = 0;
		let arabStr = '';
		let needZero = false;
		let arabNumChar = NumberSYBChangeUtil.arabNumChar;
		arabStr = arabNumChar[num];
		return arabStr;
	}

	/**
	 * 数字转单位
	 * 例子:
	 * NumberSYBChangeUtil.changeUnit(10000) = "万" (string）
	 * */
	public static changeUnit(record: number): string {
		let str = Math.floor(record) + "";
		let num = record;
		let len = str.length;
		if (len > 5 && len < 7) {
			let count = (num / 10000);
			str = Math.floor(count * 10) / 10 + "万";
		} else if (len >= 7 && len < 9) {
			str = Math.floor((num / 10000)) + "万";
		}
		else if (len >= 9 && len < 11) {
			let count = (num / 100000000);
			str = Math.floor(count * 10) / 10 + "亿";
		}
		else if (len >= 11) {
			let count = Math.floor(num / 100000000);
			str = count + "亿";
		}
		return str;
	}
	/**
 * 数字转单位
 * 例子:
 * NumberSYBChangeUtil.changeUnit(10000) = "万" (string）
 * */
	public static changeUnit2(record: number): string {
		let str = Math.floor(record) + "";
		let num = record;
		let len = str.length;
		if (len > 4 && len < 7) {
			let count = (num / 10000);
			count = Math.floor(count * 10) / 10;
			str = count + "万";
		} else if (len >= 7 && len < 9) {
			let count = Math.floor(num / 10000);
			str = count + "万";
		}
		else if (len >= 9 && len < 11) {
			let count = (num / 100000000);
			str = Math.floor(count * 10) / 10 + "亿";
		}
		else if (len >= 11) {
			let count = Math.floor(num / 100000000);
			str = count + "亿";
		}
		return str;
	}

	/**
	 * 数字转单位
	 * 例子:
	 * NumberSYBChangeUtil.changeUnit(10000) = "w" (string）
	 * 用于做位图
	 * */
	public static changeUnit3(record: number): string {
		let str = Math.floor(record) + "";
		let num = record;
		let len = str.length;
		if (len >= 5 && len < 7) {
			let count = (num / 10000);
			str = count.toFixed(1) + "w";
		}else if (len >= 7) {
			let count = (num / 10000);
			str = count.toFixed(0) + "w";
		} else {
			str = Math.floor(num) + "";
		}
		return str;
	}

	/**
	 * 数字转单位
	 * 用于做回血数字位图，回血是负数，负号运算符也算长度
	 * */
	public static changeUnit4(record: number): string {
		let str = Math.floor(record) + "";
		let num = record;
		let len = str.length;
		if (len >= 6 && len < 8) {
			let count = (num / 10000);
			str = count.toFixed(1) + "w";
		}else if (len >= 8) {
			let count = (num / 10000);
			str = count.toFixed(0) + "w";
		} else {
			str = Math.floor(num) + "";
		}
		return str;
	}
}