import { Button, EmptyState } from '@portfolio/ui';
import { Library, ChevronLeft, ChevronRight, Music, ListMusic, Plus } from 'lucide-react';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../../hooks/usePlaylistModals';
import { PlaylistModal } from '../Library/PlaylistModal';

export function LibrarySidebar() {
  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    allTracks,
    playlists,
    activePlaylistId,
    setActivePlaylist,
  } = useMusicStore();

  const {
    modalMode,
    playlistName,
    playlistDescription,
    openModal,
    closeModal,
    setPlaylistName,
    setPlaylistDescription,
    handleCreate,
  } = usePlaylistModals();

  return (
    <>
      <aside
        className={`h-full bg-white border-r border-earth-stone/30 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b border-earth-stone/30 flex items-center ${
            isSidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
        >
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Library className="w-5 h-5 text-primary" />
              <span className="font-medium text-earth-forest">Library</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
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
                : 'hover:bg-muted/10 text-earth-sage'
            }`}
          >
            <Music className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <>
                <span className="flex-1 text-left">All Songs</span>
                <span className="text-sm">{allTracks.length}</span>
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
                <Button variant="outline" size="sm" onClick={() => openModal('create')}>
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
                    : 'hover:bg-muted/10 text-earth-sage'
                }`}
              >
                <ListMusic className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{playlist.name}</span>
                    <span className="text-sm">{playlist.trackIds.length}</span>
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
                  onClick: () => openModal('create'),
                }}
              />
            )}
          </div>
        </div>
      </aside>

      <PlaylistModal
        mode={modalMode}
        open={modalMode !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
        playlistName={playlistName}
        onPlaylistNameChange={setPlaylistName}
        playlistDescription={playlistDescription}
        onPlaylistDescriptionChange={setPlaylistDescription}
        onCreate={handleCreate}
      />
    </>
  );
}
