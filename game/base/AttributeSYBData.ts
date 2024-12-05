/**
 *
 * @author
 *
 */
class AttributeSYBData {
	public type: number;
	public value: number;

	public constructor(type: number = 0, value: number = 0) {
		this.type = type;
		this.value = value;
	}

	public static getAttrByValue(type: number, value: number): string {
		let str: string = "";
		value = Math.floor(value);
		switch (type) {
			case AttributeSYBType.atHpMax:
			case AttributeSYBType.atAttack:
			case AttributeSYBType.atDefense:
			case AttributeSYBType.atSpeed:
				str += value;
				break;
			case AttributeSYBType.atCritRate:
			case AttributeSYBType.atCritDamage:
				str += (value / 100) + "%";
				break;
			default:
		}
		return str;
	}

	/**
	 * 通过属性类型获取属性中文名字
	 * @param type
	 * @param bool true：显示冒号 false：不显示冒号
	 */
	static getAttrStrByType(type: number, bool: boolean = true): string {
		let str: string = "";
		switch (type) {
			case AttributeSYBType.atAttack:
				str = "攻击";
				break;
			case AttributeSYBType.atHpMax:
				str = "生命";
				break;
			case AttributeSYBType.atDefense:
				str = "防御";
				break;
			case AttributeSYBType.atSpeed:
				str = "速度";
				break;
			case AttributeSYBType.atCritRate:
				str = "暴击";
				break;
			case AttributeSYBType.atCritDamage:
				str = "暴伤";
				break;
		
			default:

				break;
		}
		if (bool) {
			return str + ":";
		} else {
			return str
		}
	}

}
