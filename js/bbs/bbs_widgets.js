/*
 * Widgets provides a factory for various UI components, creating its 
 * HTML node and binding actions.
 * Author: Wenqi Zhang
 * Date: 10/31/2013
 */
var Widgets = {};

// Creates a table row for a mail in the inbox panel.
Widgets.mailEntry = function(entry, type) {
    var newPostNode = Widgets.newMark();
    if (type != bbs_type.path.mailbox) {
        return '';
    }
    var entryNode = $('<tr>').attr('href', '').addClass('mail-entry')
                    .append($('<td>').append(entry.id))
                    .append($('<td>').addClass('board-table-center')
                            .append((typeof(entry.read) == 'undefined' || entry.read) ? '' : newPostNode))
                    .append($('<td>').append(entry.owner))
                    .append($('<td>').append(entry.posttime))
                    .append($('<td>').append(entry.title));

    entryNode.click(function() {
        UI_set_loading();
        view_mail(entry.id, UI_update, 'click');
    });
    return entryNode;
};

// Creates a table row for a board entry in the board lists.
Widgets.boardEntry = function(entry, type) {
    var newPostNode = Widgets.newMark();
    var entryNode = $('<tr>').attr('href', '');
    var entryName = '';
    if (type == bbs_type.path.allboard) {
        entryNode.addClass('board-entry')
                 .append($('<td>').append(entry.total))
                 .append($('<td>').addClass('board-table-center')
                         .append(((entry.isdir || entry.read) ? '' : newPostNode)))
                 .append($('<td>').append(entry.name))
                 .append($('<td>').append(entry.desc))
                 .append($('<td>').append(entry.currentusers))
                 .append($('<td>').append(entry.BM));

        entryNode.click(function() {
            UI_set_loading();
            view_board(entry.name, -1, -1, UI_update, 'click');
        });
    } else if (entry.type == bbs_type.entry.folder) {
        entryNode.addClass('folder-entry')
                 .append($('<td>'))
                 .append($('<td>').addClass('board-table-center'))
                 .append($('<td>').append(bbs_string.entry_folder))
                 .append($('<td>').append(entry.name))
                 .append($('<td>')).append($('<td>'));

        entryNode.click(function() {
            UI_set_loading();
            view_boardlist(bbs_type.entry.folder, entry.index, 
                           entry.name, UI_update);
        });
    } else if (entry.type == bbs_type.entry.board) {
        entryName = entry.binfo.name;
        entryNode.addClass('board-entry')
                 .append($('<td>').append(entry.binfo.total))
                 .append($('<td>').addClass('board-table-center')
                         .append(((typeof(entry.binfo.read) == 'undefined' || entry.binfo.read) 
                                  ? '' : newPostNode)))
                 .append($('<td>').append(entry.binfo.name))
                 .append($('<td>').append(entry.binfo.desc))
                 .append($('<td>').append(entry.binfo.currentusers))
                 .append($('<td>').append(entry.binfo.BM));

        entryNode.click(function() {
            UI_set_loading();
            view_board(entry.binfo.name, -1, -1, UI_update, 'click');
        });
    } else {
        return '';
    }

    return entryNode;
};

// Creates a table row for a post entry in post lists.
Widgets.postEntry = function (entry, is_sticky) {
    var attachLogoNode = $('<img>').attr('src', './img/attach-small.png')
                                 .addClass('attach-logo');

    var class_name = 'post-entry';
    var mNode = $('<span>').addClass('badge badge-important post-mark post-mark-m').append('m');
    var gNode = $('<span>').addClass('badge badge-important post-mark post-mark-g').append('g');
    var newPostNode = Widgets.newMark();

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
                             .append($('<td>').append((is_sticky ? bbs_string.entry_sticky : entry.id)))
                             .append($('<td>').addClass('board-table-center').append(
                                     (typeof(entry.read) == 'undefined' || entry.read) ? '' : newPostNode))
                             .append($('<td>').append(entry.owner))
                             .append($('<td>').append(entry.posttime))
                             .append($('<td>').addClass('post-title-td')
                                              .append(entry.title)
                                              .append(entry.attachment > 0 ? attachLogoNode : '')
                                              .append(markM ? mNode : '')
                                              .append(markG ? gNode : '')
                                              .append(Widgets.postMiniBar(entry)));
    if (is_sticky) {
        entryNode.addClass('sticky');
    }
    var postType = is_sticky ? bbs_type.post_list_mode.sticky 
                             : bbs_type.post_list_mode.normal;
    entryNode.click(function() {
        UI_set_loading();
        view_post(entry.id, postType, UI_update, 'click');
    });
    return entryNode;
};

// Creates a red badge with text "new" for all unread posts, mails and boards.
Widgets.newMark = function() {
    return $('<span>').addClass('badge badge-important new-post-mark')
                      .append('new');
};

// Creates a thumbnail with link to a picture attachment, displayed at the 
// bottom of a page.
Widgets.picAttach = function(data) {
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
};

// Creates a file logo with file name for miscellaneous file attachments.
Widgets.miscAttach = function(data) {
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
};

// Creates a widget with filename, progress bar, bytes uploaded and close button
// for every file being uploaded. The progress bar collapses once the upload
// finishes.
Widgets.uploadFile = function (file) {
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

    entryNode = $('<li>').addClass('file-li').append(entryNode);
    entryNode.find('.close').click(function() {
        $(this).closest('.file-li').hide(500, function() {
            $(this).remove();
        });
    });
    return entryNode; 
};

// Creates a mini-bar for every post entry in post listing panel, providing quick
// access to manipulating the post.
Widgets.postMiniBar = function(entry) {
    var miniBar = $('<div>').addClass('mini-bar');
    var dot = $('<span>').addClass('mini-bar-dot');
    var btnList = $('<ul>').addClass('mini-bar-ul');
    
    var delBtn = $('<button>').addClass('btn btn-small btn-danger')
                              .append('删除');
    btnList.append($('<li>').addClass('mini-bar-li')
                            .append(delBtn));
    var repBtn = $('<button>').addClass('btn btn-small btn-warning unimplemented')
                              .append('转载');
    btnList.append($('<li>').addClass('mini-bar-li')
                            .append(repBtn));
    var edtBtn = $('<button>').addClass('btn btn-small btn-primary unimplemented')
                              .append('编辑');
    btnList.append($('<li>').addClass('mini-bar-li')
                            .append(edtBtn));

    miniBar.append(dot).append(btnList);
    btnList.hide();
    dot.css('opacity', 0.1);

    // These unimplemented popover are just temporary code, will be removed.
    $('.unimplemented').popover({
        trigger: 'hover',
        placement: 'bottom',
        title: bbs_string.unimpltd_title,
        content: bbs_string.unimpltd_text,
        container: 'body'
    });

    miniBar.click(function() {
        return false;
    })

    delBtn.click(function() {
        var boardPathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
        if (boardPathTerm == null) {
            return;
        }
        UI_set_loading();
        delPost(boardPathTerm.name, entry.id, entry.xid, UI_update, -1);
    });

    dot.mouseenter(function() {
        btnList.show();
        dot.css('opacity', 0.7);
    });
    miniBar.mouseleave(function() {
        btnList.hide();
        dot.css('opacity', 0.1);
    });
    return miniBar;
};