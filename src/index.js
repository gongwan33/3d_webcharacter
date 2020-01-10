import * as THREE from 'three';
import utils from './utils.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

const backgroundColor = 0xf1f1f1;
const MODEL_PATH = 'models/stacy/stacy_lightweight.glb';


var scene = new THREE.Scene();
scene.background = new THREE.Color(backgroundColor);
scene.fog = new THREE.Fog(backgroundColor, 60, 100);

var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 30
camera.position.x = 0;
camera.position.y = -3;

var renderer = new THREE.WebGLRenderer({
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

var loader = new GLTFLoader();

loader.load(
    MODEL_PATH,
    function(gltf) {
        // A lot is going to happen here
        var model = gltf.scene;
        let fileAnimations = gltf.animations;

        scene.add(model);
    },
    undefined, // We don't need this function
    function(error) {
        console.error(error);
    }
);

function animate() {
	requestAnimationFrame( animate );

    if (utils.resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

	renderer.render( scene, camera );
}
animate();


