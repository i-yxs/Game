function FPS(color) {
    var s = this;
    s.color = color || '#fff';
    s.totalTime = 0;
    s.animTime = 0;
    s.frames = 0;
    s.fps = 0;
};
FPS.prototype.constructor = FPS.ImageData;
FPS.prototype.update = function (renderer) {
    var s = this;
    var curr = Date.now();
    s.totalTime += curr - s.animTime;
    s.animTime = curr;
    s.frames++;
    if (s.totalTime >= 1000) {
        fps = (1000 * s.frames / s.totalTime).toFixed(1);
        s.totalTime = s.frames = 0;
    }
    renderer.context.setTransform(1, 0, 0, 1, 0, 0);
    renderer.context.fillStyle = s.color;
    renderer.context.font = '' + (30 * renderer.resolution) + 'px Arial';
    renderer.context.fillText(fps, 10, 30 * renderer.resolution);
};