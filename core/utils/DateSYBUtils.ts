class DateStyle extends BaseSYBClass {
	/**格式 */
	public format: string[] = [];
	/** 起始精确度*/
	public from: number = 0;
	/**结束精确度 */
	public to: number = 0;
	/**是否补齐0 */
	public isFormatNum: boolean = false;

	public constructor(format: string[], from: number, to: number, isFormatNum: boolean) {
		super();
		this.format = format;
		this.from = from;
		this.to = to;
		this.isFormatNum = isFormatNum;
	}
}

/**
 * Created by yangsong on 2014/11/22.
 * Date工具类
 */
class DateSYBUtils {
	/**时间格式1 00:00:00 */
	public static TIME_FORMAT_1: number = 1;
	/**时间格式2 yyyy-mm-dd h:m:s */
	public static TIME_FORMAT_2: number = 2;
	/**时间格式3 00:00(分:秒) */
	public static TIME_FORMAT_3: number = 3;
	/**时间格式4 xx天前/xx小时前/xx分钟前 */
	public static TIME_FORMAT_4: number = 4;
	/**时间格式5 x天x小时x分x秒 */
	public static TIME_FORMAT_5: number = 5;
	/**时间格式6 h:m:s */
	public static TIME_FORMAT_6: number = 6;
	/**时间格式7 xx天/xx小时/<1小时 */
	public static TIME_FORMAT_7: number = 7;
	/**时间格式8 yyyy/mm/dd h:m */
	public static TIME_FORMAT_8: number = 8;
	/**时间格式9 x小时x分钟x秒 */
	public static TIME_FORMAT_9: number = 9;
	/**时间格式10 x分x秒**/
	public static TIME_FORMAT_10: number = 10;
	/**时间格式11x时x分x秒**/
	public static TIME_FORMAT_11: number = 11;
	/**时间格式12 x:x:x**/
	public static TIME_FORMAT_12: number = 12;
	/**时间格式13 x月x日 h:m**/
	public static TIME_FORMAT_13: number = 13;
	/**时间格式14 x时x分**/
	public static TIME_FORMAT_14: number = 14;
	/**时间格式15 mm-dd h:m */
	public static TIME_FORMAT_15: number = 15;
	/**时间格式16 x分x秒x毫秒 */
	public static TIME_FORMAT_16: number = 16;
	/**时间格式5 x天00:00:00 */
	public static TIME_FORMAT_17: number = 17;
	/**时间格式18 h:m */
	public static TIME_FORMAT_18: number = 18;
	/**时间格式19 00:00(时:分) */
	public static TIME_FORMAT_19: number = 19;
	/**时间格式20 x月x日 */
	public static TIME_FORMAT_20: number = 20;
	/**一秒的毫秒数 */
	public static MS_PER_SECOND: number = 1000;
	/**一分钟的毫秒数 */
	public static MS_PER_MINUTE: number = 60 * 1000;
	/**一小时的毫秒数 */
	public static MS_PER_HOUR: number = 60 * 60 * 1000;
	/**一天的毫秒数 */
	public static MS_PER_DAY: number = 24 * 60 * 60 * 1000;

	public static SECOND_PER_HOUR: number = 3600;//一小时的秒数
	public static SECOND_PER_DAY: number = 86400;//一天的秒数
	private static SECOND_PER_MONTH: number = 2592000;//一个月(30天)的秒数
	private static SECOND_PER_YEAR: number = 31104000;//一年(360天)的秒数

	public static DAYS_PER_WEEK: number = 7;//一周的天数

