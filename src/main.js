let mixer;//动画混合器
let playerMixer;
let guideMixer;

let mouse_on_object_name;//鼠标所在的物体名称
let touch_on_object_name;//触摸所在的物体名称

//创建场景，摄像机，渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;//开启renderer阴影
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
window.scene=scene;
// //设置canvas大小，https://stackoverflow.com/questions/17507525/putting-three-js-animation-inside-of-div
let container = document.getElementById( 'canvas2' );
// document.body.appendChild( container );
container.appendChild(renderer.domElement);
var factor = 1; // percentage of the screen
var w = window.innerWidth * factor;
var h = window.innerHeight * factor;
renderer.setSize( w, h );
container.appendChild( renderer.domElement );


camera.position.set(5, 10, 25);//设置相机初始位置

// const controls = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.Color(0.2, 0.2, 0.2);//添加背景

const ambientLight = new THREE.AmbientLight(0xffffff, 10);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 10);//场地灯光
scene.add(directionLight);

// directionLight.position.set (10, 10, 10);
directionLight.lookAt(new THREE.Vector3(0, 0, 0));

//打开灯光阴影
directionLight.castShadow = true;

//设置阴影贴图大小
directionLight.shadow.mapSize.width = 2048;
directionLight.shadow.mapSize.height = 2048;

//设置阴影相机参数,远近，大小，不在范围内显示不出来
const shadowDistance = 20;
directionLight.shadow.camera.near = 0.1;
directionLight.shadow.camera.far = 400;
directionLight.shadow.camera.left = -shadowDistance;
directionLight.shadow.camera.right = shadowDistance;
directionLight.shadow.camera.top = shadowDistance;
directionLight.shadow.camera.bottom = -shadowDistance;
directionLight.shadow.bias = -0.001;


// const boxGeometry = new THREE.BoxGeometry(1,1,1);
// const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
// const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// scene.add(boxMesh);

// const axesHelper = new THREE.AxesHelper(10);
// scene.add(axesHelper)

let playerMesh;
let guideMesh;
let actionWalk, actionIdle;
let guide_actionWalk, guide_actionIdle;
const lookTarget = new THREE.Vector3(0, 2, 0);
new THREE.GLTFLoader().load('../resources/models/player.glb', (gltf) => {
    playerMesh = gltf.scene;
    scene.add(gltf.scene);//把模型添加到场景

    playerMesh.traverse((child) => {
        child.receiveShadow = true;
        child.castShadow = true;
    })

    playerMesh.position.set(0, 0, 11.5);//人物初始位置
    playerMesh.rotateY(Math.PI);//人物初始旋转pi,调整人物朝向

    playerMesh.add(camera);//相机跟着人走
    camera.position.set(0, 2, -4.9);//设置位置
    camera.lookAt(lookTarget);//设置相机看的位置

    //给人物设置点光源
    const pointLight = new THREE.PointLight(0xffffff, 2);
    scene.add(pointLight)
    playerMesh.add(pointLight);
    pointLight.position.set(0, 1.8, -1);

    playerMixer = new THREE.AnimationMixer(gltf.scene);

    //设置移动动作
    const clipWalk = THREE.AnimationUtils.subclip(gltf.animations[0], 'walk', 0, 30);
    actionWalk = playerMixer.clipAction(clipWalk);
    // actionWalk.play();

    //设置静止动作
    const clipIdle = THREE.AnimationUtils.subclip(gltf.animations[0], 'idle', 31, 281);//下标0代表第一个动画，切出动作的动画
    actionIdle = playerMixer.clipAction(clipIdle);
    actionIdle.play();


    // const clips = gltf.animations; // 播放所有动画
    // clips.forEach(function (clip) {
    //     const action = mixer.clipAction(clip);
    //     action.loop = THREE.LoopOnce;
    //     // 停在最后一帧
    //     action.clampWhenFinished = true;
    //     action.play();
    // });
});





new THREE.GLTFLoader().load('../resources/models/player.glb', (guide) => {
    guideMesh = guide.scene;
    scene.add(guide.scene);
    guideMesh.traverse((child) => {
        child.receiveShadow = true;
        child.castShadow = true;
    })

    guideMesh.position.set(3, 0.2, 11.5);//人物初始位置
    guideMesh.rotateY(Math.PI);//人物初始旋转pi
    // guideMesh.position.set(-5, 3, 11.5);

    // const pointLight = new THREE.PointLight(0xffffff, 1.5);
    // playerMesh2.add(pointLight);
    // pointLight.position.set(0, 1.8, -1);

    guideMixer = new THREE.AnimationMixer(guide.scene);

    const clipWalk = THREE.AnimationUtils.subclip(guide.animations[0], 'walk', 0, 30);
    guide_actionWalk = guideMixer.clipAction(clipWalk);
    // guide_actionWalk.play();

    const clipIdle = THREE.AnimationUtils.subclip(guide.animations[0], 'idle', 31, 281);
    guide_actionIdle = guideMixer.clipAction(clipIdle);
    guide_actionIdle.play();

});

