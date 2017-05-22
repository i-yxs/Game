//舞台
Game.Window = function () {
    var s = this;
    Game.DisplayObjectContainer.call(s);

    s._bounds = new Game.Rectangle(-Infinity, -Infinity, Infinity, Infinity);
    s._bounds.contains = function () { return true;};
};
Game.Window.prototype = Object.create(Game.DisplayObjectContainer.prototype);
Game.Window.prototype.constructor = Game.Window;
//获取精灵的矩形边界
Game.Window.prototype.getBounds = function () {
    return this._bounds;
};
//使用Canvas渲染器渲染对象
Game.Window.prototype._renderCanvas = function (renderSession) {
    var s = this;
    //渲染子节点
    for (var i = 0; i < s.children.length; i++) {
        s.children[i].updateTransform();
        s.children[i]._renderCanvas(renderSession);
    }
};
Game.Window = new Game.Window();