import * as THREE from './libs/three.module.js';
import {OBJLoader} from './libs/OBJLoader.js';
import {MTLLoader} from './libs/MTLLoader.js';
import {GLTFLoader} from './libs/GLTFLoader.js';

export const ninjaHead = {
    manager: 0,

    loaded: false,

    objHref: /*window.location.href +*/ './assets/ninja/ninjaHead.obj',

    mtlHref:  './assets/ninja/ninjaHead.mtl',

    load: function(mesh) {

        /*this.manager.onLoad=function(){
            this.loaded=true;
            console.log("ninjaHead loaded!");
        }
        this.manager.onProgress= function(url, itemsLoaded, itemsTotal){
            console.log("loaded: " + url);
            //console.log("left: "+ itemsTotal-itemsLoaded);
        }*/
        const mtlLoader = new MTLLoader(this.manager);
        mtlLoader.load(ninjaHead.mtlHref, (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader(this.manager);
            objLoader.setMaterials(mtl);
            objLoader.load(ninjaHead.objHref, (obj) => {
                this.obj=obj;
                obj.position.x+=0.05;
                obj.position.z+=0.1;
                obj.scale.set(0.2,0.2,0.2);
                obj.rotation.y=(Math.PI/2);
                obj.traverse(( node )=>{
                    if ( node instanceof THREE.Mesh ) {
                        node.castShadow = true;
                    }
                });

                mesh.add(obj);
                //const box = new THREE.Box3().setFromObject(obj);
                //const boxSize = box.getSize(new THREE.Vector3());
                //const boxCenter = box.getCenter(new THREE.Vector3());
                //console.log(boxSize);
                //console.log(boxCenter);
                //console.log(scene.position);
            });
        });

    },

}

export const lavaGround={
    loader: new GLTFLoader(),

    gltfHref: './assets/lava-2/scene.gltf',

    onLoadFunction: function(gltf){

        scene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

    },

    onProgressFunction: function(xhr){

    },

    load: function(scene){

        var textureLoader = new THREE.TextureLoader();
        //var texture = textureLoader.load( window.location.href + 'assets/lavaModel/textures/Terrain_baseColor.png' );
        //var roughTexture = textureLoader.load( window.location.href + 'assets/lavaModel/textures/Terrain_normal.png' );
        var texture = textureLoader.load('./assets/lava-2/textures/Material_26_baseColor.png' );
        var roughTexture = textureLoader.load('./assets/lava-2/textures/Material_26_metallicRoughness.png');
        texture.flipY = false;

        this.loader.load( this.gltfHref, (gltf)=>{
            //gltf.scene.scale.set(0.3,0,0.3);
            //console.log(gltf.scene);
            scene.add(gltf.scene);
            gltf.scene.scale.set(0.6,0.6,0.6);
            //gltf.scene.position.x-=200;
            gltf.scene.position.y+=700;
            //gltf.scene.rotation.x=Math.PI;
            var model = gltf.scene;
            model.traverse ( ( o ) => {
                if ( o.isMesh ) {
                    // note: for a multi-material mesh, `o.material` may be an array,
                    // in which case you'd need to set `.map` on each value.
                    o.material.map = texture;
                    //o.material.roughnessMap = roughTexture;
                    o.material.normalMap = roughTexture;

                }
            });

            //gltf.animations; // Array<THREE.AnimationClip>
            //gltf.scene); // THREE.Group
            //gltf.scenes; // Array<THREE.Group>
            //gltf.cameras; // Array<THREE.Camera>
            //gltf.asset; // Object

        }, this.onProgressFunction );
    }

}

export class SpikeBall{
    constructor(params){

        this.mesh=params.scene;
        this.manager=new THREE.LoadingManager();
        //this.loaded=false;
        this.objHref= './assets/spikeBall/spikeball.obj';
        this.mtlHref= './assets/spikeBall/spikeball.mtl';
        this.obj=0;

    }

