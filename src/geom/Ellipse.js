Game.Ellipse = function (x, y, width, height) {
    var s = this;
    s.set(x, y, width, height);
};
Game.Ellipse.prototype.constructor = Game.Ellipse;
Game.Ellipse.prototype.type = 'Ellipse';
//设置
Game.Ellipse.prototype.set = function (x, y, width, height) {
    var s = this;
    s.x = x || 0;
    s.y = y || 0;
    s.width = width || 0;
    s.height = height || 0;
    return s;
};
//克隆
Game.Ellipse.prototype.clone = function () {
    var s = this;
    return new Game.Ellipse(s.x, s.y, s.width, s.height);
};
//是否包含指定点
Game.Ellipse.prototype.contains = function (x, y) {
    var s = this;
    if (s.width && s.height) {
        var normx = ((x - s.x) / s.width),
            normy = ((y - s.y) / s.height);
        normx *= normx;
        normy *= normy;
        return (normx + normy <= 1);
    }
};