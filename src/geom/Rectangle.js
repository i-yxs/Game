Game.Rectangle = function (x, y, width, height) {
    var s = this;
    s.set(x, y, width, height);
};
Game.Rectangle.prototype.constructor = Game.Rectangle;
Game.Rectangle.prototype.type = 'Rectangle';
//设置
Game.Rectangle.prototype.set = function (x, y, width, height) {
    var s = this;
    s.x = x || 0;
    s.y = y || 0;
    s.width = width || 0;
    s.height = height || 0;
    return s;
};
//克隆
Game.Rectangle.prototype.clone = function () {
    var s = this;
    return new Game.Rectangle(s.x, s.y, s.width, s.height);
};
//是否包含指定点
Game.Rectangle.prototype.contains = function (x, y) {
    var s = this;
    if (s.width || s.height) {
        return s.x + s.width >= x &&
               s.y + s.height >= y &&
               s.x <= x &&
               s.y <= y;
    }
};