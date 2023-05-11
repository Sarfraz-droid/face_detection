"use client"
import React, { useRef, useState, useEffect } from 'react'
import useTF from './useTF';

function useCamera() {
    const [isOn, setIsOn] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const webCamCanvas = useRef<HTMLCanvasElement | null>(null);

    const intervalRef = useRef<NodeJS.Timer | null>(null);

    const tf = useTF();

    // useEffect(() => {
    //     const ref = paintToCanvas();

    //     return () => {
    //         clearInterval(ref);
    //     }
    // }, [isOn, tf, videoRef]);

    // useEffect(() => {
    //     if (isOn) {
    //         intervalRef.current = setInterval(() => {
    //             if (webCamCanvas.current && videoRef.current)
    //                 tf.estimateImages(webCamCanvas.current, videoRef.current);
    //         }, 200)
    //     }

    //     return () => {
    //         if (intervalRef.current)
    //             clearInterval(intervalRef.current)
    //     }
    // }, [isOn, tf]);

    // const paintToCanvas = () => {
    //     let video = videoRef.current;
    //     let photo = webCamCanvas.current;
    //     if (video == null || photo == null) return;
    //     let ctx = photo.getContext("2d");
    //     if (ctx == null) return;
    //     const width = 600;
    //     const height = 375;
    //     photo.width = width;
    //     photo.height = height;

    //     return setInterval(async () => {
    //         if (ctx == null || video == null) return;
    //         ctx.drawImage(video, 0, 0, width, height);
    //     }, 50);
    // };

    const toggleCamera = (cb: () => void) => {
        if (!isOn) {
            navigator.mediaDevices
                .getUserMedia({ video: { width: 600, height: 375 } })
                .then((stream) => {
                    const video = videoRef.current;
                    if (video == null) throw new Error("video Reference object is Null")

                    video.srcObject = stream;
                    video.play();
                    video.addEventListener("loadeddata", () => {
                        if (videoRef.current)
                            tf.tfDetectVideo(videoRef.current)
                    })

                }).catch(err => {
                    throw new Error(err);
                })
        } else {
            const video = videoRef.current;
            if (video == null) return;

            const stream = video.srcObject as MediaStream;
            const tracks = stream.getTracks();

            window.cancelAnimationFrame(tf.requestFrame);
            tf.setDetector(null);
            tf.clearFaces();
            if (intervalRef.current != null)
                clearInterval(intervalRef.current);

            setTimeout(() => {
                tracks.forEach((track) => {
                    track.stop();
                })
                video.srcObject = null;

            }, 50)



        }
        cb();
        setIsOn(!isOn);
    }

    return {
        isOn,
        toggleCamera,
        webCamCanvas,
        videoRef,
        ...tf
    }
}

export default useCamera
