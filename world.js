import * as THREE from './libs/three.module.js';
import {lavaGround} from './loader.js';
import {SpikeBall} from './loader.js';
import {Star} from './loader.js';
import {Heart} from './loader.js';
import {Rock} from './loader.js';
import {Stalagmites} from './loader.js'
import {RectAreaLightUniformsLib} from './libs/RectAreaLightUniformsLib.js';
import {RectAreaLightHelper} from './libs/RectAreaLightHelper.js';


const SPAWNDISTANCE = 100;
const SEPARATIONDISTANCE = 20;

const TEXTSPAWNDISTANCE = 100;
const TEXTSEPARATIONDISTANCE = 10;

const RIGHT_X_SPAWN = 2;
const LEFT_X_SPAWN = -2;

const INITIAL_SPEED = 13;

const Right = 0;
const Left = 1;
const Center = 2;

const LAVA_PLANE_HEIGHT = 1000;
const LAVA_PLANE_WIDTH = 1000;
const LAVA_PLANE_Y_POS = -5;

const BRIDGE_WIDTH = 8;
const BRIDGE_HEIGHT = 1;
const BRIDGE_DEPTH = 106;

const STAR = 0;
const HEART = 1;
const SPIKEBALL = 2;



class WorldObject {

    constructor(params) {
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        this.mesh = new THREE.Mesh();
        //this.spikeBall=new SpikeBall({scene: this.mesh});
        //this.spikeBall.load();
        this.mesh.position.z += -100;


        /*let tween=new TWEEN.Tween(this.mesh.position)
        .to({z:8},10000)
        .easing(TWEEN.Easing.Linear.None)
        .start();*/
        this.randomSpawn();


        //this.boxHelper=new THREE.BoxHelper(this.mesh, 0xf400a1);
        //this.scene=params.scene;
        //this.scene.add(this.boxHelper);

        this.collider = new THREE.Box3();
    }

    randomSpawn() {

        let value = Math.random();
        if (value <= 0.55) {
            this.type = SPIKEBALL;
            this.spawnSpikeBall();
        } else if (value <= 0.85) {
            this.type = STAR;
            this.spawnStar();
        } else if(value >= 0.97){
            this.type = HEART;
            this.spawnHeart();
        }
    }

    getType() {
        return this.type;
    }

    spawnHeart() {
        this.heart = new Heart({
            scene: this.mesh
        });
        this.heart.load();
    }

    spawnSpikeBall() {
        this.spikeBall = new SpikeBall({
            scene: this.mesh
        });
        this.spikeBall.load();
    }

    spawnStar() {
        this.star = new Star({
            scene: this.mesh
        });
        this.star.load();
    }

    getMesh() {
        return this.mesh;
    }

    getCollider() {
        return this.collider;
    }

    updateCollider() {
        this.collider.setFromObject(this.mesh);
        //this.boxHelper.update();
    }

    Update(timeElapsed) {
        this.updateCollider();
    }
};

export class WorldManager {

    constructor(params) {
        this.stalagmites = new THREE.Mesh();
        this.textures = [];
        this.objects = [
            [],
            [],
            []
        ];
        this.scene = params.scene;
        this.unused = [];
        this.speed = [INITIAL_SPEED, INITIAL_SPEED, INITIAL_SPEED];
        this.separation_distance = [SEPARATIONDISTANCE, SEPARATIONDISTANCE, SEPARATIONDISTANCE];
        this.spawn_distance = [SPAWNDISTANCE, SPAWNDISTANCE, SPAWNDISTANCE];
        this.loadingManager=params.loadingManager;

        this.setupLights();
        this.createLava();
        this.createBridge();
        this.spawnStalagamites();

    }

    spawnStalagamites() {
        for (let i = 0; i < 50; i++) {
            let stal = new Stalagmites({
                loadingManager: this.loadingManager,
            });
            stal.loadStal2(this.stalagmites);
        }
        this.scene.add(this.stalagmites);

    }

    setupLights() {
        //lights
        //const ambientLight = new THREE.AmbientLight(0x404040);
        const ambientLight = new THREE.AmbientLight(0x16141E);
        this.scene.add(ambientLight);

        const spotLight = new THREE.SpotLight(0xcf6010);
        spotLight.position.set(0, 10, 0);
        this.scene.add(spotLight);

        //const light = new THREE.PointLight( 0xff0000, 1, 100 );
        //light.position.set( 0, 0, 0 );
        //scene.add( light );

        const skyColor = 0x000000;
        const groundColor = 0xFF5900;
        const intensity = 8;
        const hemispherelight = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        this.scene.add(hemispherelight);
    }

