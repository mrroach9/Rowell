function postPrepare(mode, callback_func){
    var boardPathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
    if (boardPathTerm == null) {
        return;
    }
    var data = {
        session : bbs_session,
        board : boardPathTerm.name,
        for     : 'new',
        anonymous   :   1,
        attachments : '[{"name":"test","store_id":"test"}]'
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

function delPost(board_name, id, xid, callback_func, popNum) {
    var data = {
        session : bbs_session,
        board : board_name,
        id : id,
        xid : xid,
    };
    var request_settings = {
        url : bbs_query.server + bbs_query.del_post.del_post,
        type: 'POST',
        data: data
    };
    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);
    resp.success(function(response){
        bbs_post_info.quote = JSON.parse(response);
        view_board(board_name, -1, id + 1, callback_func, 'click', popNum);
        var msg = {
            type : 'info',
            content : 'post_delete_success'
        };
        UI_notify_update(msg);
    });

    resp.fail(function(jqXHR, textStatus){
        var msg;
        if (jqXHR.status == 403) {
            msg = {
                type : 'error',
                content : 'cannot_delete_post'
            };
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

function writePost(post_info, callback_func){
    // Save sketch before posting. If the post is published successfully, 
    // the sketch will be removed.
    localStorage[bbs_type.storage.sketch] = post_info.content;
    localStorage[bbs_type.storage.sketch_title] = post_info.title;

    var data = {
        session : bbs_session,
        title : post_info.title,
        content: post_info.content + '\n\n' + bbs_string.send_source,
        signature_id : post_info.qmd,
        anonymous: (post_info.anony ? 1 : 0),
        attachments: JSON.stringify(post_info.attach)
    };
    var popNum = -1;
    var boardPathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
    var postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.post);
    if (post_info.type == bbs_type.write_post.new) {
        popNum = -1;
        if (boardPathTerm == null || postPathTerm != null){
            return;
        }
        data.board = boardPathTerm.name;
    } else if (post_info.type == bbs_type.write_post.reply) {
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
        // Remove sketch
        localStorage.removeItem(bbs_type.storage.sketch);
        localStorage.removeItem(bbs_type.storage.sketch_title);

        // Load board.
        if (post_info.type == bbs_type.write_post.new) {
            view_board(boardPathTerm.name, -1, -1, callback_func, 'click', popNum);
        } else {
            var currentId = postPathTerm.data.id;
            if (currentId + 3 < bbs_settings.post_count) {
                view_board(boardPathTerm.name, 1, -1, callback_func, 'click', popNum);
            } else {
                view_board(boardPathTerm.name, -1, currentId + 3, callback_func, 'click', popNum);
            }
        }

        // Update UI and notification
        var msg = {
            type : 'info',
            content : 'post_publish_success'
        };
        UI_hide_backdrop();

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
