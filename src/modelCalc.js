import * as THREE from 'three';
import utils from './utils.js';
import threeUtils from './threeUtils.js';

const CONF_THRESHOLD = 0.7

let initPos = null;
let initScale = null;
let initModelPos = null;

let initRotation = {
    lArm: {
        x: 33,
        y: 0,
        z: 0,
    },
    rArm: {
        x: 33,
        y: 0,
        z: 0,
    },
};

let modelPoints = {
    neck: {},
    waist: {},
    head: {},
    hips: {},
    lShoulder: {},
    rShoulder: {},
    lArm: {},
    rArm: {},
    lHand: {},
    rHand: {},
    lForeArm: {},
    rForeArm: {},
    lUpLeg: {},
    rUpLeg: {},
    lLeg: {},
    rLeg: {},
    lFoot: {},
    rFoot: {},
};

function position(keyp) {
    return {
        x: keyp.position.x,
        y: keyp.position.y
    };
}

function keypointToObj(keyps) {
     let joints = {};
 
     for (let i = 0; i < keyps.length; i++) {
         let keyp = keyps[i];
         if(keyp.score > CONF_THRESHOLD) {
             joints[keyp.part] = position(keyp);
         }
     }

    return joints;
}

// function keypointToModelJoints(keyps) {
//     let joints = {};
// 
//     function cenPosition(right, left) {
//         return {
//             x: (right.x + left.x)/2,
//             y: (right.y + left.y)/2
//         }
//     }
// 
//     for (let i = 0; i < keyps.length; i++) {
//         let keyp = keyps[i];
//         joints[keyp.part] = position(keyp);
//     }
// 
//     let modelJoints = {
//         neck: joints.neck,
//         waist: cenPosition(joints.rightHip, joints.leftHip),
//         head: cenPosition(joints.rightEye, joints.leftEye),
//         hips: cenPosition(joints.rightHip, joints.leftHip),
//         lShoulder: joints.leftShoulder,
//         rShoulder: joints.rightShoulder,
//         lArm: cenPosition(joints.leftShoulder, joints.leftElbow),
//         rArm: cenPosition(joints.rightShoulder, joints.rightElbow),
//         lHand: joints.leftWrist,
//         rHand: joints.rightWrist,
//         lForeArm: cenPosition(joints.leftWrist, joints.leftElbow),
//         rForeArm: cenPosition(joints.rightWrist, joints.rightElbow),
//         lUpLeg: cenPosition(joints.leftHip, joints.leftKnee),
//         rUpLeg: cenPosition(joints.rightHip, joints.rightKnee),
//         lLeg: cenPosition(joints.leftKnee, joints.leftAnkle),
//         rLeg: cenPosition(joints.rightKnee, joints.rightAnkle),
//         lFoot: joints.leftAnkle,
//         rFoot: joints.rightAnkle,
//     }
// 
//     return modelJoints;
// }

function rotateJoint(key, deg) {
    let joint = modelPoints[key]; 
    console.log(joint);
    joint.rotation.z = THREE.Math.degToRad(deg.z - initRotation[key].z);
    joint.rotation.y = THREE.Math.degToRad(deg.y - initRotation[key].y);
    joint.rotation.x = THREE.Math.degToRad(deg.x - initRotation[key].x);
}

function moveJoint(key, pos) {
    let joint = modelPoints[key]; 
    console.log(joint);
    joint.position.z = pos.z;
    joint.position.y = pos.y;
    joint.position.x = pos.x;
}

function calc2dAngle(cpos, pos1, pos2) {
    let p1 = {
        x: pos1.x - cpos.x,
        y: pos1.y - cpos.y,
    };

    let p2 = {
        x: pos2.x - cpos.x,
        y: pos2.y - cpos.y,
    };

    let angle = THREE.Math.radToDeg(Math.acos((p1.x * p2.x + p1.y * p2.y)/Math.sqrt((Math.pow(p1.x, 2) + Math.pow(p1.y, 2))*(Math.pow(p2.x, 2) + Math.pow(p2.y, 2)))));

    return 90 - angle;    
}

function jointsRotation(joints) {
    let rotation = {
        lArm: {},
        rArm: {},
    };

    if (typeof joints['leftShoulder'] != 'undefined' && typeof joints['leftElbow'] != 'undefined' && typeof joints['leftHip'] != 'undefined') {
        // console.log(joints['leftShoulder']);
        // console.log(joints['leftElbow']);
        // console.log(joints['leftHip']);
        // console.log(calc2dAngle(joints['leftShoulder'], joints['leftElbow'], joints['leftHip']))
         
        rotation['lArm'].x = THREE.Math.degToRad(calc2dAngle(joints['leftShoulder'], joints['leftElbow'], joints['leftHip']) - initRotation['lArm'].x);
        // rotation['lArm'].y = THREE.Math.degToRad(0 - initRotation['lArm'].y);
        // rotation['lArm'].z = THREE.Math.degToRad(0 - initRotation['lArm'].z);
    }
     
    if (typeof joints['rightShoulder'] != 'undefined' && typeof joints['rightElbow'] != 'undefined' && typeof joints['rightHip'] != 'undefined') {
        // console.log(joints['rightShoulder']);
        // console.log(joints['rightElbow']);
        // console.log(joints['rightHip']);
        // console.log(calc2dAngle(joints['rightShoulder'], joints['rightElbow'], joints['rightHip']))
 
        rotation['rArm'].x = THREE.Math.degToRad(calc2dAngle(joints['rightShoulder'], joints['rightElbow'], joints['rightHip']) - initRotation['rArm'].x);
        // rotation['rArm'].y = THREE.Math.degToRad(0 - initRotation['rArm'].y);
        // rotation['rArm'].z = THREE.Math.degToRad(0 - initRotation['rArm'].z);
    }
 
    return rotation;
}

function setModelJointsRotation(mdj, rotation) {
    for (var key in rotation) {
        if (key in mdj) {
            if ( key == 'rArm' || key == 'rHand' || key == 'rForeArm' || key == 'lArm' || key == 'lHand' || key == 'lForArm' ) {
                if(typeof rotation[key].x != 'undefined') {
                    mdj[key].rotation.x = rotation[key].x;
                }
                if(typeof rotation[key].y != 'undefined') {
                    mdj[key].rotation.y = rotation[key].y;
                }
                if(typeof rotation[key].z != 'undefined') {
                mdj[key].rotation.z = rotation[key].z;
                }
            }
        }
    }
}

function calcDistance(pos1, pos2) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}

function poseAnalysis(pose) {
    let joints = keypointToObj(pose.keypoints);

    // console.log(joints);

    if (initPos == null) {
        initPos = utils.deepCopy(joints);
    }

    let rotation = jointsRotation(joints);

    if ('rotation' in modelPoints.neck) {
        if (initModelPos == null) {
            initModelPos = utils.deepCopy(modelPoints);
        }

        // console.log(rotation);

        setModelJointsRotation(modelPoints, rotation);
    }
}

export default {
    rotateJoint,
    moveJoint,
    initPos,
    modelPoints,
    poseAnalysis,
};
