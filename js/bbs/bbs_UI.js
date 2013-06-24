function UI_register_func(){
    // Logging in and out.
    $('#logout-button').click(UI_logout);

    // Navigation bar actions.

    $(document).on('click', '#favboard-nav-label', function(){
        UI_set_loading();
        view_boardlist(bbs_type.entry.favboard, -1, '', UI_update, 0);
    });

    $(document).on('click', '#allboard-nav-label', function(){
        UI_set_loading();
        view_boardlist(bbs_type.entry.allboard, -1, '', UI_update, 0);
    });

    $(document).on('click', '#mailbox-nav-label', function() {
        UI_set_loading();
        view_mailbox(bbs_type.entry.mailbox, -1, -1, UI_update, 'click', 0);
    });

    // In-view clicking navigations

    $(document).on('click', '.mail-entry', function(){
        UI_set_loading();
        view_mail($(this).attr('mail-id'), UI_update, 'click');
        location.href = '#';
    });
    
    $(document).on('click', '.board-entry', function(){
        UI_set_loading();
        view_board($(this).attr('board-name'), -1, -1, UI_update, 'click');
        location.href = '#';
    });

    $(document).on('click', '.folder-entry', function(){
        UI_set_loading();
        view_boardlist(bbs_type.entry.folder, $(this).attr('index'), $(this).attr('folder-name'), UI_update);
        location.href='#';
    });

    $(document).on('click', '.post-entry', function() {
        UI_set_loading();
        view_post($(this).attr('post-id'), $(this).attr('type'), UI_update, 'click');
        location.href='#';
    });

    $(document).on('click', '.path-term', UI_path_click);

    // Linear navigations

    $('#board-table .last-page-button').click(function(){
        UI_set_loading();
        var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
        view_board(pathTerm.name, -1, -1, UI_update, 'click', -1);
    });

    $('#board-table .first-page-button').click(function(){
        UI_set_loading();
        var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
        view_board(pathTerm.name, 1, -1, UI_update, 'click', -1);
    });

    $('#board-table .next-page-button').click(function(){
        UI_set_loading();
        view_board_next_page(UI_update);
    });

    $('#board-table .prev-page-button').click(function(){
        UI_set_loading();
        view_board_prev_page(UI_update);
    });

    $('.button-bar button').click(function() {
        location.href = '#';
    });

    $('.jump-to-post-button').click(function(){
        UI_set_loading();
        var post_id = $(this).parent().children('.jump-to-post-input').val();
        view_board_jumpto(post_id, UI_update);
    });

    $('.jump-to-post-input').keypress(function(event) {
        if ( event.which == 13 ) {
            UI_set_loading();
            var post_id = $(this).val();
            view_board_jumpto(post_id, UI_update);
        }
    });

    $('#mailbox-table .last-page-button').click(function(){
        UI_set_loading();
        view_mailbox(bbs_type.entry.mailbox, -1, -1, UI_update, 'click', -1);
    });

    $('#mailbox-table .first-page-button').click(function(){
        UI_set_loading();
        view_mailbox(bbs_type.entry.mailbox, 1, -1, UI_update, 'click', -1);
    });

    $('#mailbox-table .next-page-button').click(function(){
        UI_set_loading();
        view_mailbox_next_page(UI_update);
    });

    $('#mailbox-table .prev-page-button').click(function(){
        UI_set_loading();
        view_mailbox_prev_page(UI_update);
    });

    $('.jump-to-mail-button').click(function(){
        UI_set_loading();
        var mail_id = $(this).parent().children('.jump-to-mail-input').val();
        view_mailbox_jumpto(mail_id, UI_update);
    });

    $('.jump-to-mail-input').keypress(function(event) {
        if ( event.which == 13 ) {
            UI_set_loading();
            var post_id = $(this).val();
            view_mail_jumpto(post_id, UI_update);
        }
    });

    $('.next-post-button').click(function(){
        var pathTerm = bbs_path.getLastTerm();
        if (pathTerm.type == bbs_type.path.sticky_post) {
            UI_notify_update({
                type: 'error',
                content: 'invalid_sticky_op'
            });
            return;
        }
        UI_set_loading();
        view_next_post(UI_update);
    });

    $('.prev-post-button').click(function(){
        var pathTerm = bbs_path.getLastTerm();
        if (pathTerm.type == bbs_type.path.sticky_post) {
            UI_notify_update({
                type: 'error',
                content: 'invalid_sticky_op'
            });
            return;
        }
        UI_set_loading();
        view_prev_post(UI_update);
    });

    $('.next-mail-button').click(function(){
        UI_set_loading();
        view_next_mail(UI_update);
    });

    $('.prev-mail-button').click(function(){
        UI_set_loading();
        view_prev_mail(UI_update);
    });

    $('.st-prev-button').click(function(){
        var pathTerm = bbs_path.getLastTerm();
        if (pathTerm.type == bbs_type.path.sticky_post) {
            UI_notify_update({
                type: 'error',
                content: 'invalid_sticky_op'
            });
            return;
        }
        UI_set_loading();
        view_post_sametopic(UI_update, 'prev');
    });

    $('.st-next-button').click(function(){
        var pathTerm = bbs_path.getLastTerm();
        if (pathTerm.type == bbs_type.path.sticky_post) {
            UI_notify_update({
                type: 'error',
                content: 'invalid_sticky_op'
            });
            return;
        }
        UI_set_loading();
        view_post_sametopic(UI_update, 'next');
    });

    $('.st-head-button').click(function(){
        var pathTerm = bbs_path.getLastTerm();
        if (pathTerm.type == bbs_type.path.sticky_post) {
            UI_notify_update({
                type: 'error',
                content: 'invalid_sticky_op'
            });
            return;
        }
        UI_set_loading();
        view_post_sametopic(UI_update, 'head');
    });

    $('.st-latest-button').click(function(){
        var pathTerm = bbs_path.getLastTerm();
        if (pathTerm.type == bbs_type.path.sticky_post) {
            UI_notify_update({
                type: 'error',
                content: 'invalid_sticky_op'
            });
            return;
        }
        UI_set_loading();
        view_post_sametopic(UI_update, 'latest');
    });

    // Notifications and contributer lists

    $('#notification-close-button').click(function(){
        $('#notification').fadeOut();
    });

    $('#notification').click(function(){
        $(this).fadeOut();
    });

    $('#ctrbtr-link').click(function() {
        $('#ctrbtr-list').modal('toggle');
    })

    $('#ctrbtr-list .cancel-button').click(function() {
        $('#ctrbtr-list').modal('hide');
    })

    // Posting, mailing and replying

    $(document).on('click', '.reply-post-button', function(){
        var type = $(this).attr('type');
        postPrepare(bbs_type.write_post.reply, function(){
            getQuote(type, UI_prepare_post_modal);
        });
    });

    $(document).on('click', '.delete-post-button', function(){
        if (confirm(bbs_string.confirm_delete_post)) {
            UI_set_loading();
            delPost(UI_update, -2);
        }
    });

    $(document).on('click', '.new-post-normal', function(){
        postPrepare(bbs_type.write_post.new, UI_prepare_post_modal);
    });
/*
    $(document).on('click', '.new-mail-normal', function(){
        mailPrepare(bbs_type.write_mail.new, UI_prepare_mail_modal);
    });
*/

    // Clear unreads

    $(document).on('click', '.clear-board-unread', function(){
        UI_set_loading();
        var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
        clear_unread(pathTerm.name, UI_update);
    });

    $(document).on('click', '.clear-all-unread', function(){
        UI_set_loading();
        clear_unread('', UI_update);
    });

    $(document).on('click', '#add-attachment-link', function(){
        $('div.attach-area').show();
    });

    $('#publish-post-button').click(UI_write_post);

    $(document).on('click', '.cancel-button', function(){
        if (confirm(bbs_string.confirm_cancel_post)) {
            UI_hide_write_post();
        }
    });

    $('input:radio[name=qmd-type]').change(function(){
        if ($('input:radio[name=qmd-type]:checked').val() == 'random') {
            $('input:text[name=qmd-number]').attr('disabled', true);
        } else {
            $('input:text[name=qmd-number]').attr('disabled', false);
        }
    });

    window.onresize = UI_onresize;
    xmpp_ui_init();
}


