import * as THREE from './libs/three.module.js';
import {Player} from './player.js';
import {WorldManager} from './world.js';
import {CollisionsDetector} from './collisions.js'
import {AnimationManager} from './animations.js'
import{ControlManager} from './controls.js'
//import {loadingManager} from './loader.js'
import Stats from './libs/stats.module.js'
import * as GUI from './libs/dat.gui.module.js'
import {OrbitControls} from './libs/OrbitControls.js'





function init() {
    //SETUP BUTTONS

    //GAMEOVER MENU
    let restartButtonGO = document.getElementById("gameOver-restart");
    restartButtonGO.onclick= function(){
        window.location.reload();
    };
    let menuButtonGO = document.getElementById("gameOver-menu");
    menuButtonGO.onclick= function(){
        window.location.replace('./index.html')
    };

    //PAUSE MENU
    let escFlag=false;
    document.addEventListener('keydown', (e) => onKeyPress_(e), false);
    function onKeyPress_(event){
        switch (event.keyCode) {
            //esc
            case 27:
                escFlag=true;
                //stampFlag=!stampFlag;
            break;

            //1
            case 49:
                camera.position.set(pos1.x, pos1.y, pos1.z);
                camera.rotation.set(rot1.x, rot1.y, rot1.z);
            break;

            case 50:
                camera.position.set(pos2.x, pos2.y, pos2.z);
                camera.rotation.set(rot2.x, rot2.y, rot2.z);
            break;

            case 51:
                camera.position.set(pos3.x, pos3.y, pos3.z);
                camera.rotation.set(rot3.x, rot3.y, rot3.z);
            break;

            case 52:

                controls.enabled=!controls.enabled;

            break;

            default:
            break;
        }
    }

    let restartButtonPause = document.getElementById("pause-restart");
    restartButtonPause.onclick= function(){
        window.location.reload();
    };

    let resumeButtonPause = document.getElementById("pause-resume");
    resumeButtonPause.onclick= function(){
        document.getElementById("pause-menu").style.display = "none";
        escFlag=false;
        //pauseTime+=clock.getElapsedTime()*1000;
        clock.start();
        for(let obj of tweensTemp){
            obj.start();
        }
        requestAnimationFrame(render);
    };

    let menuButtonPause = document.getElementById("pause-menu-button");
    menuButtonPause.onclick= function(){
        window.location.replace('./index.html')
    };
    // canvas
    //const canvas = document.getElementById('game-canvas');

    //SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181818);

    //CAMERA
    let pos1=new THREE.Vector3(0.024576205223744825, 4.008733385983772, 5.035208178921649);
    let rot1=new THREE.Vector3(-0.5426813163122307, -0.0012426310974037312, -0.0007494059462511752);

    let pos2=new THREE.Vector3( 7.979663356220904, 5.527074986540818, 6.902485896911645);
    let rot2= new THREE.Vector3(-0.6751900947442467, 0.7341416722679837, 0.4923836140827761);

    let pos3=new THREE.Vector3(-0.01087992252692748, 4.521662348120875, 7.497612977286614);
    let rot3=new THREE.Vector3(-0.5426813163122307, -0.0012426310974037312, -0.0007494059462511752);


    let camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 300);
    camera.position.set(pos1.x, pos1.y, pos1.z);

    //RENDER
    function onWindowResize() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    const renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff)
    renderer.shadowMap.enabled = true;
    //renderer.shadowMap.renderSingleSided = false;
    window.addEventListener('resize', onWindowResize, false);

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    //ORBIT
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.enabled=false;

    //CLOCK
    let clock=new THREE.Clock(false);

    let pauseTime=0

    //SETUP LOADER MANAGER
    function onTransitionEnd( event ) {

    	event.target.remove();

    }

    const loadingManager = new THREE.LoadingManager( () => {

        const loadingScreen = document.getElementById( 'loading-screen' );
        loadingScreen.classList.add( 'fade-out' );

        // optional: remove loader from DOM via event listener
        //loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

    } );
    loadingManager.onProgress = function(url, itemsLoaded, itemsTotal) {
        console.log("loaded: " + url);
    }

    //CLASSES
    const world_ = new WorldManager({
        scene: scene,
        loadingManager: loadingManager,
    });

    const player_ = new Player({
        scene: scene,
        loadingManager: loadingManager,
    });
    const animationManager_ = new AnimationManager(
        player_.getCharacterParts()
    );
    const collisionsDetector_ = new CollisionsDetector({
        player: player_,
        world: world_,
        scene: scene,
        animationManager: animationManager_,
    });
    const controlManager_ = new ControlManager({
        animationManager: animationManager_,
        player: player_,
    })




    let hearts = document.createElement('div');
    hearts.innerHTML = "HEARTS: 0 ";
    hearts.style.color="white";
    hearts.style.float="left";
    hearts.style.marginTop=0.6+"%";

    let score = document.createElement('div');
    score.innerHTML = "SCORE: 0 ";
    score.style.color="white";
    score.style.marginLeft=10+"%";
    score.style.marginTop=0.6+"%";


    let div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.backgroundColor="black";
    div.style.position="fixed";
    div.style.width=100+"%";
    div.style.float="left";
    div.style.height=40+"px";
    div.style.top=0+"px";
    div.style.left=0+"px";
    div.style.paddingLeft= 10 +"%";

    loadingManager.onLoad = function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.remove();
        document.body.appendChild(renderer.domElement);
        document.body.appendChild(div);
        div.appendChild(hearts);
        div.appendChild(score);
        requestAnimationFrame(render);
        clock.start();
    }



    let prevTime = 0;
    let aTime = 0;
    let deltaTime=0;
    let timeElapsed_=0;
    let tweensTemp;

    //let stampFlag=false;
    const render = function(timeElapsed) {
        //renderer.clear()
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }


        if (prevTime == null) {
            prevTime = timeElapsed;
        }
        if (timeElapsed == null) {
            timeElapsed = 0;
        }


        //aTime = (timeElapsed - prevTime);
        //let aTime2 = aTime*0.001;
        //prevTime = timeElapsed;
        deltaTime=clock.getDelta();

        //if(!stampFlag){
        if (!collisionsDetector_.getgameOverFlag()) {
            if(escFlag){
                clock.stop();
                tweensTemp=TWEEN.getAll();
                for(let obj of tweensTemp){
                    obj.stop();
                }
                document.getElementById("pause-menu").style.display = "block";
                return
            }

            TWEEN.update();
            world_.Update(deltaTime);
            player_.Update();
            controlManager_.Update();
            collisionsDetector_.Update();

        }

        else{
            document.getElementById("gameOver").style.display = "block";
            TWEEN.update();
            setInterval(function(){TWEEN.removeAll(); }, 2500);

        }
        //}

        hearts.innerHTML = "HEARTS: " + collisionsDetector_.getHearts();
        score.innerHTML = "SCORE: " + collisionsDetector_.getScore();
        renderer.render(scene, camera);
        requestAnimationFrame(render);

    };


}

init();
