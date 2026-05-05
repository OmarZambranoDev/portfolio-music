import { useRef, useCallback } from 'react';
import { Button } from '@OmarZambranoDev/portfolio-ui';
import { useMusicStore } from '../../store/musicStore';
import { SeekBar } from '../Library/SeekBar';
import { PlaybackControls } from '../Library/PlaybackControls';
import { ChevronDown } from 'lucide-react';

interface ExpandedPlayerProps {
  onClose: () => void;
}

export function ExpandedPlayer({ onClose }: ExpandedPlayerProps) {
  const { getCurrentTrack } = useMusicStore();
  const track = getCurrentTrack();

  const touchStartY = useRef<number>(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      if (deltaY > 80) {
        onClose();
      }
    },
    [onClose]
  );

  if (!track) return null;

  return (
    <div
      className="relative bg-gradient-to-b from-earth-stone/20 via-white to-earth-sand/20 rounded-t-xl shadow-lg animate-slide-up flex flex-col min-h-full"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-center pt-3 pb-1">
        <div className="w-10 h-1 bg-earth-stone/40 rounded-full" />
      </div>
      <div className="flex justify-center pb-2">
        <Button variant="outline" size="sm" onClick={onClose} aria-label="Close player">
          <ChevronDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Album Art */}
      <div className="flex justify-center px-8 pt-8 pb-14">
        <img
          src={track.coverArt}
          alt={`${track.album} cover art`}
          className="w-full max-w-sm aspect-square rounded-xl object-cover shadow-lg"
        />
      </div>

      {/* Track Info */}
      <div className="px-6 text-center mb-6 mt-20">
        <h2 className="text-xl font-bold text-earth-forest truncate">{track.title}</h2>
        <p className="text-earth-moss truncate mt-1">{track.artist}</p>
      </div>

      {/* Seek Bar */}
      <div className="px-6 mb-6">
        <SeekBar />
      </div>

      {/* Playback Controls */}
      <PlaybackControls size="lg" className="gap-4" />
    </div>
  );
}
