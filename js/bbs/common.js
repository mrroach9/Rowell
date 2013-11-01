function html_encode(str){
    return $('<div>').text(str).html();
}

function linkify(text) {
    var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(urlRegex, function(url) {
    return '<a href="' + url + '" target="_blank">' + url + '</a>';
  })
}


function convertTime(msec, offset) {
    var time = new Date(msec);
    var utc = time.getTime() + (time.getTimezoneOffset() * 60000);
    var newTime = new Date(utc + (3600000*offset));
    return newTime;
}

function convertBytes(nBytes) {
    if (nBytes < 524288) {
        return (nBytes / 1024).toFixed(1) + 'KB';
    } else {
        return (nBytes / 1048576).toFixed(1) + 'MB';
    }
}

function getTimeStr(sec) {
    var newTime = convertTime(sec * 1000, 8);
    var dateStr = newTime.toDateString();
    var strArr = dateStr.split(' ');
    return strArr[1] + ' ' + strArr[2];
}

// This wrapper sets fixed parameters for all ajax requests,
// including type, cache, timeout and other possible params.
function setAjaxParam(ajax_request) {
    ajax_request.cache = false;
    ajax_request.dataType = 'text';
    ajax_request.timeout = 6000;
    return ajax_request;
}

function getQueryString() {
    var query = {};
    if (location.search.length <= 1) {
        return query;
    }
    location.search.substr(1).split('&').forEach(function (para) {
        var item = para.split('=');
        if (item.length != 2) {
            return;
        }
        query[item[0]] = item[1];
    });
    return query;
}

function ansi2html(content) {
    // add color to reference
    var refertitle = new RegExp('\n(【 .* 】)', 'g');
    var refercontent = new RegExp('\n(\: .*)', 'g');
    var refercontent2 = new RegExp('\n(> .*)', 'g');
    content = content.replace(refertitle, '\n\u001b[1;33m$1\u001b[m');
    content = content.replace(refercontent, '\n\u001b[36m$1\u001b[m');
    content = content.replace(refercontent2, '\n\u001b[36m$1\u001b[m');

    content = html_encode(content);

    // translate ansi color to html code
    var filter = new Filter();
    content = filter.toHtml(content);

    // set the content to be fixed-width
    content = '<span>' + content + '</span>';
    monospacett = new RegExp('\n', 'g');
    content = content.replace(monospacett, '</span>\n<span>');

    return content;
}
