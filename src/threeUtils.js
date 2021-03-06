import * as THREE from 'three';
import * as TMODULE from 'three/build/three.module.js';

let modelBoneMap = {
    'mixamorigNeck': 'neck',
    'mixamorigSpine': 'waist',
    'mixamorigHead': 'head',
    'mixamorigHips': 'hips',
    'mixamorigLeftShoulder': 'lShoulder',
    'mixamorigRightShoulder': 'rShoulder',
    'mixamorigLeftArm': 'lArm',
    'mixamorigRightArm': 'rArm',
    'mixamorigLeftHand': 'lHand',
    'mixamorigRightHand': 'rHand',
    'mixamorigLeftForeArm': 'lForeArm',
    'mixamorigRightForeArm': 'rForeArm',
    'mixamorigLeftUpLeg': 'lUpLeg',
    'mixamorigRightUpLeg': 'rUpLeg',
    'mixamorigLeftLeg': 'lLeg',
    'mixamorigRightLeg': 'rLeg',
    'mixamorigLeftFoot': 'lFoot',
    'mixamorigRightFoot': 'rFoot',
};

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  let width = window.innerWidth;
  let height = window.innerHeight;
  let canvasPixelWidth = canvas.width / window.devicePixelRatio;
  let canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize =
    canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }

  return needResize;
}

function loadLights ( scene ) {
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
}

function loadFloor ( scene ) {
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
}

function renderTexture ( model, path ) {
    let txt_loader = new TMODULE.TextureLoader;
    txt_loader.load(
        path,
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

function loadModel (loader, path, modelCallBack) {
    loader.load(
        path,
        modelCallBack,
        undefined, // We don't need this function
        function(error) {
            console.error(error);
        }
    );
}

function renderAnimation ( model, fileAnimations, name ) {
    let mixer = new THREE.AnimationMixer(model);
    let anim = THREE.AnimationClip.findByName(fileAnimations, name);

    let animAction = mixer.clipAction(anim);
    animAction.play();

    return mixer;
}

function extractBoneInfo ( bone ) {
    return {
        position: bone.position,
        rotation: bone.rotation,
    }
}

function drawDot(x, y, z, scene) {
    let dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3( x, y, z));
    dotGeometry.scale(7, 7, 7);
    let dotMaterial = new THREE.PointsMaterial( { size: 5, color: 0, sizeAttenuation: false } );
    let dot = new THREE.Points( dotGeometry, dotMaterial );
    console.log(z);
    dot.position.y = -11;
    scene.add( dot );
}

export default {
    resizeRendererToDisplaySize,
    renderTexture,
    renderAnimation,
    loadLights,
    loadFloor,
    loadModel,
    extractBoneInfo,
    modelBoneMap,
    drawDot,
};
