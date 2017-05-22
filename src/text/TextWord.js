Game.TextWord = function (text) {
    var s = this;
    Game.Rectangle.call(s);
    //类型
    s.type = 'TextWord';
    //文本
    s.text = text || '';
    //是否选中
    s.select = false;
};
Game.TextWord.prototype = Object.create(Game.Rectangle.prototype);
Game.TextWord.prototype.constructor = Game.TextWord;