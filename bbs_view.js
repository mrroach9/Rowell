var bbs_current_path = {
	boardlist : {
		type : '',
		zhname : ''
	},
	
	board : {
		name : '',
		zhname : '',
		start : -1,
		end : -1
	},
	
	post : {
		id : -1,
		xid : -1,
		title : ''
	},
	path_level: -1
};

var bbs_session = '';

function view_boardlist(type, callback_func){
	var request_settings = {
		url : '',
		type: 'GET',
		data: {
			session: bbs_session,
			start: 1,
			count: bbs_max_board_count,
		},
		dataType: 'text',
		cache: false
	};
	
	var name = '';
	if (type == bbs_favboard_type) {
		request_settings.url = bbs_server_addr + bbs_favboard_path;
		name = bbs_favboard_name;
	} else if (type == bbs_allboard_type) {
		request_settings.url = bbs_server_addr + bbs_allboard_path;
		name = bbs_allboard_name;
	}
	
	var resp = $.ajax(request_settings);
	
	resp.success(function(response){
		var boardlist = extractBoardInfo(response, type);
		bbs_current_path.boardlist = {
			type : type,
			zhname : name
		};
		bbs_current_path.board = {
			name : '',
			zhname : '',
			start : -1,
			end : -1
		};
		bbs_current_path.post = {
			id : -1,
			xid : -1,
			title : ''
		};
		bbs_current_path.path_level = 1;
		callback_func(bbs_current_path, boardlist);
	});
	
	resp.fail(function(jqXHR, textStatus){
	});
	
}

/** User of this function should always set retry = true, as it is
 *  set to true default. This arg is used to detect whether the post
 *  list has reached the end of the board. When such case happens, 
 *  an error will be reported by pybbs, therefore the function will
 *  attempt to load the recent posts. If the result is still error,
 *  it should be a network error. To avoid dead-loop, the function
 *  will not be executed again.
 */
function view_board(board_name, start, end, callback_func, retry){
	var request_settings = {
		url : bbs_server_addr + bbs_postlist_path,
		type: 'GET',
		data: {
			session: bbs_session,
			name: board_name
		},
		dataType: 'text',
		cache: false
	};
	
	if (start <= 0 || end <= 0 || end < start ||
	    end - start > bbs_max_post_count) {
		request_settings.data.count = bbs_post_count;
	} else {
		request_settings.data.start = start;
		request_settings.data.end = end;
	}
	
	var resp = $.ajax(request_settings);
	
	resp.success(function(response){
		var postlist = extractPostInfo(response);
		var iStart = 999999;
		var iEnd = -1;
		for (var i = 0; i < postlist.length; ++i) {
			if (postlist[i].id < iStart) {
				iStart = postlist[i].id;
			}
			if (postlist[i].id > iEnd) {
				iEnd = postlist[i].id;
			}
		}
		bbs_current_path.board = {
			name : board_name,
			zhname : board_names[board_name],
			start : iStart,
			end : iEnd
		};
		bbs_current_path.post = {
			id : -1,
			xid : -1,
			title : ''
		};
		bbs_current_path.path_level = 2;
		callback_func(bbs_current_path, postlist);
	});
	
	resp.fail(function(jqXHR, textStatus){
		if (retry) {
			view_board(board_name, -1, -1, callback_func, false);
		}
	});
}

function view_board_next_page(callback_func){
	if (bbs_current_path.path_level != 2) {
		return;
	}
	var name = bbs_current_path.board.name;
	var newStart = bbs_current_path.board.end + 1;
	var newEnd = newStart + bbs_post_count - 1;
	view_board(name, newStart, newEnd, callback_func, true);
}

function view_board_prev_page(callback_func){
	if (bbs_current_path.path_level != 2) {
		return;
	}
	var name = bbs_current_path.board.name;
	var newEnd = bbs_current_path.board.start - 1;
	var newStart = newEnd - bbs_post_count + 1;
	view_board(name, newStart, newEnd, callback_func, true);
}

function view_post(post_id, callback_func, retry) {
	var request_settings = {
		url : bbs_server_addr + bbs_viewpost_path,
		type: 'GET',
		data: {
			session : bbs_session,
			board : bbs_current_path.board.name,
			id : post_id
		},
		dataType: 'text',
		cache: false
	};
	
	var resp = $.ajax(request_settings);
	resp.success(function(response){
		post = extractPostContent(response);
		bbs_current_path.post = {
			id : post.id,
			xid : post.xid,
			title : post.title
		};
		bbs_current_path.path_level = 3;
		callback_func(bbs_current_path, post);
	});
	
	resp.fail(function(jqXHR, textStatus){
		if (retry) {
			view_board(board_name, -1, -1, callback_func, false);
		}
	});
}	

function view_next_post(callback_func) {
	if (bbs_current_path.path_level != 3) {
		return;
	}
	view_post(bbs_current_path.post.id + 1, callback_func, true);
}

function view_prev_post(callback_func) {
	if (bbs_current_path.path_level != 3) {
		return;
	}
	view_post(bbs_current_path.post.id - 1, callback_func, true);
}

function extractPostInfo(contentStr) {
	postlist = JSON.parse(contentStr);
	for (var i = 0; i < postlist.length; ++i) {
		if (postlist[i].title.substr(0,4) != 'Re: ') {
			postlist[i].title = '● ' + postlist[i].title;
		}
		var date = new Date();
		date.setMilliseconds(postlist[i].posttime);
		var dateStr = date.toDateString();
		var strArr = dateStr.split(' ');
		dateStr = strArr[1] + ' ' + strArr[2];
		postlist[i].posttime = dateStr;
		postlist[i].title = html_encode(postlist[i].title);
	}
	return postlist;
}

function extractBoardInfo(contentStr, type){
	var boardlist = [];
	if (type == bbs_allboard_type) {
		boardlist = JSON.parse(contentStr);
	} else if (type == bbs_favboard_type) {
		var content = JSON.parse(contentStr);
		for (var i = 0; i < content.length; ++i) {
			boardlist.push(content[i].binfo);
		}
	}
	for (var i = 0; i < boardlist.length; ++i) {
		var zhname = board_names[boardlist[i].name];
		if (zhname == null) {
			zhname = '';
		}
		boardlist[i].zhname = zhname;
		
		boardlist[i].zhname = html_encode(boardlist[i].zhname);
		boardlist[i].name = html_encode(boardlist[i].name);
	}
	return boardlist;
}
		
function extractPostContent(contentStr) {
	post = JSON.parse(contentStr);
	post.title = html_encode(post.title);
	post.content = html_encode(post.content);
	//Replace all \n to <br>
	var reg = new RegExp("\n", "g");
	post.content = post.content.replace(reg, '<br>');
	
	//Eliminate all ASCII control characters
	reg = new RegExp("\\[[0-9;]*m", "g");
	post.content = post.content.replace(reg, '');
	
	return post;
}
	