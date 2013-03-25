function html_encode(str){
	return $('#html-encoder').text(str).html();
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

// This wrapper sets fixed parameters for all ajax requests,
// including type, cache, timeout and other possible params.
function setAjaxParam(ajax_request) {
	ajax_request.cache = false;
	ajax_request.dataType = 'text';
	ajax_request.timeout = 5000;
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
