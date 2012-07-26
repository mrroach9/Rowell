function Hotkey(keyCode, ctrl, alt, selector, target, trigger){
	this.keyCode = keyCode;
	this.ctrlPressed = ctrl;
	this.altPressed = alt;
	this.selector = selector;
	this.trigger = trigger;
	this.target = target;
	
	this.getMask = function() {
		var code = 0;
		code += this.ctrlPressed ? 1 : 0;
		code += this.altPressed ? 2 : 0;
		return code;
	}
}


function HotkeyManager() {
	this.hotkeyMap = new Array();
	
	this.add = function(hotkey) {
		var code = hotkey.getMask();
		var list = this.hotkeyMap[hotkey.selector];
		if (list == null) {
			this.hotkeyMap[hotkey.selector] = new Array();
		}
		list = this.hotkeyMap[hotkey.selector][hotkey.keyCode];
		if (list == null) {
			this.hotkeyMap[hotkey.selector][hotkey.keyCode] = new Array(4);
		};
		list = this.hotkeyMap[hotkey.selector][hotkey.keyCode];
		if (list[code] != null) {
			return false;
		} else {
			this.hotkeyMap[hotkey.selector][hotkey.keyCode][code] = hotkey;
		}
		return true;
	};
	
	this.get = function(hotkey) {
		var list = this.hotkeyMap[hotkey.selector];
		if (list == null) return null;
		list = list[hotkey.keyCode];
		if (list == null) return null;
		return list[hotkey.getMask()];
	};
	
	this.remove = function(hotkey) {
		var list = this.hotkeyMap[hotkey.selector];
		if (list == null) return false;
		list = list[hotkey.keyCode];
		if (list == null) return false;
		this.hotkeyMap[hotkey.selector][hotkey.keyCode][hotkey.getMask()] = null;
		return true;
	};
	
	this.triggerAll = function() {
		var manager = this;
		$(document).keyup(function(event) {
			var keycode = event.keyCode;
			var mask = 0;
			mask += event.ctrlKey ? 1 : 0;
			mask += event.altKey ? 2 : 0;
			var selector = bbs_topmost_stack[bbs_topmost_stack.length - 1];
			var list = manager.hotkeyMap[selector];
			if (list == null) {
				return;
			}
			var list = list[keycode];
			if (list == null) return;
			var hotkey = list[mask];
			if (hotkey == null) return;
			if (hotkey.selector != selector) {
				return;
			}
			$(hotkey.target).trigger(hotkey.trigger);	
		});
	};
	
	this.untriggerAll = function() {
		$(document).unbind('keypress');
		$(document).unbind('keydown');
		$(document).unbind('keyup');
	};
}

var bbs_hotkey_manager = new HotkeyManager();
var bbs_topmost_stack = new Array();