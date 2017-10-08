console.log("yo whatup");

var API_HOST;
var API_PORT = "8081";

var hostname = window.location.hostname;

if (hostname.indexOf("10.0.") !== -1) {
    API_HOST = "10.0.0.180";
} else {
    API_HOST = "24.60.254.116";
}

var request = function (url, type, data) {
    var reqUrl ="http://" + API_HOST + ":" + API_PORT + url;

    type = type.toUpperCase();
    
    if (type === "POST") {
        data = JSON.stringify(data);
        return $.ajax({
            url: reqUrl,
            contentType: "application/json",
            type: type,
            data: data || null
        });
    } else {
        return $.ajax({
            url: reqUrl,
            type: type,
            data: data || null
        });
    }
};


window.api = {
    request: request,
    API_HOST: API_HOST,
    API_PORT: API_PORT
};
