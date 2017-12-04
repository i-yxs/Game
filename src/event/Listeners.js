//监听器
Game.Listeners = function () {};
//注册监听器
Game.Listeners.prototype.register = function (object) {
    var s = this;
    if (!object._GameRegistered) {
        object._GameRegistered = true;
        object._GameListeners = object._GameListeners || {};
        object.dispatchEvent = s.dispatchEvent.bind(object);
        object.on = object.addEventListener = s.addEventListener.bind(object);
        object.off = object.removeEventListener = s.removeEventListener.bind(object);
    }
};
//删除监听器
Game.Listeners.prototype.remove = function (object) {
    var s = this;
    object._GameRegistered = false;
    object._GameListeners = null;
    object.dispatchEvent = null;
    object.on = object.addEventListener = null;
    object.off = object.removeEventListener = null;
};
//事件派送
Game.Listeners.prototype.dispatchEvent = function (type, data, phase) {
    var s = this;
    phase = phase || 1;
    type = type.toLowerCase();
    //优先派送
    var typeName = type.toLowerCase().replace(/^([a-z])/g, type[0].toUpperCase());
    if (s['on' + typeName] && Utils.isType(s['on' + typeName], 'function')) {
        s['on' + typeName].call(s, data);
    }
    if (s._GameListeners[phase]) {
        var list = s._GameListeners[phase][type];
        if (list) {
            list.forEach(function (item) {
                item.call(s, data);
            });
        }
    }
};
//添加事件监听
Game.Listeners.prototype.addEventListener = function (type, callback, phase) {
    var s = this;
    phase = phase || 1;
    type = type.toLowerCase();
    s._GameListeners[phase] = s._GameListeners[phase] || {};
    s._GameListeners[phase][type] = s._GameListeners[phase][type] || [];
    s._GameListeners[phase][type].push(callback);
};
//删除事件监听
Game.Listeners.prototype.removeEventListener = function (type, callback, phase) {
    var s = this;
    phase = phase || 1;
    type = type.toLowerCase();
    if (s._GameListeners[phase] && s._GameListeners[phase][type]) {
        var list = s._GameListeners[phase][type];
        if (typeof callback === 'string' && callback.toLowerCase() === 'all') {
            list.length = 0;
        } else {
            var i = list.indexOf(callback);
            if (i !== -1) { list.splice(i, 1); }
        }
    }
};
Game.Listeners = new Game.Listeners();