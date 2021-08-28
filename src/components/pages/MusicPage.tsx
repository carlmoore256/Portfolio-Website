import { BandcampPlayer, BandcampPlayerProps } from "../BandcampPlayer";
import MusicSources from "../../config/music-sources.json";

export function MusicPage(): JSX.Element {
    if (MusicSources.length === 0) {
        return <>No music to show! :O</>;
    }
    return <div className="container" style={{textAlign:"center"}}>
        {
            (MusicSources as BandcampPlayerProps[]).map((s,i) => <BandcampPlayer key={i} {...s}/>)
        }
    </div>;
}