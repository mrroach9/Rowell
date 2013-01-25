function UI_register_func(){
	$('#login-button').click(function(){
		var auth_code = $('input#auth-code-textbox').val();
		UI_show_backdrop();
		getSession(auth_code, UI_session_retrieved);
	});

	$('#logout-button').click(UI_logout);

	$(document).on('click', '#favboard-nav-label', function(){
		UI_set_loading();
		view_boardlist(bbs_type.entry.favboard, -1, '', UI_update, 0);
	});

	$(document).on('click', '#allboard-nav-label', function(){
		UI_set_loading();
		view_boardlist(bbs_type.entry.allboard, -1, '', UI_update, 0);
	});

	$(document).on('click', '.board-entry', function(){
		UI_set_loading();
		view_board($(this).attr('board-name'), -1, -1, UI_update, 'click');
	});

	$(document).on('click', '.folder-entry', function(){
		UI_set_loading();
		view_boardlist(bbs_type.entry.folder, $(this).attr('index'), $(this).attr('folder-name'), UI_update);
	});

	$(document).on('click', '.post-entry', function() {
		UI_set_loading();
		view_post($(this).attr('post-id'), $(this).attr('type'), UI_update, 'click');
	});

	$(document).on('click', '#path-term', UI_path_click);

	$('.last-page-button').click(function(){
		UI_set_loading();
		var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
		view_board(pathTerm.name, -1, -1, UI_update, 'click', -1);
	});

	$('.first-page-button').click(function(){
		UI_set_loading();
		var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
		view_board(pathTerm.name, 1, -1, UI_update, 'click', -1);
	});

	$('.next-page-button').click(function(){
		UI_set_loading();
		view_board_next_page(UI_update);
	});

	$('.prev-page-button').click(function(){
		UI_set_loading();
		view_board_prev_page(UI_update);
	});

	$('.jump-to-post-button').click(function(){
		UI_set_loading();
		var post_id = $('.jump-to-post-input').val();
		view_board_jumpto(post_id);
	});

	$('.jump-to-post-input').keypress(function(event) {
		if ( event.which == 13 ) {
			UI_set_loading();
			var post_id = $(this).val();
			view_board_jumpto(post_id);
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

	$(document).on('click', '.reply-post-button', function(){
		var type = $(this).attr('type');
		postPrepare(bbs_type.write_post.reply, function(){
			getQuote(type, UI_prepare_post_modal);
		});
	});

	$(document).on('click', '.new-post-normal', function(){
		postPrepare(bbs_type.write_post.new, UI_prepare_post_modal);
	});

	$(document).on('click', '.clear-board-unread', function(){
		UI_set_loading();
		var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
		clear_unread(pathTerm.name, UI_update);
	});

	$(document).on('click', '.clear-all-unread', function(){
		UI_set_loading();
		clear_unread('', UI_update);
	});

	// $(document).on('click', '#add-attachment-link', function(){
	// 	$('div.attach-area').show();
	// });

	$('#publish-post-button').click(UI_write_post);

	$(document).on('click', '#write-post-panel .cancel-button', function(){
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

}

// Temporarily commented, will not release in v0.2.5
// function UI_set_fileupload() {
// 	$('#fileupload').fileupload({
// 		dropZone : $('#fileupload'),
// 		type : 'POST',
// 		url : bbs_query.server + bbs_query.write_post.attach,
// 		dataType : 'json',
// 		paramName : 'content',
// 		formData : {
// 			session : bbs_session,
// 			item : 'attachment'
// 		},
// 		add : function(e, data) {
// 			alert('here');
// 			data.submit();
// 		}
// 	});
// }

function UI_hide_write_post(){
	$('#write-post-panel').modal('hide');
	$('.attach-area').hide();
	bbs_topmost_stack.pop();
}

function UI_set_loading(){
	bbs_loading_show = true;
	setTimeout(function(){
		if (bbs_loading_show) {
			$('#loading-area').show();
		}
	}, 500);
	setTimeout(UI_hide_loading, 5000);
}

function UI_hide_loading(){
	bbs_loading_show = false;
	$('#loading-area').hide();
}

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

	UI_hide_write_post();
	UI_show_backdrop();

	writePost(type, title, content, qmd_num, anony, UI_update);
}

function UI_hide_backdrop(){
	$('#global-backdrop').hide();
}

function UI_show_backdrop(){
	$('#global-backdrop').show();
}

function UI_session_retrieved(session){
	bbs_session = session;
	verifySession(session, true, UI_login_finished);
}

function UI_init() {
	UI_show_backdrop();

	$('a#login-path').attr('href',bbs_query.server + bbs_query.auth.auth);
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
		$('#unlogged-navbar').hide();
		$('#unlogged-panel').hide();
		$('#logged-navbar').show();
		view_boardlist(bbs_type.entry.favboard, -1, '', UI_update, 0);
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
	$('#loading-area').hide();
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
			if (currentId + 1 < bbs_post_count) {
				view_board(pathTerm.name, 1, -1, UI_update, 'click', id);
			} else {
				view_board(pathTerm.name, -1, currentId + 1, UI_update, 'click', id);
			}
		} else {
			view_board(pathTerm.name, -1, -1, UI_update, 'click', id);
		}
	} else if (pathTerm.type == bbs_type.path.folder) {
		view_boardlist(bbs_type.entry.folder, pathTerm.index, pathTerm.name, UI_update, id);
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

	var arrow = '<li><i class="icon-chevron-right right-arrow" id="boardlist-board-nav-arrow"></i></li>';
	var d = path.depth();
	for (var i = 0; i < d; ++i) {
		var term = '<li><a href="#" id="path-term" path-id=' + i + '>'
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
	}
}

function UI_maindiv_update(pathTerm) {
	$('#boardlist-table').hide();
	$('#board-table').hide();
	$('#post-view').hide();
	bbs_topmost_stack.splice(0);
	if (pathTerm.type == bbs_type.path.allboard ||
	    pathTerm.type == bbs_type.path.favboard ||
	    pathTerm.type == bbs_type.path.folder) {
		$('#boardlist-table-body').empty();
		for (var i = 0; i < pathTerm.data.length; ++i) {
			var entryStr = UI_generate_board_entry(pathTerm.data[i], pathTerm.type);
			$('#boardlist-table-body').append(entryStr);
		}
		$('#boardlist-table').show();
		bbs_topmost_stack.push('#boardlist-table');
	} else if (pathTerm.type == bbs_type.path.board) {
		$('#board-table-body').empty();

		for (var i = 0; i < pathTerm.data.length; ++i) {
			var entryStr = UI_generate_post_entry(pathTerm.data[i], false);
			$('#board-table-body').append(entryStr);
		}
		for (var i = 0; i < bbs_sticky.posts.length; ++i) {
			var entryStr = UI_generate_post_entry(bbs_sticky.posts[i], true);
			$('#board-table-body').append(entryStr);
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
		var content = linkify(pathTerm.data.content)
								+ UI_generate_pic_attach_code(pathTerm.data)
								+ UI_generate_other_attach_code(pathTerm.data);
		$('#post-view-area').html(content);
		$('#post-view').show();
		bbs_topmost_stack.push('#post-view');
	}
}

function UI_generate_board_entry(entry, type){
	var entryStr = '';
	var new_post_code = '<span class="badge badge-important new-post-mark">new</span>';

	if (type == bbs_type.path.allboard) {
		entryStr = '<tr href=\'\' class=\'board-entry\' board-name=\'' + entry.name + '\'>'
						 + 		'<td>' + entry.total + '</td>'
						 +		'<td class=\'board-table-center\'>'
						 + 			((entry.isdir || entry.read) ? '' : new_post_code)
						 + 		'</td>'
						 +		'<td>' + entry.name + '</td>'
						 +		'<td>' + entry.desc + '</td>'
						 +		'<td>' + entry.currentusers + '</td>'
						 +		'<td>' + entry.BM + '</td>'
						 + '</tr>';
	} else if (entry.type == bbs_type.entry.folder) {
		entryStr = '<tr href=\'\' class=\'folder-entry\' folder-name=\''
						 + entry.name + '\' index=\'' + entry.index + '\'>'
						 + 		'<td></td>'
						 +		'<td class=\'board-table-center\'></td>'
						 +		'<td>' + bbs_string.entry_folder + '</td>'
						 +		'<td>' + entry.name + '</td>'
						 +		'<td></td>'
						 +		'<td></td>'
						 + '</tr>';
	} else if (entry.type == bbs_type.entry.board) {
		entryStr = '<tr href=\'\' class=\'board-entry\' board-name=\'' + entry.binfo.name + '\'>'
						 + 		'<td>' + entry.binfo.total + '</td>'
						 +		'<td class=\'board-table-center\'>'
						 + 			((typeof(entry.binfo.read) == 'undefined' || entry.binfo.read) 
						 		  ? '' : new_post_code)
						 + 		'</td>'
						 +		'<td>' + entry.binfo.name + '</td>'
						 +		'<td>' + entry.binfo.desc + '</td>'
						 +		'<td>' + entry.binfo.currentusers + '</td>'
						 +		'<td>' + entry.binfo.BM + '</td>'
						 + '</tr>';
	} else {
		return '';
	}
	return entryStr;
}

function UI_generate_post_entry(entry, is_sticky){
	var attach_logo_str = '<img src="./img/attach-small.png" class="attach-logo"/>';
	var class_name = 'post-entry';
	var badge_code = '';
	var new_post_code = '<span class="badge badge-important new-post-mark">new</span>';

	if ($.inArray(bbs_type.post_mark.m, entry.flags) >= 0) {
		badge_code += '<span class="badge badge-important post-mark post-mark-m">m</span>';
		class_name = 'post-entry marked-post-entry';
	}
	if ($.inArray(bbs_type.post_mark.g, entry.flags) >= 0) {
		badge_code += '<span class="badge badge-important post-mark post-mark-g">g</span>';	
		class_name = 'post-entry marked-post-entry';
	}

	var entryStr = '';
	if (is_sticky) {
		entryStr = 	'<tr href="#" class="' + class_name + ' sticky'+ '" post-id="' + entry.id + '" type="' 
				 +  bbs_type.post_list_mode.sticky + '" >'
				 + 		'<td>' 
				 + 			bbs_string.entry_sticky
				 + 		'</td>'
				 +		'<td class="board-table-center">'
				 + 				((typeof(entry.read) == 'undefined' || entry.read) ? '' : new_post_code)
				 +		'</td>'
				 +		'<td>' + entry.owner + '</td>'
				 +		'<td>' + entry.posttime + '</td>'
				 +		'<td>'
				 +			entry.title
				 +			((entry.attachment > 0) ? attach_logo_str : '')
				 +			badge_code
				 + 		'</td>'
				 + '</tr>';
	} else {
		entryStr = '<tr href="#" class="' + class_name + '" post-id="' + entry.id + '" type="' 
				 +  bbs_type.post_list_mode.normal + '" >'
				 + 		'<td>' + entry.id + '</td>'
				 +		'<td class="board-table-center">'
				 + 				((typeof(entry.read) == 'undefined' || entry.read) ? '' : new_post_code)
				 +		'</td>'
				 +		'<td>' + entry.owner + '</td>'
				 +		'<td>' + entry.posttime + '</td>'
				 +		'<td>'
				 +			entry.title
				 +			((entry.attachment > 0) ? attach_logo_str : '')
				 +			badge_code
				 + 		'</td>'
				 + '</tr>';
	}

	return entryStr;
}

function UI_generate_pic_attach_code(data) {
	if (data.picattach.length <= 0) return '';
	var attach_code = '<div class="pic-attach-area">'
									+		bbs_string.attach_pic_text
									+		'<ul class="thumbnails">';
	var attach_link = data.attachlink + '&a=';
	for (var id in data.picattach) {
		var attach = data.picattach[id];
		attach_code += '<li class="span2">'
								+	 	'<a href="' + attach_link + attach.offset + '"'
								+		' title="' + attach.name + '\n' + bbs_string.attach_pic_tooltip + '"'
								+		' target="_blank" class="thumbnail">'
								+			'<img src="' + attach_link + attach.offset + '&thumbnail=160x1000"'
								+			'alt="' + attach.name + '" />'
								+		'</a>'
								+	 '</li>';
	}
	attach_code += '</ul></div>';
	return attach_code;
}

function UI_generate_other_attach_code(data) {
	if (data.otherattach.length <= 0) return '';
	var attach_code = '<div class="other-attach-area">'
									+		bbs_string.attach_other_text
	var attach_link = data.attachlink + '&a=';
	for (var id in data.otherattach) {
		var attach = data.otherattach[id];
		attach_code += '<div class="well">'
								+		'<i class="icon-file" />'
								+		attach.name
								+		'<br>'
								+	 	'<a href="' + attach_link + attach.offset + '"'
								+		' target="_blank">' + bbs_string.attach_other_tooltip + '</a>'
								+	'</div>';
	}
	attach_code += '</ul></div>';
	return attach_code;
}

function UI_register_hotkeys(){
	register_default_hotkeys();
}