function UI_set_fileupload() {
    $('*').on('dragenter', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    });
    $('*').on('dragover', function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    });

    $('input:file[name=file-input]').change(function() {
        UI_start_upload(this.files, $('.attach-area'));
        this.value = '';
    });

    $('.attach-area').on('drop', function(event) {
        event.preventDefault();
        var files = event.originalEvent.dataTransfer.files;
        UI_start_upload(files, $(this));
        event.stopPropagation();
    });
}

function UI_start_upload(files, node) {
    for (var i = 0; i < files.length; ++i) {
        var file = files[i];
        var fileNode = UI_generate_uploading_file_entry(file);

        node.children('.file-list').append(fileNode);
        fileNode.find('.close').click(function() {
            $(this).closest('.file-li').hide(500, function() {
                $(this).remove();
            });
        });

        if (file.size > bbs_settings.max_file_size) {
            fileNode.find('.file-upload-progress')
                    .replaceWith($('<span>').append(bbs_string.upload_file_toolarge)
                                            .addClass('upload-failed-area'));
            fileNode.removeAttr('file-id');
        } else {
            upload_file(file, fileNode, function(uploadSuccess, node, fileInfo) {
                if (uploadSuccess) {
                    node.find('.file-upload-progress')
                        .hide(500, function() {
                            $(this).remove();
                        });
                    node.find('.file-upload-text')
                        .empty().append(convertBytes(fileInfo.size));
                    node.attr('file-id', fileInfo.id)
                        .attr('file-name', fileInfo.name);
                } else {
                    node.find('.file-upload-progress')
                        .replaceWith($('<span>').append(bbs_string.upload_file_failed)
                                                .addClass('upload-failed-area'));
                    node.remove('.file-upload-text')
                        .removeAttr('file-id')
                        .removeAttr('file-name');
                }
            }, function(event, node, filesize) {
                var percent = event.loaded / event.total;
                node.find('.bar').css('width', (100 * percent) + '%');
                node.find('.file-upload-text').empty()
                    .append(convertBytes(percent * filesize) + ' / ' 
                          + convertBytes(filesize));
            });
        }
    }
}