//鼠标测试
// window.addEventListener('click', function (e) {
//     if (e.button === 0) {
//         console.log("点击了鼠标左键");
//         console.log(e.clientX, e.clientY);
//     }
//     if (e.button === 2) {
//         // console.log("点击了鼠标右键");
//     }
// });




//键盘行走判断和摇杆行走判断只能同时存在一个
let isWalk = false;
let isWalk_joystick = false;

const playerHalfHeight = new THREE.Vector3(0, 0.8, 0);
function idle2walk_forward(Mesh, Idle, Walk) {
    //计算当前方向移动前后的向量
    const curPos = Mesh.position.clone();
    Mesh.translateZ(1);
    const frontPos = Mesh.position.clone();
    Mesh.translateZ(-1);

    //计算移动向量并归一化
    const frontVector3 = frontPos.sub(curPos).normalize()

    //碰撞检测
    const raycasterFront = new THREE.Raycaster(Mesh.position.clone().add(playerHalfHeight), frontVector3);
    const collisionResultsFrontObjs = raycasterFront.intersectObjects(scene.children);//获取碰撞的物体
    
    if(collisionResultsFrontObjs[0]){
        if (collisionResultsFrontObjs && collisionResultsFrontObjs[0] && collisionResultsFrontObjs[0].distance > 1) {
            Mesh.translateZ(0.1);
        }
    }
    else{
        Mesh.translateZ(0.1);
    }
    

    //动作切换
    if (!isWalk) {
        crossPlay(Idle, Walk);
        isWalk = true;
    }
}

function idle2walk_back(Mesh, Idle, Walk) {
    //计算当前方向移动前后的向量
    const curPos = Mesh.position.clone();
    Mesh.translateZ(-1);
    const frontPos = Mesh.position.clone();
    Mesh.translateZ(1);

    //计算移动向量并归一化
    const frontVector3 = frontPos.sub(curPos).normalize()

    //碰撞检测
    const raycasterFront = new THREE.Raycaster(Mesh.position.clone().add(playerHalfHeight), frontVector3);
    // console.log(raycasterFront)
    const collisionResultsFrontObjs = raycasterFront.intersectObjects(scene.children);//获取碰撞的物体
    // console.log(collisionResultsFrontObjs[0])
    if (collisionResultsFrontObjs[0]) {//如果有碰撞物体下面的碰撞检测判断才能正常运行，不加这个判断如果人物后方为空则不能后退
        if (collisionResultsFrontObjs && collisionResultsFrontObjs[0] && collisionResultsFrontObjs[0].distance > 1) {
            Mesh.translateZ(-0.1);//
        }
    }
    else {
        Mesh.translateZ(-0.1);
    }

    //动作切换
    if (!isWalk) {
        crossPlay(Idle, Walk);
        isWalk = true;
    }
}

//键盘控制
function control() {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'w') {

            idle2walk_forward(playerMesh, actionIdle, actionWalk);
            // //计算当前方向移动前后的向量
            // const curPos = playerMesh.position.clone();
            // playerMesh.translateZ(1);
            // const frontPos = playerMesh.position.clone();
            // playerMesh.translateZ(-1);

            // //计算移动向量并归一化
            // const frontVector3 = frontPos.sub(curPos).normalize()

            // //碰撞检测
            // const raycasterFront = new THREE.Raycaster(playerMesh.position.clone().add(playerHalfHeight), frontVector3);
            // const collisionResultsFrontObjs = raycasterFront.intersectObjects(scene.children);//获取碰撞的物体
            // if (collisionResultsFrontObjs && collisionResultsFrontObjs[0] && collisionResultsFrontObjs[0].distance > 1) {
            //     playerMesh.translateZ(0.1);
            // }

            // //动作切换
            // if (!isWalk) {
            //     crossPlay(actionIdle, actionWalk);
            //     isWalk = true;
            // }
        }
        if (e.key === 's') {
            // playerMesh.translateZ(-0.1);
            idle2walk_back(playerMesh, actionIdle, actionWalk);
        }

        if (e.key === 'a') {
            playerMesh.rotateY(0.1);
        }
        if (e.key === 'd') {
            playerMesh.rotateY(-0.1);
        }

        //传送功能测试
        if (e.key === 'q') {
            playerMesh.position.set(5, 5, 11.5);
            // playerMesh.position.set(6, 5, 11.5);
            // playerMesh.position.set(7, 5, 11.5);
        }
        if (e.key === 'e') {
            playerMesh.position.set(0, 0, 11.5);
        }

        if (e.key === 'r') {
            guideMesh.position.set(5, 0, 5);
        }

        //网页跳转功能测试
        //当前页面打开网页
        if (e.key === 't') {
            window.location.href = './html/huizhanonline.html';
        }

        //新打开一个页面打开网页
        if (e.key == 'y') {
            window.open('./html/huizhanonline.html');
        }

        if (e.key == 'p') {
            window.open('./html/virtual_human.html');
        }

        //跟随测试
        if (e.key == 'i') {
            // playerMesh.position.set(4,0,13);
            guideMesh.add(playerMesh);
            // playerMesh.position.set(0,0,-7);
        }
        if (e.key == 'o') {
            guideMesh.remove(playerMesh);
            scene.add(playerMesh);
        }
    })
    window.addEventListener('keyup', (e) => {
        if (e.key === 'w') {
            crossPlay(actionWalk, actionIdle);
            isWalk = false;
        }
        if (e.key === 's') {
            crossPlay(actionWalk, actionIdle);
            isWalk = false;
        }
    });
}
control();


