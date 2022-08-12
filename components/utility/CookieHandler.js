function cExpires(exdays){
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	return expires
}

export function setCookie(cname, cvalue, exdays){
	document.cookie = cname + '=' + cvalue + ';'  + cExpires(exdays) + '; path=/'
}

export function removeCookie(cname){
	document.cookie = cname + '=' + null + ';' + 'path=/;';
}

export function getCookie(cname) {
  if (typeof window !== 'undefined'){
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;}
}
