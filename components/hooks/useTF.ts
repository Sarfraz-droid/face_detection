import React, { useCallback, useEffect, useMemo, useState } from 'react'
import '@mediapipe/face_detection';
import * as mpFaceDetection from "@mediapipe/face_detection";;
import { FaceStroke, IFace } from '@/types/TF.types';
import { FilesetResolver, FaceDetector } from "@mediapipe/tasks-vision"




function useTF() {

    const detectorConfig = useMemo(() => ({
        runtime: 'mediapipe',
        solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${mpFaceDetection.VERSION}`
    }), []);

    const [detector, setDetector] = useState<null | FaceDetector>(null);

    const [faces, setFaces] = useState<Array<FaceStroke>>([]);
    const [requestFrame, setRequestFrame] = useState<any>(null);
    let lastVideoTime = -1;

    const configureTF = useCallback(async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        // const res = await faceDetection.createDetector(faceDetection.SupportedModels.MediaPipeFaceDetector, detectorConfig as any);
        const res = await FaceDetector.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath: "./model.tflite"
                },
                runningMode: 'IMAGE'
            }
        )
        console.log(res);
        setDetector(res);
    }, []);

    useEffect(() => {
        if (detector != null) return;
        configureTF();
    }, [configureTF, detector]);

    const clearFaces = () => {
        setFaces([]);
    }

    const tfDetectVideo = async (ref: HTMLVideoElement) => {
        await detector?.setOptions({
            runningMode: "VIDEO"
        });
        detectVideoHandler(ref);
    }

    const detectVideoHandler = async (ref: HTMLVideoElement) => {
        if (detector == null || ref.paused) return;
        try {
            const startTimeMs = performance.now();
            if (ref.currentTime != lastVideoTime) {
                const _faces = detector.detectForVideo(ref, startTimeMs) as {
                    detections: Array<IFace>
                };
                lastVideoTime = ref.currentTime;

                handlePoses(_faces);
            }

            setRequestFrame(requestAnimationFrame(() => {
                detectVideoHandler(ref);
            }))
        } catch (err) {
            console.error(err);
        }
    }


    const estimateImages = async (image: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement, root: HTMLElement) => {
        if (detector == null) return;

        const _faces = detector.detect(image) as {
            detections: Array<IFace>
        };
        console.log("Found", _faces)
        handlePoses(_faces);

    }

    const handlePoses = (_faces: {
        detections: Array<IFace>
    }) => {
        const facePoses = _faces.detections.map((item) => {
            return {
                left: item.boundingBox.originX,
                top: item.boundingBox.originY,
                width: item.boundingBox.width,
                height: item.boundingBox.height
            } as FaceStroke
        })

        setFaces(facePoses);
    }

    return {
        estimateImages,
        faces,
        clearFaces,
        tfDetectVideo,
        requestFrame,
        configureTF,
        setDetector
    };
}

export default useTF
