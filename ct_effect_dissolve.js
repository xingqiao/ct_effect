/**
 * 溶解特效
 * 	动画名	溶解|dissolve
 * 	初始化参数
 * 		size = 10, // 颗粒大小
 * 		duration = 1500,	// 持续时间
 * 		direct	溶解方向，不传该参数时完全随机
 * 			random|top|bottom|left|right|point
 *
 * @author ct
 * @version 2015-05-27
 * github: https://github.com/xingqiao/ct_effect
 */

; (function (window, document) {
    var opts = {
        size: 10,	// 颗粒大小
        duration: 2000,	// 持续时间
        direct: "random" // 溶解方向
    };
    function _dissolve(params, callback) {
        console.log(params)
        var c = params.canvas, ctx = c.getContext('2d'), w = params.width, h = params.height;
        var minSize = Math.max(opts.size, Math.sqrt(w * h / 2000) | 0),	// 碎片尺寸大于10且总数小于2000
            size = params.size > minSize ? params.size : minSize,
            duration = params.duration > 500 ? params.duration : opts.duration,
            frameCount = Math.ceil((duration - 100) / 16.7);
        var l = w / size;
        var m = h / size;
        // 划分区块
        var chips = [];
        for (var i = 0; i < l; i++) {
            for (var j = 0; j < m; j++) {
                chips.push({
                    x: i * size,
                    y: j * size
                });
            }
        }
        var xPos = params.x;
        var yPos = params.y;
        console.log(xPos, yPos)

        switch (params.direct) {
            case "top":
                chips = chips.sort(function (a, b) { return b.y - a.y });
                break;
            case "bottom":
                chips = chips.sort(function (a, b) { return a.y - b.y });
                break;
            case "left":
                chips.reverse();
                break;
            case "right":
                break;
            case "point":
                chips = chips.sort(function (a, b) {
                    return (Math.abs(xPos - a.x) + Math.abs(yPos - a.y)) - (Math.abs(xPos - b.x) + Math.abs(yPos - b.y))
                });
                break;
            default:
                chips = chips.sort(function () { return Math.random() < .5 ? 1 : -1 });
                break;
        }

        for (var index = 0, length = chips.length; index < length; index++) {
            var chip = chips[index];
            chip.start = frameCount * Math.random() * (index / length);
        }
        console.log(chips)

        chips = chips.sort(function (a, b) { return a.start - b.start });
        var process = 0, pos = 0, tMoniter = 0;
        function _start() {
            process++;
            // 性能低下时通过跳帧来加速动画（安卓QQ音乐客户端）
            var tnow = +new Date();
            if (tnow - tMoniter > 30) {
                process++;
            }
            tMoniter = tnow;
            // 强制触发Repaint
            c.style.color = c.style.color ? '' : '#fff';
            if (pos < chips.length) {
                for (var i = pos; i < chips.length; i++) {
                    var cp = chips[i];
                    if (cp.start <= process) {
                        ctx.clearRect(cp.x, cp.y, size, size);
                        if (process - cp.start > 5) {
                            pos = i + 1;
                        } else {
                            ctx.fillStyle = 'rgba(255,255,255,' + (1 - (process - cp.start) / 10) + ')';
                            ctx.fillRect(cp.x, cp.y, size, size);
                        }
                    } else {
                        break;
                    }
                }
                requestAnimationFrame(_start);
            } else {
                callback && callback();
            }
        };
        _start();
    };
    window.addImgEffect && addImgEffect(['溶解', 'dissolve'], function (callback) {
        _dissolve(this, callback);
    })
})(window, document);
