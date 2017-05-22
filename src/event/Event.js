//事件
Game.Event = function () {
    var s = this;
    //事件类型
    s.type = null;
    //冒泡路径
    s.path = null;
    //标记触发该事件的舞台
    s.stage = null;
    //事件的目标节点
    s.target = null;
    //原始DOM事件
    s.originalEvent = null;
    //时间戳
    s.timeStamp = Date.now();
    //事件阶段
    s.eventPhase = null;
    //监听器触发事件的对象
    s.currentTarget = null;
    //标记该事件是否会向上层元素冒泡
    s.bubbles = false;
    //标记该事件的事件冒泡是否被停止
    s.propagationStop = false;
    //标记该事件的默认动作是否可以被取消
    s.cancelable = false;
    //标记该事件的默认动作是否被取消
    s.defaultPrevented = false;
};
Game.Event.prototype.constructor = Game.Event;
//初始化
Game.Event.prototype.init = function (json) {
    var s = this;
    for (var name in json) {
        if (s.hasOwnProperty(name) && name in s) {
            s[name] = json[name];
        }
    }
    return s;
};
//阻止浏览器默认动作
Game.Event.prototype.preventDefault = function () {
    var s = this;
    s.defaultPrevented = true;
    s.originalEvent.preventDefault();
};
//停止事件传播
Game.Event.prototype.stopPropagation = function () {
    var s = this;
    s.propagationStop = true;
    s.originalEvent.stopPropagation();
};