var bbs_server_addr = 'https://bbs.net9.org:8080';
var bbs_client_id = 0;
var bbs_client_secret = 0;
var bbs_auth_path = '/auth/auth?redirect_uri=displaycode&response_type=code&client_id=' + bbs_client_id;
var bbs_token_path = '/auth/token';
var bbs_session_verify_path = '/session/verify';
var bbs_allboard_path = '/board/list';
var bbs_favboard_path = '/favboard/list';
var bbs_postlist_path = '/board/post_list';

var bbs_favboard_type = 'FAVBOARD';
var bbs_allboard_type = 'ALLBOARD';
var bbs_favboard_name = '收藏夹';
var bbs_allboard_name = '所有版面';
var bbs_error_session = 'SESSION_ERROR';

var bbs_max_board_count = 9999;
var bbs_post_count = 20;
var bbs_max_post_count = 999;

var bbs_session_cookie = 'bbs_session';
var bbs_title = '9# BBS - Rowell ';
var bbs_version = '0.0.4';