function UI_hide_write_post(){
    $('#write-post-panel').modal('hide');
    $('.attach-area').hide();
    $('.file-list').empty();
    bbs_topmost_stack.pop();
}

function UI_set_loading(){
    bbs_loading_show = true;
    setTimeout(function(){
        if (bbs_loading_show) {
            $('#loading-area').show();
        }
    }, 300);
    setTimeout(UI_hide_loading, 5000);
}

function UI_hide_loading(){
    bbs_loading_show = false;
    $('#loading-area').hide();
}

/*
function UI_prepare_mail_modal(){
    $('#write-post-panel').attr('post-type', bbs_post_info.type);
    if (bbs_post_info.type == bbs_type.write_post.new) {
        $('#write-post-title').val('');
        $('#write-post-content').val('');
    } else if (bbs_post_info.type == bbs_type.write_post.reply){
        $('#write-post-title').val(bbs_post_info.quote.title);
        $('#write-post-content').val(bbs_post_info.quote.content);
    }
    if (bbs_post_info.sig_id >= 0) {
        $('input:text[name=qmd-number]').val(bbs_post_info.sig_id);
        $('input:text[name=qmd-number]').attr('disabled', false);
        $('input:radio[name=qmd-type][value=number]').attr('checked', true);
    } else {
        $('input:text[name=qmd-number]').val('');
        $('input:text[name=qmd-number]').attr('disabled', true);
        $('input:radio[name=qmd-type][value=random]').attr('checked', true);
    }
    if (bbs_post_info.can_anony) {
        $('.no-anonymous-area').hide();
        $('.anonymous-area').show();
    } else {
        $('.no-anonymous-area').show();
        $('.anonymous-area').hide();
    }
    $('.anony-checkbox').attr('checked', false);
    $('#write-post-board').text(bbs_path.getBoard().name);
    $('#write-post-panel').modal({
         keyboard: false,
         backdrop: 'static',
         show: false
    });
    $('#write-post-panel').modal('toggle');
    bbs_topmost_stack.push('#write-post-panel');
}
*/

