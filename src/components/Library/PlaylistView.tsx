import { useState, useRef } from 'react';
import { Button, SearchBar, EmptyState } from '@OmarZambranoDev/portfolio-ui';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../../hooks/usePlaylistModals';
import { useTrackActions } from '../../hooks/useTrackActions';
import { PlaylistModal } from './PlaylistModal';
import { TrackRow } from './TrackRow';
import { Play, Edit, Trash2 } from 'lucide-react';

interface PlaylistViewProps {
  playlistId: string;
}

export function PlaylistView({ playlistId }: PlaylistViewProps) {
  const { getPlaylistTracks, playlists, playTrack } = useMusicStore();

  const {
    modalMode,
    playlistName,
    openModal,
    closeModal,
    setPlaylistName,
    handleDelete,
    handleRename,
  } = usePlaylistModals();

  const playlist = playlists.find((p) => p.id === playlistId);
  const tracks = getPlaylistTracks(playlistId);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredTracks = tracks.filter(
    (t) =>
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const {
    handlePlay,
    handleTogglePlay,
    handleDoubleClick,
    handleSelect,
    handleRemove,
    isCurrentTrack,
    isSelected,
    isPlaying,
  } = useTrackActions(undefined, {
    playlistId: playlist?.id || '',
    playlistName: playlist?.name || '',
  });

  const virtualizer = useVirtualizer({
    count: filteredTracks.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  if (!playlist) {
    return (
      <div className="p-6">
        <EmptyState title="Playlist not found" description="This playlist may have been deleted" />
      </div>
    );
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-earth-forest">{playlist.name}</h1>
            {playlist.description && <p className="text-earth-moss mt-1">{playlist.description}</p>}
            <p className="text-sm text-earth-moss mt-1">
              {tracks.length} track{tracks.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={() => {
                if (filteredTracks.length > 0) playTrack(filteredTracks[0].id);
              }}
              disabled={filteredTracks.length === 0}
              aria-label="Play all tracks"
            >
              <Play className="w-4 h-4 mr-1" />
            </Button>
            <Button
              variant="outline"
              onClick={() => openModal('rename', undefined, playlist.id, playlist.name)}
              aria-label={`Rename playlist ${playlist.name}`}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {!playlist.isDefault && (
              <Button
                variant="outline"
                onClick={() => openModal('delete', undefined, playlist.id)}
                aria-label={`Delete playlist ${playlist.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <label htmlFor="playlist-search" className="sr-only">
          Search in playlist
        </label>
        <SearchBar
          id="playlist-search"
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search in playlist..."
          variant="default"
          size="md"
        />
      </div>

      {filteredTracks.length === 0 ? (
        <EmptyState
          title="No tracks found"
          description={
            searchQuery ? 'Try a different search term' : 'Add some tracks to this playlist'
          }
        />
      ) : (
        <div className="flex-1 bg-white rounded-lg border border-earth-stone/30 overflow-hidden flex flex-col">
          <div className="grid grid-cols-[1fr,auto] md:grid-cols-[auto,2fr,1fr,1fr,auto] gap-2 md:gap-4 px-3 md:px-4 py-2 bg-muted/10 border-b border-earth-stone/30 text-sm font-medium text-earth-forest flex-shrink-0">
            <div className="hidden md:block w-8">#</div>
            <div>Title</div>
            <div className="hidden md:block">Artist</div>
            <div className="hidden md:block">Album</div>
            <div className="w-20 md:w-24 text-right">Duration</div>
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
                const track = filteredTracks[virtualItem.index];
                return (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={virtualItem.index}
                    isCurrentTrack={isCurrentTrack(track.id)}
                    isPlaying={isPlaying}
                    isSelected={isSelected(track.id)}
                    showRemoveButton
                    measureElement={virtualizer.measureElement}
                    onPlay={handlePlay}
                    onTogglePlay={handleTogglePlay}
                    onDoubleClick={handleDoubleClick}
                    onSelect={handleSelect}
                    onRemove={handleRemove}
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
      )}

      <PlaylistModal
        mode={modalMode}
        open={modalMode !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        playlistName={playlistName}
        onPlaylistNameChange={setPlaylistName}
        playlistToDelete={modalMode === 'delete' ? playlist : undefined}
        onDelete={handleDelete}
        onRename={handleRename}
      />
    </div>
  );
}
