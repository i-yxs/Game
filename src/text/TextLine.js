Game.TextLine = function () {
    var s = this;
    Game.Rectangle.call(s);
    //类型
    s.type = 'TextLine';
    //字符串
    s.text = '';
    //字符数据列表
    s.word = [];
    //是否选中
    s.select = false;
    //内容宽度
    s.contentWidth = 0;
};
Game.TextLine.prototype = Object.create(Game.Rectangle.prototype);
Game.TextLine.prototype.constructor = Game.TextLine;