import React, {useRef, useEffect} from "react";
import { TimbreSpace } from "../../timbreSpaceJS/js/TimbreSpace";
import fs from 'fs';
import testAudio from "../../media/audio/t-rex-roar.mp3";
import testAudio2 from "../../media/audio/piano2.wav";
// var audio = require("../../media/audio/t-rex-roar.mp3");

// import audio from "../../media/audio/CISSA2.wav";

export function TimbreSpaceWrapper() : JSX.Element {
    // <audio
    //     controls
    //     loop
    //     id="audio_src"
    //     src={require("../../media/audio/CISSA2.wav")}>
    // </audio>

    const mountRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (mountRef.current == null) return;
        const container = mountRef.current;
        const timbreSpace = new TimbreSpace(window.innerWidth, 
                                            window.innerHeight,
                                            false,
                                            document,
                                            testAudio
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
        <div
        ref={mountRef}
    />    <audio
        controls
        loop
        id="audio_src"
        src={testAudio}
        ref={audioRef}>
    </audio></>;
}

