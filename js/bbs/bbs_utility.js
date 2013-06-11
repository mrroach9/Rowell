function clear_unread(board_name, callback_func) {
    var request_settings = {
        url : bbs_query.server + bbs_query.utility.clear_unread,
        type: 'POST',
        data: {
            session: bbs_session
        }
    };
    request_settings = setAjaxParam(request_settings);

    if (board_name != '') {
        request_settings.data.name = board_name;
    }

    var resp = $.ajax(request_settings);

    resp.success(function(response){
        var msg = {
            type : 'info',
            content : (board_name == '') ? 'all_unread_cleared' : 'board_unread_cleared'
        };
        UI_notify_update(msg);
        if (board_name != '') {
            view_board(board_name, -1, -1, callback_func, 'click', -1);
        } else {
            view_boardlist(bbs_type.entry.allboard, -1, '', callback_func, 0);
        }
    });

    resp.fail(function(jqXHR, textStatus){
        var msg = {
            type : 'error',
            content : 'network_error'
        };
        callback_func();
        UI_notify_update(msg);
    });
}