function UI_prepare_post_modal(){
    $('#write-post-panel').attr('post-type', bbs_post_info.type);
    if (bbs_post_info.type == bbs_type.write_post.new) {
        $('#write-post-title').val('');
        $('#write-post-content').val('');
    } else if (bbs_post_info.type == bbs_type.write_post.reply){
        $('#write-post-title').val(bbs_post_info.quote.title);
        $('#write-post-content').val(bbs_post_info.quote.content);
    }
    if (bbs_post_info.sig_id >= 0) {
        $('input:text[name=qmd-number]').val(bbs_post_info.sig_id);
        $('input:text[name=qmd-number]').attr('disabled', false);
        $('input:radio[name=qmd-type][value=number]').attr('checked', true);
    } else {
        $('input:text[name=qmd-number]').val('');
        $('input:text[name=qmd-number]').attr('disabled', true);
        $('input:radio[name=qmd-type][value=random]').attr('checked', true);
    }
    if (bbs_post_info.can_anony) {
        $('.no-anonymous-area').hide();
        $('.anonymous-area').show();
    } else {
        $('.no-anonymous-area').show();
        $('.anonymous-area').hide();
    }
    if (bbs_post_info.can_attach) {
        $('.no-add-attach-area').hide();
        $('.add-attach-area').show();
    } else {
        $('.no-add-attach-area').show();
        $('.add-attach-area').hide();
    }
    $('.anony-checkbox').attr('checked', false);
    $('#write-post-board').text(bbs_path.getBoard().name);
    $('#write-post-panel').modal({
         keyboard: false,
         backdrop: 'static',
         show: false
    });
    $('#write-post-panel').modal('toggle');
    bbs_topmost_stack.push('#write-post-panel');
}

function UI_write_post(){
    // If there is any file upload not finishing, do not post.
    var attach_list = [];
    var upload_finished = true;
    $('.file-list').children().each(function() {
        var id = $(this).attr('file-id');
        var name = $(this).attr('file-name');
        if (typeof(id) == 'undefined' || id == null ||
            typeof(name) == 'undefined' || name == null) {
            alert(bbs_string.upload_not_finished);
            upload_finished = false;
        } else {
            attach_list.push({
                name: name,
                store_id: id
            });
        }
    });
    if (!upload_finished) {
        return;
    }

    var title = $('#write-post-title').val();
    var qmd_type = $('input:radio[name=qmd-type]:checked').val();
    var qmd_num = $('input:text[name=qmd-number]').val();
    if (qmd_num == '' || qmd_num == null){
        qmd_num = 0;
    }
    if (qmd_type == 'random') {
        qmd_num = -1;
    }
    var content = $('#write-post-content').val();

    var anony = false;
    if (bbs_post_info.can_anony && $('.anony-checkbox').attr('checked')){
        anony = true;
    }
    var type = $('#write-post-panel').attr('post-type');

    var post_info = {
        type: type,
        title: title,
        content: content,
        qmd: qmd_num,
        anony: anony,
        attach: attach_list
    };

    UI_hide_write_post();
    UI_show_backdrop();
    
    writePost(post_info, UI_update);
}

