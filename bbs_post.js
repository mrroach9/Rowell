function getQuote(mode, callback_func){
	if (bbs_current_path.path_level < 3) {
		return null;
	}
	var data = {
		session : bbs_session,
		board : bbs_current_path.board.name,
		id : bbs_current_path.post.id,
		xid : bbs_current_path.post.xid,
		mode : mode
	};
	var request_settings = {
		url : bbs_server_addr + bbs_getquote_path,
		type: 'GET',
		data: data,
		dataType: 'text',
		cache: false
	};
	
	var resp = $.ajax(request_settings);
	resp.success(function(response){
		callback_func(JSON.parse(response));
	});
	
	resp.fail(function(jqXHR, textStatus){
		var msg = {
				type : 'error',
				content : 'network_error'
		};
		UI_notify_update(msg);
	});
}

function writePost(type, title, content, qmd_id, anonym, callback_func){
	var data = {
		session : bbs_session,
		title : title,
		content: content + '\n\n' + bbs_send_source,
		signature_id : qmd_id,
		anonymous: (anonym ? 1 : 0)
	};
	if (type == bbs_newpost_type) {
		if (bbs_current_path.path_level != 2){
			return;
		}
		data.board = bbs_current_path.board.name;
	} else if (type == bbs_replypost_type) {
		if (bbs_current_path.path_level != 3){
			return;
		}
		data.board = bbs_current_path.board.name;
		data.re_id = bbs_current_path.post.id;
		data.re_xid = bbs_current_path.post.xid;
	}
	var request_settings = {
		url : bbs_server_addr + bbs_writepost_path,
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
		view_board(bbs_current_path.board.name, -1, -1, callback_func, 'click');
		UI_notify_update(msg);
	});
	
	resp.fail(function(jqXHR, textStatus){
		var msg = {
				type : 'error',
				content : 'network_error'
		};
		UI_hide_backdrop();
		view_board(bbs_current_path.board.name, -1, -1, callback_func, 'click');
		UI_notify_update(msg);
	});
}
		