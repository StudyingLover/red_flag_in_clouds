# 云中的红旗

## 项目说明
![](https://raw.githubusercontent.com/StudyingLover/anything/main/a194c3c8174518a165536f93f041d98.png)
## 项目依赖
ThreeJS

## 文件结构
```
.
+--index.html
+--logo.png
+--notfound.html
+--readme.md
│
+--css
│  +--notfound.css
│
└─html
│  +--GY404.html
│  +--huizhanonline.html
│  +--virtualanchor.html
│  +--questions
│  +--jump.html
│  +--shejian.html
└─resources
│  +--sky.hdr
│  +--sky2.hdr
│  +--video01.mp4
│  +--video02.mp4
│  +--yanhua.mp4
│  +--virtual_human.mp4
|  +--models
│  |  +--player.glb
│  |  +--zhanguan.glb
│
└─src
│  +--joystick_turn.js
│  +--joystick.js
│  +--main.js
│  +--three.js
│  +--vite-env.d.ts
```

## 人物操作
## index.html
- w a s d 移动
- 摇杆 移动
- q e 主人物传送测试
- r npc传送测试
- t 当前页面打开会展云
- y 新页面打开会展云
- p 新页面打开虚拟主播
- i 跟随npc
- o 脱离跟随

## huizhanonline.html
- w 关闭当前页面

## 全局变量
### index.html
- `mouse_on_object_name` 鼠标所在的物体名称
- `scene` 场景
- `camera` 相机
- `renderer` 渲染器
- `playerMesh` 主人物模型
  - `playerMesh.position.x,playerMesh.position.y,playerMesh.position.z` 主人物位置 
- `guideMesh` npc模型
  - `guideMesh.position.x,guideMesh.position.y,guideMesh.position.z` npc位置

## 函数和方法
### index.html
- `playerMesh.rotateX(angle),playerMesh.rotateY(angle),playerMesh.rotateY(angle)` 主人物旋转
- `guideMesh.rotateX(angle),guideMesh.rotateY(angle),guideMesh.rotateY(angle)` npc旋转
- `playerMesh.position.set(x,y,z)` 设置主人物位置
- `guideMesh.position.set(x,y,z)` 设置npc位置
- `object1.add(object2)` 让object2跟随object1
- `moveAlongCurve(mesh,curve);` 让mesh按照curve运动
- `onPointerMove` 检测鼠标点击到了哪个物体并输出，同时赋值给全局变量
- `crossPlay` 动作切换函数
- `control()` 键盘控制

## 参考项目
1. 元宇宙搭建:https://www.bilibili.com/video/BV1EK411z78e?share_source=copy_web
2. 虚拟人播报:https://github.com/JiehangXie/PaddleBoBo
3. GLTFLoader:https://github.com/mayupi/3dvr-gallery
4. 小游戏:https://github.com/wanghao221/wanghao221.github.io.git
5. 问答:https://github.com/shumiao80/htmlgame-demo
6. 公益404:https://www.freesion.com/article/2530927138/

## 工具
1. 网页转应用:https://gonative.io/