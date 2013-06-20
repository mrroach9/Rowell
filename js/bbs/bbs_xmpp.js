var xmpp_panel_closed = false;

function xmpp_panel_toggle() {
    if (xmpp_panel_closed) {
        $('#xmpp-panel').animate({'right': '0px'}, 500);
    } else {
        $('#xmpp-panel').animate({'right': '-210px'}, 500);
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
}

function xmpp_presence(presence) {
    console.log("New presence of " + presence.from + " is " + presence.type +
            " status: " + presence.status + " show: " + presence.show);
    var jid = presence.from;
    var jid_bare = jid.split('/')[0];
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
    if (jid_bare in xmpp_user_list) {
        if (presence.type == "unavailable") {
            $('#' + div_id).fadeOut(500, function() { $(this).remove(); });
            delete xmpp_user_list[jid_bare]
        } else {
            $('#' + status_id).html(status);
            $('#' + show_id).html(show);
        }
    } else {
        var user_div =
            '<div class="xmpp-user" id="' + div_id + '">' +
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
        xmpp_user_list[jid_bare] = presence;
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
