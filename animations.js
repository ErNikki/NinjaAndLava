import * as THREE from './libs/three.module.js';


export class AnimationManager{

    constructor(params){

        this.character= params.character;
        this.waist= params.waist;

        this.neckRoot= params.neckRoot;
        this.torso= params.torso;
        this.head=params.head;

        this.upperRightArmRoot =params.upperRightArmRoot;
        this.lowerRightArmRoot= params.lowerRightArmRoot;
        this.upperRightArm= params.upperRightArm;
        this.lowerRightArm= params.lowerRightArm;
        this.rightHand= params.rightHand;

        this.upperLeftArmRoot= params.upperLeftArmRoot;
        this.lowerLeftArmRoot= params.lowerLeftArmRoot;
        this.upperLeftArm= params.upperLeftArm;
        this.lowerLeftArm= params.lowerLeftArm;
        this.leftHand= params.leftHand;

        this.upperRightLegRoot= params.upperRightLegRoot;
        this.lowerRightLegRoot= params.lowerRightLegRoot;
        this.upperRightLeg= params.upperRightLeg;
        this.lowerRightLeg= params.lowerRightLeg;
        this.rightFeetRoot= params.rightFeetRoot;
        this.rightFeet= params.rightFeet;

        this.upperLeftLegRoot= params.upperLeftLegRoot;
        this.lowerLeftLegRoot= params.lowerLeftLegRoot;
        this.upperLeftLeg= params.upperLeftLeg;
        this.lowerLeftLeg= params.lowerLeftLeg;
        this.leftFeetRoot= params.leftFeetRoot;
        this.leftFeet= params.leftFeet;

        this.jumpingFlag=false;
        this.runninFlag=false;

        this.loadRunAnimation();
        this.trumblingAnimation();
        //this.initialRunTween= new TWEEN.Tween();

    }

    stopRunning(){
        this.initialRunTween.stop();
        this.stopTrumbling();
    }

    startRunning(){
        this.initialRunTween.start();
        this.startTrumbling();
    }

    startTrumbling(){
        this.trumbling.start();
    }

    stopTrumbling(){
        this.trumbling.stop();
    }

    getJumpingFlag(){

        return this.jumpingFlag;

    }

    getRunnintFlag(){
        return this.runninFlag;
    }

    /*
    basicPosAnimation(){
        let initialPos= new TWEEN.Tween([
                                this.neckRoot.rotation,
                                this.waist.position,
                                this.waist.rotation,

                                this.torso.position,

                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{x:0, y: 0, z:0},{x:0, y: 0, z:0},{x:0, y: 0, z:0},{x:0, y: 0, z:0} ,{x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0},
        {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}], 100)
        .easing(TWEEN.Easing.Linear.None)
        .start();
    }
    */

    jumpAnimation(){
        this.jumpingFlag=true;
        this.runninFlag=false;

        let standardPos= new TWEEN.Tween([
                                this.neckRoot.rotation,
                                this.waist.position,
                                this.waist.rotation,

                                this.torso.position,

                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{x:0, y: 0, z:0},{ y: 0},{x:0, y: 0, z:0},{x:0, y: 0, z:0} ,{x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0},
        {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}], 50)
        .easing(TWEEN.Easing.Linear.None);

        let initialPos= new TWEEN.Tween([
                                this.waist.position,
                                this.torso.position,
                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{y: -0.1},{y: -0.1},{x: Math.PI/3}, {x: Math.PI/3}, {x: Math.PI/3}, {x: Math.PI/3},
        {x: Math.PI/6}, {x: -Math.PI/3}, {x: Math.PI/6}, {x: -Math.PI/3},{x: Math.PI/7},{x: Math.PI/7}], 150)
        .easing(TWEEN.Easing.Linear.None)
        .onStart(()=>{
            this.jumpingFlag=true;
        })


        let jump= new TWEEN.Tween([
                                this.waist.position,
                                this.torso.position,
                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{y: 3.5},{y: 0},{x: 0}, {x: 0}, {x: 0}, {x: 0},
        {x: 0}, {x: 0}, {x: 0}, {x: 0},{x: 0},{x: 0}], 100)
        .easing(TWEEN.Easing.Cubic.Out);

        let fallInitialPos= new TWEEN.Tween([
                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,
                            ])
        .to([{z: -Math.PI/4},{x: Math.PI/3}, {z: Math.PI/4}, {x: Math.PI/3}], 100)
        .easing(TWEEN.Easing.Cubic.Out);

        let gravitiFall= new TWEEN.Tween([
                                this.waist.position,
                            ])
        .to([{y:0}], 300)
        .easing(TWEEN.Easing.Quartic.In);

        let finalPos= new TWEEN.Tween([
                                this.waist.position,
                                this.torso.position,
                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{y: -0.1},{y: -0.1},{x: Math.PI/3}, {x: Math.PI/3}, {x: Math.PI/3}, {x: Math.PI/3},
        {x: Math.PI/6}, {x: -Math.PI/3}, {x: Math.PI/6}, {x: -Math.PI/3},{x: Math.PI/7},{x: Math.PI/7}], 100)
        .easing(TWEEN.Easing.Linear.None);

        let normalPos=  new TWEEN.Tween([
                                this.waist.position,
                                this.torso.position,
                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{y: 0},{y: 0},{x: 0,z:0}, {x: 0}, {x: 0,z:0}, {x: 0},
        {x: 0}, {x: 0}, {x: 0}, {x: 0}, {x: 0}, {x: 0}], 150)
        .easing(TWEEN.Easing.Linear.None)
        .onComplete(()=>{
            //console.log(this.jumpingFlag);
            this.jumpingFlag=false;
        });

        standardPos.chain(initialPos);
        initialPos.chain(jump);
        jump.chain(fallInitialPos);
        fallInitialPos.chain(gravitiFall);
        gravitiFall.chain(finalPos);
        finalPos.chain(normalPos);
        //normalPos.chain(initialPos);

        standardPos.start();
        //jump.start();




    }

