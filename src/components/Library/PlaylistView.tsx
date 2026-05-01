import { useState, useRef } from 'react';
import { Button, SearchBar, EmptyState } from '@portfolio/ui';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@portfolio/ui';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMusicStore } from '../../store/musicStore';
import { formatTime } from '../../utils/formatTime';
import { Play, Trash2, Edit } from 'lucide-react';

interface PlaylistViewProps {
  playlistId: string;
}

export function PlaylistView({ playlistId }: PlaylistViewProps) {
  const {
    getPlaylistTracks,
    playlists,
    deletePlaylist,
    removeTrackFromPlaylist,
    renamePlaylist,
    playTrack,
    setActivePlaylist,
  } = useMusicStore();

  const playlist = playlists.find((p) => p.id === playlistId);
  const tracks = getPlaylistTracks(playlistId);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newName, setNewName] = useState(playlist?.name || '');

  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredTracks = tracks.filter(
    (t) =>
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Virtualization
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

  const handleDelete = () => {
    deletePlaylist(playlistId);
    setActivePlaylist(null);
    setIsDeleteModalOpen(false);
  };

  const handleRename = () => {
    if (newName.trim() && newName !== playlist.name) {
      renamePlaylist(playlistId, newName.trim());
    }
    setIsRenameModalOpen(false);
  };

  const handlePlayAll = () => {
    if (filteredTracks.length > 0) {
      playTrack(filteredTracks[0].id);
    }
  };

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
              onClick={handlePlayAll}
              disabled={filteredTracks.length === 0}
            >
              <Play className="w-4 h-4 mr-1" />
              Play All
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setNewName(playlist.name);
                setIsRenameModalOpen(true);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {!playlist.isDefault && (
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(true)}>
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
          {/* Table header */}
          <div className="grid grid-cols-[auto,1fr,1fr,1fr,auto] gap-4 px-4 py-2 bg-muted/10 border-b border-muted/30 text-sm font-medium text-gray-700 flex-shrink-0">
            <div className="w-8">#</div>
            <div>Title</div>
            <div>Artist</div>
            <div>Album</div>
            <div className="w-20 text-right">Duration</div>
          </div>

          {/* Scrollable body */}
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
                    <div className="w-8 text-muted text-sm">{virtualItem.index + 1}</div>
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
                    <div className="text-gray-700 text-sm truncate">{track.artist}</div>
                    <div className="text-gray-700 text-sm truncate">{track.album}</div>
                    <div className="w-20 flex items-center justify-end gap-1">
                      <span className="text-muted text-xs">{formatTime(track.duration)}</span>
                      <Button variant="outline" size="sm" onClick={() => playTrack(track.id)}>
                        <Play className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTrackFromPlaylist(playlistId, track.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <Modal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Delete Playlist</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700">
              Are you sure you want to delete &ldquo;{playlist.name}&rdquo;? This action cannot be
              undone.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Rename Modal */}
      <Modal open={isRenameModalOpen} onOpenChange={setIsRenameModalOpen}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Rename Playlist</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename();
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsRenameModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRename} disabled={!newName.trim()}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
