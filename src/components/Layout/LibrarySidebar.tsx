import { Button, EmptyState, Tooltip, TooltipTrigger, TooltipContent } from '@portfolio/ui';
import {
  Library,
  ChevronLeft,
  ChevronRight,
  Music,
  ListMusic,
  Plus,
  Github,
  Home,
} from 'lucide-react';
import { useMusicStore } from '../../store/musicStore';
import { usePlaylistModals } from '../../hooks/usePlaylistModals';
import { PlaylistModal } from '../Library/PlaylistModal';

const HOST_URL = import.meta.env.VITE_HOST_URL || 'http://localhost:3000';

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
        className={`h-full bg-white border-r border-earth-stone/30 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
      >
        {/* Header */}
        <div
          className={`p-4 border-b border-earth-stone/30 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}
        >
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-2">
              <Library className="w-5 h-5 text-primary" />
              <span className="font-medium text-earth-forest">Library</span>
            </div>
          ) : (
            <Library className="w-5 h-5 text-primary" />
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-earth-moss">
              <p>{isSidebarCollapsed ? 'Expand' : 'Collapse'} Library</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Content */}
        <div
          key={isSidebarCollapsed ? 'collapsed' : 'expanded'}
          className="flex-1 overflow-y-auto p-2"
        >
          {/* All Songs */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activePlaylistId === null ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActivePlaylist(null)}
                aria-label="All Songs"
                className={`w-full justify-start gap-3 px-3 py-2 rounded-lg transition-colors ${activePlaylistId === null
                  ? ''
                  : 'border-transparent hover:bg-muted/10 text-earth-moss'
                  }`}
              >
                <Music className="w-5 h-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">All Songs</span>
                    <span className="text-sm">{allTracks.length}</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isSidebarCollapsed && (
              <TooltipContent side="right" className="bg-earth-moss">
                <p>All Songs</p>
              </TooltipContent>
            )}
          </Tooltip>

          {/* Playlists section header - expanded */}
          {!isSidebarCollapsed && (
            <div className="mt-4 px-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-earth-moss uppercase tracking-wider">
                  Playlists
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('create')}
                      aria-label="Create playlist"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-earth-moss">
                    <p>Create Playlist</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          )}

          {/* Create playlist button - collapsed */}
          {isSidebarCollapsed && (
            <div className="mt-4 flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openModal('create')}
                    aria-label="Create playlist"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-earth-moss">
                  <p>Create Playlist</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Playlist list */}
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <Tooltip key={playlist.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant={activePlaylistId === playlist.id ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setActivePlaylist(playlist.id)}
                    aria-label={playlist.name}
                    className={`w-full justify-start gap-3 px-3 py-2 rounded-lg transition-colors ${activePlaylistId === playlist.id
                        ? ''
                        : 'border-transparent hover:bg-muted/10 text-earth-moss'
                      }`}
                  >
                    <ListMusic className="w-5 h-5 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left truncate">{playlist.name}</span>
                        <span className="text-sm">{playlist.trackIds.length}</span>
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                {isSidebarCollapsed && (
                  <TooltipContent side="right" className="bg-earth-moss">
                    <p>{playlist.name}</p>
                  </TooltipContent>
                )}
              </Tooltip>
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

        {/* Footer */}
        <div className="border-t border-earth-stone/30">
          {/* Portfolio link */}
          <div className={`p-2 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={HOST_URL}
                  aria-label="Back to Portfolio"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-earth-moss hover:text-earth-forest hover:bg-muted/10 transition-colors ${isSidebarCollapsed ? 'justify-center' : ''
                    }`}
                >
                  <Home className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="text-sm">Portfolio</span>}
                </a>
              </TooltipTrigger>
              {isSidebarCollapsed && (
                <TooltipContent side="right" className="bg-earth-moss">
                  <p>Back to Portfolio</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>

          {/* GitHub link */}
          <div className={`p-2 pt-0 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/your-username/portfolio-music"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-earth-moss hover:text-earth-forest hover:bg-muted/10 transition-colors ${isSidebarCollapsed ? 'justify-center' : ''
                    }`}
                >
                  <Github className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="text-sm">GitHub</span>}
                </a>
              </TooltipTrigger>
              {isSidebarCollapsed && (
                <TooltipContent side="right" className="bg-earth-moss">
                  <p>View Source on GitHub</p>
                </TooltipContent>
              )}
            </Tooltip>
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
