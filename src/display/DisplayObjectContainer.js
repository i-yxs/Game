Game.DisplayObjectContainer = function () {
    var s = this;
    Game.DisplayObject.call(s);
    //子节点数组的容器
    s.children = [];
};
Game.DisplayObjectContainer.prototype = Object.create(Game.DisplayObject.prototype);
Game.DisplayObjectContainer.prototype.constructor = Game.DisplayObjectContainer;
//更新矩阵
Game.DisplayObjectContainer.prototype.updateTransform = function () {
    var s = this;
    s.DisplayObjectUpdateTransform();
    //更新子节点矩阵
    if (s.children.length > 0) {
        for (var i = 0; i < s.children.length; i++) {
            s.children[i].updateTransform();
        }
    }
};
//添加一个子节点到容器
Game.DisplayObjectContainer.prototype.addChild = function (child) {
    var s = this;
    s.addChildAt(child, s.children.length);
};
//添加一个子节点到容器指定索引位置
Game.DisplayObjectContainer.prototype.addChildAt = function (child, index) {
    var s = this;
    if (child) {
        if (s.children.indexOf(child) === -1) {
            if (index >= 0 && index <= s.children.length) {
                child.parent = s;
                s.children.splice(index, 0, child);
            } else {
                throw new Error('索引：' + index + ' 超出范围，最大可设置索引为' + s.children.length);
            }
        } else {
            throw new Error('该节点已存在！');
        }
    } else {
        throw new Error('参数错误！');
    }
};
//删除指定范围内的子节点
Game.DisplayObjectContainer.prototype.removeChild = function (child) {
    var s = this;
    var index = s.children.indexOf(child);
    if (index !== -1) {
        s.children.splice(index, 1);
    }
};
//删除一个指定索引子节点
Game.DisplayObjectContainer.prototype.removeChildAt = function (index) {
    var s = this;
    if (index >= 0 && index <= s.children.length) {
        s.children.splice(index, 1);
    } else {
        throw new Error('位置' + index + '超出范围' + s.children.length);
    }
};
//删除指定范围内的子节点
Game.DisplayObjectContainer.prototype.removeChildIndex = function (beginIndex, endIndex) {
    var s = this;
    var begin = beginIndex || 0;
    var end = endIndex || s.children.length;
    var range = end - begin;
    return s.children.splice(begin, range);
};
//交换两个指定子节点的索引位置
Game.DisplayObjectContainer.prototype.swapChild = function (child, child2) {
    var s = this;
    var index = s.children.indexOf(child);
    var index2 = s.children.indexOf(child2);
    s.swapChildAt(index, index2);
};
//交换两个指定索引的子节点位置
Game.DisplayObjectContainer.prototype.swapChildAt = function (index, index2) {
    var s = this;
    if (index < 0 || index2 < 0) {
        throw new Error('必须为该节点的子节点');
    } else {
        var child = s.children[index];
        var child2 = s.children[index2];
        s.children[index] = child2;
        s.children[index2] = child;
    }
};
//获取指定子节点的索引位置
Game.DisplayObjectContainer.prototype.getChildIndex = function (child) {
    var s = this;
    return s.children.indexOf(child);
};
//设置指定子节点的索引位置
Game.DisplayObjectContainer.prototype.setChildIndex = function (child, index) {
    var s = this;
    if (index >= 0 && index <= s.children.length) {
        s.children.splice(s.children.indexOf(child), 1);
        s.children.splice(index, 0, child);
    } else {
        throw new Error('位置' + index + '超出范围' + s.children.length);
    }
};
//获取指定索引的子节点
Game.DisplayObjectContainer.prototype.getChildAt = function (index) {
    var s = this;
    if (index >= 0 && index <= s.children.length) {
        return s.children[index];
    } else {
        throw new Error('位置' + index + '超出范围' + s.children.length);
    }
};
