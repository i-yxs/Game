//图像数据
Game.ImageData = function (source) {
    var s = this;
    //图像宽度
    s.width = null;
    //图像高度
    s.height = null;
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


