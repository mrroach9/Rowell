var Accounts9 = {};

Accounts9.getAccessToken = function (code, callback) {
    var url = accounts9.server + accounts9.access_token;
    var res = $.ajax({
        url: url,
        type: 'GET',
        data: {
            code: code,
            client_id: accounts9.client_id,
            client_secret: accounts9.client_secret
        },
        dataType: 'jsonp',
        cache: false
    });
    
    res.success(function(response){
        if (response.access_token) {
            callback(null, response.access_token);
        } else {
            callback(res);
        }
    });
    
    res.fail(function(jqXHR, textStatus){
        callback(textStatus);
    });
};

Accounts9.getBBSUser = function (accessToken, callback) {
    var url = accounts9.server + accounts9.bbsuserinfo;
    var res = $.ajax({
        url: url,
        type: 'GET',
        data: {
            access_token: accessToken,
        },
        dataType: 'jsonp',
        cache: false
    });
    
    res.success(function(response){
        callback(response.err, response.user);
    });
    
    res.fail(function(jqXHR, textStatus){
        callback(textStatus);
    });
};

Accounts9.removeSessionCookie = function () {
    $.cookie(accounts9.session_cookie, null);
};
