function view_boardlist(type, index, folder_name, callback_func, popNum){
    var request_settings = {
        url : '',
        type: 'GET',
        data: {
            session: bbs_session,
            start: 1,
            father: index,
            count: bbs_settings.max_board_count,
        }
    };
    request_settings = setAjaxParam(request_settings);

    var name = '';
    var pathType = '';
    if (type == bbs_type.entry.favboard) {
        request_settings.url = bbs_query.server + bbs_query.view.favboard;
        name = bbs_string.favboard_name;
        pathType = bbs_type.path.favboard;
    } else if (type == bbs_type.entry.allboard) {
        request_settings.url = bbs_query.server + bbs_query.view.allboard;
        name = bbs_string.allboard_name;
        pathType = bbs_type.path.allboard;
    } else if (type == bbs_type.entry.folder) {
        request_settings.url = bbs_query.server + bbs_query.view.favboard;
        pathType = bbs_type.path.folder;
        name = folder_name;
    }

    var resp = $.ajax(request_settings);

    resp.success(function(response){
        bbs_path.popTo(popNum);
        var boardlist = extractBoardInfo(response);
        var pathTerm = new PathTerm(pathType, name, boardlist);
        if (pathType == bbs_type.path.folder){
            pathTerm.index = index;
        }
        bbs_path.push(pathTerm);
        callback_func();
    });

    resp.fail(function(jqXHR, response) {
        var msg = {
            type : 'error',
            content : 'network_error'
        };
        UI_notify_update(msg);
    });
}

function view_board(board_name, start, end, callback_func, source, popNum){
    var request_settings = {
        url : bbs_query.server + bbs_query.view.postlist,
        type: 'GET',
        data: {
            session: bbs_session,
            name: board_name,
            mode: bbs_type.post_list_mode.normal
        }
    };
    request_settings = setAjaxParam(request_settings);

    if (start <= 0){
        if (end <= 0) {
            request_settings.data.count = bbs_settings.post_count;
        } else {
            request_settings.data.end = end;
            request_settings.data.count = bbs_settings.post_count;
        }
    } else if (end <= 0) {
        request_settings.data.start = start;
        request_settings.data.count = bbs_settings.post_count;
    } else if (end - start > bbs_settings.max_post_count) {
        request_settings.data.count = bbs_settings.post_count;
    } else {
        request_settings.data.start = start;
        request_settings.data.end = end;
    }

    var resp = $.ajax(request_settings);

    resp.success(function(response){
        var postlist = extractPostInfo(response);
        var iStart = 999999;
        var iEnd = -1;
        for (var i = 0; i < postlist.length; ++i) {
            if (postlist[i].id < iStart) {
                iStart = postlist[i].id;
            }
            if (postlist[i].id > iEnd) {
                iEnd = postlist[i].id;
            }
        }
        var pathTerm = new PathTerm(bbs_type.path.board, board_name, postlist);
        pathTerm.start = iStart;
        pathTerm.end = iEnd;
        bbs_path.popTo(popNum);
        bbs_path.push(pathTerm);

        if (bbs_sticky.name == board_name) {
            callback_func();    
        } else {
            view_sticky_post_list(board_name, callback_func);
        }
    });

    resp.fail(function(jqXHR, textStatus){
        var msg = null;
        if (jqXHR.status == 416) {
            if (source == 'next') {
                msg = {
                    type : 'info',
                    content : 'board_reach_last'
                };
            } else if (source == 'prev') {
                msg = {
                    type : 'info',
                    content : 'board_reach_first'
                };
            }
            view_board(board_name, -1, -1, callback_func, 'click', popNum);
        } else {
            var msg = {
                type : 'error',
                content : 'network_error'
            };
        }
        UI_notify_update(msg);
    });
}

function view_sticky_post_list(board_name, callback_func) {
    var request_settings = {
        url : bbs_query.server + bbs_query.view.postlist,
        type: 'GET',
        data: {
            session: bbs_session,
            name: board_name,
            mode: bbs_type.post_list_mode.sticky
        }
    };
    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);

    resp.success(function(response){
        var postlist = extractPostInfo(response);
        for (var i = 0; i < postlist.length; ++i) {
            postlist[i].read = true;
        }
        bbs_sticky.name = board_name;
        bbs_sticky.posts = postlist;
        callback_func();
    });

    resp.fail(function(jqXHR, textStatus){
        var msg = null;
        if (jqXHR.status == 416) {
        } else {
            var msg = {
                type : 'error',
                content : 'network_error'
            };
        }
        UI_notify_update(msg);
    });
}

function view_board_next_page(callback_func){
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.board) {
        return;
    }
    var name = pathTerm.name;
    var newStart = pathTerm.end + 1;
    view_board(name, newStart, -1, callback_func, 'next', -1);
}

function view_board_prev_page(callback_func){
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.board) {
        return;
    }
    var name = pathTerm.name;
    var newStart = pathTerm.start - bbs_settings.post_count;
    if (newStart <= 0) {
        view_board(name, 1, -1, callback_func, 'prev', -1);
        var msg = {
            type : 'info',
            content : 'board_reach_first'
        };
        UI_notify_update(msg);
    } else {
        view_board(name, newStart, -1, callback_func, 'prev', -1);
    }
}

