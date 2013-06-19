function xmpp_disconnect() {
    console.log("Disconnected");
}

function xmpp_connect() {
    $.xmpp.setPresence(null);
    console.log("Connected");
}

function xmpp_iq(iq) {
    console.log(iq);
}

function xmpp_message(message) {
    console.log("New message of " + message.from + ": "+message.body);
}

function xmpp_presence(presence) {
    console.log("New presence of " + presence.from + " is "+presence.show);
}

function xmpp_error(error) {
    console.log("Error: "+error);
}

function xmpp_send(to, message) {
    $.xmpp.sendMessage({body: message, to: to}, "", xmpp_sent);
}

function xmpp_sent() {
    console.log("message sent");
}
