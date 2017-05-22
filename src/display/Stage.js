//舞台
Game.Stage = function (backgroundColor) {
    var s = this;
    Game.DisplayObjectContainer.call(s);
    //背景颜色
    s.backgroundColor = backgroundColor;

    s.parent = Game.Window;
};
Game.Stage.prototype = Object.create(Game.DisplayObjectContainer.prototype);
Game.Stage.prototype.constructor = Game.Stage;
//使用Canvas渲染器渲染对象
Game.Stage.prototype._renderCanvas = function (renderSession) {
    var s = this;
    //渲染子节点
    for (var i = 0; i < s.children.length; i++) {
        s.children[i].updateTransform();
        s.children[i]._renderCanvas(renderSession);
    }
};