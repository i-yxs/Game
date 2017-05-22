Game.Polygon = function (points) {
    var s = this;
    s.point = [];
    s.set(points);
};
Game.Polygon.prototype.constructor = Game.Polygon;
Game.Polygon.prototype.type = 'Polygon';
//设置
Game.Polygon.prototype.set = function (points) {
    var s = this;
    s.point = points || [];
    return s;
};
//克隆
Game.Polygon.prototype.clone = function () {
    var s = this;
    return new Game.Polygon(s.point);
};
//是否包含指定点
Game.Polygon.prototype.contains = function (x, y) {
    var s = this;
    var i, xi, yi, xj, yj, intersect,
        inside = false,
        length = s.point.length / 2;
    for (i = 0, j = length - 1; i < length; j = i++) {
        xi = s.point[i * 2];
        yi = s.point[i * 2 + 1];
        xj = s.point[j * 2];
        yj = s.point[j * 2 + 1];
        intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
};