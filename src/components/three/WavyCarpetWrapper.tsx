import React, { useCallback, useEffect, useRef, useState } from "react";
import { WavyCarpet } from "../../model/three/WavyCarpet";
import Video from "../../media/honey480p.mp4";

export function WavyCarpetWrapper() : JSX.Element {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [videoPlaying, setVideoPlaying] = useState(false);

    useEffect(() => {
        if (mountRef.current == null ||
            videoRef.current == null) return;
        const container = mountRef.current;
        const carpet = new WavyCarpet(800, 600, videoRef.current);

        carpet.init();
        const canvas = carpet.getDOMElement() as HTMLCanvasElement;
        canvas.classList.add("carpet");
        container.appendChild(canvas);
        carpet.start();
        return () => {
            carpet.pause();
            container.removeChild(canvas);
        };
    }, [mountRef]);

    const onPlayPauseClick = useCallback(() => {
        if (videoRef.current == null) return;
        const video = videoRef.current;
        if (videoPlaying) {
            video.pause();
        }
        else {
            video.play();
        }
        setVideoPlaying(p => !p);
    }, [videoPlaying]);

    return <>
        <button onClick={onPlayPauseClick}>{videoPlaying ? "pause" : "play"}</button>
        <video ref={videoRef} style={{display:"none"}}>
            <source src={Video}/>
        </video>
        <div
        ref={mountRef}
    /></>;
}