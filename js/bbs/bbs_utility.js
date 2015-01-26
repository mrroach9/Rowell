function clear_unread(board_name, callback_func) {
    var request_settings = {
        url : bbs_query.server + bbs_query.utility.clear_unread,
        type: 'POST',
        data: {
            session: bbs_session
        }
    };
    request_settings = setAjaxParam(request_settings);

    if (board_name != '') {
        request_settings.data.name = board_name;
    }

    var resp = $.ajax(request_settings);

    resp.success(function(response) {
        var msg = {
            type : 'info',
            content : (board_name == '') ? 'all_unread_cleared' : 'board_unread_cleared'
        };
        UI_notify_update(msg);
        if (board_name != '') {
            view_board(board_name, -1, -1, callback_func, 'click', -1);
        } else {
            view_boardlist(bbs_type.entry.allboard, -1, '', callback_func, 0);
        }
    });

    resp.fail(function(jqXHR, textStatus) {
        var msg = {
            type : 'error',
            content : 'network_error'
        };
        callback_func();
        UI_notify_update(msg);
    });
}

function upload_file(file, node, callback_func, progress_func) {
    if (typeof(file) == 'undefined' || file == null) {
        return;
    }

    var request_settings = {
        url : bbs_query.server + bbs_query.utility.upload_file,
        type : 'POST',
        xhr: function() {
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload && progress_func) {
                myXhr.upload.addEventListener('progress', function(event) {
                    progress_func(event, node, file.size);
                }, false);
            }
            return myXhr;
        },
        data : {
            session : bbs_session,
            item : 'attachment'
        }
    };
    request_settings = setAjaxParam(request_settings);
    // For file upload, do not set timeout.
    request_settings.timeout = undefined;

    var fr = new FileReader();
    fr.onload = function() {
        var fileContentB64 = this.result.split(',')[1];
        request_settings.data.content = fileContentB64;
        var resp = $.ajax(request_settings);
        resp.success(function(response) {
            var json = JSON.parse(response);
            callback_func(true, node, {
                id: json.id, 
                size: file.size,
                name: file.name});
        });

        resp.fail(function(jqXHR, textStatus) {
            //TODO: add error handler
            callback_func(false, node);
        });
    };
    fr.readAsDataURL(file);
}

function loadContributorStat(callback_func) {
    var resp = $.ajax(github_stat_address);

    resp.success(function(response) {
        var authorList = [];
        for (var ind in response) {
            authorList.push(response[ind].author);
        }

        // BYVoid contributed to Rowell but his commits were not merged into this repo.
        // add him as hard-coded. Figure out a better solution before similar cases
        // go crazy.
        var byvoid = {
            html_url: 'https://github.com/BYVoid',
            login: 'BYVoid',
            avatar_url: 'https://avatars3.githubusercontent.com/u/245270?v=3&s=400',
        };
        authorList.push(byvoid);
        callback_func(authorList);
    });

    resp.fail(function(jqXHR, textStatus) {
        callback_func(null);
    });
}

function load_user_profile(username, callback_func) {
    var request_settings = {
        url : bbs_query.server + bbs_query.utility.user_profile,
        type: 'GET',
        data: {
            session: bbs_session,
            id: username
        }
    };
    request_settings = setAjaxParam(request_settings);
    var resp = $.ajax(request_settings);

    resp.success(function(response) {
        var profile = JSON.parse(response);
        callback_func(profile);
    });

    resp.fail(function(jqXHR, textStatus) {
        var msg = {
            type : 'error',
            content : 'load_user_profile'
        };
        UI_notify_update(msg);
    });
}