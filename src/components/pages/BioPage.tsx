import { useEffect, useState } from "react";
import bioAvatar from "../../media/bio-avatar-sq.png";
import bioAvatar2 from "../../media/orange-eyes-sq.png";
const AVATARS = [bioAvatar, bioAvatar2];

export function BioPage() {
    const [avatarIndex, setAvatarIndex] = useState(0);

    // setup an interval for cycling between avatar images
    useEffect(() => {
        const id = setInterval(() => {
            setAvatarIndex (p => (p+1) % AVATARS.length);
        }, 900);

        // You can return a function from the effect callback in order to
        // tell react how to cleanup after the effect (in this case how to stop the interval).
        // Otherwise, react will yell at you about a potential memory leak
        // when component no longer exists but setAvatarIndex is called.
        // More info: https://reactjs.org/docs/hooks-effect.html#example-using-hooks-1
        return () => clearInterval(id);
    }, []); // empty dependency causes the effect to only runs once in the lifetime of the component

    const avatarPath = AVATARS[avatarIndex];

    return <>
        <div className="container">
            <div className="row">
                <div className="col pane">
                    <p>
                        <b>Kaliane Van</b> [They/Them, She/Her] [pronounced: Call-Lee-Anne]<br />
                        has a penchant for conducting catchy chaos and a predilection for alliteration within synthesized syntax.
                        They have lived 24 years around the sun, and do so to the beat of their own drum.
                    </p>
                    <p>
                        As a self-taught multi-instrumentalist and audio engineer/producer/live sound technician who studied audio technology through Fairhaven College at Western Washington University, they continue a self-directed aural education by recording/mixing/mastering/producing/composing at home and with mentors and collaborators.
                        Kaliane creates music aleatorically and incorporates intuitive tunings and tempos
                        that are improvised and influenced by nature spirits, cosmic mysteries, and the magic of recording into Reason and Pro Tools.
                        They weave digital and analog realms of freaky folk ad-libbing and textural tones
                        into sonic landscapes and sound design for fantasy worlds and spoken word poetry.
                    </p>
                    <p>
                        Kaliane is an avid writer, visual artist, and dancer who recognizes and relishes the immense honour, pleasure, and privilege it is to be an artist. Their Khmer heritage helps ground them in creativity and be in tune with the essential nature of releasing non-linear modalities of artistic expression!
                        The arts are an essential form of cosmic relief. Kaliane invokes freedom and offers uniquely channeled aggregates of whimsical sonder to inspire and provide imaginative information for entities to experience as they navigate through, across, atop, below, within, without, and beyond realms of existence.
                    </p>
                    <p>
                        Current projects include writing music and words for multimedia story universe <i>Tympanum</i>, recording an avant-garde/psych Khmer folk album through Jack Straw Cultural Center's Artist Support Program, creating and curating artworks for a virtual art museum, modifying instruments, learning how to code, creating experimental dance/art/music videos, and continuously mixing, composing, recording, drawing, and painting for future album releases!
                    </p>
                    <div>
                        Western Washington University / 2019<br />
                        Fairhaven College of Inerdisciplinary Studies -
                        Bachelor of Art's Degree:
                        Music, Audio Technology, Education and Social Justice
                    </div>
                </div>
                <div className="col-4" style={{ textAlign: "center" }}>
                    <img
                        className="bio-avatar"
                        src={avatarPath}
                        alt="Kaliane"
                    />
                </div>
            </div>
        </div>
    </>;
}