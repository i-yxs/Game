//ajax
Utils.Ajax = function () {
    var s = this;
    s.url = '';
    s.data = null;
    s.type = 'get';
    s.async = true;
    //上下文
    s.context = null;
    //是否启用请求报头
    s.contentType = true;
    //请求报头
    s.requestHeader = ['Content-Type', 'application/x-www-form-urlencoded'];
    //事件
    s.onload = null;
    s.onerror = null;
    s.oncomplete = null;
    //上传进度事件
    s.onprogress = null;
};
//请求
Utils.Ajax.prototype.request = function (json) {
    var s = this;
    for (var name in json) {
        if (json.hasOwnProperty(name) && name in s) {
            s[name] = json[name];
        }
    }
    s.type = s.type.toLowerCase();
    s.disposeFilter();
    var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    var context = s.context || xhr;
    xhr.open(s.type, s.url, s.async);
    if (s.contentType) { xhr.setRequestHeader(s.requestHeader[0], s.requestHeader[1]); }
    if (s.onload) {
        xhr.onload = function () {
            s.onload.call(context, xhr);
            xhr.upload.addEventListener('load', s.onload);
        };
    }
    if (s.oncomplete) {
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    s.oncomplete.call(context, xhr.responseText);
                } else if (s.onerror) {
                    s.onerror.call(context, xhr);
                }
            }
        };
    }
    if (s.onprogress) { xhr.upload.onprogress = s.onprogress;}
    if (s.onerror) { xhr.upload.onerror = s.onerror; }
    xhr.send(s.data);
};
//参数过滤
Utils.Ajax.prototype.disposeFilter = function () {
    var s = this;
    var resolve = Utils.getUrlParam(s.url);
    if (s.url) {
        switch (s.type) {
            case 'get':
                if (Utils.isType(s.data, 'string')) {
                    if (!resolve.param && s.data[0] !== '?') { s.data = '?' + s.data; }
                    s.url += s.data;
                }
                break;
            case 'post':
                if (s.data) {
                    if (Utils.isType(s.data, 'string')) { s.url += s.data; }
                    else { s.url = resolve.url; }
                } else {
                    s.url = resolve.url;
                    s.data = resolve.param;
                }
                break;
        }
    }
    return s;
};
Utils.ajax = new Utils.Ajax();