    trumblingAnimation(){
        this.trumbling=new TWEEN.Tween([

                                this.waist.rotation,

                            ])
        .to([{y: -Math.PI/26}], 300)
        .easing(TWEEN.Easing.Sinusoidal.Out);

        let trumbling2=new TWEEN.Tween([

                                this.waist.rotation,


                            ])
        .to([{y: Math.PI/26}], 300)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        //.delay(600);

        this.trumbling.chain(trumbling2);
        trumbling2.chain(this.trumbling);
    }

    loadRunAnimation(){
        this.initialRunTween= new TWEEN.Tween([

                                this.neckRoot.rotation,

                                this.waist.position,
                                this.waist.rotation,

                                this.upperLeftArmRoot.rotation,
                                this.upperRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{x: Math.PI/4},
            {y: -0.1}, {x: -Math.PI/4},
            {x: -Math.PI/5}, {x: -Math.PI/5},
            {x: Math.PI/4},{x: 0},
            {x: Math.PI/4}, {x: 0},
            {x: 0},{x: 0}], 300)
        .easing(TWEEN.Easing.Linear.None)
        .onStart(()=>{
            this.runninFlag=true;
        });

        let runPos1=new TWEEN.Tween([

                                //this.waist.rotation,

                                this.upperLeftArmRoot.rotation,
                                this.upperRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([//{y: -Math.PI/26},
            {x: -Math.PI/6},{x:-Math.PI/5},
            {x: Math.PI/2},{x: -Math.PI/4},
            {x: -Math.PI/6}, {x: 0},
            {x: -Math.PI/10},{x: -Math.PI/6}], 300)
        .easing(TWEEN.Easing.Sinusoidal.Out);

        let runPos2=new TWEEN.Tween([

                                //this.waist.rotation,

                                this.upperLeftArmRoot.rotation,
                                this.upperRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([//{y: Math.PI/26},
            {x: -Math.PI/5},{x: -Math.PI/6},
            {x: -Math.PI/6},{x: 0},
             {x: Math.PI/2}, {x: -Math.PI/4},
            {x:  -Math.PI/6},{x: -Math.PI/10}], 300)
        .easing(TWEEN.Easing.Sinusoidal.Out);
        //initialPos.chain(runPos1);
        //runPos1.chain(initialPos2);
        //initialPos2.chain(runPos2);
        this.initialRunTween.chain(runPos1);
        runPos1.chain(runPos2);
        runPos2.chain(runPos1);


    }

    rightDashTo2(){
        this.stopTrumbling();
        let dashStart= new TWEEN.Tween([
                                this.waist.position,
                                this.waist.rotation,

                            ])
        .to([{x: 2},{y:Math.PI/6}], 300)
        .easing(TWEEN.Easing.Cubic.Out);
        //.start();

        let dashEnd= new TWEEN.Tween([
                                this.waist.rotation,

                            ])
        .to([{y:0}], 200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(()=>{
            this.startTrumbling();
        })
        dashStart.chain(dashEnd);
        dashStart.start();
    }

    rightDashTo0(){
        this.stopTrumbling();
        let dashStart= new TWEEN.Tween([
                                this.waist.position,
                                this.waist.rotation,
                            ])
        .to([{x: 0},{y:Math.PI/6}], 300)
        .easing(TWEEN.Easing.Cubic.Out)

        let dashEnd= new TWEEN.Tween([
                                this.waist.rotation,

                            ])
        .to([{y:0}], 200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(()=>{
            this.startTrumbling();
        })
        dashStart.chain(dashEnd);
        dashStart.start();

    }

    leftDashToMinus2(){
        this.stopTrumbling();
        let dashStart= new TWEEN.Tween([
                                this.waist.position,
                                this.waist.rotation,

                            ])
        .to([{x: -2},{y:-Math.PI/6},], 300)
        .easing(TWEEN.Easing.Cubic.Out)

        let dashEnd= new TWEEN.Tween([
                                this.waist.rotation,

                            ])
        .to([{y:0}], 200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(()=>{
            this.startTrumbling();
        })
        dashStart.chain(dashEnd);
        dashStart.start();
    }

    leftDashTo0(){
        this.stopTrumbling();
        let dashStart= new TWEEN.Tween([
                                this.waist.position,
                                this.waist.rotation,
                            ])
        .to([{x: 0},{y:-Math.PI/6}], 300)
        .easing(TWEEN.Easing.Cubic.Out)

        let dashEnd= new TWEEN.Tween([
                                this.waist.rotation,

                            ])
        .to([{y:0}], 200)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(()=>{
            this.startTrumbling();
        })
        dashStart.chain(dashEnd);
        dashStart.start();
    }

    fallAnimation(){
        this.stopRunning();
        this.stopTrumbling();

        let standardPos= new TWEEN.Tween([
                                this.neckRoot.rotation,
                                this.waist.position,
                                this.waist.rotation,

                                this.torso.position,

                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{x:0, y: 0, z:0},{ y: 0, z:4},{x:0, y: 0, z:0},{x:0, y: 0, z:0} ,{x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0},
        {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}, {x:0, y: 0, z:0}], 100)
        .easing(TWEEN.Easing.Linear.None)

        let standardPo2= new TWEEN.Tween([
                                this.neckRoot.rotation,
                                this.waist.rotation,

                                this.torso.rotation,

                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{x:0, y: THREE.MathUtils.degToRad(10), x:THREE.MathUtils.degToRad(50)}, {x:0, y:0, z:0},
            {x:0, y:  THREE.MathUtils.degToRad(5), z:0} ,
            {x:THREE.MathUtils.degToRad(140), y: 0, z:THREE.MathUtils.degToRad(-20)}, {x:0, y: 0, z:THREE.MathUtils.degToRad(20)},
            {x:THREE.MathUtils.degToRad(220), y: 0, z:THREE.MathUtils.degToRad(40)}, {x:0, y: 0, z:THREE.MathUtils.degToRad(-30)},
            {x:THREE.MathUtils.degToRad(30), y: 0, z:THREE.MathUtils.degToRad(5)}, {x:THREE.MathUtils.degToRad(-30), y: 0, z:0},
            {x:THREE.MathUtils.degToRad(-30), y: 0, z:THREE.MathUtils.degToRad(5)}, {x:0, y: 0, z:0},
            {x:THREE.MathUtils.degToRad(20), y: 0, z:0}, {x:THREE.MathUtils.degToRad(-20), y: 0, z:0}], 500)
        .easing(TWEEN.Easing.Linear.None)

        let standardPo3= new TWEEN.Tween([
                                this.neckRoot.rotation,
                                this.waist.rotation,

                                this.torso.rotation,

                                this.upperLeftArmRoot.rotation,
                                this.lowerLeftArmRoot.rotation,

                                this.upperRightArmRoot.rotation,
                                this.lowerRightArmRoot.rotation,

                                this.upperLeftLegRoot.rotation,
                                this.lowerLeftLegRoot.rotation,

                                this.upperRightLegRoot.rotation,
                                this.lowerRightLegRoot.rotation,

                                this.leftFeetRoot.rotation,
                                this.rightFeetRoot.rotation,
                            ])
        .to([{x:0, y: THREE.MathUtils.degToRad(10), x:THREE.MathUtils.degToRad(50)}, {x:0, y:0, z:0},
            {x:0, y:  THREE.MathUtils.degToRad(-5), z:0} ,

            {x:THREE.MathUtils.degToRad(220), y:0, z:THREE.MathUtils.degToRad(-30)}, {x:0, y: 0, z:THREE.MathUtils.degToRad(20)},
            {x:THREE.MathUtils.degToRad(160), y: 0, z:THREE.MathUtils.degToRad(30)}, {x:0, y: 0, z:THREE.MathUtils.degToRad(-30)},

            {x:THREE.MathUtils.degToRad(-30), y: 0, z:THREE.MathUtils.degToRad(-5)}, {x:0, y: 0, z:0},
            {x:THREE.MathUtils.degToRad(30), y: 0, z:THREE.MathUtils.degToRad(-5)}, {x:THREE.MathUtils.degToRad(-30), y: 0, z:0},
            {x:THREE.MathUtils.degToRad(-20), y: 0, z:0}, {x:THREE.MathUtils.degToRad(20), y: 0, z:0}], 500)
        .easing(TWEEN.Easing.Linear.None)

        let gravity= new TWEEN.Tween([
                                this.waist.position,

                            ])
        .to([{y: -5},], 2000)
        .easing(TWEEN.Easing.Cubic.Out)
        .delay(500);



        standardPos.chain(standardPo2);
        standardPo2.chain(standardPo3);
        standardPo3.chain(standardPo2);
        standardPos.start();
        gravity.start();




    }

}
