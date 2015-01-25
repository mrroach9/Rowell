function UI_register_func() {
    // Logging in and out.
    $('#logout-button').click(UI_logout);

    // Navigation bar actions.

    $(document).on('click', '#favboard-nav-label', function() {
        UI_set_loading();
        view_boardlist(bbs_type.entry.favboard, -1, '', UI_update, 0);
    });

    $(document).on('click', '#allboard-nav-label', function() {
        UI_set_loading();
        view_boardlist(bbs_type.entry.allboard, -1, '', UI_update, 0);
    });

    $(document).on('click', '#mailbox-nav-label', function() {
        UI_set_loading();
        view_mailbox(bbs_type.entry.mailbox, -1, -1, UI_update, 'click', 0);
    });

    $(document).on('click', '.path-term', UI_path_click);

    // Notifications and contributer lists

    $('#notification-close-button').click(function() {
        $('#notification').fadeOut();
    });

    $('#notification').click(function() {
        $(this).fadeOut();
    });

    $('#ctrbtr-link').click(function() {
        $('#ctrbtr-list').modal('toggle');
    })

    $('#ctrbtr-list .cancel-button').click(function() {
        $('#ctrbtr-list').modal('hide');
    })

    // Posting, mailing and replying

    $(document).on('click', '.reply-post-button', function() {
        var type = $(this).attr('type');
        postPrepare(bbs_type.write_post.reply, function() {
            getQuote(type, UI_prepare_post_modal);
        });
    });

    $(document).on('click', '.delete-post-button', function() {
        if (confirm(bbs_string.confirm_delete_post)) {
            UI_set_loading();

            var boardPathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
            var postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.post);
            if (boardPathTerm == null) {
                return;
            }
            if (postPathTerm == null) {
                postPathTerm = bbs_path.getLastTermWithType(bbs_type.path.sticky_post);
                if (postPathTerm != null) {
                } else {
                    return;
                }
            }
            delPost(boardPathTerm.name, postPathTerm.data.id,
                    postPathTerm.data.xid, UI_update, -2);
        }
    });

    $(document).on('click', '.new-post-normal', function() {
        postPrepare(bbs_type.write_post.new, UI_prepare_post_modal);
    });

    // Clear unreads
    $(document).on('click', '.clear-board-unread', function() {
        UI_set_loading();
        var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
        clear_unread(pathTerm.name, UI_update);
    });

    $(document).on('click', '.clear-all-unread', function() {
        UI_set_loading();
        clear_unread('', UI_update);
    });

    // Hide popovers when clicking outside.
    $(document).on('click', '', function(e) {
      if (typeof $(e.target).data('original-title') == 'undefined' &&
         !$(e.target).parents().is('.popover.in')) {
        $('[data-original-title]').popover('hide');
      }
    });

    UI_register_func_navigation();
    UI_register_func_post_modal();

    window.onresize = UI_onresize;
    window.onfocus = UI_onfocus;
    xmpp_ui_init();
}

