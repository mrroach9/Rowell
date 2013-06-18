function getSession(auth_code, callback_func){
    var url = bbs_query.server + bbs_query.auth.token;
    var request_settings = {
        url: url,
        type: 'GET',
        data: {
            redirect_uri: 'displaycode',
            code: auth_code,
            grant_type: 'authorization_code',
            client_id: bbs_query.client_id,
            client_secret: bbs_query.client_secret
        }
    };
    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);

    resp.success(function(response){
        res = JSON.parse(response);
        var session = '';
        if (res.access_token != '') {
            session = res.access_token;
        } else {
            session = bbs_type.cookie.error_session;
        }
        callback_func(session);
    });

    resp.fail(function(jqXHR, textStatus){
        callback_func(bbs_type.cookie.error_session);
    });
}

/** If saveSession = true, then the session cookie will be
 *  updated if it is verified successfully.
 */
function verifySession(session, saveSession, callback_func){
    if (session == null || typeof(session) == 'undefined' ||
        session == bbs_type.cookie.error_session) {
        callback_func(false);
        return;
    }

    var url = bbs_query.server + bbs_query.auth.session_verify;
    var request_settings = {
        url: url,
        type: 'GET',
        data: {
            session: session
        }
    };
    request_settings = setAjaxParam(request_settings);

    var resp = $.ajax(request_settings);

    resp.success(function(response){
        res = JSON.parse(response);
        if (res.status == 'ok') {
            if (saveSession) {
                setSessionCookie(session, false);
            }
            callback_func(true);
        } else {
            callback_func(false);
        }
    });

    resp.fail(function(jqXHR, textStatus){
        callback_func(false);
    });
}

/** Set a bbs_session cookie to browser with value
 *  session and expire time of 14 days. If update
 *  is true, the function will force the cookie be
 *  updated, otherwise it will only update when the
 *  cookie does not exist.
 */
function setSessionCookie(session, update){
    if (update || $.cookie(bbs_type.cookie.session) == null) {
        $.cookie(bbs_type.cookie.session, session, {expires: 14});
    }
}

function removeSessionCookie(){
    $.cookie(bbs_type.cookie.session, null);
}
