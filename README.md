# 基于canvas和css3实现的图片动画

支持img和canvas标签

demo: http://y.qq.com/m/demo/ct_effect/demo.html

已经实现的特效有:

	玻璃破碎|brokenglass	ct_effect_brokenglass.js
	百叶窗|blinds	ct_effect_blinds.js
	溶解|dissolve	ct_effect_dissolve.js
	平移|translate	ct_effect_translate.js
	立方体|cube	ct_effect_cube.js

调用方式

	1. 初始化方式调用，在点击时自动执行
		img.initEffect({
			animate: 'fadeout',	// 动画类型
			target: 'http://i.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432038769616126350.jpg',	// 替换的新图片
			audio: 'http://i.gtimg.cn/music/common/upload/ct/broken.mp3'	// 音效
		}).then(function() {
			console.log('执行成功')
		})

	2. 手动触发调用
		img.execEffect({
			animate: 'fadeout',	// 动画类型
			target: 'http://i.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432038769616126350.jpg',	// 替换的新图片
			audio: 'http://i.gtimg.cn/music/common/upload/ct/broken.mp3',	// 音效
			x: e.offsetX,	// x坐标
			y: e.offsetY	// y坐标
		}).then(function() {
			console.log('执行成功')
		})

注册特效动画

	window.addImgEffect('动画名', function(callback){[动画处理函数]})
		this.canvas	加载当前图片
		this.img	加载下一张图片
		this.parentElement
		this.x	点击坐标
		this.y
		this.offset.left	img相对页面偏移
		this.offset.top
		this.direction.x	滑动方向向量
		this.direction.y
