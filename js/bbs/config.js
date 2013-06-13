var website_address = location.protocol + '//' + location.hostname + location.pathname;

var bbs_string = {
    favboard_name       :   '收藏夹',
    allboard_name       :   '所有版面',
    mailbox_name        :   '站内信',
    title               :   '9# BBS - Rowell v0.3.0',
    version             :   '0.3.0',
    send_source         :   '[Sent from Rowell v0.3.0]',
    unimpltd_title      :   '矮油',
    unimpltd_text       :   '此功能尚未实现，我们将在后续版本中添加，敬请谅解。',
    entry_folder        :   '[目录]',
    entry_sticky        :   '[置底]',
    post_title_prefix   :   '● ',
    mail_title_prefix   :   '★ ',
    reply_title_prefix  :   'Re: ',
    attach_pic_text     :   '本帖附带图片如下：',
    attach_pic_tooltip  :   '点击查看大图',
    attach_other_text   :   '本帖附带文件如下：',
    attach_other_tooltip:   '下载文件',
    confirm_cancel_post :   '确定舍弃当前未发布文章吗？'
};

var bbs_query = {
    server              :   'https://bbs.net9.org:8080',
    client_id           :   0,
    client_secret       :   0,
    auth : {
        auth            :   '/auth/auth?response_type=token&client_id=0&redirect_uri=',
        token           :   '/auth/token',
        session_verify  :   '/session/verify'
    },
    view : {
        allboard        :   '/board/list',
        favboard        :   '/favboard/list',
        postlist        :   '/board/post_list',
        viewpost        :   '/post/view',
        sametopic       :   '/post/nextid',
        mailbox         :   '/mail/list',
        mail            :   '/mail/view'
    },
    write_post : {
        get_quote       :   '/post/quote',
        write_post      :   '/post/new',
        prepare         :   '/post/prepare',
        attach          :   '/store/new'
    },
    utility : {
        clear_unread    :   '/board/clear_unread'
    }
};

bbs_query.auth.auth += encodeURIComponent(website_address);

var bbs_type = {
    path : {
        allboard    :   'PATH_ALLBOARD',
        favboard    :   'PATH_FAVBOARD',
        mailbox     :   'PATH_MAILBOX',
        folder      :   'PATH_FOLDER',
        board       :   'PATH_BOARD',
        post        :   'PATH_POST',
        sticky_post :   'PATH_STICKY_POST',
        digest      :   'PATH_DIGEST',
        mail        :   'PATH_MAIL'
    },
    entry : {
        allboard    :   'ENTRY_ALLBOARD',
        favboard    :   'ENTRY_FAVBOARD',
        board       :   'ENTRY_BOARD',
        folder      :   'ENTRY_FOLDER',
        post        :   'ENTRY_POST',
        mailbox     :   'ENTRY_MAILBOX',
        mail        :   'ENTRY_MAIL'
    },
    write_post : {
        new         :   'POST_NEW',
        reply       :   'POST_REPLY'
    },
    write_mail : {
        new         :   'MAIL_NEW',
        reply       :   'MAIL_REPLY'
    },
    view_mailbox : {
        sent        :   'sent',
        inbox       :   'inbox'
    },
    post_mark : {
        m           :   'marked',
        g           :   'g'
    },
    post_list_mode : {
        normal      :   'normal', 
        digest      :   'digest',
        mark        :   'mark',
        thread      :   'thread',
        origin      :   'origin',
        sticky      :   'sticky'
    },
    cookie : {
        session     :   'bbs_session',
        error_session   :   'SESSION_ERROR'
    }
};

var bbs_msg = {
    info : {
        zhname : '提示：',
        class_name : 'alert alert-info',
        board_reach_last : '已到达本版最后一页。',
        board_reach_first : '已到达本版第一页。',
        post_reach_last : '已到达本版最后一贴。',
        post_reach_first : '已到达本版第一帖。',
        post_publish_success : '帖子发表成功。',
        mailbox_reach_last : '已到达收件箱最后一页。',
        mailbox_reach_first : '已到达收件箱第一页。',
        mail_reach_last : '已到达最后一封邮件。',
        mail_reach_first : '已到达第一封邮件。',
        sametopic_reach_last : '已到达本主题最后一贴。',
        sametopic_reach_first : '已到达本主题第一帖。',
        sametopic_head_not_exist : '主题贴不存在或已被删除。',
        board_unread_cleared : '本版未读标记已清除。',
        all_unread_cleared : '全站未读标记已清除。'
    },
    error : {
        zhname : '错误：',
        class_name : 'alert alert-error',
        network_error : '网络连接异常，无法完成您的请求。',
        unknown_error : '出现未知错误，请重新请求或联系开发者。',
        cannot_reply    :   '此帖已被设置为不可回复。',
        cannot_post     :   '本版已被设置为只读。',
        invalid_sticky_op:  '无法对置底贴进行该操作。'
    },
    warning : {
        class_name : 'alert alert-block',
        zhname : '警告：'
    }
};

var bbs_settings = {
    max_board_count :   999,
    post_count      :   20,
    max_post_count  :   999,
    max_mail_count  :   999,
    mail_count      :   20
};

var accounts9_session_cookie = 'accounts9_session';

var accounts9 = {
    server      : 'https://account.net9.org',
    client_id   : 'AicTWsI7iS-ZD53Z4AI8ev2PhjU',
    client_secret   : 'rtubs1cpNfZeA9CG4K5a',
    connect         : '/bbs/connect',
    auth            : '/api/authorize',
    access_token    : '/api/access_token',
    userinfo        : '/api/userinfo',
    bbsuserinfo     : '/api/bbsuserinfo',
};

accounts9.auth += '?redirect_uri=' + encodeURIComponent(website_address + '/login_accounts9.html');
accounts9.auth += '&client_id=' + accounts9.client_id;
