import { useRef } from 'react';
import {
  Button,
  SearchBar,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@portfolio/ui';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../../hooks/usePlaylistModals';
import { PlaylistModal } from './PlaylistModal';
import { formatTime } from '../../utils/formatTime';
import { MoreVertical, Play, Plus } from 'lucide-react';

export function AllSongsView() {
  const {
    searchQuery,
    setSearchQuery,
    getFilteredTracks,
    playTrack,
    playlists,
  } = useMusicStore();

  const {
    modalMode,
    selectedTrack,
    playlistName,
    openModal,
    closeModal,
    setPlaylistName,
    handleAddToPlaylist,
    handleCreateAndAdd,
    switchToCreateAndAdd,
  } = usePlaylistModals();

  const tracks = getFilteredTracks();
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">All Songs</h1>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search songs, artists, or albums..."
          variant="default"
          size="md"
        />
        <p className="text-sm text-muted mt-2">
          {tracks.length} track{tracks.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Virtualized track list */}
      <div className="flex-1 bg-white rounded-lg border border-muted/30 overflow-hidden flex flex-col">
        <div className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 px-4 py-2 bg-muted/10 border-b border-muted/30 text-sm font-medium text-gray-700 flex-shrink-0">
          <div className="w-8">#</div>
          <div>Title</div>
          <div>Artist</div>
          <div>Album</div>
          <div className="w-20 text-right">Duration</div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-auto">
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const track = tracks[virtualItem.index];
              return (
                <div
                  key={track.id}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 px-4 items-center hover:bg-muted/5 transition-colors border-b border-muted/20 absolute top-0 left-0 w-full"
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="w-8 text-muted text-sm">
                    {virtualItem.index + 1}
                  </div>
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={track.coverArt}
                      alt={track.album}
                      className="w-8 h-8 rounded object-cover flex-shrink-0"
                    />
                    <span className="font-medium text-gray-900 text-sm truncate">
                      {track.title}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm truncate">
                    {track.artist}
                  </div>
                  <div className="text-gray-700 text-sm truncate">
                    {track.album}
                  </div>
                  <div className="w-20 flex items-center justify-end gap-1">
                    <span className="text-muted text-xs">
                      {formatTime(track.duration)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => playTrack(track.id)}
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => playTrack(track.id)}>
                          <Play className="w-4 h-4 mr-2" />
                          Play
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openModal('add-to-playlist', track)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Playlist
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <PlaylistModal
        mode={modalMode}
        open={modalMode !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        playlists={playlists}
        selectedTrack={selectedTrack}
        playlistName={playlistName}
        onPlaylistNameChange={setPlaylistName}
        onAddToPlaylist={handleAddToPlaylist}
        onSwitchToCreateAndAdd={switchToCreateAndAdd}
        onCreateAndAdd={handleCreateAndAdd}
      />
    </div>
  );
}