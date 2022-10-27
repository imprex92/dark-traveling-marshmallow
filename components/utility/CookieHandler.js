function cExpires(exdays){
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	return expires
}

export function setCookie(cname, cvalue, exdays){
	document.cookie = cname + '=' + JSON.stringify(cvalue) + ';'  + cExpires(exdays) + '; path=/'
}

export function removeCookie(cname){
	document.cookie = cname + '=' + null + ';' + 'path=/;';
}

export function getCookie(cname) {
 var result = document.cookie.match(new RegExp(cname + '=([^;]+)'));
 result && (result = JSON.parse(result[1]));
 return result;
}