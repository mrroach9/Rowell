var xmpp_panel_closed = false;
var xmpp_chat_windows = {};
var xmpp_chat_windows_id = {};
var xmpp_title_original = "";
var xmpp_title_alternative = "";
var xmpp_title_changing = false;
var xmpp_title_using_alternative = false;
var xmpp_panel_left = 0;
var xmpp_reconnecting = false;
var XMPP_TITLE_CHANGE_INTERVAL = 1000;
var XMPP_CHAT_TITLE_ACTIVE_COLOR = '#5BB75B';
var XMPP_CHAT_TITLE_INACTIVE_COLOR = 'rgb(91, 191, 222)';
var xmpp_session_key = "";

function xmpp_jid_normalize(jid) {
    return jid.replace(/[\.@\/]/g, '_');
}

function xmpp_onresize(){
    var width = $('body').prop('clientWidth');
    if (xmpp_panel_closed) {
        xmpp_panel_left = width - 30;
    } else {
        xmpp_panel_left = width - 270;
    }
    $('#xmpp-panel').css({left: xmpp_panel_left, right: ''});
    xmpp_adjust_height();
    xmpp_order_chat_window(false);
}

function xmpp_onfocus() {
    xmpp_end_title_change();
}

function xmpp_adjust_height() {
    var panel_height = window.innerHeight - 125;
    $('#xmpp-panel').css({height: panel_height});
    var main_height = window.innerHeight - 135;
    $('#xmpp-panel-main').css({height: main_height});
    var user_list_height = main_height - $('#xmpp-main-title').height() - 9;
    $('#xmpp-main-content').css({height: user_list_height});
    $('#xmpp-loading').css({height: user_list_height});

    var handle_top = panel_height / 2 - 47;
    $('#xmpp-panel-handle').css({top: handle_top});
}

function xmpp_panel_toggle() {
    var left = $('#xmpp-panel').offset().left;
    if (xmpp_panel_closed) {
        xmpp_panel_left = left - 240;
    } else {
        xmpp_panel_left = left + 240;
    }
    $('#xmpp-panel').css({left: left}).animate({'left': xmpp_panel_left}, 500);
    xmpp_panel_closed = !xmpp_panel_closed;
    xmpp_order_chat_window(true);
}