function UI_hide_backdrop(){
    $('#global-backdrop').hide();
}

function UI_show_backdrop(){
    $('#global-backdrop').show();
}

function UI_retrieve_session(){
    bbs_session = $.url().param('access_token');
    if (typeof(bbs_session) == 'undefined') {
        bbs_session = $.cookie(bbs_type.cookie.session);
        if (bbs_session == null || typeof(bbs_session) == 'undefined' ||
            bbs_session == bbs_type.cookie.error_session) {
            bbs_session = null;
        }       
    }
    verifySession(bbs_session, true, UI_login_finished);
}

function UI_init() {
    UI_show_backdrop();

    $('#login-path').attr('href', bbs_query.server + bbs_query.auth.auth);
    //$('a#bbs-login-path').attr('href', bbs_query.server + bbs_query.auth.auth);
    //$('a#accounts9-login-path').attr('href', accounts9.server + accounts9.auth);
    $(document).attr("title", bbs_string.title);

    $('.unimplemented').popover({
        trigger: 'hover',
        placement: 'bottom',
        title: bbs_string.unimpltd_title,
        content: bbs_string.unimpltd_text
    });

    bbs_topmost_stack.splice(0);
}

function UI_login_finished(result){
    if (result) {
        if (location.href.replace('#', '') != website_address) {
            location.href = website_address;
            return;
        }
        $('#unlogged-navbar').hide();
        $('#unlogged-panel').hide();
        $('#logged-navbar').show();
        view_boardlist(bbs_type.entry.favboard, -1, '', UI_update, 0);
        xmpp_connect();
    } else {
        $('#unlogged-navbar').show();
        $('#unlogged-panel').show();
        $('#logged-navbar').hide();
        $('#logged-panel').hide();
    }
    UI_hide_backdrop();
}

function UI_logout(){
    removeSessionCookie();
    bbs_topmost_stack.splice(0);
    $('#unlogged-navbar').show();
    $('#unlogged-panel').show();
    $('#logged-navbar').hide();
    $('#logged-panel').hide();
}

function UI_path_click(){
    UI_set_loading();
    var id = $(this).attr('path-id');
    var pathTerm = bbs_path.get(id);
    if (pathTerm.type == bbs_type.path.allboard){
        view_boardlist(bbs_type.entry.allboard, -1, '', UI_update, id);
    } else if (pathTerm.type == bbs_type.path.favboard){
        view_boardlist(bbs_type.entry.favboard, -1, '', UI_update, id);
    } else if (pathTerm.type == bbs_type.path.board){
        var postPathTerm = bbs_path.getLast();
        if (postPathTerm.type == bbs_type.path.post) {
            var currentId = postPathTerm.data.id;
            if (currentId + 3 < bbs_settings.post_count) {
                view_board(pathTerm.name, 1, -1, UI_update, 'click', id);
            } else {
                view_board(pathTerm.name, -1, currentId + 3, UI_update, 'click', id);
            }
        } else {
            view_board(pathTerm.name, -1, -1, UI_update, 'click', id);
        }
    } else if (pathTerm.type == bbs_type.path.folder) {
        view_boardlist(bbs_type.entry.folder, pathTerm.index, pathTerm.name, UI_update, id);
    } else if (pathTerm.type == bbs_type.path.mailbox) {
        var mailPathTerm = bbs_path.getLast();
        if (mailPathTerm.type == bbs_type.path.mail) {
            var currentId = mailPathTerm.data.id;
            if (currentId + 3 < bbs_settings.mail_count) {
                view_mailbox(bbs_type.entry.mailbox, 1, -1, UI_update, 'click', id);
            } else {
                view_mailbox(bbs_type.entry.mailbox, -1, currentId + 3, UI_update, 'click', id);
            }
        } else {
            view_mailbox(bbs_type.entry.mailbox, -1, -1, UI_update, 'click', id);
        }
    }
}

