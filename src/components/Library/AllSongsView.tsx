import { useState, useRef } from 'react';
import { Button, SearchBar } from '@portfolio/ui';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@portfolio/ui';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@portfolio/ui';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMusicStore } from '../../store/musicStore';
import { formatTime } from '../../utils/formatTime';
import { MoreVertical, Play, Plus } from 'lucide-react';

export function AllSongsView() {
  const {
    searchQuery,
    setSearchQuery,
    getFilteredTracks,
    playTrack,
    playlists,
    addTrackToPlaylist,
    createPlaylist,
  } = useMusicStore();

  const tracks = getFilteredTracks();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const selectedTrack = tracks.find((t) => t.id === selectedTrackId) || null;
  const scrollRef = useRef<HTMLDivElement>(null);

  // Virtualization setup
  const virtualizer = useVirtualizer({
    count: tracks.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 52, // Estimated row height in px
    overscan: 10,
  });

  const handleAddToPlaylist = (playlistId: string) => {
    if (selectedTrackId) {
      addTrackToPlaylist(playlistId, selectedTrackId);
      setIsAddModalOpen(false);
      setSelectedTrackId(null);
    }
  };

  const handleCreateAndAdd = () => {
    if (newPlaylistName.trim() && selectedTrackId) {
      const playlistId = createPlaylist(newPlaylistName.trim());
      addTrackToPlaylist(playlistId, selectedTrackId);
      setNewPlaylistName('');
      setIsCreateModalOpen(false);
      setIsAddModalOpen(false);
      setSelectedTrackId(null);
    }
  };

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
        {/* Table header - sticky */}
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
                          onClick={() => {
                            setSelectedTrackId(track.id);
                            setIsAddModalOpen(true);
                          }}
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

      {/* Modals - unchanged */}
      <Modal open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Add to Playlist</ModalTitle>
          </ModalHeader>
          <ModalBody>
            {selectedTrack && (
              <p className="text-sm text-muted mb-3">
                Adding: <span className="font-medium text-gray-900">{selectedTrack.title}</span> by{' '}
                {selectedTrack.artist}
              </p>
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted/10 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900">{playlist.name}</span>
                  <span className="text-sm text-muted">{playlist.trackIds.length} tracks</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setIsCreateModalOpen(true);
                  setIsAddModalOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg border-2 border-dashed border-muted hover:border-primary transition-colors flex items-center gap-2 text-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Playlist</span>
              </button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setSelectedTrackId(null);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Create New Playlist</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Playlist Name
                </label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="My Playlist"
                  autoFocus
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsAddModalOpen(true);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateAndAdd}
              disabled={!newPlaylistName.trim()}
            >
              Create & Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
