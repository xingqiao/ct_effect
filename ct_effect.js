/**
 * 图片切换特效，支持img和canvas标签
 * 调用方式
 * 	1. 初始化方式调用，在点击时自动执行
 * 		img.initEffect({
 * 			animate: "fadeout",	// 动画类型
 * 			target: "http://i.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432038769616126350.jpg",	// 替换的新图片
 * 			audio: "http://i.gtimg.cn/music/common/upload/ct/broken.mp3"	// 音效
 * 		}).then(function() {
 * 			console.log("执行成功")
 * 		})
 * 	2. 手动触发调用
 * 		img.execEffect({
 * 			animate: "fadeout",	// 动画类型
 * 			target: "http://i.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432038769616126350.jpg",	// 替换的新图片
 * 			audio: "http://i.gtimg.cn/music/common/upload/ct/broken.mp3",	// 音效
 * 			x: e.offsetX,	// x坐标
 * 			y: e.offsetY	// y坐标
 * 		}).then(function() {
 * 			console.log("执行成功")
 * 		})
 * 添加特效动画
 * 	window.addImgEffect("动画名", function(callback){[动画处理函数]})
 * 		this.canvas	加载当前图片
 * 		this.img	加载下一张图片
 * 		this.parentElement
 * 		this.x	点击坐标
 * 		this.y
 * 		this.offset.left	img相对页面偏移
 * 		this.offset.top
 * 		this.direction.x	滑动方向向量
 * 		this.direction.y
 *
 * @author ct
 * @version 2015-05-20
 * github: https://github.com/xingqiao/ct_effect
 */

// 添加 requestAnimationFrame 支持
; (function (window, document) {
    var lastTime = 0;
    window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        var id = window.setTimeout(function () { callback(currTime + timeToCall) }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    });
    window.cancelAnimationFrame || (window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function (id) { clearTimeout(id) });
})(window, document);

