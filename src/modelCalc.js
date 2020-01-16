import * as THREE from 'three';

let initPos = null;
let initModelPos = null;

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

function keypointToModelJoints(keyps) {
    let joints = {};

    function cenPosition(right, left) {
        return {
            x: (right.x + left.x)/2,
            y: (right.y + left.y)/2
        }
    }

    for (let i = 0; i < keyps.length; i++) {
        let keyp = keyps[i];
        joints[keyp.part] = position(keyp);
    }

    let modelJoints = {
        neck: joints.neck,
        waist: cenPosition(joints.rightHip, joints.leftHip),
        head: cenPosition(joints.rightEye, joints.leftEye),
        hips: cenPosition(joints.rightHip, joints.leftHip),
        lShoulder: joints.leftShoulder,
        rShoulder: joints.rightShoulder,
        lArm: cenPosition(joints.leftShoulder, joints.leftElbow),
        rArm: cenPosition(joints.rightShoulder, joints.rightElbow),
        lHand: joints.leftWrist,
        rHand: joints.rightWrist,
        lForeArm: cenPosition(joints.leftWrist, joints.leftElbow),
        rForeArm: cenPosition(joints.rightWrist, joints.rightElbow),
        lUpLeg: cenPosition(joints.leftHip, joints.leftKnee),
        rUpLeg: cenPosition(joints.rightHip, joints.rightKnee),
        lLeg: cenPosition(joints.leftKnee, joints.leftAnkle),
        rLeg: cenPosition(joints.rightKnee, joints.rightAnkle),
        lFoot: joints.leftAnkle,
        rFoot: joints.rightAnkle,
    }

    return modelJoints;
}

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

function jointsDelta(j1, j2) {
    let delta = {}
    for (var key in j1) {
        if (typeof j1[key] == 'undefined' || typeof j2[key] == 'undefined') {
            continue;
        }

        delta[key] = {
            x: j1[key].x - j2[key].x,
            y: j1[key].y - j2[key].y
        };
    }

    return delta;
}

function setModelJoints(mdj, deltaPos) {
    for (var key in deltaPos) {
        if (key in mdj) {
            mdj[key].position.x = initModelPos[key].position.x + deltaPos[key].x;
            mdj[key].position.y = initModelPos[key].position.y + deltaPos[key].y;
        }
    }
}

function poseAnalysis(pose) {
    let joints = keypointToModelJoints(pose.keypoints);

    // console.log(joints);

    if (initPos == null) {
        initPos = joints;
    }

    let delta = jointsDelta(joints, initPos);

    if ('position' in modelPoints.neck) {
        if (initModelPos == null) {
            initModelPos = modelPoints;
        }

        setModelJoints(modelPoints, delta);
    }
}

export default {
    rotateJoint,
    moveJoint,
    initPos,
    modelPoints,
    poseAnalysis,
};
