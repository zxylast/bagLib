//显示基类,用于增加一些显示相关的共有函数
class BaseSYBView extends eui.Component {

	/**由于声音事件 */
	protected changeEvent = {};

	/**
	 * 监听事件
	 * @param {Function} func 监听的事件标记
	 * @param {Function} myfunc 监听响应的函数
	 * @param callobj 是否立刻执行响应函数一次
	 */
	public observe(func: Function, myfunc: Function, callobj: any = undefined) {
		MessageSYBCenter.addListener(func, myfunc, this, callobj);
	}

	public removeObserve() {
		MessageSYBCenter.ins().removeAll(this);
	}

	public addTouchEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.TOUCH_TAP, obj, func);
	}

	public removeTouchEvent(obj: any, func: Function) {
		if (obj) obj.removeEventListener(egret.TouchEvent.TOUCH_TAP, func, this);
	}

	public addTouchEndEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.TOUCH_END, obj, func);
	}

	public removeTouchEndEvent(obj: any, func: Function) {
		this.removeEvent(egret.TouchEvent.TOUCH_END, obj, func);
	}

	public addChangeEvent(obj: any, func: Function) {
		if (obj && obj instanceof eui.TabBar) {
			let f = (...param) => {
				SoundUtil.ins().playEffect(SoundUtil.WINDOW);
				func.call(this, ...param);
			}
			this.changeEvent[obj.hashCode] = f;
			this.addEvent(egret.TouchEvent.CHANGE, obj, f);
		} else {
			this.addEvent(egret.TouchEvent.CHANGE, obj, func);
		}
	}
	public removeChangeEvent(obj: any, func: Function) {
		if (obj && obj instanceof eui.TabBar) {
			if (this.changeEvent[obj.hashCode]) {
				this.removeEvent(egret.TouchEvent.CHANGE, obj, this.changeEvent[obj.hashCode]);
				delete this.changeEvent[obj.hashCode];
			}
		} else {
			this.removeEvent(egret.TouchEvent.CHANGE, obj, func);
		}
	}

	public addChangingEvent(obj: any, func: Function) {
		this.addEvent(egret.TouchEvent.CHANGING, obj, func);
	}

	public removeChangingEvent(obj: any, func: Function) {
		this.removeEvent(egret.TouchEvent.CHANGING, obj, func);
	}

	public addEvent(ev: string, obj: any, func: Function) {
		if (!obj) {//Assert(obj, "不存在绑定对象")
			//console.warn(`不存在绑定对象`);
			return;
		}
		obj.addEventListener(ev, func, this);
	}

	public removeEvent(ev: string, obj: any, func: Function) {
		if (!obj) {
			//console.warn(`不存在绑定对象`);
			return;
		}
		obj.removeEventListener(ev, func, this);
	}

	public $onClose() {

		let fun = function (tar: egret.DisplayObjectContainer) {
			for (let i: number = 0; i < tar.numChildren; i++) {
				let obj = tar.getChildAt(i);
				if (obj instanceof BaseSYBView) {
					(<BaseSYBView>obj).$onClose();
				} else if (obj instanceof egret.DisplayObjectContainer) {
					fun(obj);
				}
			}
		};

		fun(this);

		this.removeObserve();
	}
}