	public static YEAR_PER_YEAR: number = 1;//每年的年数
	public static MONTH_PER_YEAR: number = 12;//每年的月数
	public static DAYS_PER_MONTH: number = 30;//每月的天数
	public static HOURS_PER_DAY: number = 24;//每天的小时数
	public static MUNITE_PER_HOUR: number = 60;//每小时的分钟数
	public static SECOND_PER_MUNITE: number = 60;//每分钟的秒数
	public static SECOND_PER_SECOND: number = 1;//每秒的秒数字
	public static SECOND_2010: number = 1262275200;//1970年~2010年1月1日0时0分0秒的时间戳(单位:秒)
	/**余数 ,用来计算时间*/
	private static mod: number[] = [DateSYBUtils.SECOND_PER_MUNITE, DateSYBUtils.MUNITE_PER_HOUR, DateSYBUtils.HOURS_PER_DAY, DateSYBUtils.DAYS_PER_MONTH, DateSYBUtils.MONTH_PER_YEAR, DateSYBUtils.YEAR_PER_YEAR];
	/**除数 用来计算用来计算时间*/
	private static mul: number[] = [DateSYBUtils.SECOND_PER_SECOND, DateSYBUtils.SECOND_PER_MUNITE, DateSYBUtils.SECOND_PER_HOUR, DateSYBUtils.SECOND_PER_DAY, DateSYBUtils.SECOND_PER_MONTH, DateSYBUtils.SECOND_PER_YEAR];
	/**一周的天数 */
	/**一天的小时数 */
	/** 本游戏中使用的MiniDateTime时间的起始日期相对于flash时间(1970-01-01)的时差（毫秒） */
	public static MINI_DATE_TIME_BASE: number = Date.UTC(2010, 0) + new Date().getTimezoneOffset() * DateSYBUtils.MS_PER_MINUTE;
	/**
	 * 时区偏移（毫秒数）<BR>
	 * 目前中国采用东八区，即比世界协调时间（UTC）/格林尼治时间（GMT）快8小时的时区 */
	public static TIME_ZONE_OFFSET: number = 8 * DateSYBUtils.MS_PER_HOUR;

	/**精确度 */
	public static TO_SECOND: number = 0;
	public static TO_MINUTE: number = 1;
	public static TO_HOUR: number = 2;
	public static TO_DAY: number = 3;
	public static TO_MONTH: number = 4;
	public static TO_YEAR: number = 5;
	/** n年n月n日n时n分n秒 */
	private static FORMAT_1: string[] = ["秒", "分", "时", "天", "月", "年"];
	/** xx:xx:xx */
	private static FORMAT_2: string[] = [":", ":", ":", ":", ":", ":"];
	public static WEEK_CN: string[] = [`日`, `一`, `二`, `三`, `四`, `五`, `六`];

	/**x小时x分x秒 */
	public static STYLE_1: DateStyle = new DateStyle(DateSYBUtils.FORMAT_1, DateSYBUtils.TO_SECOND, DateSYBUtils.TO_HOUR, false);
	/** x天x小时x分钟x秒 */
	public static STYLE_2: DateStyle = new DateStyle(DateSYBUtils.FORMAT_1, DateSYBUtils.TO_SECOND, DateSYBUtils.TO_DAY, false);
	/** 00:00:00 */
	public static STYLE_3: DateStyle = new DateStyle(DateSYBUtils.FORMAT_2, DateSYBUtils.TO_SECOND, DateSYBUtils.TO_HOUR, true);
	/** x分x秒 */
	public static STYLE_4: DateStyle = new DateStyle(DateSYBUtils.FORMAT_1, DateSYBUtils.TO_SECOND, DateSYBUtils.TO_MINUTE, true);

	public constructor() {
	}

	/**
	 * 获取时间格式化的字符串
	 * @second 秒
	 * @style 格式化风格, 例如 :DateSYBUtils.STYLE_1
	 *  */
	public static getFormatTimeByStyle(second: number, style: DateStyle = DateSYBUtils.STYLE_1): string {
		if (second < 0) {
			second = 0;
			//debug.log("输入参数有误!时间为负数:" + second);
		}
		if (style.from > style.to) {
			//debug.log("输入参数有误!to参数必须大于等于from参数,请检查style参数的值");
			return "";
		}
		second = second >> 0;
		let result: string = "";
		for (let i: number = style.to; i >= style.from; i--) {
			let time: number = second / this.mul[i];//总共
			let timeStr: string = "";
			if (i != style.to)
				time = time % this.mod[i];//剩余
			if (style.isFormatNum && time < 10)
				timeStr = "0" + (time >> 0).toString();//补0
			else
				timeStr = (time >> 0).toString();
			result += (timeStr + style.format[i]);
		}
		return result;
	}

	/**
	 * 获取时间格式化的字符串
	 * @ms 毫秒
	 * @style 格式化风格, 例如 :DateSYBUtils.STYLE_1
	 *  */
	public static getFormatTimeByStyle1(ms: number, style: DateStyle = DateSYBUtils.STYLE_1): string {
		return this.getFormatTimeByStyle(ms / this.MS_PER_SECOND);
	}

