//交互事件
Game.InteractionEvent = function () {
    var s = this;
    Game.Event.call(s);
    //标记按键是否按下
    s.altKey = null;
    s.ctrlKey = null;
    s.metaKey = null;
    s.shiftKey = null;
    //按下键的索引值
    s.which = null;
    //离开或者进入目标的触点列表
    s.touches = null;
    //相对于画布显示区域的坐标
    s.clientX = null;
    s.clientY = null;
};
Game.InteractionEvent.prototype = Object.create(Game.Event.prototype);
Game.InteractionEvent.prototype.constructor = Game.InteractionEvent;