import * as posenet from '@tensorflow-models/posenet';
import webCamera from './webcamera.js';

async function netStart(cb) {
    const net = await posenet.load({
        architecture: 'MobileNetV1',
        outputStride: 16,
        inputResolution: { width: 640, height: 480 },
        multiplier: 0.75
    });

    let video = await webCamera.loadVideo();

    await poseEstimation(video, net, cb);
}

async function poseEstimation(video, net, cb) {
    const pose = await net.estimateSinglePose(video, {
        flipHorizontal: false,
        decodingMethod: 'single-person'
    });

    cb(pose);

    poseEstimation(video, net, cb);
}

export default {
    netStart,
}
