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
                    .append($('<td>').append(Widgets.userAnchor(entry.owner)))
                    .append($('<td>').append(entry.posttime))
                    .append($('<td>').append(entry.title));

    entryNode.click(function() {
        UI_set_loading();
        view_mail(entry.id, UI_update, 'click');
    });
    return entryNode;
};

// Creates a table row for a board entry in the board lists.
// TODO: merge allboard entry and favboard entry (why were they separated!)
Widgets.boardEntry = function(entry, type, index) {
    var newPostNode = Widgets.newMark();
    var entryNode = $('<tr>').attr('href', '');
    if (type == bbs_type.path.allboard) {
        var isRead = (entry.isdir || entry.read);
        var sortValue = (isRead ? 1 : 0) + ',' + ('000' + index).slice(-3);

        var bmCell = $('<td>');
        var bmAnchors = Widgets.__BMList(entry.BM);
        for (var index in bmAnchors) {
          bmCell.append(bmAnchors[index]);
        }

        entryNode.addClass('board-entry')
                 .append($('<td>').append(entry.total))
                 .append($('<td>').addClass('board-table-center')
                         .append(isRead ? '' : newPostNode)
                         .attr('data-sort-value', sortValue))
                 .append($('<td>').append(entry.name))
                 .append($('<td>').append(entry.desc))
                 .append($('<td>').append(entry.currentusers))
                 .append(bmCell);

        entryNode.click(function() {
            UI_set_loading();
            view_board(entry.name, -1, -1, UI_update, 'click');
        });
    } else if (entry.type == bbs_type.entry.folder) {      
        var sortValue = 1 + ',' + ('000' + index).slice(-3);
        entryNode.addClass('folder-entry')
                 .append($('<td>'))
                 .append($('<td>').addClass('board-table-center')
                                  .attr('data-sort-value', sortValue))
                 .append($('<td>').append(bbs_string.entry_folder))
                 .append($('<td>').append(entry.name))
                 .append($('<td>')).append($('<td>'));

        entryNode.click(function() {
            UI_set_loading();
            view_boardlist(bbs_type.entry.folder, entry.index, 
                           entry.name, UI_update);
        });
    } else if (entry.type == bbs_type.entry.board) {
        var entryName = entry.binfo.name;
        var isRead = (typeof(entry.binfo.read) == 'undefined' || entry.binfo.read);
        var sortValue = (isRead ? 1 : 0) + ',' + ('000' + index).slice(-3);

        var bmCell = $('<td>');
        var bmAnchors = Widgets.__BMList(entry.binfo.BM);
        for (var index in bmAnchors) {
          bmCell.append(bmAnchors[index]);
        }

        entryNode.addClass('board-entry')
                 .append($('<td>').append(entry.binfo.total))
                 .append($('<td>').addClass('board-table-center')
                         .append(isRead ? '' : newPostNode)
                         .attr('data-sort-value', sortValue))
                 .append($('<td>').append(entry.binfo.name))
                 .append($('<td>').append(entry.binfo.desc))
                 .append($('<td>').append(entry.binfo.currentusers))
                 .append(bmCell);

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

    var miniBar = Widgets.postMiniBar(entry);
    miniBar.hide();
    var entryNode = $('<tr>').attr('href', '').addClass(class_name)
                             .append($('<td>').append((is_sticky ? bbs_string.entry_sticky : entry.id)))
                             .append($('<td>').addClass('board-table-center').append(
                                     (typeof(entry.read) == 'undefined' || entry.read) ? '' : newPostNode))
                             .append($('<td>').append(Widgets.userAnchor(entry.owner)))
                             .append($('<td>').append(entry.posttime))
                             .append($('<td>').addClass('post-title-td')
                                              .append(entry.title)
                                              .append(entry.attachment > 0 ? attachLogoNode : '')
                                              .append(markM ? mNode : '')
                                              .append(markG ? gNode : '')
                                              .append(miniBar));
    if (is_sticky) {
        entryNode.addClass('sticky');
    }
    var postType = is_sticky ? bbs_type.post_list_mode.sticky 
                             : bbs_type.post_list_mode.normal;
    entryNode.mouseenter(function(event) {
      miniBar.show();
    });
    entryNode.mouseleave(function(event) {
      miniBar.hide();
    });
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

    miniBar.append(btnList);

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
    return miniBar;
};

// Creates an author icon with avatar, name and link fetched from Github repo.
Widgets.githubAuthorWidget = function(profile) {
  if (profile == null) {
    return null;
  }

  var avatarIcon = $('<img>').addClass('github-avatar')
      .attr('src', profile.avatar_url);
  var avatar = $('<span>').addClass('github-avatar-container').append(avatarIcon);
  var authorNameAnchor = $('<a>').addClass('github-name-anchor')
      .attr('href', profile.html_url)
      .attr('target', '_blank')
      .append(profile.login);
  var authorName = $('<a>').addClass('github-name-container').append(authorNameAnchor);
  return $('<div>').addClass('github-author-container').append(avatar).append(authorName);
};

// Create a widget displaying the basic profile of a user. This only renders the
// inside content of the popover, not including the popover itself.
Widgets.userProfile = function(profile) {
  var topPanel = $('<div>').addClass('user-profile-topPanel');
  var bottomPanel = $('<div>').addClass('user-profile-bottomPanel');

  var userId = profile.userid;
  var initial = userId[0].toUpperCase();
  var avatar = $('<div>').addClass('user-profile-avatar-container')
                .append($('<span>').addClass('user-profile-avatar')
                          .addClass('initial-' + initial)
                          .append(initial)
                );

  var idPanel = $('<div>').addClass('user-profile-id-panel')
                .append($('<span>').addClass('user-profile-id').append(userId));
  var nickPanel = $('<div>').addClass('user-profile-nickPanel')
      .append($('<span>').addClass('user-profile-nick').append(profile.nick));
  var idAndNickPanel = $('<div>').addClass('user-profile-idAndNick')
      .append(idPanel).append(nickPanel);

  var loginPanel = $('<div>').addClass('user-profile-statPanel')
      .append($('<span>').addClass('user-profile-stat')
              .append('登录数：' + profile.numlogins));
  var postPanel = $('<div>').addClass('user-profile-statPanel')
      .append($('<span>').addClass('user-profile-stat')
              .append('发帖数：' + profile.numposts));
  var lifePanel = $('<div>').addClass('user-profile-statPanel')
      .append($('<span>').addClass('user-profile-stat')
              .append('生命值：' + profile.life));
  var expPanel = $('<div>').addClass('user-profile-statPanel')
      .append($('<span>').addClass('user-profile-stat')
              .append('经验值：' + profile.exp));
  var statPanel = $('<div>').addClass('user-profile-allstats')
      .append(loginPanel).append(postPanel).append(lifePanel).append(expPanel);
  var lastLoginPanel = $('<div>').addClass('user-profile-lastLoginPanel')
      .append($('<span>').addClass('user-profile-lastLogin')
              .append('上次登录：' + profile.lastlogintime));

  topPanel.append(avatar).append(idAndNickPanel);
  bottomPanel.append(statPanel).append(lastLoginPanel);

  return $('<div>').append(topPanel).append(bottomPanel);
}

// Return a user anchor, which triggers a popover when clicked,
// loading the user's profile and render as a userProfile widget.
Widgets.userAnchor = function(userId) {
  var anchor = $('<a>').addClass('user-profile-anchor')
                       .attr('user-id', userId)
                       .append(userId);
  anchor.click(function(e) {
      var userId = $(this).attr('user-id');
      var container = $('<div>').addClass('user-profile-container')
          .attr('user-id', userId);
      $(this).popover({
          trigger: 'manual',
          html: true,
          placement: 'bottom',
          content: container,
          container: 'body',
          animation: false
      });
      $(this).popover('toggle');
      load_user_profile(userId, function(response) {
          container.empty();
          container.append(Widgets.userProfile(response));
      });
      UI_closeUnfocusedPopover(e);
      // Stop propogation, otherwise it will trigger post/mail/board loading.
      return false;
  });
  return anchor;
}

// Accepts a space-separated sequence of users (usually boardmasters),
// For each of them, render a user anchor and return a list of those.
Widgets.__BMList = function(bmStr) {
  var bmAnchorList = [];
  var bmList = bmStr.split(' ');
  for (var index in bmList) {
    bmAnchorList.push(Widgets.userAnchor(bmList[index]));
  }
  return bmAnchorList;
}