function UI_update(){
    UI_subnavbar_update(bbs_path);
    UI_maindiv_update(bbs_path.getLastTerm());
    UI_hide_backdrop();
    UI_hide_loading();
    $('#logged-panel').show();
}

function UI_notify_update(msg){
    if (msg == null) return;
    var str = '<strong>'+bbs_msg[msg.type]['zhname'] + '</strong>'
            + bbs_msg[msg.type][msg.content];
    $('#notification-content').html(str);
    $('#notification').attr('class',bbs_msg[msg.type]['class_name']);
    $('#notification').fadeIn();
    setTimeout(function(){
        $('#notification').fadeOut();
    }, 2000);
    UI_hide_loading();
}

function UI_subnavbar_update(path) {
    $('.path').empty();
    $('.post-view-btns').hide();
    $('.board-btns').hide();
    $('.favboard-btns').hide();
    $('.allboard-btns').hide();
    $('.mailbox-btns').hide();

    var arrow = '<li><i class="icon-chevron-right right-arrow" id="boardlist-board-nav-arrow"></i></li>';
    var d = path.depth();
    for (var i = 0; i < d; ++i) {
        var term = '<li><a href="#" class="path-term" path-id=' + i + '>'
                         + path.pathList[i].name
                         + '</a></li>';
        if (i != 0) {
            $('.path').append(arrow);
        }
        $('.path').append(term);
    }
    var type = path.getLastTerm().type;
    if (type == bbs_type.path.favboard){
        $('.favboard-btns').show();
    } else if (type == bbs_type.path.board) {
        $('.board-btns').show();
    } else if (type == bbs_type.path.post ||
               type == bbs_type.path.sticky_post) {
        $('.post-view-btns').show();
    } else if (type == bbs_type.path.allboard) {
        $('.allboard-btns').show();
    } else if (type == bbs_type.path.mailbox) {
        $('.mailbox-btns').show();
    }
}

function UI_maindiv_update(pathTerm) {
    $('#mailbox-table').hide();
    $('#boardlist-table').hide();
    $('#board-table').hide();
    $('#post-view').hide();
    $('#mail-view').hide();
    bbs_topmost_stack.splice(0);
    if (pathTerm.type == bbs_type.path.mailbox) {

        $('#mailbox-table-body').empty();
        for (var i = 0; i < pathTerm.data.length; ++i) {
            var entryNode = UI_generate_mail_entry(pathTerm.data[i], pathTerm.type);
            $('#mailbox-table-body').append(entryNode);
        }
        $('.jump-to-mail-input').attr('value', '');
        $('#mailbox-table').show();

        bbs_topmost_stack.push('#mailbox-table');
    } else if (pathTerm.type == bbs_type.path.allboard ||
               pathTerm.type == bbs_type.path.favboard ||
               pathTerm.type == bbs_type.path.folder) {

        $('#boardlist-table-body').empty();
        for (var i = 0; i < pathTerm.data.length; ++i) {
            var entryNode = UI_generate_board_entry(pathTerm.data[i], pathTerm.type);
            $('#boardlist-table-body').append(entryNode);
        }
        $('#boardlist-table').show();
        bbs_topmost_stack.push('#boardlist-table');

    } else if (pathTerm.type == bbs_type.path.board) {
        $('#board-table-body').empty();

        for (var i = 0; i < pathTerm.data.length; ++i) {
            var entryNode = UI_generate_post_entry(pathTerm.data[i], false);
            $('#board-table-body').append(entryNode);
        }
        for (var i = 0; i < bbs_sticky.posts.length; ++i) {
            var entryNode = UI_generate_post_entry(bbs_sticky.posts[i], true);
            $('#board-table-body').append(entryNode);
        }

        //Easter Eggs
        if (pathTerm.name == 'e_note') {
            $('.jump-to-post-input').attr('value', '23');
        } else if (pathTerm.name == 'test') {
            $('.jump-to-post-input').attr('value', '1481');
        } else {
            $('.jump-to-post-input').attr('value', '');
        }

        $('#board-table').show();
        bbs_topmost_stack.push('#board-table');
    } else if (pathTerm.type == bbs_type.path.post || 
               pathTerm.type == bbs_type.path.sticky_post) {

        $('#post-view-area').empty();
        var content = linkify(pathTerm.data.content);
        $('#post-view-area').append(content)
                            .append(UI_generate_pic_attach_code(pathTerm.data))
                            .append(UI_generate_other_attach_code(pathTerm.data));
        $('#post-view').show();
        bbs_topmost_stack.push('#post-view');

    } else if (pathTerm.type == bbs_type.path.mail) {
        $('#mail-view-area').empty();
        var content = linkify(pathTerm.data.content);
        $('#mail-view-area').html(content);
        $('#mail-view').show();
        bbs_topmost_stack.push('#mail-view');
    }
}
        

