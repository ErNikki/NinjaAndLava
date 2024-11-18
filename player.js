import * as THREE from './libs/three.module.js';
import {ninjaHead} from './loader.js';

const Right=0;
const Left=1;
const Center=2;

//head
//const headWidth=0.3;
const headRadius = 0.22;
//const headHeight=0.22;
//const headDepth=0.3;

//torso
const torsoWidth = 0.6;
const torsoHeight = 1;
const torsoDepth = 0.2;

//upperArm
const upperArmWidth = 0.15;
const upperArmHeight = 0.25;
const upperArmDepth = 0.1;

//lowerArm
const lowerArmWidth = 0.1;
const lowerArmHeight = 0.3;
const lowerArmDepth = 0.1;

//upperLeg
const upperLegWidth = 0.15;
const upperLegHeight = 0.35;
const upperLegDepth = 0.1;

//lowerLeg
const lowerLegWidth = 0.1;
const lowerLegHeight = 0.3;
const lowerLegDepth = 0.1;

//feet
const feetWidth = 0.18;
const feetHeight = 0.1;
const feetDepth = 0.3;

//hand
//const handWidth=0.12;
const handRadius = 0.1;
//const handHeight=0.1;
//const handDepth=0.12;

//root
const rootRadius = 0.08;

//neck
const neckRadius = 0.15;

/*
IMPORTANTE
il position serve ad aggiornare la posizione della mesh
per cui per spostare il cubo sopra l'asse delle y e a destra
dell'asse delle x gli ho sommato la metà della sua lunghezza e altezza.
ecco perchè compaiono i valori 0.5 e non 0
*/

//sull'asse delle x
const INITIAL_X_POS = 0.5;
const INITIAL_Y_POS = torsoHeight*0.5+upperLegHeight+rootRadius+lowerLegHeight+feetHeight ;
const RIGHT_DASH = 2.5;
const LEFT_DASH = -1.5



export class Player {

    constructor(params) {

        this.loadingManager=params.loadingManager;

        this.scene = params.scene;
        this.position = new THREE.Vector3(INITIAL_X_POS, INITIAL_Y_POS, 0.0);
        this.velocity = 0.0;

        this.buildCharacter();
        this.character.position.y+=torsoHeight*0.5+upperLegHeight+rootRadius+lowerLegHeight+feetHeight;
        this.scene.add(this.character);

        this.characterBox= new THREE.Box3();

        //this.boxHelper=new THREE.BoxHelper(this.character, 0xffff00);
        //this.scene.add(this.boxHelper);

        this.AnimationManager=params.AnimationManager

        var d = 5;
        this.dirLight = new THREE.DirectionalLight(0xffffff);
        this.dirLight.castShadow=true;
        this.dirLight.position.set(0, 10, 2);
        this.dirLight.lookAt(0,0,0);
        this.dirLight.shadow.camera.near=1;
        this.dirLight.shadow.camera.far=25;
        this.dirLight.shadow.camera.left = - d;
        this.dirLight.shadow.camera.right = d;
        this.dirLight.shadow.camera.top = d;
        this.dirLight.shadow.camera.bottom = - d;
        this.scene.add(this.dirLight);

        //this.helper = new THREE.DirectionalLightHelper(this.dirLight);
        //this.scene.add(this.helper);
        //this.cameraHelper = new THREE.CameraHelper(this.dirLight.shadow.camera);
        //this.scene.add(this.cameraHelper);
        //this.InitInput();

    }

    getCharacterPosition(){
        return this.waist.position;
    }

    getCharacterParts(){

        return{
            character: this.character,
            waist: this.waist,

            neckRoot: this.neckRoot,
            torso: this.torso,
            head:this.head,

            upperRightArmRoot :this.upperRightArmRoot,
            lowerRightArmRoot: this.lowerRightArmRoot,
            upperRightArm: this.upperRightArm,
            lowerRightArm: this.lowerRightArm,
            rightHand: this.rightHand,

            upperLeftArmRoot: this.upperLeftArmRoot,
            lowerLeftArmRoot: this.lowerLeftArmRoot,
            upperLeftArm: this.upperLeftArm,
            lowerLeftArm: this.lowerLeftArm,
            leftHand: this.leftHand,

            upperRightLegRoot: this.upperRightLegRoot,
            lowerRightLegRoot: this.lowerRightLegRoot,
            upperRightLeg: this.upperRightLeg,
            lowerRightLeg: this.lowerRightLeg,
            rightFeetRoot: this.rightFeetRoot,
            rightFeet: this.rightFeet,

            upperLeftLegRoot: this.upperLeftLegRoot,
            lowerLeftLegRoot: this.lowerLeftLegRoot,
            upperLeftLeg: this.upperLeftLeg,
            lowerLeftLeg: this.lowerLeftLeg,
            leftFeetRoot: this.leftFeetRoot,
            leftFeet: this.leftFeet,
        }
    }

