//交互事件
Game.KeyboardEvent = function () {
    var s = this;
    Game.Event.call(s);
    //标记按键是否按下
    s.altKey = null;
    s.ctrlKey = null;
    s.metaKey = null;
    s.shiftKey = null;
    //按下键的索引值
    s.which = null;
    s.keyCode = 0;
    s.keyIdentifier = '';
};
Game.KeyboardEvent.prototype = Object.create(Game.Event.prototype);
Game.KeyboardEvent.prototype.constructor = Game.KeyboardEvent;