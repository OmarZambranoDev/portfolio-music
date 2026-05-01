import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@portfolio/ui';
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
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTrack) {
      onTogglePlay?.();
    } else {
      onPlay(track.id);
    }
  };
  const showActions = isSelected || isCurrentTrack;

  const handleRowClick = () => {
    onSelect?.(track.id);
  };

  return (
    <div
      data-index={index}
      ref={measureElement}
      style={style}
      className={`grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 px-4 items-center transition-colors border-b border-earth-stone/30 absolute top-0 left-0 w-full cursor-pointer group ${
        isCurrentTrack
          ? 'bg-earth-sand/30'
          : isSelected
            ? 'bg-earth-stone/20'
            : 'hover:bg-earth-stone/20'
      }`}
      onClick={handleRowClick}
      onDoubleClick={() => onDoubleClick?.(track)}
    >
      {/* Track number / Play-Pause icon */}
      <div className="w-8 flex items-center justify-center">
        {isCurrentTrack ? (
          <Button variant="primary" size="sm" onClick={handlePlayClick} className="w-7 h-7 p-0">
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </Button>
        ) : (
          <>
            <span className="text-earth-sage text-sm group-hover:hidden">{index + 1}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayClick}
              className="hidden group-hover:inline-flex w-7 h-7 p-0"
            >
              <Play className="w-3.5 h-3.5" />
            </Button>
          </>
        )}
      </div>

      {/* Title + cover */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={track.coverArt}
          alt={track.album}
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

      {/* Artist */}
      <div className="text-earth-sage text-sm truncate">{track.artist}</div>

      {/* Album */}
      <div className="text-earth-sage text-sm truncate">{track.album}</div>

      {/* Duration + actions */}
      <div className="w-24 flex items-center justify-end gap-2">
        <span className="text-earth-sage text-xs">{formatTime(track.duration)}</span>

        {/* Actions container */}
        <div className={`items-center ${showActions ? 'flex' : 'hidden group-hover:flex'}`}>
          {showRemoveButton ? (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRemove?.(track.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
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
                <DropdownMenuItem onClick={handlePlayClick}>
                  {isCurrentTrack && isPlaying ? (
                    <Pause className="w-4 h-4 mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isCurrentTrack && isPlaying ? 'Pause' : 'Play'}
                </DropdownMenuItem>
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
