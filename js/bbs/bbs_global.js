// This file defines all global variables.

// Indicating if the loading logo is now displaying
var bbs_loading_show = false;

// The info and data of current post to be published
var bbs_post_info = {
    can_anony   :   false,
    sig_id      :   -1,
    quote       :   '',
    type        :   ''
};

// The session obtained from server
var bbs_session = '';

// Hotkey manager and stack used in the manager, which shows the
// current top-most div in the user's view. Div's not at top-most
// of the stack will not respond to hotkeys.
var bbs_hotkey_manager = new HotkeyManager();
var bbs_topmost_stack = new Array();

// Path structure of bbs reading
var bbs_path = new Path();

// Sticky posts of current board being read.
var bbs_sticky = {
    name        :   '',
    posts       :   [],
};
