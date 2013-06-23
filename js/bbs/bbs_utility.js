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

    resp.success(function(response){
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

    resp.fail(function(jqXHR, textStatus){
        var msg = {
            type : 'error',
            content : 'network_error'
        };
        callback_func();
        UI_notify_update(msg);
    });
}

function upload_file(file, callback_func, progress_func) {
    if (typeof(file) == 'undefined' || file == null) {
        return;
    }

    var request_settings = {
        url : bbs_query.server + bbs_query.utility.upload_file,
        type : 'POST',
        xhr: function() {
            myXhr = $.ajaxSettings.xhr();
            if(myXhr.upload && progress_func){
                myXhr.upload.addEventListener('progress', progress_func, false);
            }
            return myXhr;
        },
        data : {
            session : bbs_session,
            item : 'attachment'
        }
    };
    request_settings = setAjaxParam(request_settings);
    // For file upload, do not set a time out.
    request_settings.timeout = undefined;

    var fr = new FileReader();
    fr.onload = function() {
        var fileContentB64 = this.result.split(',')[1];
        request_settings.data.content = fileContentB64;
        var resp = $.ajax(request_settings);
        resp.success(function(response) {
            var json = JSON.parse(response);
            callback_func(true, json.id);
        });

        resp.fail(function(jqXHR, textStatus) {
            //TODO: add error handler
            callback_func(false);
        });
    };
    fr.readAsDataURL(file);
}