//触点类
Game.Touch = function () {
    var s = this;
    s.clientX = 0;
    s.clientY = 0;
    s.force = 0;
    s.identifier = 0;
    s.screenX = 0;
    s.screenY = 0;
    s.target = null;
};
Game.Touch.prototype = Object.create(Game.Event.prototype);
Game.Touch.prototype.constructor = Game.Touch;