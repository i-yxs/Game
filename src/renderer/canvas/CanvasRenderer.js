//canvas 2d渲染器
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
    //获取当前渲染器的矩形盒子
    s.getClientRects = s.canvas.getClientRects;
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