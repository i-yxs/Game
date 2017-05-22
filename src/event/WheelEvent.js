//交互事件
Game.WheelEvent = function () {
    var s = this;
    Game.Event.call(s);
    //标记按键是否按下
    s.altKey = null;
    s.ctrlKey = null;
    s.metaKey = null;
    s.shiftKey = null;
    //按下键的索引值
    s.which = null;
    //相对于画布显示区域的坐标
    s.clientX = null;
    s.clientY = null;
    //滚动方向
    s.wheelDeltaX = 0;
    s.wheelDeltaY = 0;
    s.wheelDeltaZ = 0;
};
Game.WheelEvent.prototype = Object.create(Game.Event.prototype);
Game.WheelEvent.prototype.constructor = Game.WheelEvent;