    getCharacterBox(){
        return this.characterBox;
    }

    updateCharacterBox(){
        this.characterBox.setFromObject(this.character);
    }

    buildCharacter() {

        //BUILD CHARACTER
        //hierachical model
        this.neckMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.rootMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.headMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.torsoMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.legMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.upperArmMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.lowerArmMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.upperLegMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.lowerLegMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.handMat = new THREE.MeshStandardMaterial({
          color: "black"
        });
        this.feetMat = new THREE.MeshStandardMaterial({
          color: "black"
        });

        //this.headGeo = new THREE.BoxBufferGeometry(headWidth, headRadius, headDepth);
        this.neckGeo = new THREE.CylinderGeometry(0.08, 0.08, neckRadius, 32);
        this.headGeo = new THREE.SphereGeometry(headRadius, 32, 32);
        this.torsoGeo = new THREE.BoxBufferGeometry(torsoWidth, torsoHeight, torsoDepth);
        this.lowerLegGeo = new THREE.BoxBufferGeometry(lowerLegWidth, lowerLegHeight, lowerLegDepth);
        this.lowerLegRootGeo = new THREE.SphereGeometry(rootRadius, 32, 32);
        this.upperLegGeo = new THREE.BoxBufferGeometry(upperLegWidth, upperLegHeight, upperLegDepth);
        this.upperLegRootGeo = new THREE.SphereGeometry(rootRadius, 32, 32);
        this.lowerArmGeo = new THREE.BoxBufferGeometry(lowerArmWidth, lowerArmHeight, lowerArmDepth);
        this.lowerArmRootGeo = new THREE.SphereGeometry(rootRadius, 32, 32);
        this.upperArmGeo = new THREE.BoxBufferGeometry(upperArmWidth, upperArmHeight, upperArmDepth);
        this.upperArmRootGeo = new THREE.SphereGeometry(rootRadius, 32, 32);
        this.feetGeo = new THREE.BoxBufferGeometry(feetWidth, feetHeight, feetDepth);
        //this.handGeo = new THREE.BoxBufferGeometry(handWidth, handRadius, handDepth);
        this.handGeo = new THREE.SphereGeometry(handRadius, 32, 32);

        this.character = new THREE.Object3D();
        this.waist = new THREE.Object3D();

        this.neckRoot = new THREE.Mesh(this.neckGeo, this.neckMat);

        this.upperRightArmRoot = new THREE.Mesh(this.upperArmRootGeo, this.rootMat);
        this.lowerRightArmRoot = new THREE.Mesh(this.lowerArmRootGeo, this.rootMat);
        this.upperLeftArmRoot = new THREE.Mesh(this.upperArmRootGeo, this.rootMat);
        this.lowerLeftArmRoot = new THREE.Mesh(this.lowerArmRootGeo, this.rootMat);

        this.upperRightLegRoot = new THREE.Object3D();
        this.lowerRightLegRoot = new THREE.Mesh(this.lowerLegRootGeo, this.rootMat);

        this.upperLeftLegRoot = new THREE.Object3D();
        this.lowerLeftLegRoot = new THREE.Mesh(this.lowerLegRootGeo, this.rootMat);

        this.torso = new THREE.Mesh(this.torsoGeo, this.torsoMat);

        this.head = new THREE.Object3D();
        ninjaHead.manager=this.loadingManager;
        ninjaHead.load(this.head);


        this.upperRightArm = new THREE.Mesh(this.upperArmGeo, this.upperArmMat);
        this.lowerRightArm = new THREE.Mesh(this.lowerArmGeo, this.lowerArmMat);
        this.leftHand = new THREE.Mesh(this.handGeo, this.handMat);

        this.upperLeftArm = new THREE.Mesh(this.upperArmGeo, this.upperArmMat);
        this.lowerLeftArm = new THREE.Mesh(this.lowerArmGeo, this.lowerArmMat);
        this.rightHand = new THREE.Mesh(this.handGeo, this.handMat);

        this.upperRightLeg = new THREE.Mesh(this.upperLegGeo, this.upperLegMat);
        this.lowerRightLeg = new THREE.Mesh(this.lowerLegGeo, this.lowerLegMat);
        this.rightFeetRoot= new THREE.Object3D();
        this.rightFeet = new THREE.Mesh(this.feetGeo, this.feetMat);

        this.upperLeftLeg = new THREE.Mesh(this.upperLegGeo, this.upperLegMat);
        this.lowerLeftLeg = new THREE.Mesh(this.lowerLegGeo, this.lowerLegMat);
        this.leftFeetRoot= new THREE.Object3D();
        this.leftFeet = new THREE.Mesh(this.feetGeo, this.feetMat);

        this.character.add(this.waist);
        this.waist.add(this.torso, this.upperLeftLegRoot, this.upperRightLegRoot);

        //torso route
        this.torso.add(this.neckRoot, this.upperLeftArmRoot, this.upperRightArmRoot);

        this.neckRoot.add(this.head);
        this.neckRoot.position.y += torsoHeight * 0.5 + neckRadius * 0.5;

        this.upperLeftArmRoot.add(this.upperLeftArm);
        this.upperLeftArmRoot.position.x += -(torsoWidth * 0.5 + rootRadius);
        this.upperLeftArmRoot.position.y += torsoHeight * 0.5 - rootRadius;

        this.upperLeftArm.add(this.lowerLeftArmRoot);
        this.upperLeftArm.position.y = -rootRadius * 0.5 - 0.5 * upperArmHeight;

        this.lowerLeftArmRoot.add(this.lowerLeftArm);
        this.lowerLeftArmRoot.position.y += -upperArmHeight * 0.5 - rootRadius * 0.5;

        this.lowerLeftArm.add(this.leftHand);
        this.lowerLeftArm.position.y += -lowerArmHeight * 0.5 - rootRadius * 0.5;

        this.leftHand.position.y += -handRadius * 0.5 - lowerArmHeight * 0.5;

        this.upperRightArmRoot.add(this.upperRightArm);
        this.upperRightArmRoot.position.x += torsoWidth * 0.5 + rootRadius;
        this.upperRightArmRoot.position.y += torsoHeight * 0.5 - rootRadius;

        this.upperRightArm.add(this.lowerRightArmRoot);
        this.upperRightArm.position.y = -rootRadius * 0.5 - 0.5 * upperArmHeight;

        this.lowerRightArmRoot.add(this.lowerRightArm);
        this.lowerRightArmRoot.position.y += -upperArmHeight * 0.5 - rootRadius * 0.5;

        this.lowerRightArm.add(this.rightHand);
        this.lowerRightArm.position.y += -lowerArmHeight * 0.5 - rootRadius * 0.5;

        this.rightHand.position.y += -handRadius * 0.5 - lowerArmHeight * 0.5;;

        //upper left leg root

        this.upperLeftLegRoot.add(this.upperLeftLeg);
        this.upperLeftLegRoot.position.y += - torsoHeight * 0.5;
        this.upperLeftLegRoot.position.x += -torsoWidth * 0.5;

        this.upperLeftLeg.add(this.lowerLeftLegRoot);
        this.upperLeftLeg.position.x += upperLegWidth * 0.5;
        this.upperLeftLeg.position.y += -upperLegHeight * 0.5;


        this.lowerLeftLegRoot.add(this.lowerLeftLeg);
        this.lowerLeftLegRoot.position.y += -rootRadius * 0.5 - upperLegHeight * 0.5;

        this.lowerLeftLeg.add(this.leftFeetRoot);
        this.lowerLeftLeg.position.y += -lowerLegHeight * 0.5 - rootRadius * 0.5;

        this.leftFeetRoot.add(this.leftFeet);
        this.leftFeetRoot.position.y += -lowerLegHeight * 0.5;
        this.leftFeetRoot.position.z +=  lowerLegDepth * 0.5;
        this.leftFeet.position.y += - feetHeight * 0.5;
        this.leftFeet.position.z += -feetDepth * 0.5 ;

        //upper right leg root

        this.upperRightLegRoot.add(this.upperRightLeg);
        this.upperRightLegRoot.position.y += - torsoHeight * 0.5;
        this.upperRightLegRoot.position.x += torsoWidth * 0.5;

        this.upperRightLeg.add(this.lowerRightLegRoot);
        this.upperRightLeg.position.y += -upperLegHeight * 0.5;
        this.upperRightLeg.position.x += - upperLegWidth * 0.5;

        this.lowerRightLegRoot.add(this.lowerRightLeg);
        this.lowerRightLegRoot.position.y += -rootRadius * 0.5 - upperLegHeight * 0.5;

        this.lowerRightLeg.add(this.rightFeetRoot);
        this.lowerRightLeg.position.y += -lowerLegHeight * 0.5 - rootRadius * 0.5;

        this.rightFeetRoot.add(this.rightFeet);
        this.rightFeetRoot.position.y += -lowerLegHeight * 0.5 ;
        this.rightFeetRoot.position.z +=  lowerLegDepth * 0.5;
        this.rightFeet.position.y += - feetHeight * 0.5;
        this.rightFeet.position.z += -feetDepth * 0.5 ;

        this.waist.traverse((node)=>{
            if(node.isMesh){
                node.castShadow=true;
                //node.receiveShadow=true;
                //console.log(node);
            }
        });
    }

    Update(timeElapsed){
        let x=this.waist.position.x;
        let y=this.waist.position.y;
        let z=this.waist.position.z;
        this.dirLight.position.set(0, 20, 0);
        //this.dirLight.position.set(x, 20, z);
        this.dirLight.target.position.set(x,y,z);
        //this.helper.update();
        //this.cameraHelper.update();
        //this.boxHelper.update();
    }

};
