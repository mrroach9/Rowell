var xmpp_panel_closed = false;

function xmpp_onresize(){
    var width = $('body').prop('clientWidth');
    if (xmpp_panel_closed) {
        $('#xmpp-panel').css({left: width - 30, right: ''});
    } else {
        $('#xmpp-panel').css({left: width - 230, right: ''});
    }
}

function xmpp_panel_toggle() {
    var left = $('#xmpp-panel').offset().left;
    if (xmpp_panel_closed) {
        $('#xmpp-panel').css({left: left}).animate({'left': left - 200}, 500);
    } else {
        $('#xmpp-panel').css({left: left}).animate({'left': left + 200}, 500);
    }
    xmpp_panel_closed = !xmpp_panel_closed;
}

function xmpp_disconnect() {
    console.log("Disconnected");
}

function xmpp_connect() {
    $.xmpp.setPresence(null);
    console.log("Connected");
    xmpp_user_list = {};
}

function xmpp_iq(iq) {
    console.log(iq);
}

function xmpp_message(message) {
    console.log("New message of " + message.from + ": "+message.body);
    var user = message.from.split('@')[0];
    alert("New message of " + user + ": "+message.body);
}

function xmpp_presence(presence) {
    console.log("New presence of " + presence.from + " is " + presence.type +
            " status: " + presence.status + " show: " + presence.show);
    var jid = presence.from;
    var jid_split = jid.split('/');
    var resource = "";
    if (jid_split.length > 1) {
        resource = jid_split[1];
    } else {
        console.log("ERROR: xmpp_presence: jid no resource: " + jid);
        return;
    }
    var jid_bare = jid_split[0];
    var name = jid_bare.split('@')[0]
    var domain = jid_bare.split('@')[1].replace(/\./g, '_');
    var div_id = 'xmpp-user-' + name + '-' + domain;
    var show_id = div_id + "-show";
    var status_id = div_id + "-status";
//    var show = "[online]";
    var show = '<div style="background:green;">&nbsp;</div>';
    var status = "";
    if (typeof(presence.status) != "undefined") {
        status = '(' + presence.status + ')';
    }
    if (typeof(presence.show) != "undefined") {
        if (presence.show == "chat") {
            show = '<div style="background:lightgreen;">&nbsp;</div>';
        } else if (presence.show == "dnd") {
            show = '<div style="background:red;">&nbsp;</div>';
        } else if (presence.show == "away") {
            show = '<div style="background:orange;">&nbsp;</div>';
        } else if (presence.show == "xa") {
            show = '<div style="background:yellow;">&nbsp;</div>';
        } else {
            show = '[' + presence.show + ']';
        }
    }
    if (jid_bare in xmpp_user_list && resource in xmpp_user_list[jid_bare]) {
        if (presence.type == "unavailable") {
            delete xmpp_user_list[jid_bare][resource];
            if (Object.keys(xmpp_user_list[jid_bare]).length == 0) {
                $('#' + div_id).fadeOut(500, function() { $(this).remove(); });
                delete xmpp_user_list[jid_bare];
            }
        } else {
            $('#' + status_id).html(status);
            $('#' + show_id).html(show);
            xmpp_user_list[jid_bare][resource] = presence;
        }
    } else {
        var user_div =
            '<div class="xmpp-user" id="' + div_id + '" onclick="xmpp_user_click(\'' +
                    jid_bare + '\');">' +
            '<table><tr>' +
                '<td><div class="xmpp-user-show" id="' + show_id + '">' +
                show +
                '</div></td>' +
                '<td><div class="xmpp-user-name">' + name + '</div></td>' +
                '<td><div class="xmpp-user-status" id="' + status_id + '">' +
                status +
                '</div></td>' +
            '</tr></table>' +
            '</div>';
        $('#xmpp-user-list').append(user_div);
        if (!(jid_bare in xmpp_user_list)) {
            xmpp_user_list[jid_bare] = {}
        }
        xmpp_user_list[jid_bare][resource] = presence;
    }
}

function xmpp_error(error) {
    console.log("Error: "+error.error);
}

function xmpp_send(to, message) {
    $.xmpp.sendMessage({body: message, to: to}, "", xmpp_sent);
}

function xmpp_sent() {
    console.log("message sent");
}
