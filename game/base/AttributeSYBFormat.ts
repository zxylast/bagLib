/**属性格式化 */
class AttributeSYBFormat {
	//默认颜色
	public static DEFAULT_COLOR: number = 0xf3f1ed;

	/** 属性名与属性值间隔多宽(默认4格)*/
	public intervals: number = 4;
	/** 两个属性值间隔多宽(默认4格)*/
	public intervals2: number = 4;
	/**两个属性值之间的空行数量 ,默认为0 */
	public emptyLine: number = 0;
	/**符号 +,-,: */
	public sign: string = "+";
	/**空格的数量 */
	public spaceCount: number = 0;
	/**是否显示属性名 */
	public isShowAttName: number = 1;
	/**文字颜色 */
	public wordColor: number = AttributeSYBFormat.DEFAULT_COLOR;
	/**属性颜色 */
	public attrColor: number = AttributeSYBFormat.DEFAULT_COLOR;
	public constructor() {
	}

	/**根据参数获取显示格式 */
	public static getFormat(intervals: number = 4, intervals2: number = 4, emptyLine: number = 0, sign: string = "+", spaceCount: number = 0,
		isShowAttName: number = 1, wordColor: number = this.DEFAULT_COLOR, attrColor: number = this.DEFAULT_COLOR): AttributeSYBFormat {
		let format: AttributeSYBFormat = new AttributeSYBFormat();
		format.intervals = intervals;
		format.intervals2 = intervals2;
		format.emptyLine = emptyLine;
		format.sign = sign;
		format.spaceCount = spaceCount;
		format.isShowAttName = isShowAttName;
		format.wordColor = wordColor;
		format.attrColor = attrColor;
		return format;
	}

	/** 
	 * 格式1如下
	 * 力量:400
	 * 敏捷:400
	*/
	public static FORMAT_1(): AttributeSYBFormat {
		return this.getFormat(0, 0, 0, "：");
	}
	/** 
 * 格式1如下
 * 力量:400                     力量：200   
 * 敏捷:400
*/
	public static FORMAT_3(): AttributeSYBFormat {
		let format: AttributeSYBFormat = this.getFormat(0, 18, 0, "：");
		format.wordColor = 0x582810;
		format.attrColor = 0x582810;
		return format;
	}

	/** 
 * 格式1如下
 * 力量:400                     力量：200   
 * 敏捷:400
*/
	public static FORMAT_3_1(): AttributeSYBFormat {
		let format: AttributeSYBFormat = this.getFormat(0, 18, 0, "：");
		format.wordColor = 0xF8FBDC;
		format.attrColor = 0xF8FBDC;
		return format;
	}
	/** 
	 * 格式1如下
	 * 力量:400                     力量：200   
	 * 敏捷:400
	*/
	public static FORMAT_3_2(): AttributeSYBFormat {
		let format: AttributeSYBFormat = this.getFormat(0, 18, 0, "：");
		format.wordColor = 0x84817d;
		format.attrColor = 0x84817d;
		return format;
	}

	/** 
	 * 格式1如下
	 * 力量:400(绿色数字)
	 * 敏捷:400(绿色数字)
	*/
	public static FORMAT_2(): AttributeSYBFormat {
		let format: AttributeSYBFormat = this.FORMAT_1();
		format.attrColor = 0x32ff17;
		return format;
	}
	/** 
 * 格式1如下
 * 力量:400(黄色数字)
 * 敏捷:400(黄色数字)
*/
	public static FORMAT_5(): AttributeSYBFormat {
		let format: AttributeSYBFormat = this.FORMAT_1();
		format.attrColor = 0xffe84e;
		return format;
	}
	/** 
	 * 格式1如下
	 * 力量:400(绿色数字)
	 * 敏捷:400(绿色数字)
	*/
	public static FORMAT_4(): AttributeSYBFormat {
		let format: AttributeSYBFormat = this.FORMAT_1();
		format.wordColor = 0x84817d;
		format.attrColor = 0x84817d;
		return format;
	}

	/** 
	 * 格式1如下
	 * 力量+400(绿色数字)
	 * 敏捷+400(绿色数字)
	*/
	public static FORMAT_6(): AttributeSYBFormat {
		let format: AttributeSYBFormat = this.getFormat(0, 0, 0, "+");
		format.wordColor = 0x4FF751;
		format.attrColor = 0x4FF751;
		return format;
	}
}