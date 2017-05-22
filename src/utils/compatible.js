//动画函数兼容
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window[Utils.browserPrefixCompatible('requestAnimationFrame', window)] ||
                                   function (fun) { return setTimeout(fun, 17); };
}
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = window[Utils.browserPrefixCompatible('cancelAnimationFrame', window)] ||
                                  function (e) { return clearTimeout(e); };;
}
//html
if (!document.html) {
    document.html = document.querySelector('html');
}
//数组克隆
if (!Array.clone) {
    Array.prototype.clone = function () {
        return [].concat(this);
    };
}
//打乱数组顺序
if (!Array.chaosOrder) {
    Array.prototype.chaosOrder = function () {
        var s = this,
            arr = s.clone();
        for (var i = 0; i < s.length; i++) {
            s[i] = arr.splice(parseInt(Math.random() * arr.length - 1), 1)[0];
        }
        return s;
    };
}
//将数组各个项转换成数字类型
if (!Array.toNumber) {
    Array.prototype.toNumber = function () {
        var s = this;
        for (var i = 0; i < s.length; i++) {
            s[i] = Number(s[i]);
        }
        return s;
    };
}
//检索数组中第一个给定元素的索引值，对象结构（'a.b.c'）
if (!Array.indexOfbeefup) {
    Array.prototype.indexOfbeefup = function (value, from, structure) {
        var s = this;
        from = from || 0;
        for (var i = from; i < s.length; i++) {
            if (structure) {
                var result = Utils.getObjectStructure(s[i], structure);
                if (result.seekout && result.result === value) {
                    return i;
                }
            } else {
                if (s[i] === value) {
                    return i;
                }
            }
        }
        return -1;
    };
};
//事件兼容处理
(function () {
    function Touch(json) {
        var s = this;
        s.clientX = 0;
        s.clientY = 0;
        s.force = 0;
        s.identifier = 0;
        s.pageX = 0;
        s.pageY = 0;
        s.radiusX = 0;
        s.radiusY = 0;
        s.rotationAngle = 0;
        s.screenX = 0;
        s.screenY = 0;
        s.target = 0;
        for (var name in json) {
            if (s.hasOwnProperty(name) && name in s) {
                s[name] = json[name];
            }
        }
    };
    Touch.prototype.constructor = Touch;
    function TouchEvent(json) {
        var s = this;
        s.altKey = null;
        s.bubbles = null;
        s.cancelBubble = null;
        s.cancelable = null;
        s.changedTouches = null;
        s.clientX = null;
        s.clientY = null;
        s.ctrlKey = null;
        s.currentTarget = null;
        s.defaultPrevented = null;
        s.detail = null;
        s.eventPhase = null;
        s.isTrusted = null;
        s.isTrusted = null;
        s.metaKey = null;
        s.path = null;
        s.returnValue = null;
        s.shiftKey = null;
        s.srcElement = null;
        s.target = null;
        s.targetTouches = null;
        s.timeStamp = null;
        s.touches = null;
        s.type = null;
        s.view = null;
        s.which = null;
        for (var name in json) {
            if (s.hasOwnProperty(name) && name in s) {
                s[name] = json[name];
            }
        }
        s.baseEvent = json;
    };
    TouchEvent.prototype.constructor = TouchEvent;
    function MouseEvent(json) {
        var s = this;
        s.altKey = null;
        s.bubbles = null;
        s.button = null;
        s.buttons = null;
        s.cancelBubble = null;
        s.cancelable = null;
        s.changedTouches = null;
        s.clientX = null;
        s.clientY = null;
        s.ctrlKey = null;
        s.currentTarget = null;
        s.defaultPrevented = null;
        s.detail = null;
        s.eventPhase = null;
        s.fromElement = null;
        s.isTrusted = null;
        s.isTrusted = null;
        s.layerX = null;
        s.layerY = null;
        s.metaKey = null;
        s.movementX = null;
        s.movementY = null;
        s.offsetX = null;
        s.offsetY = null;
        s.pageX = null;
        s.pageY = null;
        s.path = null;
        s.relatedTarget = null;
        s.returnValue = null;
        s.screenX = null;
        s.screenY = null;
        s.shiftKey = null;
        s.srcElement = null;
        s.target = null;
        s.timeStamp = null;
        s.toElement = null;
        s.type = null;
        s.view = null;
        s.which = null;
        s.x = null;
        s.y = null;
        for (var name in json) {
            if (s.hasOwnProperty(name) && name in s) {
                s[name] = json[name];
            }
        }
        s.baseEvent = json;
    };
    MouseEvent.prototype.constructor = MouseEvent;
    TouchEvent.prototype.preventDefault = MouseEvent.prototype.preventDefault = function () {
        this.baseEvent.preventDefault();
    };
    TouchEvent.prototype.stopPropagation = MouseEvent.prototype.stopPropagation = function () {
        this.baseEvent.stopPropagation();
    };
    //移动端点击事件模拟
    var TouchClick = function (target, callback) {
        var s = this;
        s.target = target;
        s.callback = callback;
        s.isDown = false;
        s.touch = [];
        s.touchstart = s.touchstart.bind(s);
        s.touchend = s.touchend.bind(s);
        s.touchmove = s.touchmove.bind(s);
        s.on();
    };
    TouchClick.prototype = {
        touchstart: function (e) {
            var s = this;
            var touch = new Touch(e.changedTouches[0]);
            s.touch.push({
                beyond: false,
                identifier: touch.identifier,
                changedTouches: touch
            });
            s.isDown = true;
        },
        touchmove: function (e) {
            var s = this;
            var index;
            var touch = e.changedTouches;
            if (s.isDown) {
                for (var i = 0; i < touch.length; i++) {
                    index = s.touch.indexOfbeefup(touch[i].identifier, 0, 'identifier');
                    if (index > -1) {
                        if (Math.abs(touch[i].clientX - s.touch[index].changedTouches.clientX) >= 10 || Math.abs(touch[i].clientY - s.touch[index].changedTouches.clientY) >= 10) {
                            s.touch[i].beyond = true;
                        }
                    }
                }
            }
        },
        touchend: function (e) {
            var s = this;
            if (s.isDown) {
                var index = s.touch.indexOfbeefup(e.changedTouches[0].identifier, 0, 'identifier');
                if (index > -1) {
                    if (!s.touch[index].beyond) {
                        var newEvent = new TouchEvent(e);
                        newEvent.type = 'click';
                        newEvent.clientX = e.changedTouches[0].clientX;
                        newEvent.clientY = e.changedTouches[0].clientY;
                        if (s.callback) {
                            s.callback.call(s.target, newEvent);
                        }
                    }
                    s.touch.splice(index, 1);
                }
                if (s.touch.length <= 0) {
                    s.isDown = false;
                }
                e.preventDefault();
            }
        },
        on: function () {
            var s = this;
            s.target.addEventListener('touchstart', s.touchstart);
            s.target.addEventListener('touchend', s.touchend);
            s.target.addEventListener('touchmove', s.touchmove);
        },
        off: function () {
            var s = this;
            s.target.removeEventListener('touchstart', s.touchstart);
            s.target.removeEventListener('touchend', s.touchend);
            s.target.removeEventListener('touchmove', s.touchmove);
        }
    };
    //普通事件处理
    var NormalEvent = function (target, type, callback) {
        var s = this;
        s.type = type;
        s.target = target;
        s.callback = callback;
        s.triggerCallback = s.triggerCallback.bind(s);
        s.on();
    };
    NormalEvent.prototype = {
        triggerCallback: function (e) {
            var s = this;
            var newEvent = e;
            if (Utils.isType(e, 'TouchEvent')) {
                newEvent = new TouchEvent(e);
                newEvent.clientX = e.changedTouches[0].clientX;
                newEvent.clientY = e.changedTouches[0].clientY;
            } else if (Utils.isType(e, 'MouseEvent')) {
                newEvent = new MouseEvent(e);
                newEvent.changedTouches = [];
                newEvent.changedTouches.push(new Touch(e));
            }
            s.callback(newEvent);
        },
        on: function () {
            var s = this;
            s.target.addEventListener(s.type, s.triggerCallback);
        },
        off: function () {
            var s = this;
            s.target.removeEventListener(s.type, s.triggerCallback);
        }
    };
    Window.prototype.on = Document.prototype.on = HTMLElement.prototype.on = function (type, callback) {
        var s = this;
        type = Utils.compEventPcorMobile(type);
        if (type == 'click' && Utils.isSupportTouch) {
            if (!s.__TouchClick__) {
                s.__TouchClick__ = [];
            }
            s.__TouchClick__.push(new TouchClick(s, callback));
            s.addEventListener(type, callback);
        } else {
            if (!s.__NormalEvent__) {
                s.__NormalEvent__ = [];
            }
            s.__NormalEvent__.push(new NormalEvent(s, type, callback));
        }
    };
    Window.prototype.off = Document.prototype.off = HTMLElement.prototype.off = function (type, callback) {
        var s = this;
        var i;
        type = Utils.compEventPcorMobile(type);
        if (type == 'click' && Utils.isSupportTouch) {
            if (s.__TouchClick__ && s.__TouchClick__.length) {
                for (i = 0; i < s.__TouchClick__.length; i++) {
                    if (s.__TouchClick__[i].callback === callback) {
                        s.__TouchClick__[i].off();
                        break;
                    }
                }
            }
            s.removeEventListener(type, callback);
        } else {
            if (s.__NormalEvent__ && s.__NormalEvent__.length) {
                for (i = 0; i < s.__NormalEvent__.length; i++) {
                    if (s.__NormalEvent__[i].type === type && s.__NormalEvent__[i].callback === callback) {
                        s.__NormalEvent__[i].off();
                        break;
                    }
                }
            }
        }
    };
})();