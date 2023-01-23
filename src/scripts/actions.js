const player_actions={
    // 动作切换函数
    crossPlay:function crossPlay(curAction, newAction) {
        // curAction是现在正在播的动作，newAction是将要播的动作
        curAction.fadeOut(0.3);
        newAction.reset();
        newAction.setEffectiveWeight(1);
        newAction.play();
        newAction.fadeIn(0.3);
    },

    idle2walk_forward:function idle2walk_forward(Mesh, Idle, Walk) {
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
            player_actions.crossPlay(Idle, Walk);
            isWalk = true;
        }
    },
    
    idle2walk_back:function idle2walk_back(Mesh, Idle, Walk) {
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
            player_actions.crossPlay(Idle, Walk);
            isWalk = true;
        }
    }
}

window.player_actions = player_actions;