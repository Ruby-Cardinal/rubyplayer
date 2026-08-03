import React, { useEffect, useRef, useState } from 'react';
import { X, FileText, Music2 } from 'lucide-react';
import { parseLrcLyrics, fetchTrackLyrics } from '../services/mediaService';

export default function LyricsModal({ isOpen, onClose, currentTrack, currentTime, onSeek }) {
  const [lyricsText, setLyricsText] = useState(null);
  const [lrcLines, setLrcLines] = useState([]);
  const [activeLineIndex, setActiveLineIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const activeLineRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !currentTrack) {
      setLyricsText(null);
      setLrcLines([]);
      return;
    }

    if (currentTrack.lyrics) {
      setLyricsText(currentTrack.lyrics);
      setLrcLines(parseLrcLyrics(currentTrack.lyrics));
    } else if (currentTrack.hasLyrics) {
      setIsLoading(true);
      fetchTrackLyrics(currentTrack.id)
        .then((txt) => {
          if (txt) {
            setLyricsText(txt);
            setLrcLines(parseLrcLyrics(txt));
          } else {
            setLyricsText(null);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setLyricsText(null);
      setLrcLines([]);
    }
  }, [isOpen, currentTrack]);

  useEffect(() => {
    if (lrcLines.length === 0) return;

    let index = -1;
    for (let i = 0; i < lrcLines.length; i++) {
      if (currentTime >= lrcLines[i].time) {
        index = i;
      } else {
        break;
      }
    }

    if (index !== activeLineIndex) {
      setActiveLineIndex(index);
      if (activeLineRef.current) {
        activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, lrcLines, activeLineIndex]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content lyrics-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FileText size={22} className="text-muted" />
            <div>
              <div className="modal-title">{currentTrack?.title || 'Embedded Lyrics'}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {currentTrack?.artist} {currentTrack?.album ? `• ${currentTrack.album}` : ''}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div className="lyrics-body">
          {isLoading ? (
            <div style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <div>Fetching embedded lyrics from server...</div>
            </div>
          ) : lyricsText ? (
            lrcLines.length > 0 ? (
              lrcLines.map((line, idx) => {
                const isActive = idx === activeLineIndex;
                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLineRef : null}
                    className={`lyric-line ${isActive ? 'active' : ''}`}
                    onClick={() => onSeek(line.time)}
                  >
                    {line.text}
                  </div>
                );
              })
            ) : (
              <div className="lyrics-plain">{lyricsText}</div>
            )
          ) : (
            <div style={{ padding: '3rem 1rem', color: 'var(--text-muted)' }}>
              <Music2 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
              <div>No embedded lyrics found in ID3 tags for this song.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
