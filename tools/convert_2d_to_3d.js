const space_pos_convert = {
    //根据当前相机的投影矩阵将点从屏幕空间 2D 转换为 3D 空间中的点
    //效果很烂，勉勉强强但是不稳定。感谢南航RM李霖杰提供的思路将z设为1
    get3DPosition: function get3DPosition(x, y, camera, scene, hyper_z) {
        var vector = new THREE.Vector3();
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        vector.x = (x / window.innerWidth) * 2 - 1;
        vector.y = - (y / window.innerHeight) * 2 + 1;
        vector.z = hyper_z;

        // unproject the vector
        vector.unproject(camera);

        // calculate the ray from the camera to the vector
        var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

        // check for intersection with objects in the scene
        var intersects = ray.intersectObjects(scene.children);
        if (intersects.length > 0) {
            return intersects[0].point;
        }
        else {
            return null;
        }
    },




    //chatGPT写的通过深度图采样，shader改深度缓冲的方式获取3d坐标，感谢上交苏辂提供的思路
    convert2Dto3D: function convert2Dto3D(mouseX, mouseY, camera, width, height, scene) {
        // 构建纹理
        var depthTarget = new THREE.WebGLRenderTarget(width, height);
        depthTarget.texture.minFilter = THREE.LinearFilter;

        // 渲染深度图
        renderer.render(scene, camera, depthTarget);

        // 创建着色器
        var material = new THREE.ShaderMaterial({
            uniforms: {
                mouse: { value: new THREE.Vector2(mouseX, mouseY) },
                depthMap: { value: depthTarget.texture },
                projectionMatrix: { value: camera.projectionMatrix },
                viewMatrix: { value: camera.matrixWorldInverse }
            },
            vertexShader: `
                uniform vec2 mouse;
                uniform mat4 projectionMatrix;
                uniform mat4 viewMatrix;
                uniform sampler2D depthMap;
                varying vec4 pos;
                void main() {
                    pos = vec4(position, 1.0);
                    gl_Position = projectionMatrix * viewMatrix * pos;
                }
            `,
            fragmentShader: `
                uniform vec2 mouse;
                uniform sampler2D depthMap;
                varying vec4 pos;
                void main() {
                    float depth = texture2D(depthMap, mouse).r;
                    vec4 viewPos = vec4(mouse * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
                    vec4 worldPos = viewMatrix * viewPos;
                    worldPos /= worldPos.w;
                    gl_FragColor = vec4(worldPos.xyz, 1.0);
                }
            `
        });

        // 创建一个平面作为渲染目标
        var plane = new THREE.PlaneBufferGeometry(width, height);
        var mesh = new THREE.Mesh(plane, material);
        scene.add(mesh);

        // 渲染一次着色器并获取结果
        renderer.render(scene, camera);
        var pixelBuffer = new Uint8Array(4);
        renderer.readRenderTargetPixels(depthTarget, mouseX, height - mouseY, 1, 1, pixelBuffer);
        var worldPos = new THREE.Vector3(
            (pixelBuffer[0] / 255) * 2 - 1,
            (pixelBuffer[1] / 255) * 2 - 1,
            (pixelBuffer[2] / 255) * 2 - 1
        );
        worldPos.applyMatrix4(camera.matrixWorldInverse);
        scene.remove(mesh);
        return worldPos;
    },

    //获取触摸点的坐标并转换为ThreeJS中的坐标
    touch_crash_detect: function touch_crash_detect() {
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
}

window.space_pos_convert = space_pos_convert