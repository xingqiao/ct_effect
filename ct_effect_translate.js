/**
 * 平移特效
 * 	动画名	平移|translate
 * 	初始化参数
 * 		direct	平移方向，不传该参数时会根据滑动方向自动判断，点击时默认为left
 * 			top|bottom|left|right
 * 		mode	模式，默认3d
 * 			2d|3d
 * 		duration = 1500,	// 持续时间
 * 		timing-function	变换的速率变化，默认ease-in
 * 			ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier(<number>, <number>, <number>, <number>)
 *
 * @author ct
 * @version 2015-05-31
 * github: https://github.com/xingqiao/ct_effect
 */

; (function (window, document) {
    var opts = {
        direct: 'left',	// 平移方向
        'timing-function': 'ease-in',	// 变换的速率变化
        duration: 800,	// 持续时间
        perspective: 500	// 视点距离
    };
    function _translate(params, callback) {
        var duration = params.duration > 500 ? params.duration : opts.duration,
            perspective = params.perspective > 200 ? params.perspective : opts.perspective,
            timingFunction = /^(ease(-in)?(-out)?|linear|cubic-bezier\((-?\d+,){3}-?\d+\))$/.test(params['timing-function']) ? params['timing-function'] : opts['timing-function'],
            wrap = params.canvas.parentElement,
            doc = document,
            css = {},
            direct = /^(top|bottom|left|right)$/i.test(params.direct) ? params.direct.toLowerCase() : 'left';
        isVert = /bottom|top/.test(direct),
            isBR = /bottom|right/.test(direct),
            isTR = /top|right/.test(direct);
        ['transition', 'transition-duration', 'transition-timing-function', 'transform', 'transform-style', 'transform-origin'].forEach(function (s) {
            css[s] = (s in wrap.style ? '' : '-webkit-') + s;
        });
        var c = params.canvas, w = params.width, h = params.height;
        if (params.target) {
            var d = document.createElement('div');
            wrap.appendChild(d);
            d.appendChild(c);
            c = d;
            var nextImg = new Image();
            nextImg.width = w;
            nextImg.height = h;
            nextImg.style.cssText = 'position:absolute;top:0;left:0;' + css.transform + ':translate3d(' + (isVert ? 0 : (isBR ? '-100%' : '100%')) + ',' + (isVert ? (isBR ? '-100%' : '100%') : 0) + ',0)';
            nextImg.src = params.target;
            d.appendChild(nextImg);
            params.img.style.display = 'none';
        }
        c.style.cssText = css.transition + ':transform ' + (duration - 50) + 'ms ' + timingFunction;
        var is3d = params.mode != '2d',
            translate = 'translate3d(' + (isVert ? 0 : (isBR ? w : -w) + 'px') + ',' + (isVert ? (isBR ? h : -h) + 'px' : 0) + ',0)',
            rotate = '', rotate_time = 200;
        if (is3d) {
            // 旋转10度，产生3d效果
            setTimeout(function () {
                var origin = { 'left': '100% 50%', 'right': '0% 50%', 'top': '50% 100%', 'bottom': '50% 0%' };
                rotate = 'perspective(' + perspective + 'px) rotate' + (isVert ? 'X' : 'Y') + '(' + (isTR ? '' : '-') + '10deg)';
                c.style[css['transition-duration']] = rotate_time + 'ms';
                c.style[css['transform-origin']] = origin[direct];
                c.style[css.transform] = rotate;
            }, 0);
            setTimeout(function () {
                c.style[css['transition-timing-function']] = 'ease-out';
                c.style[css['transition-duration']] = rotate_time + 'ms';
                c.style[css.transform] = translate;
            }, duration - rotate_time);
        }
        setTimeout(function () {
            c.style[css['transition-duration']] = (duration - (is3d ? 2 * rotate_time : 0)) + 'ms';
            setTimeout(function () {
                c.style[css.transform] = rotate + ' ' + translate;
            }, 50);
        }, is3d ? rotate_time : 0);
        setTimeout(function () {
            params.target && (params.img.style.display = '');
            callback();
        }, duration);
    };
    window.addImgEffect && addImgEffect(['平移', 'translate'], function (callback) {
        if (!this.direct && this.direction) {
            params.direct = Math.abs(this.direction.y) > Math.abs(this.direction.x) ? (this.direction.y > 0 ? 'bottom' : 'top') : (this.direction.x > 0 ? 'right' : 'left');
        }
        _translate(this, callback);
    })
})(window, document);
