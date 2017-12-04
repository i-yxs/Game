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
    var toString = Object.prototype.toString.call(obj).toLowerCase();
    if (name === undefined) {
        return /^\[object (\w+)\]$/.exec(toString)[1];
    } else {
        return toString == '[object ' + name.toLowerCase() + ']';
    }
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
    var mouse = ['mousedown', 'mouseup', 'mousemove'],
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
};