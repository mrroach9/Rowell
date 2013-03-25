﻿var bbs_post_info = {
	can_anony	: false,
	sig_id		: -1,
	quote			: '',
	type			: ''
};

function mailPrepare(mode, callback_func){
	var data = {
		session	: bbs_session,
		for		: 'new'
	};
	if (mode == bbs_type.write_mail.reply) {	
		//TODO
	}
	var request_settings = {
		url		:	bbs_query.server + bbs_query.write_mail.prepare,
		type	: 'GET',
		data	:	data,
		dateType	:	'text',
		cache	: false
	};
	var resp = $.ajax(request_settings);
	resp.success(function(response){
		var res = JSON.parse(response)
		var sig_id = res.signature_id;
		bbs_post_info.sig_id = sig_id;
		bbs_post_info.can_anony = (res.error.anonymous == 1) ? false : true;
		bbs_post_info.can_attach = (res.error.attachment == 1) ? false : true;
		bbs_post_info.type = mode;
		callback_func();
	});
	resp.fail(function(jqXHR, textStatus){
		var msg = null;
		if (jqXHR.status == 416) {
			if (jqXHR.statusText == 'board is readonly') {
				msg = {
					type : 'error',
					content : 'cannot_post'
				};
			} else if (jqXHR.statusText == 'can\'t reply this post') {
				msg = {
					type : 'error',
					content : 'cannot_reply'
				};
			}
		} else {
			msg = {
				type : 'error',
				content	: 'network_error'
			};
		}
		UI_notify_update(msg);
	});
}

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
		bbs_post_info.quote = JSON.parse(response);
		callback_func();
	});
	
	resp.fail(function(jqXHR, textStatus){
		var msg = {
				type : 'error',
				content : 'network_error'
		};
		UI_notify_update(msg);
	});
}

function writeMail(type, title, content, qmd_id, anonym, callback_func){
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
		if (type == bbs_type.write_post.new) {
			view_board(boardPathTerm.name, -1, -1, callback_func, 'click', popNum);
		} else {
			var currentId = postPathTerm.data.id;
			if (currentId + 1 < bbs_post_count) {
				view_board(boardPathTerm.name, 1, -1, callback_func, 'click', popNum);
			} else {
				view_board(boardPathTerm.name, -1, currentId + 1, callback_func, 'click', popNum);
			}
		}
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
		
