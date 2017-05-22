function Game() {
    var s = this;
    var context = document.createElement('canvas').getContext('2d');
    //图片平滑处理函数名
    s.smoothProperty = Utils.browserPrefixCompatible('imageSmoothingEnabled', context);
    //版本
    s.version = '1.0';
    //设备像素比
    s.devicePixelRatio = window.devicePixelRatio || 1;
    //全局默认渲染选项
    s.defaultRenderOptions = {
        //分辨率
        resolution: s.devicePixelRatio,
        //擦除画布时使用的透明度
        clearAlpha: 1,
        //渲染前擦除画布
        clearBeforeRender: true
    };
    //混合模式
    s.blendModesCanvas = {
        COLOR: 'color',
        COLOR_BURN: 'color-burn',
        COLOR_DODGE: 'color-dodge',
        DARKEN: 'darken',
        DIFFERENCE: 'difference',
        EXCLUSION: 'exclusion',
        HARD_LIGHT: 'hard-light',
        HUE: 'hue',
        LIGHTEN: 'lighten',
        LIGHTER: 'lighter',
        LUMINOSITY: 'luminosity',
        MULTIPLY: 'multiply',
        NORMAL: 'source-over',
        OVERLAY: 'overlay',
        SATURATION: 'saturation',
        SCREEN: 'screen',
        SOFT_LIGHT: 'soft-light'
    };
};
Game = new Game();