    createLava() {
        //lavaGround.load(this.scene);
        const lavaGeometry = new THREE.PlaneGeometry(LAVA_PLANE_WIDTH, LAVA_PLANE_HEIGHT);

        const lavaNormalMap = new THREE.TextureLoader(this.loadingManager).load("./assets/lava/normal.jpg")
        lavaNormalMap.wrapS = THREE.RepeatWrapping;
        lavaNormalMap.wrapT = THREE.RepeatWrapping;
        lavaNormalMap.repeat.set(100, 100);
        lavaNormalMap.magFilter = THREE.NearestFilter;
        lavaNormalMap.minFilter = THREE.NearestFilter;

        const lavaRoughnessMap = new THREE.TextureLoader(this.loadingManager).load("./assets/lava/roughness.jpg");
        lavaRoughnessMap.wrapS = THREE.RepeatWrapping;
        lavaRoughnessMap.wrapT = THREE.RepeatWrapping;
        lavaRoughnessMap.repeat.set(100, 100);
        lavaRoughnessMap.magFilter = THREE.NearestFilter;
        lavaRoughnessMap.minFilter = THREE.NearestFilter;

        const lavaColorMap = new THREE.TextureLoader(this.loadingManager).load("./assets/lava/color.jpg");
        lavaColorMap.wrapS = THREE.RepeatWrapping;
        lavaColorMap.wrapT = THREE.RepeatWrapping;
        lavaColorMap.repeat.set(100, 100);
        lavaColorMap.magFilter = THREE.NearestFilter;
        lavaColorMap.minFilter = THREE.NearestFilter;


        const lavaEmissiveMap = new THREE.TextureLoader(this.loadingManager).load("./assets/lava/emissive.jpg");
        lavaEmissiveMap.wrapS = THREE.RepeatWrapping;
        lavaEmissiveMap.wrapT = THREE.RepeatWrapping;
        lavaEmissiveMap.repeat.set(100, 100);
        lavaEmissiveMap.magFilter = THREE.NearestFilter;
        lavaEmissiveMap.minFilter = THREE.NearestFilter;

        const lavaHeightMap = new THREE.TextureLoader(this.loadingManager).load("./assets/lava/height.jpg");
        lavaHeightMap.wrapS = THREE.RepeatWrapping;
        lavaHeightMap.wrapT = THREE.RepeatWrapping;
        lavaHeightMap.repeat.set(100, 100);
        lavaHeightMap.magFilter = THREE.NearestFilter;
        lavaHeightMap.minFilter = THREE.NearestFilter

        const lavaAoMap = new THREE.TextureLoader(this.loadingManager).load("./assets/lava/ao.jpg");
        lavaAoMap.wrapS = THREE.RepeatWrapping;
        lavaAoMap.wrapT = THREE.RepeatWrapping;
        lavaAoMap.repeat.set(100, 100);
        lavaAoMap.magFilter = THREE.NearestFilter;
        lavaAoMap.minFilter = THREE.NearestFilter;

        const lavaMaterial = new THREE.MeshStandardMaterial({
            map: lavaColorMap,
            aoMap: lavaAoMap,
            normalMap: lavaNormalMap,
            roughnessMap: lavaRoughnessMap,
            emissiveMap: lavaEmissiveMap,
            bumpMap: lavaHeightMap,
            side: THREE.DoubleSide,
            //emissiveIntensity: 10,
            emissive: 0xec8058,
        });

        //const lavaMaterial = new THREE.MeshBasicMaterial( {color: "black", side: THREE.DoubleSide} );
        const lava = new THREE.Mesh(lavaGeometry, lavaMaterial);
        //lava.rotation.x=Math.PI/2;
        //lava.roughness=1;
        //lava.receiveShadow = false;
        lava.position.y += LAVA_PLANE_Y_POS;
        lava.rotation.x = Math.PI / 2;
        lava.receiveShadow = true;
        lava.castShadow = true;
        this.scene.add(lava);

        const rectLight = new THREE.RectAreaLight(0xff4e01, 1, 100, 200);
        rectLight.position.set(0, 0, 0);
        rectLight.rotation.x = Math.PI / 2;
        rectLight.position.y -= 6;
        rectLight.position.z -= 50;
        //rectLight.lookAt( 0, 0, 0 );
        //let helper = new RectAreaLightHelper(rectLight);
        //rectLight.add(helper);
        this.scene.add(rectLight);

    }

