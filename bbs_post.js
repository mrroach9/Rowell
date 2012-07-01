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
		view_board(boardPathTerm.name, -1, -1, callback_func, 'click', popNum);
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
		