function UI_generate_mail_entry(entry, type){
    var newPostNode = $('<span>').addClass('badge badge-important new-post-mark').append('new');
    if (type != bbs_type.path.mailbox) {
        return '';
    }
    var entryNode = $('<tr>').attr('href', '').addClass('mail-entry').attr('mail-id', entry.id)
                    .append($('<td>').append(entry.id))
                    .append($('<td>').addClass('board-table-center')
                            .append((typeof(entry.read) == 'undefined' || entry.read) ? '' : newPostNode))
                    .append($('<td>').append(entry.owner))
                    .append($('<td>').append(entry.posttime))
                    .append($('<td>').append(entry.title));
    return entryNode;
}

function UI_generate_board_entry(entry, type){
    var newPostNode = $('<span>').addClass('badge badge-important new-post-mark').append('new');
    var entryNode = $('<tr>').attr('href', '');

    if (type == bbs_type.path.allboard) {
        entryNode.addClass('board-entry').attr('board-name', entry.name)
                 .append($('<td>').append(entry.total))
                 .append($('<td>').addClass('board-table-center')
                         .append(((entry.isdir || entry.read) ? '' : newPostNode)))
                 .append($('<td>').append(entry.name))
                 .append($('<td>').append(entry.desc))
                 .append($('<td>').append(entry.currentusers))
                 .append($('<td>').append(entry.BM));
    } else if (entry.type == bbs_type.entry.folder) {
        entryNode.addClass('folder-entry').attr('folder-name', entry.name).attr('index', entry.index)
                 .append($('<td>'))
                 .append($('<td>').addClass('board-table-center'))
                 .append($('<td>').append(bbs_string.entry_folder))
                 .append($('<td>').append(entry.name))
                 .append($('<td>')).append($('<td>'));
    } else if (entry.type == bbs_type.entry.board) {
        entryNode.addClass('board-entry').attr('board-name', entry.binfo.name)
                 .append($('<td>').append(entry.binfo.total))
                 .append($('<td>').addClass('board-table-center')
                         .append(((typeof(entry.binfo.read) == 'undefined' || entry.binfo.read) 
                                  ? '' : newPostNode)))
                 .append($('<td>').append(entry.binfo.name))
                 .append($('<td>').append(entry.binfo.desc))
                 .append($('<td>').append(entry.binfo.currentusers))
                 .append($('<td>').append(entry.binfo.BM));
    } else {
        return '';
    }
    return entryNode;
}