function xmpp_show_loading(text) {
    xmpp_adjust_height();
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
    // If we are reconnecting, now it's allowed to schedule another
    // If we aren't reconnecting, this is no-op.
    xmpp_reconnecting = false;
    $('#xmpp-panel').show();
    xmpp_show_loading(bbs_string.xmpp_connecting);
    $.xmpp.connect({
        resource: bbs_query.xmpp_resource + xmpp_session_key,
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

function xmpp_disconnect() {
    $.xmpp.disconnect(null);
}

function xmpp_connected() {
    xmpp_show_loading(bbs_string.xmpp_connected);
//    $.xmpp.getRoster(xmpp_roster);
    $.xmpp.setPresence(null);
    console.log("Connected");
    xmpp_user_list = {};
    $('#xmpp-user-list').empty();
}

function xmpp_iq(iq) {
    console.log(iq);
    var xiq = $(iq);
    if (xiq.attr("type") == "result") {
        if (xiq.children(0).get(0).tagName == "QUERY") {
            var query = xiq.children(0);
            if (xiq.children(0).attr("xmlns") == "jabber:iq:roster") {
                var roster = [];
                $.each(query.find("item"), function(i, item) {
                    var jItem = $(item);
                    roster.push({name: jItem.attr("name"), subscription: jItem.attr("subscription"), jid: jItem.attr("jid")});
                });
                xmpp_roster(roster);
            }
        }
    }
}

function xmpp_message(message) {
    if ($.xmpp.debug) {
        console.log("New message of " + message.from + ": "+message.body);
    }
    var user = message.from.split('@')[0];
//    alert("New message of " + user + ": "+message.body);
    var text = message.from.split('@')[0] + ": " + message.body;
    xmpp_create_chat_window(message.from);
    xmpp_append_msg_log(message.from, text, false);
    if (!document.hasFocus()) {
        xmpp_start_title_change('【' + user + '】');
    }
    xmpp_focus_window(message.from);
}

function xmpp_presence(presence) {
    $('#xmpp-loading').hide();
    if ($.xmpp.debug) {
        console.log("New presence of " + presence.from + " is " + presence.type +
                " status: " + presence.status + " show: " + presence.show);
    }
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
    if (jid_bare == $.xmpp.jid && resource.indexOf($.xmpp.resource) == 0) {
        if ($.xmpp.debug) {
            console.log("omit presence from myself");
        }
        return;
    }
    var name = jid_bare.split('@')[0]
    var domain = jid_bare.split('@')[1].replace(/\./g, '_');
    var div_id = 'xmpp-user-' + name + '-' + domain;
    var show_id = div_id + "-show";
    var status_id = div_id + "-status";
//    var show = "[online]";
    var show = '<div class="xmpp-show-online">&nbsp;</div>';
    var status = "";
    if (typeof(presence.status) != "undefined" && presence.status != null) {
        status = '(' + presence.status + ')';
    }
    if (typeof(presence.show) != "undefined") {
        if (presence.show == "chat") {
            show = '<div class="xmpp-show-chat">&nbsp;</div>';
        } else if (presence.show == "dnd") {
            show = '<div class="xmpp-show-dnd">&nbsp;</div>';
        } else if (presence.show == "away") {
            show = '<div class="xmpp-show-away">&nbsp;</div>';
        } else if (presence.show == "xa") {
            show = '<div class="xmpp-show-xa">&nbsp;</div>';
        } else {
            show = '<div class="xmpp-show-default">&nbsp;</div>';
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

        var inserted = false;
        for (var i = 0; i < $('#xmpp-user-list').children().length; i++) {
            var child = $($('#xmpp-user-list').children().get(i));
            if (child.attr('jid').toLowerCase() > jid_bare.toLowerCase()) {
                $(user_div).insertBefore(child);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            $('#xmpp-user-list').append(user_div);
        }
        $('#' + div_id).click(function() {
            xmpp_user_click($(this).attr('jid'));
        });
        xmpp_user_list[jid_bare] = {}
        xmpp_user_list[jid_bare][resource] = presence;
    }
}

function xmpp_error(error) {
    console.log("Error: "+error.error);
    // If a reconnect is scheduled, don't schedule another
    if (!xmpp_reconnecting) {
        xmpp_reconnecting = true;
        xmpp_user_list = {}
        $('#xmpp-user-list').empty();
        xmpp_show_loading(bbs_string.xmpp_error);
        setTimeout(function() {
            console.log("xmpp error. reconnecting...");
            xmpp_connect();
        }, 5000);
    }
}

function xmpp_send(to, message) {
    $.xmpp.sendMessage({body: message, to: to}, "", function(data) {
        xmpp_sent(to, message, data);
    });
}

function xmpp_sent(to, msg, data) {
    if ($.xmpp.debug) {
        console.log("message sent to " + to + ": " + msg);
    }
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

function xmpp_order_chat_window(use_ani) {
    var new_id = 0;
    for (var id in xmpp_chat_windows_id) {
        var info = xmpp_chat_windows_id[id];
        if (info.id != new_id) {
            info.id = new_id;
            xmpp_chat_windows[info.jid].id = new_id;
            xmpp_chat_windows_id[new_id] = info;
            delete xmpp_chat_windows_id[id];
        }
        if (use_ani) {
            $('#xmpp-chat-' + xmpp_jid_normalize(info.jid)).
                animate({left: xmpp_get_chat_left(info.id)});
        } else {
            $('#xmpp-chat-' + xmpp_jid_normalize(info.jid)).
                css({left: xmpp_get_chat_left(info.id)});
        }
        new_id++;
    }
}

function xmpp_get_chat_left(id) {
    var chat_width = 215;
    var panel_width = 270;
    var panel_left = xmpp_panel_left;
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
                '<button class="close xmpp-chat-title-min" id="xmpp-chat-' +
                jid_normal + '-min" type="button">&#8210;</button>' +
            '</div>' +
            '<div class="xmpp-chat-text" id="xmpp-chat-' + jid_normal + '-text"/>' +
            '<textarea class="xmpp-chat-input"id="xmpp-chat-' + jid_normal + '-input"/>' +
        '</div>';

    var window_info = {id: id, jid: jid_bare, minimized: false, active: false};
    xmpp_chat_windows[jid_bare] = window_info;
    xmpp_chat_windows_id[id] = window_info

    $('#xmpp-panel').append(window_div);
    $('#xmpp-chat-' + jid_normal).click(function() {
        xmpp_highlight_off(jid_bare);
    });
    $('#xmpp-chat-' + jid_normal).focusin(function() {
        xmpp_highlight_off(jid_bare);
    });
    $('#xmpp-chat-' + jid_normal + '-close').click(function() {
        xmpp_chat_close_click(jid_bare);
    });
    // covered by title bar
/*    $('#xmpp-chat-' + jid_normal + '-min').click(function() {
        xmpp_chat_min_click(jid_bare);
    });*/
    $('#xmpp-chat-' + jid_normal + '-title').click(function() {
        xmpp_chat_min_click(jid_bare);
    });
    $(input_div).keydown(function(event) {
        if (event.which == 13) {
            var msg = $(this).val();
            xmpp_send($(this).parent().attr('jid'), msg);
            xmpp_append_msg_log(jid_bare, xmpp_get_my_name() + ": " + msg, true);
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
}

function xmpp_get_my_name() {
    return $.xmpp.jid.split('@')[0];
}

function xmpp_append_msg_log(jid_bare, text, mine) {
    var chat_id = '#xmpp-chat-' + xmpp_jid_normalize(jid_bare) + '-text';
    var chat_text = $(chat_id);

    var msg_div = '<div class="';
    if (mine) {
        msg_div += 'xmpp-chat-text-mine';
    } else {
        msg_div += 'xmpp-chat-text-other';
    }
    msg_div += '" ></div>';
    var msg = $(msg_div);
    msg.text(text);
    chat_text.append(msg);

/*    var log = chat_text.val();
    if (log) {
        log += "\n" + text;
    } else {
        log = text;
    }
    chat_text.val(log);*/
    chat_text.scrollTop(chat_text[0].scrollHeight);
}

function xmpp_chat_close_click(jid_bare) {
    $('#xmpp-chat-' + xmpp_jid_normalize(jid_bare)).remove();
    $(this).remove();
    var info = xmpp_chat_windows[jid_bare];
    delete xmpp_chat_windows[jid_bare];
    delete xmpp_chat_windows_id[info.id];
    xmpp_order_chat_window(true);
}

function xmpp_chat_min_click(jid_bare) {
    var chat_id = '#xmpp-chat-' + xmpp_jid_normalize(jid_bare);
    if (xmpp_chat_windows[jid_bare].minimized) {
        $(chat_id).animate({'bottom': 0});
        xmpp_chat_windows[jid_bare].minimized = false;
    } else {
        $(chat_id).animate({'bottom': -277});
        xmpp_chat_windows[jid_bare].minimized = true;
    }
}

function xmpp_gen_session_key() {
    var x = Math.random();
    var ret = "";
    for (var i = 0; i < 4; i ++) {
        x = x * 10;
        ret += String(Math.floor(x));
        x = x - Math.floor(x);
    }
    return ret;
}

function xmpp_ui_init() {
    xmpp_session_key = xmpp_gen_session_key();
    $('#xmpp-panel').hide();
    $('#xmpp-panel-handle').click(xmpp_panel_toggle);
    xmpp_onresize();
    $(document).click(xmpp_global_click);
}

function xmpp_roster(rosters) {
    for (id in rosters) {
        entry = rosters[id];
        if ($.xmpp.debug) {
            console.log("friend " + id + ": " + entry.name + "(" + entry.jid + ")");
        }
    }
}

function xmpp_start_title_change(new_title) {
    if (xmpp_title_original == "") {
        xmpp_title_alternative = new_title + document.title;
        xmpp_title_original = document.title;
    } else {
        xmpp_title_alternative = new_title + xmpp_title_original;
    }
    xmpp_enable_title_change();
}

function xmpp_end_title_change() {
    xmpp_disable_title_change();
    if (xmpp_title_original != "") {
        document.title = xmpp_title_original;
    }
}

function xmpp_enable_title_change() {
    if (xmpp_title_changing) return;
    xmpp_title_changing = true;
    setTimeout(xmpp_title_change_timer, XMPP_TITLE_CHANGE_INTERVAL);
}

function xmpp_disable_title_change() {
    xmpp_title_changing = false;
}

function xmpp_title_change_timer() {
    if (!xmpp_title_changing) return;
    if (xmpp_title_using_alternative) {
        document.title = xmpp_title_original;
    } else {
        document.title = xmpp_title_alternative;
    }
    xmpp_title_using_alternative = !xmpp_title_using_alternative;
    setTimeout(xmpp_title_change_timer, XMPP_TITLE_CHANGE_INTERVAL);
}

function xmpp_highlight_off_all() {
    for (jid_bare in xmpp_chat_windows) {
        if (xmpp_chat_windows[jid_bare].active) {
            xmpp_highlight_off(jid_bare);
        }
    }
}

function xmpp_highlight_off(jid_bare) {
    var chat = $('#xmpp-chat-' + xmpp_jid_normalize(jid_bare) + '-title');
    chat.css({'background': XMPP_CHAT_TITLE_INACTIVE_COLOR});
    xmpp_chat_windows[jid_bare].active = false;
}

function xmpp_highlight_on(jid_bare) {
    var chat = $('#xmpp-chat-' + xmpp_jid_normalize(jid_bare) + '-title');
    chat.css({'background': XMPP_CHAT_TITLE_ACTIVE_COLOR});
    xmpp_chat_windows[jid_bare].active = true;
}

function xmpp_focus_window(jid_bare) {
    var chat = $('#xmpp-chat-' + xmpp_jid_normalize(jid_bare));
    if (!chat.is(":focus") && chat.children(":focus").length == 0) {
        xmpp_highlight_on(jid_bare);
    }
}

function xmpp_global_click(e) {
    if (window.innerWidth >= 1600) return;
    if (xmpp_panel_closed) return;
    if ($(e.target).closest('#xmpp-panel').length == 0) {
        xmpp_panel_toggle();
    }
}
