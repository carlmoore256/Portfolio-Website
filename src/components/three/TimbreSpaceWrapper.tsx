import React, {useRef, useEffect} from "react";
import { TimbreSpace } from "../../../TimbreSpaceJS/js/TimbreSpace";

export function TimbreSpaceWrapper() : JSX.Element {
    <audio
        controls
        loop
        id="audio_src"
        src="../src/media/audio/CISSA2.wav">
    </audio>

    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mountRef.current == null) return;
        const container = mountRef.current;
        
        const timbreSpace = new TimbreSpace(window.innerWidth, 
                                            window.innerHeight,
                                            false,
                                            document);

        timbreSpace.init();
        const canvas = timbreSpace.getDOMElement() as HTMLCanvasElement;

        container.appendChild(canvas);
        timbreSpace.start();

        return () => {
            timbreSpace.pause();
            container.removeChild(canvas);
        };
    }, [mountRef]);

    return <>
        <div
        ref={mountRef}
    /></>;
}

