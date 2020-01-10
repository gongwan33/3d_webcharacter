import * as THREE from 'three';

function rotateJoint(joint, deg) {
    console.log(joint);
    joint.rotation.z = THREE.Math.degToRad(deg.z);
    joint.rotation.y = THREE.Math.degToRad(deg.y);
    joint.rotation.x = THREE.Math.degToRad(deg.x);
}

function moveJoint(joint, pos) {
    console.log(joint);
    joint.position.z = pos.z;
    joint.position.y = pos.y;
    joint.position.x = pos.x;
}

export default {
    rotateJoint,
    moveJoint,
};