function view_board_jumpto(post_id, callback_func){
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.board) {
        return;
    }
    var name = pathTerm.name;
    if (typeof(post_id) != 'undefined' && post_id != null && post_id != '') {
        view_board(name, post_id, -1, callback_func, 'next', -1);
    }
}

/** Source marks the way you come to this function, which
 *  helps to generate notifications.
 *  If source == 'click', then it is called by click on an
 *  entry from the post list. No special info will be notified.
 *  If source == 'next', then it is called by click next
 *  in reading a post. If this is the last post, a
 *  'post-reach-end' notification will be issued.
 *  Similar case for source == 'prev'.
 */
function view_post(post_id, mode, callback_func, source, popNum) {
    var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
    var request_settings = {
        url : bbs_query.server + bbs_query.view.viewpost,
        type: 'GET',
        data: {
            session : bbs_session,
            board : pathTerm.name,
            id : post_id,
            mode : mode
        }
    };
    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);
    resp.success(function(response){
        var post = extractPostContent(response);
        var type = '';
        if (mode == bbs_type.post_list_mode.normal) {
            type = bbs_type.path.post;
        } else if (mode == bbs_type.post_list_mode.sticky) {
            type = bbs_type.path.sticky_post;
        }
        var pathTerm = new PathTerm(type, post.title, post);
        bbs_path.popTo(popNum);
        bbs_path.push(pathTerm);
        callback_func();
    });

    resp.fail(function(jqXHR, textStatus) {
        var msg = null;
        if (jqXHR.status == 416) {
            if (source == 'next') {
                msg = {
                    type : 'info',
                    content : 'post_reach_last'
                };
            } else if (source == 'prev') {
                msg = {
                    type : 'info',
                    content : 'post_reach_first'
                };
            }
        } else {
            var msg = {
                type : 'error',
                content : 'network_error'
            };
        }
        UI_notify_update(msg);
    });
}

function view_next_post(callback_func) {
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.post) {
        return;
    }
    view_post(pathTerm.data.id + 1, bbs_type.post_list_mode.normal, callback_func, 'next', -1);
}

function view_prev_post(callback_func) {
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.post) {
        return;
    }
    view_post(pathTerm.data.id - 1, bbs_type.post_list_mode.normal, callback_func, 'prev', -1);
}

function view_post_sametopic(callback_func, source){
    var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
    var postTerm = bbs_path.getLast();
    if (pathTerm == null || postTerm.type != bbs_type.path.post) {
        return;
    }
    var request_settings = {
        url : bbs_query.server + bbs_query.view.sametopic,
        type: 'GET',
        data: {
            session : bbs_session,
            board : pathTerm.name,
            id : postTerm.data.id
        }
    };
    request_settings = setAjaxParam(request_settings);

    if (source == 'head') {
        request_settings.data.direction = 'backward';
        request_settings.data.last_one = 1;
    } else if (source == 'next') {
        request_settings.data.direction = 'forward';
    } else if (source == 'prev') {
        request_settings.data.direction = 'backward';
    } else if (source == 'latest') {
        request_settings.data.direction = 'forward';
        request_settings.data.last_one = 1;
    }

    var resp = $.ajax(request_settings);
    resp.success(function(response){
        var res = JSON.parse(response);
        var id = res.nextid;
        view_post(id, bbs_type.post_list_mode.normal, callback_func, 'click', -1);
    });

    resp.fail(function(jqXHR, textStatus) {
        var msg = null;
        if (jqXHR.status == 404) {
            if (source == 'next') {
                msg = {
                    type : 'info',
                    content : 'sametopic_reach_last'
                };
            } else if (source == 'prev') {
                msg = {
                    type : 'info',
                    content : 'sametopic_reach_first'
                };
            } else if (source == 'head') {
                msg = {
                    type : 'info',
                    content : 'sametopic_reach_first'
                };
            } else if (source == 'latest') {
                msg = {
                    type : 'info',
                    content : 'sametopic_reach_last'
                };
            } else {
                msg = {
                    type : 'error',
                    content : 'unknown_error'
                };
            }
        } else {
            var msg = {
                type : 'error',
                content : 'network_error'
            };
        }
        UI_notify_update(msg);
    });
}

function extractBoardInfo(contentStr) {
    contentStr = html_encode(contentStr);
    var boardlist = JSON.parse(contentStr);
    for (var i = 0; i < boardlist.length; ++i) {
        if (boardlist[i].type == 'dir') {
            boardlist[i].type = bbs_type.entry.folder;
        } else if (boardlist[i].type == 'board') {
            boardlist[i].type = bbs_type.entry.board;
        }
    }
    return boardlist;
}

function extractPostInfo(contentStr) {
    postlist = JSON.parse(contentStr);
    for (var i = 0; i < postlist.length; ++i) {
        postlist[i].title = html_encode(postlist[i].title);
        if (postlist[i].title.substr(0,4) != bbs_string.reply_title_prefix) {
            postlist[i].title = bbs_string.post_title_prefix + postlist[i].title;
        }
        postlist[i].posttime = getTimeStr(postlist[i].posttime);
    }
    return postlist;
}

function extractPostContent(contentStr) {
    post = JSON.parse(contentStr);
    post.title = html_encode(post.title);
    post.content = ansi2html(post.content);
    return post;
}
