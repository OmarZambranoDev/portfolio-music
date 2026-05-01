import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@portfolio/ui';
import { Track } from '../../types';
import { formatTime } from '../../utils/formatTime';
import { MoreVertical, Play, Plus, Trash2 } from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index: number;
  showRemoveButton?: boolean;
  onPlay: (trackId: string) => void;
  onAddToPlaylist?: (track: Track) => void;
  onRemove?: (trackId: string) => void;
  measureElement?: (node: HTMLDivElement | null) => void;
  style?: React.CSSProperties;
}

export function TrackRow({
  track,
  index,
  showRemoveButton = false,
  onPlay,
  onAddToPlaylist,
  onRemove,
  measureElement,
  style,
}: TrackRowProps) {
  return (
    <div
      key={track.id}
      data-index={index}
      ref={measureElement}
      style={style}
      className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 px-4 items-center hover:bg-muted/5 transition-colors border-b border-muted/20 absolute top-0 left-0 w-full"
    >
      <div className="w-8 text-muted text-sm">{index + 1}</div>
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={track.coverArt}
          alt={track.album}
          className="w-8 h-8 rounded object-cover flex-shrink-0"
        />
        <span className="font-medium text-gray-900 text-sm truncate">{track.title}</span>
      </div>
      <div className="text-gray-700 text-sm truncate">{track.artist}</div>
      <div className="text-gray-700 text-sm truncate">{track.album}</div>
      <div className="w-20 flex items-center justify-end gap-1">
        <span className="text-muted text-xs">{formatTime(track.duration)}</span>
        <Button variant="outline" size="sm" onClick={() => onPlay(track.id)}>
          <Play className="w-3 h-3" />
        </Button>

        {showRemoveButton ? (
          <Button variant="outline" size="sm" onClick={() => onRemove?.(track.id)}>
            <Trash2 className="w-3 h-3" />
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPlay(track.id)}>
                <Play className="w-4 h-4 mr-2" />
                Play
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
  );
}
