/**
 * 玻璃破碎特效
 * 	动画名	玻璃破碎|brokenglass
 * 	初始化参数
 * 		crack = 5,	// 径向裂缝基数
 * 		turn = 5, // 环状裂缝圈数
 * 		duration = 1500,	// 掉落时间
 * 		fall = 1,	// 自由落体，为0时碎片会向四周散开
 *
 * @author ct
 * @version 2015-05-04
 * github: https://github.com/xingqiao/ct_effect
 */

;(function(window, document) {
    var opts = {
        crack: 5,	// 径向裂缝基数
        turn: 5,	// 环状裂缝圈数
        duration: 1500,	// 碎片掉落时间
        fall: 1,	// 自由落体，为0时碎片会向四周散开
        s1: 0.4,	// 四边形破裂概率
        s2: 0.3,	// 同层级碎片连结概率
        s3: 0.5	// 跨层级碎片连结概率
    };
    // 在圆上随机取n个点
    function _getRandCirclePoints(x, y, r, n) {
        var rlist = [], all = 0, points = [];
        for (var i = 0; i < n; i++) {
            all += (rlist[i] = 0.5 + Math.random());
        }
        for (var i = 0, dl = 0, rad = Math.random() / 2; i < n; i++) {
            rlist[i] = (i > 0 ? rlist[i - 1] : rad) + (rlist[i] / all) * 2 * Math.PI;
            points[i] = [Math.round(x + r * Math.sin(rlist[i])), Math.round(y - r * Math.cos(rlist[i]))];
        }
        return points;
    };
    // 叉积
    function _mult(a, b, c) {
        return (a[0] - c[0]) * (b[1] - c[1]) - (b[0] - c[0]) * (a[1] - c[1]);
    };
    // 计算破裂碎片
    function _getBrokenChip(x, y, r, n, ps, slist, chips) {
        var points = _getRandCirclePoints(x, y, r, n);
        for (var i = 0, t1 = 0, t2 = 0; i < n; i++) {
            var j = i + 1 >= n ? 0 : i + 1, chip1 = null, chip2 = null;
            if (ps.length == 1) {
                // 同层级碎片连结
                if (t1) {
                    chip1 = [points[i], points[i - 1], ps[0], points[j]];
                    t1 = 0;
                } else if (i != n - 1 && Math.random() < opts.s2) {
                    t1 = 1;
                } else {
                    chip1 = [points[i], ps[0], points[j]];
                }
            } else {
                // 四边形破裂
                if (Math.random() < opts.s1 && _isConvex([ps[i], ps[j], points[j], points[i]])) {
                    if (Math.random() < 0.5) {
                        chip1 = [points[i], ps[i], points[j]];
                        chip2 = [ps[i], points[j], ps[j]];
                    } else {
                        chip1 = [points[i], ps[j], points[j]];
                        chip2 = [ps[i], points[i], ps[j]];
                    }
                } else {
                    chip1 = [points[i], ps[i], ps[j], points[j]];
                }
            }
            // 跨层级碎片连结
            if ((chip2 || chip1) && Math.random() < opts.s3) {
                if (slist[i]) {
                    if (chip2) {
                        slist[i].push(chip2[1]);
                        chip2 = slist[i] = null;
                    } else {
                        slist[i].unshift(chip1[0]);
                        slist[i].push(chip1[chip1.length - 1]);
                        chip1 = null;
                    }
                } else {
                    slist[i] = chip1;
                }
            } else {
                slist[i] = null;
            }
            chip1 && chips.push(chip1);
            chip2 && chips.push(chip2);
        }
        return points;
    };
    // 判断是否是凸四边形
    function _isConvex(p, n) {
        var cj1 = _mult(p[0], p[1], p[2]),
            cj2 = _mult(p[1], p[2], p[3]),
            cj3 = _mult(p[2], p[3], p[0]),
            cj4 = _mult(p[3], p[0], p[1]);
        if (cj1 * cj2 < 0 || cj2 * cj3 < 0 || cj3 * cj4 < 0 || cj4 * cj1 < 0) {
            return false;
        } else {
            return true;
        }
    };
    // 判断线段ab，cd是否相交
    function _intersect(a, b, c, d) {
        return !((Math.max(a[0], b[0]) < Math.min(c[0], d[0]))
            || (Math.max(a[1], b[1]) < Math.min(c[1], d[1]))
            || (Math.max(c[0], d[0]) < Math.min(a[0], b[0]))
            || (Math.max(c[1], d[1]) < Math.min(a[1], b[1]))
            || (_mult(c, b, a) * _mult(b, d, a) < 0)
            || (_mult(a, d, c) * _mult(d, b, c) < 0))
    };
    // 获取外接矩形
    function _getRect(points, width, height) {
        var r = {x: width, y: height, w: 0, h: 0};
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            r.x = Math.min(r.x, p[0] > 0 ? p[0] : 0);
            r.y = Math.min(r.y, p[1] > 0 ? p[1] : 0);
        }
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            r.w = Math.max(r.w, (p[0] > width ? width : p[0]) - r.x);
            r.h = Math.max(r.h, (p[1] > height ? height : p[1]) - r.y);
        }
        return r;
    };
    // 判断多边形是否重叠
    function _overlap(polygon1, polygon2) {
        if (polygon1.length >= 3 && polygon2.length >= 3) {
            for (var i = 0, l = polygon1.length; i < l; i++) {
                var p1 = polygon1[i], p2 = polygon1[i == l - 1 ? 0 : i + 1];
                for (var j = 0, m = polygon2.length; j < m; j++) {
                    if (_intersect(p1, p2, polygon2[j], polygon2[j == m - 1 ? 0 : j + 1])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    // 剔除部分视图外的碎片
    function _cutChips(chips, w, h) {
        var _chips = [], rect = [[0, 0], [w, 0], [w, h], [0, h]];
        for (var j = 0; j < chips.length; j++) {
            var chip = chips[j], cross = 0;
            // 包含
            for (var i = 0; i < chip.length; i++) {
                var x = chip[i][0], y = chip[i][1];
                if (x >= 0 && x <= w && y >= 0 && y <= h) {
                    cross = 1;
                    break;
                }
            }
            if (cross || _overlap(chip, rect)) {
                _chips.push(chip);
            }
        }
        return _chips;
    };
    function _easeIn(t, b, c, d) {
        return c * (t /= d) * t + b;
    }
    function _break(params, callback) {
        var crack = params.crack > 5 ? params.crack : opts.crack,
            turn = params.turn > 3 ? params.turn : opts.turn,
            duration = params.duration > 500 ? params.duration : opts.duration,
            fall = params.fall != null ? params.fall : opts.fall;
        // 用canvas加载图片
        var c = params.canvas, ctx = c.getContext('2d'), width = params.width, height = params.height;
        // IE下如果点是浮点数，会导致canvas在绘图时报IndexSizeError异常
        var x = (params.x > 0 ? params.x : width / 2) | 0, y = (params.y > 0 ? params.y : height / 2) | 0;
        // 计算破裂碎片
        // 径向裂缝数
        var n = crack * (1 + Math.random()) | 0;
        // 用图片对角线作为破裂半径参照
        var r = Math.ceil(Math.sqrt(width * width + height * height));
        // 计算破裂三角形
        var chips = [];
        for (var i = 0, _r = 1, s = 0, points = [[x, y]], slist = []; i < turn; i++) {
            if (i == turn - 1) {
                _r = 3 * r;
            } else if (i == turn - 2) {
                _r = r;
            } else {
                var _s = Math.pow((i + 1) / (turn - 1), 2) - s;
                s = _s + s;
                _s *= (4 + Math.random()) / 5;
                _r += Math.ceil(_s * r);
            }
            // 将破裂碎片存储在chips列表中
            points = _getBrokenChip(x, y, _r, n, points, slist, chips);
        }
        // 剔除部分视图外的碎片
        chips = _cutChips(chips, width, height);
        // console.log('碎片个数：' + chips.length);
        // 提取碎片图像
        var fragment = document.createDocumentFragment();
        var _delay = 0, _chips = [];
        for (var p = 0, l = chips.length; p < l; p++) {
            var ps = chips[p], sc = document.createElement('canvas'), r = _getRect(ps, width, height);
            // 剔除掉无效的碎片
            if (r.w == 0 || r.h == 0) {
                continue;
            }
            var chip = {
                canvas: sc,
                points: ps,
                x: r.x,
                y: r.y,
                width: r.w,
                height: r.h,
                delay: (.5 * Math.random() * p / l) * (duration / 16.7) | 0
            };
            _chips.push(chip);
            _delay = Math.max(_delay, chip.delay);
            // fall = 0
            if (fall && fall != 0) {
                // 自由落体
                chip.dx = (Math.random() - .5) * .2 * width;
                chip.dy = height;
            } else {
                // 随机散开
                var rand = 2 * Math.random() - 1;
                chip.dx = rand * width;
                chip.dy = (Math.random() > .5 ? -1 : 1) * Math.sqrt(1 - rand) * height;
            }
            // 模拟3D旋转
            chip.dw = - Math.random() * r.w;
            chip.dh = - Math.random() * r.h;
            // 将碎片绘制到内存中
            sc.width = r.w;
            sc.height = r.h;
            var sctx = sc.getContext('2d');
            sctx.beginPath();
            sctx.moveTo(ps[ps.length - 1][0] - r.x, ps[ps.length - 1][1] - r.y);
            for (var i = 0; i < ps.length; i++) {
                sctx.lineTo(ps[i][0] - r.x, ps[i][1] - r.y);
            }
            sctx.closePath();
            sctx.strokeStyle = 'rgba(255,255,255,.3)';
            sctx.lineWidth = 2;
            sctx.stroke();
            sctx.clip();
            sctx.drawImage(c, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
        }
        chips = _chips;
        // 掉落动画
        var pre_d = 15, process = -pre_d, end = duration / 16.7, tMoniter = +new Date();
        function _drop(){
            process++;
            // 性能低下时通过跳帧来加速动画（安卓QQ音乐客户端）
            var tnow = +new Date();
            if (tnow - tMoniter > 30) {
                process++;
            }
            tMoniter = tnow;
            if (process < 0) {
                // 绘制裂纹
                for (var i = (chips.length * (1 + (process - 1) / pre_d)) | 0, l = chips.length * (1 + process / pre_d) | 0; i < l; i++) {
                    var chip = chips[i];
                    if (!chip.init) {
                        chip.init = 1;
                        ctx.drawImage(chip.canvas, chip.x, chip.y, chip.width, chip.height);
                    }
                }
            } else {
                // 绘制掉落
                ctx.clearRect(0, 0, width, height);
                for (var i = 0; i < chips.length; i++) {
                    var chip = chips[i], x = chip.x, y = chip.y, w = chip.width, h = chip.height;
                    if (process > chip.delay) {
                        x = _easeIn(process - chip.delay, x, chip.dx, end - chip.delay);
                        y = _easeIn(process - chip.delay, y, chip.dy, end - chip.delay);
                        w = _easeIn(process - chip.delay, w, chip.dw, end - chip.delay);
                        h = _easeIn(process - chip.delay, h, chip.dh, end - chip.delay);
                    }
                    ctx.globalAlpha = _easeIn(process - chip.delay, 1, -1, end - chip.delay);
                    ctx.drawImage(chip.canvas, 0, 0, chip.width, chip.height, x, y, w, h);
                }
            }
            // 强制触发Repaint
            c.style.color = c.style.color ? '' : '#fff';
            if (process < end) {
                requestAnimationFrame(_drop);
                // setTimeout(_drop, 60);
            } else {
                callback && callback();
            }
        };
        _drop();
    };
    window.addImgEffect && addImgEffect(['玻璃破碎', 'brokenglass'], function(callback) {
        _break(this, callback);
    })
})(window, document);
