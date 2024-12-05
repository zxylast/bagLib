/**
 * 数据加密解密处理类
 * @author WynnLam
 *
 */
class EnSYBcrypt {
	private static sSelfSalt: number = EnSYBcrypt.makeSalt();
	private static sTargetSalt: number;
	private static sKey: number;
	private static sKeyBuff: any[] = new Array(4);

	public constructor() {

	}

	public static encode(inBuff: egret.ByteArray, offset: number = 0, length: number = 0): number {
		if (offset >= inBuff.length) return 0;

		let end: number = length ? offset + length : inBuff.length;
		if (end > inBuff.length) end = inBuff.length;

		inBuff.position = offset;
		for (let i: number = offset; i < end; ++i) {
			let byte: number = inBuff.readByte();
			byte ^= EnSYBcrypt.sKeyBuff[i % 4];
			inBuff.position--;
			inBuff.writeByte(byte);
		}

		return end - offset;
	}

	public static decode(inBuff: egret.ByteArray, offset: number = 0, length: number = 0): number {
		// 当前的加密算法和解密算法是一样的，反向操作
		return EnSYBcrypt.encode(inBuff, offset, length);
	}

	public static getCRC16(bytes: egret.ByteArray, length: number = 0): number {
		return CRC16.update(bytes, 0, length);
	}

	public static getCRC16ByPos(bytes: egret.ByteArray, offset: number = 0, length: number = 0): number {
		return CRC16.update(bytes, offset, length);
	}

	public static getCheckKey(): number {
		let bytes: egret.ByteArray = new egret.ByteArray();
		bytes.endian = egret.Endian.LITTLE_ENDIAN;
		bytes.writeUnsignedInt(EnSYBcrypt.sKey);

		let ck: number = CRC16.update(bytes);
		return ck;
	}

	public static getSelfSalt(): number {
		return EnSYBcrypt.sSelfSalt;
	}

	public static getTargetSalt(): number {
		return EnSYBcrypt.sTargetSalt;
	}

	public static setTargetSalt(value: number): void {
		EnSYBcrypt.sTargetSalt = value;
		EnSYBcrypt.makeKey();
	}

	private static makeSalt(): number {
		let d: Date = new Date();
		return Math.random() * d.getTime();
	}

	private static makeKey(): void {
		EnSYBcrypt.sKey = (EnSYBcrypt.sSelfSalt ^ EnSYBcrypt.sTargetSalt) + 8254;

		for (let i: number = 0; i < 4; ++i) {
			EnSYBcrypt.sKeyBuff[i] = (EnSYBcrypt.sKey & (0xFF << (i << 3))) >> (i << 3);
		}
	}
}