    createBridge() {

        RectAreaLightUniformsLib.init();
        let lightColor = 0xFFFFFF;
        let lightIntensity = 20;
        let lightWidth = 8;
        let lightHeight = 12;
        let light = new THREE.RectAreaLight(lightColor, lightIntensity, lightHeight, lightWidth);
        light.position.set(0, 6, -100);
        light.rotation.z = Math.PI * 0.5;
        light.rotation.y = Math.PI;
        this.scene.add(light);

        let helper = new RectAreaLightHelper(light);
        light.add(helper);


        let bridgeGeometry = new THREE.BoxGeometry(BRIDGE_WIDTH, BRIDGE_HEIGHT, BRIDGE_DEPTH);
        let bridgeTexture = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/stonetext.jpg');
        bridgeTexture.wrapS = THREE.RepeatWrapping;
        bridgeTexture.wrapT = THREE.RepeatWrapping;
        bridgeTexture.repeat.set(10, 1);
        bridgeTexture.magFilter = THREE.NearestFilter;
        bridgeTexture.minFilter = THREE.NearestFilter;

        let bridgeNormalMap = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/StoneNormalMap.png');
        bridgeNormalMap.wrapS = THREE.RepeatWrapping;
        bridgeNormalMap.wrapT = THREE.RepeatWrapping;
        bridgeNormalMap.repeat.set(10, 1);
        bridgeNormalMap.magFilter = THREE.NearestFilter;
        bridgeNormalMap.minFilter = THREE.NearestFilter;


        let bridgeTextureUp = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/stonetext.jpg');
        bridgeTextureUp.wrapS = THREE.RepeatWrapping;
        bridgeTextureUp.wrapT = THREE.RepeatWrapping;
        bridgeTextureUp.repeat.set(5, 50);
        bridgeTextureUp.magFilter = THREE.NearestFilter;
        bridgeTextureUp.minFilter = THREE.NearestFilter;

        let bridgeNormalUp = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/StoneNormalMap.png');
        bridgeNormalUp.wrapS = THREE.RepeatWrapping;
        bridgeNormalUp.wrapT = THREE.RepeatWrapping;
        bridgeNormalUp.repeat.set(5, 50);
        bridgeNormalUp.magFilter = THREE.NearestFilter;
        bridgeNormalUp.minFilter = THREE.NearestFilter;

        let bridgeTextureLateralR = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/stonetext.jpg');
        bridgeTextureLateralR.wrapS = THREE.RepeatWrapping;
        bridgeTextureLateralR.wrapT = THREE.RepeatWrapping;
        bridgeTextureLateralR.repeat.set(40, 1);
        bridgeTextureLateralR.magFilter = THREE.NearestFilter;
        bridgeTextureLateralR.minFilter = THREE.NearestFilter;

        let bridgeLateralNormalR = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/StoneNormalMap.png');
        bridgeLateralNormalR.wrapS = THREE.RepeatWrapping;
        bridgeLateralNormalR.wrapT = THREE.RepeatWrapping;
        bridgeLateralNormalR.repeat.set(40, 1);
        bridgeLateralNormalR.magFilter = THREE.NearestFilter;
        bridgeLateralNormalR.minFilter = THREE.NearestFilter;

        let bridgeTextureLateralL = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/stonetext.jpg');
        bridgeTextureLateralL.wrapS = THREE.RepeatWrapping;
        bridgeTextureLateralL.wrapT = THREE.RepeatWrapping;
        bridgeTextureLateralL.repeat.set(40, 1);
        bridgeTextureLateralL.magFilter = THREE.NearestFilter;
        bridgeTextureLateralL.minFilter = THREE.NearestFilter;

        let bridgeLateralNormalL = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/StoneNormalMap.png');
        bridgeLateralNormalL.wrapS = THREE.RepeatWrapping;
        bridgeLateralNormalL.wrapT = THREE.RepeatWrapping;
        bridgeLateralNormalL.repeat.set(40, 1);
        bridgeLateralNormalL.magFilter = THREE.NearestFilter;
        bridgeLateralNormalL.minFilter = THREE.NearestFilter;

        const materials = [
            new THREE.MeshStandardMaterial({
                map: bridgeTextureLateralR,
                normalMap: bridgeLateralNormalR,
                side: THREE.DoubleSide
            }),
            new THREE.MeshStandardMaterial({
                map: bridgeTextureLateralL,
                normalMap: bridgeLateralNormalL,
                side: THREE.DoubleSide,
                shadowSide: THREE.BackSide
            }),
            //new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 }),
            new THREE.MeshStandardMaterial({
                map: bridgeTextureUp,
                normalMap: bridgeNormalUp,
                side: THREE.DoubleSide,
                shadowSide: THREE.BackSide
            }),
            new THREE.MeshStandardMaterial({
                map: bridgeTextureUp,
                normalMap: bridgeNormalUp,
                side: THREE.DoubleSide
            }),
            new THREE.MeshStandardMaterial({
                map: bridgeTexture,
                normalMap: bridgeNormalMap,
                side: THREE.DoubleSide
            }),
            new THREE.MeshStandardMaterial({
                map: bridgeTexture,
                normalMap: bridgeNormalMap,
                side: THREE.DoubleSide
            }),
        ];

        this.bridge = new THREE.Mesh(bridgeGeometry, materials);
        //this.bridge.castShadow=true;
        this.bridge.receiveShadow = true;
        this.bridge.castShadow = true;
        this.bridge.position.y += -0.5;
        this.bridge.position.z += -50;

        this.scene.add(this.bridge);

        let rotateFlag = false;
        let mesh;

        for (let i = 0; i < 100; i += 10) {
            let arch = new THREE.Shape();
            let x = 0.1;
            let y = -5;
            arch.moveTo(x + 0, y + 0);
            arch.bezierCurveTo(0.1, -5, 0, -5, 0, -5);
            arch.bezierCurveTo(0, -5, 0, -1, 0, -1);
            arch.bezierCurveTo(0, -1, 10, -1, 10, -1);
            arch.bezierCurveTo(0.3, -1, 0.3, -4.5, 0.1, -5);


            let extrudeSettings = {
                steps: 16,
                depth: BRIDGE_WIDTH - 2,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 1,
                bevelSegments: 2,
            };

            let archTex = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/stonetext.jpg');
            archTex.rotation = Math.PI * 0.5;
            archTex.wrapS = THREE.RepeatWrapping;
            archTex.wrapT = THREE.RepeatWrapping;
            archTex.repeat.set(1, 1);
            archTex.magFilter = THREE.NearestFilter;
            archTex.minFilter = THREE.NearestFilter;

            let archNormal = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/StoneNormalMap.png');
            archNormal.rotation = Math.PI * 0.5;
            archNormal.wrapS = THREE.RepeatWrapping;
            archNormal.wrapT = THREE.RepeatWrapping;
            archNormal.repeat.set(1, 1);
            archNormal.magFilter = THREE.NearestFilter;
            archNormal.minFilter = THREE.NearestFilter;

            let archTexLateral = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/stonetext.jpg');
            archTexLateral.rotation = Math.PI * 0.5;
            archTexLateral.wrapS = THREE.RepeatWrapping;
            archTexLateral.wrapT = THREE.RepeatWrapping;
            archTexLateral.repeat.set(1, 1);
            archTexLateral.magFilter = THREE.NearestFilter;
            archTexLateral.minFilter = THREE.NearestFilter;

            let archNormalLateral = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/StoneNormalMap.png');
            archNormalLateral.rotation = Math.PI * 0.5;
            archNormalLateral.wrapS = THREE.RepeatWrapping;
            archNormalLateral.wrapT = THREE.RepeatWrapping;
            archNormalLateral.repeat.set(1, 1);
            archNormalLateral.magFilter = THREE.NearestFilter;
            archNormalLateral.minFilter = THREE.NearestFilter;


            let archMat = [
                new THREE.MeshStandardMaterial({
                    map: archTexLateral,
                    normalMap: archNormalLateral,
                    side: THREE.DoubleSide,
                }),
                new THREE.MeshStandardMaterial({
                    map: archTex,
                    normalMap: archNormal,
                    side: THREE.DoubleSide,
                }),
                //new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 }),
                new THREE.MeshStandardMaterial({
                    map: archTex,
                    normalMap: archNormal,
                    side: THREE.DoubleSide,
                }),
                new THREE.MeshStandardMaterial({
                    map: archTex,
                    normalMap: archNormal,
                    side: THREE.DoubleSide,
                }),
                new THREE.MeshStandardMaterial({
                    map: archTex,
                    normalMap: archNormal,
                    side: THREE.DoubleSide,
                }),
            ]
            let archGeometry = new THREE.ExtrudeGeometry(arch, extrudeSettings);
            let mesh = new THREE.Mesh(archGeometry, archMat);
            //mesh.castShadow = true;
            //mesh.receiveShadow = true;
            mesh.position.y += -0.1;
            mesh.position.z+= 50;



            if (rotateFlag) {
                mesh.rotation.y = -Math.PI * 0.5;
                mesh.position.x += 0.5 * (BRIDGE_WIDTH - 2);
                mesh.position.z += -i - 10;
                rotateFlag = false;
            } else {
                mesh.rotation.y = Math.PI * 0.5;
                mesh.position.x += -0.5 * (BRIDGE_WIDTH - 2);
                mesh.position.z += -i;
                rotateFlag = true;
            }
            //mesh.scale.set(1,0.5,0.1)
            this.bridge.add(mesh);
        }

        let length = 12,
            width = 8;
        let shape = new THREE.Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, width);
        shape.lineTo(length, width);
        shape.lineTo(length, 0);
        shape.lineTo(0, 0);

