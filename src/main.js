let mixer;
let playerMixer;
let guideMixer;

let mouse_on_object_name;//鼠标所在的物体名称

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 50);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(5, 10, 25);//设置相机初始位置

// const controls = new OrbitControls(camera, renderer.domElement);

scene.background = new THREE.Color(0.2, 0.2, 0.2);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 0.7);//场地灯光
scene.add(directionLight);

// directionLight.position.set (10, 10, 10);
directionLight.lookAt(new THREE.Vector3(0, 0, 0));

directionLight.castShadow = true;

directionLight.shadow.mapSize.width = 2048;
directionLight.shadow.mapSize.height = 2048;

const shadowDistance = 20;
directionLight.shadow.camera.near = 0.1;
directionLight.shadow.camera.far = 40;
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
    scene.add(gltf.scene);

    playerMesh.traverse((child)=>{
        child.receiveShadow = true;
        child.castShadow = true;
    })

    playerMesh.position.set(0, 0, 11.5);//人物初始位置
    // playerMesh.position.set(5, 5, 11.5);
    playerMesh.rotateY(Math.PI);//人物初始旋转pi

    playerMesh.add(camera);//相机跟着人走
    camera.position.set(0, 2, -5);
    camera.lookAt(lookTarget);

    const pointLight = new THREE.PointLight(0xffffff, 1.5);
    playerMesh.add(pointLight);
    pointLight.position.set(0, 1.8, -1);

    playerMixer = new THREE.AnimationMixer(gltf.scene);

    const clipWalk = THREE.AnimationUtils.subclip(gltf.animations[0], 'walk', 0, 30);
    actionWalk = playerMixer.clipAction(clipWalk);
    // actionWalk.play();

    const clipIdle = THREE.AnimationUtils.subclip(gltf.animations[0], 'idle', 31, 281);
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

    guideMesh.traverse((child)=>{
        child.receiveShadow = true;
        child.castShadow = true;
    })

    guideMesh.position.set(41, 0, 11.5);//人物初始位置
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
window.addEventListener( 'click', function(e){
    if(e.button===0){
        // console.log("点击了鼠标左键");
        //网页跳转测试
        // window.location.href='http://blog.yoodb.com';
        // window.open('http://blog.yoodb.com', '_blank' + new Date().getTime())
    }
    if(e.button===2){
        // console.log("点击了鼠标右键");
        
    }
} );

let isWalk = false;
const playerHalfHeight = new THREE.Vector3(0, 0.8, 0);
function control()
{
    window.addEventListener('keydown', (e) => {
        if (e.key === 'w') {
            // playerMesh.translateZ(0.1);
    
            const curPos = playerMesh.position.clone();
            playerMesh.translateZ(1);
            const frontPos = playerMesh.position.clone();
            playerMesh.translateZ(-1);
            
            const frontVector3 = frontPos.sub(curPos).normalize()
    
            const raycasterFront = new THREE.Raycaster(playerMesh.position.clone().add(playerHalfHeight), frontVector3);
            const collisionResultsFrontObjs = raycasterFront.intersectObjects(scene.children);
            if (collisionResultsFrontObjs && collisionResultsFrontObjs[0] && collisionResultsFrontObjs[0].distance > 1) {
                playerMesh.translateZ(0.1);
            }
            
            if (!isWalk) {
                crossPlay(actionIdle, actionWalk);
                isWalk = true;
            }
        }
        if (e.key === 's') {
            playerMesh.translateZ(-0.1);
        }
    
        if (e.key ==='a') {
            playerMesh.rotateY(0.1);
        }
        if (e.key ==='d') {
            playerMesh.rotateY(-0.1);
        }
    
        //传送功能测试
        if (e.key==='q') {
            playerMesh.position.set(5, 5, 11.5);
            // playerMesh.position.set(6, 5, 11.5);
            // playerMesh.position.set(7, 5, 11.5);
        }
        if (e.key==='e') {
            playerMesh.position.set(0, 0, 11.5);
        }
    
        if (e.key==='r'){
            guideMesh.position.set(5,0,5);
        }
    
        //网页跳转功能测试
        //当前页面打开网页
        if (e.key==='t') {
            window.location.href='./huizhanonline.html';
        }

        //新打开一个页面打开网页
        if (e.key=='y'){
            window.open('./huizhanonline.html');
        }

        if (e.key=='p'){
            window.open('./virtual_human.html');
        }
    
        //跟随测试
        if (e.key=='i'){
            // playerMesh.position.set(4,0,13);
            guideMesh.add(playerMesh);
            // playerMesh.position.set(0,0,-7);
        }
        if(e.key=='o'){
            guideMesh.remove(playerMesh);
            scene.add(playerMesh);
        }
    })
}
control();