//获取鼠标坐标
let preClientX;
let preClientY;
// let mouse;

try
{
    windiw.player_pos=playerMesh.position;
}
catch {

}




// if (preClientX && playerMesh) {
//     camera.rotateY(-(e.clientX - preClientX) * 0.01);
// }
// preClientX = e.clientX;
// if (preClientY && playerMesh) {
//     camera.rotateX(-(e.clientY - preClientY) * 0.01);
// }
// preClientY = e.clientY;
// console.log("mouse_position:",e.clientX, "," ,e.clientY);






// 加载场馆
// new THREE.GLTFLoader().load('../resources/models/zhanguan.glb', (gltf) => {

//     // console.log(gltf);
//     scene.add(gltf.scene);

//     gltf.scene.traverse((child) => {
//         // console.log(child.name);

//         child.castShadow = true;
//         child.receiveShadow = true;

//         if (child.name === '2023') {
//             //加载视频并设置自动，循环播放
//             const video = document.createElement('video');
//             video.src = "./resources/yanhua.mp4";
//             video.muted = true;
//             video.autoplay = "autoplay";
//             video.loop = true;
//             video.play();

//             //将视频作为纹理贴到模型上
//             const videoTexture = new THREE.VideoTexture(video);
//             const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

//             //设置模型的材质，防止材质与其他没有材质的物体关联
//             child.material = videoMaterial;
//         }
//         if (child.name === '大屏幕01' || child.name === '大屏幕02' || child.name === '操作台屏幕' || child.name === '环形屏幕2') {
//             const video = document.createElement('video');
//             video.src = "./resources/video01.mp4";
//             video.muted = true;
//             video.autoplay = "autoplay";
//             video.loop = true;
//             video.play();

//             const videoTexture = new THREE.VideoTexture(video);
//             const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

//             child.material = videoMaterial;
//         }
//         if (child.name === '环形屏幕') {
//             const video = document.createElement('video');
//             video.src = "./resources/video02.mp4";
//             video.muted = true;
//             video.autoplay = "autoplay";
//             video.loop = true;
//             video.play();

//             const videoTexture = new THREE.VideoTexture(video);
//             const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

//             child.material = videoMaterial;
//         }
//         if (child.name === '柱子屏幕') {
//             const video = document.createElement('video');
//             video.src = "./resources/yanhua.mp4";
//             video.muted = true;
//             video.autoplay = "autoplay";
//             video.loop = true;
//             video.play();

//             const videoTexture = new THREE.VideoTexture(video);
//             const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

//             child.material = videoMaterial;
//         }
//     })



//     mixer = new THREE.AnimationMixer(gltf.scene);
//     const clips = gltf.animations; // 播放所有动画
//     clips.forEach(function (clip) {
//         const action = mixer.clipAction(clip);
//         action.loop = THREE.LoopOnce;
//         // 停在最后一帧
//         action.clampWhenFinished = true;
//         action.play();
//     });

// })


new THREE.GLTFLoader().load('../resources/models/gallery1.glb', (gltf) => {

    // console.log(gltf);
    scene.add(gltf.scene);

    mixer = new THREE.AnimationMixer(gltf.scene);
    const clips = gltf.animations; // 播放所有动画
    clips.forEach(function (clip) {
        const action = mixer.clipAction(clip);
        action.loop = THREE.LoopOnce;
        // 停在最后一帧
        action.clampWhenFinished = true;
        action.play();
    });

})

// new RGBELoader()
//     .load('../resources/sky.hdr', function (texture) {
//         // scene.background = texture;
//         texture.mapping = THREE.EquirectangularReflectionMapping;
//         scene.environment = texture;
//         renderer.outputEncoding = THREE.sRGBEncoding;
//         renderer.render(scene, camera);
// });



