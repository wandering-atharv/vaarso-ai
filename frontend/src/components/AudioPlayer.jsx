import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertCircle, Volume2 } from 'lucide-react';

/**
 * Number of bars in the waveform visualisation.
 * Each bar gets a deterministic height from a seed pattern,
 * and is tinted gold-bright when playback has passed it.
 */
const BAR_COUNT = 52;

/** Pre-computed bar heights (0–1) so the pattern is stable across renders. */
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const h = 0.14 + Math.abs(Math.sin(i * 0.57) * 0.56 + Math.cos(i * 0.23) * 0.20);
  return Math.min(h, 1);
});

/** Format seconds → m:ss */
function fmt(s) {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

/**
 * AudioPlayer — a self-contained, seekable audio player that reuses
 * the existing waveform visual style.
 *
 * Props:
 *   src       – URL / path of the audio file (optional)
 *   title     – display label
 *   subtitle  – secondary label
 */
export default function AudioPlayer({ src, title = 'Heritage audio', subtitle = '' }) {
  const audioRef = useRef(null);
  const waveRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  /* ---- source availability ---- */
  const hasSrc = Boolean(src);

  /* ---- core transport ---- */

  const play = useCallback(() => {
    const a = audioRef.current;
    if (!a || !hasSrc) return;
    a.play().catch(() => setError('Playback blocked by browser — interact with the page first.'));
  }, [hasSrc]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const togglePlay = useCallback(() => {
    if (playing) pause(); else play();
  }, [playing, play, pause]);

  const restart = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    setCurrentTime(0);
    a.play().catch(() => {});
  }, []);

  /* ---- seeking ---- */

  const seekFromEvent = useCallback(
    (e) => {
      const a = audioRef.current;
      const w = waveRef.current;
      if (!a || !w || !duration) return;
      const rect = w.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      a.currentTime = (x / rect.width) * duration;
      setCurrentTime(a.currentTime);
    },
    [duration],
  );

  const handleWaveClick = useCallback(
    (e) => {
      if (!hasSrc) return;
      seekFromEvent(e);
    },
    [hasSrc, seekFromEvent],
  );

  /* Drag-seek: pointer-down on the waveform starts tracking moves. */
  const handlePointerDown = useCallback(
    (e) => {
      if (!hasSrc) return;
      seekFromEvent(e);
      const onMove = (ev) => seekFromEvent(ev);
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [hasSrc, seekFromEvent],
  );

  /* ---- audio element event wiring ---- */

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoadedMetadata = () => {
      setDuration(a.duration);
      setLoaded(true);
      setError('');
    };
    const onTimeUpdate = () => setCurrentTime(a.currentTime);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      a.currentTime = 0;
      setCurrentTime(0);
    };
    const onError = () => {
      setPlaying(false);
      if (hasSrc) setError('Audio file could not be loaded. Check the file path or format.');
    };

    a.addEventListener('loadedmetadata', onLoadedMetadata);
    a.addEventListener('timeupdate', onTimeUpdate);
    a.addEventListener('play', onPlay);
    a.addEventListener('pause', onPause);
    a.addEventListener('ended', onEnded);
    a.addEventListener('error', onError);

    return () => {
      a.removeEventListener('loadedmetadata', onLoadedMetadata);
      a.removeEventListener('timeupdate', onTimeUpdate);
      a.removeEventListener('play', onPlay);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onError);
    };
  }, [hasSrc]);

  /* ---- progress fraction ---- */
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="audio-player">
      {/* Hidden <audio> element */}
      {hasSrc && (
        <audio ref={audioRef} src={src} preload="metadata" />
      )}

      {/* Header row */}
      <div className="ap-head">
        <Volume2 size={15} />
        <div>
          <b>{title}</b>
          {subtitle && <small>{subtitle}</small>}
        </div>
      </div>

      {/* Waveform + seek area */}
      <div
        className={`ap-waveform ${hasSrc ? 'ap-interactive' : ''}`}
        ref={waveRef}
        onClick={handleWaveClick}
        onPointerDown={handlePointerDown}
        role="slider"
        aria-label="Audio seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        tabIndex={hasSrc ? 0 : -1}
      >
        {BAR_HEIGHTS.map((h, i) => {
          const barProgress = i / BAR_COUNT;
          const active = barProgress < progress;
          return (
            <i
              key={i}
              className={active ? 'ap-bar active' : 'ap-bar'}
              style={{ height: `${h * 100}%` }}
            />
          );
        })}

        {/* Playhead indicator */}
        {hasSrc && duration > 0 && (
          <div
            className="ap-playhead"
            style={{ left: `${progress * 100}%` }}
          />
        )}
      </div>

      {/* Transport controls */}
      <div className="ap-controls">
        {hasSrc ? (
          <>
            <button
              className="ap-play-btn"
              onClick={togglePlay}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <span className="ap-time">{fmt(currentTime)}</span>
            <div className="ap-progress-track" onClick={handleWaveClick}>
              <div className="ap-progress-fill" style={{ width: `${progress * 100}%` }} />
            </div>
            <span className="ap-time">{fmt(duration)}</span>
            <button className="ap-restart-btn" onClick={restart} aria-label="Restart">
              <RotateCcw size={13} />
            </button>
          </>
        ) : (
          <div className="ap-no-source">
            <AlertCircle size={14} />
            <span>No audio source connected. Add an audio file path to enable playback.</span>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="ap-error">
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