; (function (window, document) {
    var win = window, doc = document;
    var $ = function (s, p) { return p && p.querySelector ? p.querySelector(s) : doc.querySelector(s) };
    var $$ = function (s, p) { return p && p.querySelectorAll ? p.querySelectorAll(s) : doc.querySelectorAll(s) };
    var _ef = {}, opts = [], curIndex, timer;
    _ef.fadeout = function (callback) {
        var o = this;
        o.canvas.style.transition = o.canvas.style.webkitTransition = 'opacity .8s';
        setTimeout(function () { o.canvas.style.opacity = 0 }, 0);
        setTimeout(callback, 800);
    };
    // 获取元素相对与body的offset偏移
    function _getOffset(e) {
        var o = { left: e.offsetLeft, top: e.offsetTop };
        while (e = e.offsetParent) {
            o.left += e.offsetLeft;
            o.top += e.offsetTop;
        }
        return o;
    };
    // 获取坐标
    function _getCoords(e, offset) {
        var c;
        if ((window.MouseEvent && e instanceof MouseEvent) || (window.TouchEvent && e instanceof TouchEvent)) {
            c = {};
            c.x = (e.touches ? e.touches[0].pageX : e.pageX) - (offset ? offset.left : 0);
            c.y = (e.touches ? e.touches[0].pageY : e.pageY) - (offset ? offset.top : 0);
        }
        return c;
    };
    // 执行动画
    function _ani(params) {
        if (_ef._in_ani) {
            return;
        }
        console.time('animate')

        var img = params && params.img;
        if (img) {
            _ef._in_ani = 1;
            // 播放音效
            if (params.audio) {
                var bgm = new Audio();
                bgm.src = params.audio;
                setTimeout(function () { bgm.play() }, 0);
            }
            // 绘制到canvas
            var d = document.createElement('div'), w, h;
            params.parentElement = img.parentElement;
            params.canvas = document.createElement('canvas');
            params.ctx = params.canvas.getContext('2d');
            params.ctx.drawImage(img, 0, 0, w = params.width = params.canvas.width = img.width, h = params.height = params.canvas.height = img.height);
            d.appendChild(params.canvas);
            d.style.cssText = 'position:absolute;top:' + img.offsetTop + 'px;left:' + img.offsetLeft + 'px;width:' + w + 'px;height:' + h + 'px;overflow:hidden;';
            params.parentElement.appendChild(d);
            // 规范坐标
            params.x = (params.x >= 0 ? params.x : w / 2) | 0;
            params.y = (params.y >= 0 ? params.y : h / 2) | 0;
            // 加载替换的图片
            if (params.target) {
                img.src = params.target;
            } else {
                img.style.display = 'none';
            }
            // 执行动画
            var callback = function () {
                console.timeEnd('animate')

                var _cb = params._cb;
                // 防止多次触发回调
                delete params._cb;
                try {
                    params.parentElement.contains(d) && params.parentElement.removeChild(d);
                } catch (ex) {
                    console.log(ex);
                }
                _ef._in_ani = 0;
                _cb && _cb.forEach && _cb.forEach(function (cb) {
                    typeof cb == 'function' && cb.call(img);
                });
            };
            setTimeout(function () {
                (_ef[params.animate] || _ef.fadeout).call(params, callback, params.x, params.y);
            }, 0);
        }
    };
    function _start(e) {
        var img = e.target;
        if (img.hasAttribute('data-ct-effect')) {
            curIndex = img.getAttribute('data-ct-effect'), params = opts[curIndex] || {};
            params.img = img;
            params.$ = $;
            params.$$ = $$;
            // 只响应一次动画
            img.removeAttribute('data-ct-effect');
            // 获取参数
            ['animate', 'audio', 'target'].forEach(function (attr) {
                var a = img.getAttribute('data-ct-effect-' + attr);
                a && (params[attr] = a);
            });
            // 获取坐标
            params.offset = _getOffset(img);
            var coords = _getCoords(e, params.offset);
            if (coords) {
                params.x = coords.x;
                params.y = coords.y;
            }
            params.direction = { x: 0, y: 0 };
            timer = setTimeout(_end, 100);
            // 停止事件冒泡
            e.preventDefault();
            e.stopPropagation();
        }
    };
    function _move(e) {
        var params = opts[curIndex];
        if (params) {
            var coords = _getCoords(e, params.offset);
            params.direction.x = coords.x - params.x;
            params.direction.y = coords.y - params.y;
        }
    };
    function _end() {
        var params = opts[curIndex];
        if (params) {
            if (timer > 0) {
                clearTimeout(timer);
                timer = 0;
            }
            delete opts[curIndex];
            // 执行动画
            _ani(params);
        }
    };
    // 预处理参数
    function _normalParam(img, params, cb) {
        params || (params = {});
        if (typeof params == 'function') {
            params = { _cb: [params] };
        } else {
            params._cb = [];
            typeof params.cb == 'function' && params._cb.push(params.cb);
            typeof cb == 'function' && params._cb.push(cb);
            delete params.cb;
        }
        img.then = function (cb) { return typeof cb == 'function' && params._cb.push(cb), img };
        return params;
    };
    // 添加事件
    doc.addEventListener('touchstart', _start);
    doc.addEventListener('mousedown', _start);
    doc.addEventListener('touchmove', _move);
    doc.addEventListener('mousemove', _move);
    doc.addEventListener('touchend', _end);
    doc.addEventListener('mouseuo', _end);
    // 添加外部调用接口
    HTMLImageElement.prototype.initEffect = HTMLCanvasElement.prototype.initEffect = function (params, cb) {
        var img = this, e = img.getAttribute('data-ct-effect');
        params = _normalParam(img, params, cb);
        if (!e) {
            e = opts.length;
            img.setAttribute('data-ct-effect', e);
        }
        ['animate', 'audio', 'target'].forEach(function (attr) {
            params[attr] ? img.setAttribute('data-ct-effect-' + attr, params[attr]) : img.removeAttribute('data-ct-effect-' + attr);
        });
        opts[e] = params;
        img.then = function (cb) { return typeof cb == 'function' && params._cb.push(cb), img };
        return img;
    };
    HTMLImageElement.prototype.execEffect = HTMLCanvasElement.prototype.execEffect = function (params, cb) {
        params = _normalParam(this, params, cb);
        params.img = this;
        _ani(params);
        return this;
    };
    // 注册动画接口
    window.addImgEffect = function (name, ani) {
        if (typeof ani == 'function') {
            (name instanceof Array ? name : [name]).forEach(function (n) {
                _ef[n] = ani;
            });
        }
    };
})(window, document);
