var xmpp_panel_closed = false;
var xmpp_chat_windows = {};
var xmpp_chat_windows_id = {};

function xmpp_jid_normalize(jid) {
    return jid.replace(/[\.@\/]/g, '_');
}

function xmpp_onresize(){
    var width = $('body').prop('clientWidth');
    if (xmpp_panel_closed) {
        $('#xmpp-panel').css({left: width - 70, right: ''});
    } else {
        $('#xmpp-panel').css({left: width - 270, right: ''});
    }
}

function xmpp_panel_toggle() {
    var left = $('#xmpp-panel').offset().left;
    if (xmpp_panel_closed) {
        $('#xmpp-panel').css({left: left}).animate({'left': left - 240}, 500);
    } else {
        $('#xmpp-panel').css({left: left}).animate({'left': left + 240}, 500);
    }
    xmpp_panel_closed = !xmpp_panel_closed;
}

function xmpp_show_loading(text) {
    $('#xmpp-loading').show();
    $('#xmpp-loading-text').html(text);
}

function xmpp_disconnected() {
    console.log("Disconnected");
    xmpp_user_list = {}
    $('#xmpp-user-list').empty();
    xmpp_show_loading(bbs_string.xmpp_disconnected);
}

function xmpp_connect() {
    $('#xmpp-panel').show();
    xmpp_show_loading(bbs_string.xmpp_connecting);
    $.xmpp.connect({
        resource: bbs_query.xmpp_resource,
    domain: bbs_query.xmpp_domain,
    token: bbs_session,
    url: bbs_query.bosh_url,
    wait: bbs_query.xmpp_wait,
    onDisconnect: xmpp_disconnected,
    onConnect: xmpp_connected,
    onIq: xmpp_iq,
    onMessage: xmpp_message,
    onPresence: xmpp_presence,
    onError: xmpp_error
    });    

}

function xmpp_connected() {
    xmpp_show_loading(bbs_string.xmpp_connected);
    $.xmpp.getRoster(xmpp_roster);
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
//    alert("New message of " + user + ": "+message.body);
    var text = message.from.split('@')[0] + ": " + message.body;
    xmpp_create_chat_window(message.from);
    xmpp_append_msg_log(message.from, text);
}

function xmpp_presence(presence) {
    $('#xmpp-loading').hide();
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
    if (jid_bare in xmpp_user_list) {
        xmpp_user_list[jid_bare][resource] = presence;
        if (presence.type == "unavailable") {
            delete xmpp_user_list[jid_bare][resource];
            if (Object.keys(xmpp_user_list[jid_bare]).length == 0) {
                $('#' + div_id).fadeOut(500, function() { $(this).remove(); });
                delete xmpp_user_list[jid_bare];
            }
        } else {
            $('#' + status_id).html(status);
            $('#' + show_id).html(show);
        }
    } else {
        var user_div =
        '<div class="xmpp-user" id="' + div_id + '" jid="' + jid_bare + '">' +
        '<table><tr>'+
            '<td><div class="xmpp-user-show" id="' + show_id + '">' +
            show +
            '</div></td><td>' +
            '<div class="xmpp-user-name">' + name + '</div></td><td>' +
            '<div class="xmpp-user-status" id="' + status_id + '">' +
            status +
            '</div></td>' +
        '</tr></table>'+
        '</div>'

        $('#xmpp-user-list').append(user_div);
        $('#' + div_id).click(function() {
            xmpp_user_click($(this).attr('jid'));
        });
        xmpp_user_list[jid_bare] = {}
        xmpp_user_list[jid_bare][resource] = presence;
    }
}

function xmpp_error(error) {
    console.log("Error: "+error.error);
    xmpp_user_list = {}
    $('#xmpp-user-list').empty();
    xmpp_show_loading(bbs_string.xmpp_error);
    setTimeout(function() { xmpp_connect(); }, 5000);
}

function xmpp_send(to, message) {
    $.xmpp.sendMessage({body: message, to: to}, "", function(data) {
        xmpp_sent(to, message, data);
    });
}

function xmpp_sent(to, msg, data) {
    console.log("message sent to " + to + ": " + msg);
//    xmpp_append_msg_log(xmpp_jid_normalize(to), "<" + msg + " sent>");
}

