import { useRef } from 'react';
import { SearchBar } from '@portfolio/ui';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../../hooks/usePlaylistModals';
import { useTrackActions } from '../../hooks/useTrackActions';
import { PlaylistModal } from './PlaylistModal';
import { TrackRow } from './TrackRow';

export function AllSongsView() {
  const { searchQuery, setSearchQuery, getFilteredTracks, playlists } = useMusicStore();

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

  const {
    handlePlay,
    handleTogglePlay,
    handleDoubleClick,
    handleSelect,
    handleAddToPlaylist: onAddToPlaylistAction,
    isCurrentTrack,
    isSelected,
    isPlaying,
  } = useTrackActions((track) => openModal('add-to-playlist', track));

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
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-earth-forest mb-4">All Songs</h1>
        <label htmlFor="all-songs-search" className="sr-only">
          Search all songs
        </label>
        <SearchBar
          id="all-songs-search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search songs, artists, or albums..."
          variant="default"
          size="md"
        />
        <p className="text-sm text-earth-moss mt-2">
          {tracks.length} track{tracks.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 bg-white rounded-lg border border-earth-stone/30 overflow-hidden flex flex-col">
        <div className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 px-4 py-2 bg-muted/10 border-b border-earth-stone/30 text-sm font-medium text-earth-moss flex-shrink-0">
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
                <TrackRow
                  key={track.id}
                  track={track}
                  index={virtualItem.index}
                  isCurrentTrack={isCurrentTrack(track.id)}
                  isPlaying={isPlaying}
                  isSelected={isSelected(track.id)}
                  measureElement={virtualizer.measureElement}
                  onPlay={handlePlay}
                  onTogglePlay={handleTogglePlay}
                  onDoubleClick={handleDoubleClick}
                  onSelect={handleSelect}
                  onAddToPlaylist={onAddToPlaylistAction}
                  style={{
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                />
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
