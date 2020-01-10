import * as THREE from 'three';
import utils from './utils.js';
import modelCalc from './modelCalc.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as posenet from '@tensorflow-models/posenet';
import webCamera from './webcamera.js';

const backgroundColor = 0xf1f1f1;
const MODEL_PATH = 'models/stacy/stacy_lightweight.glb';
const TEXTURE_PATH = 'models/stacy/stacy.jpg';

let clock = new THREE.Clock();
let neck, waist, head, hips, lShoulder, rShoulder, lArm, rArm, lHand, rHand,
    lForeArm, rForeArm, lUpLeg, rUpLeg, lLeg, rLeg, lFoot, rFoot;

let loader = new GLTFLoader();
let mixer = null;

let scene = new THREE.Scene();
scene.background = new THREE.Color(backgroundColor);
scene.fog = new THREE.Fog(backgroundColor, 60, 100);

let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30
camera.position.x = 0;
camera.position.y = -3;

let renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

utils.loadLights( scene );
utils.loadFloor( scene );

utils.loadModel( loader, MODEL_PATH, modelCallBack );

function modelCallBack ( gltf ) {
    // A lot is going to happen here
    let model = gltf.scene;
    let fileAnimations = gltf.animations;

    model.traverse(o => {
        if ( o.isMesh ) {
            o.castShadow = true;
            o.receiveShadow = true;
        }

        if ( o.isBone && o.name === 'mixamorigNeck' ) {
            neck = o;
        } else if ( o.isBone && o.name === 'mixamorigSpine' ) {
            waist = o;
        } else if ( o.isBone && o.name === 'mixamorigHead' ) {
            head = o;
        } else if ( o.isBone && o.name === 'mixamorigHips' ) {
            hips = o;
        } else if ( o.isBone && o.name === 'mixamorigLeftShoulder' ) {
            lShoulder = o;
        } else if ( o.isBone && o.name === 'mixamorigRightShoulder' ) {
            rShoulder = o;
        } else if ( o.isBone && o.name === 'mixamorigLeftArm' ) {
            lArm = o;
        } else if ( o.isBone && o.name === 'mixamorigRightArm' ) {
            rArm = o;
        } else if ( o.isBone && o.name === 'mixamorigLeftHand' ) {
            lHand = o;
        } else if ( o.isBone && o.name === 'mixamorigRightHand' ) {
            rHand = o;
        } else if ( o.isBone && o.name === 'mixamorigLeftForeArm' ) {
            lForeArm = o;
        } else if ( o.isBone && o.name === 'mixamorigRightForeArm' ) {
            rForeArm = o;
        } else if ( o.isBone && o.name === 'mixamorigLeftUpLeg' ) {
            lUpLeg = o;
        } else if ( o.isBone && o.name === 'mixamorigRightUpLeg' ) {
            rUpLeg = o;
        } else if ( o.isBone && o.name === 'mixamorigLeftLeg' ) {
            lLeg = o;
        } else if ( o.isBone && o.name === 'mixamorigRightLeg' ) {
            rLeg = o;
        } else if ( o.isBone && o.name === 'mixamorigLeftFoot' ) {
            lFoot = o;
        } else if ( o.isBone && o.name === 'mixamorigRightFoot' ) {
            rFoot = o;
        }

        // Investigation process
        // if ( o.isBone ) {
        //     console.log(o.name);
        // }
    });

    model.scale.set(7, 7, 7);
    model.position.y = -11;

    scene.add(model);

    utils.renderTexture(model, TEXTURE_PATH);
    //mixer = utils.renderAnimation(model, fileAnimations, "idle");

    //modelCalc.rotateJoint(neck, {x: 30, y: 30, z: 30});
    //modelCalc.moveJoint(lHand, {x: -1.49, y: 1.35, z: -1});
}

function animate() {
	requestAnimationFrame( animate );

    if ( mixer ) {
        mixer.update(clock.getDelta());
    }

    if ( utils.resizeRendererToDisplaySize(renderer) ) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

	renderer.render( scene, camera );
}

animate();

// const net = await posenet.load();

webCamera.loadVideo();