function xmpp_user_click(jid_bare) {
    if (jid_bare in xmpp_chat_windows) {
    } else {
        xmpp_create_chat_window(jid_bare);
    }
/*    var msg = prompt('msg to send');
    if (msg != undefined) {
        xmpp_send(jid_bare, msg);
    }*/
}

function xmpp_order_chat_window() {
    var new_id = 0;
    for (var id in xmpp_chat_windows_id) {
        var info = xmpp_chat_windows_id[id];
        if (info.id != new_id) {
            $('#xmpp-chat-' + xmpp_jid_normalize(info.jid)).
                css({left: xmpp_get_chat_left(new_id)});
            info.id = new_id;
            xmpp_chat_windows[info.jid].id = new_id;
            xmpp_chat_windows_id[new_id] = info;
            delete xmpp_chat_windows_id[id];
        }
        new_id++;
    }
}

function xmpp_get_chat_left(id) {
    var chat_width = 200;
    var panel_width = 270;
    var panel_left = $('#xmpp-panel').position().left;
    var my_left = panel_left - chat_width * (id + 1);
    return my_left;
}

function xmpp_create_chat_window(jid_bare) {
    if (jid_bare in xmpp_chat_windows) return;
    var name = jid_bare.split('@')[0];
    var jid_normal = xmpp_jid_normalize(jid_bare);
    var id = Object.keys(xmpp_chat_windows).length;
    var my_left = xmpp_get_chat_left(id);
    var input_div = '#xmpp-chat-' + jid_normal + '-input';
    var window_div =
        '<div class="xmpp-chat" id="xmpp-chat-' + jid_normal +
        '" jid="' + jid_bare + '" style="left: ' + my_left + 'px;">' +
            '<div class="xmpp-chat-title" id="xmpp-chat-' + jid_normal + '-title">'
                + '<div class="xmpp-chat-title-text">' + name + '</div>' +
                '<button class="close xmpp-chat-title-close" id="xmpp-chat-' +
                jid_normal + '-close" type="button">×</button>' +
            '</div>' +
            '<textarea readonly class="xmpp-chat-text" id="xmpp-chat-' + jid_normal + '-text"/>' +
            '<textarea class="xmpp-chat-input"id="xmpp-chat-' + jid_normal + '-input"/>' +
        '</div>';
    $('#xmpp-panel').append(window_div);
    $('#xmpp-chat-' + jid_normal + '-close').click(function() {
        xmpp_chat_close_click(jid_bare);
    });
    $(input_div).keypress(function(event) {
        if (event.which == 13) {
            var msg = $(this).val();
            xmpp_send($(this).parent().attr('jid'), msg);
            xmpp_append_msg_log(jid_bare, xmpp_get_my_name() + ": " + msg);
            $(this).val('');
            return false;
        } else if (event.keyCode == 27) {
            bbs_topmost_stack.pop();
            xmpp_chat_close_click(jid_bare);
        }
    }).focusin(function() {
        bbs_topmost_stack.push(input_div);
    }).focusout(function() {
        bbs_topmost_stack.pop();
    }).focus();

    var window_info = {id: id, jid: jid_bare};
    xmpp_chat_windows[jid_bare] = window_info;
    xmpp_chat_windows_id[id] = window_info
}

function xmpp_get_my_name() {
    return $.xmpp.jid.split('@')[0];
}

function xmpp_append_msg_log(jid_bare, text) {
    var chat_id = '#xmpp-chat-' + xmpp_jid_normalize(jid_bare) + '-text';
    var chat_text = $(chat_id);
    var log = chat_text.val();
    if (log) {
        log += "\n" + text;
    } else {
        log = text;
    }
    chat_text.val(log);
    chat_text.scrollTop(chat_text[0].scrollHeight);
}

function xmpp_chat_close_click(jid_bare) {
    $('#xmpp-chat-' + xmpp_jid_normalize(jid_bare)).remove();
    var info = xmpp_chat_windows[jid_bare];
    delete xmpp_chat_windows[jid_bare];
    delete xmpp_chat_windows_id[info.id];
    xmpp_order_chat_window();
}

function xmpp_ui_init() {
    $('#xmpp-panel').hide();
}

function xmpp_roster(rosters) {
    for (id in rosters) {
        entry = rosters[id];
        console.log("friend " + id + ": " + entry.name + "(" + entry.jid + ")");
    }
}
