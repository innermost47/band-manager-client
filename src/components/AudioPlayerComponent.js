import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import CardHeader from "./CardHeader";
import { useTheme } from "./ThemeContext";

const AudioPlayerComponent = forwardRef(
  ({ audioUrls, initialTrackIndex = 0 }, ref) => {
    const [tracks, setTracks] = useState([]);
    const { isDarkMode } = useTheme();
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
    const audioPlayerRef = useRef(null);
    const customIcons = (isDarkMode) => ({
      play: (
        <i
          className={`bi bi-play-fill fs-2 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
      pause: (
        <i
          className={`bi bi-pause-fill fs-2 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
      rewind: (
        <i
          className={`bi bi-backward-fill fs-5 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
      forward: (
        <i
          className={`bi bi-forward-fill fs-5 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
      previous: (
        <i
          className={`bi bi-skip-backward-fill fs-5 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
      next: (
        <i
          className={`bi bi-skip-forward-fill fs-5 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
      loop: (
        <i
          className={`bi bi-repeat fs-5 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
      loopOff: (
        <i
          className={`bi bi-repeat fs-5 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
          style={{ opacity: 0.2 }}
        ></i>
      ),
      volume: (
        <i
          className={`bi bi-volume-up fs-5 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
      volumeMute: (
        <i
          className={`bi bi-volume-mute fs-5 ${
            isDarkMode ? "text-white" : "text-dark"
          }`}
        ></i>
      ),
    });

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          if (audioPlayerRef.current) {
            audioPlayerRef.current.audio.current.play();
          }
        },
      }),
      []
    );

    useEffect(() => {
      setTracks([]);
      setCurrentTrackIndex(initialTrackIndex);
      setShouldAutoPlay(false);
      if (Array.isArray(audioUrls)) {
        setTracks(audioUrls);
      } else {
        setTracks([]);
      }
    }, [audioUrls, initialTrackIndex]);

    const handleNext = () => {
      setCurrentTrackIndex((prevIndex) =>
        prevIndex + 1 < tracks.length ? prevIndex + 1 : 0
      );
      setShouldAutoPlay(true);
    };

    const handlePrevious = () => {
      setCurrentTrackIndex((prevIndex) =>
        prevIndex - 1 >= 0 ? prevIndex - 1 : tracks.length - 1
      );
      setShouldAutoPlay(true);
    };

    if (!Array.isArray(audioUrls) || audioUrls.length === 0) {
      return (
        <div className="card shadow-sm">
          <CardHeader title={"Audio Player"} icon={"bi-music-note-beamed"} />
          <div className="card-body p-5">
            <div className="text-center">
              <div
                className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "64px", height: "64px" }}
              >
                <i className="bi bi-music-note-list fs-2 text-warning"></i>
              </div>
              <h5 className="mb-2">No Master Audio Files Yet</h5>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="card shadow">
        {/* Header stylisé */}
        <CardHeader
          title={"Audio Player"}
          icon={"bi-music-note-beamed"}
          currentIndex={currentTrackIndex}
          totalCount={tracks.length}
        />
        <div className="card-body p-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <div
                  className="rounded-circle bg-primary p-3 d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "48px",
                    height: "48px",
                    minWidth: "48px",
                  }}
                >
                  <i className="bi bi-music-note-beamed text-white fs-5"></i>
                </div>
                <div>
                  <h6 className="mb-1 text-muted small">NOW PLAYING</h6>
                  <h5 className="mb-0">{tracks[currentTrackIndex]?.title}</h5>
                </div>
              </div>
              <AudioPlayer
                ref={audioPlayerRef}
                src={tracks[currentTrackIndex]?.url}
                autoPlayAfterSrcChange={shouldAutoPlay}
                onClickNext={handleNext}
                onClickPrevious={handlePrevious}
                showSkipControls={true}
                showJumpControls={false}
                autoPlay={false}
                preload={null}
                onEnded={handleNext}
                className={isDarkMode ? "bg-dark" : "bg-body"}
                customIcons={customIcons(isDarkMode)}
              />
            </div>
          </div>
          <div className="rounded-3 h-100 mt-3">
            <div
              className="track-list"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(index);
                    setShouldAutoPlay(true);
                  }}
                  className={`
                  d-flex align-items-center p-3 rounded-3 mb-2 
                  ${
                    currentTrackIndex === index
                      ? "bg-primary bg-opacity-10 border-primary"
                      : ""
                  } 
                  border
                  hover-shadow
                `}
                  style={{ cursor: "pointer", transition: "all 0.2s" }}
                >
                  <div className="me-3">
                    {currentTrackIndex === index ? (
                      <div
                        className="bg-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                        }}
                      >
                        <i className="bi bi-play-fill text-white"></i>
                      </div>
                    ) : (
                      <div
                        className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          minWidth: "32px",
                        }}
                      >
                        <span className="text-muted">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <h6
                      className={`mb-0 ${
                        currentTrackIndex === index ? "text-primary" : ""
                      }`}
                    >
                      {track.title}
                    </h6>
                    {track.artist && (
                      <small className="text-muted">{track.artist}</small>
                    )}
                  </div>
                  {currentTrackIndex === index && (
                    <div className="ms-2">
                      <div className="badge bg-primary bg-opacity-75">
                        <i className="bi bi-soundwave"></i>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default AudioPlayerComponent;
