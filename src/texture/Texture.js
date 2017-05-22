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
};