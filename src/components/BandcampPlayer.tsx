export interface BandcampPlayerProps {
    albumId: string;
    packageId: string;
    url: string;
    title: string;
}

export function BandcampPlayer(props: BandcampPlayerProps) {
    const { albumId, packageId, url, title } = props;
    return <iframe className="music-player"
        title={title}
        style={{border: "0", width: "350px", height: "850px"}}
        src={`https://bandcamp.com/EmbeddedPlayer/album=${albumId}/size=large/bgcol=ffffff/linkcol=0687f5/package=${packageId}/transparent=true/`}
   seamless>
            <a href={url}>{title}</a>
    </iframe>;
}