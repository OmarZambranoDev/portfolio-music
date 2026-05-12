import { useRef } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@OmarZambranoDev/portfolio-ui';
import { Track } from '../../types';
import { formatTime } from '../../utils/formatTime';
import { MoreVertical, Play, Pause, Plus, Trash2 } from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index: number;
  isCurrentTrack?: boolean;
  isPlaying?: boolean;
  isSelected?: boolean;
  showRemoveButton?: boolean;
  onPlay: (trackId: string) => void;
  onTogglePlay?: () => void;
  onDoubleClick?: (track: Track) => void;
  onAddToPlaylist?: (track: Track) => void;
  onRemove?: (trackId: string) => void;
  onSelect?: (trackId: string) => void;
  measureElement?: (node: HTMLDivElement | null) => void;
  style?: React.CSSProperties;
}

export function TrackRow({
  track,
  index,
  isCurrentTrack = false,
  isPlaying = false,
  isSelected = false,
  showRemoveButton = false,
  onPlay,
  onTogglePlay,
  onDoubleClick,
  onAddToPlaylist,
  onRemove,
  onSelect,
  measureElement,
  style,
}: TrackRowProps) {
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isTapRef = useRef(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      onTogglePlay?.();
    } else {
      onPlay(track.id);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isTapRef.current = true;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !isTapRef.current) return;

    const dx = Math.abs(e.changedTouches[0].clientX - touchStartRef.current.x);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);

    if (dx > 10 || dy > 10) {
      isTapRef.current = false;
    }

    touchStartRef.current = null;
  };

  const handleRowClick = () => {
    // Touch devices: play immediately on tap
    if (isTapRef.current) {
      if (isCurrentTrack) {
        onTogglePlay?.();
      } else {
        onPlay(track.id);
      }
      isTapRef.current = false;
      return;
    }

    // Desktop: single click selects, double click plays
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      onSelect?.(track.id); // Clear old selection
      onDoubleClick?.(track);
    } else {
      clickTimerRef.current = setTimeout(() => {
        onSelect?.(track.id);
        clickTimerRef.current = null;
      }, 200);
    }
  };

  return (
    <div
      data-index={index}
      ref={measureElement}
      style={style}
      className={`grid grid-cols-[1fr,auto] md:grid-cols-[auto,2fr,1fr,1fr,auto] gap-2 md:gap-4 px-3 md:px-4 items-center transition-colors border-b border-earth-stone/30 absolute top-0 left-0 w-full cursor-pointer group ${
        isCurrentTrack
          ? 'bg-earth-sand/30'
          : isSelected
            ? 'md:bg-earth-stone/20'
            : 'hover:bg-earth-stone/20'
      }`}
      onClick={handleRowClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Track number / Play-Pause icon — hidden on mobile */}
      <div className="hidden md:flex w-8 items-center justify-center">
        {isCurrentTrack ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handlePlayClick}
            aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
            className="w-7 h-7 p-0 min-w-[44px] min-h-[44px]"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
        ) : (
          <>
            <span className="text-earth-moss text-sm group-hover:hidden">{index + 1}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayClick}
              aria-label={`Play ${track.title}`}
              className="hidden group-hover:inline-flex w-7 h-7 p-0 min-w-[44px] min-h-[44px]"
            >
              <Play className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>

      {/* Title + cover */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <img
          src={track.coverArt}
          alt={`${track.album} cover art`}
          className="w-8 h-8 rounded object-cover flex-shrink-0"
        />
        <span
          className={`font-medium text-sm truncate ${
            isCurrentTrack ? 'text-primary' : 'text-earth-forest'
          }`}
        >
          {track.title}
        </span>
      </div>

      {/* Artist — hidden on mobile */}
      <div className="hidden md:block text-earth-moss text-sm truncate">{track.artist}</div>

      {/* Album — hidden on mobile */}
      <div className="hidden md:block text-earth-moss text-sm truncate">{track.album}</div>

      {/* Duration + actions */}
      <div className="w-20 md:w-24 flex items-center justify-end gap-1 md:gap-2">
        <span className="text-earth-moss text-xs">{formatTime(track.duration)}</span>

        <div
          className={`items-center ${
            isSelected || isCurrentTrack ? 'flex' : 'hidden md:group-hover:flex'
          }`}
        >
          {showRemoveButton ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(track.id);
              }}
              aria-label={`Remove ${track.title} from playlist`}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label={`More actions for ${track.title}`}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    if (!isSelected) {
                      onSelect?.(track.id);
                    }
                  }}
                >
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom">
                {onAddToPlaylist && (
                  <DropdownMenuItem onClick={() => onAddToPlaylist(track)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Playlist
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
