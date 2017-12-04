Game.Text = function (text, style) {
    var s = this;
    Game.DisplayObject.call(s);
    //每一个Text对象都拥有一个缓存Canvas
    s.canvas = document.createElement('canvas');
    //缓存绘图环境
    s.context = s.canvas.getContext('2d');
    //文本
    s.text = text || '';
    //文本缓存
    s.textCache = '';
    //宽度缓存
    s.widthCache = 0;
    //分辨率
    s.resolution = 1;
    //文本样式
    s.style = {
        //填充样式
        fill: '#000',
        //描边样式
        stroke: '#f00',
        //描边厚度
        strokeThickness: 0,
        /* 自动换行的处理方法
            normal      自动换行
            break-all   允许在单词内换行
        */
        wordBreak: 'normal',
        /* 如何处理字符串内的空白符
            normal      忽略所有空白符、换行符，文本自动换行
            pre         保留所有空白符，文本不会自动换行
            nowrap      忽略所有空白符、换行符，文本不会自动换行
            pre-wrap    保留所有空白符，文本自动换行
            pre-line    忽略空白符序列，保留换行符，文本自动换行
        */
        whiteSpace: 'normal',
        //边角样式(miter(斜角)|round(圆角)|bevel(尖角))
        lineJoin: 'round',
        //行间距
        lineHeight: 20,
        //水平对齐方式(left|center|right)
        textAlign: 'left',
        //垂直对齐方式(top|middle|bottom)
        verticalAlign: 'middle',
        //首行缩进
        textIndent: 0,
        //字体大小
        fontSize: 14,
        //字体样式(normal|italic(斜体)|oblique(没有斜体的字体实现倾斜的文字效果))
        fontStyle: 'normal',
        //字体变体(normal|small-caps(显示小型大写字母的字体))
        fontVariant: 'normal',
        //加粗方式(normal|bold|bolder|lighter|[Number]...)
        fontWeight: 'normal',
        //字体
        fontFamily: '宋体',
        //字间距
        letterSpacing: 0
    };
    //是否发生改动
    s.dirty = false;
    //储存当前文本的行数据
    s._lineData = [];
    //应用文本样式
    s.setStyle(style);
};
Game.Text.prototype = Object.create(Game.DisplayObject.prototype);
Game.Text.prototype.constructor = Game.Text;
//设置文本样式
Game.Text.prototype.setStyle = function (json) {
    var s = this;
    if (json) {
        for (var name in json) {
            if (json.hasOwnProperty(name) && name in s.style) {
                s.style[name] = json[name];
            }
        }
        s.dirty = true;
    }
};
//获取精灵的矩形边界
Game.Text.prototype.getBounds = function () {
    var s = this;
    var fontSize = s.style.fontSize * s.resolution;
    var lineHeight = s.style.lineHeight * s.resolution;
    //应用样式
    if (s.dirty) {
        s.dirty = false;
        s.updateTextLine();
    }
    var height = s._lineData.length * lineHeight;
    var p1 = s.worldTransform.getTransformPoint(0, 0);
    var p2 = s.worldTransform.getTransformPoint(s.width, 0);
    var p3 = s.worldTransform.getTransformPoint(0, height);
    var p4 = s.worldTransform.getTransformPoint(s.width, height);
    var maxX = Math.max(p1.x, p2.x, p3.x, p4.x);
    var maxY = Math.max(p1.y, p2.y, p3.y, p4.y);
    var minX = Math.min(p1.x, p2.x, p3.x, p4.x);
    var minY = Math.min(p1.y, p2.y, p3.y, p4.y);
    return new Game.Rectangle(minX, minY, maxX - minX, maxY - minY);
};
//获取指定宽度可以包含的字符数
Game.Text.prototype.getmaximum = function (str, width) {
    var s = this;
    var tempWidth = 0;
    var length = str.length;
    for (var i = 0; i < length; i++) {
        tempWidth += s.context.measureText(str[i]).width;
        if (i > 0) { tempWidth += s.style.letterSpacing; }
        if (tempWidth > width) { break; }
    }
    return i || 1;
};
//获取指定文本的宽度
Game.Text.prototype.measureText = function (str) {
    var s = this;
    var line;
    var number;
    var width = 0;
    //应用样式
    if (s.dirty) {
        s.dirty = false;
        s.context.font = s.style.fontStyle + ' ' + s.style.fontVariant + ' ' + s.style.fontWeight + ' ' + s.style.fontSize + 'px ' + s.style.fontFamily;
    }
    //计算宽度
    line = str.split(/(?:\r\n|\r|\n)/i);
    for (i = 0; i < line.length; i++) {
        number = s.context.measureText(line[i]).width + s.style.letterSpacing * (line[i].length - 1);
        width = Math.max(number, width);
    }
    //返回宽度
    return width;
};
//更新文本行数据
Game.Text.prototype.updateTextLine = function () {
    var s = this;
    var fontSize = s.style.fontSize * s.resolution;
    var lineHeight = s.style.lineHeight * s.resolution;
    var containerWidth = s.width * s.resolution;
    s._lineData = [];
    //应用样式
    s.context.font = s.style.fontStyle + ' ' + s.style.fontVariant + ' ' + s.style.fontWeight + ' ' + fontSize + 'px ' + s.style.fontFamily;
    //拆分行
    s.splitTextLine();
    //设置单字符数据
    var wordX, startX, startY, textlen, wordData;
    //根据垂直对齐方式计算开始位置
    switch (s.style.verticalAlign) {
        case 'top': startY = 0; break;
        case 'middle': startY = lineHeight / 2; break;
        case 'bottom': startY = lineHeight; break;
    }
    s._lineData.forEach(function (item, i, z) {
        wordX = 0;
        textlen = item.text.length;
        item.y = i * lineHeight;
        item.width = containerWidth;
        item.height = lineHeight;
        //item.select = true;
        item.contentWidth = Math.round(s.context.measureText(item.text).width + s.style.letterSpacing * (textlen - 1));
        //根据水平对齐方式计算水平基线位置
        switch (s.style.textAlign) {
            case 'left': startX = 0; break;
            case 'center': startX = containerWidth / 2 - item.contentWidth / 2; break;
            case 'right': startX = containerWidth - item.contentWidth; break;
        }
        if (i === 0 && s.style.textAlign !== 'right') {
            startX += s.style.textIndent;
        }
        //创建单字符数据
        for (z = 0; z < textlen; z++) {
            wordData = new Game.TextWord(item.text[z]);
            wordData.x = startX + wordX;
            wordData.y = startY + i * lineHeight;
            wordData.width = s.context.measureText(item.text[z]).width + s.style.letterSpacing;
            wordData.height = s.style.fontSize;
            item.word.push(wordData);
            wordX += wordData.width;
        }
    });
};
//拆分文本
Game.Text.prototype.splitTextLine = function () {
    var s = this;
    var res, word, index, indent, lineData, indexList, startIndex;
    var splitWord = /([ ])|([!"#$%&'*+,-.:;=?~)}>\]\\][(<{\[])|([\u2e80-\ua4c6\uac00-\ud7a3\uf900-\ufad9\ufe10-\ufe19\ufe30-\ufe6b\uff01-\uff60])/g;
    var containerWidth = s.width * s.resolution;
    switch (s.style.whiteSpace) {
        case 'pre':
            var lineList = s.text.split(/(?:[\r\n])/ig);
            lineList.forEach(function (item, i) {
                lineData = new Game.TextLine();
                lineData.text = item;
                s._lineData.push(lineData);
            });
            break;
        case 'nowrap':
            var lineList = [s.text.replace(/\s+/g, ' ')];
            lineList.forEach(function (item, i) {
                lineData = new Game.TextLine();
                lineData.text = item.replace(/^\s+/g, '');
                s._lineData.push(lineData);
            });
            break;
        default:
            if (s.style.whiteSpace === 'normal') {
                s.text = s.text.replace(/^\s+/g, '').replace(/[\n\r]+/g, '').replace(/\s+/g, ' ');
            }
            var lineList = s.text.split(/(?:[\r\n])/ig);
            lineList.forEach(function (item, i) {
                switch (s.style.whiteSpace) {
                    case 'normal':
                    case 'pre-line':
                        item = item.replace(/^\s+/g, '');
                        break;
                }
                lineList[i] = item;
                //创建行数据
                if (item === '') {
                    lineData = new Game.TextLine();
                    lineData.text = item;
                    s._lineData.push(lineData);
                } else {
                    switch (s.style.wordBreak) {
                        case 'normal':
                            index = 0;
                            indexList = [0];
                            startIndex = 0;
                            //拆分单词
                            while (res = splitWord.exec(item)) {
                                if (indexList[index] !== res.index) {
                                    indexList.push(res.index);
                                    index++;
                                }
                                indexList.push(res.index + 1);
                                index++;
                            }
                            indexList.push(item.length);
                            index = 0;
                            while (index < indexList.length) {
                                indent = s._lineData.length > 0 ? 0 : s.style.textIndent;
                                if (indexList.length === 0) {
                                    s._lineData.push(s.newLineData(item));
                                } else if (s.context.measureText(item.substring(indexList[startIndex], indexList[index])).width + indent > containerWidth) {
                                    if (startIndex === index - 1) {
                                        lineData = s.newLineData(item.substring(indexList[startIndex], indexList[index]));
                                        s._lineData.push(lineData);
                                        startIndex = index - 1;
                                    } else {
                                        lineData = s.newLineData(item.substring(indexList[startIndex], indexList[index - 1]));
                                        s._lineData.push(lineData);
                                        startIndex = index - 1;
                                        index -= 1;
                                    }
                                } else if (index === indexList.length - 1) {
                                    lineData = s.newLineData(item.substring(indexList[startIndex], indexList[index]));
                                    s._lineData.push(lineData);
                                }
                                index++;
                            }
                            break;
                        case 'break-all':
                            while (item) {
                                indent = s._lineData.length > 0 ? 0 : s.style.textIndent;
                                index = s.getmaximum(item, containerWidth - indent);
                                lineData = s.newLineData(item.substr(0, index));
                                s._lineData.push(lineData);
                                item = item.substr(index);
                            }
                            break;
                    }
                }
            });
            break;
    }
};
//创建行数据
Game.Text.prototype.newLineData = function (text) {
    var s = this;
    var lineData = new Game.TextLine();
    switch (s.style.whiteSpace) {
        case 'normal':
        case 'pre-line':
            text = text.replace(/^\s+/g, '');
            break;
    }
    lineData.text = text;
    return lineData;
};
//更新缓存画布
Game.Text.prototype.updateCacheCanvas = function (resolution) {
    var s = this;
    var width = s.width * s.resolution;
    var fontSize = s.style.fontSize * s.resolution;
    var lineHeight = s.style.lineHeight * s.resolution;
    var canvasWidth = 0;
    s._lineData.forEach(function (item) {
        canvasWidth = Math.max(canvasWidth, item.width);
    });
    s.canvas.width = canvasWidth;
    s.canvas.height = Math.max(fontSize, s._lineData.length * lineHeight);
    s.context.clearRect(0, 0, s.canvas.width, s.canvas.height);
    //应用文本样式
    s.context.lineJoin = s.style.lineJoin;
    s.context.lineWidth = s.style.strokeThickness;
    s.context.textAlign = 'left';
    s.context.textBaseline = s.style.verticalAlign;
    s.context.font = s.style.fontStyle + ' ' + s.style.fontVariant + ' ' + s.style.fontWeight + ' ' + fontSize + 'px ' + s.style.fontFamily;
    //绘制背景
    s.context.fillStyle = 'rgba(0, 115, 255, 0.8)';
    s._lineData.forEach(function (line) {
        if (line.select) {
            s.context.fillRect(line.x, line.y, line.width, line.height);
        } else {
            line.word.forEach(function (word) {
                if (word.select) {
                    s.context.fillRect(word.x, line.y, item.width, item.height);
                }
            });
        }
    });
    s._lineData.forEach(function (line) {
        line.word.forEach(function (word) {
            if (line.select || word.select) {
                s.context.fillStyle = '#fff';
                s.context.strokeStyle = '#fff';
            } else {
                s.context.fillStyle = s.style.fill;
                s.context.strokeStyle = s.style.stroke;
            }
            if (s.style.strokeThickness > 0) { s.context.strokeText(word.text, word.x, word.y); }
            s.context.fillText(word.text, word.x, word.y);
        });
    });
    s.height = s._lineData.length * s.style.lineHeight;
};
//使用Canvas渲染器渲染对象
Game.Text.prototype._renderCanvas = function (renderSession) {
    var s = this;
    //检测对象是否需要渲染
    if (!s.visible || !s.alpha) {
        return;
    }
    //应用混合模式
    if (s.blendModes !== renderSession.blendModes) {
        renderSession.blendModes = s.blendModes;
        s.context.globalCompositeOperation = s.blendModes;
    }
    //透明度
    renderSession.context.globalAlpha = s.worldAlpha;
    //像素插值
    if (renderSession.roundPixels) {
        renderSession.context.setTransform(
            s.worldTransform.a,
            s.worldTransform.b,
            s.worldTransform.c,
            s.worldTransform.d,
            s.worldTransform.tx * renderSession.resolution,
            s.worldTransform.ty * renderSession.resolution);
    } else {
        renderSession.context.setTransform(
            s.worldTransform.a,
            s.worldTransform.b,
            s.worldTransform.c,
            s.worldTransform.d,
            (s.worldTransform.tx * renderSession.resolution) | 0,
            (s.worldTransform.ty * renderSession.resolution) | 0);
    }
    //检测属性是否发生变化
    if (!s.dirty) {
        if (s.text !== s.textCache) {
            s.dirty = true;
            s.textCache = s.text;
        }
        if ((s.width !== s.widthCache && s.style.s === 'normal')) {
            s.dirty = true;
            s.widthCache = s.width;
        }
    }
    if (s.dirty) {
        s.dirty = false;
        s.resolution = renderSession.resolution;
        s.updateTextLine();
        s.updateCacheCanvas();
    }
    renderSession.context.drawImage(
            s.canvas,
            0,
            0,
            s.canvas.width,
            s.canvas.height);
};