function UI_register_func_navigation() {
    // Linear navigations

    $('#board-table .last-page-button').click(function() {
        UI_set_loading();
        var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
        view_board(pathTerm.name, -1, -1, UI_update, 'click', -1);
    });

    $('#board-table .first-page-button').click(function() {
        UI_set_loading();
        var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
        view_board(pathTerm.name, 1, -1, UI_update, 'click', -1);
    });

    $('#board-table .next-page-button').click(function() {
        UI_set_loading();
        view_board_next_page(UI_update);
    });

    $('#board-table .prev-page-button').click(function() {
        UI_set_loading();
        view_board_prev_page(UI_update);
    });

    $('.jump-to-post-button').click(function() {
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

    $('#mailbox-table .last-page-button').click(function() {
        UI_set_loading();
        view_mailbox(bbs_type.entry.mailbox, -1, -1, UI_update, 'click', -1);
    });

    $('#mailbox-table .first-page-button').click(function() {
        UI_set_loading();
        view_mailbox(bbs_type.entry.mailbox, 1, -1, UI_update, 'click', -1);
    });

    $('#mailbox-table .next-page-button').click(function() {
        UI_set_loading();
        view_mailbox_next_page(UI_update);
    });

    $('#mailbox-table .prev-page-button').click(function() {
        UI_set_loading();
        view_mailbox_prev_page(UI_update);
    });

    $('.jump-to-mail-button').click(function() {
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

    $('.next-post-button').click(function() {
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

    $('.prev-post-button').click(function() {
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

    $('.next-mail-button').click(function() {
        UI_set_loading();
        view_next_mail(UI_update);
    });

    $('.prev-mail-button').click(function() {
        UI_set_loading();
        view_prev_mail(UI_update);
    });

    $('.st-prev-button').click(function() {
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

    $('.st-next-button').click(function() {
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

    $('.st-head-button').click(function() {
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

    $('.st-latest-button').click(function() {
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
}

function UI_register_func_post_modal() {
    $(document).on('click', '#add-attachment-link', function() {
        $('div.attach-area').show();
    });

    $('#publish-post-button').click(UI_write_post);

    $(document).on('click', '#write-post-panel .cancel-button', function() {
        if (confirm(bbs_string.confirm_cancel_post)) {
            UI_hide_write_post();
        }
    });

    $('input:radio[name=qmd-type]').change(function() {
        if ($('input:radio[name=qmd-type]:checked').val() == 'random') {
            $('input:text[name=qmd-number]').attr('disabled', true);
        } else {
            $('input:text[name=qmd-number]').attr('disabled', false);
        }
    });

    $('#load-sketch-link').click(function() {
        var content = localStorage[bbs_type.storage.sketch];
        var title = localStorage[bbs_type.storage.sketch_title];
        if (typeof(content) == 'undefined' || content == '') {
            return;
        }
        if (typeof(title) == 'undefined') {
            title = '';
        }
        $('#write-post-title').val(title);
        $('#write-post-content').val(content);
    });
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
        var fileNode = Widgets.uploadFile(file);

        node.children('.file-list').append(fileNode);

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

function UI_hide_write_post() {
    $('#write-post-panel').modal('hide');
    $('.attach-area').hide();
    $('.file-list').empty();
    bbs_topmost_stack.pop();
}

function UI_set_loading() {
    bbs_loading_show = true;
    setTimeout(function() {
        if (bbs_loading_show) {
            $('#loading-area').show();
        }
    }, 300);
    setTimeout(UI_hide_loading, 5000);
}

function UI_hide_loading() {
    bbs_loading_show = false;
    $('#loading-area').hide();
}

function UI_prepare_post_modal() {
    $('#write-post-panel').attr('post-type', bbs_post_info.type);
    if (bbs_post_info.type == bbs_type.write_post.new) {
        $('#write-post-title').val('');
        $('#write-post-content').val('');
    } else if (bbs_post_info.type == bbs_type.write_post.reply) {
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
    if (typeof(localStorage[bbs_type.storage.sketch]) == 'undefined') {
        $('.load-sketch-area').hide();
    } else {
        $('.load-sketch-area').show();
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

function UI_write_post() {
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
    if (qmd_num == '' || qmd_num == null) {
        qmd_num = 0;
    }
    if (qmd_type == 'random') {
        qmd_num = -1;
    }
    var content = $('#write-post-content').val();

    var anony = false;
    if (bbs_post_info.can_anony && $('.anony-checkbox').attr('checked')) {
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

function UI_hide_backdrop() {
    $('#global-backdrop').hide();
}

function UI_show_backdrop() {
    $('#global-backdrop').show();
}

function UI_set_unread() {
    var mailUnread = 
        new Unread('small', $('#mailbox-nav-label').parent(), 30000);
    mailUnread.check = function(self) {
        check_new_mail(function(has_new) {
            self.show(has_new);
        });
    };
    mailUnread.schedule();
    bbs_widget['mail-unread'] = mailUnread;
}

function UI_init() {
    UI_show_backdrop();

    UI_register_func();
    UI_register_hotkeys();
    UI_set_fileupload();

    $('a#login-bbs').attr('href', bbs_query.server + bbs_query.auth.auth);
    $('a#login-accounts9').attr('href', accounts9.server + accounts9.auth);
    $(document).attr("title", bbs_string.title);

    loadContributorStat(UI_OnLoadContributors);
    $('#boardlist-table').stupidtable();

    $('.unimplemented').popover({
        trigger: 'hover',
        placement: 'bottom',
        title: bbs_string.unimpltd_title,
        content: bbs_string.unimpltd_text,
        container: 'body'
    });

    $('.self-user-profile').popover({
        trigger: 'click',
        html: true,
        placement: 'bottom',
        title: '',
        content: function() {
            return Widgets.userProfile({
                exp: 18759,
                lasthost: "73.19.90.195",
                lastlogin: 1421723287,
                lastlogintime: "Tue Jan 20 11:08:07 2015",
                life: 999,
                nick: "分层设色地形图",
                numlogins: 5239,
                numposts: 15291,
                perf: 51,
                plan: "",
                unread_mail: false,
                userid: "Roach"
            });
        }
    });

    bbs_topmost_stack.splice(0);
}

function UI_login_finished(result) {
    if (result) {
        if (location.href.replace('#', '') != website_address) {
            location.href = website_address;
            return;
        }
        $('#unlogged-navbar').hide();
        $('#unlogged-panel').hide();
        $('#logged-navbar').show();
        $('#logged-panel').show();

        UI_set_unread();

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

function UI_logout() {
    removeSessionCookie();
    Accounts9.removeSessionCookie();
    bbs_topmost_stack.splice(0);
    $('#unlogged-navbar').show();
    $('#unlogged-panel').show();
    $('#logged-navbar').hide();
    $('#logged-panel').hide();
}

function UI_path_click() {
    UI_set_loading();
    var id = $(this).attr('path-id');
    var pathTerm = bbs_path.get(id);
    if (pathTerm.type == bbs_type.path.allboard) {
        view_boardlist(bbs_type.entry.allboard, -1, '', UI_update, id);
    } else if (pathTerm.type == bbs_type.path.favboard) {
        view_boardlist(bbs_type.entry.favboard, -1, '', UI_update, id);
    } else if (pathTerm.type == bbs_type.path.board) {
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

function UI_update() {
    UI_subnavbar_update(bbs_path);
    UI_maindiv_update(bbs_path.getLastTerm());
    UI_hide_backdrop();
    UI_hide_loading();
    $('#logged-panel').show();
    xmpp_onresize();
    location.href = '#';
}

function UI_notify_update(msg) {
    if (msg == null) return;
    var str = '<strong>'+bbs_msg[msg.type]['zhname'] + '</strong>'
            + bbs_msg[msg.type][msg.content];
    $('#notification-content').html(str);
    $('#notification').attr('class',bbs_msg[msg.type]['class_name']);
    $('#notification').fadeIn();
    setTimeout(function() {
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
        var term = '<li><a href="javascript:void(0)" class="path-term" path-id=' + i + '>'
                         + path.pathList[i].name
                         + '</a></li>';
        if (i != 0) {
            $('.path').append(arrow);
        }
        $('.path').append(term);
    }
    var type = path.getLastTerm().type;
    if (type == bbs_type.path.favboard) {
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
    $('#boardlist-table-container').hide();
    $('#board-table').hide();
    $('#post-view').hide();
    $('#mail-view').hide();
    bbs_topmost_stack.splice(0);
    if (pathTerm.type == bbs_type.path.mailbox) {

        $('#mailbox-table-body').empty();
        for (var i = 0; i < pathTerm.data.length; ++i) {
            var entryNode = Widgets.mailEntry(pathTerm.data[i], pathTerm.type);
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
            var entryNode = Widgets.boardEntry(pathTerm.data[i], pathTerm.type);
            $('#boardlist-table-body').append(entryNode);
        }
        $('#boardlist-table-container').show();
        bbs_topmost_stack.push('#boardlist-table-container');

        var tableSorter = $("#boardlist-table").stupidtable();
        tableSorter.find("thead th[col=unread]").stupidsort('asc');

    } else if (pathTerm.type == bbs_type.path.board) {
        $('#board-table-body').empty();

        for (var i = 0; i < pathTerm.data.length; ++i) {
            var entryNode = Widgets.postEntry(pathTerm.data[i], false);
            $('#board-table-body').append(entryNode);
        }
        for (var i = 0; i < bbs_sticky.posts.length; ++i) {
            var entryNode = Widgets.postEntry(bbs_sticky.posts[i], true);
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
                            .append(Widgets.picAttach(pathTerm.data))
                            .append(Widgets.miscAttach(pathTerm.data));
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

function UI_register_hotkeys() {
    register_default_hotkeys();
}

function UI_onresize() {
    xmpp_onresize();
}

function UI_onfocus() {
    xmpp_onfocus();
}

function UI_OnLoadContributors(authorList) {
    if (authorList == null) {
        $('.ctrbtr-error').show();
        $('.ctrbtr-list-panel').hide();
        return;
    }
    $('.ctrbtr-error').hide();
    $('.ctrbtr-list-panel').show();
    for (var ind in authorList) {
        $('.ctrbtr-list-panel').append(
            Widgets.githubAuthorWidget(authorList[ind]));
    }
}