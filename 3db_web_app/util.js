
function json_ws_get(request,callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState === 4 && this.status === 200) {
      callback(JSON.parse(this.responseText));
	}
  };
  xhttp.open("GET", request, true);
  xhttp.send();
};

function json_ws_post(request,data,callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if(this.readyState === 4 && this.status === 200) {
      callback(JSON.parse(this.responseText));
	}
  };
  xhttp.open("POST", request, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  xhttp.send(JSON.stringify(data));
}

function URI2Params(url) {
  if (url.search.length == 0) {
    return {};
  } 
  return JSON.parse('{"' + decodeURI(url.search.substring(1))
                           .replace(/"/g, '\\"')
                           .replace(/&/g, '","')
                           .replace(/=/g,'":"') 
                          + '"}');
}