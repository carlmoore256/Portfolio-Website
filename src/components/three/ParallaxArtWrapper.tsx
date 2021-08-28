import React, {useRef, useEffect} from "react";
import { ParallaxArt } from "../../model/three/ParallaxArt";

import parallax1 from "../../media/parallax-art/mot_1.svg";
import parallax2 from "../../media/parallax-art/mot_2.svg";
import parallax3 from "../../media/parallax-art/mot_3.svg";

const parallaxImgs = [parallax3, parallax2, parallax1];
const layerSpacing = 12;

export function ParallaxArtWrapper() : JSX.Element {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mountRef.current == null) return;
        const container = mountRef.current;
        // const carpet = new WavyCarpet(800, 600, videoRef.current);
        
        const parallaxArt = new ParallaxArt(window.innerWidth, 
                                            window.innerHeight, 
                                            parallaxImgs, 
                                            layerSpacing);

        parallaxArt.init();
        const canvas = parallaxArt.getDOMElement() as HTMLCanvasElement;

        container.appendChild(canvas);
        parallaxArt.start();

        return () => {
            parallaxArt.pause();
            container.removeChild(canvas);
        };
    }, [mountRef]);

    return <>
        <div
        ref={mountRef}
    /></>;
}

