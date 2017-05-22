function Utils() {

};
Utils = new Utils();
//清除选中内容
Utils.clearSlct = "getSelection" in window ? function () { window.getSelection().removeAllRanges(); } : function () { document.selection.empty(); };
//解析并获取给定对象结构
Utils.getObjectStructure = function (obj, structure) {
    var seekout = true;
    var list = structure.split('.');
    for (var i = 0; i < list.length; i++) {
        if (list[i]) {
            if (Utils.isType(obj, 'object')) { obj = obj[list[i]]; }
            else { seekout = false; }
        }
    }
    return { seekout: seekout, result: obj };
};
//数字保留N位小数点
Utils.retainDigit = function (value, count) {
    var num = Number(value),
        str = num.toString(),
        abs = Math.abs(num);
    count = count || 0;
    count = Number(count);
    var index = str.indexOf('.');
    if (index > -1) {
        count += index;
        return Number(str.substring(0, count + 1));
    } else {
        return Number(str);
    }
};
//获取url指定参数
Utils.getUrlKey = function (url, name) {
    var r = RegExp('' + name + '=([^&]*)(&|$)', 'i').exec(url);
    return r ? r[1] : '';
};
//拆分url和参数
Utils.getUrlParam = function (url) {
    var i = url.indexOf('?');
    if (i == -1) {
        return { url: url, param: '' };
    } else {
        return {
            url: url.substring(0, i),
            param: i > -1 ? url.substring(i + 1, url.length) : ''
        };
    }
};
//数据类型判断
Utils.isType = function (obj, name) {
    return Object.prototype.toString.call(obj).toLowerCase() == '[object ' + name.toLowerCase() + ']';
};
//判断是否为DOM元素并返回元素类型
Utils.isHTMLElement = function (obj) {
    if (obj == document) {
        return 'document';
    }
    try {
        return /HTML(\w+)Element/.exec(Object.prototype.toString.call(obj))[1];
    } catch (e) { }
};
//对象继承
Utils.extend = function (objA, objB, param) {
    var c = objA.constructor.prototype;
    for (var name in objB.prototype) {
        if (!c[name]) {
            c[name] = objB.prototype[name];
        }
    }
    objB.apply(objA, param || []);
};
//对象附加
Utils.append = function (objA, objB) {
    for (var name in objB) {
        objA[name] = objB[name];
    }
};
//克隆对象
Utils.clone = function (obj) {
    if (obj != null && typeof obj == 'object') {
        var news = {};
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                news[name] = this.clone(obj[name]);
            }
        }
        return news;
    }
    return obj;
};
//范围内的随机数
Utils.randomRange = function (num1, num2) {
    var min = Math.min(num1, num2),
        max = Math.max(num1, num2);
    return min + Math.random() * (max - min);
};
//返回N个范围内随机不重复的整数
Utils.noRrepeatRandomRange = function (num1, num2, count) {
    var list = [];
    var result = [];
    var min = Math.min(num1, num2),
        max = Math.max(num1, num2);
    for (var i = min; i <= max; i++) {
        list.push(i);
    }
    for (i = 0; i < count; i++) {
        result.push(list.splice(Math.round(Math.random() * list.length - 1), 1)[0]);
    }
    return result;
};
//随机颜色
Utils.randomColor = function () {
    while (1) {
        var rand = Math.floor(Math.random() * 0xFFFFFF).toString(16);
        if (rand.length == 6) {
            return '#' + rand;
        }
    }
};
//取整
Utils.parseInt = function (num) {
    return (0.5 + num) << 0;
};
//浏览器是否支持touch事件
Utils.isSupportTouch = 'ontouchend' in document ? true : false;
//颜色代码转rgba数组
Utils.getColorToRgba = function (color) {
    var s = this;
    var i, res, type,
        list = [],
        rgba = [];

    var reg = /([0-9\.]+)/g;
    var hexReg = /^#([0-9a-z]+)/i;

    color.replace(/ /ig, "");

    if (hexReg.test(color)) {
        list = s.getHexToRgb(color);
    } else {
        while (res = reg.exec(color)) {
            list.push(Number(res[0]));
        }
    }
    for (var i = 0; i < 3; i++) {
        if (list[i] === undefined) {
            list[i] = 0;
        }
    }
    type = color.substring(0, 3);
    switch (type) {
        case 'hsl':
            list[0] = Math.max(Math.min(list[0], 360), 0);
            list[1] = Math.max(Math.min(list[1], 100), 0) / 100;
            list[2] = Math.max(Math.min(list[2], 100), 0) / 100;
            rgba = Utils.getHslToRgb(list[0], list[1], list[2]);
            break;
        case 'hsb':
            list[0] = Math.max(Math.min(list[0], 360), 0);
            list[1] = Math.max(Math.min(list[1], 100), 0) / 100;
            list[2] = Math.max(Math.min(list[2], 100), 0) / 100;
            rgba = Utils.getHsbToRgb(list[0], list[1], list[2]);
            break;
        case 'rgb':
        default:
            list[0] = Math.max(Math.min(list[0], 255), 0);
            list[1] = Math.max(Math.min(list[1], 255), 0);
            list[2] = Math.max(Math.min(list[2], 255), 0);
            rgba = list;
            break;
    }
    if (list[3] === undefined || isNaN(list[3])) {
        list[3] = 1;
    }
    rgba[3] = Math.max(Math.min(list[3], 1), 0);
    return rgba;
};
//16进制颜色转10进制rgba
Utils.getHexToRgb = function (color) {
    if (color[0] == '#') {
        color = color.substring(1);
    }
    if (color.length === 3) {
        color += color;
    }
    color = parseInt(color, 16);
    return [color >> 16 & 0xff, color >> 8 & 0xff, color & 0xff];
};
//hsl颜色值转换为rgb
Utils.getHslToRgb = function (h, s, l) {
    var r, g, b;
    if (s == 0) {
        r = g = b = l;
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};
//hsb颜色值转换为rgb
Utils.getHsbToRgb = function (h, s, b) {
    var rgb = [];
    var i, x, offset;
    for (offset = 240, i = 0; i < 3; i++, offset -= 120) {
        x = Math.abs((h + offset) % 360 - 240);
        if (x <= 60) {
            rgb[i] = 255;
        } else if (60 < x && x < 120) {
            rgb[i] = ((1 - (x - 60) / 60) * 255);
        } else {
            rgb[i] = 0;
        }
    }
    for (i = 0; i < 3; i++) {
        rgb[i] += (255 - rgb[i]) * (1 - s);
    }
    for (i = 0; i < 3; i++) {
        rgb[i] *= b;
    }
    for (i = 0; i < 3; i++) {
        rgb[i] = Math.round(rgb[i]);
    }
    return rgb;
};
//rgb颜色转16进制
Utils.getRgbToHex = function (r, g, b) {
    var hex = ((r << 16) | (g << 8) | b).toString(16);
    while (hex.length < 6) {
        hex = '0' + hex;
    }
    return hex;
};
//rgb颜色值转换为hsl
Utils.getRgbToHsl = function (r, g, b) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max == min) {
        h = s = 0;
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
};
//rgb颜色值转换为hsb
Utils.getRgbToHsb = function (r, g, b) {
    var i, j, tmp;
    var hsb = [];
    var rgb = [r, g, b];
    var realign = rgb.clone();
    var maxIndex = 0,
        minIndex = 0;
    for (i = 0; i < 2; i++) {
        for (j = 0; j < 2 - i; j++)
            if (realign[j] > realign[j + 1]) {
                tmp = realign[j + 1];
                realign[j + 1] = realign[j];
                realign[j] = tmp;
            }
    }
    for (i = 0; i < 3; i++) {
        if (realign[0] == rgb[i]) minIndex = i;
        if (realign[2] == rgb[i]) maxIndex = i;
    }
    hsb[2] = realign[2] / 255;
    hsb[1] = 1 - realign[0] / realign[2];
    hsb[0] = maxIndex * 120 + 60 * (realign[1] / hsb[1] / realign[2] + (1 - 1 / hsb[1])) * ((maxIndex - minIndex + 3) % 3 == 1 ? 1 : -1);
    hsb[0] = (hsb[0] + 360) % 360;
    for (i = 0; i < 3; i++) {
        if (isNaN(hsb[i])) {
            hsb[i] = 0;
        }
    }
    return hsb;
};
//贝塞尔曲线算法 t=时间,d=控制点列表,第一个为起点,最后一个为终点[[x,y],...]
Utils.bezier = function (t, d) {
    var l = d.length, n = l - 1;
    for (var k = 0, x = 0, y = 0, v; k < l; k++) {
        v = Utils.Math.factorial(n) / (Utils.Math.factorial(k) * Utils.Math.factorial(n - k)) * Math.pow(t, k) * Math.pow(1 - t, n - k);
        x += d[k][0] * v;
        y += d[k][1] * v;
    }
    return [x, y];
};
//汉字转UTF-8编码
Utils.hzToUtf = function (string) {
    return escape(string).replace(/%u/g, '\\u');
};
//UTF-8编码转汉字
Utils.utfToHz = function (utf) {
    return unescape(utf.replace(/\\u/, '%u'));
};
//设置Cookie
Utils.setCookie = function (name, value) {
    var exp = new Date();
    var Days = 30;
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};
//获取Cookie
Utils.getCookie = function (name) {
    var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
};
//删除Cookie
Utils.delCookie = function (name) {
    var exp = new Date();
    var cval = Utils.getCookie(name);
    exp.setTime(exp.getTime() - 1);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }
};
//浏览器信息
Utils.moz = (function () {
    var browser, version,
        docu = document,
        element = docu.documentElement,
        u = navigator.userAgent.toLowerCase(),
        ieReg = /(msie\s|trident.*rv:)([\w]+).*$/,
        foxReg = /(firefox)\/([\w.]+)/,
        opeReg = /(opera).+version\/([\w.]+)$/,
        chrReg = /(chrome)\/([\w.]+)/,
        safReg = /version\/([\w.]+).*(safari)$/,
        moz = {
            width: function () { return element.clientWidth; },
            height: function () { return element.clientHeight; },
        };
    (ieReg.test(u) && (browser = 'ie')) || foxReg.test(u) || opeReg.test(u) || chrReg.test(u) || safReg.test(u);
    //浏览器
    moz.browser = browser || RegExp.$1 || '';
    //浏览器版本
    moz.version = RegExp.$2 || 0;
    //内核
    moz.kernel = (function () {
        var kernel = ['trident', 'presto', 'applewebkit', 'gecko', 'khtml'];
        for (var i = 0; i < kernel.length; i++) {
            if (u.indexOf(kernel[i]) > -1) {
                return kernel[i];
            }
        }
    })();
    //是否为移动终端
    moz.mobile = !!u.match(/applewebkit.*mobile.*/);
    //ios终端
    moz.ios = !!u.match(/\(i[^;]+;( u;)? cpu.+mac os x/);
    //android终端或uc浏览器
    moz.android = u.indexOf('android') > -1 || u.indexOf('linux') > -1;
    //是否为iPhone或者QQHD浏览器
    moz.iPhone = u.indexOf('iphone') > -1;
    //是否iPad
    moz.iPad = u.indexOf('ipad') > -1;
    //是否web应该程序，没有头部与底部
    moz.webApp = u.indexOf('safari') == -1;
    //语言
    moz.language = (navigator.browserLanguage || navigator.language).toLowerCase();
    //全屏显示的网页元素
    moz.fullscreenElement = function () {
        return docu.fullscreenElement || docu.fullScreenElement || docu.mozFullScreenElement || docu.webkitFullscreenElement;
    };
    //浏览器是否全屏显示
    moz.isFullscreen = function () {
        return docu.fullscreen || docu.fullScreen || docu.mozFullScreen || docu.webkitIsFullScreen || false;
    };
    //浏览器全屏显示
    moz.requestFullscreen = function () {
        if (element.requestFullscreen) {//W3C
            element.requestFullscreen();
        } else if (element.requestFullScreen) {// mozilla草案
            element.requestFullScreen();
        } else if (element.mozRequestFullScreen) {// Firefox
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {// Webkit
            element.webkitRequestFullScreen();
        } else if (element.msRequestFullScreen) {// IE
            element.msRequestFullScreen();
        }
    };
    //浏览器退出全屏
    moz.exitFullscreen = function () {
        if (docu.exitFullscreen) {
            docu.exitFullscreen();
        } else if (docu.cancelFullScreen) {
            docu.cancelFullScreen();
        } else if (docu.mozCancelFullScreen) {
            docu.mozCancelFullScreen();
        } else if (docu.webkitCancelFullScreen) {
            docu.webkitCancelFullScreen();
        } else if (docu.msCancelFullScreen) {
            docu.msCancelFullScreen();
        }
    };
    //鼠标锁
    moz.lockMouse = function () {
        if (element.requestPointerLock) {
            element.requestPointerLock();
        } else if (element.mozRequestPointerLock) {
            element.mozRequestPointerLock();
        } else if (element.webkitRequestPointerLock) {
            element.webkitRequestPointerLock();
        } else if (element.msRequestPointerLock) {
            element.msRequestPointerLock();
        }
    };
    //解除鼠标锁
    moz.unlockMouse = function () {
        if (docu.exitPointerLock) {
            docu.exitPointerLock();
        } else if (docu.mozExitPointerLock) {
            docu.mozExitPointerLock();
        } else if (docu.webkitExitPointerLock) {
            docu.webkitExitPointerLock();
        } else if (docu.msExitPointerLock) {
            docu.msExitPointerLock();
        }
    };
    return moz;
})();
//禁止选中文字
Utils.DisableSelectstart = function (obj, is) {
    obj = obj.nodeType ? obj : document;
    if (Utils.moz.browser == 'firefox') {
        function preventDefault(e) {
            e.preventDefault();
        };
        is ? obj.removeEventListener('mousedown', preventDefault) : obj.addEventListener('mousedown', preventDefault);
    }
    else {
        is ? obj.onselectstart = null : obj.onselectstart = function () {
            return false;
        };
    }
};
//禁用鼠标右键
Utils.DisableMouseRight = function (obj, is) {
    obj = obj.nodeType ? obj : document.body;
    is ? obj.oncontextmenu = null : obj.oncontextmenu = function () {
        return false;
    }
};
//禁用鼠标拖拽
Utils.DisableDragStart = function (obj, is) {
    is ? document.ondragstart = null : document.ondragstart = function () {
        return false;
    };
};
//事件兼容处理
Utils.compEventPcorMobile = function (type) {
    var mouse = ['mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout'],
        touch = ['touchstart', 'touchend', 'touchmove'];
    type = type.toLowerCase();
    if (Utils.isSupportTouch) {
        switch (type) {
            case mouse[0]:
                type = touch[0];
                break;
            case mouse[1]:
                type = touch[1];
                break;
            case mouse[2]:
                type = touch[2];
                break;
            case mouse[3]:
                type = touch[0];
                break;
            case mouse[4]:
                type = touch[1];
                break;
        }
    } else {
        switch (type) {
            case touch[0]:
                type = mouse[0];
                break;
            case touch[1]:
                type = mouse[1];
                break;
            case touch[2]:
                type = mouse[2];
                break;
        }
    }
    return type;
};
//浏览器前缀兼容处理
Utils.browserPrefixCompatible = function (name, obj) {
    var jointName = '';
    var prefix = ['', 'webkit', 'moz', 'o', 'ms'];
    for (var i = 0; i < prefix.length; i++) {
        if (prefix[i]) {
            name = name[0].toUpperCase() + name.substring(1);
        } else {
            name = name[0].toLowerCase() + name.substring(1);
        }
        jointName = prefix[i] + name;
        if (jointName in obj) {
            return jointName;
        }
    }
};
//获取两点之间所连接的直线上所有的坐标点
Utils.getTwoAllPoint = function (x1, y1, x2, y2) {
    var list = [],
        r = Math.atan2(y2 - y1, x2 - x1),
        cos = Math.cos(r),
        sin = Math.sin(r),
        len = Utils.Math.dotPitch(x1, y1, x2, y2);
    for (var i = 0; i <= len; i++) {
        list.push([i * cos + x1, i * sin + y1]);
    }
    return list;
};
//获取一条贝塞尔曲线上的所有点
Utils.getBezierAllPoint = function (bez) {
    var i, j, enddot, linePoint, length,
        amend = [],
        point = [],
        bezPoint = [];
    for (i = 0; i <= 1; i += 0.02) {
        bezPoint.push(Utils.bezier(i, bez));
        i = Number(i.toFixed(2));
    }
    enddot = bez[0];
    length = bezPoint.length;
    for (i = 1; i < length; i++) {
        linePoint = Utils.getTwoAllPoint(bezPoint[i - 1][0], bezPoint[i - 1][1], bezPoint[i][0], bezPoint[i][1]);
        Array.prototype.push.apply(point, linePoint);
    }
    return point;
};
//获取一个圆形上的一点
Utils.getCirclePoint = function (x, y, radiu, angle) {
    var rad = (2 * Math.PI / 360) * angle;
    return {
        x: x + Math.sin(rad) * radiu,
        y: y - Math.cos(rad) * radiu
    };
};
//常用数学
Utils.Math = {
    //阶乘
    factorial: function (n) {
        for (var i = 1, v = 1; i <= n; i++) {
            v *= i;
        }
        return v;
    },
    //获取两点间的距离
    dotPitch: function (x1, y1, x2, y2) {
        var w = x2 - x1,
            h = y2 - y1;
        return Math.sqrt(w * w + h * h);
    }
};//ajax
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
    if (s.onprogress) { xhr.upload.onprogress = s.onprogress; }
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
Utils.ajax = new Utils.Ajax();//动画函数兼容
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window[Utils.browserPrefixCompatible('requestAnimationFrame', window)] ||
                                   function (fun) { return setTimeout(fun, 17); };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = window[Utils.browserPrefixCompatible('cancelAnimationFrame', window)] ||
                                  function (e) { return clearTimeout(e); };;
}
//html
if (!document.html) {
    document.html = document.querySelector('html');
}
//数组克隆
if (!Array.clone) {
    Array.prototype.clone = function () {
        return [].concat(this);
    };
}
//打乱数组顺序
if (!Array.chaosOrder) {
    Array.prototype.chaosOrder = function () {
        var s = this,
            arr = s.clone();
        for (var i = 0; i < s.length; i++) {
            s[i] = arr.splice(parseInt(Math.random() * arr.length - 1), 1)[0];
        }
        return s;
    };
}
//将数组各个项转换成数字类型
if (!Array.toNumber) {
    Array.prototype.toNumber = function () {
        var s = this;
        for (var i = 0; i < s.length; i++) {
            s[i] = Number(s[i]);
        }
        return s;
    };
}
//检索数组中第一个给定元素的索引值，对象结构（'a.b.c'）
if (!Array.indexOfbeefup) {
    Array.prototype.indexOfbeefup = function (value, from, structure) {
        var s = this;
        from = from || 0;
        for (var i = from; i < s.length; i++) {
            if (structure) {
                var result = Utils.getObjectStructure(s[i], structure);
                if (result.seekout && result.result === value) {
                    return i;
                }
            } else {
                if (s[i] === value) {
                    return i;
                }
            }
        }
        return -1;
    };
};
//事件兼容处理
(function () {
    function Touch(json) {
        var s = this;
        s.clientX = 0;
        s.clientY = 0;
        s.force = 0;
        s.identifier = 0;
        s.pageX = 0;
        s.pageY = 0;
        s.radiusX = 0;
        s.radiusY = 0;
        s.rotationAngle = 0;
        s.screenX = 0;
        s.screenY = 0;
        s.target = 0;
        for (var name in json) {
            if (s.hasOwnProperty(name) && name in s) {
                s[name] = json[name];
            }
        }
    };
    Touch.prototype.constructor = Touch;
    function TouchEvent(json) {
        var s = this;
        s.altKey = null;
        s.bubbles = null;
        s.cancelBubble = null;
        s.cancelable = null;
        s.changedTouches = null;
        s.clientX = null;
        s.clientY = null;
        s.ctrlKey = null;
        s.currentTarget = null;
        s.defaultPrevented = null;
        s.detail = null;
        s.eventPhase = null;
        s.isTrusted = null;
        s.isTrusted = null;
        s.metaKey = null;
        s.path = null;
        s.returnValue = null;
        s.shiftKey = null;
        s.srcElement = null;
        s.target = null;
        s.targetTouches = null;
        s.timeStamp = null;
        s.touches = null;
        s.type = null;
        s.view = null;
        s.which = null;
        for (var name in json) {
            if (s.hasOwnProperty(name) && name in s) {
                s[name] = json[name];
            }
        }
        s.baseEvent = json;
    };
    TouchEvent.prototype.constructor = TouchEvent;
    function MouseEvent(json) {
        var s = this;
        s.altKey = null;
        s.bubbles = null;
        s.button = null;
        s.buttons = null;
        s.cancelBubble = null;
        s.cancelable = null;
        s.changedTouches = null;
        s.clientX = null;
        s.clientY = null;
        s.ctrlKey = null;
        s.currentTarget = null;
        s.defaultPrevented = null;
        s.detail = null;
        s.eventPhase = null;
        s.fromElement = null;
        s.isTrusted = null;
        s.isTrusted = null;
        s.layerX = null;
        s.layerY = null;
        s.metaKey = null;
        s.movementX = null;
        s.movementY = null;
        s.offsetX = null;
        s.offsetY = null;
        s.pageX = null;
        s.pageY = null;
        s.path = null;
        s.relatedTarget = null;
        s.returnValue = null;
        s.screenX = null;
        s.screenY = null;
        s.shiftKey = null;
        s.srcElement = null;
        s.target = null;
        s.timeStamp = null;
        s.toElement = null;
        s.type = null;
        s.view = null;
        s.which = null;
        s.x = null;
        s.y = null;
        for (var name in json) {
            if (s.hasOwnProperty(name) && name in s) {
                s[name] = json[name];
            }
        }
        s.baseEvent = json;
    };
    MouseEvent.prototype.constructor = MouseEvent;
    TouchEvent.prototype.preventDefault = MouseEvent.prototype.preventDefault = function () {
        this.baseEvent.preventDefault();
    };
    TouchEvent.prototype.stopPropagation = MouseEvent.prototype.stopPropagation = function () {
        this.baseEvent.stopPropagation();
    };
    //移动端点击事件模拟
    var TouchClick = function (target, callback) {
        var s = this;
        s.target = target;
        s.callback = callback;
        s.isDown = false;
        s.touch = [];
        s.touchstart = s.touchstart.bind(s);
        s.touchend = s.touchend.bind(s);
        s.touchmove = s.touchmove.bind(s);
        s.on();
    };
    TouchClick.prototype = {
        touchstart: function (e) {
            var s = this;
            var touch = new Touch(e.changedTouches[0]);
            s.touch.push({
                beyond: false,
                identifier: touch.identifier,
                changedTouches: touch
            });
            s.isDown = true;
        },
        touchmove: function (e) {
            var s = this;
            var index;
            var touch = e.changedTouches;
            if (s.isDown) {
                for (var i = 0; i < touch.length; i++) {
                    index = s.touch.indexOfbeefup(touch[i].identifier, 0, 'identifier');
                    if (index > -1) {
                        if (Math.abs(touch[i].clientX - s.touch[index].changedTouches.clientX) >= 10 || Math.abs(touch[i].clientY - s.touch[index].changedTouches.clientY) >= 10) {
                            s.touch[i].beyond = true;
                        }
                    }
                }
            }
        },
        touchend: function (e) {
            var s = this;
            if (s.isDown) {
                var index = s.touch.indexOfbeefup(e.changedTouches[0].identifier, 0, 'identifier');
                if (index > -1) {
                    if (!s.touch[index].beyond) {
                        var newEvent = new TouchEvent(e);
                        newEvent.type = 'click';
                        newEvent.clientX = e.changedTouches[0].clientX;
                        newEvent.clientY = e.changedTouches[0].clientY;
                        if (s.callback) {
                            s.callback.call(s.target, newEvent);
                        }
                    }
                    s.touch.splice(index, 1);
                }
                if (s.touch.length <= 0) {
                    s.isDown = false;
                }
                e.preventDefault();
            }
        },
        on: function () {
            var s = this;
            s.target.addEventListener('touchstart', s.touchstart);
            s.target.addEventListener('touchend', s.touchend);
            s.target.addEventListener('touchmove', s.touchmove);
        },
        off: function () {
            var s = this;
            s.target.removeEventListener('touchstart', s.touchstart);
            s.target.removeEventListener('touchend', s.touchend);
            s.target.removeEventListener('touchmove', s.touchmove);
        }
    };
    //普通事件处理
    var NormalEvent = function (target, type, callback) {
        var s = this;
        s.type = type;
        s.target = target;
        s.callback = callback;
        s.triggerCallback = s.triggerCallback.bind(s);
        s.on();
    };
    NormalEvent.prototype = {
        triggerCallback: function (e) {
            var s = this;
            var newEvent = e;
            if (Utils.isType(e, 'TouchEvent')) {
                newEvent = new TouchEvent(e);
                newEvent.clientX = e.changedTouches[0].clientX;
                newEvent.clientY = e.changedTouches[0].clientY;
            } else if (Utils.isType(e, 'MouseEvent')) {
                newEvent = new MouseEvent(e);
                newEvent.changedTouches = [];
                newEvent.changedTouches.push(new Touch(e));
            }
            s.callback(newEvent);
        },
        on: function () {
            var s = this;
            s.target.addEventListener(s.type, s.triggerCallback);
        },
        off: function () {
            var s = this;
            s.target.removeEventListener(s.type, s.triggerCallback);
        }
    };
    Window.prototype.on = Document.prototype.on = HTMLElement.prototype.on = function (type, callback) {
        var s = this;
        type = Utils.compEventPcorMobile(type);
        if (type == 'click' && Utils.isSupportTouch) {
            if (!s.__TouchClick__) {
                s.__TouchClick__ = [];
            }
            s.__TouchClick__.push(new TouchClick(s, callback));
            s.addEventListener(type, callback);
        } else {
            if (!s.__NormalEvent__) {
                s.__NormalEvent__ = [];
            }
            s.__NormalEvent__.push(new NormalEvent(s, type, callback));
        }
    };
    Window.prototype.off = Document.prototype.off = HTMLElement.prototype.off = function (type, callback) {
        var s = this;
        var i;
        type = Utils.compEventPcorMobile(type);
        if (type == 'click' && Utils.isSupportTouch) {
            if (s.__TouchClick__ && s.__TouchClick__.length) {
                for (i = 0; i < s.__TouchClick__.length; i++) {
                    if (s.__TouchClick__[i].callback === callback) {
                        s.__TouchClick__[i].off();
                        break;
                    }
                }
            }
            s.removeEventListener(type, callback);
        } else {
            if (s.__NormalEvent__ && s.__NormalEvent__.length) {
                for (i = 0; i < s.__NormalEvent__.length; i++) {
                    if (s.__NormalEvent__[i].type === type && s.__NormalEvent__[i].callback === callback) {
                        s.__NormalEvent__[i].off();
                        break;
                    }
                }
            }
        }
    };
})(); function Game() {
    var s = this;
    var context = document.createElement('canvas').getContext('2d');
    //图片平滑处理函数名
    s.smoothProperty = Utils.browserPrefixCompatible('imageSmoothingEnabled', context);
    //版本
    s.version = '1.0';
    //设备像素比
    s.devicePixelRatio = window.devicePixelRatio || 1;
    //全局默认渲染选项
    s.defaultRenderOptions = {
        //分辨率
        resolution: s.devicePixelRatio,
        //擦除画布时使用的透明度
        clearAlpha: 1,
        //渲染前擦除画布
        clearBeforeRender: true
    };
    //混合模式
    s.blendModesCanvas = {
        COLOR: 'color',
        COLOR_BURN: 'color-burn',
        COLOR_DODGE: 'color-dodge',
        DARKEN: 'darken',
        DIFFERENCE: 'difference',
        EXCLUSION: 'exclusion',
        HARD_LIGHT: 'hard-light',
        HUE: 'hue',
        LIGHTEN: 'lighten',
        LIGHTER: 'lighter',
        LUMINOSITY: 'luminosity',
        MULTIPLY: 'multiply',
        NORMAL: 'source-over',
        OVERLAY: 'overlay',
        SATURATION: 'saturation',
        SCREEN: 'screen',
        SOFT_LIGHT: 'soft-light'
    };
};
Game = new Game();//事件
Game.Event = function () {
    var s = this;
    //事件类型
    s.type = null;
    //冒泡路径
    s.path = null;
    //标记触发该事件的舞台
    s.stage = null;
    //事件的目标节点
    s.target = null;
    //原始DOM事件
    s.originalEvent = null;
    //时间戳
    s.timeStamp = Date.now();
    //事件阶段
    s.eventPhase = null;
    //监听器触发事件的对象
    s.currentTarget = null;
    //标记该事件是否会向上层元素冒泡
    s.bubbles = false;
    //标记该事件的事件冒泡是否被停止
    s.propagationStop = false;
    //标记该事件的默认动作是否可以被取消
    s.cancelable = false;
    //标记该事件的默认动作是否被取消
    s.defaultPrevented = false;
};
Game.Event.prototype.constructor = Game.Event;
//初始化
Game.Event.prototype.init = function (json) {
    var s = this;
    for (var name in json) {
        if (s.hasOwnProperty(name) && name in s) {
            s[name] = json[name];
        }
    }
    return s;
};
//阻止浏览器默认动作
Game.Event.prototype.preventDefault = function () {
    var s = this;
    s.defaultPrevented = true;
    s.originalEvent.preventDefault();
};
//停止事件传播
Game.Event.prototype.stopPropagation = function () {
    var s = this;
    s.propagationStop = true;
    s.originalEvent.stopPropagation();
};//触点类
Game.Touch = function () {
    var s = this;
    s.clientX = 0;
    s.clientY = 0;
    s.force = 0;
    s.identifier = 0;
    s.screenX = 0;
    s.screenY = 0;
    s.target = null;
};
Game.Touch.prototype = Object.create(Game.Event.prototype);
Game.Touch.prototype.constructor = Game.Touch;//交互事件
Game.InteractionEvent = function () {
    var s = this;
    Game.Event.call(s);
    //标记按键是否按下
    s.altKey = null;
    s.ctrlKey = null;
    s.metaKey = null;
    s.shiftKey = null;
    //按下键的索引值
    s.which = null;
    //离开或者进入目标的触点列表
    s.touches = null;
    //相对于画布显示区域的坐标
    s.clientX = null;
    s.clientY = null;
};
Game.InteractionEvent.prototype = Object.create(Game.Event.prototype);
Game.InteractionEvent.prototype.constructor = Game.InteractionEvent;//交互事件
Game.KeyboardEvent = function () {
    var s = this;
    Game.Event.call(s);
    //标记按键是否按下
    s.altKey = null;
    s.ctrlKey = null;
    s.metaKey = null;
    s.shiftKey = null;
    //按下键的索引值
    s.which = null;
    s.keyCode = 0;
    s.keyIdentifier = '';
};
Game.KeyboardEvent.prototype = Object.create(Game.Event.prototype);
Game.KeyboardEvent.prototype.constructor = Game.KeyboardEvent;//交互事件
Game.WheelEvent = function () {
    var s = this;
    Game.Event.call(s);
    //标记按键是否按下
    s.altKey = null;
    s.ctrlKey = null;
    s.metaKey = null;
    s.shiftKey = null;
    //按下键的索引值
    s.which = null;
    //相对于画布显示区域的坐标
    s.clientX = null;
    s.clientY = null;
    //滚动方向
    s.wheelDeltaX = 0;
    s.wheelDeltaY = 0;
    s.wheelDeltaZ = 0;
};
Game.WheelEvent.prototype = Object.create(Game.Event.prototype);
Game.WheelEvent.prototype.constructor = Game.WheelEvent;//监听器
Game.Listeners = function () { };
//注册监听器
Game.Listeners.prototype.register = function (object) {
    var s = this;
    if (!object._GameRegistered) {
        object._GameRegistered = true;
        object._GameListeners = object._GameListeners || {};
        object.dispatchEvent = s.dispatchEvent.bind(object);
        object.on = object.addEventListener = s.addEventListener.bind(object);
        object.off = object.removeEventListener = s.removeEventListener.bind(object);
    }
};
//删除监听器
Game.Listeners.prototype.remove = function (object) {
    var s = this;
    object._GameRegistered = false;
    object._GameListeners = null;
    object.dispatchEvent = null;
    object.on = object.addEventListener = null;
    object.off = object.removeEventListener = null;
};
//事件派送
Game.Listeners.prototype.dispatchEvent = function (type, data, phase) {
    var s = this;
    phase = phase || 1;
    type = type.toLowerCase();
    if (s._GameListeners[phase]) {
        var list = s._GameListeners[phase][type];
        if (list) {
            list.forEach(function (item) {
                item.call(s, data);
            });
        }
    }
};
//添加事件监听
Game.Listeners.prototype.addEventListener = function (type, callback, phase) {
    var s = this;
    phase = phase || 1;
    type = type.toLowerCase();
    s._GameListeners[phase] = s._GameListeners[phase] || {};
    s._GameListeners[phase][type] = s._GameListeners[phase][type] || [];
    s._GameListeners[phase][type].push(callback);
};
//删除事件监听
Game.Listeners.prototype.removeEventListener = function (type, callback, phase) {
    var s = this;
    phase = phase || 1;
    type = type.toLowerCase();
    if (s._GameListeners[phase] && s._GameListeners[phase][type]) {
        var list = s._GameListeners[phase][type];
        if (typeof callback === 'string' && callback.toLowerCase() === 'all') {
            list.length = 0;
        } else {
            var i = list.indexOf(callback);
            if (i !== -1) { list.splice(i, 1); }
        }
    }
};
Game.Listeners = new Game.Listeners();//交互处理
Game.Interaction = function (stage) {
    var s = this;
    //舞台
    s.stage = stage;
    //渲染器
    s.renderer = null;
    //标记是否按下
    s.isAreaDown = false;
    //记录按下时的目标精灵
    s.hitTargetSprite = null;
    //记录按下时的坐标位置
    s.hitTargetPoint = new Game.Point();
    //记录按下的时间
    s.hitTime = 0;
    //记录上一次单击的时间
    s.lastClickTime = 0;
    //当前获得焦点的精灵
    s.currentFocusSprite = null;
    //设置函数上下文
    s.onDown = s.onDown.bind(s);
    s.onMove = s.onMove.bind(s);
    s.onUp = s.onUp.bind(s);
    s.onKeyDown = s.onKeyDown.bind(s);
    s.onKeyUp = s.onKeyUp.bind(s);
    s.onMouseWheel = s.onMouseWheel.bind(s);

    s.setFocus(stage);
};
Game.Interaction.prototype.constructor = Game.Interaction;
//销毁
Game.Interaction.prototype.destroy = function () {
    var s = this;
    s.onDown = null;
    s.onMove = null;
    s.onUp = null;
    s.onKeyDown = null;
    s.onKeyUp = null;
    s.onMouseWheel = null;
    window.off('mousemove', s.onMove);
    window.off('mouseup', s.onUp);
    s.renderer.canvas.off('mousedown', s.onDown);
    s.renderer.canvas.off('mousewheel', s.onMouseWheel);
    s.renderer.canvas.off('keydown', s.onKeyDown);
    s.renderer.canvas.off('keyup', s.onKeyUp);
    s.renderer.canvas.off('click', s.renderer.canvas._GameFocus);
    s.renderer.canvas.off('focus', s.renderer.canvas._GameFocus);
    s.renderer.canvas.off('blur', s.renderer.canvas._GameBlur);
    s.renderer.canvas.setAttribute('tabindex', '');
    s.renderer.canvas._GameFocus = null;
    s.renderer.canvas._GameBlur = null;
    s.renderer.canvas.removeEventListener('DOMMouseScroll', s.onMouseWheel);
    Utils.DisableMouseRight(s.renderer.canvas, true);
    s.stage = null;
    s.renderer = null;
};
//设置当前焦点
Game.Interaction.prototype.setFocus = function (sprite) {
    var s = this;
    if (sprite) {
        s.currentFocusSprite = sprite;
    }
};
//设置渲染器
Game.Interaction.prototype.setRenderer = function (renderer) {
    var s = this;
    if (!renderer.canvas.parentNode) {
        throw new Error('必须将"Renderer.canvas"加入到DOM环境中!');
    }
    if (s.renderer) {
        if (s.renderer !== renderer) {
            //删除事件
            window.off('mousemove', s.onMove);
            window.off('mouseup', s.onUp);
            s.renderer.canvas.off('mousedown', s.onDown);
            s.renderer.canvas.off('mousewheel', s.onMouseWheel);
            s.renderer.canvas.off('keydown', s.onKeyDown);
            s.renderer.canvas.off('keyup', s.onKeyUp);
            s.renderer.canvas.off('mousedown', s.renderer.canvas._GameFocus);
            s.renderer.canvas.off('focus', s.renderer.canvas._GameFocus);
            s.renderer.canvas.off('blur', s.renderer.canvas._GameBlur);
            s.renderer.canvas.setAttribute('tabindex', '');
            s.renderer.canvas._GameFocus = null;
            s.renderer.canvas._GameBlur = null;
            s.renderer.canvas.removeEventListener('DOMMouseScroll', s.onMouseWheel);
            Utils.DisableMouseRight(s.renderer.canvas, true);
        } else {
            return;
        }
    }
    s.renderer = renderer;
    s.renderer.canvas.setAttribute('tabindex', '0');
    s.renderer.canvas._GameFocus = function () {
        this.focus();
        this.style.opacity = '1';
    }.bind(s.renderer.canvas);
    s.renderer.canvas._GameBlur = function () {
        this.style.opacity = '.5';
    }.bind(s.renderer.canvas);
    //绑定事件
    window.on('mousemove', s.onMove);
    window.on('mouseup', s.onUp);
    s.renderer.canvas.on('mousedown', s.onDown);
    s.renderer.canvas.on('mousewheel', s.onMouseWheel);
    s.renderer.canvas.on('keydown', s.onKeyDown);
    s.renderer.canvas.on('keyup', s.onKeyUp);
    s.renderer.canvas.on('mousedown', s.renderer.canvas._GameFocus);
    s.renderer.canvas.on('focus', s.renderer.canvas._GameFocus);
    s.renderer.canvas.on('blur', s.renderer.canvas._GameBlur);
    s.renderer.canvas.focus();
    s.renderer.canvas.addEventListener('DOMMouseScroll', s.onMouseWheel);
    Utils.DisableMouseRight(s.renderer.canvas, false);
};
//创建事件对象
Game.Interaction.prototype.createEvent = function (json) {
    var s = this;
    //获取传播路径
    var path = [];
    var temp = json.object;
    while (temp) {
        path.push(temp);
        temp = temp.parent;
    }
    json.path = path;
    json.stage = s.stage;
    json.target = json.object;
    json.currentTarget = null;
    //创建事件对象
    var interaEvent = new Game.InteractionEvent();
    interaEvent.init(json.originalEvent).init(json);
    return interaEvent;
};
//派发事件
Game.Interaction.prototype.dispatchEvent = function (interaEvent) {
    var path = interaEvent.path;
    //派送捕获阶段事件
    interaEvent.eventPhase = 1;
    for (var i = path.length - 1; i >= 0; i--) {
        interaEvent.currentTarget = path[i];
        path[i].dispatchEvent(interaEvent.type, interaEvent, interaEvent.eventPhase);
        if (interaEvent.propagationStop) {
            interaEvent.propagationStop = false;
            break;
        }
    }
    //派送冒泡阶段事件
    interaEvent.eventPhase = 2;
    for (i = 0; i < path.length; i++) {
        interaEvent.currentTarget = path[i];
        path[i].dispatchEvent(interaEvent.type, interaEvent, interaEvent.eventPhase);
        if (interaEvent.propagationStop) {
            interaEvent.propagationStop = false;
            break;
        }
    }
};
//判断对象是否包含坐标
Game.Interaction.prototype.containsPosition = function (sprite, x, y) {
    var s = this;
    var object;
    var isContains;
    if (sprite.getBounds().contains(x, y)) {
        isContains = true;
        object = sprite.parent;
        while (object) {
            if (!object.getBounds().contains(x, y)) {
                isContains = false;
                break;
            }
            object = object.parent;
        }
    }
    return isContains;
};
//获取舞台中所有显示对象
Game.Interaction.prototype.getDisplayObject = function () {
    var s = this;
    var list = [];
    //获取舞台中所有子孙显示对象
    !function (object) {
        for (var i = 0; i < object.children.length; i++) {
            if (object.children[i].visible) {
                list.push(object.children[i]);
                if (object.children[i].children) {
                    arguments.callee(object.children[i]);
                }
            }
        }
    }(s.stage);
    list.splice(0, 0, Game.Window, s.stage);
    return list;
};
//按下
Game.Interaction.prototype.onDown = function (e) {
    var s = this;
    var interaEvent;
    var touches = [];
    var clientRect = s.renderer.canvas.getBoundingClientRect();
    var clientX = e.clientX - clientRect.left;
    var clientY = e.clientY - clientRect.top;
    touches[0] = new Game.Touch().init(e.changedTouches[0]);
    touches[0].clientX = clientX;
    touches[0].clientY = clientY;
    var list = s.getDisplayObject();
    for (var i = list.length - 1; i >= 0; i--) {
        if (s.containsPosition(list[i], clientX, clientY)) {
            //派送down(按下)事件
            interaEvent = s.createEvent({
                type: 'down',
                object: list[i],
                touches: touches,
                clientX: clientX,
                clientY: clientY,
                originalEvent: e
            });
            s.dispatchEvent(interaEvent);
            break;
        }
    }
    if (interaEvent) {
        s.hitTime = Date.now();
        s.hitTargetSprite = interaEvent.path[0];
        s.hitTargetPoint.set(interaEvent.clientX, interaEvent.clientY);
    }
    if (/mouse/i.test(e.type)) { s.isAreaDown = true; }
    if (/touch/i.test(e.type)) {
        if (interaEvent) {
            s.isAreaDown = true;
            interaEvent.path[0]._over = true;
            //派送over(进入)事件
            interaEvent = s.createEvent({
                type: 'over',
                object: interaEvent.path[0],
                touches: touches,
                clientX: clientX,
                clientY: clientY,
                originalEvent: e
            });
            s.dispatchEvent(interaEvent);
        }
    }
    if (e.target === s.renderer.canvas) { e.preventDefault(); }
};
//移动
Game.Interaction.prototype.onMove = function (e) {
    var s = this;
    var i, j;
    var target;
    var clientX;
    var clientY;
    var interaEvent;
    var touches = [];
    var clientRect = s.renderer.canvas.getBoundingClientRect();
    for (i = 0; i < e.changedTouches.length; i++) {
        touches[i] = new Game.Touch().init(e.changedTouches[i]);
        touches[i].clientX -= clientRect.left;
        touches[i].clientY -= clientRect.top;
    }
    var list = s.getDisplayObject();
    for (i = 0; i < touches.length; i++) {
        clientX = touches[i].clientX;
        clientY = touches[i].clientY;
        //捕捉第一个包涵该点的精灵
        for (j = list.length - 1; j >= 0; j--) {
            if (s.containsPosition(list[j], clientX, clientY)) {
                target = list[j];
                break;
            }
        }
        if (!s.isAreaDown) {
            for (j = list.length - 1; j >= 0; j--) {
                if (list[j]._over || list[j] === target) {
                    if (!s.containsPosition(list[j], clientX, clientY)) {
                        //派送out(离开)事件
                        list[j]._over = false;
                        interaEvent = s.createEvent({
                            type: 'out',
                            object: list[j],
                            touches: touches,
                            clientX: clientX,
                            clientY: clientY,
                            originalEvent: e
                        });
                        s.dispatchEvent(interaEvent);
                        break;
                    }
                }
            }
        }
        if (target) {
            //派送move事件
            interaEvent = s.createEvent({
                type: 'move',
                object: target,
                touches: touches,
                clientX: clientX,
                clientY: clientY,
                originalEvent: e
            });
            s.dispatchEvent(interaEvent);

            var path = interaEvent.path;
            for (j = 0; j < path.length; j++) {
                if (path[j]._over) {
                    break;
                } else {
                    if (!s.isAreaDown) {
                        for (z = list.length - 1; z >= 0; z--) {
                            if (list[z]._over) {
                                //派送out(离开)事件
                                list[z]._over = false;
                                interaEvent = s.createEvent({
                                    type: 'out',
                                    object: list[z],
                                    touches: touches,
                                    clientX: clientX,
                                    clientY: clientY,
                                    originalEvent: e
                                });
                                s.dispatchEvent(interaEvent);
                                break;
                            }
                        }
                        //派送over(加入)事件
                        path[j]._over = true;
                        interaEvent = s.createEvent({
                            type: 'over',
                            object: path[j],
                            touches: touches,
                            clientX: clientX,
                            clientY: clientY,
                            originalEvent: e
                        });
                        s.dispatchEvent(interaEvent);
                        if (/touch/i.test(e.type)) { s.isAreaDown = true; }
                    }
                    break;
                }
            }
        }
    }
    if (e.target === s.renderer.canvas) { e.preventDefault(); }
};
//放开
Game.Interaction.prototype.onUp = function (e) {
    var s = this;
    var interaEvent;
    var touches = [];
    var clientRect = s.renderer.canvas.getBoundingClientRect();
    var clientX = e.clientX - clientRect.left;
    var clientY = e.clientY - clientRect.top;
    touches[0] = new Game.Touch().init(e.changedTouches[0]);
    touches[0].clientX = clientX;
    touches[0].clientY = clientY;
    var list = s.getDisplayObject();
    for (var i = list.length - 1; i >= 0; i--) {
        if (s.containsPosition(list[i], clientX, clientY)) {
            interaEvent = s.createEvent({
                type: 'up',
                object: list[i],
                touches: touches,
                clientX: clientX,
                clientY: clientY,
                originalEvent: e
            });
            s.dispatchEvent(interaEvent);
            break;
        }
    }
    if (e.type === 'touchend') {
        for (i = list.length - 1; i >= 0; i--) {
            if (list[i]._over) {
                //派送out(离开)事件
                list[i]._over = false;
                interaEvent = s.createEvent({
                    type: 'out',
                    object: list[i],
                    touches: touches,
                    clientX: clientX,
                    clientY: clientY,
                    originalEvent: e
                });
                s.dispatchEvent(interaEvent);
            }
        }
    }
    if (interaEvent) {
        if (interaEvent.path[0] === s.hitTargetSprite) {
            if (/touch/i.test(e.type)) {
                if (Math.abs(interaEvent.clientX - s.hitTargetPoint.x) >= 10 || Math.abs(interaEvent.clientY - s.hitTargetPoint.y) >= 10) {
                    return;
                }
            }
            //派送longclick(长按)事件
            if (Date.now() - s.hitTime > 500) {
                interaEvent = s.createEvent({
                    type: 'longclick',
                    object: interaEvent.path[0],
                    touches: touches,
                    clientX: clientX,
                    clientY: clientY,
                    originalEvent: e
                });
                s.dispatchEvent(interaEvent);
            } else {
                //派送click(单击)事件
                interaEvent = s.createEvent({
                    type: 'click',
                    object: interaEvent.path[0],
                    touches: touches,
                    clientX: clientX,
                    clientY: clientY,
                    originalEvent: e
                });
                s.dispatchEvent(interaEvent);
                //派送dblclick(双击)事件
                if (Date.now() - s.lastClickTime < 200) {
                    interaEvent = s.createEvent({
                        type: 'dblclick',
                        object: interaEvent.path[0],
                        touches: touches,
                        clientX: clientX,
                        clientY: clientY,
                        originalEvent: e
                    });
                    s.dispatchEvent(interaEvent);
                }
                s.lastClickTime = Date.now();
            }
        }
    }
    if (e.target === s.renderer.canvas) { e.preventDefault(); }
    s.isAreaDown = false;
};
//键盘按下
Game.Interaction.prototype.onKeyDown = function (e) {
    var s = this;
    var list = s.getDisplayObject();
    var index = list.indexOf(s.currentFocusSprite);
    if (index !== -1) {
        var path = [];
        var temp = list[index];
        var keyEvent = new Game.KeyboardEvent();
        while (temp) {
            path.push(temp);
            temp = temp.parent;
        }
        //派送keydown(键盘按下)事件
        keyEvent.init(e);
        keyEvent.init({
            path: path,
            type: 'keydown',
            stage: s.stage,
            target: list[index],
            currentTarget: list[index],
            originalEvent: e
        });
        s.dispatchEvent(keyEvent);
    }
    e.preventDefault();
};
//键盘放开
Game.Interaction.prototype.onKeyUp = function (e) {
    var s = this;
    var list = s.getDisplayObject();
    var index = list.indexOf(s.currentFocusSprite);
    if (index !== -1) {
        var path = [];
        var temp = list[index];
        var keyEvent = new Game.KeyboardEvent();
        while (temp) {
            path.push(temp);
            temp = temp.parent;
        }
        //派送keyup(键盘放开)事件
        keyEvent.init(e);
        keyEvent.init({
            path: path,
            type: 'keyup',
            stage: s.stage,
            target: list[index],
            currentTarget: list[index],
            originalEvent: e
        });
        s.dispatchEvent(keyEvent);
    }
    e.preventDefault();
};
//鼠标滚轮
Game.Interaction.prototype.onMouseWheel = function (e) {
    var s = this;
    var wheelDeltaX = e.wheelDeltaX || 0;
    var wheelDeltaY = e.wheelDeltaY || 0;
    var wheelDeltaZ = e.wheelDeltaZ || 0;
    var clientRect = s.renderer.canvas.getBoundingClientRect();
    var clientX = e.clientX - clientRect.left;
    var clientY = e.clientY - clientRect.top;
    //火狐兼容
    if (Utils.moz.browser === 'firefox') { wheelDeltaY = (-e.detail) || 0; }
    if (wheelDeltaX > 0) { wheelDeltaX = 120; }
    else if (wheelDeltaX < 0) { wheelDeltaX = -120; }
    if (wheelDeltaY > 0) { wheelDeltaY = 120; }
    else if (wheelDeltaY < 0) { wheelDeltaY = -120; }
    if (wheelDeltaZ > 0) { wheelDeltaZ = 120; }
    else if (wheelDeltaZ < 0) { wheelDeltaZ = -120; }

    var list = s.getDisplayObject();
    for (var i = list.length - 1; i >= 0; i--) {
        if (s.containsPosition(list[i], clientX, clientY)) {
            var path = [];
            var temp = list[i];
            var wheelEvent = new Game.WheelEvent();
            while (temp) {
                path.push(temp);
                temp = temp.parent;
            }
            //派送mousewheel(鼠标滚轮)事件
            wheelEvent.init(e);
            wheelEvent.init({
                path: path,
                type: 'mousewheel',
                stage: s.stage,
                target: list[i],
                clientX: clientX,
                clientY: clientY,
                wheelDeltaX: wheelDeltaX,
                wheelDeltaY: wheelDeltaY,
                wheelDeltaZ: wheelDeltaZ,
                currentTarget: null,
                originalEvent: e
            });
            s.dispatchEvent(wheelEvent);
            break;
        }
    }
    if (e.target === s.renderer.canvas) { e.preventDefault(); }
};
Game.Circle = function (x, y, radius) {
    var s = this;
    s.set(x, y, radius);
};
Game.Circle.prototype.constructor = Game.Circle;
Game.Circle.prototype.type = 'Circle';
//设置
Game.Circle.prototype.set = function (x, y, radius) {
    var s = this;
    s.x = x || 0;
    s.y = y || 0;
    s.radius = radius || 0;
    return s;
};
//克隆
Game.Circle.prototype.clone = function () {
    var s = this;
    return new Game.Circle(s.x, s.y, s.radius);
};
//是否包含指定点
Game.Circle.prototype.contains = function (x, y) {
    var s = this;
    if (s.radius > 0) {
        var dx = (s.x - x),
            dy = (s.y - y),
            r2 = s.radius * s.radius;
        dx *= dx;
        dy *= dy;
        return (dx + dy <= r2);
    }
}; Game.Ellipse = function (x, y, width, height) {
    var s = this;
    s.set(x, y, width, height);
};
Game.Ellipse.prototype.constructor = Game.Ellipse;
Game.Ellipse.prototype.type = 'Ellipse';
//设置
Game.Ellipse.prototype.set = function (x, y, width, height) {
    var s = this;
    s.x = x || 0;
    s.y = y || 0;
    s.width = width || 0;
    s.height = height || 0;
    return s;
};
//克隆
Game.Ellipse.prototype.clone = function () {
    var s = this;
    return new Game.Ellipse(s.x, s.y, s.width, s.height);
};
//是否包含指定点
Game.Ellipse.prototype.contains = function (x, y) {
    var s = this;
    if (s.width && s.height) {
        var normx = ((x - s.x) / s.width),
            normy = ((y - s.y) / s.height);
        normx *= normx;
        normy *= normy;
        return (normx + normy <= 1);
    }
}; Game.Matrix = function (a, b, c, d, tx, ty) {
    var s = this;
    s.identity();
    s.set(a, b, c, d, tx, ty);
};
Game.Matrix.prototype.constructor = Game.Matrix;
Game.Matrix.prototype.type = 'Matrix';
//设置矩阵
Game.Matrix.prototype.set = function (a, b, c, d, tx, ty) {
    var s = this;
    var mtx = arguments[0];
    if (mtx && mtx.type === s.type) {
        return s.set(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
    } else {
        s.a = (a == undefined ? s.a : a);
        s.b = (b == undefined ? s.b : b);
        s.c = (c == undefined ? s.c : c);
        s.d = (d == undefined ? s.d : d);
        s.tx = (tx == undefined ? s.tx : tx);
        s.ty = (ty == undefined ? s.ty : ty);
    }
    return s;
};
//平移
Game.Matrix.prototype.translate = function (tx, ty) {
    var s = this;
    s.tx += tx;
    s.ty += ty;
    return s;
};
//缩放
Game.Matrix.prototype.scale = function (x, y) {
    var s = this;
    s.a *= x;
    s.b *= x;
    s.c *= y;
    s.d *= y;
    return s;
};
//斜切
Game.Matrix.prototype.skew = function (x, y) {
    var s = this;
    c += Math.tan(Math.PI / 180 * x);
    b += Math.tan(Math.PI / 180 * y);
    return s;
};
//旋转
Game.Matrix.prototype.rotate = function (angle) {
    var s = this;
    var a = s.a;
    var c = s.c;
    var radian = Math.PI / 180 * (angle % 360);
    var cos = Math.cos(radian);
    var sin = Math.sin(radian);
    s.a = a * cos - s.b * cos;
    s.b = a * sin + s.b * sin;
    s.c = c * sin - s.d * sin;
    s.d = c * cos + s.d * cos;
    return s;
};
//复制
Game.Matrix.prototype.clone = function () {
    var s = this;
    return new Game.Matrix(s.a, s.b, s.c, s.d, s.tx, s.ty);
};
//附加
Game.Matrix.prototype.append = function (mtx) {
    var s = this,
        a = s.a,
        b = s.b,
        c = s.c,
        d = s.d;

    s.a = mtx.a * a + mtx.b * c;
    s.b = mtx.a * b + mtx.b * d;
    s.c = mtx.c * a + mtx.d * c;
    s.d = mtx.c * b + mtx.d * d;
    s.tx += mtx.tx * a + mtx.ty * c;
    s.ty += mtx.tx * b + mtx.ty * d;

    return s;
};
//转换为数组
Game.Matrix.prototype.toArray = function () {
    var s = this;
    return [s.a, s.b, s.c, s.d, s.tx, s.ty];
};
//重置矩阵，即初始状态
Game.Matrix.prototype.identity = function () {
    var s = this;
    s.a = 1;
    s.b = 0;
    s.c = 0;
    s.d = 1;
    s.tx = 0;
    s.ty = 0;
    return s;
};
//检验矩阵是否发生变换
Game.Matrix.prototype.isIdentity = function () {
    var s = this;
    return s.a == 1 && s.b == 0 && s.c == 0 && s.d == 1 && s.tx == 0 && s.ty == 0;
};
//获取应用矩阵后的新点
Game.Matrix.prototype.getTransformPoint = function (x, y) {
    var s = this;
    var point = new Game.Point();
    point.x = s.a * x + s.c * y + s.tx;
    point.y = s.b * x + s.d * y + s.ty;
    return point;
};
Game.Point = function (x, y) {
    var s = this;
    s.set(x, y);
};
Game.Point.prototype.constructor = Game.Point;
Game.Point.prototype.type = 'Point';
//设置
Game.Point.prototype.set = function (x, y) {
    var s = this;
    s.x = x || 0;
    s.y = y || 0;
    return s;
};
//克隆
Game.Point.prototype.clone = function () {
    var s = this;
    return new Game.Point(s.x, s.y);
};
//是否包含指定点
Game.Point.prototype.contains = function (x, y) {
    var s = this;
    return s.x === x && s.y === y;
}; Game.Polygon = function (points) {
    var s = this;
    s.point = [];
    s.set(points);
};
Game.Polygon.prototype.constructor = Game.Polygon;
Game.Polygon.prototype.type = 'Polygon';
//设置
Game.Polygon.prototype.set = function (points) {
    var s = this;
    s.point = points || [];
    return s;
};
//克隆
Game.Polygon.prototype.clone = function () {
    var s = this;
    return new Game.Polygon(s.point);
};
//是否包含指定点
Game.Polygon.prototype.contains = function (x, y) {
    var s = this;
    var i, xi, yi, xj, yj, intersect,
        inside = false,
        length = s.point.length / 2;
    for (i = 0, j = length - 1; i < length; j = i++) {
        xi = s.point[i * 2];
        yi = s.point[i * 2 + 1];
        xj = s.point[j * 2];
        yj = s.point[j * 2 + 1];
        intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
}; Game.Rectangle = function (x, y, width, height) {
    var s = this;
    s.set(x, y, width, height);
};
Game.Rectangle.prototype.constructor = Game.Rectangle;
Game.Rectangle.prototype.type = 'Rectangle';
//设置
Game.Rectangle.prototype.set = function (x, y, width, height) {
    var s = this;
    s.x = x || 0;
    s.y = y || 0;
    s.width = width || 0;
    s.height = height || 0;
    return s;
};
//克隆
Game.Rectangle.prototype.clone = function () {
    var s = this;
    return new Game.Rectangle(s.x, s.y, s.width, s.height);
};
//是否包含指定点
Game.Rectangle.prototype.contains = function (x, y) {
    var s = this;
    if (s.width || s.height) {
        return s.x + s.width >= x &&
               s.y + s.height >= y &&
               s.x <= x &&
               s.y <= y;
    }
}; Game.DisplayObject = function () {
    var s = this;
    s.type = 'DisplayObject';
    //宽度
    s.width = 0;
    //高度 
    s.height = 0;
    //透明度
    s.alpha = 1;
    //旋转
    s.rotate = 0;
    //位置
    s.position = new Game.Point();
    //斜切
    s.skew = new Game.Point(0, 0);
    //缩放
    s.scale = new Game.Point(1, 1);
    //中心点
    s.pivot = new Game.Point(0, 0);
    //锚点
    s.anchor = new Game.Point(.5, .5);
    //矩阵
    s.transform = new Game.Matrix();
    //基于父节点的透明度
    s.worldAlpha = 1;
    //基于父节点的变换矩阵
    s.worldTransform = new Game.Matrix();
    //父节点
    s.parent = null;
    //是否可见
    s.visible = true;
    //交互侦听开关
    s.mutualEnabled = true;
    //混合模式
    s.blendModes = Game.blendModesCanvas.NORMAL;
    //注册监听器
    Game.Listeners.register(s);
};
Game.DisplayObject.prototype.constructor = Game.DisplayObject;
//更新矩阵
Game.DisplayObject.prototype.updateTransform = function () {
    var s = this;
    var a = 1, b = 0, c = 0, d = 1, tx, ty;
    var pi = Math.PI / 180;
    var rotate = s.rotate % 360;
    var st = s.worldTransform;
    var pt = s.parent.worldTransform;
    //平移
    tx = s.position.x;
    ty = s.position.y;
    //旋转
    if (rotate) {
        var radian = pi * rotate;
        var cos = Math.cos(radian);
        var sin = Math.sin(radian);
        a = cos;
        b = sin;
        c = -sin;
        d = cos;
    }
    //缩放
    if (s.scale.x !== 1) {
        a *= s.scale.x;
        b *= s.scale.x;
    }
    if (s.scale.y !== 1) {
        c *= s.scale.y;
        d *= s.scale.y;
    }
    //斜切
    if (s.skew.x) { c += Math.tan(pi * s.skew.x); }
    if (s.skew.y) { b += Math.tan(pi * s.skew.y); }
    //计算中心点
    s.pivot.x = s.width * s.anchor.x;
    s.pivot.y = s.height * s.anchor.y;
    //中心点
    if (s.pivot.x || s.pivot.y) {
        tx += (1 - a) * s.pivot.x - c * s.pivot.y;
        ty += (1 - d) * s.pivot.y - b * s.pivot.x;
    }
    //应用
    st.a = a * pt.a + b * pt.c;
    st.b = a * pt.b + b * pt.d;
    st.c = c * pt.a + d * pt.c;
    st.d = c * pt.b + d * pt.d;
    st.tx = tx * pt.a + ty * pt.c + pt.tx;
    st.ty = tx * pt.b + ty * pt.d + pt.ty;
    //基于父节点的透明度
    s.worldAlpha = s.parent.worldAlpha * s.alpha;
};
Game.DisplayObject.prototype.DisplayObjectUpdateTransform = Game.DisplayObject.prototype.updateTransform;
//获取精灵的矩形边界
Game.DisplayObject.prototype.getBounds = function () {
    var s = this;
    var p1 = s.worldTransform.getTransformPoint(0, 0);
    var p2 = s.worldTransform.getTransformPoint(s.width, 0);
    var p3 = s.worldTransform.getTransformPoint(0, s.height);
    var p4 = s.worldTransform.getTransformPoint(s.width, s.height);
    var maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    var maxY = Math.max(p1.y, p2.y, p3.y, p4.y);
    var minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    var minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    return new Game.Rectangle(minX, minY, maxX - minX, maxY - minY);
};
Game.DisplayObjectContainer = function () {
    var s = this;
    Game.DisplayObject.call(s);
    //子节点数组的容器
    s.children = [];
};
Game.DisplayObjectContainer.prototype = Object.create(Game.DisplayObject.prototype);
Game.DisplayObjectContainer.prototype.constructor = Game.DisplayObjectContainer;
//更新矩阵
Game.DisplayObjectContainer.prototype.updateTransform = function () {
    var s = this;
    s.DisplayObjectUpdateTransform();
    //更新子节点矩阵
    if (s.children.length > 0) {
        for (var i = 0; i < s.children.length; i++) {
            s.children[i].updateTransform();
        }
    }
};
//添加一个子节点到容器
Game.DisplayObjectContainer.prototype.addChild = function (child) {
    var s = this;
    s.addChildAt(child, s.children.length);
};
//添加一个子节点到容器指定索引位置
Game.DisplayObjectContainer.prototype.addChildAt = function (child, index) {
    var s = this;
    if (child) {
        if (s.children.indexOf(child) === -1) {
            if (index >= 0 && index <= s.children.length) {
                child.parent = s;
                s.children.splice(index, 0, child);
            } else {
                throw new Error('索引：' + index + ' 超出范围，最大可设置索引为' + s.children.length);
            }
        } else {
            throw new Error('该节点已存在！');
        }
    } else {
        throw new Error('参数错误！');
    }
};
//删除指定范围内的子节点
Game.DisplayObjectContainer.prototype.removeChild = function (child) {
    var s = this;
    var index = s.children.indexOf(child);
    if (index !== -1) {
        s.children.splice(index, 1);
    }
};
//删除一个指定索引子节点
Game.DisplayObjectContainer.prototype.removeChildAt = function (index) {
    var s = this;
    if (index >= 0 && index <= s.children.length) {
        s.children.splice(index, 1);
    } else {
        throw new Error('位置' + index + '超出范围' + s.children.length);
    }
};
//删除指定范围内的子节点
Game.DisplayObjectContainer.prototype.removeChildIndex = function (beginIndex, endIndex) {
    var s = this;
    var begin = beginIndex || 0;
    var end = endIndex || s.children.length;
    var range = end - begin;
    return s.children.splice(begin, range);
};
//交换两个指定子节点的索引位置
Game.DisplayObjectContainer.prototype.swapChild = function (child, child2) {
    var s = this;
    var index = s.children.indexOf(child);
    var index2 = s.children.indexOf(child2);
    s.swapChildAt(index, index2);
};
//交换两个指定索引的子节点位置
Game.DisplayObjectContainer.prototype.swapChildAt = function (index, index2) {
    var s = this;
    if (index < 0 || index2 < 0) {
        throw new Error('必须为该节点的子节点');
    } else {
        var child = s.children[index];
        var child2 = s.children[index2];
        s.children[index] = child2;
        s.children[index2] = child;
    }
};
//获取指定子节点的索引位置
Game.DisplayObjectContainer.prototype.getChildIndex = function (child) {
    var s = this;
    return s.children.indexOf(child);
};
//设置指定子节点的索引位置
Game.DisplayObjectContainer.prototype.setChildIndex = function (child, index) {
    var s = this;
    if (index >= 0 && index <= s.children.length) {
        s.children.splice(s.children.indexOf(child), 1);
        s.children.splice(index, 0, child);
    } else {
        throw new Error('位置' + index + '超出范围' + s.children.length);
    }
};
//获取指定索引的子节点
Game.DisplayObjectContainer.prototype.getChildAt = function (index) {
    var s = this;
    if (index >= 0 && index <= s.children.length) {
        return s.children[index];
    } else {
        throw new Error('位置' + index + '超出范围' + s.children.length);
    }
};
//舞台
Game.Window = function () {
    var s = this;
    Game.DisplayObjectContainer.call(s);

    s._bounds = new Game.Rectangle(-Infinity, -Infinity, Infinity, Infinity);
    s._bounds.contains = function () { return true; };
};
Game.Window.prototype = Object.create(Game.DisplayObjectContainer.prototype);
Game.Window.prototype.constructor = Game.Window;
//获取精灵的矩形边界
Game.Window.prototype.getBounds = function () {
    return this._bounds;
};
//使用Canvas渲染器渲染对象
Game.Window.prototype._renderCanvas = function (renderSession) {
    var s = this;
    //渲染子节点
    for (var i = 0; i < s.children.length; i++) {
        s.children[i].updateTransform();
        s.children[i]._renderCanvas(renderSession);
    }
};
Game.Window = new Game.Window();//舞台
Game.Stage = function (backgroundColor) {
    var s = this;
    Game.DisplayObjectContainer.call(s);
    //背景颜色
    s.backgroundColor = backgroundColor;

    s.parent = Game.Window;
};
Game.Stage.prototype = Object.create(Game.DisplayObjectContainer.prototype);
Game.Stage.prototype.constructor = Game.Stage;
//使用Canvas渲染器渲染对象
Game.Stage.prototype._renderCanvas = function (renderSession) {
    var s = this;
    //渲染子节点
    for (var i = 0; i < s.children.length; i++) {
        s.children[i].updateTransform();
        s.children[i]._renderCanvas(renderSession);
    }
}; Game.Sprite = function (texture) {
    var s = this;
    Game.DisplayObjectContainer.call(s);
    //纹理贴图
    s.texture = null;
    s.setTexture(texture);
};
Game.Sprite.prototype = Object.create(Game.DisplayObjectContainer.prototype);
Game.Sprite.prototype.constructor = Game.Sprite;
//设置纹理贴图
Game.Sprite.prototype.setTexture = function (data) {
    var s = this;
    if (data && s.texture !== data) {
        s.texture = data;
        s.texture.data.on('load', function () {
            s.width = s.texture.width / s.texture.resolution;
            s.height = s.texture.height / s.texture.resolution;
        });
    }
};
//使用Canvas渲染器渲染对象
Game.Sprite.prototype._renderCanvas = function (renderSession) {
    var s = this;
    //检测对象是否需要渲染
    if (!s.visible || !s.alpha) {
        return;
    }
    //渲染纹理贴图
    if (s.texture && s.width && s.height) {
        //应用混合模式
        if (s.blendModes !== renderSession.blendModes) {
            renderSession.blendModes = s.blendModes;
            s.context.globalCompositeOperation = s.blendModes;
        }
        //透明度
        renderSession.context.globalAlpha = s.worldAlpha;
        //图片缩放时是否平滑处理
        if (renderSession.smoothing !== s.texture.smoothing) {
            renderSession.smoothing = s.texture.smoothing;
            renderSession.context[Game.smoothProperty] = s.texture.smoothing;
        }
        var resolution = s.texture.resolution / renderSession.resolution;
        //像素插值
        if (renderSession.roundPixels) {
            renderSession.context.setTransform(
                s.worldTransform.a,
                s.worldTransform.b,
                s.worldTransform.c,
                s.worldTransform.d,
                s.worldTransform.tx * renderSession.resolution,
                s.worldTransform.ty * renderSession.resolution);
        } else {
            renderSession.context.setTransform(
                s.worldTransform.a,
                s.worldTransform.b,
                s.worldTransform.c,
                s.worldTransform.d,
                (s.worldTransform.tx * renderSession.resolution) | 0,
                (s.worldTransform.ty * renderSession.resolution) | 0);
        }

        renderSession.context.drawImage(
                    s.texture.data.source,
                    s.texture.crop.x,
                    s.texture.crop.y,
                    s.texture.crop.width,
                    s.texture.crop.height,
                    0,
                    0,
                    s.texture.width / resolution,
                    s.texture.height / resolution);
    }
    //renderSession.context.setTransform(1, 0, 0, 1, 0, 0);
    //var rect = s.getBounds();
    //renderSession.context.beginPath();
    //renderSession.context.strokeStyle = 'red';
    //renderSession.context.lineWidth = 2 * renderSession.resolution;
    //renderSession.context.rect(rect.x * renderSession.resolution, rect.y * renderSession.resolution, rect.width * renderSession.resolution, rect.height * renderSession.resolution);
    //renderSession.context.stroke();
    //renderSession.context.closePath();
    //渲染子节点
    if (s.children.length > 0) {
        for (var i = 0; i < s.children.length; i++) {
            s.children[i]._renderCanvas(renderSession);
        }
    }
};//图像数据
Game.ImageData = function (source) {
    var s = this;
    //图像宽度
    s.width = 0;
    //图像高度
    s.height = 0;
    //源数据
    s.source = source;
    //加载数据源
    s.source.onload = function (e) {
        s.width = s.source.naturalWidth || s.source.width;
        s.height = s.source.naturalHeight || s.source.height;
        s.dispatchEvent('load', e);
    };
    s.source.onerror = function (e) {
        s.dispatchEvent('error', e);
    };
    //注册监听器
    Game.Listeners.register(s);

    if (s.source.nodeName.toLowerCase() === 'canvas') {
        setTimeout(s.source.onload);
    }
};
Game.ImageData.prototype.constructor = Game.ImageData;
//销毁
Game.ImageData.prototype.destroy = function () {
    var s = this;
    s.source.onload = null;
    s.source.onerror = null;
    s.source = null;
    Game.Listeners.remove(s);
};
//设置源数据
Game.ImageData.prototype.setSource = function (url) {
    var s = this;
    s.source.src = null;
    s.source.src = url;
};
//使用给定Url创建一个图像数据
Game.ImageData.fromImage = function (url) {
    var image = new Image();
    image.src = url;
    return new Game.ImageData(image);
};
//使用给定Canvas创建一个图像数据
Game.ImageData.fromCanvas = function (canvas) {
    return new Game.ImageData(canvas);;
};


//视频数据
Game.VideoData = function (source) {
    var s = this;
    //视频宽度
    s.width = 0;
    //视频高度
    s.height = 0;
    //源数据
    s.source = source;
    s.source.autoplay = true;
    //事件
    s.source.addEventListener('canplay', s.onCanplay.bind(s));
    s.source.addEventListener('canplaythrough', s.onCanplay.bind(s));
    s.source.addEventListener('play', s.onPlayStart.bind(s));
    s.source.addEventListener('pause', s.onPlayStop.bind(s));
    //注册监听器
    Game.Listeners.register(s);
};
Game.VideoData.prototype.constructor = Game.VideoData;
//销毁
Game.VideoData.prototype.destroy = function () {
    var s = this;
    s.source.onload = null;
    s.source.onerror = null;
    s.source = null;
    Game.Listeners.remove(s);
};
//设置源数据
Game.VideoData.prototype.setSource = function (url) {
    var s = this;
    s.source.src = null;
    s.source.src = url;
};
//加载完成
Game.VideoData.prototype.onCanplay = function (e) {
    var s = this;
    s.width = s.source.videoWidth;
    s.height = s.source.videoHeight;
    s.dispatchEvent('load', e);
};
//开始播放
Game.VideoData.prototype.onPlayStart = function (e) {
    var s = this;
    console.log('开始播放');
};
//停止播放
Game.VideoData.prototype.onPlayStop = function (e) {
    var s = this;
    console.log('停止播放');
};


//纹理贴图
Game.Texture = function (data, resolution, smoothing, crop) {
    var s = this;
    //纹理数据
    s.data = data;
    //宽度
    s.width = 0;
    //高度
    s.height = 0;
    //图像缩放时是否平滑处理
    s.smoothing = smoothing || true;
    //分辨率
    s.resolution = resolution || 1;
    //裁剪
    s.crop = crop || new Game.Rectangle();
    //纹理加载完成后回调
    data.on('load', function () {
        s.crop.width = s.width = s.data.width;
        s.crop.height = s.height = s.data.height;
    });
};
Game.Texture.prototype.constructor = Game.Texture;
//使用给定图片Url创建一个纹理对象
Game.Texture.fromImage = function (url, resolution, smoothing, crop) {
    var image = new Image();
    image.src = url;
    return new Game.Texture(new Game.ImageData(image), resolution, smoothing, crop);
};
//使用给定Canvas创建一个纹理对象
Game.Texture.fromCanvas = function (canvas, resolution, smoothing, crop) {
    return new Game.Texture(new Game.ImageData(canvas), resolution, smoothing, crop);
};
//使用给定视频Url创建一个纹理对象
Game.Texture.fromVideo = function (url, resolution, smoothing, crop) {
    var video = document.createElement('video');
    video.src = url;
    return new Game.Texture(new Game.VideoData(video), resolution, smoothing, crop);
};
//销毁
Game.Texture.prototype.destroy = function (data) {
    var s = this;
    s.data.destroy();
    s.data = null;
};//canvas 2d渲染器
Game.CanvasRenderer = function (width, height, options) {
    var s = this;
    if (options) {
        for (var name in Game.defaultRenderOptions) {
            if (typeof options[name] === undefined) {
                options[name] = Game.defaultRenderOptions[name];
            }
        }
    } else {
        options = Game.defaultRenderOptions;
    }
    //宽度
    s.width = width || 512;
    //高度
    s.height = height || 512;
    //渲染前擦除画布
    s.clearBeforeRender = options.clearBeforeRender;
    //画布元素
    s.canvas = document.createElement('canvas');
    //2d绘图环境
    s.context = s.canvas.getContext('2d');
    //分辨率
    s.resolution = options.resolution;
    //渲染用参数
    s.renderSession = {
        //绘图环境
        context: s.context,
        //分辨率
        resolution: s.resolution,
        //混合模式
        blendModes: Game.blendModesCanvas.NORMAL,
        //图片缩放时是否平滑处理
        smoothing: true,
        //是否启用像素插值
        roundPixels: true
    };

    s.resize(s.width, s.height);
};
Game.CanvasRenderer.prototype.constructor = Game.CanvasRenderer;
//销毁
Game.CanvasRenderer.prototype.destroy = function (removeView) {
    var s = this;
    if (removeView || removeView === undefined || s.canvas.parentNode) {
        s.canvas.parentNode.removeChild(s.canvas);
    }
    s.canvas = null;
    s.context = null;
    s.renderSession = null;
};
//渲染
Game.CanvasRenderer.prototype.render = function (stage) {
    var s = this;

    s.context.globalAlpha = 1;
    s.context.setTransform(1, 0, 0, 1, 0, 0);
    s.context[Game.smoothProperty] = s.renderSession.smoothing;
    s.context.globalCompositeOperation = Game.blendModesCanvas.NORMAL;

    if (s.clearBeforeRender) {
        if (stage.backgroundColor) {
            s.context.fillStyle = stage.backgroundColor;
            s.context.fillRect(0, 0, s.width, s.height);
        } else {
            s.context.clearRect(0, 0, s.width, s.height);
        }
    }
    stage.width = s.width / s.resolution;
    stage.height = s.height / s.resolution;
    s.renderDisplayObject(stage);
};
//调整大小
Game.CanvasRenderer.prototype.resize = function (width, height) {
    var s = this;
    s.width = width * s.resolution;
    s.height = height * s.resolution;
    s.canvas.width = s.width;
    s.canvas.height = s.height;
    s.canvas.style.width = (s.width / s.resolution) + "px";
    s.canvas.style.height = (s.height / s.resolution) + "px";
};
//渲染一个显示对象
Game.CanvasRenderer.prototype.renderDisplayObject = function (displayObject, context) {
    var s = this;
    s.renderSession.context = context || s.context;
    s.renderSession.resolution = s.resolution;
    s.renderSession.blendModes = Game.blendModesCanvas.NORMAL;
    displayObject._renderCanvas(s.renderSession);
};