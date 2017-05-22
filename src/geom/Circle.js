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
};