        let extrudeSettings = {
            steps: 2,
            depth: 16,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        };

        let leftArmRest = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        let leftArmRestTex = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/restArmStone.jpg');
        leftArmRestTex.wrapS = THREE.RepeatWrapping;
        leftArmRestTex.wrapT = THREE.RepeatWrapping;
        leftArmRestTex.repeat.set(0.08, 5);
        leftArmRestTex.magFilter = THREE.NearestFilter;
        leftArmRestTex.minFilter = THREE.NearestFilter;

        let leftArmRestNormalMap = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/restArmStonNMap.jpg');
        leftArmRestNormalMap.wrapS = THREE.RepeatWrapping;
        leftArmRestNormalMap.wrapT = THREE.RepeatWrapping;
        leftArmRestNormalMap.repeat.set(0.08, 5);
        leftArmRestNormalMap.magFilter = THREE.NearestFilter;
        leftArmRestNormalMap.minFilter = THREE.NearestFilter;

        let leftArmRestTex2 = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/restArmStone.jpg');
        leftArmRestTex2.wrapS = THREE.RepeatWrapping;
        leftArmRestTex2.wrapT = THREE.RepeatWrapping;
        leftArmRestTex2.repeat.set(0.05, 0.05);
        leftArmRestTex2.magFilter = THREE.NearestFilter;
        leftArmRestTex2.minFilter = THREE.NearestFilter;

