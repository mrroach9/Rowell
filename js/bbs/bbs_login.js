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

function retrieve_session(){
    // check if bbs session is in query string in the URL or stored in cookie. If so,
    // verify the session and finish login.
    bbs_session = $.url().param('access_token') || $.cookie(bbs_type.cookie.session);
    if (bbs_session) {
        verifySession(bbs_session, true, UI_login_finished);
        return;
    }

    // If no bbs session code found, check if there is Accounts9 code or session
    // in URL or cookie, if so, get bbs session code from accounts9 API and
    // finish login.
    var getToken = function (err, accessToken) {
        if (err){
            verifySession(null, true, UI_login_finished);
            return;
        }
        $.cookie(Accounts9.session_cookie, accessToken, {expires: 14});
        Accounts9.getBBSUser(accessToken, function (err, bbsUser) {
            if (err) {
                verifySession(null, true, UI_login_finished);
                return;
            }
            if (!bbsUser) {
                location.href = accounts9.server + accounts9.connect;
            }
            bbs_session = bbsUser.accessToken;
            verifySession(bbs_session, true, UI_login_finished);
        });       
    }
    var accounts9_code = $.url().param('code');
    if (accounts9_code) {
        Accounts9.getAccessToken(accounts9_code, getToken);
        return;
    }

    var accounts9_access_token = $.cookie(Accounts9.session_cookie);
    if (accounts9_access_token) {
        getToken(null, accounts9_access_token);
        return;
    }

    // If none is found, finished the login anyway.
    verifySession(bbs_session, true, UI_login_finished);
}