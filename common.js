function html_encode(str){
	return $('#html-encoder').text(str).html();
}

function linkify(text) {
	var urlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;  
	return text.replace(urlRegex, function(url) {  
  	return '<a href="' + url + '" target="_blank">' + url + '</a>';
  })  
}