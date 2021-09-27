import React, {useRef, useEffect} from "react";
import { TimbreSpace } from "../../timbreSpaceJS/js/TimbreSpace";
import fs from 'fs';
import audio_1 from "../../media/audio/t-rex-roar.mp3";
import audio_2 from "../../media/audio/piano2.wav";
// import audio_2 from "../../media/audio/dubstep.wav";


export function TimbreSpaceWrapper() : JSX.Element {

    const mountRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (mountRef.current == null) return;
        const container = mountRef.current;
        const timbreSpace = new TimbreSpace(window.innerWidth, 
                                            window.innerHeight,
                                            false,
                                            document,
                                            audio_2
                                            );

        timbreSpace.init();
        const canvas = timbreSpace.getDOMElement() as HTMLCanvasElement;

        container.appendChild(canvas);
        timbreSpace.start();

        return () => {
            timbreSpace.pause();
            container.removeChild(canvas);
        };
    }, [mountRef, audioRef]);

    return <>
        {/* <div style={{
                backgroundColor: 'blue',
                width: '100px',
                height: '100px'
            }}> */}
        <div>
 

            <h1>TEST</h1>
        </div>
        <div
        ref={mountRef}/>    
        <audio
        controls
        loop
        id="audio_src"
        src={audio_2}
        ref={audioRef}>
    </audio></>;
}

