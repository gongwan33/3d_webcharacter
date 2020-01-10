import * as THREE from 'three';
import * as TMODULE from 'three/build/three.module.js';
import utils from './utils.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const backgroundColor = 0xf1f1f1;
const MODEL_PATH = 'models/stacy/stacy_lightweight.glb';
let clock = new THREE.Clock();
let neck, waist, head, hips, lShoulder, rShoulder, lArm, rArm, lHand, rHand,
    lForeArm, rForeArm, lUpLeg, rUpLeg, lLeg, rLeg, lFoot, rFoot;

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

// Add lights
let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
hemiLight.position.set(0, 50, 0);
// Add hemisphere light to scene
scene.add(hemiLight);

let d = 8.25;
let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 1500;
dirLight.shadow.camera.left = d * -1;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = d * -1;
// Add directional Light to scene
scene.add(dirLight);

// Floor
let floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
let floorMaterial = new THREE.MeshPhongMaterial({
  color: 0xeeeeee,
  shininess: 0,
});

let floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI; // This is 90 degrees by the way
floor.receiveShadow = true;
floor.position.y = -11;
scene.add(floor);

let loader = new GLTFLoader();
let mixer = null;

loader.load(
    MODEL_PATH,
    function(gltf) {
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

        renderTexture(model);
        // renderAnimation(model, fileAnimations);

        moveJoint(neck);

    },
    undefined, // We don't need this function
    function(error) {
        console.error(error);
    }
);

function renderTexture( model ) {
    let txt_loader = new TMODULE.TextureLoader;
    txt_loader.load(
        'models/stacy/stacy.jpg',
        function ( stacy_txt ) {
            stacy_txt.flipY = false; // we flip the texture so that its the right way up

            const stacy_mtl = new THREE.MeshPhongMaterial({
                map: stacy_txt,
                color: 0xffffff,
                skinning: true
            });

            model.traverse(o => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                    o.material = stacy_mtl; // Add this line
                }
            });
        },
        undefined,
        function ( err ) {
            console.log(err);
        }
    );
}

function renderAnimation( model, fileAnimations ) {
    mixer = new THREE.AnimationMixer(model);
    let idleAnim = THREE.AnimationClip.findByName(fileAnimations, "idle");

    let idle = mixer.clipAction(idleAnim);
    idle.play();
}

function moveJoint(joint) {
    console.log(joint)
    joint.rotation.y = THREE.Math.degToRad(30);
    joint.rotation.x = THREE.Math.degToRad(30);
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


