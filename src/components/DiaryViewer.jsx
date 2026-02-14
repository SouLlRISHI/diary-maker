import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX } from 'lucide-react';

const DiaryViewer = ({ data, onBack }) => {
    const [isCoverOpen, setIsCoverOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audio] = useState(new Audio(data.intro.audioUrl));
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showVolumeMsg, setShowVolumeMsg] = useState(false);

    useEffect(() => {
        audio.load();
        audio.volume = 0.5;
        audio.loop = true;
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [audio]);

    useEffect(() => {
        if (currentPage === 1 && !audioPlaying) {
            audio.play().catch(() => { });
            setAudioPlaying(true);
            setShowVolumeMsg(true);
            setTimeout(() => setShowVolumeMsg(false), 4000);
        }
    }, [currentPage, audioPlaying, audio]);

    const fireConfetti = () => {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#FF4081', '#FFB6C1', '#FFFFFF', '#C2185B'];

        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, colors });
            confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, colors });
            if (Math.random() > 0.8) confetti({ particleCount: 3, angle: 90, spread: 120, origin: { x: 0.5, y: 0.4 }, colors, shapes: ['heart'] });
            if (Date.now() < animationEnd) requestAnimationFrame(frame);
        }());
    };

    const nextPage = () => {
        if (currentPage < data.memories.length + 2 && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(prev => prev + 1);
                setIsTransitioning(false);
            }, 200);
        }
    };

    const prevPage = () => {
        if (currentPage > 1 && !isTransitioning) {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentPage(prev => prev - 1);
                setIsTransitioning(false);
            }, 200);
        } else if (currentPage === 1 && !isTransitioning) {
            setIsTransitioning(true);
            setIsCoverOpen(false);
            setTimeout(() => {
                setCurrentPage(0);
                setIsTransitioning(false);
            }, 500);
        }
    };

    const toggleAudio = (e) => {
        e.stopPropagation();
        if (audioPlaying) {
            audio.pause();
        } else {
            audio.play().catch(() => { });
        }
        setAudioPlaying(!audioPlaying);
    };

    return (
        <div className="diary-viewport">
            {isCoverOpen && (
                <button className="audio-btn" onClick={toggleAudio}>
                    {audioPlaying ? <Volume2 size={28} color="white" /> : <VolumeX size={28} color="#888" />}
                </button>
            )}

            {showVolumeMsg && (
                <div className="volume-msg">
                    🔊 Volume Up Kardo! 🎵
                </div>
            )}

            <button className="btn-secondary" onClick={onBack} style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 1000, background: 'white' }}>
                &larr; Exit Preview
            </button>

            <div className={`diary-scene ${!isCoverOpen ? 'closed' : ''}`}>
                <div className="diary-book">

                    {/* Cover */}
                    <div
                        className={`diary-cover ${isCoverOpen ? 'opened' : ''}`}
                        onClick={() => { setIsCoverOpen(true); setTimeout(() => setCurrentPage(1), 500); }}
                    >
                        <div className="leather-strap"><div className="strap-buckle"></div></div>
                        <img src="/images/wax-seal.png" alt="Seal" className="wax-seal" />
                        <div className="cover-content">
                            <h1 className="cover-title">{data.intro.title}</h1>
                            <p className="cover-subtitle">"Our Story, Told by Me."</p>
                            <p style={{ fontFamily: 'Caveat', color: '#B71C1C', fontWeight: 'bold' }}>Tap to open my heart 💌</p>
                        </div>
                    </div>

                    {isCoverOpen && <div className="ribbon"></div>}
                    {isCoverOpen && <div className="binding-shadow"></div>}

                    {/* Spread 1: Intro */}
                    <div className={`page-spread ${currentPage !== 1 ? 'hidden' : ''}`}>
                        <div className="left-page" onClick={prevPage}>
                            <div className="tea-stain" style={{ top: '10%', left: '5%' }}></div>
                            <span className="doodle heart">❤</span>
                            <div className="text-content">
                                <h2 className="page-title">{data.intro.title}</h2>
                                <p className="page-poem">{data.intro.leftText}</p>
                            </div>
                            <div className="marginalia" style={{ bottom: '10%', right: '5%', transform: 'rotate(-5deg)' }}>{data.intro.marginalia}</div>
                        </div>
                        <div className="right-page" onClick={nextPage}>
                            <div className="ink-splatter" style={{ top: '20%', right: '10%' }}></div>
                            <div className="text-content">
                                <p className="page-poem">{data.intro.poem}</p>
                            </div>
                            <span className="photo-date">{data.intro.date}</span>
                        </div>
                    </div>

                    {/* Spread 2-4: Memories */}
                    {data.memories.map((m, i) => (
                        <div key={i} className={`page-spread ${currentPage !== i + 2 ? 'hidden' : ''}`}>
                            <div className="left-page" onClick={prevPage}>
                                <div className="photo-container">
                                    <img src={m.image} alt={m.title} />
                                    <span className="photo-date">{m.date}</span>
                                </div>
                                <div className="marginalia" style={{ bottom: '5%', left: '5%', transform: 'rotate(3deg)' }}>{m.marginalia}</div>
                            </div>
                            <div className="right-page" onClick={nextPage}>
                                <div className="tea-stain" style={{ bottom: '10%', right: '5%' }}></div>
                                <div className="text-content">
                                    <h2 className="page-title">{m.title}</h2>
                                    <p className="page-poem">{m.poem}</p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Spread 5: Final */}
                    <div className={`page-spread ${currentPage !== data.memories.length + 2 ? 'hidden' : ''}`}>
                        <div className="left-page" onClick={prevPage}>
                            <div className="text-content" style={{ textAlign: 'center', justifyContent: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <span className="doodle heart" style={{ fontSize: '5rem', position: 'static' }}>❤</span>
                                <p className="page-poem" style={{ textAlign: 'center', fontSize: '1.8rem' }}>Thank you for<br />staying with me.</p>
                            </div>
                        </div>
                        <div className="right-page">
                            <div className="success-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                <h2 className="page-title" style={{ fontSize: '3rem' }}>Forever? ❤️</h2>
                                <button className="btn-primary" onClick={fireConfetti} style={{ fontSize: '1.5rem', padding: '1.5rem 3rem', borderRadius: '50px' }}>
                                    I Love You! 💖
                                </button>
                                <p className="page-text" style={{ marginTop: '2rem', fontStyle: 'italic' }}>Tap to celebrate us.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {isCoverOpen && (
                <div className="page-indicator">Click left to flip back | Right to flip forward 📖</div>
            )}
        </div>
    );
};

export default DiaryViewer;
