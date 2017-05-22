//交互处理
Game.Interaction = function (stage) {
    var s = this;
    //舞台
    s.stage = stage;
    //渲染器
    s.renderer = null;
    //标记是否按下
    s.isAreaDown = false;
    //记录按下时的目标精灵
    s.hitTargetSprite = null;
    //记录按下时的坐标位置
    s.hitTargetPoint = new Game.Point();
    //记录按下的时间
    s.hitTime = 0;
    //记录上一次单击的时间
    s.lastClickTime = 0;
    //当前获得焦点的精灵
    s.currentFocusSprite = null;
    //设置函数上下文
    s.onDown = s.onDown.bind(s);
    s.onMove = s.onMove.bind(s);
    s.onUp = s.onUp.bind(s);
    s.onKeyDown = s.onKeyDown.bind(s);
    s.onKeyUp = s.onKeyUp.bind(s);
    s.onMouseWheel = s.onMouseWheel.bind(s);

    s.setFocus(stage);
};
Game.Interaction.prototype.constructor = Game.Interaction;
//销毁
Game.Interaction.prototype.destroy = function () {
    var s = this;
    s.onDown = null;
    s.onMove = null;
    s.onUp = null;
    s.onKeyDown = null;
    s.onKeyUp = null;
    s.onMouseWheel = null;
    window.off('mousemove', s.onMove);
    window.off('mouseup', s.onUp);
    s.renderer.canvas.off('mousedown', s.onDown);
    s.renderer.canvas.off('mousewheel', s.onMouseWheel);
    s.renderer.canvas.off('keydown', s.onKeyDown);
    s.renderer.canvas.off('keyup', s.onKeyUp);
    s.renderer.canvas.off('click', s.renderer.canvas._GameFocus);
    s.renderer.canvas.off('focus', s.renderer.canvas._GameFocus);
    s.renderer.canvas.off('blur', s.renderer.canvas._GameBlur);
    s.renderer.canvas.setAttribute('tabindex', '');
    s.renderer.canvas._GameFocus = null;
    s.renderer.canvas._GameBlur = null;
    s.renderer.canvas.removeEventListener('DOMMouseScroll', s.onMouseWheel);
    Utils.DisableMouseRight(s.renderer.canvas, true);
    s.stage = null;
    s.renderer = null;
};
//设置当前焦点
Game.Interaction.prototype.setFocus = function (sprite) {
    var s = this;
    if (sprite) {
        s.currentFocusSprite = sprite;
    }
};
//设置渲染器
Game.Interaction.prototype.setRenderer = function (renderer) {
    var s = this;
    if (!renderer.canvas.parentNode) {
        throw new Error('必须将"Renderer.canvas"加入到DOM环境中!');
    }
    if (s.renderer) {
        if (s.renderer !== renderer) {
            //删除事件
            window.off('mousemove', s.onMove);
            window.off('mouseup', s.onUp);
            s.renderer.canvas.off('mousedown', s.onDown);
            s.renderer.canvas.off('mousewheel', s.onMouseWheel);
            s.renderer.canvas.off('keydown', s.onKeyDown);
            s.renderer.canvas.off('keyup', s.onKeyUp);
            s.renderer.canvas.off('mousedown', s.renderer.canvas._GameFocus);
            s.renderer.canvas.off('focus', s.renderer.canvas._GameFocus);
            s.renderer.canvas.off('blur', s.renderer.canvas._GameBlur);
            s.renderer.canvas.setAttribute('tabindex', '');
            s.renderer.canvas._GameFocus = null;
            s.renderer.canvas._GameBlur = null;
            s.renderer.canvas.removeEventListener('DOMMouseScroll', s.onMouseWheel);
            Utils.DisableMouseRight(s.renderer.canvas, true);
        } else {
            return;
        }
    }
    s.renderer = renderer;
    s.renderer.canvas.setAttribute('tabindex', '0');
    s.renderer.canvas._GameFocus = function () {
        this.focus();
        this.style.opacity = '1';
    }.bind(s.renderer.canvas);
    s.renderer.canvas._GameBlur = function () {
        this.style.opacity = '.5';
    }.bind(s.renderer.canvas);
    //绑定事件
    window.on('mousemove', s.onMove);
    window.on('mouseup', s.onUp);
    s.renderer.canvas.on('mousedown', s.onDown);
    s.renderer.canvas.on('mousewheel', s.onMouseWheel);
    s.renderer.canvas.on('keydown', s.onKeyDown);
    s.renderer.canvas.on('keyup', s.onKeyUp);
    s.renderer.canvas.on('mousedown', s.renderer.canvas._GameFocus);
    s.renderer.canvas.on('focus', s.renderer.canvas._GameFocus);
    s.renderer.canvas.on('blur', s.renderer.canvas._GameBlur);
    s.renderer.canvas.focus();
    s.renderer.canvas.addEventListener('DOMMouseScroll', s.onMouseWheel);
    Utils.DisableMouseRight(s.renderer.canvas, false);
};
//创建事件对象
Game.Interaction.prototype.createEvent = function (json) {
    var s = this;
    //获取传播路径
    var path = [];
    var temp = json.object;
    while (temp) {
        path.push(temp);
        temp = temp.parent;
    }
    json.path = path;
    json.stage = s.stage;
    json.target = json.object;
    json.currentTarget = null;
    //创建事件对象
    var interaEvent = new Game.InteractionEvent();
    interaEvent.init(json.originalEvent).init(json);
    return interaEvent;
};
//派发事件
Game.Interaction.prototype.dispatchEvent = function (interaEvent) {
    var path = interaEvent.path;
    //派送捕获阶段事件
    interaEvent.eventPhase = 1;
    for (var i = path.length - 1; i >= 0; i--) {
        interaEvent.currentTarget = path[i];
        path[i].dispatchEvent(interaEvent.type, interaEvent, interaEvent.eventPhase);
        if (interaEvent.propagationStop) {
            interaEvent.propagationStop = false;
            break;
        }
    }
    //派送冒泡阶段事件
    interaEvent.eventPhase = 2;
    for (i = 0; i < path.length; i++) {
        interaEvent.currentTarget = path[i];
        path[i].dispatchEvent(interaEvent.type, interaEvent, interaEvent.eventPhase);
        if (interaEvent.propagationStop) {
            interaEvent.propagationStop = false;
            break;
        }
    }
};
//判断对象是否包含坐标
Game.Interaction.prototype.containsPosition = function (sprite, x, y) {
    var s = this;
    var object;
    var isContains;
    if (sprite.getBounds().contains(x, y)) {
        isContains = true;
        object = sprite.parent;
        while (object) {
            if (!object.getBounds().contains(x, y)) {
                isContains = false;
                break;
            }
            object = object.parent;
        }
    }
    return isContains;
};
//获取舞台中所有显示对象
Game.Interaction.prototype.getDisplayObject = function () {
    var s = this;
    var list = [];
    //获取舞台中所有子孙显示对象
    !function (object) {
        for (var i = 0; i < object.children.length; i++) {
            if (object.children[i].visible) {
                list.push(object.children[i]);
                if (object.children[i].children) {
                    arguments.callee(object.children[i]);
                }
            }
        }
    }(s.stage);
    list.splice(0, 0, Game.Window, s.stage);
    return list;
};
//按下
Game.Interaction.prototype.onDown = function (e) {
    var s = this;
    var interaEvent;
    var touches = [];
    var clientRect = s.renderer.canvas.getBoundingClientRect();
    var clientX = e.clientX - clientRect.left;
    var clientY = e.clientY - clientRect.top;
    touches[0] = new Game.Touch().init(e.changedTouches[0]);
    touches[0].clientX = clientX;
    touches[0].clientY = clientY;
    var list = s.getDisplayObject();
    for (var i = list.length - 1; i >= 0; i--) {
        if (s.containsPosition(list[i], clientX, clientY)) {
            //派送down(按下)事件
            interaEvent = s.createEvent({
                type: 'down',
                object: list[i],
                touches: touches,
                clientX: clientX,
                clientY: clientY,
                originalEvent: e
            });
            s.dispatchEvent(interaEvent);
            break;
        }
    }
    if (interaEvent) {
        s.hitTime = Date.now();
        s.hitTargetSprite = interaEvent.path[0];
        s.hitTargetPoint.set(interaEvent.clientX, interaEvent.clientY);
    }
    if (/mouse/i.test(e.type)) { s.isAreaDown = true; }
    if (/touch/i.test(e.type)) {
        if (interaEvent) {
            s.isAreaDown = true;
            interaEvent.path[0]._over = true;
            //派送over(进入)事件
            interaEvent = s.createEvent({
                type: 'over',
                object: interaEvent.path[0],
                touches: touches,
                clientX: clientX,
                clientY: clientY,
                originalEvent: e
            });
            s.dispatchEvent(interaEvent);
        }
    }
    if (e.target === s.renderer.canvas) { e.preventDefault(); }
};
//移动
Game.Interaction.prototype.onMove = function (e) {
    var s = this;
    var i, j;
    var target;
    var clientX;
    var clientY;
    var interaEvent;
    var touches = [];
    var clientRect = s.renderer.canvas.getBoundingClientRect();
    for (i = 0; i < e.changedTouches.length; i++) {
        touches[i] = new Game.Touch().init(e.changedTouches[i]);
        touches[i].clientX -= clientRect.left;
        touches[i].clientY -= clientRect.top;
    }
    var list = s.getDisplayObject();
    for (i = 0; i < touches.length; i++) {
        clientX = touches[i].clientX;
        clientY = touches[i].clientY;
        //捕捉第一个包涵该点的精灵
        for (j = list.length - 1; j >= 0; j--) {
            if (s.containsPosition(list[j], clientX, clientY)) {
                target = list[j];
                break;
            }
        }
        if (!s.isAreaDown) {
            for (j = list.length - 1; j >= 0; j--) {
                if (list[j]._over || list[j] === target) {
                    if (!s.containsPosition(list[j], clientX, clientY)) {
                        //派送out(离开)事件
                        list[j]._over = false;
                        interaEvent = s.createEvent({
                            type: 'out',
                            object: list[j],
                            touches: touches,
                            clientX: clientX,
                            clientY: clientY,
                            originalEvent: e
                        });
                        s.dispatchEvent(interaEvent);
                        break;
                    }
                }
            }
        }
        if (target) {
            //派送move事件
            interaEvent = s.createEvent({
                type: 'move',
                object: target,
                touches: touches,
                clientX: clientX,
                clientY: clientY,
                originalEvent: e
            });
            s.dispatchEvent(interaEvent);

            var path = interaEvent.path;
            for (j = 0; j < path.length; j++) {
                if (path[j]._over) {
                    break;
                } else {
                    if (!s.isAreaDown) {
                        for (z = list.length - 1; z >= 0; z--) {
                            if (list[z]._over) {
                                //派送out(离开)事件
                                list[z]._over = false;
                                interaEvent = s.createEvent({
                                    type: 'out',
                                    object: list[z],
                                    touches: touches,
                                    clientX: clientX,
                                    clientY: clientY,
                                    originalEvent: e
                                });
                                s.dispatchEvent(interaEvent);
                                break;
                            }
                        }
                        //派送over(加入)事件
                        path[j]._over = true;
                        interaEvent = s.createEvent({
                            type: 'over',
                            object: path[j],
                            touches: touches,
                            clientX: clientX,
                            clientY: clientY,
                            originalEvent: e
                        });
                        s.dispatchEvent(interaEvent);
                        if (/touch/i.test(e.type)) { s.isAreaDown = true; }
                    }
                    break;
                }
            }
        }
    }
    if (e.target === s.renderer.canvas) { e.preventDefault(); }
};
//放开
Game.Interaction.prototype.onUp = function (e) {
    var s = this;
    var interaEvent;
    var touches = [];
    var clientRect = s.renderer.canvas.getBoundingClientRect();
    var clientX = e.clientX - clientRect.left;
    var clientY = e.clientY - clientRect.top;
    touches[0] = new Game.Touch().init(e.changedTouches[0]);
    touches[0].clientX = clientX;
    touches[0].clientY = clientY;
    var list = s.getDisplayObject();
    for (var i = list.length - 1; i >= 0; i--) {
        if (s.containsPosition(list[i], clientX, clientY)) {
            interaEvent = s.createEvent({
                type: 'up',
                object: list[i],
                touches: touches,
                clientX: clientX,
                clientY: clientY,
                originalEvent: e
            });
            s.dispatchEvent(interaEvent);
            break;
        }
    }
    if (e.type === 'touchend') {
        for (i = list.length - 1; i >= 0; i--) {
            if (list[i]._over) {
                //派送out(离开)事件
                list[i]._over = false;
                interaEvent = s.createEvent({
                    type: 'out',
                    object: list[i],
                    touches: touches,
                    clientX: clientX,
                    clientY: clientY,
                    originalEvent: e
                });
                s.dispatchEvent(interaEvent);
            }
        }
    }
    if (interaEvent) {
        if (interaEvent.path[0] === s.hitTargetSprite) {
            if (/touch/i.test(e.type)) {
                if (Math.abs(interaEvent.clientX - s.hitTargetPoint.x) >= 10 || Math.abs(interaEvent.clientY - s.hitTargetPoint.y) >= 10) {
                    return;
                }
            }
            //派送longclick(长按)事件
            if (Date.now() - s.hitTime > 500) {
                interaEvent = s.createEvent({
                    type: 'longclick',
                    object: interaEvent.path[0],
                    touches: touches,
                    clientX: clientX,
                    clientY: clientY,
                    originalEvent: e
                });
                s.dispatchEvent(interaEvent);
            } else {
                //派送click(单击)事件
                interaEvent = s.createEvent({
                    type: 'click',
                    object: interaEvent.path[0],
                    touches: touches,
                    clientX: clientX,
                    clientY: clientY,
                    originalEvent: e
                });
                s.dispatchEvent(interaEvent);
                //派送dblclick(双击)事件
                if (Date.now() - s.lastClickTime < 200) {
                    interaEvent = s.createEvent({
                        type: 'dblclick',
                        object: interaEvent.path[0],
                        touches: touches,
                        clientX: clientX,
                        clientY: clientY,
                        originalEvent: e
                    });
                    s.dispatchEvent(interaEvent);
                }
                s.lastClickTime = Date.now();
            }
        }
    }
    if (e.target === s.renderer.canvas) { e.preventDefault(); }
    s.isAreaDown = false;
};
//键盘按下
Game.Interaction.prototype.onKeyDown = function (e) {
    var s = this;
    var list = s.getDisplayObject();
    var index = list.indexOf(s.currentFocusSprite);
    if (index !== -1) {
        var path = [];
        var temp = list[index];
        var keyEvent = new Game.KeyboardEvent();
        while (temp) {
            path.push(temp);
            temp = temp.parent;
        }
        //派送keydown(键盘按下)事件
        keyEvent.init(e);
        keyEvent.init({
            path: path,
            type: 'keydown',
            stage: s.stage,
            target: list[index],
            currentTarget: list[index],
            originalEvent: e
        });
        s.dispatchEvent(keyEvent);
    }
    e.preventDefault();
};
//键盘放开
Game.Interaction.prototype.onKeyUp = function (e) {
    var s = this;
    var list = s.getDisplayObject();
    var index = list.indexOf(s.currentFocusSprite);
    if (index !== -1) {
        var path = [];
        var temp = list[index];
        var keyEvent = new Game.KeyboardEvent();
        while (temp) {
            path.push(temp);
            temp = temp.parent;
        }
        //派送keyup(键盘放开)事件
        keyEvent.init(e);
        keyEvent.init({
            path: path,
            type: 'keyup',
            stage: s.stage,
            target: list[index],
            currentTarget: list[index],
            originalEvent: e
        });
        s.dispatchEvent(keyEvent);
    }
    e.preventDefault();
};
//鼠标滚轮
Game.Interaction.prototype.onMouseWheel = function (e) {
    var s = this;
    var wheelDeltaX = e.wheelDeltaX || 0;
    var wheelDeltaY = e.wheelDeltaY || 0;
    var wheelDeltaZ = e.wheelDeltaZ || 0;
    var clientRect = s.renderer.canvas.getBoundingClientRect();
    var clientX = e.clientX - clientRect.left;
    var clientY = e.clientY - clientRect.top;
    //火狐兼容
    if (Utils.moz.browser === 'firefox') { wheelDeltaY = (-e.detail) || 0;}
    if (wheelDeltaX > 0) { wheelDeltaX = 120; }
    else if (wheelDeltaX < 0) { wheelDeltaX = -120; }
    if (wheelDeltaY > 0) { wheelDeltaY = 120; }
    else if (wheelDeltaY < 0) { wheelDeltaY = -120; }
    if (wheelDeltaZ > 0) { wheelDeltaZ = 120; }
    else if (wheelDeltaZ < 0) { wheelDeltaZ = -120; }

    var list = s.getDisplayObject();
    for (var i = list.length - 1; i >= 0; i--) {
        if (s.containsPosition(list[i], clientX, clientY)) {
            var path = [];
            var temp = list[i];
            var wheelEvent = new Game.WheelEvent();
            while (temp) {
                path.push(temp);
                temp = temp.parent;
            }
            //派送mousewheel(鼠标滚轮)事件
            wheelEvent.init(e);
            wheelEvent.init({
                path: path,
                type: 'mousewheel',
                stage: s.stage,
                target: list[i],
                clientX: clientX,
                clientY: clientY,
                wheelDeltaX: wheelDeltaX,
                wheelDeltaY: wheelDeltaY,
                wheelDeltaZ: wheelDeltaZ,
                currentTarget: null,
                originalEvent: e
            });
            s.dispatchEvent(wheelEvent);
            break;
        }
    }
    if (e.target === s.renderer.canvas) { e.preventDefault(); }
};