    load(){
        this.manager.onLoad=function(){
            this.loaded=true;
            //console.log("spikeBall loaded!");
        }
        this.manager.onProgress= function(url, itemsLoaded, itemsTotal){
            //console.log("loaded: " + url);
            //console.log("left: "+ itemsTotal-itemsLoaded);
        }

        const mtlLoader = new MTLLoader(this.manager);
        mtlLoader.load(this.mtlHref, (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader(this.manager);
			//mtl.normalMap=normalTexture
			for (const material of Object.values(mtl.materials)) {
				material.color=new THREE.Color(0x202020);
				material.reflectivity=0.1;
				material.specular=new THREE.Color(0x928D8D);

   			}
            objLoader.setMaterials(mtl);
            objLoader.load(this.objHref, (object) => {
                //this.obj=object;
                object.scale.set(0.7,0.6,0.7);
                var box = new THREE.Box3().setFromObject(object);
                const boxSize = box.getSize(new THREE.Vector3());

                let pivot=new THREE.Object3D();
                pivot.position.y+=0.5*boxSize.y;
                pivot.add(object);
                this.mesh.add(pivot);

                let tween1=new TWEEN.Tween(object.rotation)
                .to({x:Math.PI},500)
                .easing(TWEEN.Easing.Linear.None)
                .repeat(Infinity)
                .onUpdate((tweenObj)=>{
                    object.rotation.x+=tweenObj.x;
                })
                .start();
            });

        });
    }
}

export class Star{
	constructor(params){

        this.mesh=params.scene;
        this.manager=new THREE.LoadingManager();

        this.objHref= './assets/Star/star.obj';
        this.mtlHref= './assets/Star/star.mtl';
        this.obj=0;

    }

    load(){
        this.manager.onLoad=function(){
        }
        this.manager.onProgress= function(url, itemsLoaded, itemsTotal){
            //console.log("loaded: " + url);
            //console.log("left: "+ itemsTotal-itemsLoaded);
        }

        const mtlLoader = new MTLLoader(this.manager);
        mtlLoader.load(this.mtlHref, (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader(this.manager);

			for (const material of Object.values(mtl.materials)) {
				//material.color=new THREE.Color(0x202020);
				//material.reflectivity=0.1;
				//material.specular=new THREE.Color(0x928D8D);
   			}
            objLoader.setMaterials(mtl);
            objLoader.load(this.objHref, (object) => {

                object.scale.set(0.25,0.25,0.25);
				object.rotation.x=Math.PI*0.5;
                var box = new THREE.Box3().setFromObject(object);
                const boxSize = box.getSize(new THREE.Vector3());

                let pivot=new THREE.Object3D();
                pivot.position.y+=0.5*boxSize.y;
                pivot.add(object);
                this.mesh.add(pivot);
				/*
                let tween1=new TWEEN.Tween(object.rotation)
                .to({x:Math.PI},500)
                .easing(TWEEN.Easing.Linear.None)
                .repeat(Infinity)
                .onUpdate((tweenObj)=>{
                    object.rotation.x+=tweenObj.x;
                })
                .start();
				*/
            });

        });
    }
}

export class Heart{
	constructor(params){

        this.mesh=params.scene;
        this.manager=new THREE.LoadingManager();
        this.objHref= './assets/heart/heart.obj';
        this.mtlHref= './assets/heart/heart.mtl';
        this.obj=0;

    }

    load(){
        this.manager.onLoad=function(){

        }
        this.manager.onProgress= function(url, itemsLoaded, itemsTotal){

        }

        const mtlLoader = new MTLLoader(this.manager);
        mtlLoader.load(this.mtlHref, (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader(this.manager);
			for (const material of Object.values(mtl.materials)) {
				material.color=new THREE.Color(0xFF0000);
   			}
            objLoader.setMaterials(mtl);
            objLoader.load(this.objHref, (object) => {
                object.scale.set(0.01,0.01,0.01);
                var box = new THREE.Box3().setFromObject(object);
                const boxSize = box.getSize(new THREE.Vector3());

                let pivot=new THREE.Object3D();
                pivot.position.y+=0.5*boxSize.y;
                pivot.add(object);
                this.mesh.add(pivot);
				/*
                let tween1=new TWEEN.Tween(object.rotation)
                .to({x:Math.PI},500)
                .easing(TWEEN.Easing.Linear.None)
                .repeat(Infinity)
                .onUpdate((tweenObj)=>{
                    object.rotation.x+=tweenObj.x;
                })
                .start();
				*/
            });

        });
    }
}

