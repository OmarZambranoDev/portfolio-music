import { Button } from '@portfolio/ui';
import { useMusicStore } from '../../store/musicStore';
import { Play, Pause } from 'lucide-react';

interface CondensedPlaybackBarProps {
  onExpand: () => void;
}

export function CondensedPlaybackBar({ onExpand }: CondensedPlaybackBarProps) {
  const { isPlaying, togglePlay, getCurrentTrack } = useMusicStore();
  const track = getCurrentTrack();

  if (!track) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2 bg-white border-t border-earth-stone/30 cursor-pointer active:bg-earth-stone/10 transition-colors"
      onClick={onExpand}
    >
      <img
        src={track.coverArt}
        alt={`${track.album} cover art`}
        className="w-10 h-10 rounded object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-earth-forest truncate">{track.title}</p>
        <p className="text-xs text-earth-moss truncate">{track.artist}</p>
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          togglePlay();
        }}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className="flex-shrink-0"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
    </div>
  );
}
