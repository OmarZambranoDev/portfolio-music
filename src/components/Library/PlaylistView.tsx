import { useState, useRef } from 'react';
import { Button, SearchBar, EmptyState } from '@portfolio/ui';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../../hooks/usePlaylistModals';
import { PlaylistModal } from './PlaylistModal';
import { TrackRow } from './TrackRow';
import { Play, Trash2, Edit } from 'lucide-react';

interface PlaylistViewProps {
  playlistId: string;
}

export function PlaylistView({ playlistId }: PlaylistViewProps) {
  const { getPlaylistTracks, playlists, removeTrackFromPlaylist, playTrack } = useMusicStore();

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
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{playlist.name}</h1>
            {playlist.description && <p className="text-muted mt-1">{playlist.description}</p>}
            <p className="text-sm text-muted mt-1">
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
            >
              <Play className="w-4 h-4 mr-1" />
              Play All
            </Button>
            <Button
              variant="outline"
              onClick={() => openModal('rename', undefined, playlist.id, playlist.name)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {!playlist.isDefault && (
              <Button variant="outline" onClick={() => openModal('delete', undefined, playlist.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search in playlist..."
          variant="default"
          size="md"
        />
      </div>

      {/* Empty state or virtualized list */}
      {filteredTracks.length === 0 ? (
        <EmptyState
          title="No tracks found"
          description={
            searchQuery ? 'Try a different search term' : 'Add some tracks to this playlist'
          }
        />
      ) : (
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
                const track = filteredTracks[virtualItem.index];
                return (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={virtualItem.index}
                    showRemoveButton
                    measureElement={virtualizer.measureElement}
                    onPlay={playTrack}
                    onRemove={(trackId) => removeTrackFromPlaylist(playlistId, trackId)}
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
