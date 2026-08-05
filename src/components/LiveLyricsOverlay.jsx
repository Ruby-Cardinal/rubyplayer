import React from 'react';
import { AlignLeft } from 'lucide-react';

export default function LiveLyricsOverlay({ lrcLines, currentTime, isPlaying, onOpenLyrics, enabled }) {
  if (!enabled || !lrcLines || lrcLines.length === 0) {
    return null;
  }

  let activeIndex = -1;
  for (let i = 0; i < lrcLines.length; i++) {
    if (currentTime >= lrcLines[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  if (activeIndex < 0) {
    return null;
  }

  const activeLine = lrcLines[activeIndex];
  const nextLine = lrcLines[activeIndex + 1];

  return (
    <div
      className="live-lyrics-overlay"
      onClick={(e) => {
        e.stopPropagation();
        if (onOpenLyrics) onOpenLyrics();
      }}
      title="Click to view full lyrics"
    >
      <div className="live-lyrics-content">
        <div className="live-lyric-line active">
          {activeLine?.text}
        </div>
      </div>
    </div>
  );
}
