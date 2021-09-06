export interface SpotifyPlayerProps {
    albumId: string;
    url: string;
    title: string;
}

export function SpotifyPlayer(props: SpotifyPlayerProps) {
    const { albumId, url, title } = props;

    return <iframe 
        title={title}
        style={{border: "0", width: "350px", height: "600px"}}
        src={`https://open.spotify.com/embed/album/${albumId}`}
        allow="encrypted-media"
        seamless>
            <a href={url}>{title}</a>
        </iframe>;
}
