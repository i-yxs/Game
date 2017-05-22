Game.DisplayObject = function () {
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
    //缩放比例
    s.scale = new Game.Point(1, 1);
    //原点
    s.origin = new Game.Point('50%', '50%');
    //原点（实际像素）
    s.originPixel = new Game.Point(0, 0);
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
    //计算原点位置
    s.computeOriginPosition();
    //应用原点调整位置
    if (s.originPixel.x || s.originPixel.y) {
        tx += (1 - a) * s.originPixel.x - c * s.originPixel.y;
        ty += (1 - d) * s.originPixel.y - b * s.originPixel.x;
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
//计算原点坐标位置
Game.DisplayObject.prototype.computeOriginPosition = function () {
    var s = this;
    var ox, oy, res;
    var reg = /^([+-]?\d*\.?\d+)%$/;
    switch (Utils.isType(s.origin.x)) {
        case 'string':
            if (res = reg.exec(s.origin.x)) {
                ox = res[1] / 100 * s.width;
            } else {
                ox = s.originPixel.x;
            }
            break;
        case 'number':
            ox = s.origin.x;
            break;
        default:
            ox = s.originPixel.x;
            break
    }
    switch (Utils.isType(s.origin.y)) {
        case 'string':
            if (res = reg.exec(s.origin.y)) {
                oy = res[1] / 100 * s.height;
            } else {
                oy = s.originPixel.y;
            }
            break;
        case 'number':
            oy = s.origin.y;
            break;
        default:
            oy = s.originPixel.y;
            break
    }
    s.originPixel.x = ox;
    s.originPixel.y = oy;
};
