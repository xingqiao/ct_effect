/**
 * 星星特效
 * 	动画名	星星|star
 * 	初始化参数
 * 		count = 6	// 星星数量基数
 *
 * @author ct
 * @version 2015-09-24
 * github: https://github.com/xingqiao/ct_effect
 */

;(function() {
	var opts = {
		count: 8	// 星星数量基数
	};
	var c_bg = null,
		c_light = null,
		c_star = null,
		td = 20,	// 帧时间间隔
		tc = 75,	// 总帧数
		ctx = null,
		pi2 = Math.PI * 2, width, height;
	function createLight(x, y, s) {
		var t = {
			x: x == null ? parseInt((.1 + .8 * Math.random()) * width) : x,
			y: y == null ? parseInt((.1 + .8 * Math.random()) * height) : y,
			g: {}
		};
		s || (s = parseInt((Math.random() * .5 + .1) * tc));
		var or = parseInt(60 + Math.random() * 40), d = parseInt(20 + Math.random() * 5);
		for (var j = s + 1, m = s + d; j < m; j++) {
			var p = j - s, r = p < d / 3 ? 3 * or * p / d : 1.5 * or * (d - p) / d;
			t.g[j] = r;
		}
		return t;
	};
	function _ani(pos, light, callback) {
		pos++;
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "rgba(33,33,33," + (.8 * (pos > tc / 2 ? 1 - pos / tc : pos / tc)) + ")";
		ctx.fillRect(0, 0, width, height);
		for (var i = 0, l = light.length; i < l; i++) {
			var t = light[i], g = t.g[pos];
			g != null && ctx.drawImage(c_star, t.x - g, t.y - g, g * 2, g * 2);
		}
		c_bg.style.color = c_bg.style.color ? "" : "#fff";
		if (pos < tc) {
			setTimeout(function() {
				_ani(pos, light, callback);
			}, td);
		} else {
			c_bg = c_light = c_star = null;
			callback && callback();
		}
	};
	function _star(params, callback) {
		var count = (params.count > 5 ? params.count : opts.count) | 0;
		var wrap = params.canvas.parentElement;
		// 用canvas加载图片
		var c = params.canvas;
		c_light = document.createElement("canvas");
		c_star = document.createElement("canvas");
		ctx = c.getContext("2d");
		width = c_light.width = params.width;
		height = c_light.height = params.height;
		c_bg = c;
		// IE下如果点是浮点数，会导致canvas在绘图时报IndexSizeError异常
		var x = (params.x > 0 ? params.x : width / 2) | 0, y = (params.y > 0 ? params.y : height / 2) | 0;
		// 设置星星随机列表
		var light = [];
		light.push(createLight(params.x, params.y, 1));
		for (var i = 0, l = count + parseInt(Math.random() * 6); i < l; i++) {
			light.push(createLight());
		}
			console.log(params)
		// 绘制星星
		var sw = c_star.width = c_star.height = Math.min(c.width, c.height) / 4,
			sw_2 = sw / 2,
			sw_3 = sw_2 * .3,
			n1 = .7, n2 = .9, n3 = .95;
			n1 = .9; n2 = .94; n3 = .97;
		ctx = c_star.getContext("2d");
		g = ctx.createRadialGradient(sw_2, sw_2, 0, sw_2, sw_2, sw_2);
		g.addColorStop(0, "rgba(255,255,255,0.7)");
		g.addColorStop(1, "rgba(255,255,255,0)");
		ctx.fillStyle = g;
		ctx.beginPath();
		ctx.moveTo(0, sw_2);
		ctx.lineTo(sw_2 * n1, sw_2 * n3);
		ctx.arcTo(sw_2 * n2, sw_2 * n2, sw_2 * n3, sw_2 * n1, sw_3);
		ctx.lineTo(sw_2, 0);
		ctx.lineTo(sw_2 * (2 - n3), sw_2 * n1);
		ctx.arcTo(sw_2 * (2 - n2), sw_2 * n2, sw_2 * (2 - n1), sw_2 * n3, sw_3);
		ctx.lineTo(sw, sw_2);
		ctx.lineTo(sw_2 * (2 - n1), sw_2 * (2 - n3));
		ctx.arcTo(sw_2 * (2 - n2), sw_2 * (2 - n2), sw_2 * (2 - n3), sw_2 * (2 - n1), sw_3);
		ctx.lineTo(sw_2, sw);
		ctx.lineTo(sw_2 * n3, sw_2 * (2 - n1));
		ctx.arcTo(sw_2 * n2, sw_2 * (2 - n2), sw_2 * n1, sw_2 * (2 - n3), sw_3);
		ctx.lineTo(0, sw_2);
		ctx.closePath();
		ctx.fill();
		// 开始动画
		ctx = c_light.getContext("2d");
		wrap.appendChild(c_star);
		wrap.appendChild(c_light);
		params.img.display = "none";
		c_light.style.cssText = "position:absolute;left:0;top:0";
		c.style.cssText = "-webkit-transition:-webkit-transform 1.5s ease-out,opacity .5s ease-out;-webkit-transform:scale(1);transition:transform 1.5s ease-out,opacity .5s ease-out;transform:scale(1);";
		setTimeout(function() {
			c.style.transform = c.style.webkitTransform = "scale(0.7)";
			c.style.opacity = "0";
			_ani(0, light, callback);
		}, 0);
	};
	window.addImgEffect && addImgEffect(["星星", "star"], function(callback) {
		_star(this, callback);
	})
})();
