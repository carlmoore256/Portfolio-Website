
import bioAvatar from "../../media/bio-headshot.jpg";

export function BioPage() {

    return <>
        <div className="container">
            <div className="row">
                <div className="col pane">
                    <p>
                        I'm an audio engineer, music producer and programmer pursing a carreer in software. I have a deep interest in creating XR and musical software - I want to bring new tools to artists to express themselves. Spatial computing and XR bring a whole new world of creative possibilities which is really exciting. It's time for us to develop digital tools that let us get up and move around!
                    </p>
                    <p>
                        My educational background is in audio engineering and computer science. I recieved my master's in Audio Technology from American University in 2021, where I gained experience in academic research, Unity development, digital signal processing and audio programming. I also dove deep into machine learning, working with the deep learning libraries TensorFlow and PyTorch to train neural networks for audio-related tasks. I also published open-source dataset tools and audio networking utilities. Many of the projects I worked on required cross-disciplinary collaboration between faculty in audio tech, computer science and film.
                    </p>
                    <p>
                        In 2021, I produced and published my first EP, "We're Not Aliens!," a cyberpunk garage rock album. I currently produce experimental electronic music.
                    </p>
                    <div>
                        American University / 2019<br />
                        B.A., Audio Production
                    </div>
                    <div>
                        American University / 2021<br />
                        M.A., Audio Technology
                    </div>
                </div>
                <div className="col-4" style={{ textAlign: "center" }}>
                    <img
                        className="bio-avatar"
                        src={bioAvatar}
                        alt="Carl"
                    />
                </div>
            </div>
        </div>
    </>;
}