import { useState } from 'react';
import { Button, EmptyState } from '@portfolio/ui';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from '@portfolio/ui';
import { Library, ChevronLeft, ChevronRight, Music, ListMusic, Plus } from 'lucide-react';
import { useMusicStore } from '../../store/musicStore';

export function LibrarySidebar() {
  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    allTracks,
    playlists,
    activePlaylistId,
    setActivePlaylist,
    createPlaylist,
  } = useMusicStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), newPlaylistDesc.trim() || undefined);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setIsCreateModalOpen(false);
    }
  };

  return (
    <>
      <aside
        className={`h-full bg-white border-r border-muted/30 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-muted/30 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Library className="w-5 h-5 text-primary" />
              <span className="font-medium text-gray-900">Library</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className={isSidebarCollapsed ? 'mx-auto' : ''}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* All Songs */}
          <button
            onClick={() => setActivePlaylist(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activePlaylistId === null
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-muted/10 text-gray-700'
            }`}
          >
            <Music className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <>
                <span className="flex-1 text-left">All Songs</span>
                <span className="text-sm text-muted">{allTracks.length}</span>
              </>
            )}
          </button>

          {/* Playlists section header */}
          {!isSidebarCollapsed && (
            <div className="mt-4 px-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted uppercase tracking-wider">
                  Playlists
                </span>
                <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Playlist list */}
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => setActivePlaylist(playlist.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activePlaylistId === playlist.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted/10 text-gray-700'
                }`}
              >
                <ListMusic className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{playlist.name}</span>
                    <span className="text-sm text-muted">{playlist.trackIds.length}</span>
                  </>
                )}
              </button>
            ))}

            {playlists.length === 0 && !isSidebarCollapsed && (
              <EmptyState
                title="No playlists"
                description="Create your first playlist"
                size="sm"
                action={{
                  label: 'Create Playlist',
                  onClick: () => setIsCreateModalOpen(true),
                }}
              />
            )}
          </div>
        </div>
      </aside>

      {/* Create Playlist Modal */}
      <Modal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <ModalContent size="sm">
          <ModalHeader>
            <ModalTitle>Create Playlist</ModalTitle>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="My Playlist"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-muted rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={2}
                  placeholder="What's this playlist about?"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreatePlaylist}
              disabled={!newPlaylistName.trim()}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
