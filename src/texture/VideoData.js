//图像数据
Game.VideoData = function (source) {
    var s = this;
    //图像宽度
    s.width = 0;
    //图像高度
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


