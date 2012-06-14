function UI_register_func(){
	$('#login-button').live('click',function(){
		var auth_code = $('input#auth-code-textbox').attr('value');
		$('#global-backdrop').show();
		getSession(auth_code, UI_session_retrieved);
	});
	    	
	$('#logout-button').live('click', UI_logout);
	    	
	$('#boardlist-nav-label').live('click', function(){
		if (bbs_current_path.path_level > 1) {
			view_boardlist(bbs_current_path.boardlist.type, UI_update);
		}
	});
	    	
	$('#board-nav-label').live('click', function(){
		if (bbs_current_path.path_level > 2) {
			view_board(bbs_current_path.board.name, -1, -1, UI_update, true);
		}
	});
	    	
	$('#favboard-nav-label').live('click', function(){
		view_boardlist(bbs_favboard_type, UI_update);
	});
	    	
	$('#allboard-nav-label').live('click', function(){
		view_boardlist(bbs_allboard_type, UI_update);
	});
	    				
	$('.board-entry').live('click', function(){
		view_board($(this).attr('board-name'), -1, -1, UI_update, 'click');
	});
	   
	$('.post-entry').live('click',function() {
		view_post($(this).attr('post-id'), UI_update, 'click');
	});
		    
	$('#next-page-button').live('click', function(){
		view_board_next_page(UI_update);
	});
		    
	$('#prev-page-button').live('click', function(){
		view_board_prev_page(UI_update);
	});
		    
	$('#next-post-button').live('click', function(){
		view_next_post(UI_update);
	});
		    
	$('#prev-post-button').live('click', function(){
		view_prev_post(UI_update);
	});
	
	$('#notification-close-button').live('click', function(){
		$('#notification').fadeOut();
	});
}

function UI_session_retrieved(session){
	bbs_session = session;
	verifySession(session, true, UI_login_finished);
}
    	
function UI_init() {
	$('#global-backdrop').show();
    		
	$('a#login-path').attr('href',bbs_server_addr + bbs_auth_path);
	$(document).attr("title", bbs_title + 'v' + bbs_version);
    		
	$('.unimplemented').popover({
		trigger: 'hover',
		placement: 'bottom',
		title: '矮油',
		content: '此功能尚未实现，我们将在后续版本中添加，敬请谅解。'
	});
}
    	
function UI_login_finished(result){
	if (result) {
		$('#unlogged-navbar').hide();
		$('#unlogged-panel').hide();
		$('#logged-navbar').show();
		view_boardlist(bbs_favboard_type, UI_update);
	} else {
		$('#unlogged-navbar').show();
		$('#unlogged-panel').show();
		$('#logged-navbar').hide();
		$('#logged-panel').hide();
	}
	$('#global-backdrop').hide();
}
	    
function UI_logout(){
	removeSessionCookie();
	$('#unlogged-navbar').show();
	$('#unlogged-panel').show();
	$('#logged-navbar').hide();
	$('#logged-panel').hide();
}

function UI_update(path, content){
	UI_subnavbar_update(path);
	UI_maindiv_update(path, content);
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
	}, 3000);
}
	    
function UI_subnavbar_update(path) {
	$('#boardlist-nav-label').hide();
	$('#boardlist-board-nav-arrow').hide();
	$('#board-nav-label').hide();
	$('#board-post-nav-arrow').hide();
	$('#post-nav-label').hide();
	$('#reply-button').hide();
	$('#post-button').hide();
	if (path.path_level >= 1) {
		$('#boardlist-nav-label').html(path.boardlist.zhname);
		$('#boardlist-nav-label').show();
	}
	if (path.path_level >= 2) {
		$('#board-nav-label').html(path.board.name);
		$('#boardlist-board-nav-arrow').show();
		$('#board-nav-label').show();
		$('#post-button').show();
	}
	if (path.path_level >= 3) {
		$('#post-nav-label').html(path.post.title);
		$('#board-post-nav-arrow').show();
		$('#post-nav-label').show();
		$('#post-button').hide();
		$('#reply-button').show();
	}
}
	    
function UI_maindiv_update(path, content) {
	$('#boardlist-table').hide();
	$('#board-table').hide();
	$('#post-view').hide();
	if (path.path_level == 1) {
		$('#boardlist-table-body').empty();
		for (var i = 0; i < content.length; ++i) {
			var entryStr = UI_generate_board_entry(content[i]);
			$('#boardlist-table-body').append(entryStr);
		}
		$('#boardlist-table').show();
	} else if (path.path_level == 2) {			
		$('#board-table-body').empty();
		for (var i = 0; i < content.length; ++i) {
			var entryStr = UI_generate_post_entry(content[i]);
			$('#board-table-body').append(entryStr);
		}
		$('#board-table').show();
	} else if (path.path_level == 3) {
		$('#post-view-area').empty();
		$('#post-view-area').html(content.content);
		$('#post-view').show();
	}
}
	    
function UI_generate_board_entry(entry){
	var entryStr =  	  '<tr href=\'\' class=\'board-entry\' board-name=\'' + entry.name + '\'>'
								 + 		'<td>' + entry.total + '</td>'
								 +		'<td class=\'board-table-center\'>' 
								 + 				(entry.read ? '' : '<span class="badge badge-important">new</span>') 
								 + 		'</td>'
								 +		'<td>' + entry.name + '</td>'
								 +		'<td>' + entry.zhname + '</td>'
								 +		'<td>' + entry.currentusers + '</td>'
								 +		'<td>' + entry.BM + '</td>'
								 + '</tr>';
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