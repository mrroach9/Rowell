var bbs_loading_show = false;

function UI_register_func(){
	$('#login-button').click(function(){
		var auth_code = $('input#auth-code-textbox').val();
		UI_show_backdrop();
		getSession(auth_code, UI_session_retrieved);
	});
	    	
	$('#logout-button').click(UI_logout);
	    	
	$('#favboard-nav-label').live('click', function(){
		UI_set_loading();
		view_boardlist(bbs_type.entry.favboard, -1, '', UI_update, 0);
	});
	    	
	$('#allboard-nav-label').live('click', function(){
		UI_set_loading();
		view_boardlist(bbs_type.entry.allboard, -1, '', UI_update, 0);
	});
	    				
	$('.board-entry').live('click', function(){
		UI_set_loading();
		view_board($(this).attr('board-name'), -1, -1, UI_update, 'click');
	});
	
	$('.folder-entry').live('click', function(){
		UI_set_loading();
		view_boardlist(bbs_type.entry.folder, $(this).attr('index'), $(this).attr('folder-name'), UI_update);
	});
	   
	$('.post-entry').live('click',function() {
		UI_set_loading();
		view_post($(this).attr('post-id'), UI_update, 'click');
	});
	
	$('#path-term').live('click', UI_path_click);
	
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
		UI_set_loading();
		view_next_post(UI_update);
	});
		    
	$('.prev-post-button').click(function(){
		UI_set_loading();
		view_prev_post(UI_update);
	});
	
	$('.st-prev-button').click(function(){
		UI_set_loading();
		view_post_sametopic(UI_update, 'prev');
	});
	
	$('.st-next-button').click(function(){
		UI_set_loading();
		view_post_sametopic(UI_update, 'next');
	});
	
	$('.st-head-button').click(function(){
		UI_set_loading();
		view_post_sametopic(UI_update, 'head');
	});
	
	$('.st-latest-button').click(function(){
		UI_set_loading();
		view_post_sametopic(UI_update, 'latest');
	});
	
	$('#notification-close-button').click(function(){
		$('#notification').fadeOut();
	});
	
	$('#notification').click(function(){
		$(this).fadeOut();
	});
	
	$('.reply-post-button').live('click', function(){
		postPrepare(bbs_type.write_post.reply, UI_prepare_getQuote);
	});
	
	$('.new-post-normal').live('click', function(){
		postPrepare(bbs_type.write_post.new, UI_prepare_post_modal);
	});
	
	$('.clear-board-unread').live('click', function(){
		UI_set_loading();
		var pathTerm = bbs_path.getLastTermWithType(bbs_type.path.board);
		clear_unread(pathTerm.name, UI_update);
	});
	
	$('.clear-all-unread').live('click', function(){
		UI_set_loading();
		clear_unread('', UI_update);
	});
	
	$('#publish-post-button').click(UI_write_post);
	
	$('#write-post-panel .cancel-button').live('click', function(){
		if (confirm('确定舍弃当前未发布文章吗？')) {
			$('#write-post-panel').modal('hide');
			bbs_topmost_stack.pop();
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

function UI_prepare_getQuote() {
	getQuote($(this).attr('type'), UI_prepare_post_modal);
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
	
	$('#write-post-panel').modal('hide');
	bbs_topmost_stack.pop();
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
	$(document).attr("title", bbs_info.title + 'v' + bbs_info.version);
    		
	$('.unimplemented').popover({
		trigger: 'hover',
		placement: 'bottom',
		title: '矮油',
		content: '此功能尚未实现，我们将在后续版本中添加，敬请谅解。'
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
	
	var arrow = '<li><i class=\'icon-chevron-right right-arrow\' id=\'boardlist-board-nav-arrow\'></i></li>';
	var d = path.depth();
	for (var i = 0; i < d; ++i) {	
		var term = '<li><a href=\'javascript:void(0)\' id=\'path-term\' path-id=' + i + '>'
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
	} else if (type == bbs_type.path.post) {
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
			var entryStr = UI_generate_post_entry(pathTerm.data[i]);
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
	} else if (pathTerm.type == bbs_type.path.post) {
		$('#post-view-area').empty();
		$('#post-view-area').html(pathTerm.data.content);
		$('#post-view').show();
		bbs_topmost_stack.push('#post-view');
	}
}
	    
function UI_generate_board_entry(entry, type){
	var entryStr = '';
	if (type == bbs_type.path.allboard) {
		entryStr = '<tr href=\'\' class=\'board-entry\' board-name=\'' + entry.name + '\'>'
						 + 		'<td>' + entry.total + '</td>'
						 +		'<td class=\'board-table-center\'>' 
						 + 				(entry.read ? '' : '<span class="badge badge-important">new</span>') 
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
						 +		'<td>[目录]</td>'
						 +		'<td>' + entry.name + '</td>'
						 +		'<td></td>'
						 +		'<td></td>'
						 + '</tr>';
	} else if (entry.type == bbs_type.entry.board) {	
		entryStr = '<tr href=\'\' class=\'board-entry\' board-name=\'' + entry.binfo.name + '\'>'
						 + 		'<td>' + entry.binfo.total + '</td>'
						 +		'<td class=\'board-table-center\'>' 
						 + 				(entry.binfo.read ? '' : '<span class="badge badge-important">new</span>') 
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
	  	
function UI_generate_post_entry(entry){
	var entryStr =  	  '<tr href=\'\' class=\'post-entry unimplemented\' post-id=\'' + entry.id + '\'>'
								 + 		'<td>' + entry.id + '</td>'
								 +		'<td class=\'board-table-center\'>' 
								 + 				(entry.read ? '' : '<span class="badge badge-important">new</span>') 
								 +		'</td>'
								 +		'<td>' + entry.owner + '</td>'
								 +		'<td>' + entry.posttime + '</td>'
								 +		'<td>' + entry.title + '</td>'
								 + '</tr>';
	return entryStr;
}


function UI_register_hotkeys(){
	register_default_hotkeys();
}