/**
 * 立方体特效
 * 	动画名	立方体|cube
 * 	初始化参数
 * 		direct	翻转方向，不传该参数时会根据滑动方向自动判断，点击时默认为left
 * 			top|bottom|left|right
 * 		duration = 1500,	// 持续时间
 *
 * @author ct
 * @version 2015-06-05
 * github: https://github.com/xingqiao/ct_effect
 */

;(function(window, document) {
    var opts = {
        direct: 'left',	// 翻转方向
        duration: 1000,	// 翻转时间
        perspective: 500	// 视点距离
    };
    function _cube(params, callback) {
        var duration = params.duration > 300 ? params.duration : opts.duration,
            perspective = params.perspective > 500 ? params.perspective : opts.perspective,
            direct = /^(top|bottom|left|right)$/i.test(params.direct) ? params.direct.toLowerCase() : 'left',
            wrap = params.canvas.parentElement,
            css = {},
            isLR = /left|right/.test(direct),
            isTR = /top|right/.test(direct),
            isBR = /bottom|right/.test(direct);
        ['transition', 'transform', 'transform-style', 'transform-origin', 'backface-visibility'].forEach(function(s){
            css[s] = (s in wrap.style ? '' : '-webkit-') + s;
        });
        var w = params.width, h = params.height,
            dc = (isLR ? w : h) / 2,	// 旋转中心距平面距离,
            rd = '' + ~~!isLR + ',' + ~~isLR + ',0',	// 旋转轴
            blinds = document.createDocumentFragment(), c = params.canvas;
        var d = document.createElement('div');
        wrap.appendChild(d);
        d.style.cssText = 'margin:0;display:block;position:absolute;' + css['transform-style'] + ':preserve-3d;' + css['backface-visibility'] + ':hidden;' + css.transition + ':transform ' + (duration - 50) + 'ms ease;' + css['backface-visibility'] + ':hidden;' + css.transform + ':perspective(' + perspective + 'px) translate3d(0,0,-' + dc + 'px)';
        c.style[css.transform] = 'translate3d(0,0,' + dc + 'px)';
        d.appendChild(c);
        if (params.target) {
            var nextImg = new Image();
            nextImg.width = w;
            nextImg.height = h;
            nextImg.style.cssText = 'position:absolute;top:0;left:0;' + css.transform + ':translate3d(' + (isLR ? (isBR ? '-100%' : '100%') : 0) + ',' + (isLR ? 0 : (isBR ? '-100%' : '100%')) + ',' + dc + 'px) rotate3d(' + rd + ', ' + (isTR ? '-' : '') + '90deg);' + css['transform-origin'] + ':' + (isLR ? (isTR ? '100%' : 0) + ' 50%' : '50% ' + (isTR ? 0 : '100%'));
            nextImg.src = params.target;
            d.appendChild(nextImg);
            params.img.style.display = 'none';
        }
        setTimeout(function(){
            d.style[css.transform] = d.style[css.transform] + ' rotate3d(' + rd + ',' + (isTR ? '' : '-') + '90deg)';
        }, 50);
        setTimeout(function(){
            params.target && (params.img.style.display = '');
            callback && callback();
        }, duration);
    };
    window.addImgEffect && addImgEffect(['立方体', 'cube'], function(callback) {
        if (!this.direct && this.direction) {
            params.direct = Math.abs(this.direction.y) > Math.abs(this.direction.x) ? (this.direction.y > 0 ? 'bottom' : 'top') : (this.direction.x > 0 ? 'right' : 'left');
        }
        _cube(this, callback);
    })
})(window, document);
