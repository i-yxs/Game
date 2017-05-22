Game.Sprite = function (texture) {
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
};