//动作切换函数
function crossPlay(curAction, newAction) {
    // curAction是现在正在播的动作，newAction是将要播的动作
    curAction.fadeOut(0.3);
    newAction.reset();
    newAction.setEffectiveWeight(1);
    newAction.play();
    newAction.fadeIn(0.3);
}

//检测鼠标点击到了哪个物体
function onPointerMove() {
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    window.addEventListener('mousemove', (event) => {
        // calculate mouse position in normalized device coordinates
        // parameter event is MouseEvent
        if (event.changedTouches && event.changedTouches.length > 0) {
            event.clientX = event.changedTouches[0].clientX;
            event.clientY = event.changedTouches[0].clientY;
        }

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            const intersect = intersects[0];
            mouse_on_object_name = intersect.object.name;
        }
    });
}

let t = 0;
// //给定一条曲线，让特定的mesh按轨迹自动移动
function moveAlongCurve(mesh, curve) {

    let pos = curve.getPoint(t);
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.lookAt(curve.getPoint(t + 0.01));
    t += 0.003;
    // console.log(t);
}
// //创建一条曲线
let curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(3, 0, 11.5),
    new THREE.Vector3(3, 0, 10),
    new THREE.Vector3(5, 0, 6),
    new THREE.Vector3(5, 0, 0),
    // new THREE.Vector3(0, 0, 11),
]);


//摇杆功能
let ajoystick;
let move = {
    forward: 0,
    turn: 0
}
//左摇杆
function createJoyStick() {
    ajoystick = new JOYSTICK({
        onMove: function (forward, turn) {
            turn = -turn
            if (Math.abs(forward) < 0.3) forward = 0
            if (Math.abs(turn) < 0.1) turn = 0
            move.forward = forward
            move.turn = turn
            // console.log('forward', forward, 'turn', turn);
        }
    })
    if (move.forward != 0) {
        playerMesh.translateZ(move.forward * 0.06);
    }
    if (move.turn != 0) {
        playerMesh.rotateY(move.turn * 0.03);
    }
}
//右摇杆
let camera_turn = 0;
let turn_joystick
function create_joystick_turn() {
    turn_joystick = new TURNJOYSTICK({
        onMove: function (forward, turn) {
            turn = -turn
            // if (Math.abs(forward) < 0.3) forward = 0
            if (Math.abs(turn) < 0.1) camera_turn = 0
            camera_turn = turn
            // console.log('forward', forward, 'turn', turn);
        }
    })
    if (camera_turn != 0) {
        camera.rotateY(camera_turn * 0.03);
    }
}


//获取触摸点的坐标并转换为ThreeJS中的坐标
function touch_crash_detect() {
    window.addEventListener('touchmove', (event) => {
        // screen3D_to_3DCoord(event.touches[0].clientX, event.touches[0].clientY,camera, window.innerWidth, window.innerHeight);
        let pos = space_pos_convert.get3DPosition(event.touches[0].clientX, event.touches[0].clientY, camera, scene, 1);
        if (pos.y != 0) {
            pos.y = 0;
        }
        return pos;
        // playerMesh.position.set(pos.x, pos.y, pos.z);
    });
}
// 点击移动，测试convert_2d_to_3d.js文件中的函数
function click_move() {
    window.addEventListener('click', (event) => {
        if (event.button === 0) {
            let pos = space_pos_convert.get3DPosition(event.clientX, event.clientY, camera, scene, 1);
            if (pos.y != 0) {
                pos.y = 0;
            }
            // let pos = convert2Dto3D(event.clientX, event.clientY, camera, window.innerWidth, window.innerHeight, scene);
            playerMesh.position.set(pos.x, pos.y, pos.z);
            // console.log('mouse',event.clientX,event.clientY,'pos', pos );
        }
    });
}



function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);



    //调用onPointerMove
    onPointerMove();

    //摇杆
    createJoyStick();
    create_joystick_turn();



    try {
        let player_next_pos = touch_crash_detect();
        let player_cur_x = playerMesh.position.x;
        let player_cur_y = playerMesh.position.y;
        let player_cur_z = playerMesh.position.z;
        let player_curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(player_cur_x, player_cur_y, player_cur_z),
            //获取当前点向量

            new THREE.Vector3(player_next_pos.x, player_next_pos.y, player_next_pos.z),
        ]);
        moveAlongCurve(playerMesh, player_curve);
    }
    catch {

    }


    if (mixer) {
        mixer.update(0.02);
    }
    if (playerMixer) {
        playerMixer.update(0.015);
    }
    if (guideMixer) {
        guideMixer.update(0.015);
    }
}

animate();