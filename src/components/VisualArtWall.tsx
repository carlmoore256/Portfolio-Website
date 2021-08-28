import { useEffect, useRef } from "react";
import "lightbox2/dist/css/lightbox.css";
import "./VisualArtWall.css";
import { VisualArtSource } from "./types";
import { findMinIndex, shuffle, zeroes } from "../model/functional";
const lightbox = require("lightbox2");


function VisualArtWallImage(props: { source: VisualArtSource }) {
    const {source} = props;
    return <a
        href={source.src}
        data-lightbox="visual-art-wall"
        data-title={`<h4>${source.title}</h4>${source.description}`}
    >
        <img
            src={source.src}
            alt={source.title}
        />
    </a>;
}

export interface VisualArtWallProps {
    sources: VisualArtSource[];
    columnCount: number;
}

export function VisualArtWall(props: VisualArtWallProps) {
    const {sources, columnCount} = props;
    const imagesContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (imagesContainer.current == null) return;
        lightbox.init();
    }, [imagesContainer]);

    const shuffledSources = shuffle(sources);

    // divide the sources into columns
    const columnHeights = zeroes(columnCount);
    const columns: VisualArtSource[][] = [];
    for (let i = 0; i < columnCount; i++) {
        columns.push([]);
    }
    for (let i = 0; i < sources.length; i++) {
        // choose which column based on current height
        const c = findMinIndex(columnHeights, h => h);
        const s = shuffledSources[i];
        columns[c].push(s);
        columnHeights[c] += s.height;
    }

    return <div ref={imagesContainer}>
        <div className="art-wall-row">
            {
                columns.map((c, cI) => (
                    <div key={cI} className="art-wall-column">
                        {
                            c.map((s, sI) => (
                                <VisualArtWallImage key={sI} source={s}/>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    </div>;
}