window.addEventListener('keyup', (e) => {
    if (e.key === 'w') {
        crossPlay(actionWalk, actionIdle);
        isWalk = false;
    }
});

//获取鼠标坐标
let preClientX;
let preClientY;
// let mouse;
window.addEventListener('mousemove', (e) => {
    // if (preClientX && playerMesh) {
    //     camera.rotateY(-(e.clientX - preClientX) * 0.01);
    // }
    // preClientX = e.clientX;
    // if (preClientY && playerMesh) {
    //     camera.rotateX(-(e.clientY - preClientY) * 0.01);
    // }
    // preClientY = e.clientY;
    // console.log("mouse_position:",e.clientX, "," ,e.clientY);

});

// 加载场馆
new THREE.GLTFLoader().load('../resources/models/zhanguan.glb', (gltf) => {

    // console.log(gltf);
    scene.add(gltf.scene);

    gltf.scene.traverse((child) => {
        // console.log(child.name);

        child.castShadow = true;
        child.receiveShadow = true;

        if (child.name === '2023') {
            const video = document.createElement('video');
            video.src = "./resources/yanhua.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();

            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

            child.material = videoMaterial;
        }
        if (child.name === '大屏幕01' || child.name === '大屏幕02' || child.name === '操作台屏幕' || child.name === '环形屏幕2') {
            const video = document.createElement('video');
            video.src = "./resources/video01.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();

            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

            child.material = videoMaterial;
        }
        if (child.name === '环形屏幕') {
            const video = document.createElement('video');
            video.src = "./resources/video02.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();

            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

            child.material = videoMaterial;
        }
        if (child.name === '柱子屏幕') {
            const video = document.createElement('video');
            video.src = "./resources/yanhua.mp4";
            video.muted = true;
            video.autoplay = "autoplay";
            video.loop = true;
            video.play();

            const videoTexture = new THREE.VideoTexture(video);
            const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

            child.material = videoMaterial;
        }
    })



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

function crossPlay(curAction, newAction) {
    curAction.fadeOut(0.3);
    newAction.reset();
    newAction.setEffectiveWeight(1);
    newAction.play();
    newAction.fadeIn(0.3);
}

//检测鼠标点击到了哪个物体
function onPointerMove()
{
    let mouse= new THREE.Vector2();
    let raycaster= new THREE.Raycaster();
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
        mouse_on_object_name=intersect.object.name;
        console.log(intersect.object.name);
        // if (intersect.object.name === '2023') {
        //     crossPlay(actionWalk, actionIdle);
        //     isWalk = false;
        //     guideMesh.position.set(5,0,5);
        // }
        // if (intersect.object.name === '大屏幕01' || intersect.object.name === '大屏幕02' || intersect.object.name === '操作台屏幕' || intersect.object.name === '环形屏幕2') {
        //     crossPlay(actionWalk, actionIdle);
        //     isWalk = false;
        //     guideMesh.position.set(5,0,5);
        // }
        // if (intersect.object.name === '环形屏幕') {
        //     crossPlay(actionWalk, actionIdle);
        //     isWalk = false;
        //     guideMesh.position.set(5,0,5);
        // }
        // if (intersect.object.name === '柱子屏幕') {
        //     crossPlay(actionWalk, actionIdle);
        //     isWalk = false;
        //     guideMesh.position.set(5,0,5);
        // }
    }});
}

let t = 0;
// //给定一条曲线，让特定的mesh按轨迹自动移动
function moveAlongCurve(mesh,curve) {
    
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


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    
    // guideMesh.rotateY(-0.1);

    //调用onPointerMove
    onPointerMove();

    //调用moveAlongCurve
    moveAlongCurve(guideMesh,curve);

    // moveAlongCurve(curve);

    // console.log("player_position:",playerMesh.position.x,playerMesh.position.y,playerMesh.position.z);
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