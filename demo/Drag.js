function Drag(container) {
    var s = this;
    //精灵列表
    s.spirit = [];

    container.on('move', function (e) {
        for (var i = 0; i < s.spirit.length; i++) {
            if (s.spirit[i].isHit) {
                var index = s.spirit[i].identifier;
                if (e.touches[index]) {
                    s.spirit[i].position.x = e.touches[index].clientX - s.spirit[i].isHitPoint.x + s.spirit[i].isHitPosition.x;
                    s.spirit[i].position.y = e.touches[index].clientY - s.spirit[i].isHitPoint.y + s.spirit[i].isHitPosition.y;
                }
            }
        }
        s.dispatchEvent('drag');
    }, 2);
    container.on('up', function (e) {
        var index = e.touches[0].identifier;
        for (var i = 0; i < s.spirit.length; i++) {
            if (s.spirit[i].identifier === index) {
                s.spirit[i].isHit = false;
            }
        }
    }, 2);

    //注册监听器
    Game.Listeners.register(s);
};
Drag.prototype.constructor = Drag;
//添加精灵
Drag.prototype.append = function (spirit) {
    var s = this;

    spirit.isHit = false;
    spirit.identifier = null;
    spirit.isHitPoint = new Game.Point();
    spirit.isHitPosition = new Game.Point();

    spirit.on('down', function (e) {
        spirit.isHit = true;
        spirit.identifier = e.touches[0].identifier;
        spirit.isHitPoint.set(e.clientX, e.clientY);
        spirit.isHitPosition.set(spirit.position.x, spirit.position.y);
    }, 2);

    s.spirit.push(spirit);
};