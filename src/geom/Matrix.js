Game.Matrix = function (a, b, c, d, tx, ty) {
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
