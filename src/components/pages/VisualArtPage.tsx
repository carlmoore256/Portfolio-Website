import { VISUAL_ART_SOURCES } from "../../config/visual-art-sources";
import { VisualArtWall } from "../VisualArtWall";

export function VisualArtPage(): JSX.Element {
    return <>
        <VisualArtWall sources={VISUAL_ART_SOURCES} columnCount={4}/>
    </>;
}