	/**
	 * 把MiniDateTime转化为距离1970-01-01的毫秒数
	 * @param mdt 从2010年开始算起的秒数
	 * @return 从1970年开始算起的毫秒数
	 */
	public static formatMiniDateTime(mdt: number): number {
		return DateSYBUtils.MINI_DATE_TIME_BASE + (mdt & 0x7FFFFFFF) * DateSYBUtils.MS_PER_SECOND;
	}

	/**转成服务器要用的时间***/
	public static formatServerTime(time: number): number {
		return (time - DateSYBUtils.MINI_DATE_TIME_BASE) / DateSYBUtils.MS_PER_SECOND;
	}


	/**
	 * 根据秒数格式化字符串
	 * @param  {number} second            秒数
	 * @param  {number=1} type            DateSYBUtils.TIME_FORMAT_1, DateSYBUtils.TIME_FORMAT_2...)
	 * @param  {showLength}    showLength    显示长度（一个时间单位为一个长度，且仅在type为DateSYBUtils.TIME_FORMAT_5的情况下有效）
	 * @returns string
	 */
	public static getFormatBySecond(second: number, type: number = 1, showLength: number = 2): string {
		let str: string = "";
		let ms: number = 0;
		if (type == 16) {

			ms = second;
		} else {
			ms = second * 1000;
		}
		switch (type) {
			case this.TIME_FORMAT_1:
				str = this.format_1(ms);
				break;
			case this.TIME_FORMAT_2:
				str = this.format_2(ms);
				break;
			case this.TIME_FORMAT_3:
				str = this.format_3(ms);
				break;
			case this.TIME_FORMAT_4:
				str = this.format_4(ms);
				break;
			case this.TIME_FORMAT_5:
				str = this.format_5(ms, showLength);
				break;
			case this.TIME_FORMAT_6:
				str = this.format_6(ms);
				break;
			case this.TIME_FORMAT_7:
				str = this.format_7(ms);
				break;
			case this.TIME_FORMAT_8:
				str = this.format_8(ms);
				break;
			case this.TIME_FORMAT_9:
				str = this.format_9(ms);
				break;
			case this.TIME_FORMAT_10:
				str = this.format_10(ms);
				break;
			case this.TIME_FORMAT_11:
				str = this.format_11(ms);
				break;
			case this.TIME_FORMAT_12:
				str = this.format_12(ms);
				break;
			case this.TIME_FORMAT_13:
				str = this.format_13(ms);
				break;
			case this.TIME_FORMAT_14:
				str = this.format_14(ms);
				break;
			case this.TIME_FORMAT_15:
				str = this.format_15(ms);
				break;
			case this.TIME_FORMAT_16:
				str = this.format_16(ms);
				break;
			case this.TIME_FORMAT_17:
				str = this.format_17(ms, showLength);
				break;
			case this.TIME_FORMAT_18:
				str = this.format_18(ms);
				break;
			case this.TIME_FORMAT_19:
				str = this.format_19(ms);
				break;
			case this.TIME_FORMAT_20:
				str = this.format_20(ms);
				break;
		}
		return str;
	}

	/**
	 * 获取到指定日期00：00的秒数
	 * **/
	public static getRenainSecond(ms?: number): string {
		let tmpDate = ms ? new Date(ms) : new Date();
		//tmpDate.setDate(tmpDate.getDate()+1);
		let ptime = (DateSYBUtils.getTodayZeroSecond(tmpDate) + 60 * 60 * 24) - tmpDate.getTime() / 1000;
		// //console.log("ptime = " + ptime);
		return ptime.toFixed(0);
	}

