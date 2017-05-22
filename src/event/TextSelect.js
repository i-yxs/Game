//文本选择功能
Game.TextSelect = function () {
    var s = this;
    //开始数据
    s.beginData = [];
    //结束数据
    s.toData = [];
    //标记鼠标是否按下
    s.isDown = false;
    //按下的坐标
    s.downPoint = new Game.Point();

    s.onUp = s.onUp.bind(s);
    s.onDown = s.onDown.bind(s);
    s.onMove = s.onMove.bind(s);
    s.onKeyDown = s.onKeyDown.bind(s)

    Game.Window.on('up', s.onUp);
    Game.Window.on('down', s.onDown);
    Game.Window.on('move', s.onMove);
    Game.Window.on('keydown', s.onKeyDown);
};
//销毁
Game.TextSelect.prototype.destroy = function () {
    var s = this;
    Game.Window.off('up', s.onUp);
    Game.Window.off('down', s.onDown);
    Game.Window.off('move', s.onMove);
    Game.Window.off('keydown', s.onKeyDown);
    s.onUp = null;
    s.onDown = null;
    s.onMove = null;
    s.onKeyDown = null;
};
Game.TextSelect.prototype.onUp = function (e) {
    var s = this;
    s.isDown = true;
    s.downPoint.set(e.clientX, e.clientY);
};
Game.TextSelect.prototype.onDown = function (e) {
    var s = this;

};
Game.TextSelect.prototype.onMove = function (e) {
    var s = this;

};
Game.TextSelect.prototype.onKeyDown = function (e) {
    var s = this;

};

Game.Text.prototype._selectText = function () {
    var s = this;
    var clientX;
    var clientY;
    var isDown = false;
    var down = new Game.Point();
    //鼠标按下事件处理
    var onDown = function (e) {
        var s = this;
        isDown = true;
        modifiedPosition(e);
        down.set(clientX, clientY);
        restoreWordSelect();
        s.updateCacheCanvas();
    };
    //鼠标移动事件处理
    var onMove = function (e) {
        var s = this;
        modifiedPosition(e);
        if (isDown) {
            selectTextDispose();
        } else {
            cursorDispose();
        }
    };
    //鼠标放开事件处理
    var onUp = function (e) {
        var s = this;
        if (isDown) {
            isDown = false;
        }
    };
    //鼠标离开事件处理
    var onOut = function (e) {
        var s = this;
        if (!isDown) {
            document.body.style.cursor = '';
        }
    };
    //修正坐标
    var modifiedPosition = function (e) {
        clientX = e.clientX - s.position.x;
        clientY = e.clientY - s.position.y;
        //修正位置
        switch (s.style.verticalAlign) {
            case 'middle':
                clientY += s.style.fontSize / 2;
                break;
            case 'bottom':
                clientY += s.style.fontSize;
                break;
        }
    };
    //处理鼠标光标
    var cursorDispose = function () {
        var target;
        var length = s._wordData.length;
        for (var i = 0; i < length; i++) {
            if (s._wordData[i].contains(clientX, clientY)) {
                target = s._wordData[i];
                break;
            }
        }
        if (target) {
            document.body.style.cursor = 'text';
        } else {
            document.body.style.cursor = '';
        }
    };
    //处理文字选择
    var selectTextDispose = function () {
        var i, temp;
        var firstIndex = -1;
        var lastIndex = -1;
        var length = s._wordData.length;

        for (i = 0; i < length; i++) {
            if (s._wordData[i].contains(down.x, down.y)) {
                firstIndex = i;
            }
            if (s._wordData[i].contains(clientX, clientY)) {
                lastIndex = i;
            }
        }
        restoreWordSelect();
        for (i = firstIndex; i <= lastIndex; i++) {
            s._wordData[i].select = true;
        }
        s.updateCacheCanvas();
        document.body.style.cursor = 'text';
    };
    //还原所有单字的选择状态
    var restoreWordSelect = function () {
        var length = s._wordData.length;
        for (i = 0; i < length; i++) {
            s._wordData[i].select = false;
        }
    };

    s.on('out', onOut);
    s.on('down', onDown);
    s.on('move', onMove);
    s.on('up', onUp);
};