import * as THREE from 'three';
import threeUtils from './threeUtils.js';
import modelCalc from './modelCalc.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import camPosenet from './camPosenet.js';

const backgroundColor = 0xf1f1f1;
const MODEL_PATH = 'models/stacy/stacy_lightweight.glb';
const TEXTURE_PATH = 'models/stacy/stacy.jpg';
const CALI_TIMEOUT = 5;

let clock = new THREE.Clock();
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
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

threeUtils.loadLights(scene);
threeUtils.loadFloor(scene);

threeUtils.loadModel(loader, MODEL_PATH, modelCallBack);

function modelCallBack ( gltf ) {
    // A lot is going to happen here
    let model = gltf.scene;
    let fileAnimations = gltf.animations;

    model.scale.set(7, 7, 7);
    model.position.y = -11;

    model.traverse(o => {
        if ( o.isMesh ) {
            o.castShadow = true;
            o.receiveShadow = true;
        }

        if ( o.isBone && ( o.name in threeUtils.modelBoneMap ) ) {
            modelCalc.modelPoints[threeUtils.modelBoneMap[o.name]] = threeUtils.extractBoneInfo(o);
        }

        // Investigation process
        // if ( o.isBone ) {
        //     console.log(o.name);
        // }
    });

    // console.log(modelCalc.modelPoints);

    scene.add(model);

    threeUtils.renderTexture(model, TEXTURE_PATH);
    // mixer = threeUtils.renderAnimation(model, fileAnimations, "idle");

    // modelCalc.rotateJoint('lArm', {x: 0, y: 0, z: 0});
    // modelCalc.rotateJoint('rArm', {x: 0, y: 0, z: 0});
    // modelCalc.rotateJoint('lForeArm', {x: -10, y: 0, z: 0});
    // modelCalc.moveJoint('lHand', {x: -1.49, y: 1.35, z: -1});
}

function animate() {
	requestAnimationFrame( animate );

    if ( mixer ) {
        mixer.update(clock.getDelta());
    }

    if ( threeUtils.resizeRendererToDisplaySize(renderer) ) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

	renderer.render( scene, camera );
}

animate();

let caliInfo = document.querySelector('.calibration');
let countDown = CALI_TIMEOUT;
let timer = window.setInterval((function() {
    caliInfo.innerText = countDown;
    countDown--;

    if(countDown < 0) {
        window.clearInterval(timer);
        caliInfo.style.display = 'none';
        camPosenet.netStart(modelCalc.poseAnalysis);
    }
}).bind(this), 1000);