	/**
	 * 今天已过去的秒数
	 * **/
	public static getTodayPassedSecond(): number {
		let tmpDate = new Date();
		let tdyPassTime = ((Date.now() - (new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()).getTime())) / 1000).toFixed(0);
		return parseInt(tdyPassTime);
	}

	/**
	 * 获取每日指定时间倒计时
	 * 例: 每日22点结算
	 * @param hours(小时)
	 * @param dateTime(服务器时间)
	 */
	public static getTodayAppointHour(hoursCnt: number, dateTime: number): number {
		let endTime: number = 0;
		let times = new Date(dateTime);//获取时间
		let hours = times.getHours();//时
		let minutes = times.getMinutes();//分
		let seconds = times.getSeconds();//秒
		if (hours >= hoursCnt) {
			let hourVal = 24 * DateSYBUtils.SECOND_PER_HOUR - minutes * 60 - seconds;
			endTime = dateTime + hourVal * 1000;
		} else {
			let hourVal = ((hoursCnt - hours) * DateSYBUtils.SECOND_PER_HOUR) - minutes * 60 - seconds;
			endTime = dateTime + hourVal * 1000;
		}
		return endTime;
	}

	/**
	 * 获取指定日期00:00时刻的秒数
	 * @parma 毫秒
	 * @returns {number}
	 */
	public static getTodayZeroSecond(tdate?: any): number {
		let tmpDate = tdate ? tdate : new Date();
		return parseInt(((new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate()).getTime()) / 1000).toFixed(0));
	}

	/**
	 * 获取本周第一天
	 * **/
	public static showWeekFirstDay(): any {
		let Nowdate: any = new Date();
		let day = Nowdate.getDay();
		day = day ? day : 7
		let WeekFirstDay = new Date(Nowdate - (day - 1) * 86400000);
		// var M=Number(WeekFirstDay.getMonth())+1
		// return WeekFirstDay.getYear()+"-"+M+"-"+WeekFirstDay.getDate();
		return WeekFirstDay;
	}

	/**
	 * 获取本周最后一天
	 * @param 毫秒差
	 */
	public static showWeekLastDay() {
		let Nowdate = new Date();
		let WeekFirstDay = DateSYBUtils.showWeekFirstDay();
		let WeekLastDay = new Date((WeekFirstDay / 1000 + 6 * 86400) * 1000);
		// var M=Number(WeekLastDay.getMonth())+1
		// return WeekLastDay.getYear()+"-"+M+"-"+WeekLastDay.getDate();
		return WeekLastDay;
	}

	/**
	 * 计算某个时间到某天的时间戳
	 * @param type 1：计算某个时间到本周某天的时间戳
	 */
	public static getTimestamp(serverTime: number, day: number, type: number = 0): number {
		const date = new Date(serverTime);
		const newDate = new Date(serverTime);
		let d1 = date.getDay();
		if (d1 == 0) d1 = 7;
		switch (type) {
			case 1://计算本周和下周
				day = d1 <= day ? day - d1 : 7 - d1 + day;
				break;
			case 2://本周
				day = day - d1;
				break;
		}
		//设置多少天后
		newDate.setDate(date.getDate() + day);
		newDate.setHours(0, 0, 0, 0);//从0点开始
		//计算剩余时间的时间戳(毫秒)
		const dayTime = newDate.getTime() - date.getTime();
		return Math.floor(dayTime / 1000);//传为秒数
	}

	/**获取本周某天日期 */
	public static getWeeklyDate(weekDay: number, serverTime: number, isYear: boolean = false): string {
		let newDate = new Date(serverTime);
		newDate.setDate(newDate.getDate() + (weekDay - newDate.getDay()));//设置成本周某天日期
		let year: number = newDate.getFullYear();
		let month: number = newDate.getMonth() + 1;//返回的月份从0-11；
		let day: number = newDate.getDate();
		if (isYear) {
			return year + "年" + month + "月" + day + "日";
		} else {
			return month + "月" + day + "日";
		}
	}

	/**
	 * 求出当前时间离下周一凌晨0点还差
	 * @param 秒数
	 * **/
	public static calcWeekFirstDay(): number {
		let Nowdate = new Date();
		let curDay = Nowdate.getDay();
		curDay = curDay > 0 ? curDay : 7;
		let difday = 7 - curDay;
		let hours = Nowdate.getHours();
		let minutes = Nowdate.getMinutes();
		let seconds = Nowdate.getSeconds();
		let sum = difday * 86400 + 86400 - (hours * 3600 + minutes * 60 + seconds);
		return sum;
	}

	/**
	 * 获取本月剩余秒数
	 */
	public static getMonthsurplusSecond(): number {
		let day = new Date();
		let monthDay = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate();//本月天数
		let time = (monthDay - day.getDate()) * DateSYBUtils.SECOND_PER_DAY + (DateSYBUtils.SECOND_PER_DAY - DateSYBUtils.getTodayPassedSecond());
		return time;
	}

	/**
	 * 获取开始时间-结束时间
	 * @param startDay 开始天数
	 * @param endDay 结束天数
	 */
	public static getStartAndEndSecond(startDay: number, endDay: number): number[] {
		let curDay = new Date().getDay();//getDay(0-6)
		let startTime = ((startDay - (curDay + 1)) * DateSYBUtils.SECOND_PER_DAY + (DateSYBUtils.SECOND_PER_DAY - DateSYBUtils.getTodayPassedSecond())) * 1000;
		let endTime = ((endDay - curDay) * DateSYBUtils.SECOND_PER_DAY + (DateSYBUtils.SECOND_PER_DAY - DateSYBUtils.getTodayPassedSecond())) * 1000;
		// let startTimes = Math.floor((startTime + new Date().getTime() - GameServer.serverTime) / 1000);
		// let endTimes = Math.floor((endTime + new Date().getTime() - GameServer.serverTime) / 1000);
		return [startTime + new Date().getTime(), endTime + new Date().getTime()];
	}

	/**
	 * 格式1  00:00:00
	 * @param  {number} sec 毫秒数
	 * @returns string
	 */
	private static format_1(ms: number): string {
		let n: number = 0;
		let result: string = "##:##:##";

		n = Math.floor(ms / DateSYBUtils.MS_PER_HOUR);
		result = result.replace("##", DateSYBUtils.formatTimeNum(n));
		if (n) ms -= n * DateSYBUtils.MS_PER_HOUR;

		n = Math.floor(ms / DateSYBUtils.MS_PER_MINUTE);
		result = result.replace("##", DateSYBUtils.formatTimeNum(n));
		if (n) ms -= n * DateSYBUtils.MS_PER_MINUTE;

		n = Math.floor(ms / 1000);
		result = result.replace("##", DateSYBUtils.formatTimeNum(n));
		return result;
	}

	/**
	 * 格式2  yyyy-mm-dd h:m:s
	 * @param  {number} ms        毫秒数
	 * @returns string            返回自1970年1月1号0点开始的对应的时间点
	 */
	private static format_2(ms: number): string {
		let date: Date = new Date(ms);
		let year: number = date.getFullYear();
		let month: number = date.getMonth() + 1; 	//返回的月份从0-11；
		let day: number = date.getDate();
		let hours: number = date.getHours();
		let minute: number = date.getMinutes();
		let second: number = date.getSeconds();
		return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
	}

	/**
	 * 格式3  00:00
	 * @param  {number} ms        毫秒数
	 * @returns string            分:秒
	 */
	private static format_3(ms: number): string {
		let str: string = this.format_1(ms);
		let strArr: string[] = str.split(":");
		return strArr[1] + ":" + strArr[2];
	}

	/**
	 * 格式19  00:00
	 * @param  {number} ms        毫秒数
	 * @returns string            时:分
	 */
	private static format_19(ms: number): string {
		let str: string = this.format_1(ms);
		let strArr: string[] = str.split(":");
		return strArr[0] + ":" + strArr[1];
	}

	/**x月x日 */
	private static format_20(time: number): string {
		let date: Date = new Date(time);
		let month: number = date.getMonth() + 1; 	//返回的月份从0-11；
		let day: number = date.getDate();
		return month + "月" + day + "日";
	}

	/**
	 * 格式4  xx天前，xx小时前，xx分钟前
	 * @param  {number} ms        毫秒
	 * @returns string
	 */
	private static format_4(ms: number): string {
		if (ms < this.MS_PER_HOUR) {
			return Math.floor(ms / this.MS_PER_MINUTE) + "分钟前";
		}
		else if (ms < this.MS_PER_DAY) {
			return Math.floor(ms / this.MS_PER_HOUR) + "小时前";
		}
		else {
			return Math.floor(ms / this.MS_PER_DAY) + "天前";
		}
	}

	/**
	 * 格式5 X天X小时X分X秒
	 * @param  {number} ms                毫秒
	 * @param  {number=2} showLength    显示长度（一个时间单位为一个长度）
	 * @returns string
	 */
	private static format_5(ms: number, showLength: number = 2): string {
		let result: string = "";
		let unitStr: string[] = ["天", "时", "分", "秒"];
		let arr: number[] = [];

		let d: number = Math.floor(ms / this.MS_PER_DAY);
		arr.push(d);
		ms -= d * this.MS_PER_DAY;
		let h: number = Math.floor(ms / this.MS_PER_HOUR);
		arr.push(h);
		ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		arr.push(m);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);
		arr.push(s);

		for (let k in arr) {
			if (arr[k] > 0) {
				result += this.formatTimeNum(arr[k], Number(k)) + unitStr[k];
				showLength--;
				if (showLength <= 0) break;
			}
		}

		return result;
	}


	/**
	 * 格式17 X天00:00:00
	 * @param  {number} ms                毫秒
	 * @param  {number=2} showLength    显示长度（一个时间单位为一个长度）
	 * @returns string
	 */
	private static format_17(ms: number, showLength: number = 2): string {
		let result: string = "";
		let unitStr: string[] = ["天", ":", ":", ""];
		let arr: number[] = [];

		let d: number = Math.floor(ms / this.MS_PER_DAY);
		arr.push(d);
		ms -= d * this.MS_PER_DAY;
		let h: number = Math.floor(ms / this.MS_PER_HOUR);
		arr.push(h);
		ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		arr.push(m);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);
		arr.push(s);

		for (let k in arr) {
			if (arr[k] >= 0) {
				if (parseInt(k) == 0) {
					if (arr[k] > 0) {
						result += this.formatTimeNum(arr[k], Number(k)) + unitStr[k];
					}
				} else {
					result += this.formatTimeNum(arr[k], Number(k)) + unitStr[k];
				}
				showLength--;
				if (showLength <= 0) break;
			}
		}

		return result;
	}

	/**
	 * 格式6  h:m:s
	 * @param  {number} ms        毫秒
	 * @returns string            返回自1970年1月1号0点开始的对应的时间点（不包含年月日）
	 */
	private static format_6(ms: number): string {
		let date: Date = new Date(ms);
		let hours: number = date.getHours();
		let minute: number = date.getMinutes();
		let second: number = date.getSeconds();
		return this.formatTimeNum(hours) + ":" + this.formatTimeNum(minute) + ":" + this.formatTimeNum(second);
	}

	/**
	 * 格式18  h:m
	 * @param  {number} ms        毫秒
	 * @returns string            返回自1970年1月1号0点开始的对应的时间点（不包含年月日）
	 */
	private static format_18(ms: number): string {
		let date: Date = new Date(ms);
		let hours: number = date.getHours();
		let minute: number = date.getMinutes();
		//let second: number = date.getSeconds();
		return this.formatTimeNum(hours) + ":" + this.formatTimeNum(minute);
	}

	/**
	 * 格式7  X天/X小时/<1小时
	 * @param  {number} ms        毫秒
	 * @returns string
	 */
	private static format_7(ms: number): string {
		if (ms < this.MS_PER_HOUR) {
			return "<1小时";
		}
		else if (ms < this.MS_PER_DAY) {
			return Math.floor(ms / this.MS_PER_HOUR) + "小时";
		}
		else {
			return Math.floor(ms / this.MS_PER_DAY) + "天";
		}
	}

	//8:yyyy/mm/dd h:m
	private static format_8(time: number): string {
		var date: Date = new Date(time);
		var year: number = date.getFullYear();
		var month: number = date.getMonth() + 1; 	//返回的月份从0-11；
		var day: number = date.getDate();
		var hours: number = date.getHours();
		var minute: number = date.getMinutes();
		return year + "/" + month + "/" + day + " " + hours + ":" + minute;
	}

	/**
	 * 格式9  x小时x分钟x秒
	 * @param  {number} ms        毫秒
	 * @returns string
	 */
	private static format_9(ms: number): string {
		let h: number = Math.floor(ms / this.MS_PER_HOUR);
		ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);

		return h + "小时" + m + "分钟" + s + "秒";
	}

	/**
	 * 格式10  x分x秒
	 * @param  {number} ms        毫秒
	 * @returns string
	 */
	private static format_10(ms: number): string {
		// let h: number = Math.floor(ms / this.MS_PER_HOUR);
		// ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);

		return m + "分" + s + "秒";
	}
	/**
		 * 格式16  x分x秒x毫秒
		 * @param  {number} ms        毫秒
		 * @returns string
		 */
	private static format_16(ms: number): string {
		// let h: number = Math.floor(ms / this.MS_PER_HOUR);
		// ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);
		ms -= s * this.MS_PER_SECOND;
		let _ms: number = Math.floor(ms / 10);
		let mstr = _ms < 10 ? "0" + _ms : "" + _ms;
		return m + "分" + s + "秒" + mstr;
	}
	private static format_11(ms: number): string {
		let h: number = Math.floor(ms / this.MS_PER_HOUR);
		ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);

		return h + "时" + m + "分" + s + "秒";
	}

	private static format_12(ms: number): string {
		let h: number = Math.floor(ms / this.MS_PER_HOUR);
		ms -= h * this.MS_PER_HOUR;
		let m: number = Math.floor(ms / this.MS_PER_MINUTE);
		ms -= m * this.MS_PER_MINUTE;
		let s: number = Math.floor(ms / 1000);
		return DateSYBUtils.formatTimeNum(h) + ":" + DateSYBUtils.formatTimeNum(m) + ":" + DateSYBUtils.formatTimeNum(s);
	}

	/**x月x日 h:m */
	private static format_13(time: number): string {
		let date: Date = new Date(time);
		let year: number = date.getFullYear();
		let month: number = date.getMonth() + 1; 	//返回的月份从0-11；
		// let week: number = date.getDay();
		let day: number = date.getDate();
		let hours: number = date.getHours();
		let minute: number = date.getMinutes();
		return month + "月" + day + "日" + DateSYBUtils.formatTimeNum(hours) + ":" + DateSYBUtils.formatTimeNum(minute);
	}

	/**时 分 */
	private static format_14(time: number): string {
		let date: Date = new Date(time);
		let hours: number = date.getHours();
		let minute: number = date.getMinutes();
		return hours + "时" + minute + "分";
	}

	//15:yyyy-mm-dd h:m
	private static format_15(time: number): string {
		var date: Date = new Date(time);
		var month: number = date.getMonth() + 1; 	//返回的月份从0-11；
		var day: number = date.getDate();
		var hours: number = date.getHours();
		var minute: number = date.getMinutes();
		return DateSYBUtils.formatTimeNum(month) + "-" + DateSYBUtils.formatTimeNum(day) + " " + DateSYBUtils.formatTimeNum(hours) + ":" + DateSYBUtils.formatTimeNum(minute);
	}

	/**
	 * 格式化时间数为两位数
	 * @param  {number} t 时间数
	 * @returns String
	 */
	public static formatTimeNum(t: number, k?: number): string {
		return t >= 10 ? t.toString() : (k == 0 ? t.toString() : "0" + t);
	}

	/**
	 * 检验时间是否大于现在时间+天数
	 * @param  time时间
	 * @param  days天数
	 * @returns String
	 */
	public static checkTime(time: number, days: number): boolean {
		let currentDate = new Date().getTime();
		let t = (time > (currentDate + days * this.MS_PER_DAY)) as boolean;
		return t;
	}

	/**
	 * 格式化当前时间
	 * @param  time时间
	 * @returns String 2018年12月12日（周二） 12:12
	 */
	public static formatFullTime(time: number): string {
		let format: string;
		let date: Date = new Date(time);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let weekDay = date.getDay();
		let hour = date.getHours();
		let hourStr;
		if (hour < 10) {
			hourStr = "0" + hour;
		}
		else {
			hourStr = hour.toString();
		}
		let min = date.getMinutes();
		let minStr;
		if (min < 10) {
			minStr = "0" + min;
		}
		else {
			minStr = min.toString();
		}
		let weekDayStr;
		switch (weekDay) {
			case 1:
				weekDayStr = "一";
				break;
			case 2:
				weekDayStr = "二";
				break;
			case 3:
				weekDayStr = "三";
				break;
			case 4:
				weekDayStr = "四";
				break;
			case 5:
				weekDayStr = "五";
				break;
			case 6:
				weekDayStr = "六";
				break;
			case 0:
				weekDayStr = "日";
				break;
		}
		format = year + "年" + month + "月" + day + "日（周" + weekDayStr + "） " + hourStr + ":" + minStr;
		return format;
	}

	/**
	 *把字符串时间转换为毫秒数
	 * 2018.3.14-0:0
	 * */
	public static formatStrTimeToMs(str: string): number {
		let date: Date = new Date();
		let strList: any[] = str.split(".");
		date.setFullYear(strList[0]);
		date.setMonth((+strList[1]) - 1);

		let strL2: any[] = strList[2].split("-");
		date.setDate(strL2[0]);

		let strL3: any[] = strL2[1].split(":");
		date.setHours(strL3[0]);
		date.setMinutes(strL3[1]);
		date.setSeconds(0);

		return date.getTime();
	}
}


