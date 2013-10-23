function view_mail(id, callback_func, source, popNum) {
    var request_settings = {
        url : bbs_query.server + bbs_query.view.mail,
        type: 'GET',
        data: {
            session: bbs_session,
            folder: bbs_type.view_mailbox.inbox,
            index: id
        }
    };

    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);

    resp.success(function(response){
        bbs_path.popTo(popNum);
        var mail = extractMailContent(response);
        var pathTerm = new PathTerm(bbs_type.path.mail, mail.title, mail);
        bbs_path.push(pathTerm);
        bbs_widget['mail-unread'].forceCheck();
        callback_func();
    });

    resp.fail(function(jqXHR, textStatus) {
        var msg = null;
        if (jqXHR.status == 416) {
            if (source == 'next') {
                msg = {
                    type : 'info',
                    content : 'mail_reach_last'
                };
            } else if (source == 'prev') {
                msg = {
                    type : 'info',
                    content : 'mail_reach_first'
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

function view_mailbox(type, start, end, callback_func, source, popNum){
    var request_settings = {
        url : '',
        type: 'GET',
        data: {
            session: bbs_session,
            folder: bbs_type.view_mailbox.inbox
        }
    };

    request_settings = setAjaxParam(request_settings);
    if (start <= 0){
        if (end <= 0) {
            request_settings.data.count = bbs_settings.mail_count;
        } else {
            request_settings.data.end = end;
            request_settings.data.count = bbs_settings.mail_count;
        }
    } else if (end <= 0) {
        request_settings.data.start = start;
        request_settings.data.count = bbs_settings.mail_count;
    } else if (end - start > bbs_settings.max_mail_count) {
        request_settings.data.count = bbs_settings.mail_count;
    } else {
        request_settings.data.start = start;
        request_settings.data.end = end;
    }

    if (type == bbs_type.entry.mailbox) {
        request_settings.url = bbs_query.server + bbs_query.view.mailbox;
    }

    var resp = $.ajax(request_settings);

    resp.success(function(response){
        var maillist = extractMailInfo(response);
        var pathTerm = new PathTerm(bbs_type.path.mailbox, bbs_string.mailbox_name, maillist);

        var iStart = 999999;
        var iEnd = -1;
        for (var i = 0; i < maillist.length; ++i) {
            if (maillist[i].id < iStart) {
                iStart = maillist[i].id;
            }
            if (maillist[i].id > iEnd) {
                iEnd = maillist[i].id;
            }
        }

        pathTerm.start = iStart;
        pathTerm.end = iEnd;
        bbs_path.popTo(popNum);
        bbs_path.push(pathTerm);

        callback_func();
    });

    resp.fail(function(jqXHR, textStatus){
        var msg = null;
        if (jqXHR.status == 416) {
            if (source == 'next') {
                msg = {
                    type : 'info',
                    content : 'mailbox_reach_last'
                };
            } else if (source == 'prev') {
                msg = {
                    type : 'info',
                    content : 'mailbox_reach_first'
                };
            }
            view_mailbox(bbs_type.entry.mailbox, -1, -1, callback_func, 'click', popNum);
        } else {
            var msg = {
                type : 'error',
                content : 'network_error'
            };
        }
        UI_notify_update(msg);
    });
}

function view_mailbox_next_page(callback_func){
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.mailbox) {
        return;
    }
    var newStart = pathTerm.end + 1;
    view_mailbox(bbs_type.entry.mailbox, newStart, -1, callback_func, 'next', -1);
}

function view_mailbox_prev_page(callback_func){
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.mailbox) {
        return;
    }
    var newStart = pathTerm.start - bbs_settings.post_count;
    if (newStart <= 0) {
        view_mailbox(bbs_type.entry.mailbox, 1, -1, callback_func, 'next', -1);
        var msg = {
            type : 'info',
            content : 'board_reach_first'
        };
        UI_notify_update(msg);
    } else {
        view_mailbox(bbs_type.entry.mailbox, newStart, -1, callback_func, 'next', -1);
    }
}

function view_mailbox_jumpto(mail_id, callback_func){
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.mailbox) {
        return;
    }
    if (typeof(mail_id) != 'undefined' && mail_id != null && mail_id != '') {
        view_mailbox(bbs_type.entry.mailbox, mail_id, -1, callback_func, 'next', -1);
    }
}

function view_next_mail(callback_func) {
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.mail) {
        return;
    }
    view_mail(pathTerm.data.id + 1, callback_func, 'next', -1);
}

function view_prev_mail(callback_func) {
    var pathTerm = bbs_path.getLast();
    if (pathTerm.type != bbs_type.path.mail) {
        return;
    }
    view_mail(pathTerm.data.id - 1, callback_func, 'prev', -1);
}

function check_new_mail(callback_func) {
    var request_settings = {
        type: 'GET',
        data: {
            session: bbs_session,
            folder: bbs_type.view_mailbox.inbox,
            count: 1
        },
        url: bbs_query.server + bbs_query.view.mailbox
    };
    request_settings = setAjaxParam(request_settings);
    var resp = $.ajax(request_settings);

    resp.success(function(response){
        var maillist = extractMailInfo(response);
        callback_func(!maillist[0].read);
    }); 
}

function extractMailContent(contentStr) {
    mail = JSON.parse(contentStr);
    mail.title = html_encode(mail.title);
    mail.content = ansi2html(mail.content);
    return mail;
}

function extractMailInfo(contentStr) {
    var maillist = JSON.parse(contentStr).mails;
    for (var i = 0; i < maillist.length; ++i) {
        maillist[i].title = html_encode(maillist[i].title);
        if (maillist[i].title.substr(0,4) != bbs_string.reply_title_prefix) {
            maillist[i].title = bbs_string.mail_title_prefix + maillist[i].title;
        }
        maillist[i].posttime = getTimeStr(maillist[i].posttime);
    }
    return maillist;
}

// Note: DO NOT CALL functions below as they have no corresponding API's yet!

function mailPrepare(mode, callback_func){
    var data = {
        session : bbs_session,
        for     : 'new'
    };
    if (mode == bbs_type.write_mail.reply) {    
        //TODO
    }
    var request_settings = {
        url     :   bbs_query.server + bbs_query.write_mail.prepare,
        type    : 'GET',
        data    :   data,
        dateType    :   'text',
        cache   : false
    };
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
    if (boardPathTerm == null || postPathTerm == null){
        return;
    }
    var data = {
        session : bbs_session,
        board : boardPathTerm.name,
        id : postPathTerm.data.id,
        xid : postPathTerm.data.xid,
        mode : mode
    };
    var request_settings = {
        url : bbs_query.server + bbs_query.write_post.get_quote,
        type: 'GET',
        data: data,
        dataType: 'text',
        cache: false
    };
    
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

function writeMail(type, title, content, qmd_id, anonym, callback_func){
    var data = {
        session : bbs_session,
        title : title,
        content: content + '\n\n' + bbs_info.send_source,
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
        if (boardPathTerm == null || postPathTerm == null){
            return;
        }
        data.board = boardPathTerm.name;
        data.re_id = postPathTerm.data.id;
        data.re_xid = postPathTerm.data.xid;
    }
    var request_settings = {
        url : bbs_query.server + bbs_query.write_post.write_post,
        type: 'POST',
        data: data,
        dataType: 'text',
        cache: false
    };
    
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
            if (currentId + 3 < bbs_post_count) {
                view_board(boardPathTerm.name, 1, -1, callback_func, 'click', popNum);
            } else {
                view_board(boardPathTerm.name, -1, currentId + 3, callback_func, 'click', popNum);
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
        
