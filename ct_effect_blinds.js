/**
 * 百叶窗特效
 * 	动画名	百叶窗|brokenglass
 * 	初始化参数
 * 		direct	翻转方向，不传该参数时会根据滑动方向自动判断，点击时默认为left
 * 			top|bottom|left|right
 * 		count	窗叶数量，默认为10
 * 		origin
 * 			location 从点击处开始翻转
 * 			edge 从边缘开始翻转
 *
 * @author ct
 * @version 2015-05-25
 * github: https://github.com/xingqiao/ct_effect
 */

;(function(window, document) {
    var opts = {
        direct: 'top',	// 翻转方向
        count: 10,	// 窗叶数
        duration: 800,	// 翻转一片所需的时间
        perspective: 1200	// 视点距离
    };
    function _blinds(params, callback) {
        var count = params.count > 3 ? params.count : opts.count,
            duration = params.duration > 300 ? params.duration : opts.duration,
            perspective = params.perspective > 500 ? params.perspective : opts.perspective,
            direct = /^(top|bottom|left|right)$/i.test(params.direct) ? params.direct.toLowerCase() : 'top',
            wrap = params.canvas.parentElement,
            doc = document,
            css = {},
            isVert = /left|right/.test(direct),	// 窗叶是否是竖直的
            isTR = /top|right/.test(direct);	// 是否需要交换正面和背面窗叶位置
        ['transition', 'transition-delay', 'transform', 'transform-style', 'transform-origin', 'backface-visibility'].forEach(function(s){
            css[s] = (s in wrap.style ? '' : '-webkit-') + s;
        });
        var w = params.width, h = params.height,
            dw = isVert ? Math.ceil(w / count) : w,
            dh = isVert ? h : Math.ceil(h / count),
            dc = (isVert ? dw : dh) / (2 * Math.sqrt(3)),	// 旋转中心距平面距离,
            rd = '' + ~~!isVert + ',' + ~~isVert + ',0',	// 旋转轴
            first = 0,	// 最早翻转的序号
            blinds = doc.createDocumentFragment(), back, c, ctx;
        // 计算翻转顺序
        if (params.origin != 'edge') {
            first = Math.floor(isVert ? params.x / dw : params.y / dh);
            if (first < 0 || first >= count) {
                first = 0;
            }
        } else if (/top|left/.test(direct)) {
            first = count - 1;
        }
        // 绘制扇叶
        var s = doc.createElement('style');
        s.innerHTML = '.ct-blinds-blade{position:absolute;width:' + dw + 'px;height:' + dh + 'px;' + css['transform-style'] + ':preserve-3d;' + css.transition + ':transform ' + (duration - 50) + 'ms ease;' + css.transform + ':perspective(' + perspective + 'px) translate3d(0,0,-' + dc + 'px)}'
            + '.ct-blinds-side{margin:0;display:block;position:absolute;' + css['transform-style'] + ':preserve-3d;' + css['backface-visibility'] + ':hidden}'
            + '.ct-blinds-front{' + css.transform + ':translate3d(0,0,' + dc + 'px)}'
            + '.ct-blinds-back{' + css.transform + ':translate3d(' + (isVert ? '' : '0,') + (isVert ^ isTR ? '' : '-') + (isVert ? dw : dh) + 'px,' + (isVert ? '0,' : '') + dc + 'px) rotate3d(' + rd + ',' + (isTR ? '-' : '') + '120deg);' + css['transform-origin'] + ':' + (isVert ? (isTR ? '100%' : 0) + ' 50%' : '50% ' + (isTR ? 0 : '100%')) + '}'
            + '.ct-blinds-play .ct-blinds-blade{' + css.transform + ':perspective(' + perspective + 'px) translate3d(0,0,-' + dc + 'px) rotate3d(' + rd + ', ' + (isTR ? '' : '-') + '120deg)}';
        blinds.appendChild(s);
        if (params.target) {
            back = document.createElement('canvas');
            ctx = back.getContext('2d');
            ctx.drawImage(params.img, 0, 0, back.width = w, back.height = h);
        }
        for (var i = 0; i < count; i++) {
            var d = doc.createElement('div');
            d.className = 'ct-blinds-blade';
            d.style.cssText = 'left:' + (isVert ? i * dw : 0) + 'px;top:' + (isVert ? 0 : i * dh) + 'px;' + css['transition-delay'] + ':' + (Math.abs(first - i) * .1) + 's';
            blinds.appendChild(d);
            // 绘制正面
            c = doc.createElement('canvas');
            c.className = 'ct-blinds-side ct-blinds-front';
            c.width = dw;
            c.height = dh;
            ctx = c.getContext('2d');
            ctx.drawImage(params.canvas, isVert ? dw * i : 0, isVert ? 0 : dh * i, dw, dh, 0, 0, dw, dh);
            d.appendChild(c);
            // 绘制背面
            if (back) {
                c = doc.createElement('canvas');
                c.className = 'ct-blinds-side ct-blinds-back';
                c.width = dw;
                c.height = dh;
                ctx = c.getContext('2d');
                ctx.drawImage(back, isVert ? dw * i : 0, isVert ? 0 : dh * i, dw, dh, 0, 0, dw, dh);
                d.appendChild(c);
            }
        }
        wrap.appendChild(blinds);
        wrap.removeChild(params.canvas);
        setTimeout(function() {
            wrap.classList.add('ct-blinds-play');
        }, 50)
        setTimeout(function() {
            callback && callback();
        }, 100 * Math.abs(count - first - 1 > first ? count - first - 1 : first) + duration);
    };
    window.addImgEffect && addImgEffect(['百叶窗', 'blinds'], function(callback) {
        if (!this.direct && this.direction) {
            params.direct = Math.abs(this.direction.x) > Math.abs(this.direction.y) ? (this.direction.x > 0 ? 'right' : 'left') : (this.direction.y > 0 ? 'bottom' : 'top');
        }
        _blinds(this, callback);
    })
})(window, document);
