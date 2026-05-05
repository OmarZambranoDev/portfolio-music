import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@portfolio/ui';
import { Track } from '../../types';
import { MoreVertical, Plus } from 'lucide-react';

interface SearchTrackResultProps {
  track: Track;
  isPlaying: boolean;
  onPlay: (trackId: string) => void;
  onAddToPlaylist: (track: Track) => void;
}

export function SearchTrackResult({ track, isPlaying, onPlay, onAddToPlaylist }: SearchTrackResultProps) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
        isPlaying ? 'bg-earth-sand/30' : 'hover:bg-earth-stone/10 active:bg-earth-stone/20'
      }`}
      onClick={() => onPlay(track.id)}
    >
      <img
        src={track.coverArt}
        alt={`${track.album} cover art`}
        className="w-10 h-10 rounded object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isPlaying ? 'text-primary' : 'text-earth-forest'}`}>
          {track.title}
        </p>
        <p className="text-xs text-earth-moss truncate">{track.artist}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            aria-label={`More actions for ${track.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onAddToPlaylist(track);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Playlist
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}