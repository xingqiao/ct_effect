# 基于canvas和css3实现的图片动画

- 支持img和canvas标签

- 支持扩展自定义的动画特效

demo: http://ctchen.cn/static/lab/ct_effect/demo.html

## 已经实现的特效

| 特效名 | js文件 |
|-|-|
| `渐隐`、`fadeout` | 默认 |
| `玻璃破碎`、`brokenglass` | ct_effect_brokenglass.js |
| `百叶窗`、`blinds` | ct_effect_blinds.js |
| `溶解`、`dissolve` | ct_effect_dissolve.js |
| `平移`、`translate` | ct_effect_translate.js |
| `立方体`、`cube` | ct_effect_cube.js |
| `星星`、`star` | ct_effect_star.js |

## 通用参数

| 参数名 | 说明 | 是否必须 | 示例 |
|-|-|-|-|
| animate | 动画名 | 是 | brokenglass |
| target | 替换的新图片链接 | 是 | http://ctchen.cn/static/lab/ct_effect/img/bg_7.jpg |
| audio | 音效链接 | 否 | http://ctchen.cn/static/lab/ct_effect/audio/broken.mp3 |
| x | 触发点x坐标 | 否 | |
| y | 触发点y坐标 | 否 | |

## 特效参数

### 玻璃破碎 / brokenglass

| 参数名 | 说明 | 默认值 |
|-|-|-|-|
| crack | 径向裂缝基数 | 5 |
| turn | 环状裂缝圈数 | 5 |
| duration | 掉落时间 | 1500 |
| fall | 自由落体，为0时碎片会向四周散开 | 1 |

### 百叶窗 / blinds

| 参数名 | 说明 | 默认值 |
|-|-|-|-|
| direct | 翻转方向，不传该参数时会根据滑动方向自动判断，可选值top、bottom、left、right | 点击时默认为left |
| count | 窗叶数量 | 10 |
| origin | 翻转方向，location：从点击处开始翻转，edge：从边缘开始翻转 | location |

### 溶解 / dissolve

| 参数名 | 说明 | 默认值 |
|-|-|-|-|
| size | 颗粒大小 | 10 |
| duration | 持续时间 | 1500 |
| direct | 溶解方向，可选值random、top、bottom、left、right、point | random |

### 平移 / translate

| 参数名 | 说明 | 默认值 |
|-|-|-|-|
| direct | 平移方向，不传该参数时会根据滑动方向自动判断，可选值top、bottom、left、right | 点击时默认为left |
| mode | 模式，可选值 2d\3d | 3d |
| duration | 持续时间 | 1500 |
| timing-function | 变换的速率变化 | ease-in |

### 立方体 / cube

| 参数名 | 说明 | 默认值 |
|-|-|-|-|
| direct | 平移方向，不传该参数时会根据滑动方向自动判断，可选值top、bottom、left、right | 点击时默认为left |
| duration | 持续时间 | 1500 |

### 星星 / star

| 参数名 | 说明 | 默认值 |
|-|-|-|-|
| count | 星星数量基数 | 6 |

## 调用方式

### 1. 初始化方式调用，在点击时自动执行

```javascript
img.initEffect({
    animate: 'fadeout',	// 动画类型
    target: 'http://y.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432038769616126350.jpg',	// 替换的新图片
    audio: 'http://y.gtimg.cn/music/common/upload/ct/broken.mp3'	// 音效
}).then(function() {
    console.log('执行成功')
})
```

### 2. 手动触发调用

```javascript
img.execEffect({
    animate: 'fadeout',	// 动画类型
    target: 'http://y.gtimg.cn/music/common/upload/t_cm3_photo_publish/1432038769616126350.jpg',	// 替换的新图片
    audio: 'http://y.gtimg.cn/music/common/upload/ct/broken.mp3',	// 音效
    x: e.offsetX,	// x坐标
    y: e.offsetY	// y坐标
}).then(function() {
    console.log('执行成功')
})
```

## 注册自定义的特效动画

```javascript
window.addImgEffect("动画名", function(callback){
    /* 动画处理函数 */

    // 加载的当前图片
    this.canvas

    // 要加载的下一张图片
    this.img

    // 容器节点
    this.parentElement

    // 点击坐标
    this.x
    this.y

    // img相对页面偏移
    this.offset.left
    this.offset.top

    // 滑动方向向量
    this.direction.x
    this.direction.y
});
```