function UI_generate_post_entry(entry, is_sticky){
    var attachLogoNode = $('<img>').attr('src', './img/attach-small.png')
                                 .addClass('attach-logo');

    var class_name = 'post-entry';
    var mNode = $('<span>').addClass('badge badge-important post-mark post-mark-m').append('m');
    var gNode = $('<span>').addClass('badge badge-important post-mark post-mark-g').append('g');
    var newPostNode = $('<span>').addClass('badge badge-important new-post-mark').append('new');

    var markM = false;
    var markG = false;
    if ($.inArray(bbs_type.post_mark.m, entry.flags) >= 0) {
        class_name = 'post-entry marked-post-entry';
        markM = true;
    }
    if ($.inArray(bbs_type.post_mark.g, entry.flags) >= 0) {
        class_name = 'post-entry marked-post-entry';
        markG = true;
    }

    var entryNode = $('<tr>').attr('href', '').addClass(class_name)
                             .attr('post-id', entry.id)
                             .attr('type', 
                                   (is_sticky ? bbs_type.post_list_mode.sticky 
                                              : bbs_type.post_list_mode.normal))
                             .append($('<td>').append((is_sticky ? bbs_string.entry_sticky : entry.id)))
                             .append($('<td>').addClass('board-table-center').append(
                                     (typeof(entry.read) == 'undefined' || entry.read) ? '' : newPostNode))
                             .append($('<td>').append(entry.owner))
                             .append($('<td>').append(entry.posttime))
                             .append($('<td>').append(entry.title)
                                              .append(entry.attachment > 0 ? attachLogoNode : '')
                                              .append(markM ? mNode : '')
                                              .append(markG ? gNode : ''));
    if (is_sticky) {
        entryNode.addClass('sticky');
    }
    return entryNode;
}

function UI_generate_pic_attach_code(data) {
    if (data.picattach.length <= 0) {
        return '';
    }
    var attachDiv = $('<div>').addClass('pic-attach-area').append(bbs_string.attach_pic_text);
    var attachList = $('<ul>').addClass('thumbnails');
    
    var attach_link = data.attachlink + '&a=';
    
    for (var id in data.picattach) {
        var attach = data.picattach[id];
        var attachLi = $('<li>').addClass('span2');
        var attachA = $('<a>').attr('href', attach_link + attach.offset)
                                    .attr('title', attach.name + '\n' + bbs_string.attach_pic_tooltip)
                                    .attr('target', '_blank')
                                    .addClass('thumbnail');
        var attachImg = $('<img>').attr('src', attach_link + attach.offset + '&thumbnail=160x1000')
                                  .attr('alt', attach.name);
        attachList.append(attachLi.append(attachA.append(attachImg)));
    }
    attachDiv.append(attachList);

    return attachDiv;
}

function UI_generate_other_attach_code(data) {
    if (data.otherattach.length <= 0) {
        return '';
    }
    var attachDiv = $('<div>').addClass('other-attach-area')
                              .append(bbs_string.attach_other_text);
    var attach_link = data.attachlink + '&a=';
    
    for (var id in data.otherattach) {
        var attach = data.otherattach[id];
        var attachSubDiv = $('<div>').addClass('well')
                           .append($('<i>').addClass('icon-file'))
                           .append(attach.name)
                           .append($('<br>'))
                           .append($('<a>').attr('href', attach_link + attach.offset)
                                           .attr('target', '_blank')
                                           .append(bbs_string.attach_other_tooltip));
        attachDiv.append(attachSubDiv);
    }
    return attachDiv;
}

function UI_generate_uploading_file_entry(file) {
    var filename = file.name;
    if (filename.length > 15) {
        filename = filename.substr(0, 15) + '...';
    }
    var entryNode = $('<div>').addClass('file-wrapper')
                              .append($('<i>').addClass('icon-file'))
                              .append($('<span>').addClass('filename-area')
                                                 .append(filename))
                              .append($('<div>').addClass('progress progress-striped active file-upload-progress')
                                                .append($('<div>').addClass('bar').css('width', '0')))
                              .append($('<span>').addClass('file-upload-text'))
                              .append($('<button>').attr('type', 'button').addClass('close')
                                                   .append('×'));
    return $('<li>').addClass('file-li').append(entryNode);
}

function UI_register_hotkeys(){
    register_default_hotkeys();
}

function UI_onresize(){
    xmpp_onresize();
}
