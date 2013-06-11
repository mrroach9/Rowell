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
            $(hotkey.target).first().trigger(hotkey.trigger);
            return false;
        });
        $(document).keydown(function(event) {
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
                return false;
        });
    };

    this.untriggerAll = function() {
        $(document).unbind('keypress');
        $(document).unbind('keydown');
        $(document).unbind('keyup');
    };
}

function register_default_hotkeys(){
    // Ctrl + Enter(13)/w(87)/x(88) on #write-post-panel: Publish post;
    var publishPostHotkeyEnter = new Hotkey(13, true, false,
        '#write-post-panel', '#publish-post-button', 'click');
    
    var publishPostHotkeyW = new Hotkey(87, true, false,
        '#write-post-panel', '#publish-post-button', 'click');
 
    var publishPostHotkeyX = new Hotkey(88, true, false,
        '#write-post-panel', '#publish-post-button', 'click');

    // Esc(27) on #write-post-panel: Cancel posting;
    var cancelPostHotkey = new Hotkey(27, false, false,
        '#write-post-panel', '#cancel-post-button', 'click');

    // Left(37) and Right(39) on #post-view: next post and prev post;
    // on #mail-view: next/prev mail
    var prevPostHotkey = new Hotkey(37, false, false,
        '#post-view', '.prev-post-button', 'click');
    var nextPostHotkey = new Hotkey(39, false, false,
        '#post-view', '.next-post-button', 'click');
    var prevMailHotkey = new Hotkey(37, false, false,
        '#mail-view', '.prev-mail-button', 'click');
    var nextMailHotkey = new Hotkey(39, false, false,
        '#mail-view', '.next-mail-button', 'click');

    // Ctrl + Left/Right on #post-view: Same topic next/prev post;
    var SpPrevPostHotkey = new Hotkey(37, true, false,
        '#post-view', '.st-prev-button', 'click');
    var SpNextPostHotkey = new Hotkey(39, true, false,
        '#post-view', '.st-next-button', 'click');

    // p and l on #post-view: Same topic next/prev post;
    var SpPrevPostHotkeyL = new Hotkey(76, false, false,
        '#post-view', '.st-prev-button', 'click');
    var SpNextPostHotkeyP = new Hotkey(80, false, false,
        '#post-view', '.st-next-button', 'click');

    // Left and Right on #board-table: next and prev page of posts;
    // on #mailbox-table: next/prev page of mails
    var prevBoardPageHotkey = new Hotkey(37, false, false,
        '#board-table', '#board-table .prev-page-button', 'click');
    var nextBoardPageHotkey = new Hotkey(39, false, false,
        '#board-table', '#board-table .next-page-button', 'click');
    var prevMailboxPageHotkey = new Hotkey(37, false, false,
        '#mailbox-table', '#mailbox-table .prev-page-button', 'click');
    var nextMailboxPageHotkey = new Hotkey(39, false, false,
        '#mailbox-table', '#mailbox-table .next-page-button', 'click');

    //r on #post-view: reply in normal mode;
    var replyHotkey = new Hotkey(82, false, false,
        '#post-view', '.reply-post-button[type=S]', 'click');

    //Ctrl + p on #board-table: write a new post in normal mode;
    var writePostHotkey = new Hotkey(80, true, false,
        '#board-table', '.new-post-normal', 'click');

    //f on #board-table: clear unread tags;
    var clearUnreadHotkey = new Hotkey(70, false, false,
        '#board-table', '.clear-board-unread', 'click');

    bbs_hotkey_manager.untriggerAll();
    bbs_hotkey_manager.add(publishPostHotkeyEnter);
//  bbs_hotkey_manager.add(publishPostHotkeyW);
//  bbs_hotkey_manager.add(publishPostHotkeyX);
    bbs_hotkey_manager.add(cancelPostHotkey);
    bbs_hotkey_manager.add(prevPostHotkey);
    bbs_hotkey_manager.add(nextPostHotkey);
    bbs_hotkey_manager.add(prevMailHotkey);
    bbs_hotkey_manager.add(nextMailHotkey);
    bbs_hotkey_manager.add(SpPrevPostHotkey);
    bbs_hotkey_manager.add(SpNextPostHotkey);
    bbs_hotkey_manager.add(SpPrevPostHotkeyL);
    bbs_hotkey_manager.add(SpNextPostHotkeyP);
    bbs_hotkey_manager.add(prevBoardPageHotkey);
    bbs_hotkey_manager.add(nextBoardPageHotkey);
    bbs_hotkey_manager.add(prevMailboxPageHotkey);
    bbs_hotkey_manager.add(nextMailboxPageHotkey);
    bbs_hotkey_manager.add(replyHotkey);
    bbs_hotkey_manager.add(writePostHotkey);
    bbs_hotkey_manager.add(clearUnreadHotkey);
    bbs_hotkey_manager.triggerAll();
}