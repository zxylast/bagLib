
/**
 * 颜色相关处理工具
 */
class ColorSYBUtil {
	public static ALPHA: number = 0xf3311e00;
	public static RED: number = 0xf71010;
	public static GREEN: number = 0x14ba18;
	public static BLUE: number = 0x1ccff5;
	public static PURPLE: number = 0xDC3EFE;
	public static GRAY: number = 0x8B898B;

	public static NORMAL_COLOR: number = 0xD1C28F;
	public static RED_COLOR_N: number = 0xF3311E;
	public static GREEN_COLOR_N: number = 0x35E62D;
	public static GRAY_COLOR2: number = 0x838383;
	public static GRAY_COLOR3: number = 0xCCC7C6;
	public static WHITE_COLOR2: number = 0xD1C28F;

	public static WHITE_COLOR: string = "#D1C28F";
	public static RED_COLOR: string = "#F3311E";
	public static GREEN_COLOR: string = "#35E62D";
	public static GRAY_COLOR: string = "#8B898B";

	public static COLOR_STR: string[] = ["白色", "蓝色", "黄色", "橙色"];
	public static QUALITY_STR: string[] = ["白色","绿色", "蓝色", "紫色", "橙色", "红色"];

	public static QUALITY_STRRGB: number[] = [0xFFFFFF, 0x32ff17, 0x168dcb, 0xdc3efe, 0xffd133, 0xf71010];

	public static ROLENAME_COLOR_YELLOW = 0xFFE84E;

	public static ROLENAME_COLOR_GREEN = 0x35E62D;

	public static ROLENAME_COLOR_NORMAL = 0x35E62D;

	public static ROLENAME_COLORS: number[] = [0xf837ff, 0xf837ff, 0xf36aff, 0xffa423, 0xff4b4b,0xffe84e];

	public static JUEWEI_COLOR: string[] = [
		"#e2dfd4",
		"#35e62d",
		"#81adff",
		"#e27dff",
		"#ff9649",
		"#fc5959",
		"#ffd93f",
		"#ffff00"
	]

	// public static 

	/**
	 * 合并颜色值
	 */
	public static mergeARGB($a: number, $r: number, $g: number, $b: number): number {
		return ($a << 24) | ($r << 16) | ($g << 8) | $b;
	}

	/**
	 * 获取单个通道的颜色值
	 * @param $argb 颜色值
	 * @param $channel 要获取的颜色通道常量
	 */
	public static getChannel($argb: number, $channel: number): number {
		switch ($channel) {
			case this.ALPHA:
				return ($argb >> 24) & 0xff;
			case this.RED:
				return ($argb >> 16) & 0xff;
			case this.GREEN:
				return ($argb >> 8) & 0xff;
			case this.BLUE:
				return $argb & 0xff;
		}
		return 0;
	}

	/**
	 * 颜色值表示法转换number转String
	 * @param $number 需要转换的number值
	 * @param $prefix 字符串前缀
	 */
	public static numberToString($number: number, $prefix: String = "#"): String {
		return $prefix + $number.toString(16);
	}

}
