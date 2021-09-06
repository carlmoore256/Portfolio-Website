import MusicSources from "../../config/music-sources.json";
import { SpotifyPlayer, SpotifyPlayerProps } from "../SpotifyPlayer";

export function MusicPage(): JSX.Element {
    if (MusicSources.length === 0) {
        return <>No music to show! :O</>;
    }
    return <div className="container" style={{textAlign:"center"}}>
        {
            (MusicSources as SpotifyPlayerProps[]).map((s,i) => <SpotifyPlayer key={i} {...s}/>)
        }
    </div>;
}