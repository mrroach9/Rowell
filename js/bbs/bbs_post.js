function postPrepare(mode, callback_func){
    var boardPathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
    if (boardPathTerm == null) {
        return;
    }
    var data = {
        session : bbs_session,
        board : boardPathTerm.name,
        for     : 'new',
        anonymous   :   1
//      attachments : '[{"name":"test","store_id":"test"}]'
    };
    if (mode == bbs_type.write_post.reply) {
        var postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.post);
        if (postPathTerm == null) {
            postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.sticky_post);
            if (postPathTerm != null) {
                data.re_mode = bbs_type.post_list_mode.sticky;
            } else {
                return;
            }
        } else {
            data.re_mode = bbs_type.post_list_mode.normal;
        }
        data.re_id = postPathTerm.data.id;
        data.re_xid = postPathTerm.data.xid;
    }
    var request_settings = {
        url     :   bbs_query.server + bbs_query.write_post.prepare,
        type    : 'GET',
        data    :   data
    };
    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);
    resp.success(function(response){
        var res = JSON.parse(response)
        var sig_id = res.signature_id;
        bbs_post_info.sig_id = sig_id;
        bbs_post_info.can_anony = (res.error.anonymous == 1) ? false : true;
        bbs_post_info.can_attach = (res.error.attachment == 1) ? false : true;
        bbs_post_info.type = mode;
        callback_func();
    });
    resp.fail(function(jqXHR, textStatus){
        var msg = null;
        if (jqXHR.status == 416) {
            if (jqXHR.statusText == 'board is readonly') {
                msg = {
                    type : 'error',
                    content : 'cannot_post'
                };
            } else if (jqXHR.statusText == 'can\'t reply this post') {
                msg = {
                    type : 'error',
                    content : 'cannot_reply'
                };
            }
        } else {
            msg = {
                type : 'error',
                content : 'network_error'
            };
        }
        UI_notify_update(msg);
    });
}

function getQuote(mode, callback_func){
    var boardPathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
    var postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.post);
    var quoteMode = bbs_type.post_list_mode.normal;
    if (boardPathTerm == null){
        return;
    }
    if (postPathTerm == null) {
        postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.sticky_post);
        if (postPathTerm != null) {
            quoteMode = bbs_type.post_list_mode.sticky;
        } else {
            return;
        }
    }
    var data = {
        session : bbs_session,
        board : boardPathTerm.name,
        id : postPathTerm.data.id,
        xid : postPathTerm.data.xid,
        mode : mode,
        index_mode : quoteMode
    };
    var request_settings = {
        url : bbs_query.server + bbs_query.write_post.get_quote,
        type: 'GET',
        data: data
    };
    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);
    resp.success(function(response){
        bbs_post_info.quote = JSON.parse(response);
        callback_func();
    });

    resp.fail(function(jqXHR, textStatus){
        var msg = {
                type : 'error',
                content : 'network_error'
        };
        UI_notify_update(msg);
    });
}

function writePost(type, title, content, qmd_id, anonym, callback_func){
    var data = {
        session : bbs_session,
        title : title,
        content: content + '\n\n' + bbs_string.send_source,
        signature_id : qmd_id,
        anonymous: (anonym ? 1 : 0)
    };
    var popNum = -1;
    var boardPathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
    var postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.post);
    if (type == bbs_type.write_post.new) {
        popNum = -1;
        if (boardPathTerm == null || postPathTerm != null){
            return;
        }
        data.board = boardPathTerm.name;
    } else if (type == bbs_type.write_post.reply) {
        popNum = -2;
        if (boardPathTerm == null){
            return;
        }
        if (postPathTerm == null) {
            postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.sticky_post);
            if (postPathTerm != null) {
                data.re_mode = bbs_type.post_list_mode.sticky;
            } else {
                return;
            }
        } else {
            data.re_mode = bbs_type.post_list_mode.normal;
        }
        data.board = boardPathTerm.name;
        data.re_id = postPathTerm.data.id;
        data.re_xid = postPathTerm.data.xid;
    }
    var request_settings = {
        url : bbs_query.server + bbs_query.write_post.write_post,
        type: 'POST',
        data: data
    };
    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);
    resp.success(function(response){
        var msg = {
            type : 'info',
            content : 'post_publish_success'
        };
        UI_hide_backdrop();
        if (type == bbs_type.write_post.new) {
            view_board(boardPathTerm.name, -1, -1, callback_func, 'click', popNum);
        } else {
            var currentId = postPathTerm.data.id;
            if (currentId + 1 < bbs_settings.post_count) {
                view_board(boardPathTerm.name, 1, -1, callback_func, 'click', popNum);
            } else {
                view_board(boardPathTerm.name, -1, currentId + 1, callback_func, 'click', popNum);
            }
        }
        UI_notify_update(msg);
    });

    resp.fail(function(jqXHR, textStatus){
        var msg = {
                type : 'error',
                content : 'network_error'
        };
        UI_hide_backdrop();
        view_board(boardPathTerm.name, -1, -1, callback_func, 'click', popNum);
        UI_notify_update(msg);
    });
}