export class Rock{
	constructor(params){

        this.mesh=params.scene;
        this.manager=new THREE.LoadingManager();

        this.objHref= './assets/rock/Rock1.obj';
        this.mtlHref= './assets/rock/Rock1.mtl';
        this.obj=0;

    }

    load(){
        this.manager.onLoad=function(){
        }
        this.manager.onProgress= function(url, itemsLoaded, itemsTotal){
            //console.log("loaded: " + url);
            //console.log("left: "+ itemsTotal-itemsLoaded);
        }
		let meshAux=this.mesh;

        const mtlLoader = new MTLLoader(this.manager);
        mtlLoader.load(this.mtlHref, (mtl) => {
            mtl.preload();
            const objLoader = new OBJLoader(this.manager);
            objLoader.setMaterials(mtl);
            objLoader.load(this.objHref, (object) => {

                var box = new THREE.Box3().setFromObject(object);
				//object.material=mtl;
                const boxSize = box.getSize(new THREE.Vector3());
				object.traverse( function ( child ) {
					if ( child instanceof THREE.Object3D  ) {
						if(child.name=='Cube'){
							let pivot=new THREE.Object3D();
							child.scale.set(0.1,0.1,0.1)
			                pivot.position.y+=0.5*boxSize.y;
			                pivot.add(child);
							meshAux.add(pivot);
							//console.log(child);
						}
					}
				});


				/*
                let tween1=new TWEEN.Tween(object.rotation)
                .to({x:Math.PI},500)
                .easing(TWEEN.Easing.Linear.None)
                .repeat(Infinity)
                .onUpdate((tweenObj)=>{
                    object.rotation.x+=tweenObj.x;
                })
                .start();
				*/
            });

        });
    }
}

export class Stalagmites{

    constructor(params){
		this.loadingManager=params.loadingManager;
        this.loader=new GLTFLoader(this.loadingManager);
        this.gltfHref='./assets/stalagmites/scene.gltf';
    }

    onLoadFunction(gltf){

        scene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

    }

    onProgressFunction(xhr){

    }

    loadStal2(scene){

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        function dumpObject(obj, lines = [], isLast = true, prefix = '') {
            const localPrefix = isLast ? '└─' : '├─';
            lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
            const newPrefix = prefix + (isLast ? '  ' : '│ ');
            const lastNdx = obj.children.length - 1;
            obj.children.forEach((child, ndx) => {
            const isLast = ndx === lastNdx;
            dumpObject(child, lines, isLast, newPrefix);
            });
            return lines;
        }
        //var textureLoader = new THREE.TextureLoader();
        //var texture = textureLoader.load( './assets/stalagmites/textures/stalagmite_baseColor.png' );
        //var normalTexture = textureLoader.load( './assets/stalagmites/textures/stalagmite_normal.png' );
        //texture.flipY = false;


        this.loader.load( this.gltfHref, (gltf)=>{
            //gltf.scene.scale.set(0.3,0,0.3);
            //console.log(gltf.scene);
            let root = gltf.scene;
            let stalagmite = root.getObjectByName('stalagmite_2');
            stalagmite.rotation.z=Math.PI;
            stalagmite.position.y=getRandomArbitrary(20, 60);
            stalagmite.position.x=getRandomArbitrary(-80, 80);
            stalagmite.position.z=getRandomArbitrary(-200, -10);
            stalagmite.scale.set(getRandomArbitrary(0.05, 0.2),getRandomArbitrary(0.05, 0.2),getRandomArbitrary(0.05, 0.2));
            scene.add(stalagmite);


            //console.log(dumpObject(root).join('\n'));

        }, this.onProgressFunction );


    }



}
