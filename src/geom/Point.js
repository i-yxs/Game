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
};