        let leftArmRestNormalMap2 = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/restArmStonNMap.jpg');
        leftArmRestNormalMap2.wrapS = THREE.RepeatWrapping;
        leftArmRestNormalMap2.wrapT = THREE.RepeatWrapping;
        leftArmRestNormalMap2.repeat.set(0.05, 0.05);
        leftArmRestNormalMap2.magFilter = THREE.NearestFilter;
        leftArmRestNormalMap2.minFilter = THREE.NearestFilter;

        let leftArmRestMat = [
            new THREE.MeshStandardMaterial({
                map: leftArmRestTex2,
                normalMap: leftArmRestNormalMap2,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshStandardMaterial({
                map: leftArmRestTex,
                normalMap: leftArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
            //new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 }),
            new THREE.MeshStandardMaterial({
                map: leftArmRestTex,
                normalMap: leftArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshStandardMaterial({
                map: leftArmRestTex,
                normalMap: leftArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshStandardMaterial({
                map: leftArmRestTex,
                normalMap: leftArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshStandardMaterial({
                map: leftArmRestTex,
                normalMap: leftArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
        ];

        mesh = new THREE.Mesh(leftArmRest, leftArmRestMat);
        //mesh.castShadow = true;
        //mesh.receiveShadow = true;
        mesh.rotation.z = Math.PI / 2;
        mesh.position.x += -4 + 0.45;
        let box = new THREE.Box3().setFromObject(mesh);
        let boxSize = box.getSize(new THREE.Vector3());
        mesh.scale.set(0.1, 0.05, 104 / boxSize.z);
        mesh.position.z = -96;
        mesh.position.z+=50;
        mesh.position.y+=(boxSize.y)*0.05*0.5;
        this.bridge.add(mesh);


        let rightArmRest = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        let rightArmRestTex = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/restArmStone.jpg');
        rightArmRestTex.wrapS = THREE.RepeatWrapping;
        rightArmRestTex.wrapT = THREE.RepeatWrapping;
        rightArmRestTex.repeat.set(0.08, 5);
        rightArmRestTex.magFilter = THREE.NearestFilter;
        rightArmRestTex.minFilter = THREE.NearestFilter;

        let rightArmRestNormalMap = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/restArmStonNMap.jpg');
        rightArmRestNormalMap.wrapS = THREE.RepeatWrapping;
        rightArmRestNormalMap.wrapT = THREE.RepeatWrapping;
        rightArmRestNormalMap.repeat.set(0.08, 5);
        rightArmRestNormalMap.magFilter = THREE.NearestFilter;
        rightArmRestNormalMap.minFilter = THREE.NearestFilter;

        let rightArmRestTex2 = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/restArmStone.jpg');
        rightArmRestTex2.wrapS = THREE.RepeatWrapping;
        rightArmRestTex2.wrapT = THREE.RepeatWrapping;
        rightArmRestTex2.repeat.set(0.05, 0.05);
        rightArmRestTex2.magFilter = THREE.NearestFilter;
        rightArmRestTex2.minFilter = THREE.NearestFilter;

        let rightArmRestNormalMap2 = new THREE.TextureLoader(this.loadingManager).load('assets/bridge/restArmStonNMap.jpg');
        rightArmRestNormalMap2.wrapS = THREE.RepeatWrapping;
        rightArmRestNormalMap2.wrapT = THREE.RepeatWrapping;
        rightArmRestNormalMap2.repeat.set(0.05, 0.05);
        rightArmRestNormalMap2.magFilter = THREE.NearestFilter;
        rightArmRestNormalMap2.minFilter = THREE.NearestFilter;

        let rightArmRestMat = [
            new THREE.MeshStandardMaterial({
                map: rightArmRestTex2,
                normalMap: rightArmRestNormalMap2,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshStandardMaterial({
                map: rightArmRestTex,
                normalMap: rightArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
            //new THREE.MeshLambertMaterial( { transparent: true, opacity: 0 }),
            new THREE.MeshStandardMaterial({
                map: rightArmRestTex,
                normalMap: rightArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshStandardMaterial({
                map: rightArmRestTex,
                normalMap: rightArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshStandardMaterial({
                map: rightArmRestTex,
                normalMap: rightArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshStandardMaterial({
                map: rightArmRestTex,
                normalMap: rightArmRestNormalMap,
                side: THREE.DoubleSide,
            }),
        ];

        let mesh2 = new THREE.Mesh(rightArmRest, rightArmRestMat);
        //mesh2.castShadow = true;
        //mesh2.receiveShadow = true;
        mesh2.rotation.z = Math.PI / 2;
        mesh2.position.x += 4;
        box = new THREE.Box3().setFromObject(mesh2);
        boxSize = box.getSize(new THREE.Vector3());
        mesh2.scale.set(0.1, 0.05, 104 / boxSize.z);
        mesh2.position.z = -96;
        mesh2.position.z+=50;
        mesh2.position.y+=(boxSize.y)*0.05*0.5;
        this.bridge.add(mesh2);


    }

    getObjects() {

        return (this.objects);

    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    ShouldISpawn(type) {

            switch (type) {
                case Right:
                    if(Math.random()>0.80){
                        this.separation_distance[Right]=this.getRandomArbitrary(10, 20);
                        if (this.objects[Right].length == 0) {
                            this.SpawnObj(Right);
                        } else {
                            //distance between last spawned object and the spawn location
                            var dist = Math.abs(
                                this.objects[Right][this.objects[Right].length - 1].mesh.position.z +
                                this.spawn_distance[Right]
                            );
                            if (dist > this.separation_distance[Right]) {
                                this.SpawnObj(Right);
                            }
                        }
                    }
                    break;
                    //break;

                case Center:
                    if(Math.random()>0.80){
                        this.separation_distance[Center]=this.getRandomArbitrary(10, 20);
                        if (this.objects[Center].length == 0) {
                            this.SpawnObj(Center);
                        } else {
                            //distance between last spawned object and the spawn location
                            var dist = Math.abs(
                                this.objects[Center][this.objects[Center].length - 1].mesh.position.z +
                                this.spawn_distance[Center]
                            );
                            if (dist > this.separation_distance[Center]) {
                                this.SpawnObj(Center);
                            }
                        }
                    }
                    break;

                case Left:
                    if(Math.random()>0.80){
                        this.separation_distance[Left]=this.getRandomArbitrary(10, 20);
                        if (this.objects[Left].length == 0) {
                            this.SpawnObj(Left);
                        } else {
                            //distance between last spawned object and the spawn location
                            var dist = Math.abs(
                                this.objects[Left][this.objects[Left].length - 1].mesh.position.z +
                                this.spawn_distance[Left]
                            );
                            if (dist > this.separation_distance[Left]) {
                                this.SpawnObj(Left);
                            }
                        }
                    }
                    break;



            }


    }

    SpawnObj(type) {

        const obj = new WorldObject({
            scene: this.bridge,
        });

        switch (type) {
            case Right:
                obj.mesh.position.x = RIGHT_X_SPAWN;
                this.objects[Right].push(obj);
                break;

            case Center:
                this.objects[Center].push(obj);
                break;

            case Left:
                obj.mesh.position.x = LEFT_X_SPAWN;
                this.objects[Left].push(obj);
                break;


        }

        this.scene.add(obj.mesh);
    }

    SpawnTexturePlane() {


            /*const geometry = new THREE.PlaneGeometry(2, 0.1);
        //const texture = new THREE.TextureLoader().load('assets/bridge/stonetext.jpg');
        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0x000000,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = Math.PI * 0.5;
        plane.rotation.z = Math.PI * 0.5;
        plane.position.z += -100;
        plane.position.x += this.getRandomArbitrary(-2, 2);
        this.textures.push(plane);
        this.scene.add(plane);*/


        let mesh=new THREE.Object3D();
        mesh.position.z=-100;
        let stone=new Rock({
            scene: mesh,
        })
        stone.load();
        this.textures.push(mesh);
        this.scene.add(mesh);

    }

    ShouldITextureObj(type) {

        if (this.textures.length == 0) {
            this.SpawnTexturePlane();
        } else {
            //distance between last spawned object and the spawn location
            var dist = Math.abs(
                this.textures[this.textures.length - 1].position.z +
                TEXTSPAWNDISTANCE
            );
            if (dist > TEXTSEPARATIONDISTANCE) {
                this.SpawnTexturePlane();
            }
        }

    }



    Update(timeElapsed) {

        this.ShouldISpawn(Center);

        for (let obj of this.objects[Center]) {
            obj.mesh.position.z += timeElapsed * this.speed[Center];

            if (obj.mesh.position.z > 4) {
                //invisible.push(obj);
                obj.mesh.visible = false;
            } else {
                //visible.push(obj);
            }
            //obj.Update(timeElapsed);
        }

        this.ShouldISpawn(Left);

        for (let obj of this.objects[Left]) {
            obj.mesh.position.z += timeElapsed * this.speed[Left];

            if (obj.mesh.position.z > 4) {
                //invisible.push(obj);
                obj.mesh.visible = false;
            } else {
                //visible.push(obj);
            }
            //obj.Update(timeElapsed);
        }

        this.ShouldISpawn(Right);

        for (let obj of this.objects[Right]) {
            obj.mesh.position.z += timeElapsed * this.speed[Right];

            if (obj.mesh.position.z > 4) {
                //invisible.push(obj);
                obj.mesh.visible = false;
            } else {
                //visible.push(obj);
            }
        }

        /*
        this.ShouldITextureObj();
        let textureSpeed= 15;
        for(let tex of this.textures){
            tex.position.z+=timeElapsed*15;

            if (tex.position.z>4){
                //invisible.push(obj);
                tex.visible =false;
            }
            else{
                //visible.push(obj);
            }
        }

        //preferisco farlo nel collider manager
        /*
        for(let obj of this.objects[Right]){
            obj.Update(timeElapsed);
            //this.boxHelper.update();
        }
        for(let obj of this.objects[Left]){
            obj.Update(timeElapsed);
            //this.boxHelper.update();
        }
        for(let obj of this.objects[Center]){
            obj.Update(timeElapsed);
            //this.boxHelper.update();
        }
        */


        const invisible = [];
        const visible = [];
        //this.objects= visible;
        //this.unused.push(...invisible);

    }

};
